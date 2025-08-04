import { type MultiSeriesData } from '../types/chart';
import { useD3Chart } from '../hooks/useD3';

type MultiProps = {
  data: MultiSeriesData[];
};

export default function MultiLineChart({ data }: MultiProps) {
  const svgRef = useD3Chart({
    type: 'multi',
    data,
    colors: ['blue', 'green', 'red'],
  });

  return <svg ref={svgRef} style={{ width: '100%', height: 'auto' }} />;
}
