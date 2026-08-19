import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Wheels from './pages/Wheels';
import Tires from './pages/Tires';
import Merch from './pages/Merch';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Service from './pages/Service';
import Parts from './pages/Parts';
import Sales from './pages/Sales';
import Finance from './pages/Finance';
import ToyotaQ from './pages/ToyotaQ';
import ToyotaQDetail from './pages/ToyotaQDetail';
import FAQ from './pages/FAQ';
import Compare from './pages/Compare';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Viewer360 from './pages/Viewer360';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingCalculator from './components/FloatingCalculator';

function AppContent() {
  const location = useLocation();
  // Админ хуудсууд дээр Navbar болон Footer-ийг нуух
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wheels" element={<Wheels />} />
          <Route path="/wheels/:id" element={<ProductDetail />} />
          <Route path="/tires" element={<Tires />} />
          <Route path="/tires/:id" element={<ProductDetail />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/:id" element={<ProductDetail />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/toyota-q" element={<ToyotaQ />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/toyota-q/:id" element={<ToyotaQDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/360" element={<Viewer360 />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingCalculator />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
