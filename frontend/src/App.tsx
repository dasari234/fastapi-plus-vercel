import ItemList from "./components/ItemList";
import "./index.css";

function App() {
  return (
    <main className="app">
      <header className="header">
        <h1>FastAPI + React</h1>
        <p>React frontend using Axios with FastAPI</p>
      </header>

      <ItemList />
    </main>
  );
}

export default App;