"use strict";

/*==========================================================
ABOUT FAQ
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".about-faq .faq-item");

    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {

            // Close all other FAQs
            faqItems.forEach(faq => {

                if (faq !== item) {

                    faq.classList.remove("active");

                }

            });

            // Toggle current FAQ
            item.classList.toggle("active");

        });

    });

});