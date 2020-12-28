This directory contains a `configuration.nix`.
It can be used to create a **livestick** containing everything needed for:
- programming the firmware with `platformio`
- running `c3pr-proxy` (systemd-unit)
- running `c3pr-ui` (systemd-unit)

For installation:
- use this repo as `/mnt/etc/nixos`
- adjust device names in `hardware-configuration-livestick.nix` (`boot.loader.grub.device` and `fileSystems`)
- run `nixos-install`
