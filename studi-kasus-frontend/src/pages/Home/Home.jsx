import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { setCategory } from '../../redux/slices/productsSlice';
// import { fetchCategories } from '../../redux/slices/menuSlice';

const Home = () => {
  const dispatch = useDispatch();
  // const category = useSelector((state) => state.menu.category);

  // // Fetch menu list when component mounts
  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  // console.log("Category in Home:", category);
  // const [selectedCategory, setSelectedCategory] = useState('ALL');

  // const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category) => {
    dispatch(setCategory(category)); // Set category in Redux state
  };
  // const handleCategorySelect = (category) => {
  //   setSelectedCategory(category); // Update local state
  // };

  return (
    <div>
      <Header />
      <ExploreMenu onCategorySelect={handleCategorySelect}/>
      <FoodDisplay />
    </div>
  );
};

export default Home;
