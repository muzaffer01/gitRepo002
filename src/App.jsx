import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import './index.css';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}
