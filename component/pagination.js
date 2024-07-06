class Pagination {
  constructor({ wrapElement, total, limit, current, onChange }) {
    this.wrapElement = wrapElement;
    this.total = total;
    this.limit = limit;
    this.current = current;
    this.onChange = onChange; //onChange: (page: number) => void;
  }

  getTotalPages() {
    return Math.ceil(this.total / this.limit);
  }

  render() {
    if (!this.wrapElement) return;

    this.generate();
    this.addEvent();
  }

  generate() {
    const totalPages = this.getTotalPages();

    const ulElement = document.createElement("ul");

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === this.current ? "active" : "";

      const liElement = document.createElement("li");
      liElement.className = activeClass;

      const aElement = document.createElement("a");
      aElement.setAttribute("data-page", i);
      aElement.className = `pagination-item ${App.hasEventClass}`;
      aElement.textContent = i.toString();

      liElement.appendChild(aElement);
      ulElement.appendChild(liElement);
    }

    const removeUlElement = this.wrapElement.querySelector("ul");

    if (removeUlElement) {
      this.wrapElement.replaceChild(ulElement, removeUlElement);
    } else {
      this.wrapElement.appendChild(ulElement);
    }
  }

  addEvent() {
    const paginationItems =
      this.wrapElement.querySelectorAll(".pagination-item");

    paginationItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const page = parseInt(event.target.dataset.page);
        this.onChange(page);
      });
    });
  }
}
