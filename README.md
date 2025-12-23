
# M5Stack Gesture Sensor (PAJ7620U2)

Gesture recognition blocks and TypeScript APIs for the PAJ7620U2 sensor (I2C, address 0x73). Supports detecting up, down, left, right, forward, backward, clockwise, anti-clockwise, and wave.  
Ported from https://github.com/DFRobot/DFRobot_PAJ7620U2/blob/master/python/raspberrypi/DFRobot_PAJ7620U2.py
python library.

## Install as Extension

This repository can be added as an extension in MakeCode.

- Open the MakeCode editor for your board (e.g., micro:bit or Calliope mini)
- Create a new project
- Click the gear icon → **Extensions**
- Search for GitHub repository URL and import https://github.com/mwinkler/pxt-m5stack-unit-gesture

## Usage

Initialize the sensor once, then read gestures in a loop.

```ts
m5gesture.init()

m5gesture.onGestureChanged(function (gesture) {
    basic.showString(m5gesture.gestureName(gesture))
})
```

## Blocks

- Initialize: “initialize M5 Gesture”
- Read: “get gesture”
- Predicate: “gesture is …”
- Name: “name of gesture …”

## Hardware

- Sensor: PAJ7620U2 module
- Bus: I2C at address 0x73
- Power: 3.3V; connect SDA/SCL to your board’s I2C pins

## License

MIT


