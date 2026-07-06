/*==========================================================
SMARTSUPP LIVE CHAT
==========================================================*/

(function () {

    window._smartsupp = window._smartsupp || {};

    window._smartsupp.key = "06b0820360427a30e31786448a0ef171c452ec06";

    if (document.getElementById("smartsupp-loader")) return;

    const script = document.createElement("script");

    script.id = "smartsupp-loader";

    script.src = "https://www.smartsuppchat.com/loader.js";

    script.async = true;

    document.head.appendChild(script);

})();