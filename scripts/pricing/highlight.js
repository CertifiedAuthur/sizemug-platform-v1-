function showTab(tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  event.currentTarget.className += " active";

  // Apply highlight to notifications and requests with SVG class 'unopen'
  highlightWithUnopenSVG(tabName);
}

function highlightWithUnopenSVG(tabName) {
  var items = document.getElementById(tabName).getElementsByClassName("notification");
  for (var i = 0; i < items.length; i++) {
    if (items[i].querySelector("svg.unopen")) {
      items[i].classList.add("highlight");
    }
  }

  var requests = document.getElementById(tabName).getElementsByClassName("request");
  for (var i = 0; i < requests.length; i++) {
    if (requests[i].querySelector("svg.unopen")) {
      requests[i].classList.add("highlight");
    }
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("notifications").style.display = "block";
//   highlightWithUnopenSVG("notifications");
// });
