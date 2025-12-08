const callOptionsBtns = document.querySelectorAll(".callOptionsBtn");
const callDropdownOptions = document.querySelectorAll(".callDropdownOptions");
const backToCallOptions = document.querySelectorAll(".backToCallOptions");

// Show call dropdown options
callOptionsBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const wrapper = button.closest(".call_modal_actions");
    const callDropdownOptions = wrapper.querySelector(".callDropdownOptions");

    callDropdownOptions.classList.remove(HIDDEN);
  });

  // Outside click event
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".call_modal_actions")) {
      const allOptions = document.querySelectorAll(".callDropdownOptions");
      const callAddParticipants = document.querySelectorAll(".callAddParticipants");

      allOptions.forEach((options) => options.classList.add(HIDDEN));
      callAddParticipants.forEach((participant) => participant.classList.add(HIDDEN));
    }
  });
});

// Add new participant
callDropdownOptions.forEach((options) => {
  options.addEventListener("click", (e) => {
    const addNewParticipantBtn = e.target.closest(".addNewParticipantBtn");
    const callModalActions = addNewParticipantBtn.closest(".call_modal_actions");
    const callDropdownOptions = callModalActions.querySelector(".callDropdownOptions");
    const callAddParticipants = callModalActions.querySelector(".callAddParticipants");

    if (addNewParticipantBtn) {
      callDropdownOptions.classList.add(HIDDEN);
      callAddParticipants.classList.remove(HIDDEN);
    }
  });
});

// Back to Options
backToCallOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const callModalActions = e.target.closest(".call_modal_actions");
    const callDropdownOptions = callModalActions.querySelector(".callDropdownOptions");
    const callAddParticipants = callModalActions.querySelector(".callAddParticipants");

    if (callModalActions) {
      callDropdownOptions.classList.remove(HIDDEN);
      callAddParticipants.classList.add(HIDDEN);
    }
  });
});

// Participants Tab (Recents/Following/Followers)
const addParticipantsTabs = document.querySelectorAll(".addParticipantsTab");

addParticipantsTabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
      const { type } = button.dataset;

      const buttons = tab.querySelectorAll("button");
      const callAddParticipantsWrapper = tab.closest(".call_add_participants_wrapper");
      const containers = callAddParticipantsWrapper.querySelectorAll(".add_participants_lists>ul");
      const container = callAddParticipantsWrapper.querySelector(`.add_participants_lists ul#${type}Participant`);

      buttons.forEach((button) => button.classList.remove("active"));
      containers.forEach((container) => container.classList.add(HIDDEN));

      button.classList.add("active");
      container.classList.remove(HIDDEN);
    }
  });
});
