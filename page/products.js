class Products extends Page {
  page = 1;
  limit = 10;
  searchQ = "";

  selector = {
    productContainerId: "product_container",
    productPaginationId: "product_pagination",
  };

  constructor() {
    super();
  }

  async update() {
    const { status, msg, data } = await this.fetchProductsData({
      offset: (this.page - 1) * this.limit,
      limit: this.limit,
      searchQ: this.searchQ,
    });

    this.updateProducts({ status, msg, data });
    this.updatePagination({ status, msg, data });
  }

  updateProducts({ status, msg, data }) {
    const productContainer = document.getElementById(
      this.selector.productContainerId
    );

    if (!status) {
      productContainer.innerHTML = `<div class="empty_page"><p>오류가 생겼습니다.</p></div>`;
      console.log(msg);
      return;
    }

    const { limit, skip, total, products } = data;

    if (products.length === 0) {
      productContainer.innerHTML = `<div class="empty_page"><p>조건에 맞는 상품이 없습니다.</p></div>`;
      return;
    }

    const productListHTML = `
        <ul>
        ${products
          .map(
            (product) => `
                <li id="product_item_${product.id}">
                  <a onclick="App.navigateTo('/product/${product.id}')">
                    <div class="thumb">
                      <img src="${
                        product.thumbnail
                      }" onerror="this.src='../../images/image/no-image.gif'" alt="상품 이미지" />
                    </div>
                    <p class="title">${product.title}</p>
                    <p class="price">$${numberFormat(product.price)}</p>
                    <p class="description">${product.description}</p>
                  </a>
                </li>
            `
          )
          .join("")}
        </ul>
    `;

    productContainer.innerHTML = productListHTML;
  }

  updatePagination({ status, data }) {
    if (!status) return;

    const { limit, total } = data;
    const current = this.page;

    const wrapElement = document.getElementById(
      this.selector.productPaginationId
    );

    new Pagination({
      total,
      limit,
      current,
      wrapElement,
      onChange: (page) => {
        this.handleChangePage(page);
      },
    }).render();
  }

  render() {
    this.setHeadTitle(`Products`);
    this.setHeader();

    this.generate(`
        <main>
            <h2 class="common_title">Products</h2>

            <section class="filter_wrap">
              <div class="page_num_wrap">
                <select id="product_page_num" class="common_ui ${App.hasEventClass}">
                  <option value="10">10개</option>
                  <option value="20">20개</option>
                  <option value="30">30개</option>
                  <option value="50">50개</option>
                  <option value="100">100개</option>
                </select>
              </div>

              <div class="search_wrap">
                <input id="product_search" class="common_ui ${App.hasEventClass}" value="" type="text" placeholder="찾고 싶은 상품을 검색해보세요!" >
                <button id="product_search_btn" class="${App.hasEventClass}" type="button">검색</button>  
              </div>
            </section> 
            
            <article id="${this.selector.productContainerId}"></article>

            <article id="${this.selector.productPaginationId}" class="pagination"></article>
        </main>
    `);

    this.resetProductsFetchParams();
    this.update();

    this.addEvent();
  }

  addEvent() {
    this.addPageNumEvent();
    this.addSearchEvent();
  }

  addPageNumEvent() {
    const productPageNum = document.getElementById("product_page_num");
    productPageNum.addEventListener("change", (event) => {
      const selectedValue = event.target.value;

      this.handleSetPageNum(Number(selectedValue));
    });
  }

  addSearchEvent() {
    const productSearchElement = document.getElementById("product_search");

    productSearchElement.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.handleSearchProduct(productSearchElement.value);
      }
    });

    document
      .getElementById("product_search_btn")
      .addEventListener("click", (event) => {
        this.handleSearchProduct(productSearchElement.value);
      });
  }

  //searchWord: string
  handleSearchProduct(searchWord) {
    this.page = 1;
    this.searchQ = searchWord;

    this.update();
  }

  //pageNum: number
  handleSetPageNum(pageNum) {
    this.page = 1;
    this.limit = pageNum;

    this.update();
  }

  //page: number
  handleChangePage(page) {
    this.page = page;

    this.update();
  }

  resetProductsFetchParams() {
    this.page = 1;
    this.limit = 10;
    this.searchQ = "";
  }

  getFetchUrl({ offset, limit, searchQ }) {
    searchQ = searchQ.trim();

    let url = "https://dummyjson.com/products";
    if (searchQ !== "") {
      url += `/search?q=${searchQ}&`;
    } else {
      url += `?`;
    }
    url += `skip=${offset}&limit=${limit}`;

    return url;
  }

  async fetchProductsData({ offset = 0, limit = 10, searchQ = "" }) {
    const url = this.getFetchUrl({ offset, limit, searchQ });
    const method = "GET";

    const response = await this.callAPI({
      url,
      method,
    });

    return { ...response };
  }
}
