/*==========================================================
PRIMECOIN SIMULATED PRICE
==========================================================*/

let prmPrice = 0.5;

function updatePRM() {
  // Random movement between -1% and +1%
  const movement = (Math.random() * 2 - 1) / 100;

  prmPrice += prmPrice * movement;

  if (prmPrice < 0.3) prmPrice = 0.3;
  if (prmPrice > 2.0) prmPrice = 2.0;

  const change = movement * 100;

  document.getElementById("prm-price").textContent = "$" + prmPrice.toFixed(4);

  const changeElement = document.getElementById("prm-change");

  changeElement.textContent =
    (change >= 0 ? "+" : "") + change.toFixed(2) + "%";

  changeElement.style.color = change >= 0 ? "#16a34a" : "#dc2626";
}

updatePRM();

setInterval(updatePRM, 30000);

/*==========================================================
LIVE CRYPTO PRICES
==========================================================*/

/*==========================================================
LIVE CRYPTO PRICES
==========================================================*/

async function loadCryptoPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
    );

    const data = await response.json();

    document.getElementById("btc-price").textContent =
      "$" + data.bitcoin.usd.toLocaleString();

    document.getElementById("eth-price").textContent =
      "$" + data.ethereum.usd.toLocaleString();

    document.getElementById("usdt-price").textContent =
      "$" + data.tether.usd.toFixed(2);
  } catch (error) {
    console.error("Failed to load crypto prices", error);
  }
}

loadCryptoPrices();

/* Refresh every 30 seconds */

setInterval(loadCryptoPrices, 30000);

function updateCoin(prefix, price, change) {
  const priceElement = document.getElementById(prefix + "-price");

  const changeElement = document.getElementById(prefix + "-change");

  if (!priceElement || !changeElement) {
    console.error(prefix + " elements missing");

    return;
  }

  priceElement.textContent =
    "$" +
    Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    });

  changeElement.textContent =
    (change >= 0 ? "+" : "") + Number(change).toFixed(2) + "%";

  changeElement.className = change >= 0 ? "market-up" : "market-down";
}

/* ==========================================================
TRUST CARDS
========================================================== */

const trustCards = document.querySelectorAll(".trust-card");

trustCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-12px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0px)";
  });
});

/* ==========================================================
PLAN CARD EFFECT
========================================================== */

document.querySelectorAll(".plan-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    card.style.backgroundPosition = `${x}px ${y}px`;
  });
});

/* ==========================================================
PROFIT CALCULATOR
========================================================== */

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
  calculateBtn.addEventListener("click", () => {
    const amount = Number(document.getElementById("investmentAmount").value);

    const percent = Number(document.getElementById("investmentPlan").value);

    const days = Number(document.getElementById("investmentDays").value);

    if (!amount || amount <= 0) {
      showToast("Enter a valid investment amount", "error");

      return;
    }

    const profit = ((amount * percent) / 100) * days;

    const total = amount + profit;

    const reward = Math.floor(amount / 50);

    document.getElementById("profitResult").textContent =
      formatCurrency(profit);

    document.getElementById("totalResult").textContent = formatCurrency(total);

    document.getElementById("coinResult").textContent =
      reward.toLocaleString() + " PRM";
  });
}

/* ==========================================================
PRIMECOIN
========================================================== */

const coin = document.querySelector(".coin-logo");

if (coin) {
  coin.addEventListener("mouseenter", () => {
    coin.style.transform = "rotateY(360deg)";

    coin.style.transition = "1s";
  });

  coin.addEventListener("mouseleave", () => {
    coin.style.transform = "rotateY(0deg)";
  });
}

/* ==========================================================
STATISTICS CARD HOVER
========================================================== */

document.querySelectorAll(".stat-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = "0 30px 70px rgba(200,161,74,.18)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "";
  });
});

/* ==========================================================
REFERRAL ANIMATION
========================================================== */

