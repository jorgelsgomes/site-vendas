import { UseEffect, UseState } from 'react';
import PropTypes from 'prop-types';
import '../styles/products.css';

function products() {
    const [products, setProducts] = UseState([]);

    UseEffect(() => {
        fetch('https://api.example.com/data')
          .then(response => response.json())
          .then(products => setProducts(products));
      }, []);

    return (
        <ul>
            {products && products.map(product => (
                <li key={product.id} className="card-container">
                    <img src={product.thumbnail} alt={product.title} />
                    <p data-testid={`${product.id}-card-name`}>{product.title}</p>
                    <p>{product.price}</p>
                    <button aria-label={`Adicionar ${product.title} ao Carrinho`}>Adicionar ao Carrinho</button>
                </li>
            ))}
        </ul>
    );
}

products.propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
};

export default products;
