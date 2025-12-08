const continueLandingIntro = document.getElementById("landing_steps_events--continue");
const cancelLandingIntro = document.getElementById("landing_steps_events--cancel");

continueLandingIntro.addEventListener("click", handleDashboardIntroContinue);
function handleDashboardIntroContinue(e) {
  const container = e.target.closest(".landing_welcome--main");
  const landingSteps = container.querySelector(".landing_steps");
  const allSteps = landingSteps.querySelectorAll(".landing_step");
  const allDot = document.querySelectorAll(".landing_dots--item");
  const { currentStep } = landingSteps.dataset;

  if (currentStep !== "5") {
    const target = +currentStep + 1;
    const step = landingSteps.querySelector(`.landing_step--${target}`);
    const activeDot = document.querySelector(`.landing_dots--item--${target}`);

    // add 'homepage-hidden' class to all step elements
    allSteps.forEach((step) => addClass(step));
    allDot.forEach((dot) => removeClass(dot, "active"));

    // remove 'homepage-hidden' class from step element
    removeClass(step);
    addClass(activeDot, "active");

    landingSteps.dataset.currentStep = target; // update the dataset for next step
  } else {
    handleDashboardIntroSkip();
  }
}

cancelLandingIntro.addEventListener("click", handleDashboardIntroSkip);
function handleDashboardIntroSkip() {
  console.log(window.introScreenSetup.driver);
  window.introScreenSetup.driver.drive();

  addClass(dashboardIntroModal);
  localStorage.setItem("sizemug_status", "old");
}
