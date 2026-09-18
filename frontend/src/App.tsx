import ItemList from "./components/ItemList";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              FastAPI Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              React + Axios + FastAPI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-medium text-slate-600">
              API Online
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <ItemList />
      </main>
    </div>
  );
}

export default App;