# Circadian

Compare sunrise and sunset times across cities around the globe.

Circadian is a client-side React app that displays stacked horizontal timelines showing daylight hours for multiple cities. Drag the work-hour markers to visualize overlap, slide through the calendar to see how daylight shifts across the year, and toggle between DST, standard time, or automatic detection.

## Features

- Stacked daylight timelines for any number of cities
- Day-of-year slider to explore seasonal changes
- Draggable work-hour markers (default 9 AM – 5 PM)
- DST / Standard / Auto toggle
- All times shown in each city's local time
- Pure client-side — no backend required

## Quick Start

```bash
make dev
```

Requires [Bun](https://bun.sh).

## Build

```bash
make build
```

Output goes to `web/dist/`.

## License

[MIT](LICENSE)
