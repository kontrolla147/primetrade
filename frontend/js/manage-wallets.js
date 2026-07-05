"use strict";

/*==========================================================
VERIFY ADMIN
==========================================================*/

async function verifyAdmin(){

    try{

        const response = await fetch(

            "/api/admin/verify",

            {

                credentials:"include"

            }

        );

        if(!response.ok){

            window.location.href="/admin/admin-control.html";

            return false;

        }

        return true;

    }

    catch(error){

        window.location.href="/admin/admin-control.html";

        return false;

    }

}

/*==========================================================
ELEMENTS
==========================================================*/

const walletForm=document.getElementById("walletForm");

const btcWallet=document.getElementById("btcWallet");

const ethWallet=document.getElementById("ethWallet");

const trcWallet=document.getElementById("trcWallet");

const ercWallet=document.getElementById("ercWallet");

const saveButton=document.getElementById("saveWallets");

/*==========================================================
INITIALIZE
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        const authenticated=

        await verifyAdmin();

        if(!authenticated) return;

        loadWallets();

    }

);

/*==========================================================
LOAD WALLETS
==========================================================*/

async function loadWallets(){

    try{

        const response=await fetch(

            "/api/admin/wallets",

            {

                credentials:"include"

            }

        );

        const result=

        await response.json();

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            return;

        }

        btcWallet.value=result.wallets.BTC || "";

        ethWallet.value=result.wallets.ETH || "";

        trcWallet.value=result.wallets.USDT_TRC20 || "";

        ercWallet.value=result.wallets.USDT_ERC20 || "";

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load wallets.",

            "error"

        );

    }

}


/*==========================================================
SAVE WALLETS
==========================================================*/

walletForm.addEventListener(

    "submit",

    async(event)=>{

        event.preventDefault();

        saveButton.disabled = true;

        saveButton.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Saving...

        `;

        try{

            const response = await fetch(

                "/api/admin/wallets",

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    credentials:"include",

                    body:JSON.stringify({

                        BTC:btcWallet.value.trim(),

                        ETH:ethWallet.value.trim(),

                        USDT_TRC20:trcWallet.value.trim(),

                        USDT_ERC20:ercWallet.value.trim()

                    })

                }

            );

            const result = await response.json();

            if(!response.ok){

                showToast(

                    result.message,

                    "error"

                );

                resetButton();

                return;

            }

            showToast(

                "Wallet addresses updated successfully.",

                "success"

            );

            resetButton();

            loadWallets();

        }

        catch(error){

            console.error(error);

            showToast(

                "Unable to save wallet addresses.",

                "error"

            );

            resetButton();

        }

    }

);

/*==========================================================
RESET BUTTON
==========================================================*/

function resetButton(){

    saveButton.disabled = false;

    saveButton.innerHTML = `

        <i class="fa-solid fa-floppy-disk"></i>

        Save Wallet Addresses

    `;

}