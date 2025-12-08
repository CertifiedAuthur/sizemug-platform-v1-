/**
 *
 * Managing Wallet First Overlay
 *
 */
document.addEventListener("DOMContentLoaded", () => {
  const status = JSON.parse(localStorage.getItem("sizemug-wallet-page"));
  const walletOnboardingWelcome = document.getElementById("wallet_onboarding--welcome");
  const walletContinue = walletOnboardingWelcome.querySelector("#walletContinue");

  console.log(status);

  if (!status) {
    walletOnboardingWelcome.classList.remove(HIDDEN);
  } else {
    walletOnboardingWelcome.classList.add(HIDDEN);
  }

  walletOnboardingWelcome.addEventListener("click", (e) => {
    if (e.target.id === "wallet_onboarding--welcome" || e.target.id === "walletContinue") {
      walletOnboardingWelcome.classList.add(HIDDEN);
      localStorage.setItem("sizemug-wallet-page", true);
    }
  });

  walletContinue.addEventListener("click", () => {
    console.log(HIDDEN);

    walletOnboardingWelcome.classList.add(HIDDEN);
    localStorage.setItem("sizemug-wallet-page", true);
  });
});