const reward = document.querySelector(".reward");

if (reward) {
  setInterval(() => {
    reward.animate(
      [
        {
          transform: "scale(1)",
        },

        {
          transform: "scale(1.04)",
        },

        {
          transform: "scale(1)",
        },
      ],
      {
        duration: 2000,
      },
    );
  }, 3000);
}

/*==========================================================
PRIME TRADE TESTIMONIAL ENGINE
==========================================================*/

const testimonialData = [
  {
    name: "Michael Anderson",
    country: "🇺🇸 United States",
    rating: 5,
    text: "PrimeTrade has exceeded every expectation. The platform is elegant, secure and incredibly easy to use.",
  },

  {
    name: "Sophia Williams",
    country: "🇨🇦 Canada",
    rating: 5,
    text: "The dashboard is beautiful, transactions are smooth and the overall experience feels very professional.",
  },

  {
    name: "James Carter",
    country: "🇬🇧 United Kingdom",
    rating: 5,
    text: "I've finally found an investment platform that focuses on both security and user experience.",
  },

  {
    name: "Emma Brown",
    country: "🇦🇺 Australia",
    rating: 5,
    text: "Everything feels premium. From registration to customer support, PrimeTrade has been outstanding.",
  },
  {
    name: "Sarah Johnson",
    country: "🇺🇸 United States",
    rating: 5,
    text: "I've been investing for years, and PrimeTrade is one of the most professional platforms I've used. Everything feels secure and transparent.",
},
{
    name: "Daniel Brown",
    country: "🇨🇦 Canada",
    rating: 5,
    text: "Withdrawals are processed quickly and the dashboard makes it easy to monitor my investments every day.",
},
{
    name: "Emma Thompson",
    country: "🇬🇧 United Kingdom",
    rating: 5,
    text: "Excellent customer support and a beautiful platform. I always feel informed about my investment performance.",
},
{
    name: "Luca Rossi",
    country: "🇮🇹 Italy",
    rating: 5,
    text: "The investment plans are simple to understand and the user experience is outstanding. Highly recommended.",
},
{
    name: "Carlos Martinez",
    country: "🇪🇸 Spain",
    rating: 5,
    text: "PrimeTrade has helped me diversify my crypto portfolio with confidence. Everything works smoothly.",
},
{
    name: "Sophie Martin",
    country: "🇫🇷 France",
    rating: 5,
    text: "I joined a few months ago and the experience has been exceptional. The interface is modern and easy to navigate.",
},
{
    name: "Noah Williams",
    country: "🇦🇺 Australia",
    rating: 5,
    text: "I appreciate the transparency and the daily portfolio updates. It's exactly what I was looking for.",
},
{
    name: "Benjamin Müller",
    country: "🇩🇪 Germany",
    rating: 5,
    text: "Professional service with an impressive investment dashboard. Everything feels premium.",
},
{
    name: "James Wilson",
    country: "🇳🇿 New Zealand",
    rating: 5,
    text: "The platform is fast, reliable and incredibly easy to use. My investment experience has been excellent.",
},
{
    name: "Ahmed Hassan",
    country: "🇦🇪 United Arab Emirates",
    rating: 5,
    text: "PrimeTrade combines security with a premium experience. I especially like the portfolio management tools.",
},
{
    name: "Olivia White",
    country: "🇮🇪 Ireland",
    rating: 5,
    text: "Everything from registration to investing was straightforward. The support team was very responsive.",
},
{
    name: "Michael Lee",
    country: "🇸🇬 Singapore",
    rating: 5,
    text: "A reliable investment platform with excellent design and useful features for both beginners and experienced investors.",
},
{
    name: "Grace Kim",
    country: "🇰🇷 South Korea",
    rating: 5,
    text: "PrimeTrade makes cryptocurrency investing much less intimidating. The dashboard is clean and informative.",
},
{
    name: "Victor Silva",
    country: "🇧🇷 Brazil",
    rating: 5,
    text: "The referral rewards and investment plans are impressive. I've enjoyed every part of my experience so far.",
},
{
    name: "Linda Cooper",
    country: "🇿🇦 South Africa",
    rating: 5,
    text: "I was surprised by how smooth everything works. Deposits, tracking and account management are all seamless.",
},
{
    name: "Henry Taylor",
    country: "🇳🇬 Nigeria",
    rating: 5,
    text: "PrimeTrade has exceeded my expectations with its premium interface and reliable investment tools.",
},
{
    name: "Maria Fernandez",
    country: "🇲🇽 Mexico",
    rating: 5,
    text: "The platform is intuitive and I enjoy tracking my portfolio growth every day. Fantastic experience.",
},
{
    name: "Ethan Walker",
    country: "🇨🇭 Switzerland",
    rating: 5,
    text: "Excellent security features and a professional investment environment. Definitely one of my favorite platforms.",
},
{
    name: "Isabella Costa",
    country: "🇵🇹 Portugal",
    rating: 5,
    text: "Everything about PrimeTrade feels premium—from the design to the customer support and investment features.",
},
{
    name: "Thomas Anderson",
    country: "🇸🇪 Sweden",
    rating: 5,
    text: "The platform is polished, reliable and easy to use. I would confidently recommend PrimeTrade to other investors.",
},

  {
    name: "David Wilson",
    country: "🇩🇪 Germany",
    rating: 5,
    text: "PrimeTrade makes investing simple. I appreciate the clean interface and transparent experience.",
  },
];

