import { type SingleSeriesData } from '../types/chart';
import { useD3Chart } from '../hooks/useD3';

type SingleProps = {
  data: SingleSeriesData[];
  color?: string;
};

export default function SingleLineChart({ data, color = 'green' }: SingleProps) {
  const svgRef = useD3Chart({
    type: 'single',
    data,
    colors: [color],
  });

  return <svg ref={svgRef} style={{ width: '100%', height: 'auto' }} />;
}
