import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';

const ExploreMenu = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Tetap gunakan selectedCategory
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setStatus('loading');
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        setStatus('failed');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id); // Set ID kategori sebagai kategori yang dipilih
    onCategorySelect(id); // Kirim ID kategori ke parent component
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our mission
        is to satisfy your cravings and elevate your dining experience, one
        delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {categories.length > 0 ? (
          categories.map((item) => (
            <div
              onClick={() => handleCategoryClick(item._id)} // Gunakan _id kategori
              key={item._id}
              className="explore-menu-list-item"
            >
              <img
                className={selectedCategory === item._id ? 'active' : ''} // Bandingkan dengan _id, bukan name
                src={item.image}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
