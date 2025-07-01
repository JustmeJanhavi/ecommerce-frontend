import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/stores.css';
import linkimg from '../../images/link.png';
import shopimg from '../../images/shop.png';
import notificationimg from '../../images/notification.png';
import todolistimg from '../../images/todolist.png';
import { Link } from 'react-router-dom';

export default function Stores() {
  const [form, setForm] = useState({
    store_name: '',
    store_tagline: '',
    store_address: '',
    instagram_link: '',
    facebook_link: '',
    store_email: '',
    store_desc: '',
  });

  const storeId = localStorage.getItem('storeId'); 
  const [landingImage, setLandingImage] = useState(null);
  const [storePhoto, setStorePhoto] = useState(null);
  // const [previewLandingImage, setPreviewLandingImage] = useState('');
  // const [previewStorePhoto, setPreviewStorePhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const storeLink = `http://localhost:3000/store/${storeId}`;
  
  const token = localStorage.getItem('authToken'); // ✅ assumes JWT is stored here

  // ✅ Load store data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/adminstore', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const data = res.data.store;
        setForm({
          store_name: data.store_name || '',
          store_tagline: data.store_tagline || '',
          store_address: data.store_address || '',
          instagram_link: data.instagram_link || '',
          facebook_link: data.facebook_link || '',
          store_email: data.store_email || '',
          store_desc: data.store_desc || '',
        });

        // if (data.landing_image)
        //   setPreviewLandingImage(`http://localhost:5000/${data.landing_image}`);
        // if (data.store_photo)
        //   setPreviewStorePhoto(`http://localhost:5000/${data.store_photo}`);
      })
      .catch(err => {
        console.error('Error fetching store data:', err);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (e.target.name === 'landing_image') {
      setLandingImage(file);
      // setPreviewLandingImage(previewURL);
    } else if (e.target.name === 'store_photo') {
      setStorePhoto(file);
      // setPreviewStorePhoto(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (landingImage) payload.append('landing_image', landingImage);
    if (storePhoto) payload.append('store_photo', storePhoto);

    try {
      await axios.put('http://localhost:5000/api/adminstore', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('✅ Store updated successfully!');
    } catch (err) {
      console.error('Error updating store:', err);
      alert('❌ Failed to update store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stores-container">
      <div className="stores-header">
      <h1>Edit Store Details</h1>
      <div className="icon-buttons">
    <button><img src={todolistimg} alt="List" /></button>
    <button onClick={() => setShowShareModal(true)}><img src={linkimg} alt="Link" /></button>
    <button><img src={notificationimg} alt="Bell" /></button>
    <button><Link to={`/store/${storeId}`}><img src={shopimg} alt="Shop" /></Link></button>
      </div>
      </div>
      <form className="stores-form" onSubmit={handleSubmit}>
        <div className="stores-col">
          <label>
            Store Name
            <input
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Tagline
            <input
              name="store_tagline"
              value={form.store_tagline}
              onChange={handleChange}
            />
          </label>

          <label>
            Address
            <input
              name="store_address"
              value={form.store_address}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="store_email"
              type="email"
              value={form.store_email}
              onChange={handleChange}
            />
          </label>

          <label>
            Instagram
            <input
              name="instagram_link"
              value={form.instagram_link}
              onChange={handleChange}
            />
          </label>

          <label>
            Facebook
            <input
              name="facebook_link"
              value={form.facebook_link}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="stores-col">
          <label>
            Description
            <textarea
              name="store_desc"
              value={form.store_desc}
              onChange={handleChange}
              rows={6}
            />
          </label>

          <label>
            Landing Image
            <input
              name="landing_image"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
            {/* {previewLandingImage && (
              <img src={previewLandingImage} alt="Landing" className="store-preview" />
            )} */}
          </label>

          <label>
            Store Photo
            <input
              name="store_photo"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
            {/* {previewStorePhoto && (
              <img src={previewStorePhoto} alt="Store" className="store-preview" />
            )} */}
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      {showShareModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <button className="modal-close" onClick={() => setShowShareModal(false)}>×</button>
      <h2>Share your store's link</h2>

      <div className="share-link-box">
        <input type="text" value={storeLink} readOnly />
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(storeLink);
            alert("Link copied!");
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
