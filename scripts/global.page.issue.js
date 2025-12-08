const issueWrapperContainer = document.getElementById("issueWrapper");
const uniqueIdentifiers = document.querySelectorAll(".uniqueIdentifier");
const uniqueIdentifierBtn = document.querySelector(".uniqueIdentifierBtn");

uniqueIdentifierBtn?.addEventListener("click", () => {
  console.log(uniqueIdentifiers);
  uniqueIdentifiers.forEach((container) => (container.style.display = "none"));
  issueWrapperContainer.style.display = "flex";
});

// Dropped Page
const notesSharedBtn = document.getElementById("notesSharedBtn");

notesSharedBtn?.addEventListener("click", function () {
  const issueWrappers = document.querySelectorAll(".issue-wrapper");
  const noteSharedBody = document.querySelectorAll(".noteSharedBody");

  noteSharedBody.forEach((body) => (body.style.display = "none"));

  if (this.textContent === "Notes") {
    const issueNoteWrapper = document.getElementById("issueNoteWrapper");

    issueWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
    issueNoteWrapper.style.display = "flex";
  } else {
    const issueSharedWrapper = document.getElementById("issueSharedWrapper");

    issueWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
    issueSharedWrapper.style.display = "flex";
  }
});

// Campaign
const campaignText = document.getElementById("campaignText");

campaignText?.addEventListener("click", () => {
  const issueCampaginWrapper = document.getElementById("issueCampaginWrapper");
  const hideForCampaignIssue = document.getElementById("hideForCampaignIssue");

  hideForCampaignIssue.style.display = "none";
  issueCampaginWrapper.style.display = "flex";
});
