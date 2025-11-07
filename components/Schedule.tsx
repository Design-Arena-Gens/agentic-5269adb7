"use client";
import { useMemo, useState } from 'react';
import { Schedule, TrackerState } from '@/lib/types';
import { v4 as uuid } from 'uuid';
import { generateICS } from '@/lib/ics';

function getUpcomingFromSchedule(s: Schedule, count = 24) {
  if (!s.enabled) return [] as Date[];
  const start = new Date(s.startDateISO);
  const [hh, mm] = (s.timeOfDay ?? '09:00').split(':').map(Number);
  start.setHours(hh, mm ?? 0, 0, 0);
  const dates: Date[] = [];
  let cur = new Date(start);
  const now = new Date();
  while (dates.length < count) {
    if (cur >= now) dates.push(new Date(cur));
    cur = new Date(cur.getTime() + s.frequencyDays * 24 * 60 * 60 * 1000);
  }
  return dates;
}

export default function ScheduleSection({ state, setState }: { state: TrackerState; setState: (s: TrackerState) => void }) {
  const [start, setStart] = useState<string>(new Date().toISOString().slice(0, 16));
  const [freq, setFreq] = useState<string>('7');
  const [dose, setDose] = useState<string>('100');
  const [ester, setEster] = useState<string>('???????');
  const [time, setTime] = useState<string>('09:00');

  function addSchedule() {
    const item: Schedule = {
      id: uuid(),
      enabled: true,
      startDateISO: new Date(start).toISOString(),
      frequencyDays: Number(freq),
      doseMg: Number(dose),
      ester,
      timeOfDay: time,
    };
    setState({ ...state, schedules: [...state.schedules, item] });
  }

  function toggle(id: string) {
    setState({
      ...state,
      schedules: state.schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    });
  }

  function remove(id: string) {
    setState({ ...state, schedules: state.schedules.filter((s) => s.id !== id) });
  }

  const upcoming = useMemo(() => {
    return state.schedules.flatMap((s) => getUpcomingFromSchedule(s, 12).map((d) => ({ s, d })));
  }, [state.schedules]);

  function exportICS() {
    const events = upcoming.map(({ s, d }) => ({
      uid: `${s.id}-${d.getTime()}@tt`,
      start: d,
      title: `????????: ${s.doseMg} ?? ${s.ester}`,
      description: `???????? ?????? ${s.frequencyDays} ????`.
        concat(s.timeOfDay ? `, ????? ${s.timeOfDay}` : ''),
    }));
    const ics = generateICS(events);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testosterone_schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel">
      <h2>?????????? ????????</h2>
      <div className="row">
        <div className="col">
          <label>?????</label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="col">
          <label>????????????? (????)</label>
          <input type="number" value={freq} onChange={(e) => setFreq(e.target.value)} />
        </div>
        <div className="col">
          <label>???? (??)</label>
          <input type="number" value={dose} onChange={(e) => setDose(e.target.value)} />
        </div>
        <div className="col">
          <label>????</label>
          <input value={ester} onChange={(e) => setEster(e.target.value)} />
        </div>
        <div className="col">
          <label>????? (HH:MM)</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={addSchedule}>???????? ??????????</button>
        <button className="secondary" onClick={exportICS} disabled={upcoming.length === 0}>??????? ? ????????? (.ics)</button>
      </div>

      <hr />
      <table className="table">
        <thead>
          <tr>
            <th>???????</th>
            <th>??????</th>
            <th>????</th>
            <th>????</th>
            <th>?????</th>
            <th>????????</th>
          </tr>
        </thead>
        <tbody>
          {state.schedules.map((s) => (
            <tr key={s.id}>
              <td><input type="checkbox" checked={!!s.enabled} onChange={() => toggle(s.id)} /></td>
              <td>{s.frequencyDays} ??.</td>
              <td>{s.doseMg} ??</td>
              <td>{s.ester}</td>
              <td>{new Date(s.startDateISO).toLocaleString('ru-RU')}</td>
              <td><button className="ghost" onClick={() => remove(s.id)}>???????</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 16 }}>????????? ???????</h2>
      <ul>
        {upcoming.map(({ s, d }) => (
          <li key={`${s.id}-${d.toISOString()}`}>{d.toLocaleString('ru-RU')} ? {s.doseMg} ?? {s.ester}</li>
        ))}
      </ul>
    </div>
  );
}
