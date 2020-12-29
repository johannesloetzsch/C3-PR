{ config, pkgs, ... }:

let
  pingbot = pkgs.python3.withPackages(ps : with ps; [ requests ]);
in
{
  system.stateVersion = "20.09";

  imports = [ ./hardware-configuration-livestick.nix ];

  nixpkgs.config.allowUnfree = true;
  hardware.enableAllFirmware = true;

  networking = {
    networkmanager.enable = true;
    firewall = {
      enable = true;
      allowedTCPPorts = [ 8080 ];
    };
  };
  services.openssh.enable = true;
  
  environment.systemPackages = with pkgs; [
    networkmanagerapplet
    wget vim tmux htop
    chromium firefox
    platformio git
    mitmproxy
    nodejs
  ];

  services.xserver = {
    enable = true;
    displayManager.sddm.enable = true;
    desktopManager.mate.enable = true;
    layout = "us";
  };
  i18n.defaultLocale = "de_DE.UTF-8";
  console = {
    font = "Lat2-Terminus16";
    keyMap = "de";
  };

  users.users.roboter = {
    isNormalUser = true;
    extraGroups = [ "wheel" "dialout" ];
  };

  systemd = {
    timers.dyndns-timer = {
      wantedBy = [ "timers.target" ];
      partOf = [ "dyndns-timer.service" ];
      timerConfig.OnCalendar = "minutely";
    };
    services.dyndns-timer = {
      serviceConfig.Type = "oneshot";
      script = ''
        [ -f /etc/nixos/dyndns.url ] && ${pkgs.curl}/bin/curl $(${pkgs.coreutils}/bin/cat /etc/nixos/dyndns.url)
      '';
    };

    services.mitmproxy = {
      wantedBy = [ "multi-user.target" ];
      serviceConfig.Type = "simple";
      serviceConfig = {
       StandardInput = "tty";
       StandardOutput = "tty";
       TTYPath = "/dev/tty10";
      };
      script = ''
        cd /etc/nixos/c3pr-proxy/
        /run/wrappers/bin/sudo -u roboter ${pkgs.mitmproxy}/bin/mitmproxy --mode reverse:http://ignored.example.com -s c3pr-selector.py --set block_global=false
      '';
    };

    services.c3pr-ui = {
      wantedBy = [ "multi-user.target" ];
      serviceConfig.Type = "simple";
      serviceConfig = {
       StandardInput = "tty";
       StandardOutput = "tty";
       TTYPath = "/dev/tty11";
      };
      script = ''
        cd /etc/nixos/c3pr-ui/
        #/run/wrappers/bin/sudo -u roboter ${pkgs.git}/bin/git pull
        PATH="$PATH:/bin/:${pkgs.nodejs}/bin/"
        /run/wrappers/bin/sudo -u roboter ${pkgs.nodejs}/bin/npm i
        /run/wrappers/bin/sudo -u roboter ${pkgs.nodejs}/bin/npm run build
        /run/wrappers/bin/sudo -u roboter ${pkgs.nodejs}/bin/npm run serve
      '';
    };

    services.pingbot = {
      wantedBy = [ "multi-user.target" ];
      serviceConfig.Type = "simple";
      serviceConfig = {
       StandardInput = "tty";
       StandardOutput = "tty";
       TTYPath = "/dev/tty12";
      };
      script = ''
        cd /etc/nixos/c3pr-proxy/
        PATH="$PATH:/run/wrappers/bin/"  ## path where to find ping
        /run/wrappers/bin/sudo -u roboter ${pingbot}/bin/python3 ping_bot.py 
      '';
    };
  };
}
