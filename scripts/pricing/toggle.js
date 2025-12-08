const pricingList = [
  {
    type: "Basics",
    logo: `<svg class="icon" width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M51.0001 24C51.0001 34.3094 42.6427 42.6667 32.3334 42.6667C22.0241 42.6667 13.6667 34.3094 13.6667 24C13.6667 13.6907 22.0241 5.33337 32.3334 5.33337C42.6427 5.33337 51.0001 13.6907 51.0001 24Z" fill="#1C274C" /> <path d="M19.2481 42.5104L18.238 46.1946C16.5624 52.3061 15.7247 55.3618 16.8426 57.0349C17.2344 57.621 17.76 58.0917 18.37 58.4021C20.1103 59.2882 22.7974 57.8882 28.1715 55.088C29.9598 54.1562 30.8539 53.6904 31.8038 53.589C32.156 53.5514 32.5107 53.5514 32.863 53.589C33.8128 53.6904 34.707 54.1562 36.4952 55.088C41.8694 57.8882 44.5566 59.2882 46.2968 58.4021C46.9067 58.0917 47.4323 57.621 47.824 57.0349C48.9422 55.3618 48.1043 52.3061 46.4288 46.1946L45.4187 42.5104C41.7222 45.1282 37.2075 46.6666 32.3334 46.6666C27.4592 46.6666 22.9444 45.1282 19.2481 42.5104Z" fill="#1C274C" /></svg>`,
    monthlyPrice: 10,
    annualPrice: 12,
    plans: ["Unlimited Templates", "Unlimited Slides", "Home Analytics", "Home People Requests", "Collaborators Recommendations Daily", "Unlimited Profile Viewed"],
  },
  {
    type: "Standard",
    logo: `<svg class="icon" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M32 42.6667C42.3093 42.6667 50.6666 34.3094 50.6666 24C50.6666 13.6907 42.3093 5.33337 32 5.33337C21.6907 5.33337 13.3333 13.6907 13.3333 24C13.3333 34.3094 21.6907 42.6667 32 42.6667ZM32 16C31.2424 16 30.7357 16.9089 29.7224 18.7267L29.4602 19.197C29.1725 19.7136 29.0285 19.9719 28.804 20.1423C28.5794 20.3127 28.3 20.376 27.7408 20.5025L27.2317 20.6177C25.2639 21.0629 24.28 21.2855 24.0459 22.0382C23.8118 22.7909 24.4826 23.5753 25.8241 25.144L26.1711 25.5498C26.5523 25.9956 26.7429 26.2185 26.8288 26.4942C26.9144 26.7699 26.8856 27.0672 26.828 27.6622L26.7754 28.2035C26.5727 30.2966 26.4713 31.343 27.084 31.8083C27.697 32.2734 28.6181 31.8494 30.4605 31.0011L30.937 30.7816C31.4608 30.5406 31.7224 30.42 32 30.42C32.2776 30.42 32.5392 30.5406 33.0629 30.7816L33.5394 31.0011C35.3818 31.8494 36.3029 32.2734 36.916 31.8083C37.5288 31.343 37.4272 30.2966 37.2245 28.2035L37.172 27.6622C37.1144 27.0672 37.0856 26.7699 37.1712 26.4942C37.257 26.2185 37.4477 25.9956 37.8288 25.5499L38.176 25.144C39.5173 23.5753 40.1882 22.7909 39.9541 22.0382C39.72 21.2855 38.736 21.0629 36.7682 20.6177L36.2592 20.5025C35.7 20.376 35.4205 20.3127 35.196 20.1423C34.9714 19.9719 34.8274 19.7136 34.5397 19.197L34.2776 18.7267C33.2642 16.9089 32.7576 16 32 16Z" fill="#1C274C" /> <path d="M18.9147 42.5104L17.9046 46.1946C16.2291 52.3061 15.3913 55.3618 16.5093 57.0349C16.9011 57.621 17.4267 58.0917 18.0366 58.4021C19.7769 59.2882 22.464 57.8882 27.8381 55.088C29.6264 54.1562 30.5205 53.6904 31.4704 53.589C31.8227 53.5514 32.1773 53.5514 32.5296 53.589C33.4795 53.6904 34.3736 54.1562 36.1619 55.088C41.536 57.8882 44.2232 59.2882 45.9635 58.4021C46.5733 58.0917 47.0989 57.621 47.4907 57.0349C48.6088 55.3618 47.7709 52.3061 46.0955 46.1946L45.0853 42.5104C41.3888 45.1282 36.8741 46.6666 32 46.6666C27.1259 46.6666 22.6111 45.1282 18.9147 42.5104Z" fill="#1C274C" /> </svg>`,
    monthlyPrice: 20,
    annualPrice: 24,
    plans: ["Unlimited Templates", "Unlimited Slides", "Home Analytics", "Home People Requests", "Collaborators Recommendations Daily", "Unlimited Profile Viewed"],
  },
  {
    type: "Premium",
    logo: `<svg class="icon" width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M32.6667 42.6667C42.976 42.6667 51.3334 34.3094 51.3334 24C51.3334 13.6907 42.976 5.33337 32.6667 5.33337C22.3574 5.33337 14 13.6907 14 24C14 34.3094 22.3574 42.6667 32.6667 42.6667ZM32.6667 16C31.9091 16 31.4024 16.9089 30.3891 18.7267L30.127 19.197C29.8392 19.7136 29.6952 19.9719 29.4707 20.1423C29.2462 20.3127 28.9667 20.376 28.4075 20.5025L27.8984 20.6177C25.9306 21.0629 24.9467 21.2855 24.7127 22.0382C24.4786 22.7909 25.1493 23.5753 26.4908 25.144L26.8379 25.5498C27.2191 25.9956 27.4096 26.2185 27.4955 26.4942C27.5811 26.7699 27.5523 27.0672 27.4947 27.6622L27.4422 28.2035C27.2394 30.2966 27.138 31.343 27.7507 31.8083C28.3638 32.2734 29.2848 31.8494 31.1272 31.0011L31.6038 30.7816C32.1275 30.5406 32.3891 30.42 32.6667 30.42C32.9443 30.42 33.2059 30.5406 33.7296 30.7816L34.2062 31.0011C36.0486 31.8494 36.9696 32.2734 37.5827 31.8083C38.1955 31.343 38.0939 30.2966 37.8912 28.2035L37.8387 27.6622C37.7811 27.0672 37.7523 26.7699 37.8379 26.4942C37.9238 26.2185 38.1144 25.9956 38.4955 25.5499L38.8427 25.144C40.184 23.5753 40.855 22.7909 40.6208 22.0382C40.3867 21.2855 39.4027 21.0629 37.435 20.6177L36.9259 20.5025C36.3667 20.376 36.0872 20.3127 35.8627 20.1423C35.6382 19.9719 35.4942 19.7136 35.2064 19.197L34.9443 18.7267C33.931 16.9089 33.4243 16 32.6667 16Z" fill="#1C274C" /><path d="M12.6538 34.6522L8.64555 38.8026C7.20523 40.2938 6.48507 41.0394 6.23587 41.6709C5.668 43.1098 6.15397 44.7061 7.3904 45.4629C7.93301 45.7952 8.91171 45.8986 10.8691 46.1058C11.9742 46.2226 12.5269 46.281 12.9897 46.4584C14.0258 46.8557 14.8318 47.6901 15.2154 48.7629C15.3867 49.2421 15.4432 49.8144 15.5561 50.9586C15.756 52.9853 15.856 53.9986 16.1768 54.5605C16.9078 55.8408 18.4494 56.344 19.8392 55.756C20.449 55.4978 21.1692 54.7522 22.6095 53.261L29.2283 46.4077C22.0349 45.313 15.9527 40.8373 12.6538 34.6522Z" fill="#1C274C" /> <path d="M36.1051 46.4077L42.724 53.261C44.1643 54.7522 44.8843 55.4978 45.4942 55.756C46.8841 56.344 48.4257 55.8408 49.1566 54.5605C49.4774 53.9986 49.5774 52.9853 49.7774 50.9586C49.8902 49.8144 49.9467 49.2421 50.1179 48.7629C50.5017 47.6901 51.3075 46.8557 52.3438 46.4584C52.8067 46.281 53.3593 46.2226 54.4643 46.1058C56.4217 45.8986 57.4003 45.7952 57.943 45.4629C59.1795 44.7061 59.6654 43.1098 59.0977 41.6709C58.8483 41.0394 58.1283 40.2938 56.6878 38.8026L52.6795 34.6522C49.3806 40.8373 43.2985 45.313 36.1051 46.4077Z" fill="#1C274C" /> </svg>`,
    monthlyPrice: 40,
    annualPrice: 45,
    plans: ["Unlimited Templates", "Unlimited Slides", "Home Analytics", "Home People Requests", "Collaborators Recommendations Daily", "Unlimited Profile Viewed"],
  },
];

