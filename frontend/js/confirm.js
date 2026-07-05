"use strict";

function showConfirm(title, message) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("confirmOverlay");

    const confirmTitle = document.getElementById("confirmTitle");

    const confirmMessage = document.getElementById("confirmMessage");

    const okBtn = document.getElementById("confirmOk");

    const cancelBtn = document.getElementById("confirmCancel");

    confirmTitle.textContent = title;

    confirmMessage.textContent = message;

    overlay.classList.add("show");

    function close(result) {
      overlay.classList.remove("show");

      okBtn.removeEventListener("click", okHandler);

      cancelBtn.removeEventListener("click", cancelHandler);

      overlay.removeEventListener("click", overlayHandler);

      resolve(result);
    }

    function okHandler() {
      close(true);
    }

    function cancelHandler() {
      close(false);
    }

    function overlayHandler(e) {
      if (e.target === overlay) {
        close(false);
      }
    }

    okBtn.addEventListener("click", okHandler);

    cancelBtn.addEventListener("click", cancelHandler);

    overlay.addEventListener("click", overlayHandler);
  });
}
