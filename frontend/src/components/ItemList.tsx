import { useCallback, useEffect, useState } from "react";
import { itemsApi, type Item } from "../api/items";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setError("");

      const response = await itemsApi.getAll();

      setItems(response.data);
      setTotal(response.total);
      setTimestamp(response.timestamp);
    } catch (error) {
      console.error("Failed to load items:", error);
      setError("Failed to load items");
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    const load = async () => {
      await fetchItems();
      setLoading(false);
    };

    void load();
  }, [fetchItems]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchItems();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="state">
        <div className="spinner" />
        <p>Loading items...</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="error-state">
        <p>{error}</p>

        <button type="button" onClick={handleRefresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="stats">
        <div className="stat-card">
          <span>Total Items</span>
          <strong>{total}</strong>
        </div>

        <div className="stat-card">
          <span>Total Value</span>
          <strong>{items.reduce((sum, item) => sum + item.value, 0)}</strong>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>Items</h2>
            <p>Data loaded from FastAPI</p>
          </div>

          <button type="button" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {timestamp && (
          <div className="timestamp">Last updated: {timestamp}</div>
        )}
      </div>
    </section>
  );
}
