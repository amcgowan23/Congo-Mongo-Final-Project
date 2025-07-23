import React from "react";

export function SavedQueries(props) {
  const { savedQueries, selectedQueryName, onQuerySelect, onReset, currentUser } = props;

  return (
    <div>
      <h3>Saved Queries</h3>
      {currentUser && (
        <button onClick={onReset}>Reset</button>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {savedQueries.map((query, idx) => (
          <li
            key={idx}
            onClick={() => onQuerySelect(query)}
            style={{
              border: query.queryName === selectedQueryName ? "2px solid #007bff" : "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong style={{ fontSize: "1.1em" }}>{query.queryName}</strong>
            <div style={{ fontSize: "0.9em", color: "#555", marginTop: "4px" }}>
              <div><strong>Search:</strong> {query.q}</div>
              {query.language && <div><strong>Language:</strong> {query.language}</div>}
              {query.pageSize && <div><strong>Page Size:</strong> {query.pageSize}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}