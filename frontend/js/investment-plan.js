/*==========================================================
INVESTMENT CALCULATOR
==========================================================*/

const calculateBtn = document.getElementById("calculateInvestment");

if(calculateBtn){

    calculateBtn.addEventListener("click",calculateInvestment);

}

function calculateInvestment(){

    const amount = Number(document.getElementById("investmentAmount").value);

    const plan = document.getElementById("planSelect").value;

    if(!amount || amount <= 0){

        alert("Please enter a valid investment amount.");

        return;

    }

    let percent = 0;
    let duration = "";

    switch(plan){

        case "starter":
            percent = 8;
            duration = "7 Days";
            break;

        case "silver":
            percent = 15;
            duration = "14 Days";
            break;

        case "gold":
            percent = 28;
            duration = "30 Days";
            break;

        case "vip":
            percent = 45;
            duration = "Custom";
            break;

    }

    const profit = amount * (percent / 100);

    const total = amount + profit;

    document.getElementById("estimatedReturn").textContent =
        "$" + total.toLocaleString(undefined,{maximumFractionDigits:2});

    document.getElementById("summaryInvestment").textContent =
        "$" + amount.toLocaleString();

    document.getElementById("summaryProfit").textContent =
        "$" + profit.toLocaleString(undefined,{maximumFractionDigits:2});

    document.getElementById("summaryDuration").textContent =
        duration;

}

document.querySelectorAll(".faq-question").forEach(question=>{

    question.addEventListener("click",()=>{

        const item=question.parentElement;

        document.querySelectorAll(".faq-item").forEach(faq=>{

            if(faq!==item){

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});