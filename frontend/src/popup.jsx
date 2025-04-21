import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{ padding: '1rem', fontSize: '16px' }}>
      <h2>HARE Price Tracker</h2>
      <p>這是你的 popup 頁面</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);