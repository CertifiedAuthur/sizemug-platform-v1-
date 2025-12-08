"use strict";

/**
 * --------------------------
 * SETTINGS EVENT (Grid lines, Snap of grid, Real time collaboration, Comment/Reactions, Drawing tools, Locking Elements, Public/Private Mode)
 * --------------------------
 */
const settingsDescriptionWrappers = document.querySelectorAll(".settings_side--containers");
const settingButtons = document.querySelectorAll('[type="checkbox"]');
const allDescriptionContainersMobile = [...settingsDescriptionWrappers[0].children]; // settingsDescriptionWrapper.children return HTMLCollection(array-like not actually an array). you can use [Array.from(settingsDescriptionWrapper.children)]
const allDescriptionContainers = [...settingsDescriptionWrappers[1].children]; // settingsDescriptionWrapper.children return HTMLCollection(array-like not actually an array). you can use [Array.from(settingsDescriptionWrapper.children)]
const backToSetting = document.getElementById("back_to_setting");
const mobileSettingContainer = document.getElementById("mobile_setting_container");
const mobileSettingAttachment = document.querySelector(".mobile_setting_attachment");
const allmobileSettingAttachments = document.querySelectorAll(".mobile_setting_attachment > div");

settingButtons.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const { container } = this.dataset;
    const mobileContainer = mobileSettingAttachment.querySelector(`.container--${container}`);

    if (this.checked) {
      if (innerWidth < 850) {
        mobileContainer.classList.remove(HIDDEN);
        mobileSettingAttachment.classList.remove(HIDDEN);
        mobileSettingContainer.classList.add(HIDDEN);
        backToSetting.classList.remove(HIDDEN);
        const targetContainer = document.querySelector(`.mobile_setting_attachment .container--${container}`);
        settingSwitch(targetContainer, "remove");
      } else {
        const targetContainer = document.querySelector(`.desktop_setting_attachment .container--${container}`);
        settingSwitch(targetContainer, "remove");
      }
    } else {
      if (innerWidth < 850) {
        const targetContainer = document.querySelector(`.mobile_setting_attachment .container--${container}`);
        settingSwitch(targetContainer, "add");
      } else {
        const targetContainer = document.querySelector(`.desktop_setting_attachment .container--${container}`);
        settingSwitch(targetContainer, "add");
      }
    }
  });
});

function settingSwitch(targetContainer, state) {
  allDescriptionContainers.forEach((el) => el.classList.add(HIDDEN));
  allDescriptionContainersMobile.forEach((el) => el.classList.add(HIDDEN));
  targetContainer.classList[state](HIDDEN);
  settingsDescriptionWrappers.forEach((con) => con.classList[state](HIDDEN));
}

// Back to setting
backToSetting.addEventListener("click", () => {
  allmobileSettingAttachments.forEach((attach) => attach.classList.add(HIDDEN));
  mobileSettingAttachment.classList.add(HIDDEN);
  mobileSettingContainer.classList.remove(HIDDEN);
  backToSetting.classList.add(HIDDEN);
});
