import { getMarketData } from './marketData.js';
import { getFavorites, addFavorite, removeFavorite } from './favorites.js';
import { fetchCoins } from './fetchCoins.js';

document.addEventListener("DOMContentLoaded", () => {
  const tabContent = document.getElementById("tab-content");
  const buttons = document.querySelectorAll(".tab");
  const filterForm = document.getElementById("filter-form");
  const applyFiltersButton = document.getElementById("apply-filters");
  async function fetchMarketData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1');
      const data = await response.json();
      const favorites = getFavorites();
  
      const coinsHTML = data.map(coin => `
        <div class="coin">
          <img src="${coin.image}" alt="${coin.name}" width="30">
          <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
          ${favorites.includes(coin.id) ? "⭐ Ya está en favoritos" : `<button class="fav-btn" data-id="${coin.id}">⭐ Añadir a Favoritos</button>`}
        </div>
      `).join("");
  
      // Actualiza el contenido del DOM
      document.getElementById("tab-content").innerHTML = coinsHTML;
  
      // Reasignar eventos a los botones "Añadir a Favoritos"
      document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          addFavorite(btn.getAttribute("data-id"));
          alert("Añadido a favoritos.");
          btn.replaceWith("⭐ Ya está en favoritos");
        });
      });
  
    } catch (error) {
      console.error('Error obteniendo datos de mercado:', error);
      document.getElementById("tab-content").innerHTML = "<p>⚠ Error al cargar datos.</p>";
    }
  }
  async function fetchCryptoTrends() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
      const data = await response.json();
  
      // Filtrar las criptomonedas que están subiendo y bajando
      const risingCoins = data.filter(coin => coin.price_change_percentage_24h > 0);
      const fallingCoins = data.filter(coin => coin.price_change_percentage_24h < 0);
  
      // Crear el contenido dinámico para mostrar en la pestaña "Noticias"
      const trendsHTML = `
        <h2>Noticias de Criptomonedas</h2>
        <h3>📈 Criptomonedas en Subida</h3>
        ${risingCoins.map(coin => `
          <div class="coin">
            <img src="${coin.image}" alt="${coin.name}" width="30" style="vertical-align: middle; margin-right: 10px;">
            <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong>: ${coin.price_change_percentage_24h.toFixed(2)}%
          </div>
        `).join("")}
        <h3>📉 Criptomonedas en Bajada</h3>
        ${fallingCoins.map(coin => `
          <div class="coin">
            <img src="${coin.image}" alt="${coin.name}" width="30" style="vertical-align: middle; margin-right: 10px;">
            <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong>: ${coin.price_change_percentage_24h.toFixed(2)}%
          </div>
        `).join("")}
      `;
  
      // Actualizar el DOM con el contenido generado
      document.getElementById("tab-content").innerHTML = trendsHTML;
    } catch (error) {
      console.error('Error al obtener tendencias de criptomonedas:', error);
      document.getElementById("tab-content").innerHTML = "<p>⚠ Error al cargar datos.</p>";
    }
  }
  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const tabId = button.getAttribute("data-tab");
  
      // Verifica que el formulario exista antes de aplicar la lógica
      if (filterForm) {
        if (tabId === "tab3") {
          console.log('Mostrando formulario de filtros en Mercado...');
          filterForm.style.display = "block"; // Mostrar solo en Mercado
        } else {
          console.log('Ocultando formulario de filtros...');
          filterForm.style.display = "none"; // Ocultar en todas las demás pestañas
        }
      }
  
      if (tabId === "tab1") {
        try {
          const marketData = await getMarketData();
          console.log("Datos del mercado:", marketData);
      
          if (!marketData || marketData.error) {
            tabContent.innerHTML = `
              <p>⚠ No se pudieron cargar las estadísticas del mercado.</p>
              <section id="promociones">
                <h2>Por qué usar CoinGecko</h2>
                <!-- Promoción de funcionalidades -->
                <div class="feature">
                  <img src="images/realtime.png" alt="Actualizaciones en tiempo real" width="50">
                  <p><strong>Actualizaciones en Tiempo Real:</strong> Mantente al día con los precios y tendencias del mercado.</p>
                </div>
                <div class="feature">
                  <img src="images/favorites.png" alt="Guardado de favoritos" width="50">
                  <p><strong>Guarda tus Favoritos:</strong> Organiza tus criptomonedas preferidas y accede rápidamente.</p>
                </div>
                <div class="feature">
                  <img src="images/filters.png" alt="Filtros avanzados" width="50">
                  <p><strong>Filtros Avanzados:</strong> Encuentra criptomonedas que cumplan con tus criterios en segundos.</p>
                </div>
              </section>
            `;
          } else {
            tabContent.innerHTML = `
              <section id="estadisticas">
                <h2>Estadísticas del Mercado</h2>
                <p><strong>Capitalización total:</strong> $${marketData.total_market_cap.usd.toLocaleString()}</p>
                <p><strong>Volumen 24h:</strong> $${marketData.total_volume.usd.toLocaleString()}</p>
                <p><strong>Criptomonedas activas:</strong> ${marketData.active_cryptocurrencies}</p>
              </section>
              <section id="promociones">
                <h2>Por qué usar CoinGecko</h2>
                <!-- Promoción de funcionalidades -->
                <div class="feature">
                  <img src="images/realtime.png" alt="Actualizaciones en tiempo real" width="50">
                  <p><strong>Actualizaciones en Tiempo Real:</strong> Mantente al día con los precios y tendencias del mercado.</p>
                </div>
                <div class="feature">
                  <img src="images/favorites.png" alt="Guardado de favoritos" width="50">
                  <p><strong>Guarda tus Favoritos:</strong> Organiza tus criptomonedas preferidas y accede rápidamente.</p>
                </div>
                <div class="feature">
                  <img src="images/filters.png" alt="Filtros avanzados" width="50">
                  <p><strong>Filtros Avanzados:</strong> Encuentra criptomonedas que cumplan con tus criterios en segundos.</p>
                </div>
              </section>
            `;
          }
        } catch (error) {
          console.error("Error al cargar datos de inicio:", error);
          tabContent.innerHTML = `
            <p>⚠ Ocurrió un error al cargar los datos.</p>
            <section id="promociones">
              <h2>Por qué usar CriptoApp</h2>
              <!-- Promoción de funcionalidades -->
              <div class="feature">
                <img src="images/realtime.png" alt="Actualizaciones en tiempo real" width="50">
                <p><strong>Actualizaciones en Tiempo Real:</strong> Mantente al día con los precios y tendencias del mercado.</p>
              </div>
              <div class="feature">
                <img src="images/favorites.png" alt="Guardado de favoritos" width="50">
                <p><strong>Guarda tus Favoritos:</strong> Organiza tus criptomonedas preferidas y accede rápidamente.</p>
              </div>
              <div class="feature">
                <img src="images/filters.png" alt="Filtros avanzados" width="50">
                <p><strong>Filtros Avanzados:</strong> Encuentra criptomonedas que cumplan con tus criterios en segundos.</p>
              </div>
            </section>
          `;
        }
      }
       else if (tabId === "tab2") {
        // Sección Favoritos
        const favorites = getFavorites();

        if (favorites.length === 0) {
          tabContent.innerHTML = "<p>⭐ No tienes criptomonedas en favoritos.</p>";
          return;
        }

        try {
          const allCoins = await fetchCoins();
          const favoriteCoins = allCoins.filter(coin => favorites.includes(coin.id));

          let favoritesHTML = favoriteCoins.map(coin => `
            <div class="coin">
              <img src="${coin.image}" alt="${coin.name}" width="30">
              <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
              <button class="remove-fav" data-id="${coin.id}">❌ Eliminar</button>
            </div>
          `).join("");

          tabContent.innerHTML = `<h2>⭐ Tus Favoritos</h2>${favoritesHTML}`;

          document.querySelectorAll(".remove-fav").forEach(btn => {
            btn.addEventListener("click", () => {
              removeFavorite(btn.getAttribute("data-id"));
              alert("Eliminado de favoritos.");
              btn.parentElement.remove();
            });
          });

        } catch (error) {
          console.error("Error obteniendo favoritos:", error);
          tabContent.innerHTML = "<p>⚠ Error al cargar favoritos.</p>";
        }
      } else if (tabId === "tab3") {
        filterForm.style.display = "block"; // Mostrar el formulario de filtros
        fetchMarketData();
      
        const intervalId = setInterval(fetchMarketData, 30000); // Actualizaciones periódicas
      
        // Limpia el intervalo al cambiar de pestaña
        buttons.forEach(btn => {
          btn.addEventListener("click", () => clearInterval(intervalId));
        });
      }else if (tabId === "tab4") {
        filterForm.style.display = "none"; // Ocultar el formulario de filtros
      
        // Llama a la función para obtener datos iniciales
        fetchCryptoTrends();
      
        // Configura actualizaciones automáticas cada 30 segundos
        const intervalId = setInterval(fetchCryptoTrends, 30000);
      
        // Limpia el intervalo al cambiar de pestaña
        buttons.forEach(btn => {
          btn.addEventListener("click", () => clearInterval(intervalId));
        });
      }
      else {
        if (filterForm) {
          filterForm.style.display = "none"; // Asegurarse de ocultar el formulario
        }
        tabContent.innerHTML = `<h2>${button.textContent}</h2><p>Contenido de ${button.textContent}</p>`;
      }
      // Cambiar estilos para destacar la sección activa
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const searchBar = document.getElementById("search-bar");
  const tabContent = document.getElementById("tab-content");
  let allCoins = []; // Almacena todas las criptomonedas cargadas

  async function fetchAllCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1');
      if (!response.ok) throw new Error("Error cargando las criptomonedas");
      allCoins = await response.json(); // Guardar todas las criptos
    } catch (error) {
      console.error("Error al cargar criptomonedas:", error);
      tabContent.innerHTML = "<p>⚠ No se pudieron cargar las criptomonedas.</p>";
    }
  }

  // Filtrar criptos en función de la búsqueda
  function filterCoins(query) {
    const filteredCoins = allCoins.filter(coin =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );

    displayCoins(filteredCoins);
  }

  // Mostrar criptomonedas en el DOM
  function displayCoins(coins) {
    if (coins.length === 0) {
      tabContent.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }

    const coinsHTML = coins.map(coin => `
      <div class="coin">
        <img src="${coin.image}" alt="${coin.name}" width="30">
        <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
      </div>
    `).join("");

    tabContent.innerHTML = coinsHTML;
  }

  // Cargar criptomonedas al iniciar y configurar el buscador
  await fetchAllCoins();
  displayCoins(allCoins); // Mostrar todas las criptomonedas inicialmente

  searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    filterCoins(query); // Filtrar criptos según el término ingresado
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  const filterForm = document.getElementById("filter-form");
  const applyFiltersButton = document.getElementById("apply-filters");
  const tabContent = document.getElementById("tab-content");
  let allCoins = []; // Almacena todas las criptomonedas

  async function fetchAllCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1');
      if (!response.ok) throw new Error("Error cargando las criptomonedas");
      allCoins = await response.json();
      displayCoins(allCoins); // Mostrar todas inicialmente
    } catch (error) {
      console.error("Error al cargar criptomonedas:", error);
      tabContent.innerHTML = "<p>⚠ No se pudieron cargar las criptomonedas.</p>";
    }
  }

  function applyFilters() {
    const filterPrice = document.getElementById("filter-price").checked;
    const filterVolume = document.getElementById("filter-volume").checked;
    const filterChange = document.getElementById("filter-change").checked;

    let filteredCoins = allCoins;

    if (filterPrice) {
      filteredCoins = filteredCoins.filter(coin => coin.current_price > 100);
    }
    if (filterVolume) {
      filteredCoins = filteredCoins.filter(coin => coin.total_volume > 1000000);
    }
    if (filterChange) {
      filteredCoins = filteredCoins.filter(coin => coin.price_change_percentage_24h > 10);
    }

    displayCoins(filteredCoins);
  }

  function displayCoins(coins) {
    if (coins.length === 0) {
      tabContent.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }

    const coinsHTML = coins.map(coin => `
      <div class="coin">
        <img src="${coin.image}" alt="${coin.name}" width="30">
        <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
      </div>
    `).join("");

    tabContent.innerHTML = coinsHTML;
  }

  applyFiltersButton.addEventListener("click", applyFilters);

  // Cargar criptomonedas al iniciar
  await fetchAllCoins();
});
applyFiltersButton.addEventListener("click", applyFilters);
async function fetchMarketData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
    const data = await response.json();
    console.log('Datos actualizados:', data); // Verifica los datos en la consola

    // Genera el contenido dinámicamente
    const marketContent = data.map(coin => `
      <div class="coin">
        <img src="${coin.image}" alt="${coin.name}" width="30">
        <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
        <p><em>Volumen: ${coin.total_volume.toLocaleString()}</em></p>
        <p><em>Cambio (24h): ${coin.price_change_percentage_24h.toFixed(2)}%</em></p>
      </div>
    `).join("");

    // Actualiza el contenido del DOM
    document.getElementById("tab-content").innerHTML = `<h2>Mercado de Criptomonedas</h2>${marketContent}`;
  } catch (error) {
    console.error('Error al obtener datos del mercado:', error);
    document.getElementById("tab-content").innerHTML = `<p>⚠ Error al cargar datos.</p>`;
  }
}
document.getElementById("tab-content").innerHTML = `<p>Actualizando datos...</p>`;
