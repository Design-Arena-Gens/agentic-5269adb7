"use client";
import { TrackerState } from '@/lib/types';

export default function ExportImport({ state, setState }: { state: TrackerState; setState: (s: TrackerState) => void }) {
  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testosterone_tracker.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(String(reader.result));
        if (next && typeof next === 'object') setState(next as TrackerState);
      } catch {}
    };
    reader.readAsText(file);
  }

  function clearAll() {
    if (!confirm('??????? ??? ???????')) return;
    setState({ measurements: [], injections: [], schedules: [] });
  }

  return (
    <div className="panel">
      <h2>??????? / ??????</h2>
      <div className="row">
        <div className="col" style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportJSON}>??????? JSON</button>
          <label className="ghost" htmlFor="jsonFile" style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer' }}>????????? JSON</label>
          <input id="jsonFile" type="file" accept="application/json" onChange={importJSON} style={{ display: 'none' }} />
          <button className="secondary" onClick={clearAll}>???????? ???</button>
        </div>
      </div>
    </div>
  );
}
