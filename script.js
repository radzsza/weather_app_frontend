document.getElementById("location-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const lat = parseFloat(document.getElementById("lat-input").value);
    const lon = parseFloat(document.getElementById("lon-input").value);
    
    fetchForecast(lat, lon);
    fetchSummary(lat, lon);
    });

    function fetchForecast(lat, lon) {
    fetch(`https://weather-app-backend-5s7v.onrender.com/forecast/daily?lat=${lat}&lon=${lon}`)
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.detail);
                });
            }
            return res.json();
        })
        .then((data) => showForecast(data))
        .catch((err) => alert(err.message));
    }

    function fetchSummary(lat, lon) {
    fetch(`https://weather-app-backend-5s7v.onrender.com/forecast/summary?lat=${lat}&lon=${lon}`)
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.detail);
                });
            }
            return res.json();
        })
        .then((data) => showSummary(data))
        .catch((err) => alert(err.message));
    }

    function showForecast(data) {
        const header = document.getElementById("forecast-header")
        header.style.textAlign = "left";
        header.innerText = "Prognoza 7-dniowa";
        const body = document.getElementById("forecast-body");

        body.innerHTML = "";

        //daty
        const dateRow = document.createElement("tr");
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        data.daily.time.forEach(date => {
            dateRow.innerHTML += `<td>${new Date(date).toLocaleDateString('pl-PL', options)}</td>`;
        });
        body.appendChild(dateRow);

        //ikonki pogody + wc
        const weatherRow = document.createElement("tr");
        data.daily.weather_code.forEach(code => {
            let weatherCell = document.createElement("td");
            let iconClass = getWeatherIcon(code)
            weatherCell.innerHTML = `<i class="${iconClass}" style="font-size: 50px; padding: 20px"></i>`
            weatherRow.appendChild(weatherCell)
        })
        body.appendChild(weatherRow)

        //temperatury min/max
        //generowana energia
        const tempRow = document.createElement("tr");
        const enRow = document.createElement("tr")
        
        for(let i = 0; i<7; i++){
            let cellTemp = document.createElement("td");
            cellTemp.innerText =  `${data.daily.temperature_2m_min[i]}°C / ${data.daily.temperature_2m_max[i]}°C`
            tempRow.appendChild(cellTemp);

            let cellEnergy = document.createElement("td");
            cellEnergy.innerText = `${data.daily.energy[i].toFixed(2)}kWh`
            enRow.appendChild(cellEnergy);
        }
        body.appendChild(tempRow);
        body.appendChild(enRow);

        
    }

    function getWeatherIcon(code) {
        if(code == 0) return "fa-solid fa-sun";
        if(code == 1 || code == 2) return "fa-solid fa-cloud-sun";
        if(code == 3) return "fa-solid fa-cloud";
        if(code >= 45 && code <= 48) return "fa-solid fa-smog";
        if(code >= 51 && code <= 57) return "fa-solid fa-cloud-sun-rain";
        if(code >= 61 && code <= 67) return "fa-solid fa-cloud-rain";
        if((code >= 71 && code <= 77) || code == 85 || code == 86) return "fa-solid fa-snowflake";
        if(code >= 80 && code <= 82) return "fa-solid fa-cloud-showers-heavy";
        if(code >= 95 && code <= 98) return "fa-solid fa-cloud-bolt";
        return "fa-solid fa-question";
    }

    function showSummary(data) {
    const container = document.getElementById("summary-container");
    container.innerHTML = `
        <h2>Podsumowanie tygodnia</h2>
        <ul>
        <li>Średnie ciśnienie: ${data.avg_surface_pressure}hPa</li>
        <li>Średnie nasłonecznienie: ${data.avg_sunshine_duration}h</li>
        <li>Skrajne temperatury: ${data.temperature_min}°C / ${data.temperature_max}°C</li>
        <li>Opis tygodnia: ${data.weather_summary}</li>
        </ul>
    `;
    }

document.getElementById("darkmode-toggle").addEventListener("change", function() {
    document.body.classList.toggle("dark-mode", this.checked);
});
