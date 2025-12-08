let HIDDEN = "";

function getHiddenClassName() {
  const pathname = location.pathname;

  if (pathname === "/dashboard.html") {
    HIDDEN = "homepage-hidden";
  } else if (pathname === "/post.html") {
    HIDDEN = "post-hidden";
  } else if (pathname === "/collaboration-page.html") {
    HIDDEN = "hidden-page";
  } else if (pathname === "/collaborations.html") {
    HIDDEN = "collaboration-hidden";
  } else if (pathname === "/marketing.html") {
    HIDDEN = "marketing-hidden";
  } else if (pathname === "/notification.html") {
    HIDDEN = "notification-hidden";
  } else if (pathname === "/board.html" || pathname === "/board-page.html") {
    HIDDEN = "board--hidden";
  } else if (pathname === "/new-paper.html") {
    HIDDEN = "new-paper-hidden";
  } else if (pathname === "/paper-editing.html") {
    HIDDEN = "paper-editing-hidden";
  } else if (pathname === "/get-verified.html") {
    HIDDEN = "get-verified-hidden";
  } else if (pathname === "/christmas.html") {
    HIDDEN = "christ-hidden";
  } else if (pathname === "/campaign.html") {
    HIDDEN = "campaign-hidden";
  } else if (pathname === "/work.html") {
    HIDDEN = "work-hidden";
  } else if (pathname === "/advanced-editor.html") {
    HIDDEN = "editor-hidden";
  } else if (pathname === "/live.html") {
    HIDDEN = "live--hidden";
  } else if (pathname === "/streamer.html" || pathname === "/live-room.html" || pathname === "/audio-room.html" || pathname === "/audio-room-host.html") {
    HIDDEN = "streamer-hidden";
  } else if (pathname === "/dropped.html") {
    HIDDEN = "dropped-hidden";
  } else if (pathname === "/not-found.html") {
    HIDDEN = "not-found-hidden";
  } else if (pathname === "/explore.html") {
    HIDDEN = "explore-hidden";
  } else if (pathname === "/profile.html") {
    HIDDEN = "profile-hidden";
  } else if (pathname === "/account-profile.html") {
    HIDDEN = "profile-hidden";
  } else if (pathname === "/analytics.html") {
    HIDDEN = "analytics-hidden";
  } else if (pathname === "/chat.html") {
    HIDDEN = "chat-hidden";
  } else if (pathname === "/calender.html") {
    HIDDEN = "cal-hidden";
  } else if (pathname === "/crypto-dashboard.html") {
    HIDDEN = "crypto-hidden";
  } else if (pathname === "/pricing.html") {
    HIDDEN = "pricing-hidden";
  } else if (pathname === "/hashtag.html") {
    HIDDEN = "hashtag--hidden";
  } else if (pathname === "/musics.html") {
    HIDDEN = "musics-hidden";
  } else if (pathname === "/search.html") {
    HIDDEN = "search-hidden";
  } else if (pathname === "/location.html") {
    HIDDEN = "location-hidden";
  } else if (pathname === "/live-chat.html") {
    HIDDEN = "live-chat-hidden";
  } else if (pathname === "/settings.html") {
    HIDDEN = "settings--hidden";
  } else if (pathname === "/challenges.html") {
    HIDDEN = "challenge-hidden";
  }
}

getHiddenClassName();
