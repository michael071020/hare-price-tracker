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

  const [isTracked, setIsTracked] = useState(false);

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

  // 將台灣商品加入追蹤
  // 目前邏輯為按下追蹤後，將content.js存進local的資料再存進結構化資料內
  useEffect(() => {
    chrome.storage.local.get([
      'productTitle',
      'productSuggestPrice',
      'productPrice',
      'productIdTW',
      'productId',
      'productOptions',
      'trackedProducts'
    ], (result) => {
      const id = result.productId || '';
      const tracked = result.trackedProducts || [];
      const exists = tracked.some(item => item.productId === id);
  
      setIsTracked(exists);
      setData({
        productTitle: result.productTitle || '',
        productSuggestPrice: result.productSuggestPrice || '',
        productPrice: result.productPrice || '',
        productIdTW: result.productIdTW || '',
        productId: id,
        productOptions: result.productOptions || []
      });
    });
  }, []);
  
  const handleTrack = () => {
      chrome.storage.local.get(['trackedProducts'], (res) => {
        const currentList = res.trackedProducts || [];
        if (currentList.some(item => item.productId === data.productId)) {
          return; // 已追蹤就不加
        }
    
        const newItem = {
          productId: data.productId,
          tw: {
            title: data.productTitle,
            price: data.productPrice,
            suggestPrice: data.productSuggestPrice,
            idTW: data.productIdTW,
            options: data.productOptions,
            url: window.location.href
          }
        };
    
        const newList = [...currentList, newItem];
        chrome.storage.local.set({ trackedProducts: newList }, () => {
          setIsTracked(true);
        });
      });
    };

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
        <hr style={{ margin: '1rem 0' }} />
        {isTracked ? (
          <p style={{ color: 'green', fontWeight: 'bold' }}>此商品已在追蹤清單中</p>
        ) : (
          <button onClick={handleTrack} style={{ padding: '0.5rem 1rem', fontSize: '14px', cursor: 'pointer' }}>
            ➕ 加入追蹤清單
          </button>
        )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
