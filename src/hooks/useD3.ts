import { useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';

type ChartType = 'single' | 'multi';
type ChartData = [number, number | null][] | [number, (number | null)[]][];
type Scale = d3.ScaleLinear<number, number>;

interface UseD3ChartProps {
  type: ChartType;
  data: ChartData;
  colors?: string[];
  dimensions?: { width: number; height: number };
}

export const useD3Chart = ({
  type,
  data,
  colors = ['steelblue', 'green', 'red'],
  dimensions = { width: 800, height: 400 },
}: UseD3ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const createLine = useCallback(
    (x: Scale, y: Scale) =>
      d3
        .line<[number, number | null]>()
        .defined(d => d[1] !== null)
        .x(d => x(d[0]))
        .y(d => y(d[1]!))
        .curve(d3.curveMonotoneX),
    []
  );

  const renderChart = useCallback(() => {
    if (!svgRef.current || !data.length) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartGroup = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const flattenedData = data.flatMap(d => {
      const [x] = Array.isArray(d) ? d : [d, null];
      return x !== undefined ? [x] : [];
    });

    const xDomain = d3.extent(flattenedData) as [number, number];
    const xScale = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);

    const yValues = data
      .flatMap(d => (type === 'single' ? [d[1]] : (d[1] as number[])))
      .filter((val): val is number => val !== null);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(yValues) ?? 0, d3.max(yValues) ?? 1])
      .nice()
      .range([innerHeight, 0]);

    // رندر بر اساس نوع نمودار
    if (type === 'single') {
      const lineData = data as [number, number | null][];
      chartGroup
        .append('path')
        .datum(lineData)
        .attr('d', createLine(xScale, yScale))
        .attr('fill', 'none')
        .attr('stroke', colors[0])
        .attr('stroke-width', 2);
    } else {
      const multiData = data as [number, (number | null)[]][];
      multiData[0][1].forEach((_, idx) => {
        const series = multiData.map(([t, v]) => [t, v[idx]] as [number, number | null]);
        chartGroup
          .append('path')
          .datum(series)
          .attr('d', createLine(xScale, yScale))
          .attr('fill', 'none')
          .attr('stroke', colors[idx] ?? 'gray')
          .attr('stroke-width', 2);
      });
    }

    // اضافه کردن محورها
    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .attr('color', '#777');

    chartGroup.append('g').call(d3.axisLeft(yScale).tickSizeOuter(0)).attr('color', '#777');
  }, [data, type, colors, dimensions, createLine]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  return svgRef;
};
