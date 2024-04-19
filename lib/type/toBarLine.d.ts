import { EChartsOption } from 'echarts';
export default function toBarLine(data: {
    name: string;
    value: number;
    unit: string;
    type: string;
    xAxisName: string;
}[]): EChartsOption;
