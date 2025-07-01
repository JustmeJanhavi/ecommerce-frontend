import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 👈 import this
import { Link } from 'react-router-dom';
import '../css/StoreLandingPage.css';
import axios from 'axios';
import StoreHeader from './StoreHeader.js';


const StoreLandingPage = () => {
  const { storeId } = useParams(); 
  const [storeData, setStoreData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  useEffect(() => {
    // Fetch store info and bestsellers in parallel
    const fetchStoreData = axios.get(`${process.env.REACT_APP_API_URL}/store/${storeId}`);
    const fetchBestsellers = axios.get(`${process.env.REACT_APP_API_URL}/store/${storeId}/bestsellers`);
  
    Promise.all([fetchStoreData, fetchBestsellers])
      .then(([storeRes, bestsellersRes]) => {
        setStoreData(storeRes.data.store);
        setReviews(storeRes.data.reviews);
        setBestsellers(bestsellersRes.data.bestsellers);
      })
      .catch(error => {
        console.error('Error fetching landing page data:', error);
      });
  }, [storeId]);

  const handleSubmitReview = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
  
      const payload = {
        customer_id: customerId,
        store_id: storeId,
        rating,
        review_text: reviewText
      };
  
      await axios.post(`${process.env.REACT_APP_API_URL}/store/reviews`, payload);
  
      // Clear state
      setShowReviewModal(false);
      setRating(0);
      setReviewText('');
  
      // Refresh reviews list
      const updated = await axios.get(`${process.env.REACT_APP_API_URL}/store/${storeId}`);
      setReviews(updated.data.reviews);
  
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };
  
  
  const [currentSlide, setCurrentSlide] = useState(0);
const visibleCount = 3;

const handlePrev = () => {
  setCurrentSlide((prev) => Math.max(prev - 1, 0));
};

const handleNext = () => {
  setCurrentSlide((prev) =>
    Math.min(prev + 1, bestsellers.length - visibleCount)
  );
};

const visibleBestsellers = bestsellers.slice(currentSlide, currentSlide + visibleCount);

  if (!storeData) return <div>Loading...</div>;

  const {
    store_name,
    store_tagline,
    landing_image,
    store_photo,
    store_address,
    instagram_link,
    facebook_link,
    store_email,
    store_desc
  } = storeData;

  return (
    <>
      <div
        className="store-landing-page"
        style={{
          backgroundImage: `url(${process.env.REACT_APP_STATIC_URL}/${landing_image})`
        }}
      >
        

      <StoreHeader storeId={storeId} storeName={store_name} />


        <div className="main-content">
          <div className="tagline-section">
            <div className="tagline">{store_tagline}</div>
            <Link to={`/store/${storeId}/shop`}> <button className="shop-now-button">Shop Now</button></Link>
          </div>
        </div>
      </div>

      <section className="about-section">
        <p>
          Welcome to {store_name}! {store_desc}
        </p>
      </section>

    {/* Dynamic Bestsellers */}
<section className="bestsellers-section">
  <div className="bestsellers-left">
    <h2 className="bestsellers-heading">Best Sellers</h2>
    <p className="bestsellers-subtext">
      Discover our most loved floral arrangements and gifts.
    </p>
    <button className="shop-bestsellers-button" onClick={() => window.scrollTo(0, 0)}>
      Shop Best Sellers
    </button>
  </div>

  <div className="bestsellers-right">
  {bestsellers.length > 0 ? (
    <div className="carousel-wrapper">
      <button onClick={handlePrev} disabled={currentSlide === 0} className="carousel-nav">
        &#8249;
      </button>

      <div className="carousel-items">
        {visibleBestsellers.map(product => (
          <div key={product.product_id} className="bestseller-card">
            <img
              src={`${process.env.REACT_APP_STATIC_URL}/${product.image_url}`}
              alt={product.product_name}
              className="bestseller-image"
            />
            <p className="product-name">{product.product_name}</p>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentSlide >= bestsellers.length - visibleCount}
        className="carousel-nav"
      >
        &#8250;
      </button>
    </div>
  ) : (
    <p>Loading bestsellers...</p>
  )}
</div>

</section>

      {/* Dynamic Reviews */}
      <section className="customer-reviews">
        <h2>Customer Reviews</h2> 
        
        <div className="reviews-grid">
          {reviews.length > 0 ? reviews.map((review, idx) => (
            <div className="review-card" key={idx}>
              <h4>{review.customer_name}</h4>
              <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <p>{review.review_text}</p>

            </div>
          )) : (
            <p>No reviews yet.</p>
          )}
        </div>
        <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
        Add Your Review
       </button>
        {showReviewModal && (
  <div className="review-modal-overlay">
    <div className="review-modal-box">
      <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
      <h3>Rate this Store</h3>

      {/* ⭐ Star Rating Input */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: '24px',
              color: star <= (hoverRating || rating) ? '#ffc107' : '#ccc',
              cursor: 'pointer',
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* 📝 Review Text Input */}
      <textarea
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
        className="review-textarea"
      />

      <button
        className="submit-review-btn"
        // onClick={() => {
        //   console.log('Submitting:', { storeId, rating, reviewText });
        //   setShowReviewModal(false);
          
        //   // TODO: Add axios.post() to send data to backend
        // }}
        onClick={handleSubmitReview}
      >
        Submit Review
      </button>
    </div>
  </div>
)}

      </section>

      {/* Footer with dynamic info */}
      <footer className="site-footer">
        <div className="footer-left">
          <h3>{store_name}</h3>
          <p className="made-with">Made with Dukaanify</p>
          <div className="social-icons">
            <a href={instagram_link} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href={facebook_link} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
          </div>
        </div>

        <div className="footer-right">
          <img src={`${process.env.REACT_APP_STATIC_URL}/${store_photo}`} alt="Store" className="footer-image" />
          <div className="footer-address">
            <p>{store_address}</p>
            <p>{store_email}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default StoreLandingPage;