/*==========================================================*/

const testimonialText = document.getElementById("testimonialText");
const testimonialName = document.getElementById("testimonialName");
const testimonialCountry = document.getElementById("testimonialCountry");

const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");

const testimonialCard = document.querySelector(".testimonial-card");

const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

let autoSlide;

/*==========================================================*/

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

/*==========================================================*/

function renderTestimonial(index) {
  const item = testimonialData[index];

  testimonialCard.style.opacity = "0";

  testimonialCard.style.transform = "translateY(15px)";

  setTimeout(() => {
    testimonialText.textContent = item.text;

    testimonialName.textContent = item.name;

    testimonialCountry.textContent = item.country;

    testimonialCard.style.opacity = "1";

    testimonialCard.style.transform = "translateY(0)";

    updateDots();
  }, 350);
}

/*==========================================================*/

function nextTestimonial() {
  currentIndex++;

  if (currentIndex >= testimonialData.length) {
    currentIndex = 0;
  }

  renderTestimonial(currentIndex);
}

/*==========================================================*/

function previousTestimonial() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = testimonialData.length - 1;
  }

  renderTestimonial(currentIndex);
}

/*==========================================================*/

function randomTestimonial() {
  let random;

  do {
    random = Math.floor(Math.random() * testimonialData.length);
  } while (random === currentIndex);

  currentIndex = random;

  renderTestimonial(currentIndex);
}

/*==========================================================*/

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    clearInterval(autoSlide);

    nextTestimonial();

    startAuto();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    clearInterval(autoSlide);

    previousTestimonial();

    startAuto();
  });
}

/*==========================================================*/

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    clearInterval(autoSlide);

    currentIndex = index;

    renderTestimonial(currentIndex);

    startAuto();
  });
});

/*==========================================================*/

function startAuto() {
  autoSlide = setInterval(() => {
    randomTestimonial();
  }, 8000);
}

/*==========================================================*/

renderTestimonial(currentIndex);

startAuto();

/*==========================================================
FAQ
==========================================================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    faqItems.forEach((faq) => {
      if (faq !== item) {
        faq.classList.remove("active");
      }
    });

    item.classList.toggle("active");
  });
});

/*==========================================================
NEWSLETTER
==========================================================*/

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector("input").value.trim();

    if (email === "") {
      showToast("Please enter your email.", "error");

      return;
    }

    showToast("Thank you for subscribing!", "success");

    newsletterForm.reset();
  });
}

