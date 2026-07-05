"use strict";

/*==========================================================
VERIFY ADMIN SESSION
==========================================================*/

async function verifyAdmin() {
  try {
    const response = await fetch(
      "/api/admin/verify",

      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      window.location.href = "/admin/admin-control.html";

      return false;
    }

    return true;
  } catch (error) {
    window.location.href = "/admin/admin-control.html";

    return false;
  }
}

/*==========================================================
INITIALIZE
==========================================================*/

document.addEventListener("componentsLoaded", async () => {
  const authenticated = await verifyAdmin();

  if (!authenticated) return;

  initializeSidebar();
});

/*==========================================================
SIDEBAR
==========================================================*/

function initializeSidebar() {
  const sidebar = document.getElementById("manageSidebar");

  const openBtn = document.getElementById("openManageSidebar");

  const closeBtn = document.getElementById("closeManageSidebar");

  const overlay = document.getElementById("manageOverlay");

  const logoutBtn = document.getElementById("adminLogoutBtn");

  /*==========================================================
    OPEN SIDEBAR
    ==========================================================*/

  function openSidebar() {
    sidebar.classList.add("show");

    overlay.classList.add("show");

    document.body.style.overflow = "hidden";
  }

  /*==========================================================
    CLOSE SIDEBAR
    ==========================================================*/

  function closeSidebar() {
    sidebar.classList.remove("show");

    overlay.classList.remove("show");

    document.body.style.overflow = "auto";
  }

  /*==========================================================
    EVENTS
    ==========================================================*/

  openBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    openSidebar();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();

    closeSidebar();
  });

  overlay?.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      closeSidebar();
    }
  });

  /*==========================================================
    ACTIVE PAGE
    ==========================================================*/

  const currentPage = window.location.pathname.split("/").pop();

  document
    .querySelectorAll(".manage-menu a")

    .forEach((link) => {
      const href = link.getAttribute("href").split("/").pop();

      if (href === currentPage) {
        link.classList.add("active");
      }
    });

  /*==========================================================
    LOGOUT
    ==========================================================*/

  logoutBtn?.addEventListener("click", async () => {
    const confirmed = await showConfirm(
      "Logout",

      "Are you sure you want to logout?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        "/api/admin/logout",

        {
          method: "POST",

          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(
          result.message,

          "error",
        );

        return;
      }

      showToast(
        "Logged out successfully.",

        "success",
      );

      setTimeout(() => {
        window.location.href = "/admin/admin-control.html";
      }, 800);
    } catch (error) {
      console.error(error);

      showToast(
        "Unable to logout.",

        "error",
      );
    }
  });
}



"use strict";

/*==========================================================
CONFIRM MODAL
==========================================================*/

function showConfirm(title, message) {

    return new Promise((resolve) => {

        const overlay = document.getElementById("confirmOverlay");

        const titleEl = document.getElementById("confirmTitle");

        const messageEl = document.getElementById("confirmMessage");

        const cancelBtn = document.getElementById("confirmCancel");

        const okBtn = document.getElementById("confirmOk");

        titleEl.textContent = title;

        messageEl.textContent = message;

        overlay.classList.add("show");

        function cleanup(result) {

            overlay.classList.remove("show");

            okBtn.removeEventListener("click", okHandler);

            cancelBtn.removeEventListener("click", cancelHandler);

            overlay.removeEventListener("click", overlayHandler);

            resolve(result);

        }

        function okHandler() {

            cleanup(true);

        }

        function cancelHandler() {

            cleanup(false);

        }

        function overlayHandler(event) {

            if (event.target === overlay) {

                cleanup(false);

            }

        }

        okBtn.addEventListener("click", okHandler);

        cancelBtn.addEventListener("click", cancelHandler);

        overlay.addEventListener("click", overlayHandler);

    });

}