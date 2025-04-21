export async function displayStats() {
    try {
      const stats = await getMarketData();
      const statsContainer = document.getElementById('stats-data');
  
      if (!statsContainer) {
        console.error('Elemento stats-data no encontrado en el HTML.');
        return;
      }
  
      statsContainer.innerHTML = `
        <p><strong>Capitalización total del mercado:</strong> $${stats.total_market_cap.usd.toLocaleString()}</p>
        <p><strong>Volumen total:</strong> $${stats.total_volume.usd.toLocaleString()}</p>
        <p><strong>Monedas disponibles:</strong> ${stats.active_cryptocurrencies}</p>
      `;
    } catch (error) {
      console.error('Error al mostrar estadísticas:', error);
    }
  }