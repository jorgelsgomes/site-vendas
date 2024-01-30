import { useEffect, useState } from 'react';
import logo from './imgs/logo.png';
import carrinho from './imgs/carrinho.png';
import './App.css';
import formatCurrency from './helpers/tranformcurrynce';
import { fetchProduct, fetchListProducts } from './helpers/fetchProducts';
import { getProduct } from './helpers/getProduct';


function App() {
  // estado que controla a visibilidade do carrinho de compras
  const [isCartVisible, setIsCartVisible] = useState(false);
  // Estado que armazena os produtos vindo da api
  const [products, setProducts] = useState([]);
  // Estado que armazena os ids dos produtos adicionados no carrinho de compras
  const [productsCartId, setProductsCartId] = useState([])
  // Estado que armazena os prudutos no carrinho
  const [productsCart, setProductsCart] = useState([])
  // estado que controla o input de busca
  const [busca, setbusca] = useState()

  //Get API mercado livre
  useEffect(() => {
    fetchListProducts(busca).then((response) => {
      setProducts(response);
    });
   
  }, [busca]);

  // função do botão adicinar ao carrinho
  function handleAddIdToCart(productId) {
    const copyproductsCart = [...productsCartId]

    const product = copyproductsCart.find(product => product.id === productId)

    if (!product) {
      copyproductsCart.push(productId)
    }
    setProductsCartId(copyproductsCart)
    saveCart(copyproductsCart)
    getAddToCart()
  }

  // função adicionar 
  async function getAddToCart() {
    const localProductCart = getProduct()

    if (localProductCart) {
      try {
        const fetchPromises = localProductCart.map(async (id) => {
          const response = await fetchProduct(id);
          return response;
        });
        const fetchedProducts = await Promise.all(fetchPromises);

        // Atualize o carrinho com os produtos obtidos
        setProductsCart(fetchedProducts);

      } catch (error) {
        console.error('Erro ao obter produtos:', error);
      }
    }
  }

  //salvar id dos produtos no localstorige
  function saveCart(productId) {
    localStorage.setItem('id', JSON.stringify(productId));
  }

  // function handleRemoveToCart () {

  // }

  return (
    <>
      <header className="header">
        <div className="container-title">
          <img src={logo} className="logo" alt="logo carrinho de compras" />
        </div>
      </header>
      <input
      data-testid="search-input"
      className='input-search'
      placeholder="Digite sua Busca..."
      value={ busca }
      onChange={ ({ target }) => setbusca(target.value) }
    />
        <div
          className="container-cartTitle"
          onMouseEnter={() => setIsCartVisible(true)}
          onMouseLeave={() => setIsCartVisible(false)}
        >
          <i
            className="material-icons"
            style={{ fontSize: '35px', color: 'rgb(65, 25, 127)', cursor: 'pointer' }}
          >
          </i>
          {isCartVisible ? (
            <section className="cart-sidebar">
              <span className="cart__title">Meu carrinho</span>
              <section className="products">{productsCart.map((product, index) => (
                <li key={product.id + index} className="cart__product">
                  <div className="cart__product__image">
                    <img src={product.thumbnail} alt={product.title} />
                  </div>
                  <div className="cart__product__info-container">
                    <span className="product__title">{product.title}</span>
                    <span className="product__price"><span className="product__price__value">{formatCurrency(product.price, 'BRL')}</span></span>
                  </div>
                  <i className="material-icons cart__product__remove">
                    delete
                  </i>
                </li>
              ))
              }
              </section>
              <p className="price">Subtotal <span>R$<span className="total-price">0</span></span></p>
              <input type="text" className="cep-input" placeholder="Digite seu CEP" />
              <button className="cep-button cart-button">Buscar CEP</button>
              <span className="cart__address"></span>
            </section>
          ) : (<img src={carrinho} className="carrinho" alt="carrinho de compras" />)}
        </div>
      <div className='container' >
        <ul className='products'>
          {products.map(product => (
            <li key={product.id} className="product">
              <span className='product__id' >{product.id} </span>
              <div className='img__container'>
                <img src={product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')} className='product__image' alt={product.title} />
              </div>
              <p data-testid={`${product.id}-card-name`} className='product__title' >{product.title}</p>
              <p className='product__price'><span className='product__price__value'>{formatCurrency(product.price, 'BRL')}</span></p>
              <button
                aria-label={`Adicionar ${product.title} ao Carrinho`}
                className='product__add'
                onClick={() => handleAddIdToCart(product.id)}>
                Adicionar ao Carrinho
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
