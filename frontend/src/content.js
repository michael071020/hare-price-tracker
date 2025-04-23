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
  productCode = match ? match[0] : '';
}

//庫存狀態
const lisOptionElements = document.querySelectorAll('.sku-ul li');
const productOptions = Array.from(lisOptionElements).map(li => {
  const a = li.querySelector('a');
  const productOption = a?.innerText?.trim() ?? '';
  const inStock = !li.classList.contains('sold-out') && !a?.classList.contains('sold-out');
  return { productOption, inStock };
});

chrome.storage.local.set({ 
    productTitle: productTitle, 
    productSuggestPrice: productSuggestPrice,
    productPrice: productPrice,
    productIdTW: productIdTW,
    productId: productId,
    productOptions: productOptions
}, () => {
  console.log('商品標題：', productTitle);
  console.log('商品建議售價：', productSuggestPrice);
  console.log('商品售價：', productPrice);
  console.log('商品台灣編號：', productIdTW);
  console.log('商品編號：', productId);
  console.log('庫存狀態：', productOptions);
});