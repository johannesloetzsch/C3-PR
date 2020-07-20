// Pin and PWM definitions for robot peripherals (actuators, LEDs, ...)

// TB6612FNG with 
// GPIO 12 - PWM A left motor
// GPIO 13 - PWM B right motor
// GPIO 14 - DIR A 
// GPIO 15 - DIR B

#define MOTOR_L_PWM_PIN  12
#define MOTOR_R_PWM_PIN  2
#define MOTOR_L_DIR_PIN  13
#define MOTOR_R_DIR_PIN  14

#define MOTOR_L_PWM_CHAN 3
#define MOTOR_R_PWM_CHAN 4
// PWM resolution
#define MOTOR_PWM_RES_BIT 10
// PWM frequency
#define MOTOR_PWM_FREQ_HZ 10000
