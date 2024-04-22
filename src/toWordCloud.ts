import { EChartsOption } from 'echarts';
import { isEmpty } from 'lodash-es';
export interface DATA {
  name: string;
  value: number;
  unit: string;
}
export default function toWordCloud(data: DATA[]) {
  let options: EChartsOption = {

  }
  if (isEmpty(data)) {
    return options
  }
  const series: any[] = [
    {
      type: "wordCloud",

      textStyle: {
        fontWeight: 600,

      },
      emphasis: {
        focus: "none",
      },
      data,
    },
  ]
  options = {
    tooltip: {
      show: true,
      formatter: function (params: any) {
        return (
          params.name +
          "<br/>" +
          params.marker +
          params.data.originValue +
          (params.data.unit || "")
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
  }
  return options
}