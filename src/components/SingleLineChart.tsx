import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { type SingleSeriesData } from '../types/chart';

type Props = {
  data: SingleSeriesData[];
  width?: number;
  height?: number;
};

export default function SingleLineChart({ data, width = 500, height = 300 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const filteredData = data.filter(([, value]) => value !== null) as [number, number][];

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(ref.current).selectAll('*').remove();

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, d => d[0]) as [number, number])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(filteredData, d => d[1]) ?? 0, d3.max(filteredData, d => d[1]) ?? 1])
      .nice()
      .range([innerHeight, 0]);

    const line = d3
      .line<[number, number]>()
      .defined(d => d[1] !== null)
      .x(d => x(d[0]))
      .y(d => y(d[1]));

    svg
      .append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
}
