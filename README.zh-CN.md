# fl-echarts

**为 Apache ECharts 提供柱状图、折线图、堆叠柱状图和词云的配置生成函数。**

[![npm version](https://img.shields.io/npm/v/%40fullsize%2Fecharts)](https://www.npmjs.com/package/@fullsize/echarts)
[![CI](https://github.com/Fullsize/fl-echarts/actions/workflows/ci.yml/badge.svg)](https://github.com/Fullsize/fl-echarts/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-declarations-blue)](./src/index.ts)

[English](./README.md) | **简体中文**

`@fullsize/echarts` 将扁平数据记录转换为 ECharts 配置，减少业务看板中重复的系列分组、坐标轴、图例和提示框代码。它只生成配置对象，不负责渲染：ECharts 实例、框架集成和最终样式仍由你的应用控制。

## 目录

- [功能特性](#功能特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [图表示例](#图表示例)
- [API 参考](#api-参考)
- [行为与限制](#行为与限制)
- [本地开发](#本地开发)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 功能特性

- **柱状图与折线图**：按系列名称分组，自动生成类目轴。
- **柱线混合图**：组合图表类型，生成数值轴和单位标签。
- **堆叠柱状图**：通过堆叠名称指定柱状系列的堆叠分组。
- **词云**：生成词云配置，支持传入颜色列表。
- **常用默认配置**：柱线图自带滚动图例和展示单位的提示框。
- **TypeScript 类型声明**：为配置生成函数提供输入类型。
- **不绑定框架**：在使用 ECharts 的地方使用生成的配置。

## 安装

```bash
npm install @fullsize/echarts echarts lodash-es
```

`lodash-es` 是 peer dependency。应用需要自行安装 ECharts 来渲染图表；当前源码开发时使用 ECharts 5.5 的类型。推荐通过支持 ES Modules 的浏览器构建工具使用本包。

使用词云时，还需要安装 ECharts 扩展：

```bash
npm install echarts-wordcloud
```

## 快速开始

先创建具有明确尺寸的容器：

```html
<div id="chart" style="width: 100%; height: 400px;"></div>
```

初始化 ECharts，传入生成的配置：

```ts
import * as echarts from 'echarts';
import { toBarLine } from '@fullsize/echarts';

const data = [
  { name: '收入', value: 120, unit: '元', type: 'bar', xAxisName: '1月' },
  { name: '收入', value: 180, unit: '元', type: 'bar', xAxisName: '2月' },
  { name: '收入', value: 150, unit: '元', type: 'bar', xAxisName: '3月' },
];

const container = document.getElementById('chart');
if (!container) throw new Error('找不到图表容器');

const chart = echarts.init(container);
const option = toBarLine(data);

chart.setOption({
  ...option,
  title: { text: '月度收入' },
  grid: { left: 48, right: 32, bottom: 48, containLabel: true },
});

// 容器尺寸变化时调用 chart.resize()。
// 不再使用图表时调用 chart.dispose()。
```

## 图表示例

### 柱线混合图

```ts
import { toBarLine } from '@fullsize/echarts';

const option = toBarLine([
  { name: '收入', value: 120, unit: '元', type: 'bar', xAxisName: '1月' },
  { name: '收入', value: 180, unit: '元', type: 'bar', xAxisName: '2月' },
  { name: '转化率', value: 3.2, unit: '%', type: 'line', xAxisName: '1月' },
  { name: '转化率', value: 4.1, unit: '%', type: 'line', xAxisName: '2月' },
]);

chart.setOption(option);
```

混合图中，图表类型与单位首次出现的顺序应保持一致。当前坐标轴映射规则见[行为与限制](#行为与限制)。

### 堆叠柱状图

具有相同 `stackedName` 的柱状系列归入同一堆叠组：

```ts
import { toStackedBar } from '@fullsize/echarts';

const option = toStackedBar([
  { name: '桌面端', value: 80, unit: '次', type: 'bar', xAxisName: '1月', stackedName: 'traffic' },
  { name: '桌面端', value: 95, unit: '次', type: 'bar', xAxisName: '2月', stackedName: 'traffic' },
  { name: '移动端', value: 60, unit: '次', type: 'bar', xAxisName: '1月', stackedName: 'traffic' },
  { name: '移动端', value: 75, unit: '次', type: 'bar', xAxisName: '2月', stackedName: 'traffic' },
]);

chart.setOption(option);
```

### 词云

渲染前需要注册扩展。此示例沿用快速开始中通过完整 `echarts` 导入初始化的实例。

```ts
import 'echarts-wordcloud';
import { toWordCloud } from '@fullsize/echarts';

const option = toWordCloud(
  [
    { name: 'TypeScript', value: 100, unit: '次提及' },
    { name: 'ECharts', value: 80, unit: '次提及' },
    { name: 'Dashboard', value: 60, unit: '次提及' },
  ],
  ['#5470c6', '#91cc75', '#fac858'],
);

chart.setOption(option);
```

本包只生成词云配置，**不包含也不会自动注册** `echarts-wordcloud`。

## API 参考

包的根入口导出三个函数：

```ts
import { toBarLine, toStackedBar, toWordCloud } from '@fullsize/echarts';
```

### `toBarLine(data)`

返回适用于柱状图、折线图或柱线混合图的 `EChartsOption`。

| 数据字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 系列名称；相同名称的记录归为一个系列。 |
| `value` | `number` | 数值。 |
| `unit` | `string` | 数值轴名称及提示框单位；使用 `'-'` 隐藏轴名称。 |
| `type` | `string` | ECharts 系列类型；这里主要用于 `'bar'` 或 `'line'`。 |
| `xAxisName` | `string` | x 轴类目名称。 |

### `toStackedBar(data)`

返回 `EChartsOption`。数据字段与 `toBarLine` 相同，另外需要：

| 数据字段 | 类型 | 说明 |
| --- | --- | --- |
| `stackedName` | `string` | 堆叠组名称；仅对柱状系列生效，且需为非空字符串。 |

不需要堆叠的系列可使用 `stackedName: ''`。也可以传入折线系列，但不会为其设置 `stack`。

### `toWordCloud(data, colors?)`

返回用于 `wordCloud` 扩展的 `EChartsOption`。

| 数据字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 展示的词语。 |
| `value` | `number` | 决定词语大小的权重。 |
| `unit` | `string` | 提示框数值后缀；不需要单位时使用 `''`。 |

`colors` 为可选的 `string[]`，省略时使用内置配色。词语保持水平，字重为 `600`，颜色随机选择。

## 行为与限制

- 三个函数在输入空数组时均返回 `{}`。这不会自动清空已有图表，重置或替换配置需由应用处理。
- 类目和系列保持首次出现的顺序；系列内部保留输入顺序，不进行排序、聚合或缺失值补全。
- 同一命名系列内的 `type`、`unit` 和 `stackedName` 应保持一致，系列配置取自该系列的第一条记录。
- **坐标轴映射**：数值轴根据非空单位去重生成，`yAxisIndex` 则根据图表类型去重分配，并不是按单位独立匹配。混合图需保证类型和单位顺序一致；同一图表类型使用多个单位时，需要手动覆盖坐标轴映射。
- 空的 `unit` 可能导致没有显式的数值轴配置。如果只是不需要轴名称，建议使用 `'-'`。
- 提示框直接将输入标签和单位拼接成 HTML，未做转义。请使用可信或已进行适当安全处理的数据。
- 当前词云颜色选择逻辑不会选中多色列表的最后一项。请传入非空颜色列表；配色结果不固定。
- ECharts 初始化、扩展注册、尺寸变化处理、实例销毁、主题和无障碍设置均由应用负责。
- 构建配置包含 ESM 和 UMD，但 `lodash-es` 仍为外部依赖。不要假设 UMD 入口无需兼容性处理即可在普通 Node.js 中通过 `require()` 使用。

## 本地开发

```bash
git clone https://github.com/Fullsize/fl-echarts.git
cd fl-echarts
npm install
npm run build
```

Rollup 构建会将产物和 TypeScript 类型声明写入 `lib/`。源码入口位于 [`src/index.ts`](./src/index.ts)。

CI 工作流执行构建，目前没有独立的自动化测试套件。

## 参与贡献

欢迎通过 [Issue](https://github.com/Fullsize/fl-echarts/issues) 反馈问题或提出功能建议。报告问题时，请提供最小输入数据、生成的配置，以及 ECharts 和本包的版本。

欢迎提交 Pull Request 供审阅。请让改动聚焦于具体问题；行为发生变化时同步更新中英文 README，并在提交前运行 `npm run build`。系列分组、坐标轴映射和空输入的测试覆盖尤其有帮助。

## 许可证

当前 [`package.json`](./package.json) 声明为 **`UNLICENSED`**，仓库中也没有许可证文件。目前未授予开源许可；使用或再分发权限请联系维护者确认。
