import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ShopPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import StoreHeader from './StoreHeader.js';

const ShopPage = () => {
  const { storeId } = useParams(); 
  const [categories, setCategories] = useState(['All']);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [storeName, setStoreName] = useState('');
  const [cartId, setCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ NEW
  const itemsPerPage = 8; // ✅ NEW
  const navigate = useNavigate();

  const customerId = localStorage.getItem('customerId');

  // ✅ Create or get active cart
  const getOrCreateCart = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/carts`, {
        store_id: storeId,
        customer_id: customerId
      });
      setCartId(res.data.cart_id);
      return res.data.cart_id;
    } catch (err) {
      console.error('Error creating/fetching cart', err);
    }
  };

  // ✅ Add product to cart
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('customerToken');
  if (!token) {
    alert("Please log in to add items to cart.");
    navigate(`/store/${storeId}/login`);
    return;
  }
    try {
      const id = cartId || await getOrCreateCart();
      await axios.post(`${process.env.REACT_APP_API_URL}/cart-items`, {
        cart_id: id,
        product_id: productId,
        quantity: 1
      });
      navigate(`/store/${storeId}/shop/cart`);
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  // ✅ Load store and products
  useEffect(() => {
    if (!storeId) return;

    // Fetch store name
    axios.get(`${process.env.REACT_APP_API_URL}/store/${storeId}`)
      .then(response => {
        setStoreName(response.data.store.store_name);
      })
      .catch(error => console.error('Error fetching store:', error));

    // Fetch products
    axios.get(`${process.env.REACT_APP_API_URL}/store/${storeId}/products`)
      .then(response => {
        const { categories, products } = response.data;
        const normalizedProducts = products.map(p => ({
          id: p.product_id,
          name: p.product_name,
          category: p.product_category,
          price: p.price,
          image_url: p.image_url,
          description: p.description,
        }));

        setCategories(['All', ...categories]);
        setProducts(normalizedProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [storeId]);

  // ✅ Filter and paginate products
  const filteredProducts = products.filter(product =>
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div> <StoreHeader storeId={storeId} storeName={storeName} />
    <div className="shop-page">
     
      <h2>Shop</h2>

      <div className="category-tabs">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`tab-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1); // ✅ Reset to page 1 on category change
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {paginatedProducts.map(({ id, name, description, price, image_url }) => (
          <div key={id} className="product-card">
            <img src={`${process.env.REACT_APP_STATIC_URL}/${image_url}`} alt={name} />
            <h4>{name}</h4>
            <p>{description}</p>
            <p>₹{price}</p>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              className={currentPage === page ? 'active-page' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default ShopPage;
