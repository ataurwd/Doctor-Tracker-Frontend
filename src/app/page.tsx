export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          DT
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Doctor Tracker</h1>
        <p className="text-slate-600 text-sm mb-6">
          Admin portal initialized. Ready for Next.js App Router and Express API integration.
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● Frontend Initialized
        </div>
      </div>
    </main>
  );
}
