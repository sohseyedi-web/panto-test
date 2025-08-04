import { type ChartDefinition, type SingleSeriesData, type MultiSeriesData } from '../types/chart';
import MultiLineChart from './MultiLineChart';
import SingleLineChart from './SingleLineChart';

type Props = {
  chart: ChartDefinition;
};

export default function ChartRenderer({ chart }: Props) {
  const isMultiSeries = Array.isArray(chart.data[0][1]);

  return (
    <div>
      <h2>{chart.title}</h2>
      {isMultiSeries ? (
        <MultiLineChart data={chart.data as MultiSeriesData[]} />
      ) : (
        <SingleLineChart data={chart.data as SingleSeriesData[]} />
      )}
    </div>
  );
}
