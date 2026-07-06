"use strict";
function initNavbar(){

    const navbar = document.querySelector(".navbar");
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".mobile-sidebar");
    const overlay = document.querySelector(".mobile-overlay");

    if(!navbar || !menuBtn || !sidebar || !overlay) return;

     function navbarScroll() {
        if (window.scrollY > 40) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    }

    navbarScroll();
    window.addEventListener("scroll", navbarScroll);

    /* Open Sidebar */

    function openMenu() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        menuBtn.classList.add("active");
        document.body.classList.add("menu-open");
    }

    /* Close Sidebar */

    function closeMenu() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        menuBtn.classList.remove("active");
        document.body.classList.remove("menu-open");
    }

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            if (sidebar.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    overlay?.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
        }
    });

    document.querySelectorAll(".sidebar-nav a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    /* Active Page */

    const current = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".desktop-links a, .sidebar-nav a").forEach(link => {

        const page = link.getAttribute("href").split("/").pop();

        if (page === current) {
            link.classList.add("active");
        }

    });

}

   