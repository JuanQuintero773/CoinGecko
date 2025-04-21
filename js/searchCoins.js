// searchCoins.js
import { fetchCoins } from './fetchCoins.js';

export async function searchCoins(query) {
  try {
    const coins = await fetchCoins();
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error al buscar criptomonedas:', error);
    return [];
  }
}