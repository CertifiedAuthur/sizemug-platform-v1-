function wallet_coin_init() {
  return {
    select_user_panel: false,
    init() {
      this.coin_page = 1;
      this.wallet_page = 1;
      this.selected_amt = 0;
      this.payment_method = "";
    },
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
    payment_opt(method) {
      this.payment_method = method;
    },
    payment_next: {
      ["x-on:click"]() {
        if (this.payment_method == "wallet") {
          return (this.coin_page = 4);
        } else {
          return (this.coin_page = 3);
        }
      },
      ["x-text"]() {
        if (this.payment_method == "wallet") {
          return "Pay";
        } else {
          return "Next";
        }
      },
    },
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("tabs", () => ({
    my_story_tab: 1,
    tab_len(el) {
      let parent = el.parentNode;
      return parent.querySelectorAll("button").length;
    },
    switch_tab(el) {
      let len = this.tab_len(el);
      return `width: ${(1 / len) * 100}%; transform:translateX(${(this.my_story_tab - 1) * 100}%)`;
    },
    tab_click(num) {
      this.my_story_tab = num;
    },
    bind_data(num) {
      return this.my_story_tab === num;
    },
    __panel(num) {
      return this.my_story_tab === num;
    },
  }));
});
document.addEventListener("alpine:init", () => {
  // Alpine.resize('liveRoom', () => ({
  //     resizeRoom: {
  //         ['x-resize.document']() {
  //             console.log('object');
  //         }
  //     }
  // }));
  Alpine.data("live_room", () => ({
    streams_len: 1,
    showMediaFooter: true,
    aside_toggle: false,
    live_play: true,
    live_volume: 0.5,
    live_mute: false,
    mute_class: "",
    live_mute_class(vol) {
      if (vol == 0) {
        return "fa-volume-xmark";
      } else if (vol < 0.1) {
        return "fa-volume-off";
      } else if (vol <= 0.5) {
        return "fa-volume-low";
      } else if (vol > 0.5) {
        return "fa-volume-high";
      }
    },
    v_adjust: {
      ["x-init"]() {
        let vm_perc = (this.live_volume / 1) * 100;
        this.$el.style.width = `${vm_perc}%`;
        this.mute_class = this.live_mute_class(this.live_volume);
        this.$watch("live_volume", (volume) => {
          this.mute_class = this.live_mute_class(volume);
          if (volume > 0) {
            this.live_mute = false;
          }
          let vm_perc = (volume / 1) * 100;
          this.$el.style.width = `${vm_perc}%`;
          this.$refs.live_video.volume = volume;
        });
      },
    },
    play_live: {
      ["x-text"]() {
        return this.live_play ? "play_arrow" : "pause";
      },
      ["x-on:click"]() {
        this.live_play = !this.live_play;
      },
    },
    live_video: {
      ["x-ref"]: "live_video",
      ["x-init"]() {
        this.$watch("live_play", (play) => {
          if (!play) {
            this.$el.play();
          } else {
            this.$el.pause();
          }
        });
        this.live_mute = this.$refs.live_video.muted;
        this.$watch("live_mute", (mute) => {
          if (!mute) {
            this.$el.muted = false;
            this.mute_class = this.live_mute_class(this.live_volume);
          } else {
            this.mute_class = "fa-volume-xmark";
            this.$el.muted = true;
          }
        });
      },
    },
    vid_mute: {
      ["x-ref"]: "vid_mute",
      ["x-on:click"]() {
        this.live_mute = !this.live_mute;
      },
      ["x-bind:class"]() {
        return this.mute_class;
      },
    },
    aside_float: {
      ["x-init"]() {
        this.$watch("aside_toggle", (float) => {
          let aside = document.querySelector(".live_aside");
          if (float) {
            aside.style.transform = "translateY(0%)";
          } else {
            aside.style.transform = "translateY(93%)";
          }
          if (window.innerWidth >= 1024) {
            this.aside_toggle = true;
          }
        });
      },
      ["x-bind:data-float_down"]() {
        return this.aside_toggle;
      },
      ["x-on:click"]() {
        this.aside_toggle = !this.aside_toggle;
      },
    },

    /* Live Touch */
    startY_ctrl: 0,
    onTouchStart_ctrl(event) {
      this.startY_ctrl = event.touches[0].clientY;
    },
    onTouchEnd_ctrl(event) {
      const endY = event.changedTouches[0].clientY;
      const diffY = this.startY_ctrl - endY;
      if (diffY > 30) {
        this.onSwipeUp_ctrl();
      }
      if (diffY < -90) {
        this.story_active_media = "";
        this.stories = {};
        let story_modal = document.querySelector(".story_modal");
        story_modal.style.transform = "translateY(100%)";
      }
    },
    onSwipeUp_ctrl() {
      if (window.innerWidth <= 640) {
        this.story_ctrl = true;
      }
    },
    handleStream: {
      ["x-bind:data-many_stream"]() {
        if (this.streams_len > 1) {
          this.showMediaFooter = false;
          return true;
        }
      },
      ["x-bind:data-stream_5"]() {
        if (this.streams_len > 4) return true;
      },
    },
    send_gift: {
      ["x-on:click"]() {
        this.payment = "send-gift";
      },
      ["x-show"]() {
        return this.streams_len < 2;
      },
    },
    initStream() {
      this.streams_len = this.$el.children.length;
      if (this.streams_len == 3 || (this.streams_len > 6 && this.streams_len % 3 == 1)) {
        let lastChild = this.$el.children;
        lastChild[this.streams_len - 1].setAttribute("data-row_2_1", true);
      }
    },
  }));
});

