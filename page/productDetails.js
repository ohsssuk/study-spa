class ProductDetails extends Page {
  //productId: number
  constructor({ productId }) {
    super();

    this.productId = productId;
  }

  async render() {
    this.setHeadTitle(`ProductsDetails`);
    this.setHeader();

    const { status, msg, data } = await this.fetchProductDetailsData();

    const { price, thumbnail, title } = data;

    this.productPrice = price;
    this.productTitle = title;
    this.productThumbnail = thumbnail;

    const detailDataRows = [
      "brand",
      "category",
      "stock",
      "description",
      "discountPercentage",
    ];

    this.generate(`
        <main>
            <div id="back_btn_wrap"></div>

            <div id="product_detail">
                <div class="thumb">
                    <img src="${
                      data.thumbnail
                    }" onerror="this.src='../../images/image/no-image.gif'" alt="상품 이미지" />
                </div>
                
                <div class="info">
                    <div class="title">${data.title}</div>
                    <div class="price">
                        $<span id="product_real_price">
                            ${numberFormat(data.price)}
                        </span>
                    </div>
                    ${detailDataRows
                      .map(
                        (row) => `
                            <div class="row ${row}">
                                <div class="row_label">${row}</div>
                                <div class="row_value">${data[row] ?? "-"}</div>
                            </div>
                        `
                      )
                      .join("")}
                  </div>
            </div>
            
            <div id="cart_btn_wrap">
                <input 
                    id="cart_count_change" 
                    class="${App.hasEventClass}" 
                    type="number" 
                    value="1"
                >
                <button 
                    id="cart_put_btn" 
                    class="${App.hasEventClass}"
                    type="button"
                >
                    장바구니 담기
                </button>
            </div>
        </main>
    `);

    this.addEvent();

    new backBtn({
      wrapElement: document.getElementById("back_btn_wrap"),
    }).render();
  }

  addEvent() {
    this.addChangeCartCountEvent();
    this.addPutCartEvent();
  }

  addChangeCartCountEvent() {
    const cartCountChangeElement = document.getElementById("cart_count_change");

    cartCountChangeElement.addEventListener("change", (event) => {
      const cartCount = parseInt(event.target.value);

      this.handleChangeCartCount({
        cartCountChangeElement,
        cartCount,
      });
    });
  }

  addPutCartEvent() {
    const putCartElement = document.getElementById("cart_put_btn");

    putCartElement.addEventListener("click", (event) => {
      this.handlePutCart({
        cartCount: parseInt(document.getElementById("cart_count_change").value),
      });
    });
  }

  handleChangeCartCount({ cartCountChangeElement, cartCount }) {
    cartCountChangeElement.value = cartCount;

    if (cartCount < 1) {
      alert("1개 미만은 담을 수 없습니다.");
      cartCountChangeElement.value = 1;
      this.updateProductPriceValue(this.productPrice);
      return;
    }

    this.updateProductPriceValue(this.productPrice * cartCount);
  }

  handlePutCart({ cartCount }) {
    this.cartManager.putCart({
      productId: this.productId,
      productTitle: this.productTitle,
      productCount: cartCount,
      productThumbnail: this.productThumbnail,
    });
  }

  updateProductPriceValue(productPrice) {
    const productRealPriceElement =
      document.getElementById("product_real_price");

    productRealPriceElement.innerHTML = ` ${numberFormat(productPrice)} `;
  }

  async fetchProductDetailsData() {
    const url = `https://dummyjson.com/products/${this.productId}`;
    const method = "GET";

    const response = await this.callAPI({
      url,
      method,
    });

    return { ...response };
  }
}
