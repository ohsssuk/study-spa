class backBtn {
  className = "back_btn";

  constructor({ wrapElement }) {
    this.wrapElement = wrapElement;
  }

  render() {
    if (!this.wrapElement) return;

    this.generate();
    this.addEvent();
  }

  generate() {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = "뒤로 가기";
    buttonElement.className = `${this.className} ${App.hasEventClass}`;
    buttonElement.type = "button";

    this.wrapElement.appendChild(buttonElement);
  }
  addEvent() {
    const backButton = this.wrapElement.querySelector(`.${this.className}`);
    backButton.addEventListener("click", () => {
      history.back();
    });
  }
}
