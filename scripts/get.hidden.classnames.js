let HIDDEN = "";

function getHiddenClassName() {
  const rawPathname = String(location.pathname || "");
  const normalized = rawPathname.replace(/\\/g, "/");
  const filename = normalized.split("/").filter(Boolean).pop() || "";

  // Match by filename so this works for:
  // - root paths: /dashboard.html
  // - nested paths: /Sizemug-Platform/dashboard.html
  // - file urls on Windows: /C:/Users/.../dashboard.html
  switch (filename) {
    case "dashboard.html":
      HIDDEN = "homepage-hidden";
      break;
    case "post.html":
      HIDDEN = "post-hidden";
      break;
    case "collaboration-page.html":
      HIDDEN = "hidden-page";
      break;
    case "collaborations.html":
      HIDDEN = "collaboration-hidden";
      break;
    case "marketing.html":
      HIDDEN = "marketing-hidden";
      break;
    case "notification.html":
      HIDDEN = "notification-hidden";
      break;
    case "board.html":
    case "board-page.html":
      HIDDEN = "board--hidden";
      break;
    case "new-paper.html":
      HIDDEN = "new-paper-hidden";
      break;
    case "paper-editing.html":
      HIDDEN = "paper-editing-hidden";
      break;
    case "get-verified.html":
      HIDDEN = "get-verified-hidden";
      break;
    case "christmas.html":
      HIDDEN = "christ-hidden";
      break;
    case "campaign.html":
      HIDDEN = "campaign-hidden";
      break;
    case "work.html":
      HIDDEN = "work-hidden";
      break;
    case "advanced-editor.html":
      HIDDEN = "editor-hidden";
      break;
    case "live.html":
      HIDDEN = "live--hidden";
      break;
    case "streamer.html":
    case "live-room.html":
    case "audio-room.html":
    case "audio-room-host.html":
      HIDDEN = "streamer-hidden";
      break;
    case "dropped.html":
      HIDDEN = "dropped-hidden";
      break;
    case "not-found.html":
      HIDDEN = "not-found-hidden";
      break;
    case "explore.html":
      HIDDEN = "explore-hidden";
      break;
    case "profile.html":
    case "account-profile.html":
      HIDDEN = "profile-hidden";
      break;
    case "analytics.html":
      HIDDEN = "analytics-hidden";
      break;
    case "chat.html":
      HIDDEN = "chat-hidden";
      break;
    case "calender.html":
      HIDDEN = "cal-hidden";
      break;
    case "crypto-dashboard.html":
      HIDDEN = "crypto-hidden";
      break;
    case "pricing.html":
      HIDDEN = "pricing-hidden";
      break;
    case "hashtag.html":
      HIDDEN = "hashtag--hidden";
      break;
    case "musics.html":
      HIDDEN = "musics-hidden";
      break;
    case "search.html":
      HIDDEN = "search-hidden";
      break;
    case "location.html":
      HIDDEN = "location-hidden";
      break;
    case "live-chat.html":
      HIDDEN = "live-chat-hidden";
      break;
    case "settings.html":
      HIDDEN = "settings--hidden";
      break;
    case "challenges.html":
      HIDDEN = "challenge-hidden";
      break;
    default:
      // Keep previous value or empty string
      break;
  }
}

getHiddenClassName();
