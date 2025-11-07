"use client";
import { TrackerState } from '@/lib/types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function MeasurementsChart({ state }: { state: TrackerState }) {
  const sorted = [...state.measurements].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const unit = sorted[0]?.unit ?? 'nmol/L';
  const data = {
    labels: sorted.map((m) => new Date(m.dateISO).toLocaleDateString('ru-RU')),
    datasets: [
      {
        label: `??????????? (${unit})`,
        data: sorted.map((m) => m.value),
        tension: 0.25,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true, labels: { color: '#e5e7eb' } } },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
    },
  } as const;

  return (
    <div className="panel">
      <h2>?????? ????????</h2>
      <div style={{ height: 300 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
