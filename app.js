/**
 * APP METEO CLI (Node.js)
 * Esecuzione: node app.js "Nome Città"
 */

const fs = require('fs');
const path = require('path');

// Configurazione Cache
const CACHE_FILE = path.join(__dirname, 'weather_cache.json');
const CACHE_TTL = 15 * 60 * 1000; // 15 Minuti

/**
 * Gestione Cache: Legge dal file locale se i dati sono recenti
 */
function getCachedData(city) {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    const entry = cache[city.toLowerCase()];
    
    if (entry && (Date.now() - entry.timestamp < CACHE_TTL)) {
        return entry.data;
    }
    return null;
}

/**
 * Salva i dati nel file di cache locale
 */
function saveToCache(city, data) {
    let cache = {};
    if (fs.existsSync(CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
    cache[city.toLowerCase()] = {
        timestamp: Date.now(),
        data: data
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function getWeather(cityName) {
    if (!cityName) {
        console.log("❌ Errore: Inserisci il nome di una città. Es: node app.js Roma");
        return;
    }

    // 1. Controllo Cache
    const cached = getCachedData(cityName);
    if (cached) {
        console.log("🚀 [CACHE] Dati recuperati localmente:");
        displayWeather(cached);
        return;
    }

    try {
        console.log(`🔍 Ricerca in corso per "${cityName}"...`);

        // 2. Geocoding (Nome -> Coordinate)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=it&format=json&fields=latitude,longitude,name,country`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results?.length) throw new Error("Città non trovata.");

        const { latitude, longitude, name, country } = geoData.results[0];

        // 3. Weather (Coordinate -> Meteo)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const result = {
            city: name,
            country: country,
            temp: weatherData.current.temperature_2m,
            wind: weatherData.current.wind_speed_10m,
            time: new Date().toLocaleTimeString()
        };

        // 4. Salva e Mostra
        saveToCache(cityName, result);
        console.log("☁️  [SERVER] Dati aggiornati scaricati:");
        displayWeather(result);

    } catch (error) {
        console.error("❌ Errore:", error.message);
    }
}

function displayWeather(data) {
    console.log(`---------------------------------`);
    console.log(`📍 Città:      ${data.city} (${data.country})`);
    console.log(`🌡️  Temp:       ${data.temp}°C`);
    console.log(`💨 Vento:      ${data.wind} km/h`);
    console.log(`🕒 Ora dati:   ${data.time}`);
    console.log(`---------------------------------`);
}

// Avvio
const inputCity = process.argv.slice(2).join(' ');
getWeather(inputCity);