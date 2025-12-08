const resetAccountPassword = document.querySelectorAll(".reset-account-password");

resetAccountPassword.forEach((password) => {
  password.addEventListener("input", function (e) {
    const value = this.value;
    console.log(value);
    this.value = value.replace(/./g, "*");
  });
});
