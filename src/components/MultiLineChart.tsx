import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { type MultiSeriesData } from '../types/chart';

type Props = {
  data: MultiSeriesData[];
  width?: number;
  height?: number;
};

export default function MultiLineChart({ data, width = 500, height = 300 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const series1 = data.map(([t, v]) => [t, v[0]] as [number, number | null]);
    const series2 = data.map(([t, v]) => [t, v[1]] as [number, number | null]);
    const series3 = data.map(([t, v]) => [t, v[2]] as [number, number | null]);

    const allValidValues = [...series1, ...series2, ...series3].filter(d => d[1] !== null) as [
      number,
      number
    ][];

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d[0]) as [number, number])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(allValidValues, d => d[1]) ?? 0, d3.max(allValidValues, d => d[1]) ?? 1])
      .nice()
      .range([innerHeight, 0]);

    const createLine = (series: [number, number | null][]) =>
      d3
        .line<[number, number | null]>()
        .defined(d => d[1] !== null)
        .x(d => x(d[0]))
        .y(d => y(d[1]!));

    const lines = [
      { color: 'blue', data: series1 },
      { color: 'green', data: series2 },
      { color: 'red', data: series3 },
    ];

    lines.forEach(line => {
      svg
        .append('path')
        .datum(line.data)
        .attr('fill', 'none')
        .attr('stroke', line.color)
        .attr('stroke-width', 2)
        .attr('d', createLine(line.data));
    });

    svg.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
}
