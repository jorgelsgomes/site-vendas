export const fetchListProducts = async (query) => {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const data = await response.json();
  
    return data.results;
  };

  export const fetchProduct = async (productID) => {
    // seu código aqui
    if (!productID) {
      throw new Error('ID não informado');
    }
    const response = await fetch(`https://api.mercadolibre.com/items/${productID}`);
    const data = await response.json();
    return data;
  };