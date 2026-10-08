# fl-echarts

**Reusable Apache ECharts option builders for bar, line, stacked bar, and word cloud charts.**

[![npm version](https://img.shields.io/npm/v/%40fullsize%2Fecharts)](https://www.npmjs.com/package/@fullsize/echarts)
[![CI](https://github.com/Fullsize/fl-echarts/actions/workflows/ci.yml/badge.svg)](https://github.com/Fullsize/fl-echarts/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-declarations-blue)](./src/index.ts)

**English** | [简体中文](./README.zh-CN.md)

`@fullsize/echarts` converts flat data records into ECharts options, so you can build common dashboard charts without repeating series grouping, axis configuration, legends, and tooltips. It returns configuration objects rather than rendering charts: you keep control of the ECharts instance, framework integration, and final appearance.

## Contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Chart examples](#chart-examples)
- [API reference](#api-reference)
- [Behavior and limitations](#behavior-and-limitations)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Bar and line charts** — group records by series name and build a category axis.
- **Mixed bar/line charts** — combine chart types with value axes and unit labels.
- **Stacked bars** — assign bar series to named stack groups.
- **Word clouds** — generate options with a configurable color palette.
- **Ready-to-use defaults** — scrolling legends and unit-aware tooltips for bar/line charts.
- **TypeScript declarations** — option builders with typed data inputs.
- **Framework-independent** — use the returned options wherever you use ECharts.

## Installation

```bash
npm install @fullsize/echarts echarts lodash-es
```

`lodash-es` is a peer dependency. Install ECharts in your application to render charts; the current source uses ECharts 5.5 types during development. Browser bundlers with ES module support are the recommended way to consume this package.

For word clouds, also install the ECharts extension:

```bash
npm install echarts-wordcloud
```

## Quick start

Create a container with an explicit size:

```html
<div id="chart" style="width: 100%; height: 400px;"></div>
```

Then initialize ECharts and pass in the generated options:

```ts
import * as echarts from 'echarts';
import { toBarLine } from '@fullsize/echarts';

const data = [
  { name: 'Revenue', value: 120, unit: 'USD', type: 'bar', xAxisName: 'Jan' },
  { name: 'Revenue', value: 180, unit: 'USD', type: 'bar', xAxisName: 'Feb' },
  { name: 'Revenue', value: 150, unit: 'USD', type: 'bar', xAxisName: 'Mar' },
];

const container = document.getElementById('chart');
if (!container) throw new Error('Chart container not found');

const chart = echarts.init(container);
const option = toBarLine(data);

chart.setOption({
  ...option,
  title: { text: 'Monthly revenue' },
  grid: { left: 48, right: 32, bottom: 48, containLabel: true },
});

// Call chart.resize() when the container size changes.
// Call chart.dispose() when the chart is no longer needed.
```

## Chart examples

### Mixed bar and line chart

```ts
import { toBarLine } from '@fullsize/echarts';

const option = toBarLine([
  { name: 'Revenue', value: 120, unit: 'USD', type: 'bar', xAxisName: 'Jan' },
  { name: 'Revenue', value: 180, unit: 'USD', type: 'bar', xAxisName: 'Feb' },
  { name: 'Conversion', value: 3.2, unit: '%', type: 'line', xAxisName: 'Jan' },
  { name: 'Conversion', value: 4.1, unit: '%', type: 'line', xAxisName: 'Feb' },
]);

chart.setOption(option);
```

Use the same first-seen order for chart types and units in mixed charts. See [Behavior and limitations](#behavior-and-limitations) for the current axis mapping rules.

### Stacked bar chart

Bar series with the same `stackedName` share a stack:

```ts
import { toStackedBar } from '@fullsize/echarts';

const option = toStackedBar([
  { name: 'Desktop', value: 80, unit: 'visits', type: 'bar', xAxisName: 'Jan', stackedName: 'traffic' },
  { name: 'Desktop', value: 95, unit: 'visits', type: 'bar', xAxisName: 'Feb', stackedName: 'traffic' },
  { name: 'Mobile', value: 60, unit: 'visits', type: 'bar', xAxisName: 'Jan', stackedName: 'traffic' },
  { name: 'Mobile', value: 75, unit: 'visits', type: 'bar', xAxisName: 'Feb', stackedName: 'traffic' },
]);

chart.setOption(option);
```

### Word cloud

Register the extension before rendering. This example uses a chart instance initialized with the full `echarts` import, as in the quick start.

```ts
import 'echarts-wordcloud';
import { toWordCloud } from '@fullsize/echarts';

const option = toWordCloud(
  [
    { name: 'TypeScript', value: 100, unit: 'mentions' },
    { name: 'ECharts', value: 80, unit: 'mentions' },
    { name: 'Dashboard', value: 60, unit: 'mentions' },
  ],
  ['#5470c6', '#91cc75', '#fac858'],
);

chart.setOption(option);
```

The package generates word cloud options; it does **not** include or register `echarts-wordcloud`.

## API reference

The package root exports three functions:

```ts
import { toBarLine, toStackedBar, toWordCloud } from '@fullsize/echarts';
```

### `toBarLine(data)`

Returns an `EChartsOption` for bar, line, or mixed bar/line data.

| Record field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Series name; records with the same name are grouped together. |
| `value` | `number` | Numeric data value. |
| `unit` | `string` | Value axis label and tooltip unit. Use `'-'` for a blank axis label. |
| `type` | `string` | ECharts series type; intended here for `'bar'` or `'line'`. |
| `xAxisName` | `string` | Category label on the x-axis. |

### `toStackedBar(data)`

Returns an `EChartsOption` using the same fields as `toBarLine`, plus:

| Record field | Type | Description |
| --- | --- | --- |
| `stackedName` | `string` | Stack group. Applied only to bar series when non-empty. |

Use `stackedName: ''` for an unstacked series. Line series are also accepted, but do not receive a `stack` value.

### `toWordCloud(data, colors?)`

Returns an `EChartsOption` for the `wordCloud` extension.

| Record field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Word to display. |
| `value` | `number` | Weight used to size the word. |
| `unit` | `string` | Tooltip suffix; use `''` when no unit is needed. |

`colors` is an optional `string[]`. Omitting it uses the built-in palette. Words are horizontal, with a font weight of `600`; colors are selected randomly.

## Behavior and limitations

- All three functions return `{}` for an empty input array. This does not clear an existing chart by itself; manage chart reset or replacement in your application.
- Categories and series preserve their first-seen order. Records within a series preserve input order; no sorting, aggregation, or missing-value filling is performed.
- Keep `type`, `unit`, and `stackedName` consistent within each named series. Series settings are taken from its first record.
- **Axis mapping:** value axes are created from unique non-empty units, while `yAxisIndex` is assigned by unique chart type. These are not independently matched by unit. For mixed charts, keep type and unit ordering aligned; multiple units with the same chart type require manual axis overrides.
- An empty `unit` can leave no explicit value axis configuration. Prefer `'-'` when you need an unlabeled value axis.
- Tooltip formatters build HTML from input labels and units without escaping. Use trusted or appropriately sanitized input.
- With the current word cloud color selection, a multi-color palette's last entry is not selected. Use a non-empty palette; color selection is not deterministic.
- ECharts initialization, extension registration, resize handling, disposal, themes, and accessibility settings remain your application's responsibility.
- ESM and UMD builds are configured, but `lodash-es` remains external. Do not assume the UMD entry works with plain Node.js `require()` without compatible dependency handling.

## Development

```bash
git clone https://github.com/Fullsize/fl-echarts.git
cd fl-echarts
npm install
npm run build
```

The Rollup build writes bundles and TypeScript declarations to `lib/`. Source entry points are in [`src/index.ts`](./src/index.ts).

The CI workflow runs the build. There is currently no separate automated test suite.

## Contributing

[Open an issue](https://github.com/Fullsize/fl-echarts/issues) for bugs or feature requests. For bugs, include a minimal input dataset, the generated options, and your ECharts and package versions.

Pull requests are welcome for review. Keep changes focused, update both README languages when behavior changes, and run `npm run build` before submitting. Adding test coverage for grouping, axis mapping, and empty inputs is especially useful.

## License

The current [`package.json`](./package.json) declares **`UNLICENSED`**, and this repository does not include a license file. No open-source license is currently granted; contact the maintainer about usage or redistribution permissions.
