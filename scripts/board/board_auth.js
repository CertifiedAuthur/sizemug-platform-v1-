"use strict";

const emailRecoveryButton = document.querySelector("#recovery_email button");
const otpRecoveryButton = document.querySelector("#recovery_otp button");
const passRecoveryButton = document.querySelector("#recovery_pass button");
const emailRecoveryContainer = document.querySelector("#recovery_email");
const otpRecoveryContainer = document.querySelector("#recovery_otp");
const passRecoveryContainer = document.querySelector("#recovery_pass");
const recoveryModal = document.querySelector(".recovery_overlay");
const registerModal = document.querySelector(".register_overlay");
const loginModal = document.querySelector(".login_overlay");

emailRecoveryButton.addEventListener("click", function () {
  emailRecoveryContainer.style.display = "none";
  otpRecoveryContainer.style.display = "block";
});

otpRecoveryButton.addEventListener("click", function () {
  otpRecoveryContainer.style.display = "none";
  passRecoveryContainer.style.display = "block";
});

passRecoveryButton.addEventListener("click", function () {
  passRecoveryContainer.style.display = "none";
  emailRecoveryContainer.style.display = "block";
  recoveryModal.classList.add("board--hidden");
});

// Forgot Password
const forgotPassword = document.getElementById("forgot_password");

forgotPassword.addEventListener("click", () => {
  loginModal.classList.add("board--hidden");
  recoveryModal.classList.remove("board--hidden");
});

// Register
const registerBtn = document.getElementById("register_btn");

registerBtn.addEventListener("click", () => {
  registerModal.classList.remove("board--hidden");
  loginModal.classList.add("board--hidden");
});

// Login
const loginBtn = document.querySelectorAll("#login--btn");

loginBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    loginModal.classList.remove("board--hidden");
    registerModal.classList.add("board--hidden");
    recoveryModal.classList.add("board--hidden");
  })
);

// Close Modal
const hideModalBtns = document.querySelectorAll("[data-modal-close]");

hideModalBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.target.closest(".overlay").classList.add("board--hidden");
  });
});