// Events
const toggleCheckBox = document.getElementById("annual_price_checked");
const annuallyContent = document.getElementById("annuallyContent");
const monthlyContent = document.getElementById("monthlyContent");

toggleCheckBox.addEventListener("change", function () {
  const monthlyPrice = Array.from(document.getElementsByClassName("monthly_price"));
  const annuallyPrice = Array.from(document.getElementsByClassName("annually_price"));

  if (!toggleCheckBox.checked) {
    checkedMonthly(monthlyPrice, annuallyPrice);
  } else {
    checkedYearly(monthlyPrice, annuallyPrice);
  }
});

function checkedMonthly(monthlyPrice, annuallyPrice) {
  // content
  annuallyContent.classList.add(HIDDEN);
  monthlyContent.classList.remove(HIDDEN);

  // Pricing
  monthlyPrice.forEach((el) => el.classList.remove(HIDDEN));
  annuallyPrice.forEach((el) => el.classList.add(HIDDEN));
}

function checkedYearly(monthlyPrice, annuallyPrice) {
  // content
  annuallyContent.classList.remove(HIDDEN);
  monthlyContent.classList.add(HIDDEN);

  // Pricing
  monthlyPrice.forEach((el) => el.classList.add(HIDDEN));
  annuallyPrice.forEach((el) => el.classList.remove(HIDDEN));
}

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
// RENDER PRICE CATEGORY
function renderPriceLists(prices) {
  const plansContainerList = document.getElementById("plansContainerList");
  plansContainerList.innerHTML = "";

  prices.forEach((price) => {
    const { type, logo, monthlyPrice, annualPrice, plans } = price;

    const markup = `
        <div class="box">
          ${logo}
          <h1 class="title">${type}</h1>
          <p>Essential features for individuals starting out</p>
          <div class="price">
            <b class="annually monthly_price pricing-hidden">$${monthlyPrice}/mth</b>
            <b class="monthly annually_price">$${annualPrice}/yr</b>
          </div>
          <div class="features">
          ${plans
            .map((plan) => {
              return `
            <div class="feature-item">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.666626" width="24" height="24" rx="12" fill="#D1FADF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.763 7.39004L10.603 14.3L8.70301 12.27C8.35301 11.94 7.80301 11.92 7.40301 12.2C7.01301 12.49 6.90301 13 7.14301 13.41L9.39301 17.07C9.61301 17.41 9.99301 17.62 10.423 17.62C10.833 17.62 11.223 17.41 11.443 17.07C11.803 16.6 18.673 8.41004 18.673 8.41004C19.573 7.49004 18.483 6.68004 17.763 7.38004V7.39004Z" fill="#12B76A" />
              </svg>
              ${plan}
            </div>`;
            })
            .join("")}
          </div>
          <div class="button">
            <button data-plan="${type}" class="get_started">Get Started</button>
          </div>
        </div>
    `;

    plansContainerList.insertAdjacentHTML("beforeend", markup);
  });
}

renderPriceLists(pricingList);
