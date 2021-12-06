
window.onload = (function(){



    !function(){

        const viewedHerokuAlert = localStorage.getItem("heroku-alert-view");

        if(!viewedHerokuAlert) {
            Toastify({
                text: document.querySelector("#alert-heroku").innerHTML,
                'backgroundColor': "deeppink",
                'duration': -1,
                'close' :true,
                'callback': function(){
                    localStorage.setItem("heroku-alert-view", true);
                }
            }).showToast();

        }

    }();


    const dev = false;
    
    const API_BASE_URL =  dev ? "http://localhost:8080" :`https://shibashortener.herokuapp.com`;
    const shortbtn = document.querySelector("#shortBtnAction");
    const inputURL = document.querySelector("#longUrl");
    const copyBtn = document.querySelector("#copyBtn");




    copyBtn.addEventListener("click", e => {

        navigator.clipboard.writeText(inputURL.value).then(result => {
            Toastify({
                text: "URL copiada para a área de transferência 🐕",
                duration: 3000,
                'backgroundColor': "deeppink"
            }).showToast();
        });


    });


    shortbtn.addEventListener("click", async e => {

        const spinner = document.querySelector("#spinnerLoading");
        spinner.classList.remove("d-none")
        const serverResponse = await fetch(`${API_BASE_URL}/shortening`, 
        {  
            method: "POST",
            body: JSON.stringify({longUrl: inputURL.value}),
            headers: {"Content-Type": "application/json"}
        });

        if(serverResponse.ok) {
            const shotenedUrl = await serverResponse.text();
            inputURL.value = shotenedUrl;
            spinner.classList.add("d-none");
            copyBtn.classList.remove("d-none");
            shortbtn.disabled = true;

        }else{
            Toastify({
                text: "Essa URL não parece certa pra mim... 🤔",
                duration: 3000,
                'backgroundColor': "deeppink"
            }).showToast();
            spinner.classList.add("d-none");
        }

        
    });

    inputURL.addEventListener("input", e => {
        if(e.target.value.trim() == "") {
            shortbtn.disabled = false;
            copyBtn.classList.add("d-none");
        }
    })


});