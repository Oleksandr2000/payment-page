const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? "Placeholder по умолчанию";

  const items = data.map((item) => {
    let cls = "";

    if (item.id == selectedId) {
      text = item.value;
      icon = item.icon;
      cls = "selected";
    }

    if (item.icon) {
      return `
          <li class="select__item ${cls}"  data-type="item" data-id=${item.id}>
              <img  src=${item.icon} alt="Stripe" />
              ${item.value} 
              <img src="./assets/icons/checked.png" alt="checked" class="select__check" />
          </li>
        `;
    } else {
      return `
          <li class="select__item ${cls}" style="padding: 10px 5px" data-type="item" data-id=${item.id}>
              <div></div>
              ${item.value} 
              <img src="./assets/icons/checked.png" alt="checked" class="select__check" />
          </li>
        `;
    }
  });

  if (icon) {
    return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
      <div class="option__label" data-type="value">
            <img style="margin-right: 10px" src=${icon} alt="Stripe" />
            <input type="text" name=${text} id=${text} value=${text}  readonly />
      </div>
      <i class="fa fa-chevron-down" data-type="arrow"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join("")}
      </ul>
    </div>
  `;
  } else {
    return `
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
        <div class="option__label" data-type="value">
             <input type="text" name=${text} id=${text} value=${text} readonly /> 
        </div>
        <i class="fa fa-chevron-down" data-type="arrow"></i>
      </div>
      <div class="select__dropdown">
        <ul class="select__list">
          ${items.join("")}
        </ul>
      </div>
    `;
  }
};

class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = options.selectedId;

    this.#render();
    this.#setup();
  }

  #render() {
    const { placeholder, data } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);
    this.$arrow = this.$el.querySelector('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
    this.$menu = this.$el.querySelector('[data-type="input"]');

    this.$menu.addEventListener("click", () => {
      this.toggle();
    });
  }

  clickHandler(event) {
    const { type } = event.target.dataset;

    if (type === "item") {
      const id = event.target.dataset.id;
      this.select(id);
    } else if (type === "backdrop") {
      this.close();
    }
  }

  get isOpen() {
    return this.$el.classList.contains("open");
  }

  get current() {
    return this.options.data.find((item) => item.id === this.selectedId);
  }

  select(id) {
    this.selectedId = id;

    if (this.current.icon) {
      this.$value.innerHTML = `
        <div class="option__label" data-type="value">
          <img style="margin-right: 10px" src=${this.current.icon} alt="Stripe" />
            ${this.current.value}
        </div>
        `;
    } else {
      this.$value.innerHTML = `
        <div class="option__label" data-type="value">
            ${this.current.value}
        </div>
        `;
    }

    if (this.current.pageLogo) {
      const $logo = document.querySelector("#payment__system-logo");

      $logo.src = this.current.pageLogo;
    }

    this.$el.querySelectorAll('[data-type="item"]').forEach((el) => {
      el.classList.remove("selected");
    });
    this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected");

    this.options.onSelect ? this.options.onSelect(this.current) : null;

    this.close();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add("open");
    this.$arrow.classList.remove("fa-chevron-down");
    this.$arrow.classList.add("fa-chevron-up");
  }

  close() {
    this.$el.classList.remove("open");
    this.$arrow.classList.add("fa-chevron-down");
    this.$arrow.classList.remove("fa-chevron-up");
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = "";
  }
}

const selectPaymentSystem = new Select("#select-system", {
  selectedId: "1",

  data: [
    {
      id: "1",
      value: "Fondy",
      icon: "./assets/icons/min_logo_fondy.png",
      pageLogo: "./assets/icons/logo_fondy.png",
    },
    {
      id: "2",
      value: "Stripe",
      icon: "./assets/icons/min_logo_stripe.png",
      pageLogo: "./assets/icons/logo_stripe.png",
    },
    {
      id: "3",
      value: "Coinbase",
      icon: "./assets/icons/min_logo_coinbase.png",
      pageLogo: "./assets/icons/logo_coinbase.png",
    },
    {
      id: "4",
      value: "LiqPay",
      icon: "./assets/icons/min_logo_liqpay.png",
      pageLogo: "./assets/icons/logo_liqpay.png",
    },
  ],
  onSelect(item) {
    console.log("Selected Item", item);
  },
});

const selectCurrency = new Select("#select-currency", {
  selectedId: "1",

  data: [
    { id: "1", value: "USD" },
    { id: "2", value: "ETH" },
    { id: "3", value: "BTC" },
    { id: "4", value: "UAH" },
  ],
  onSelect(item) {
    console.log("Selected Item", item);
  },
});

let counter = document.getElementById("counter");
let decreaseTrigger = document.getElementById("decrease");
let increaseTrigger = document.getElementById("increase");

decreaseTrigger.addEventListener("click", () => {
  if (counter.value > 1) {
    counter.value = String(Number(counter.value) - 1).padStart(2, "0");
  }
});

increaseTrigger.addEventListener("click", () => {
  if (counter.value < 99) {
    counter.value = String(Number(counter.value) + 1).padStart(2, "0");
  }
});
