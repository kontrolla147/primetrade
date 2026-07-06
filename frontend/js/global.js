"use strict";

/* ==========================================================
   PrimeTrade
   GLOBAL.JS
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadComponents();

    initLoader();

    initScrollReveal();

    initCounter();

    initBackToTop();

    setCurrentYear();

});


/* ==========================================================
   LOAD COMPONENTS
==========================================================*/
async function loadComponents() {

    const navbar = document.getElementById("navbar");

    if (navbar) {

        const response = await fetch("/components/navbar.html");
navbar.innerHTML = await response.text();

if(typeof initNavbar === "function"){

    initNavbar();

}}

    const footer = document.getElementById("footer");

    if (footer) {

        const response = await fetch("/components/footer.html");

        footer.innerHTML = await response.text();

    }

}


/* ==========================================================
   LOADER
==========================================================*/

function initLoader(){

    const loader = document.querySelector(".loader");

    if(!loader) return;

    window.addEventListener("load",()=>{

        setTimeout(()=>{

            loader.classList.add("hide");

            setTimeout(()=>{

                loader.remove();

            },600);

        },2000); // stays visible for 2 seconds

    });

}


/* ==========================================================
   SCROLL REVEAL
==========================================================*/

function initScrollReveal(){

    const items=document.querySelectorAll(".fade-up");

    if(!items.length) return;

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:.15

    });

    items.forEach(item=>observer.observe(item));

}


/* ==========================================================
   COUNTER
==========================================================*/

function initCounter(){

    const counters=document.querySelectorAll("[data-counter]");

    if(!counters.length) return;

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                animateCounter(entry.target);

                observer.unobserve(entry.target);

            }

        });

    });

    counters.forEach(counter=>observer.observe(counter));

}


function animateCounter(element){

    const target=Number(element.dataset.counter);

    let count=0;

    const speed=target/100;

    function update(){

        count+=speed;

        if(count<target){

            element.textContent=Math.floor(count).toLocaleString();

            requestAnimationFrame(update);

        }else{

            element.textContent=target.toLocaleString();

        }

    }

    update();

}


/* ==========================================================
   BACK TO TOP
==========================================================*/

function initBackToTop(){

    const button=document.querySelector(".back-to-top");

    if(!button) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY>500){

            button.classList.add("show");

        }else{

            button.classList.remove("show");

        }

    });

    button.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}




/* ==========================================================
   MODAL
==========================================================*/

function openModal(id){

    const modal=document.getElementById(id);

    if(modal){

        modal.classList.add("show");

    }

}

function closeModal(id){

    const modal=document.getElementById(id);

    if(modal){

        modal.classList.remove("show");

    }

}


/* ==========================================================
   BUTTON LOADING
==========================================================*/

function startButtonLoading(button,text="Loading..."){

    if(!button) return;

    button.dataset.original=button.innerHTML;

    button.disabled=true;

    button.innerHTML=`<span class="spinner"></span> ${text}`;

}

function stopButtonLoading(button){

    if(!button) return;

    button.disabled=false;

    button.innerHTML=button.dataset.original;

}


/* ==========================================================
   COPY TEXT
==========================================================*/

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        showToast("Copied Successfully");

    }catch{

        showToast("Copy Failed","error");

    }

}


/* ==========================================================
   FORMATTERS
==========================================================*/

function formatCurrency(amount){

    return new Intl.NumberFormat("en-US",{

        style:"currency",

        currency:"USD"

    }).format(amount);

}

function formatNumber(number){

    return new Intl.NumberFormat().format(number);

}


/* ==========================================================
   YEAR
==========================================================*/

function setCurrentYear(){

    document.querySelectorAll(".current-year").forEach(year=>{

        year.textContent=new Date().getFullYear();

    });

}


function showToast(message, type = "success") {

    let container = document.getElementById("toast-container");

    if (!container) {

        container = document.createElement("div");

        container.id = "toast-container";

        document.body.appendChild(container);

    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },300);

    },3000);

}

