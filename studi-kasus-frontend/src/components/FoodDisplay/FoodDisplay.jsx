// src/components/FoodDisplay.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodList, selectFoodList, selectFoodStatus, selectFoodError, selectPage, selectTotalPages, setPage, selectLimit, selectSelectedCategory } from '../../redux/slices/productsSlice';
import FoodItem from '../FoodItem/Fooditem';
import './FoodDisplay.css';

const FoodDisplay = () => {
  const dispatch = useDispatch();
  const foodList = useSelector(selectFoodList);
  const status = useSelector(selectFoodStatus);
  const error = useSelector(selectFoodError);
  const selectedCategory = useSelector(selectSelectedCategory);
  const currentPage = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);
  const limit = useSelector(selectLimit);

  useEffect(() => {
    dispatch(fetchFoodList({ page: currentPage, limit, categoryId: selectedCategory }));
  }, [selectedCategory, dispatch, currentPage, limit]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {foodList && foodList.length > 0 ? (
          foodList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p>No food items available</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FoodDisplay;