document.addEventListener("alpine:init", () => {
  Alpine.data("main_page_init", () => ({
    wc: "coin",
    add_coin: false,
    payment: "",
    stream_invite_open: false,
    invite_stage: false,
    view_profile: false,
    stage_invite: false,
    remove_viewer: false,
    my_coin: false,
    share_popup: false,
    share_link: "",
    following_popup: false,
    ff__tab: "following",
    current_page_ff: {},
    view_profile_modal: {
      ["x-show"]() {
        return this.view_profile;
      },
      ["x-on:click.self"]() {
        this.view_profile = false;
      },
    },
    stage_invite_modal: {
      ["x-show"]() {
        return this.stage_invite;
      },
      ["x-on:click.self"]() {
        this.stage_invite = false;
      },
    },
    remove_viewer_modal: {
      ["x-show"]() {
        return this.remove_viewer;
      },
      ["x-on:click.self"]() {
        this.remove_viewer = false;
      },
    },
  }));
  Alpine.data("wallet_init", () => ({
    open: false,
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
    open_select_user: {
      ["x-ref"]: "select_user",
      ["@click"]() {
        this.open = true;
      },
    },

    dialogue: {
      ["x-show"]() {
        return this.open;
      },
    },
  }));
});

/* Select Coin */
// let select_coin = document.querySelectorAll('.add-coin-modal-select_amt-list > *');
// select_coin.forEach((coin_amt, index) => {
//     coin_amt.setAttribute(`x-bind:data-selected-amt`, `selected_amt==$el.innerHTML`);
//     coin_amt.setAttribute(`x-on:click`, `selected_amt=$el.innerHTML`);
// });

/* Coin Page Header Progress */
let select_coin_page = document.querySelectorAll(".add-coin-modal-linear-progress > *");
select_coin_page.forEach((p_progress, i) => {
  p_progress.setAttribute(`x-on:click`, `coin_page=${i + 1}`);
  p_progress.setAttribute(`x-bind:class`, `{'coin-bg' : coin_page > ${i}}`);
});

/* Coin Page Header Progress */
let select_wallet = document.querySelectorAll(".add-wallet-modal-linear-progress > *");
select_wallet.forEach((p_progress, i) => {
  p_progress.setAttribute(`x-on:click`, `wallet_page=${i + 1}`);
  p_progress.setAttribute(`x-bind:class`, `{'wallet-bg' : wallet_page > ${i}}`);
});

document.addEventListener("alpine:init", () => {
  this.selected_name = "";
  Alpine.data("selectUsers", () => ({
    selected_christmas: "",
    nameSelected: "",
    selected_image: "",
    open_dropdown: false,
    item_selected: "",
    dropdown_select: {
      ["x-on:click"]() {
        this.open_dropdown = !this.open_dropdown;
      },
      ["x-on:click.outside"]() {
        this.open_dropdown = false;
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
    christmas: {
      ["x-show"]() {
        let ul = this.$el.children[0];
        let lists = ul.children;
        for (i = 0; i < lists.length; i++) {
          lists[i].setAttribute("x-bind", "select_christmas");
        }
        return this.nameSelected == "Christmas";
      },
    },
    select_christmas: {
      ["@click"]() {
        this.selected_christmas = this.$el.innerHTML;
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.selected_christmas;
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
            this.selected_name = children[i].innerText.trim();
          }
          if (children[i].tagName === "SPAN") {
            this.nameSelected = children[i].innerText.trim();
          }
        }
      },
      ["x-bind:data-selected"]() {
        return this.$el.innerHTML == this.item_selected;
      },
    },
    dropdown_list: {
      ["x-show"]() {
        return this.open_dropdown;
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
  Alpine.data("stream_invite", () => ({
    invite_time: 10,
    times: null,
    timer() {
      this.times = setInterval(() => {
        this.invite_time = this.invite_time - 1;
      }, 1000);
    },
    timeout_invite: {
      ["x-init"]() {
        this.timer();
      },
    },
    invite_live: {
      ["x-show"]() {
        if (this.stream_invite_open && this.invite_time < 0) {
          this.invite_time = 10;
          this.stream_invite_open = false;
          clearInterval();
        }
        return this.stream_invite_open;
      },
      ["@click.self"]() {
        return (this.stream_invite_open = false);
      },
    },
  }));
});

// document.getElementById("sendCoin").addEventListener("click", () => {
//   const sendCoinModal = document.getElementById("sendCoinModal");
//   sendCoinModal.classList.remove(HIDDEN);
// });
