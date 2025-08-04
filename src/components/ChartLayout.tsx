import { type ChartDefinition, type SingleSeriesData, type MultiSeriesData } from '../types/chart';
import MultiLineChart from './MultiLineChart';
import SingleLineChart from './SingleLineChart';
import './styles/layout.css';

type Props = {
  chart: ChartDefinition;
};

export default function ChartLayout({ chart }: Props) {
  if (!chart.data?.length) return <p>No data available for this chart</p>;

  const isMultiSeries = Array.isArray(chart.data[0][1]);

  return (
    <div className="chart-container">
      <h2 className="chart-title">{chart.title}</h2>
      {isMultiSeries ? (
        <MultiLineChart data={chart.data as MultiSeriesData[]} />
      ) : (
        <SingleLineChart data={chart.data as SingleSeriesData[]} />
      )}
    </div>
  );
}
