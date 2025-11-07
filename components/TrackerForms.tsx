"use client";
import { useState } from 'react';
import { Injection, Measurement, TrackerState, Unit } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export default function TrackerForms({
  state,
  setState,
}: {
  state: TrackerState;
  setState: (next: TrackerState) => void;
}) {
  const [mDate, setMDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [mValue, setMValue] = useState<string>('');
  const [mUnit, setMUnit] = useState<Unit>('nmol/L');
  const [mNote, setMNote] = useState<string>('');

  const [iDate, setIDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [iDose, setIDose] = useState<string>('');
  const [iEster, setIEster] = useState<string>('???????');
  const [iSite, setISite] = useState<string>('');
  const [iNote, setINote] = useState<string>('');

  function addMeasurement() {
    if (!mValue) return;
    const item: Measurement = {
      id: uuid(),
      dateISO: new Date(mDate).toISOString(),
      value: Number(mValue),
      unit: mUnit,
      note: mNote || undefined,
    };
    setState({ ...state, measurements: [...state.measurements, item] });
    setMNote('');
  }

  function addInjection() {
    if (!iDose) return;
    const item: Injection = {
      id: uuid(),
      dateISO: new Date(iDate).toISOString(),
      doseMg: Number(iDose),
      ester: iEster,
      site: iSite || undefined,
      note: iNote || undefined,
    };
    setState({ ...state, injections: [...state.injections, item] });
    setINote('');
  }

  return (
    <div className="row">
      <div className="col">
        <div className="panel">
          <h2>???????? ??????</h2>
          <div className="row">
            <div className="col">
              <label>???? ? ?????</label>
              <input type="datetime-local" value={mDate} onChange={(e) => setMDate(e.target.value)} />
            </div>
            <div className="col">
              <label>????????</label>
              <input type="number" step="0.1" placeholder="????. 18.5" value={mValue} onChange={(e) => setMValue(e.target.value)} />
            </div>
            <div className="col">
              <label>???????</label>
              <select value={mUnit} onChange={(e) => setMUnit(e.target.value as Unit)}>
                <option value="nmol/L">nmol/L</option>
                <option value="ng/dL">ng/dL</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>???????</label>
              <input placeholder="????? 5 ???? ?? ????????" value={mNote} onChange={(e) => setMNote(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={addMeasurement}>????????? ??????</button>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <h2>???????? ????????</h2>
          <div className="row">
            <div className="col">
              <label>???? ? ?????</label>
              <input type="datetime-local" value={iDate} onChange={(e) => setIDate(e.target.value)} />
            </div>
            <div className="col">
              <label>???? (??)</label>
              <input type="number" step="1" placeholder="????. 100" value={iDose} onChange={(e) => setIDose(e.target.value)} />
            </div>
            <div className="col">
              <label>????</label>
              <input placeholder="???????/????????/?????????" value={iEster} onChange={(e) => setIEster(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>?????</label>
              <input placeholder="??????/?????/???????" value={iSite} onChange={(e) => setISite(e.target.value)} />
            </div>
            <div className="col">
              <label>???????</label>
              <input placeholder="????????????, ??????? ? ?.?." value={iNote} onChange={(e) => setINote(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={addInjection}>????????? ????????</button>
          </div>
        </div>
      </div>
    </div>
  );
}
