export const getProduct = () => {
    const idProducts = localStorage.getItem('id');
    return idProducts ? JSON.parse(idProducts) : [];
  };

    //salvar id dos produtos no localstorige
export function saveCart(productId) {
      localStorage.setItem('id', JSON.stringify(productId));
    }