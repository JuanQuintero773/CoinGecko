document.addEventListener("DOMContentLoaded", () => {
    // Splash Screen
    const splashScreen = document.getElementById("splash-screen");
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 3000);
  
    // Tabs Functionality
    const tabs = document.querySelectorAll(".tab");
    const tabContent = document.getElementById("tab-content");
  
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Cambiar pestaña activa
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
  
        // Cambiar contenido dinámico
        const tabId = tab.dataset.tab;
        loadTabContent(tabId);
      });
    });
  
    function loadTabContent(tabId) {
      switch (tabId) {
        case "tab1":
          tabContent.innerHTML = "<h2>Bienvenido</h2><p>Este es el inicio.</p>";
          break;
        case "tab2":
          tabContent.innerHTML = "<h2>Favoritos</h2><p>Aquí puedes ver tus favoritos.</p>";
          break;
        case "tab3":
          tabContent.innerHTML = "<h2>Mercado</h2><ul id='market-list'></ul>";
          loadMarketData();
          break;
        case "tab4":
          tabContent.innerHTML = "<h2>Noticias</h2><p>Últimas noticias sobre criptomonedas.</p>";
          break;
        case "tab5":
          tabContent.innerHTML = "<h2>Configuración</h2><p>Opciones de configuración.</p>";
          break;
        case "tab6":
          tabContent.innerHTML = "<h2>Perfil</h2><p>Información del perfil.</p>";
          break;
      }
    }
  
    function loadMarketData() {
      const marketList = document.getElementById("market-list");
      fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
        .then((response) => response.json())
        .then((data) => {
          marketList.innerHTML = "";
          data.forEach((coin) => {
            const li = document.createElement("li");
            li.textContent = `${coin.name} - $${coin.current_price}`;
            marketList.appendChild(li);
          });
        });
    }
  
    // Activar la primera pestaña por defecto
    loadTabContent("tab1");
  });