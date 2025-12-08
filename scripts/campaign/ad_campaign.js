document.addEventListener("alpine:init", () => {
  this.selected_option = "";
  this.time_store = {};

  Alpine.data("ad_campaign", () => ({
    aside_nav: "campaigns",
    page: "",
    wc_page: "wallet",
    format_filter: "",
    __vir_var: {},
    objective: "",
    ad_image: "",
    page__number: 1,
    wc: "coin",
    add_coin: false,
    payment: "",
    modal_name: "",
    post_selected: "",
    post_click_text: "",
    post_click_text_array: [],
    upload_details: {
      show() {
        return this.image;
      },
      image: "",
      web_logo: "",
      web_link: "",
      upload_value: "",
      popup_image: false,
      popup_video: false,
      web_name: "",
      video: "",
    },
    upload_logo: {
      ["@change"]() {
        let file = this.$el.files[0];
        this.upload_details.web_logo = URL.createObjectURL(file);
      },
    },
    update_var(id) {
      let k = "";
      setInterval(() => {
        this.__vir_var = selected_option;
        k = `${selected_option[id]}`;
        eval(`this.${id} = '${k}'`);
      }, 1000);
    },
    traffik: {
      ["x-show"]() {
        return true;
      },
    },
    upload: {
      show() {
        return this.upload_details.show();
      },
      website_logo: {
        ["x-bind:src"]() {
          return this.upload_details.web_logo;
        },
        ["x-show"]() {
          return this.upload_details.web_logo;
        },
      },
      upload_imageModal: {
        ["x-on:click"]() {
          return (this.upload_details.popup_image = true);
        },
      },
      webLink: {
        ["x-text"]() {
          return this.upload_details.web_link;
        },
        ["x-show"]() {
          return this.upload_details.web_link;
        },
      },
      webName: {
        ["x-text"]() {
          return this.upload_details.web_name;
        },
      },
      image: {
        ["x-text"]() {
          return this.upload_details.image;
        },
      },
      webLogo: {
        ["x-bind:src"]() {
          let file = this.upload_details.web_logo.files[0];
          return URL.createObjectURL(file);
        },
        ["x-text"]() {
          let file = this.upload_details.web_logo.files[0];
          return file.name;
        },
      },
    },
    close_selected_banner: {
      ["x-on:click"]() {
        this.upload_details.image = "";
        this.page__number = this.page__number - 1;
      },
      ["x-init"]() {
        this.$watch("page__number", (value) => {
          this.page_number = value;
        });
        this.$watch("objective", (value) => {
          // Reset All Banner details
          this.upload_details.image = "";
          this.upload_details.web_logo = "";
          this.upload_details.web_link = "";
          this.upload_details.upload_value = "";
          this.upload_details.popup_image = false;
          this.upload_details.web_name = "";
          this.format_filter = "";
          this.post_selected = "";
          this.post_click_text = "";
          this.post_click_text_array = [];
        });
      },
    },
    banner_tag: {
      ["x-show"]() {
        return this.page__number == 4 && this.upload_details.image && !this.post_click_text;
      },
    },
    bannerImage: {
      ["x-bind:src"]() {
        return this.upload_details.image;
      },
    },
    preview_img: {
      ["x-show"]() {
        return this.ad_image;
      },
    },
    preview_image: {
      ["x-bind:src"]() {
        return this.ad_image;
      },
    },
    post_list: {
      ["x-init"]() {
        let children = this.$el.children;
        for (let i = 0; i < children.length; i++) {
          const element = children[i];
          element.setAttribute("x-bind", "post_item");
        }
      },
    },
    ad_format_filter: {
      ["x-on:click"]() {
        this.format_filter = this.$el.innerHTML;
        // unselet post
        this.post_click_text = "";
        this.ad_image = "";
        this.post_click_text_array = [];

        // Optional
        if (this.$el.getAttribute("aria-haspopup")) {
          let target = this.$el.getAttribute("data-popup-target");
          if (target) {
            eval(`this.${target} = true`);
          }
        }
      },
      ["x-bind:data-active"]() {
        return this.format_filter == this.$el.innerHTML;
      },
    },
    post_item: {
      ["x-on:click"]() {
        // unselect format_filter
        if (this.format_filter !== "Post") {
          this.format_filter = "";
        }

        let children = this.$el.children;
        this.post_click_text_array = [];

        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (children[i].tagName === "IMG") {
            this.ad_image = children[i].getAttribute("src");
          }

          if (i > 0) {
            this.post_click_text_array.push(child.outerHTML);
          }
        }
        // Create div element and its class
        let div = document.createElement("div");
        div.className = "item_overBorder";
        // Create span element and its class name
        let span = document.createElement("span");
        span.className = "material-symbols-outlined";
        span.setAttribute("x-bind", "close_selected_post");
        span.innerHTML = "close";
        div.appendChild(span);

        let innerText_post_click_texted = div.outerHTML;

        innerText_post_click_texted += this.post_click_text_array.join("");
        this.post_selected = innerText_post_click_texted;
        let me = this.$el.innerHTML;
        this.post_click_text = me;
        return;
      },
      ["x-bind:data-active"]() {
        return this.post_click_text == this.$el.innerHTML;
      },
    },
    close_selected_post: {
      ["x-on:click"]() {
        this.post_click_text = "";
        this.ad_image = "";
        this.post_click_text_array = [];
      },
    },
    selected_post: {
      ["x-ref"]: "selected_post_container",
      ["x-html"]() {
        return this.post_selected;
      },
      ["x-show"]() {
        return this.post_click_text !== "";
      },
    },
    aside_btn: {
      ["x-on:click"]() {
        this.aside_nav = this.$el.getAttribute("id");
      },
      ["x-bind:data-nav"]() {
        return this.$el.getAttribute("id") == this.aside_nav;
      },
    },
    wc_page_nav: {
      ["x-on:click"]() {
        console.log(this.wc_page, this.aside_nav);
        return (this.wc_page = this.$el.getAttribute("aria-labelledby"));
      },
    },
    page_active: {
      ["x-show"]() {
        if (this.$el.getAttribute("aria-label") != null) {
          return this.aside_nav == this.$el.getAttribute("aria-labelledby") && this.wc_page == this.$el.getAttribute("aria-label");
        }
        this.campaign_page = "all_campaigns";
        return this.aside_nav == this.$el.getAttribute("aria-labelledby");
      },
    },
  }));

  Alpine.data("ad_images", () => ({
    uploaded_image: "",
    ads_image: {
      ["x-show"]() {
        return this.upload_details.popup_image;
      },
      ["x-on:click.self"]() {
        return (this.upload_details.popup_image = false);
      },
    },
    upload_image: {
      ["@change"]() {
        const upload_image = this.$el.files[0];
        this.upload_details.upload_value = this.$el;
        this.uploaded_image = URL.createObjectURL(upload_image);
      },
    },
    update_upload: {
      ["x-on:click"]() {
        this.upload_details.image = this.uploaded_image;
        return (this.upload_details.popup_image = false);
      },
    },
    cancel_upload: {
      ["x-on:click"]() {
        this.upload_details.popup_image = false;
      },
    },
  }));

  Alpine.data("ad_video", () => ({
    uploaded_video: "",
    ads_video: {
      ["x-show"]() {
        return this.upload_details.popup_video;
      },
      ["x-on:click.self"]() {
        return (this.upload_details.popup_video = false);
      },
    },
    upload_video: {
      ["@change"]() {
        const upload_image = this.$el.files[0];
        this.upload_details.upload_value = this.$el;
        this.uploaded_video = URL.createObjectURL(upload_image);
      },
    },
    update_upload: {
      ["x-on:click"]() {
        this.upload_details.video = this.uploaded_video;
        return (this.upload_details.popup_video = false);
      },
    },
    cancel_upload: {
      ["x-on:click"]() {
        this.upload_details.popup_video = false;
      },
    },
  }));

  Alpine.data("time_picker", () => ({
    hr: "01",
    min: "05",
    period: "AM",
    time_picker__open: false,
    openTimePicker: {
      ["x-on:click"]() {
        this.time_picker__open = !this.time_picker__open;
      },
      ["x-text"]() {
        time_store[this.$el.getAttribute("id")] = this.selected__time();
        return this.selected__time();
      },
    },
    selected__time() {
      return `${this.hr}:${this.min} ${this.period}`;
    },
    convertTo24Hour(time) {
      let [hours, minutes] = time.split(":");
      const period = time.slice(-2);

      hours = parseInt(hours, 10);
      if (period.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.slice(0, 2)}`;
    },
    time_picker: {
      ["x-show"]() {
        return this.time_picker__open;
      },
      ["x-on:click.outside"]() {
        return (this.time_picker__open = false);
      },
    },
    time_hour: {
      ["x-init"]() {
        for (let i = 1; i <= 12; i++) {
          let li = document.createElement("li");
          let num = i.toString().length == 1 ? "0" + i.toString() : i;
          li.textContent = num;
          li.setAttribute("x-bind", "select_hour");
          this.$el.appendChild(li);
        }
      },
    },
    time_min: {
      ["x-init"]() {
        for (let i = 0; i < 60; i++) {
          let li = document.createElement("li");
          let num = i.toString().length == 1 ? "0" + i.toString() : i;
          li.textContent = num;
          li.setAttribute("x-bind", "select_min");
          this.$el.appendChild(li);
        }
      },
    },
    time_period: {
      ["x-init"]() {
        let period = ["AM", "PM"];
        for (let i = 0; i < period.length; i++) {
          let li = document.createElement("li");
          li.textContent = period[i];
          li.setAttribute("x-bind", "select_period");
          this.$el.appendChild(li);
        }
      },
    },
    select_hour: {
      ["x-on:click"]() {
        this.hr = this.$el.innerHTML;
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.hr;
      },
    },
    select_min: {
      ["x-on:click"]() {
        this.min = this.$el.innerHTML;
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.min;
      },
    },
    select_period: {
      ["x-on:click"]() {
        this.period = this.$el.innerHTML;
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.period;
      },
    },
  }));
  Alpine.data("new_campaign", () => ({
    page_number: 1,
    timeSelected: {},

    selected__time(id) {
      let k = "";
      setInterval(() => {
        this.timeSelected = time_store;
        k = `${time_store[id]}`;
        eval(`this.${id} = '${k}'`);
      }, 1000);
    },
    timeValue: {
      ["x-init"]() {
        this.selected__time(this.$el.getAttribute("id"));
      },
      ["x-bind:value"]() {
        if (this[this.$el.getAttribute("id")] == undefined) return;
        const timeInput = this.$el;
        const timeToSet = this[this.$el.getAttribute("id")];
        const timeIn24HourFormat = this.convertTo24Hour(timeToSet);
        timeInput.value = timeIn24HourFormat;
        return timeIn24HourFormat;
      },
    },
    convertTo24Hour(time) {
      let [hours, minutes] = time.split(":");
      const period = time.slice(-2);

      hours = parseInt(hours, 10);
      if (period.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.slice(0, 2)}`;
    },
    content_body() {
      let children = this.$el.children;
      for (let i = 0; i < children.length; i++) {
        const content_body = children[i];
        let key = i + 1;
        content_body.setAttribute("tabindex", key);
      }
    },
    get_s_time: {
      ["x-bind:value"]() {},
    },
    next_page: {
      ["x-on:click"]() {
        this.page_number = parseInt(this.page_number) + 1;
      },
      ["x-init"]() {
        this.$watch("page_number", (value) => {
          this.page__number = value;
        });
      },
    },
    prev_page: {
      ["x-on:click"]() {
        this.page_number = parseInt(this.page_number) - 1;
      },
      ["x-init"]() {
        this.$watch("page_number", (value) => {
          this.page__number = value;
        });
      },
    },
    page_progress: {
      ["x-init"]() {
        let children = this.$el.children;
        for (let i = 0; i < children.length; i++) {
          const element = children[i];
          let key = i + 1;
          element.setAttribute("x-bind", "progress_line");
          element.setAttribute("data-progress_id", key);
        }
      },
    },
    progress_line: {
      ["x-bind:data-active"]() {
        return this.page_number >= this.$el.getAttribute("data-progress_id");
      },
      ["x-on:click"]() {
        return (this.page_number = this.$el.getAttribute("data-progress_id"));
      },
    },
    page_content: {
      ["x-show"]() {
        return this.page_number == this.$el.getAttribute("tabindex");
      },
    },
  }));
  Alpine.data("campaigns", () => ({
    campaign_page: "campaigns_analysis",
    selected__time(id) {
      let k = "";
      setInterval(() => {
        this.timeSelected = time_store;
        k = `${time_store[id]}`;
        eval(`this.${id} = '${k}'`);
      }, 1000);
    },
    timeValue: {
      ["x-init"]() {
        this.selected__time(this.$el.getAttribute("id"));
      },
      ["x-bind:value"]() {
        if (this[this.$el.getAttribute("id")] == undefined) return;
        const timeInput = this.$el;
        const timeToSet = this[this.$el.getAttribute("id")];
        const timeIn24HourFormat = this.convertTo24Hour(timeToSet);
        timeInput.value = timeIn24HourFormat;
        return timeIn24HourFormat;
      },
    },
    convertTo24Hour(time) {
      let [hours, minutes] = time.split(":");
      const period = time.slice(-2);

      hours = parseInt(hours, 10);
      if (period.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.slice(0, 2)}`;
    },
    tbl_option: "",
    tbl_rows: {
      ["x-init"]() {
        let table_rows = this.$el.children;

        for (let i = 0; i < table_rows.length; i++) {
          let table_row = table_rows[i];
          let dialog = table_row.querySelector("dialog");
          if (i >= table_rows.length - 2) {
            dialog.classList = "menu_options_down_up";
          } else {
            dialog.classList = "menu_options";
          }
        }
      },
    },
    campaign_page_active: {
      ["x-show"]() {
        return this.aside_nav == "campaigns" && this.campaign_page == this.$el.getAttribute("id");
      },
      ["x-init"]() {
        this.$watch("aside_nav", (value) => {
          this.campaign_page = "all_campaigns";
        });
      },
    },
  }));
  Alpine.data("table_row", () => ({
    menu_popup: false,
    menu: {
      ["x-on:click.prevent"](event) {
        this.menu_popup = !this.menu_popup;
      },
      ["x-text"]() {
        return this.menu_popup ? "close" : "more_horiz";
      },
    },
    menu_options: {
      ["x-show"]() {
        return this.menu_popup;
      },
      ["x-on:click.outside"]() {
        this.menu_popup = false;
      },
      ["x-init"]() {
        let li = this.$el.querySelectorAll("li");
        Object.values(li).forEach((el, key) => {
          el.setAttribute("x-bind", "update_campaign_page");
        });
      },
    },
    update_campaign_page: {
      ["x-on:click"]() {
        this.campaign_page = this.$el.getAttribute("aria-labelledby");
        this.menu_popup = false;
      },
    },
  }));

  Alpine.data("selectUsers", () => ({
    selected_option: "",
    selected_christmas: "",
    nameSelected: "",
    selected_image: "",
    open_dropdown: false,
    item_selected: "",
    dropdown_select: {
      ["x-on:click"]() {
        this.open_dropdown = !this.open_dropdown;
      },
    },
    default_text: {
      ["x-show"]() {
        return !this.nameSelected;
      },
    },
    selected_img: {
      ["x-bind:src"]() {
        return this.selected_image;
      },
      ["x-show"]() {
        return this.selected_image;
      },
    },
    selected_text: {
      ["x-show"]() {
        return this.nameSelected;
      },
      ["x-text"]() {
        return this.nameSelected;
      },
    },
    selected_objective: {
      ["x-model"]() {
        return this.selected_option;
      },
      ["x-init"]() {
        this.$watch("selected_option", (value) => {
          this.objective = value;
        });
      },
    },
    dropdown_item: {
      ["@click"](event) {
        let children = this.$el.children;
        this.item_selected = this.$el.innerHTML;
        for (i = 0; i < children.length; i++) {
          if (children[i].tagName === "IMG") {
            this.selected_image = children[i].getAttribute("src");
          }
          if (children[i].tagName === "SPAN") {
            this.selected_option = children[i].innerText.trim();
          }
          if (children[i].tagName === "SPAN") {
            selected_option = children[i].innerText.trim();
          }
          if (children[i].tagName === "SPAN") {
            this.nameSelected = children[i].innerText.trim();
          }
        }
        this.open_dropdown = false;
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.item_selected || this.objective == this.$el.innerText;
      },
    },
    dropdown_list: {
      ["x-show"]() {
        return this.open_dropdown;
      },
      ["x-on:click.outside"]() {
        return (this.open_dropdown = false);
      },
    },
  }));

  Alpine.data("wallet_coin", () => ({
    selected_name: "",
    coin_amt: 20,
    coin_page: 1,
    wallet_page: 1,
    selected_amt: 0,
    payment_method: "",
    select_users: {
      ["x-ref"]: "select_user",
      ["x-translate.origin.center"]: true,
      ["@click"]() {
        this.select_user = true;
      },
      ["x-show"]() {
        return this.select_user;
      },
      ["@click.outside"]() {
        this.select_user = false;
      },
    },
    select_coins: {
      ["@click"](event) {
        let coins = this.$el.children;
        for (i = 0; i < coins.length; i++) {
          coins[i].setAttribute("x-bind", "select_coin");
        }
      },
    },
    select_coin: {
      ["x-on:click"]() {
        this.selected_amt = this.$el.innerText.trim();
      },
      ["x-bind:data-selected-amt"]() {
        return this.$el.innerText.trim() == this.selected_amt;
      },
    },
    summary_send: {
      ["x-show"]() {
        return this.selected_amt <= this.coin_amt;
      },
    },
    coin_button: {
      ["x-show"]() {
        return this.selected_amt <= this.coin_amt;
      },
    },
    add__coin: {
      ["x-show"]() {
        return this.selected_amt > this.coin_amt;
      },
    },
  }));
  Alpine.data("withdraw_coin", () => ({
    selected_name: "",
    coin_amt: 100,
    coin_page: 1,
    wallet_page: 1,
    selected_amt: 0,
    payment_method: "",
    switch_amt: false,
    next_page: {
      ["x-on:click"]() {
        this.modal_name = "Withdraw Coin";
        this.coin_page = this.coin_page + 1;
      },
    },

    prev_page: {
      ["x-on:click"]() {
        this.coin_page = this.coin_page - 1;
      },
    },
    withdraw_methods: {
      ["x-init"]() {
        let coins = this.$el.children;
        for (i = 0; i < coins.length; i++) {
          coins[i].setAttribute("x-bind", "select_with_method");
        }
      },
    },
    page_progress: {
      ["x-init"]() {
        let coins = this.$el.children;
        for (i = 0; i < coins.length; i++) {
          coins[i].setAttribute("x-bind", "progress");
        }
      },
    },
    progress: {
      ["x-bind:data-active"]() {
        let parent = this.$el.parentNode;
        const items = Array.from(this.$el.parentNode.children);
        items.forEach((element, key) => {
          let c = key;
          element.setAttribute("data-index", c + 1);
        });
        let index = this.$el.getAttribute("data-index");
        return index <= this.coin_page;
      },
    },
    withdraw_methods: {
      ["x-init"]() {
        let coins = this.$el.children;
        for (i = 0; i < coins.length; i++) {
          coins[i].setAttribute("x-bind", "select_with_method");
        }
      },
    },
    select_with_method: {
      ["x-on:click"]() {
        this.payment_method = this.$el.innerText.trim();
      },
      ["x-bind:data-selected-method"]() {
        return this.$el.innerText.trim() == this.payment_method;
      },
    },
    amount_switch: {
      ["x-on:click"]() {
        this.switch_amt = !this.switch_amt;
      },
    },
    xchange_amount: {
      ["x-bind:data-xhange"]() {
        return this.switch_amt;
      },
    },
  }));
});
