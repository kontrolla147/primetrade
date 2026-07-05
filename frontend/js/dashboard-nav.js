"use strict";

/*==========================================================
DASHBOARD NAVIGATION
==========================================================*/

document.addEventListener("componentsLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const logoutBtn = document.getElementById("logoutBtn");

    /*==========================================================
PREVENT SIDEBAR CLICKS FROM CLOSING
==========================================================*/

if (sidebar) {

    sidebar.addEventListener("click", (e) => {

        e.stopPropagation();

    });

}
    /*==========================================================
    OPEN SIDEBAR
    ==========================================================*/

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("show");

        if (overlay) {
            overlay.classList.add("show");
        }

        if (openBtn) {
            openBtn.classList.add("hide");
        }

        document.body.style.overflow = "hidden";

    }

    /*==========================================================
    CLOSE SIDEBAR
    ==========================================================*/

    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("show");

        if (overlay) {
            overlay.classList.remove("show");
        }

        if (openBtn) {
            openBtn.classList.remove("hide");
        }

        document.body.style.overflow = "auto";

    }

    /*==========================================================
    EVENTS
    ==========================================================*/

    if (openBtn) {

        openBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    openSidebar();

});

    }

    if (closeBtn) {

        closeBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    closeSidebar();

});

    }

    if (overlay) {

       overlay.addEventListener("click", (e) => {

    if (e.target === overlay) {

        closeSidebar();

    }

});

    }

    /*==========================================================
    ACTIVE MENU
    ==========================================================*/

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar-menu a").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        const page = href.split("/").pop();

        if (page === currentPage) {

            link.classList.add("active");

        }

    });

    /*==========================================================
    LOGOUT
    ==========================================================*/

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            const confirmed = await showConfirm(

                "Logout",

                "Are you sure you want to logout?"

            );

            if (!confirmed) return;

            try {

                const response = await fetch("/api/auth/logout", {

                    method: "POST",

                    credentials: "include"

                });

                const result = await response.json();

                if (!response.ok) {

                    showToast(result.message, "error");

                    return;

                }

                showToast("Logged out successfully.", "success");

                setTimeout(() => {

                    window.location.href = "/pages/login.html";

                }, 1000);

            }

            catch (error) {

                console.error(error);

                showToast("Unable to logout.", "error");

            }

        });

    }
/*==========================================================
TRANSACTION DROPDOWN
==========================================================*/

const transactionToggle = document.getElementById("transactionToggle");

const transactionMenu = document.getElementById("transactionMenu");

const dropdownArrow = document.querySelector(".dropdown-arrow");

if (
    transactionToggle &&
    transactionMenu &&
    dropdownArrow
) {

    transactionToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        transactionMenu.classList.toggle("show");

        dropdownArrow.classList.toggle("rotate");

    });

}


    /*==========================================================
    RESIZE
    ==========================================================*/

    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            closeSidebar();

        }

    });

});


