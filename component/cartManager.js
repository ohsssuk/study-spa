class CartManager {
  storedCart = [];
  localStorageItemName = "cartStorage";

  constructor() {
    this.init();
    this.updateSync();
  }

  init() {
    const storedCart = JSON.parse(
      localStorage.getItem(this.localStorageItemName)
    );

    if (storedCart && Array.isArray(storedCart)) {
      this.storedCart = storedCart;
    }
  }

  putCart({ productId, productTitle, productCount, productThumbnail }) {
    if (!productId) return;

    const foundIndex = this.getAlreadyProductIndex(productId);

    if (foundIndex !== -1) {
      this.storedCart[foundIndex].productCount += productCount;
    } else {
      this.storedCart.push({
        productId,
        productTitle,
        productCount,
        productThumbnail,
      });
    }

    alert("상품을 장바구니에 담았습니다.");

    this.updateSync();
  }

  deleteCart(productId) {
    if (!productId) return;

    const foundIndex = this.getAlreadyProductIndex(productId);

    if (foundIndex !== -1) {
      this.storedCart.splice(foundIndex, 1);
      alert("상품이 삭제되었습니다.");
    }

    this.updateSync();
  }

  getCartList() {
    return this.storedCart;
  }

  getCartCount() {
    return this.storedCart.length;
  }

  getAlreadyProductIndex(productId) {
    const foundIndex = this.storedCart.findIndex(
      (cartItem) => cartItem.productId === productId
    );

    return foundIndex;
  }

  updateSync() {
    this.updatelocalStorage();
    this.updateView();
  }

  updatelocalStorage() {
    localStorage.setItem(
      this.localStorageItemName,
      JSON.stringify(this.storedCart)
    );
  }

  updateView() {
    const cartCountElement = document.getElementById("cart_count");
    if (cartCountElement) {
      cartCountElement.innerHTML = this.getCartCount();
    }
  }
}
