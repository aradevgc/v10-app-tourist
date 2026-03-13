const WEATHER_API_KEY = '6b7544d0598d5f48b626dd9730f1c55b';
const TRANSIT_API_KEY = 'ICA4VWMb9Zw39TwQ8jyhKb9fjNPAJVHf';

document.addEventListener('DOMContentLoaded', () => {
    initDynamicGreeting();
    initAutoDate();
    fetchWeather();
    initCountdowns();
    initLiveLocation();
});

function initDynamicGreeting() {
    const h = new Date().getHours();
    const el = document.getElementById('greeting');
    if (!el) return;
    if (h >= 6 && h < 13) el.innerHTML = "Bon dia!! ☀️";
    else if (h >= 13 && h < 20) el.innerHTML = "Bona tarda!! 🌤️";
    else el.innerHTML = "Bona nit!! 🌙";
}

function initAutoDate() {
    const el = document.getElementById('current-date');
    if (el) el.innerText = new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' });
}

async function fetchWeather() {
    const el = document.getElementById('temp');
    if (!el) return;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Milan&units=metric&appid=${WEATHER_API_KEY}`);
        const data = await res.json();
        el.innerHTML = `${Math.round(data.main.temp)} C° ${data.weather[0].main === 'Clear' ? '☀️' : '☁️'}`;
    } catch (e) { el.innerText = "22 C° ☁️"; }
}

function initCountdowns() {
    const update = () => {
document.querySelectorAll('.countdown').forEach(c => {
const [th, tm] = c.dataset.time.split(':');
const now = new Date();
const target = new Date();

target.setHours(th, tm, 0, 0);

// Si la hora ya pasó hoy, ponemos el target para mañana
if (target < now) {
target.setDate(target.getDate() + 1);
}

const diff = target - now;

const h = Math.floor(diff / (1000 * 60 * 60));
const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

c.innerText = `${h}h ${m}m`;
});

    };
    update();
    setInterval(update, 60000);
}

function initLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const mapDiv = document.getElementById('mini-map');
            if (mapDiv) {
                mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${pos.coords.longitude-0.005},${pos.coords.latitude-0.005},${pos.coords.longitude+0.005},${pos.coords.latitude+0.005}&layer=mapnik"></iframe>`;
            }
        });
    }
}

// Transitland Search
async function searchTransport(type) {
    const resDiv = document.getElementById('transit-results');
    resDiv.innerHTML = "<p>Buscant...</p>";
    try {
        const res = await fetch(`https://transit.land/api/v2/rest/routes?bbox=9.04,45.38,9.27,45.53&route_type=${type}&api_key=${TRANSIT_API_KEY}`);
        const data = await res.json();
        resDiv.innerHTML = data.routes.slice(0, 4).map(r => `<div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.1)"><strong>${r.route_short_name || 'Línia'}</strong>: ${r.route_long_name}</div>`).join('');
    } catch (e) { resDiv.innerHTML = "<p>Error en la API de Transitland.</p>"; }
}