/*==========================================================
PREMIUM SHOWCASE
==========================================================*/

const showcaseData = [
  {
    image: "assets/images/showcase1.jpg",

    title: "Secure Investing.<br>Built For The Future.",

    text: "PrimeTrade protects every investment with bank-level security, advanced encryption and professional asset management.",
  },

  {
    image: "assets/images/showcase2.jpg",

    title: "Grow Your Wealth.<br>Without Limits.",

    text: "Discover premium investment opportunities designed for consistent long-term financial growth.",
  },

  {
    image: "assets/images/showcase3.jpg",

    title: "Smart Investing.<br>Powered By Innovation.",

    text: "Advanced technology and professional portfolio management help maximize your investment potential.",
  },

  {
    image: "assets/images/showcase4.jpg",

    title: "Trusted Across<br>180+ Countries.",

    text: "Join thousands of investors worldwide building wealth with PrimeTrade's secure investment ecosystem.",
  },

  {
    image: "assets/images/showcase5.jpg",

    title: "Your Financial Future<br>Starts Today.",

    text: "Experience modern investing with transparent plans, fast withdrawals and world-class support.",
  },
];

/*==========================================================*/

const image = document.getElementById("showcaseImage");

const title = document.getElementById("showcaseTitle");

const text = document.getElementById("showcaseText");

const dotss = document.querySelectorAll(".showcase-dots .dot");

const next = document.querySelector(".showcase-arrow.next");

const prev = document.querySelector(".showcase-arrow.prev");

const slider = document.querySelector(".premium-showcase");

let current = 0;

let auto;

/*==========================================================*/

function renderSlide(index) {
  image.style.opacity = "0";

  title.style.opacity = "0";

  text.style.opacity = "0";

  setTimeout(() => {
    image.src = showcaseData[index].image;

    title.innerHTML = showcaseData[index].title;

    text.innerHTML = showcaseData[index].text;

    image.style.opacity = "1";

    title.style.opacity = "1";

    text.style.opacity = "1";

    dots.forEach((dot) => dot.classList.remove("active"));

    dots[index].classList.add("active");
  }, 350);
}

/*==========================================================*/

function randomSlide() {
  let random;

  do {
    random = Math.floor(Math.random() * showcaseData.length);
  } while (random === current);

  current = random;

  renderSlide(current);
}

/*==========================================================*/

function nextSlide() {
  current++;

  if (current >= showcaseData.length) {
    current = 0;
  }

  renderSlide(current);
}

/*==========================================================*/

function prevSlide() {
  current--;

  if (current < 0) {
    current = showcaseData.length - 1;
  }

  renderSlide(current);
}

/*==========================================================*/

function startSlider() {
  auto = setInterval(() => {
    randomSlide();
  }, 6000);
}

function stopSlider() {
  clearInterval(auto);
}

/*==========================================================*/

if (next) {
  next.addEventListener("click", () => {
    stopSlider();

    nextSlide();

    startSlider();
  });
}

if (prev) {
  prev.addEventListener("click", () => {
    stopSlider();

    prevSlide();

    startSlider();
  });
}

/*==========================================================*/

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    stopSlider();

    current = index;

    renderSlide(current);

    startSlider();
  });
});

/*==========================================================*/

if (slider) {
  slider.addEventListener("mouseenter", stopSlider);

  slider.addEventListener("mouseleave", startSlider);
}

/*==========================================================
MOBILE SWIPE
==========================================================*/

let startX = 0;

let endX = 0;

if (slider) {
  slider.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;

    if (endX < startX - 50) {
      stopSlider();

      nextSlide();

      startSlider();
    }

    if (endX > startX + 50) {
      stopSlider();

      prevSlide();

      startSlider();
    }
  });
}

/*==========================================================*/

renderSlide(current);

startSlider();
