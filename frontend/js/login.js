"use strict";

/*==========================================================
LOGIN
==========================================================*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginBtn = loginForm.querySelector("button[type='submit']");

    loginBtn.disabled = true;

    loginBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Signing In...
        `;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: document.getElementById("email").value.trim(),

          password: document.getElementById("password").value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message, "error");

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Login";

        return;
      }

      showToast(`Welcome back, ${data.user.username}! 👋`, "success");

      setTimeout(() => {
        window.location.href = data.redirect;
      }, 1800);
    } catch (error) {
      console.error(error);

      showToast("Unable to connect to server.", "error");

      loginBtn.disabled = false;

      loginBtn.innerHTML = "Login";
    }
  });
}
