class Header {
  constructor({ navData }) {
    this.navData = navData;
  }

  render() {
    this.removeExistingHeader();
    this.generate();
  }

  generate() {
    const headerHTML = `
        <header>
            <h1>
                <a onclick="App.navigateTo('/')">HOME</a>
            </h1>
            <nav>
                <ul>
                ${this.navData
                  .map(
                    (item) => `
                        <li>
                            <a 
                                id="${item.key}" 
                                onclick="App.navigateTo('${item.url}')">
                                ${item.name}
                            </a>
                            ${
                              item.key === "cart"
                                ? '<span id="cart_count">0</span>'
                                : ""
                            }
                        </li>
                    `
                  )
                  .join("")}
                </ul>
            </nav>
        </header>
    `;

    App.generate(headerHTML);
  }

  removeExistingHeader() {
    const existingHeader = document.querySelector("header");
    if (existingHeader) {
      existingHeader.remove();
    }
  }
}
