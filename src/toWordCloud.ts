import { EChartsOption } from 'echarts';
import { isEmpty } from 'lodash-es';
export interface DATA {
  name: string;
  value: number;
  unit: string;
}
export default function toWordCloud(data: DATA[], colors: string[] = ['#fe9a8bb3', '#fe9a8bb3', '#fe9a8b03', '#9E87FFb3', '#9E87FFb3', '#9E87FFb3', '#fe9a8bb3', '#fe9a8bb3', '#fe9a8bb3', '#73DDFF', '#58D5FF']) {
  let options: EChartsOption = {};
  if (isEmpty(data)) {
    return options;
  }
  const series: any[] = [
    {
      type: 'wordCloud',
      textStyle: {
        fontWeight: 600,
        color: function () {
          return colors[
            parseInt((Math.random() * (colors.length - 1)).toString())
          ];
        },
      },
      width: '100%',
      height: '100%',
      gridSize: 1,
      rotationRange: [0, 0],
      emphasis: {
        focus: 'none',
      },
      data,
    },
  ];
  options = {
    tooltip: {
      show: true,
      formatter: function (params: any) {
        return (
          params.name +
          '<br/>' +
          params.marker +
          params.data.value +
          (params.data.unit || '')
        );
      },
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },

    series,
  };
  return options;
}
