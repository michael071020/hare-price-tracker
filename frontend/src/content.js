
/* Get product details (only tw for now) */
const productTitle = document.getElementsByClassName('salepage-title')[0]?.innerText ?? '';
const productSuggestPrice = document.getElementsByClassName('salepage-suggestprice')[0]?.innerText ?? '';
const productPrice = document.getElementsByClassName('salepage-price')[0]?.innerText ?? '';
const productIdTW = document.getElementsByClassName('salepage-feature-detail')[0]?.innerText ?? '';

// 商品編號 (productId)
const lisProductId = document.querySelectorAll('.salepage-short-description li');
let productId = '';
for (let li of lisProductId) {
  if (li.innerText.includes('商品貨號')) {
    productId = li.innerText.split('：')[1]?.trim() ?? '';
    break;
  }
}
if (!productId) {
  const match = productTitle.match(/\d{6}/);
  productId = match ? match[0] : '';
}

// stock for different size/color
const lisOptionElements = document.querySelectorAll('.sku-ul li');
const productOptions = Array.from(lisOptionElements).map(li => {
  const a = li.querySelector('a');
  const productOption = a?.innerText?.trim() ?? '';
  const inStock = !li.classList.contains('sold-out') && !a?.classList.contains('sold-out');
  return { productOption, inStock };
});


const currentProduct = {
  productId: productId,
  tw: {
    isStock: true,
    title: productTitle,
    price: productPrice,
    suggestPrice: productSuggestPrice,
    idTW: productIdTW,
    options: productOptions,
    url: `https://www.dot-st.tw/SalePage/Index/${productIdTW}`
  },
  jp: { isStock: false },
  zozo: { isStock: false }
};

chrome.storage.local.set({ currentProduct }, () => {
  console.log('已儲存商品資料至 currentProduct', currentProduct);
});