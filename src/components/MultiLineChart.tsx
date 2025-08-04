import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { type MultiSeriesData } from '../types/chart';

type MultiProps = {
  data: MultiSeriesData[];
};

export default function MultiLineChart({ data }: MultiProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const createLine = useCallback(
    (x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>) =>
      d3
        .line<[number, number | null]>()
        .defined(d => d[1] !== null)
        .x(d => x(d[0]))
        .y(d => y(d[1]!))
        .curve(d3.curveMonotoneX),
    []
  );

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

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const safeData = data.map(([t, v]) => [
      t,
      Array.isArray(v) ? v : [null, null, null],
    ]) as MultiSeriesData[];

    const series1 = safeData.map(([t, v]) => [t, v[0] ?? null] as [number, number | null]);
    const series2 = safeData.map(([t, v]) => [t, v[1] ?? null] as [number, number | null]);
    const series3 = safeData.map(([t, v]) => [t, v[2] ?? null] as [number, number | null]);

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
      .domain(d3.extent(safeData, d => d[0]) as [number, number])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(allValidValues, d => d[1]) ?? 0, d3.max(allValidValues, d => d[1]) ?? 1])
      .nice()
      .range([innerHeight, 0]);

    const lineGenerator = createLine(x, y);

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
        .attr('d', lineGenerator);
    });

    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('color', '#777');

    svg.append('g').call(d3.axisLeft(y).tickSizeOuter(0)).attr('color', '#777');
  }, [data, dimensions, createLine]);

  return <svg ref={ref} style={{ width: '100%', height: 'auto' }} />;
}
