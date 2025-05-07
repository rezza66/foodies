import { useDispatch } from 'react-redux';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { setCategory } from '../../redux/slices/productsSlice';

const Home = () => {
  const dispatch = useDispatch();

  const handleCategorySelect = (category) => {
    dispatch(setCategory(category)); // Set category in Redux state
  };

  return (
    <div>
      <Header />
      <ExploreMenu onCategorySelect={handleCategorySelect}/>
      <FoodDisplay />
    </div>
  );
};

export default Home;
