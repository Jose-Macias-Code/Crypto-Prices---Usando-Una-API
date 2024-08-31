document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cryptoData = await fetchTop10Cryptos();
        if (cryptoData && Array.isArray(cryptoData)) {
            displayCryptoData(cryptoData);
        } else {
            throw new Error('Invalid data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('crypto-list').innerHTML = '<p>Could not load data.</p>';
    }
});

// Funcion Para Obtener Las 10 Principales Criptomonedas
async function fetchTop10Cryptos() {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error in fetchTop10Cryptos:', error);
        throw error;
    }
}

// Funcion Para Mostrar Los Datos
function displayCryptoData(data) {
    const cryptoListDiv = document.getElementById('crypto-list');
    cryptoListDiv.innerHTML = ''; 

    data.forEach(crypto => {
        const cryptoCard = document.createElement('div');
        cryptoCard.className = 'crypto-card';

        cryptoCard.innerHTML = `
            <img src="${crypto.image}" alt="${crypto.name}">
            <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
            <p class="price" id="price-${crypto.id}">Price in USD: $${crypto.current_price.toLocaleString()}</p>
        `;

        cryptoListDiv.appendChild(cryptoCard);
    });

    // Evento Para El Selector De Divisa y El Boton 
    document.getElementById('currency').addEventListener('change', (event) => {
        const currency = event.target.value;
        updatePrices(currency, data);
    });

    document.getElementById('update-prices').addEventListener('click', () => {
        const currency = document.getElementById('currency').value;
        updatePrices(currency, data);
    });
}

// Funcion Para Actualizar Los Precios Según La Divisa Seleccionada
function updatePrices(currency, data) {
    data.forEach(crypto => {
        const priceElement = document.getElementById(`price-${crypto.id}`);
        let price;

        // Calcular El Precio
        switch (currency) {
            case 'usd':
                price = crypto.current_price;
                break;
            case 'eur':
                price = crypto.current_price * 0.85;
                break;
            case 'mxn':
                price = crypto.current_price * 20; 
                break;
            default:
                price = crypto.current_price;
        }

        priceElement.textContent = `Price in ${currency.toUpperCase()}: ${currency === 'eur' ? '€' : currency === 'mxn' ? 'MX$' : '$'}${price.toLocaleString()}`;
    });
}
