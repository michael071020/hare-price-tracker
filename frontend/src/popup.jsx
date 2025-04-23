import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [data, setData] = useState({
    productTitle: '',
    productSuggestPrice: '',
    productPrice: '',
    productIdTW: '',
    productId: '',
    productOptions: []
  });

  useEffect(() => {
    chrome.storage.local.get([
      'productTitle',
      'productSuggestPrice',
      'productPrice',
      'productIdTW',
      'productId',
      'productOptions'
    ], (result) => {
      setData({
        productTitle: result.productTitle || '',
        productSuggestPrice: result.productSuggestPrice || '',
        productPrice: result.productPrice || '',
        productIdTW: result.productIdTW || '',
        productId: result.productId || '',
        productOptions: result.productOptions || []
      });
    });
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', fontSize: '14px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{data.productTitle}</h2>
      {/* {data.productSuggestPrice && (
        <p style={{ color: '#999', margin: 0 }}>建議售價：{data.productSuggestPrice}</p>
      )} */}
      {data.productPrice && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.25rem' }}>售價：{data.productPrice}</p>
      )}
      {/* <p style={{ color: '#999', marginTop: '1rem'}}>台灣編號：{data.productIdTW}</p> */}
      <p>商品編號：{data.productId}</p>

      <h4 style={{ marginTop: '1.2rem' }}>顏色與尺寸：</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {data.productOptions.map((opt, index) => (
          <li key={index} style={{ color: opt.inStock ? '#000' : '#aaa', textDecoration: opt.inStock ? 'none' : 'line-through' }}>
            {opt.productOption}
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
