import { JSX } from "react";

function App(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Duty Rosterer</h1>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Tailwind Active
          </span>
        </div>

        <p className="mb-6 text-sm text-slate-500">
          Upload your baseline Word document or personnel form to begin
          generating the schedule.
        </p>

        <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95">
          Select Document
        </button>
      </div>
    </div>
  );
}

export default App;
