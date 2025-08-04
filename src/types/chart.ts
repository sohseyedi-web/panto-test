export type SingleSeriesData = [number, number | null];
export type MultiSeriesData = [number, [number | null, number | null, number | null]];

export interface ChartDefinition {
  title: string;
  data: Array<SingleSeriesData | MultiSeriesData>;
}
