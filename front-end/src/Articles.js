import React, { useState } from "react";

export function Articles({ data, query }) {
  const [showDetails, setShowDetails] = useState(true);

  const articles = data.articles || [];
  const queryName = query.queryName || "N/A";
  const articleCount = data.totalResults || 0;

  // Function to format and render query details
  function renderQueryDetails() {
    const detailItems = Object.entries(query)
      .filter(([key, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        return (
          <li key={key} style={{ marginBottom: '0.2rem' }}>
            <strong>{label}:</strong> {value.toString()}
          </li>
        );
      });

    return (
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          borderRadius: "6px",
          border: "1px solid #ddd",
          color: "#555",
          fontSize: "0.9rem",
          userSelect: "none",
        }}
      >
        <strong>Query Details:</strong>
        <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
          {detailItems.length > 0 ? detailItems : <li>No details available</li>}
        </ul>
      </div>
    );
  }

  const articleListHeight = '150px'; // fixed height for scroll container

  return (
    <div>
      {/* Toggle button for query details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          marginBottom: "0.5rem",
          fontSize: "0.85rem",
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          userSelect: "none",
        }}
        aria-expanded={showDetails}
        aria-controls="query-details"
      >
        {showDetails ? "Hide" : "Show"} Query Details
      </button>

      {/* Conditionally render query details */}
      {showDetails && (
        <section id="query-details">
          {renderQueryDetails()}
        </section>
      )}

      {/* Scrollable container for articles list */}
      <div
        style={{
          height: articleListHeight,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "0.5rem",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          boxSizing: "border-box",
        }}
      >
        <ol
          style={{
            paddingLeft: "1.25rem",
            marginTop: "0.5rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "0.85rem",
            lineHeight: "1.3",
          }}
        >
          {articles.length === 0 && <li>No articles found.</li>}

          {articles.map((item, idx) => {
            if (!item) return <li key={idx}>No Item</li>;
            if (!item.title) return <li key={idx}>No Title</li>;
            if (item.title === "[Removed]")
              return <li key={idx}>Was Removed</li>;

            const maxTitleLength = 150;
            const shortTitle =
              item.title.length > maxTitleLength
                ? item.title.substring(0, maxTitleLength) + "..."
                : item.title;

            return (
              <li key={idx} style={{ marginBottom: "0.6rem" }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "0.9rem",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    textDecoration: "none",
                    color: "#1a0dab",
                    lineHeight: "1.4",
                  }}
                  title={item.title} // full title on hover
                >
                  {shortTitle}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}