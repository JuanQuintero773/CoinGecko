import { getMarketData } from './marketData.js';
import { getFavorites, addFavorite, removeFavorite } from './favorites.js';
import { fetchCoins } from './fetchCoins.js';

document.addEventListener("DOMContentLoaded", () => {
  const tabContent = document.getElementById("tab-content");
  const buttons = document.querySelectorAll(".tab");

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const tabId = button.getAttribute("data-tab");

      if (tabId === "tab3") {
        // Sección de mercado
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
          const coins = await response.json();
          const favorites = getFavorites();

          let coinsHTML = coins.map(coin => `
            <div class="coin">
              <img src="${coin.image}" alt="${coin.name}" width="30">
              <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
              ${favorites.includes(coin.id) ? "<p>⭐ Ya está en favoritos</p>" : `<button class="fav-btn" data-id="${coin.id}">⭐ Añadir a Favoritos</button>`}
            </div>
          `).join("");

          tabContent.innerHTML = `<h2>Mercado de Criptomonedas</h2>${coinsHTML}`;

          document.querySelectorAll(".fav-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              addFavorite(btn.getAttribute("data-id"));
              alert("Añadido a favoritos.");
              btn.replaceWith("<p>⭐ Ya está en favoritos</p>");
            });
          });

        } catch (error) {
          console.error("Error obteniendo datos de mercado:", error);
          tabContent.innerHTML = "<p>⚠ Error de conexión. Verifica tu internet o intenta más tarde.</p>";
        }

      } else if (tabId === "tab2") {
        // Sección de favoritos
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

      } else {
        // Navegación entre otras secciones
        tabContent.innerHTML = `<h2>${button.textContent}</h2><p>Contenido de ${button.textContent}</p>`;
      }

      // Cambiar estilos para destacar la sección activa
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
});

let currentPage = 1; // Página actual
const tabContent = document.getElementById("tab-content");

async function loadCoins() {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${currentPage}`);
    const coins = await response.json();
    const favorites = getFavorites();

    let coinsHTML = coins.map(coin => `
      <div class="coin">
        <img src="${coin.image}" alt="${coin.name}" width="30">
        <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong> - $${coin.current_price.toLocaleString()}</p>
        ${favorites.includes(coin.id) ? "<p>⭐ Ya está en favoritos</p>" : `<button class="fav-btn" data-id="${coin.id}">⭐ Añadir a Favoritos</button>`}
      </div>
    `).join("");

    tabContent.innerHTML += coinsHTML;

    // Activar botones de favoritos
    document.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        addFavorite(btn.getAttribute("data-id"));
        alert("Añadido a favoritos.");
        btn.replaceWith("⭐ Ya está en favoritos");
      });
    });

  } catch (error) {
    console.error("Error obteniendo datos de mercado:", error);
    tabContent.innerHTML += "<p>⚠ Error al cargar más monedas.</p>";
  }
}

