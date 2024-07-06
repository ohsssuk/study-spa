class Cart extends Page {
  selector = { cartContainerId: "cart_container" };

  constructor() {
    super();
  }

  update() {
    this.updateCart();
  }

  updateCart() {
    const cartList = this.cartManager.getCartList();

    const cartContainer = document.getElementById(
      this.selector.cartContainerId
    );

    const cartListHTML = `
        <ul id="cart_list">
            ${cartList
              .map(
                (cartItem) => `
                    <li>
                        <div class="thumb">
                            <img src="${
                              cartItem.productThumbnail
                            }" onerror="this.src='../../images/image/no-image.gif'" alt="상품 이미지" />
                        </div>
                        
                        <div class="info">
                            <div class="title">${cartItem.productTitle}</div>
                            <div class="count">${numberFormat(
                              cartItem.productCount
                            )}개</div>
                            <div class="btn_wrap">
                                <button 
                                    data-product-id="${cartItem.productId}"
                                    class="delete_btn" 
                                    type="button"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </li>
                `
              )
              .join("")}
        </ul>
    `;

    if (cartList.length > 0) {
      cartContainer.innerHTML = cartListHTML;
    } else {
      cartContainer.innerHTML = `<p>장바구니에 담은 상품이 없습니다.</p>`;
    }
  }

  render() {
    this.setHeadTitle(`ProductsDetails`);
    this.setHeader();

    this.generate(`
        <main>
            <div id="back_btn_wrap"></div>

            <article id="${this.selector.cartContainerId}" class="${App.hasEventClass}"></article>
        </main>   
    `);

    new backBtn({
      wrapElement: document.getElementById("back_btn_wrap"),
    }).render();

    this.update();

    this.addEvent();
  }

  addEvent() {
    document
      .getElementById(this.selector.cartContainerId)
      .addEventListener("click", (event) => {
        if (event.target.classList.contains("delete_btn")) {
          const productId = parseInt(
            event.target.getAttribute("data-product-id")
          );

          this.handleDeleteCart(productId);
        }
      });
  }

  handleDeleteCart(productId) {
    this.cartManager.deleteCart(productId);
    this.update();
  }
}
