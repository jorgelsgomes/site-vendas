import { useEffect, useState } from 'react';
import logo from '../imgs/logo.png';
import carrinho from '../imgs/carrinho.png';
import '../App.css';
import formatCurrency from '../helpers/tranformcurrynce';
import { fetchProduct, fetchListProducts } from '../helpers/fetchProducts';
import { getProduct, saveCart } from '../helpers/localStorage';
import FreteCalculator from './cepFunctions';


function Home() {
  // estado que controla a visibilidade do carrinho de compras.
  const [isCartVisible, setIsCartVisible] = useState(false);
  // Estado que armazena os produtos vindo da api.
  const [products, setProducts] = useState([]);
  // Estado que armazena os ids dos produtos adicionados no carrinho de compras.
  const [productsCartId, setProductsCartId] = useState([]);
  // Estado que armazena os prudutos no carrinho.
  const [productsCart, setProductsCart] = useState([]);
  // estado que controla o input de busca.
  const [busca, setbusca] = useState();
  // estado que controla o subtotal do carrinho.
  const [subtotal, setSubtotal] = useState(0);


  //Get API mercado livre
  useEffect(() => {
    const savedCart = getProduct();
    setProductsCartId(savedCart);
    getAddToCart(savedCart);
    fetchListProducts(busca).then((response) => {
      setProducts(response);
    });

  }, [busca]);

  // função do botão adicinar ao carrinho, captura os IDs dos produtos e add a um estado e sava no local storage.
  function handleAddIdToCart(productId) {
    const copyProductsCart = [...productsCartId];

    const product = copyProductsCart.find(product => product.id === productId);

    if (!product) {
      copyProductsCart.push(productId);
    }
    setProductsCartId(copyProductsCart);
    saveCart(copyProductsCart);
    getAddToCart(copyProductsCart)
  }

  // função que recupera os ID do local storage busca o produto para adicionar ao carrinho de compras.
  // Função assíncrona para atualizar o carrinho e calcular o subtotal.
async function getAddToCart(productIds) {
  if (productIds && productIds.length > 0) {
    try {
      const fetchPromises = productIds.map(async (id) => {
        const response = await fetchProduct(id);
        return response;
      });

      const fetchedProducts = await Promise.all(fetchPromises);

      // Atualize o carrinho com os produtos obtidos.
      setProductsCart(fetchedProducts);

      // Aguarde a atualização assíncrona do estado antes de calcular o subtotal.
      setSubtotal(() => {
        const newSubtotal = fetchedProducts.reduce((total, product) => {
          return total + parseFloat(product.price);
        }, 0);
        return newSubtotal;
      });
    
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
    }
  } else {
    // Se o carrinho estiver vazio, atualize o subtotal para zero.
    setSubtotal(0);
  }
}

  // Função para remover um produto do carrinho.
  async function handleRemoveToCart(productId) {
    setProductsCartId((prevProductsCart) => {
      const copyProductsCartIds = [...prevProductsCart];
      const indexToRemove = copyProductsCartIds.findIndex((id) => id === productId);
  
      if (indexToRemove !== -1) {
        // Remove o produto do array de IDs se encontrado.
        copyProductsCartIds.splice(indexToRemove, 1);
        // Atualiza o estado e o local storage com os IDs atualizados.
        setProductsCartId(copyProductsCartIds);
        saveCart(copyProductsCartIds);
        // Atualiza os produtos no carrinho.
        setProductsCart((prevProducts) => {
          const updatedProducts = prevProducts.filter((product) => product.id !== productId);
          return updatedProducts;
        });
        if (prevProductsCart.length > 0) {
          const copyProductsCartIds = [...productsCart];
          const priceProduct = copyProductsCartIds.find((product) => product.id === productId);
          if (priceProduct) {
            // Verifique se o produto foi encontrado antes de calcular o subtotal.
            const total = subtotal - parseFloat(priceProduct.price);
            setSubtotal(total);
          }
        }
  
      }
  
      return copyProductsCartIds;
    });
  }
  


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
        value={busca}
        onChange={({ target }) => setbusca(target.value)}
      />
      <div
        className="container-cartTitle"
        onClick={() => setIsCartVisible(true)}
        onMouseLeave={() => setIsCartVisible(false)}
      >
        <i
          className="material-icons"
          style={{ fontSize: '35px', color: 'rgb(65, 25, 127)', cursor: 'pointer' }}
        >
          {productsCartId.length > 0 && (
            <span className="number-product">{productsCartId.length}</span>
          )}
        </i>
        {isCartVisible ? (
          <section className="cart-sidebar">
            <span className="cart__title">Meu carrinho</span>
            <section className="products"> {productsCart.map((product, index) => (
              <li key={product.id + index} className="cart__product">
                <div className="cart__product__image">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="cart__product__info-container">
                  <span className="product__title">{product.title}</span>
                  <span className="product__price"><span className="product__price__value">{formatCurrency(product.price, 'BRL')}</span></span>
                </div>
                <i className="material-icons cart__product__remove"
                  onClick={() => handleRemoveToCart(product.id)}
                >
                  delete
                </i>
              </li>
            ))}
            </section>
            
            <p className="price">Subtotal <span><span className="total-price">{formatCurrency(subtotal, 'BRL')}</span></span></p>
           <FreteCalculator/>
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

export default Home
