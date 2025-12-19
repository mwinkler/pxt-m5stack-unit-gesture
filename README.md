
# PAJ7620U2 Gesture Sensor (MakeCode)

Gesture recognition blocks and TypeScript APIs for the PAJ7620U2 sensor (I2C, address 0x73). Supports detecting up, down, left, right, forward, backward, clockwise, anti-clockwise, and wave.  
Ported from 'DFRobot_PAJ7620U2' python library.

## Install as Extension

This repository can be added as an extension in MakeCode.

- Open the MakeCode editor for your board (e.g., micro:bit or Calliope mini)
- Create a new project
- Click the gear icon → **Extensions**
- Search for your GitHub repository URL and import (replace with your repo URL when published)

## Usage

Initialize the sensor once, then read gestures in a loop.

```ts
PAJ7620U2.init()
PAJ7620U2.setGestureHighRate(true)

basic.forever(() => {
		const g = PAJ7620U2.getGesture()
		if (g != PAJ7620U2.Gesture.None) {
				basic.showString(PAJ7620U2.gestureName(g))
		}
		basic.pause(200)
})
```

## Blocks

- Initialize: “initialize PAJ7620U2”
- Mode: “set gesture mode high rate”
- Read: “get gesture”
- Predicate: “gesture is …”
- Name: “name of gesture …”

## Hardware

- Sensor: PAJ7620U2 module
- Bus: I2C at address 0x73
- Power: 3.3V; connect SDA/SCL to your board’s I2C pins

## Targets

- micro:bit
- Calliope mini

## License

MIT

---

If you publish this repository to GitHub Pages, you can embed the blocks view on the project page:

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
	makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
	// Replace with your GitHub org/repo once published.
</script>
