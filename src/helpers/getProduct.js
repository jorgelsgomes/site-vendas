export const getProduct = () => {
    const idProducts = localStorage.getItem('id');
    return idProducts ? JSON.parse(idProducts) : [];
  };