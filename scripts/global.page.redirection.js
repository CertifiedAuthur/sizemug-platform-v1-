function handlePageRedirection() {
  const userAccountType = localStorage.getItem("user-account-type") ?? "normal-account";
  const pathname = location.pathname;

  // Account Profile
  if (pathname === "/account-profile.html" && userAccountType === "creator-account") {
    return (location.href = "/creator-account-profile.html");
  }

  // Creator Account Profile
  if (pathname === "/creator-account-profile.html" && userAccountType === "normal-account") {
    return (location.href = "/account-profile.html");
  }

  // Normal Profile
  if (pathname === "/profile.html" && userAccountType === "creator-account") {
    return (location.href = "/creator-profile.html");
  }

  // Creator Profile
  if (pathname === "/creator-profile.html" && userAccountType === "normal-account") {
    return (location.href = "/profile.html");
  }
}

handlePageRedirection();
