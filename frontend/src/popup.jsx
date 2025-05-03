import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  // Initialize product data structure with tw/jp/zozo fields
  const [data, setData] = useState({
    productId: '',
    tw: { title: '', price: '', suggestPrice: '', idTW: '', options: [], url: '', isStock: false },
    jp: { title: '', price: '', suggestPrice: '', idJP: '', options: [], url: '', isStock: false },
    zozo: { title: '', price: '', suggestPrice: '', idZozo: '', options: [], url: '', isStock: false }
  });

  // Track if the current product has already been added
  const [isTracked, setIsTracked] = useState(false);

  // On popup load: get current product info and check if it's already in the tracked list
  useEffect(() => {
    chrome.storage.local.get(['currentProduct', 'trackedProducts'], (result) => {
      const product = result.currentProduct || {
        productId: '',
        tw: { isStock: false, title: '', price: '', suggestPrice: '', idTW: '', options: [], url: ''},
        jp: { isStock: false, title: '', price: '', suggestPrice: '', idJP: '', options: [], url: ''},
        zozo: { isStock: false, title: '', price: '', suggestPrice: '', idZozo: '', options: [], url: ''}
      };

      const tracked = result.trackedProducts || [];
      const exists = tracked.some(item => item.productId === product.productId);

      setIsTracked(exists);
      setData(product);
    });
  }, []);

  // Handle tracking button click: store current product into trackedProducts
  const handleTrack = () => {
    chrome.storage.local.get(['trackedProducts', 'currentProduct'], (res) => {
      const currentList = res.trackedProducts || [];
      const currentProduct = res.currentProduct;

      if (!currentProduct) return;

      const alreadyTracked = currentList.some(item => item.productId === currentProduct.productId);
      if (alreadyTracked) return;

      const newList = [...currentList, currentProduct];
      chrome.storage.local.set({ trackedProducts: newList }, () => {
        setIsTracked(true);
      });
    });
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', fontSize: '14px' }}>
      {/* Product Title */}
      <h2 style={{ marginBottom: '0.5rem' }}>{data.tw.title}</h2>

      {/* Display current price if available */}
      {data.tw.price && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.25rem' }}>
          售價：{data.tw.price}
        </p>
      )}

      {/* Product ID */}
      <p>商品編號：{data.productId}</p>

      {/* List product options (e.g., color + size) with stock indication */}
      <h4 style={{ marginTop: '1.2rem' }}>顏色與尺寸：</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {data.tw.options.map((opt, index) => (
          <li
            key={index}
            style={{
              color: opt.inStock ? '#000' : '#aaa',
              textDecoration: opt.inStock ? 'none' : 'line-through'
            }}
          >
            {opt.productOption}
          </li>
        ))}
      </ul>

      <hr style={{ margin: '1rem 0' }} />

      {/* Track button or status */}
      {isTracked ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>此商品已在追蹤清單中</p>
      ) : (
        <button
          onClick={handleTrack}
          style={{ padding: '0.5rem 1rem', fontSize: '14px', cursor: 'pointer' }}
        >
          ➕ 加入追蹤清單
        </button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
