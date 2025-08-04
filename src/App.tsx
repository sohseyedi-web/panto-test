import { useEffect, useState } from 'react';
import ChartRenderer from './components/ChartLayout';
import { type ChartDefinition } from './types/chart';
import chartData from './data/data.json';

function App() {
  const [charts, setCharts] = useState<ChartDefinition[]>([]);

  useEffect(() => {
    setCharts(chartData as ChartDefinition[]);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      {charts.map((chart, idx) => (
        <ChartRenderer key={idx} chart={chart} />
      ))}
    </div>
  );
}

export default App;
