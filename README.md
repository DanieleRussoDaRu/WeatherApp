# Weather Forecast CLI 🌤️

Un'applicazione da riga di comando (CLI) semplice ed efficiente scritta in Node.js per ottenere previsioni meteo a 5 giorni. Il progetto utilizza l'API di [Open-Meteo](https://open-meteo.com/) per recuperare dati precisi senza necessità di chiavi API (API Key).

## 🚀 Funzionalità

- **Geocodifica Automatica**: Inserisci il nome della città e lo script troverà automaticamente le coordinate (Latitudine/Longitudine).
- **Previsione a 5 Giorni**: Visualizza temperature massime, minime e condizioni meteo tramite emoji intuitive.
- **Richieste Ottimizzate**: Le chiamate API sono filtrate per recuperare solo i dati strettamente necessari, migliorando la velocità di risposta.
- **Supporto Nomi Composti**: Gestisce correttamente città con spazi nel nome (es. "San Francisco" o "Reggio Emilia").

## 🛠️ Requisiti

- [Node.js](https://nodejs.org/) (Versione 18 o superiore consigliata per il supporto nativo a `fetch`).

## 📦 Installazione

1. Clona la repository o scarica il file `app.js`.
2. Apri il terminale nella cartella del progetto.
3. Non sono necessarie installazioni di dipendenze esterne (utilizza API standard di Node.js).

## 💻 Utilizzo

Esegui lo script passando il nome della città come argomento:

```bash
node app.js "Nome della Città"