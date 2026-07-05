"use strict";

/*==========================================================
CONTACT FORM
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if(!form) return;

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        showToast("Message sent successfully. We'll get back to you soon!");

        form.reset();

    });

});

"use strict";

/*==========================================================
FAQ ACCORDION
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const faqQuestions = document.querySelectorAll(".faq-question");

    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {

        question.addEventListener("click", () => {

            const currentItem = question.closest(".faq-item");
            const wrapper = currentItem.parentElement;

            // Close all other FAQs in the same section
            wrapper.querySelectorAll(".faq-item").forEach(item => {

                if (item !== currentItem) {

                    item.classList.remove("active");

                }

            });

            // Toggle the clicked FAQ
            currentItem.classList.toggle("active");

        });

    });

});