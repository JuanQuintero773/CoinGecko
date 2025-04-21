const favorites = new Set(JSON.parse(localStorage.getItem("favorites")) || []);

export function addFavorite(coinId) {
  favorites.add(coinId);
  localStorage.setItem("favorites", JSON.stringify([...favorites]));

  console.log(`Añadido a favoritos: ${coinId}`);
  alert(`${coinId} ha sido añadido a favoritos!`);
}

export function removeFavorite(coinId) {
  favorites.delete(coinId);
  localStorage.setItem("favorites", JSON.stringify([...favorites]));

  console.log(`Eliminado de favoritos: ${coinId}`);
}

export function getFavorites() {
  return Array.from(favorites);
}