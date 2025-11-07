"use client";
import { useMemo, useState } from 'react';
import { usePersistentState } from '@/lib/storage';
import { TrackerState } from '@/lib/types';
import KPIs from '@/components/KPIs';
import TrackerForms from '@/components/TrackerForms';
import MeasurementsChart from '@/components/MeasurementsChart';
import ScheduleSection from '@/components/Schedule';
import DataTables from '@/components/DataTables';
import ExportImport from '@/components/ExportImport';

function TabButton({ id, active, setActive, children }: any) {
  return (
    <div className={`tab ${active === id ? 'active' : ''}`} onClick={() => setActive(id)}>
      {children}
    </div>
  );
}

export default function Page() {
  const [state, setState] = usePersistentState();
  const [tab, setTab] = useState<'dashboard' | 'schedule' | 'history' | 'export'>('dashboard');

  const set = (next: TrackerState) => setState(next);

  const hasData = useMemo(() => state.measurements.length > 0 || state.injections.length > 0, [state]);

  return (
    <main>
      <h1>?????? ????????????</h1>
      <div className="tabs">
        <TabButton id="dashboard" active={tab} setActive={setTab}>?????</TabButton>
        <TabButton id="schedule" active={tab} setActive={setTab}>??????????</TabButton>
        <TabButton id="history" active={tab} setActive={setTab}>??????</TabButton>
        <TabButton id="export" active={tab} setActive={setTab}>???????</TabButton>
      </div>

      {tab === 'dashboard' && (
        <>
          <KPIs state={state} />
          <div style={{ height: 12 }} />
          <TrackerForms state={state} setState={set} />
          <div style={{ height: 12 }} />
          {hasData && <MeasurementsChart state={state} />}
        </>
      )}

      {tab === 'schedule' && (
        <>
          <ScheduleSection state={state} setState={set} />
        </>
      )}

      {tab === 'history' && (
        <>
          <DataTables state={state} setState={set} />
        </>
      )}

      {tab === 'export' && (
        <>
          <ExportImport state={state} setState={set} />
        </>
      )}
    </main>
  );
}
