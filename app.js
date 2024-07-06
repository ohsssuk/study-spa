document.addEventListener("DOMContentLoaded", function () {
  App.init();
});

const App = {
  template: null,

  hasEventClass: "has-event",

  init: function () {
    this.template = document.getElementById("App");

    this.renderApp();
    window.onpopstate = (event) => {
      this.renderApp();
    };
  },

  navigateTo: function (url) {
    history.pushState(null, null, url);
    this.renderApp();
  },

  route: function () {
    const currentPath = window.location.pathname;

    if (currentPath.startsWith("/cart")) {
      new Cart().render();
    } else if (currentPath.startsWith("/product/")) {
      const productId = Number(currentPath.split("/").pop());
      new ProductDetails({ productId }).render();
    } else {
      new Products().render();
    }
  },

  renderApp() {
    this.removeAppContent();
    this.removeComponentEvent();
    this.route();
  },

  generate(html) {
    this.template.innerHTML += html;
  },

  removeAppContent() {
    this.template.innerHTML = "";
  },

  removeComponentEvent() {
    const hasEventElements = document.querySelectorAll(`.${App.hasEventClass}`);

    hasEventElements.forEach((element) => {
      const events = getEventListeners(element);
      for (const eventType in events) {
        events[eventType].forEach((listener) => {
          element.removeEventListener(eventType, listener.listener);
        });
      }
    });
  },

  checkPathRedirect() {
    const currentPath = window.location.pathname;
    if (currentPath !== "/index.html" && currentPath !== "/") {
      window.location.href = "";
    }
  },
};
