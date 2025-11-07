"use client";
import { useMemo } from 'react';
import { TrackerState } from '@/lib/types';
import { format } from 'date-fns';

export default function KPIs({ state }: { state: TrackerState }) {
  const lastMeasure = useMemo(() => {
    const sorted = [...state.measurements].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    return sorted[0];
  }, [state.measurements]);

  const lastInjection = useMemo(() => {
    const sorted = [...state.injections].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
    return sorted[0];
  }, [state.injections]);

  const avgValue = useMemo(() => {
    if (state.measurements.length === 0) return null;
    const unit = state.measurements[0]?.unit ?? 'nmol/L';
    const avg = state.measurements.reduce((s, m) => s + m.value, 0) / state.measurements.length;
    return { avg, unit };
  }, [state.measurements]);

  return (
    <div className="kpi">
      <div className="item">
        <div className="label">????????? ??????</div>
        <div className="value">{lastMeasure ? `${lastMeasure.value} ${lastMeasure.unit}` : '?'}</div>
        <div className="label">{lastMeasure ? format(new Date(lastMeasure.dateISO), 'dd.MM.yyyy HH:mm') : ''}</div>
      </div>
      <div className="item">
        <div className="label">????????? ????????</div>
        <div className="value">{lastInjection ? `${lastInjection.doseMg} ?? ${lastInjection.ester}` : '?'}</div>
        <div className="label">{lastInjection ? format(new Date(lastInjection.dateISO), 'dd.MM.yyyy HH:mm') : ''}</div>
      </div>
      <div className="item">
        <div className="label">??????? ???????</div>
        <div className="value">{avgValue ? `${avgValue.avg.toFixed(1)} ${avgValue.unit}` : '?'}</div>
      </div>
      <div className="item">
        <div className="label">????? ???????</div>
        <div className="value">{state.measurements.length + state.injections.length}</div>
      </div>
    </div>
  );
}
