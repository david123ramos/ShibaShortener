window.onload = (function() {

    const dev = true;
    const inputShortUrl = document.querySelector("#shortUrl");
    const searchBtn = document.querySelector("#searchBtn");
    const statisticsInfo = document.querySelector("#statistics-info");
    const template = document.querySelector("#card-template").innerHTML;

    const baseURL = dev ? "http://localhost:8080" : "https://shibashortener.herokuapp.com";

    
    searchBtn.addEventListener("click", async e => {

        const value = inputShortUrl.value;

        if(value != null) {

            const sanitizedURL = sanitizeUrl(value);

            if(sanitizedURL?.trim() != "") {
                const response = await fetch(`${baseURL}/analytics/${sanitizedURL}`, {method: "GET"});

                if(response.ok) {
                    const json = await response.json();
                    console.log(json);
        
                    const params = {
                        id: json.id,
                        createdDay : Intl.DateTimeFormat("pt-br").format(new Date(json?.createdAt)),
                        existingDays : json.existingDays > 1 ? `${json.existingDays} dias` : `${json.existingDays} dia`,
                        totalClicks: json.totalClicks,
                        clicksPerDay : json.clicksPerDay,
                        period: json.mostVistedPeriod == "Day" ? "do dia ☀️" : "da noite 🌙",
                        os: Object.keys(json.visitorsByOs).reduce((a, b) => { return json.visitorsByOs[a] > json.visitorsByOs[b] ? a : b }) //get most used os
                    }
                    
                    const rendered = Mustache.render(template, params);
                    statisticsInfo.innerHTML = rendered;
                    return;
                }

                Toastify({
                    text: "Aconteceu algum erro esquisito...🤨",
                    duration: 3000,
                    'backgroundColor': "red"
                }).showToast();


    
                
            }else{ 
                Toastify({
                    text: "Esta não parecer ser uma URL do shib.sr 🥺",
                    duration: 3000,
                    'backgroundColor': "red"
                }).showToast();
            }


        }


    });









});

function sanitizeUrl(shortURL) {


    

    //TODO sanitize URL;
    try {
        if(shortURL.includes("http://") || shortURL.includes("https://")) {
            const url = new URL(shortURL);
            return url.pathname.replace("/", "");
        }else {
            return shortURL.substring(shortURL.lastIndexOf("/")+1)
        }
    }catch(err) {
       
    }

}