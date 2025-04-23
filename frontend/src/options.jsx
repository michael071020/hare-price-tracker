import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';

function OptionsPage() {
  const [trackedList, setTrackedList] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(['trackedProducts'], (res) => {
      setTrackedList(res.trackedProducts || []);
    });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>追蹤商品清單</h1>

      {trackedList.length === 0 ? (
        <p style={{ color: '#999' }}>目前尚無追蹤商品</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {trackedList.map((item, index) => (
            <li
              key={index}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
            >
              <strong>{item.tw.title}</strong>
              <p>售價：{item.tw.price}</p>
              <p>商品編號：{item.productId}</p>
              <a href={item.tw.url} target="_blank" rel="noreferrer">
                查看商品頁面
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<OptionsPage />);
