// --- Site & Page Detection ---
function detectSiteType() {
  const hostname = location.hostname;
  const pathname = location.pathname;

  // 判斷站別
  let site = '';
  if (hostname.includes('dot-st.tw')) {
    site = 'tw';
  } else if (hostname.includes('dot-st.com')) {
    site = 'jp';
  } else if (hostname.includes('zozo.jp')) {
    site = 'zozo';
  } else {
    console.log('[Hare Tracker Extension] unrecognized site:', hostname);
    return null; // 提早結束
  }
  // 判斷是否在商品頁（根據各站商品頁 URL 結構）
  let isProductPage = false;
  switch (site) {
    case 'tw':
      // dot-st.tw 商品頁格式為 '/SalePage/Index/{productIdTW}'
      isProductPage = /^\/SalePage\/Index\/\d*/.test(pathname)
      break;
    case 'jp':
      // dot-st.com 商品頁格式為 '/{brand}/disp/item/{product_id}'
      isProductPage = /^\/\w*\/disp\/item\/\d{6}/.test(pathname);
      break;
    case 'zozo':
      // zozo.jp 商品頁格式為 '/shop/{brand}/goods(-sale)/69317073/'
      isProductPage = /^\/shop\/\w*\/goods(-sale)?\/\d*/.test(pathname);
      break;
  }

  if (!isProductPage) {
    console.log(`[HARE Extension] detected site: ${site}, but not on product page.`);
    return {site, isProductPage}
  }

  console.log(`[HARE Extension] site: ${site}, currently on product page.`);
  return { site, isProductPage };
}
const detection = detectSiteType();
if (!detection) {
  console.warn('[HARE Extension] site not supported or not on product page.');
} else {
  const { site, isProductPage } = detection;
}



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