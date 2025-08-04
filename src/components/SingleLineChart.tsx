import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { type SingleSeriesData } from '../types/chart';

type SingleProps = {
  data: SingleSeriesData[];
  color?: string;
};

export default function SingleLineChart({ data, color = 'steelblue' }: SingleProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const updateDimensions = useCallback(() => {
    if (!ref.current?.parentElement) return;
    const { width } = ref.current.parentElement.getBoundingClientRect();
    setDimensions({
      width: Math.min(width, 800),
      height: 400,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    if (!ref.current || !data.length) return;

    const filteredData = data.filter(([, value]) => value !== null) as [number, number][];
    if (!filteredData.length) return;

    const { width, height } = dimensions;
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
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('color', '#777');

    svg.append('g').call(d3.axisLeft(y).tickSizeOuter(0)).attr('color', '#777');
  }, [data, dimensions, color]);

  return <svg ref={ref} style={{ width: '100%', height: 'auto' }} />;
}
