// news.js
export async function fetchCryptoNews() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/news');
      if (!response.ok) {
        throw new Error(`Error al obtener noticias: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener las noticias de criptomonedas:', error);
      return [];
    }
  }