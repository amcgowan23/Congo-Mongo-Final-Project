import React from 'react';
import { NewsReader } from './NewsReader';

function App() {
  return (
    <div className="container">
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 0',
          borderBottom: '2px solid #4a90e2',
        }}
      >
        {/* Wrap title text and image together for better alignment */}
        <h1
          style={{
            margin: 0,
            userSelect: 'none',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: '#001f4d',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          News Reader App
          <img
            src="/torch.jpg"  // Ensure this file exists in your public folder
            alt="Torch Logo"
            style={{ height: 40, width: 'auto' }}
          />
        </h1>
      </header>

      {/* Main app content */}
      <NewsReader />
    </div>
  );
}

export default App;