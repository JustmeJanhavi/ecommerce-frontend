import React from 'react';
import '../css/Home.css'; // We'll style this in a moment
import { Link } from 'react-router-dom';
import homeImage from '../../images/home-page-icon.jpg';


function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">DUKAANIFY</div>
        <div className="navbar-right">
          <Link to="/login"><button className="btn">Login</button></Link>
          <Link to="/signup"><button className="btn get-started">Get Started</button></Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="content-left">
          <h1>Create Your <br /> Own Website</h1>
          <p>Bring your ideas to life with beautifully crafted websites. Turn your vision into reality and build the product of your dreams with stunning design and seamless functionality.</p>
          <Link to="/signup"><button className="btn get-started">Get Started</button></Link>
        </div>
        <div className="content-right">
        <img 
            src={homeImage} // ✅ Correct image usage
            alt="Landing Visual"
            className="home-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
