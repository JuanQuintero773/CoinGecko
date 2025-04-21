export async function getMarketData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data) {
      throw new Error("Datos de mercado no disponibles.");
    }

    return data.data;
  } catch (error) {
    console.error('Error al obtener datos del mercado:', error);
    return null;
  }
}