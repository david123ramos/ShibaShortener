window.onload = (function() {

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
    const inputShortUrl = document.querySelector("#shortUrl");
    const searchBtn = document.querySelector("#searchBtn");
    const statisticsInfo = document.querySelector("#statistics-info");
    const template = document.querySelector("#card-template").innerHTML;
    const shibaLoadingDiv = document.querySelector("#shibaLoading");

    const baseURL = dev ? "http://localhost:8080" : "https://shibashortener.herokuapp.com";

    
    searchBtn.addEventListener("click", async e => {

        const value = inputShortUrl.value;
        const sanitizedURL = validateUrl(value);

        if(sanitizedURL !=null && sanitizedURL?.trim() != "") {

            shibaLoadingDiv.classList.remove("d-none");

            const response = await fetch(`${baseURL}/analytics/${sanitizedURL}`, {method: "GET"});

            if(response.ok) {
                const json = await response.json();
                shibaLoadingDiv.classList.add("d-none");
                const rendered = renderStatistics(template, json);
                statisticsInfo.innerHTML = rendered;
                
                return;
            }

            shibaLoadingDiv.classList.add("d-none");
            Toastify({
                text: "Aconteceu algum erro esquisito...🤨",
                duration: 3000,
                'backgroundColor': "red"
            }).showToast();

            
        }else{ 
            Toastify({
                text: "Esta não parecer ser uma URL válida🥺",
                duration: 3000,
                'backgroundColor': "red"
            }).showToast();
        }
    });

});

/**
 * Validate URL
 * @param {*} shortURL 
 * @returns {String | null}
 */
function validateUrl(shortURL) {

    if(shortURL != null) {
        try {
            const url = new URL(shortURL);
            if(shortURL.includes("http://") || shortURL.includes("https://")) {
                
                return url.pathname.replace("/", "");
            }else {
    
                return url.pathname.substring(url.pathname.lastIndexOf("/")+1)
            }
        }catch(err) {
           return null
        }
    }

    return null;
}


/**
 * Used to render analytics of URL.
 * @param {String} template HTML string
 * @param {Object} insights Object returned from analytical endpoint
 * @returns {String}
 */
function renderStatistics(template, insights) {
   
    const params = {
        id: insights.id,
        createdDay : Intl.DateTimeFormat("pt-br").format(new Date(insights?.createdAt)),
        existingDays : insights.existingDays > 1 ? `${insights.existingDays} dias` : `${insights.existingDays} dia`,
        totalClicks: insights.totalClicks,
        clicksPerDay : insights.clicksPerDay,
        period: insights.mostVistedPeriod == "Day" ? "do dia ☀️" : "da noite 🌙",
        os: Object.keys(insights.visitorsByOs).length > 0 ? Object.keys(insights.visitorsByOs).reduce((a, b) => { return insights.visitorsByOs[a] > insights.visitorsByOs[b] ? a : b }) : "URL ainda não acessada" //get most used os
    }
    
    return Mustache.render(template, params);
}