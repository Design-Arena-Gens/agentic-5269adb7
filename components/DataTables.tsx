"use client";
import { TrackerState } from '@/lib/types';

export default function DataTables({ state, setState }: { state: TrackerState; setState: (s: TrackerState) => void }) {
  function removeMeasurement(id: string) {
    setState({ ...state, measurements: state.measurements.filter((m) => m.id !== id) });
  }
  function removeInjection(id: string) {
    setState({ ...state, injections: state.injections.filter((m) => m.id !== id) });
  }

  return (
    <div className="row">
      <div className="col">
        <div className="panel">
          <h2>???????</h2>
          <table className="table">
            <thead>
              <tr>
                <th>????</th>
                <th>????????</th>
                <th>???????</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.measurements
                .slice()
                .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
                .map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.dateISO).toLocaleString('ru-RU')}</td>
                    <td>{m.value} {m.unit}</td>
                    <td>{m.note}</td>
                    <td><button className="ghost" onClick={() => removeMeasurement(m.id)}>???????</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <h2>????????</h2>
          <table className="table">
            <thead>
              <tr>
                <th>????</th>
                <th>????</th>
                <th>????</th>
                <th>?????</th>
                <th>???????</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.injections
                .slice()
                .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
                .map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.dateISO).toLocaleString('ru-RU')}</td>
                    <td>{m.doseMg} ??</td>
                    <td>{m.ester}</td>
                    <td>{m.site}</td>
                    <td>{m.note}</td>
                    <td><button className="ghost" onClick={() => removeInjection(m.id)}>???????</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
