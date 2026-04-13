/**
 * Recupera e visualizza la previsione meteo per i prossimi 5 giorni.
 * @param {string} cityName - Nome della città da cercare.
 */
async function get5DayForecast(cityName) {
  if (!cityName) {
    console.log("Uso: node app.js Roma");
    return;
  }

  try {
    // 1. Geocodifica (Nome -> Coordinate)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=it&format=json&fields=latitude,longitude,name,country`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results?.length) throw new Error("Città non trovata.");

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Previsione 5 giorni (Parametri: daily)
    // Chiediamo temperatura massima, minima e codice meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5`;
    
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    console.log(`\n📅 Previsione 5 giorni per: ${name} (${country})`);
    console.log(`-------------------------------------------------`);

    // 3. Iterazione sui dati ricevuti
    const daily = weatherData.daily;
    
    daily.time.forEach((date, index) => {
      const maxTemp = daily.temperature_2m_max[index];
      const minTemp = daily.temperature_2m_min[index];
      const code = daily.weathercode[index];
      
      // Trasformiamo il codice meteo in una piccola descrizione/emoji
      const emoji = getWeatherEmoji(code);

      console.log(`${date} | ${emoji}  Max: ${maxTemp}°C | Min: ${minTemp}°C`);
    });

    console.log(`-------------------------------------------------\n`);

  } catch (error) {
    console.error("❌ Errore:", error.message);
  }
}

/**
 * Helper: Converte il WMO Weather Code in emoji
 */
function getWeatherEmoji(code) {
  if (code === 0) return "☀️ "; // Sereno
  if (code <= 3) return "☁️ "; // Nuvoloso
  if (code >= 45 && code <= 48) return "🌫️ "; // Nebbia
  if (code >= 51 && code <= 67) return "🌧️ "; // Pioggia
  if (code >= 71 && code <= 77) return "❄️ "; // Neve
  if (code >= 80) return "⛈️ "; // Temporale
  return "❓";
}

// Esecuzione
const input = process.argv.slice(2).join(' ');
get5DayForecast(input);