import { EChartsOption } from 'echarts';
import _ from 'lodash'
export default function toBarLine(data: {
  name: string;
  value: number;
  unit: string;
  type: string;
  xAxisName: string;
}[]): EChartsOption {
  let options: EChartsOption = {

  }
  if (_.isEmpty(data)) {
    return options
  }
  // x 轴数据
  const xAxisData: any = _.uniqBy(data, 'xAxisName').map(
    (item: any) => `${item['xAxisName']}`,
  );
  // 数据名称
  const names = _.uniqBy(data, 'name');
  // echart 类型
  const types = _.uniqBy(data, 'type').map((item, i) => ({
    ...item,
    yIndex: i,
  }));
  // 单位 根据单位分y轴
  const units = _.uniqBy(data, 'unit').map((item, i) => ({
    ...item,
    yIndex: i,
  })).filter((item: any) => item?.['unit']);;
  const series: any[] = types.map((item) => {
    const currentType = _.find(types, ['type', item.type]);
    const json = {
      name: item.name,
      type: item.type,
      yAxisIndex: currentType?.yIndex,
      data: _.filter(data, ['name', item.name]).map((item) => ({
        name: item.name,
        value: ['' + item.xAxisName, item.value],
        unit: item.unit,
      }))
    }
    return json
  })
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
  options = {
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      confine: true,
    },

  }

  options.series = series

  return options
}