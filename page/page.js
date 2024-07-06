class Page {
  constructor() {
    if (!this.cartManager) {
      this.cartManager = new CartManager();
    }

    if (!this.header) {
      this.header = new Header({
        navData: [
          { name: "메인", url: "/", key: "products" },
          { name: "장바구니", url: "/cart", key: "cart" },
        ],
      });
    }
  }

  setHeadTitle(title) {
    document.title = title;
  }

  setHeader() {
    this.header.render();
    this.cartManager.updateView(); // Header render후 최초 갱신 필요

    App.template.classList.add("with-header");
  }

  generate(html) {
    App.generate(html);
  }

  async callAPI({ url, method = "POST", formData = new FormData() }) {
    const result = {
      status: true,
      data: {},
      msg: "",
    };

    try {
      const options = {
        method: method,
      };

      if (method === "POST") {
        options.body = formData;
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      result.data = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      result.status = false;
      result.msg = error.message;

      return result;
    }
  }
}
