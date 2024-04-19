import { EChartsOption } from 'echarts';
import _ from 'lodash-es';
export interface DATA {
  name: string;
  value: number;
  unit: string;
  type: string;
  xAxisName: string;
  stackedName: string;
}
export default function toBarLine(data: DATA[]): EChartsOption {
  let options: EChartsOption = {

  }
  if (_.isEmpty(data)) {
    return options
  }
  // x 轴数据
  const xAxisNames = _.uniqBy(data, 'xAxisName').map(
    (item) => `${item['xAxisName']}`,
  );
  // 数据分类
  const names = _.uniqBy(data, 'name');

  // echart 类型
  const types = _.uniqBy(data, 'type').map((item, i) => ({
    ...item,
    yIndex: i,
  }));

  const units = _.uniqBy(data, 'unit')
    .map((item, i) => ({
      ...item,
      yIndex: i,
    }))
    .filter((item) => item['unit']);

  // y 轴设置
  const yAxis = !_.isEmpty(units)
    ? units.map((item) => ({
      type: 'value',
      name: item.unit === '-' ? '' : item.unit,
      scale: true,
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          show: true,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          show: true,
          type: 'dashed',
        },
      },


    }))
    : {};

  const series = names.map((item) => {
    const currentType = _.find(types, ['type', item.type]);
    const json: any = {
      name: item['name'],
      type: item.type,
      yAxisIndex: currentType?.yIndex,
      data:
        _.filter(data, ['name', item.name]).map((a) => ({
          name: a['name'],
          value: ['' + a['xAxisName'], a['value']],
          unit: a['unit'],
        })),
    };
    if (item.type === 'bar' && item.stackedName) {
      json.stack = item.stackedName
    }
    return json;
  });

  options = {

    xAxis: {
      type: 'category',
      data: xAxisNames,

    },
    legend: {

      show: true,
      type: 'scroll',
    },

    yAxis,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      confine: true,
      formatter: function (params: any) {
        let toolTip = '';
        if (params !== null && params.length) {
          params.map((item: any) => {
            toolTip += `${item.marker} ${item.seriesName} : 
                <span style="font-weight:bold"> ${item.value[1] ?? '--'
              }</span>     
                ${item.data.unit}<br/>`;
            return item;
          });
          return `${params[0].axisValue}<br/>${toolTip}`;
        }
        return toolTip;
      },
    },


    series,
  };

  return options
}