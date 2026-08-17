import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Founder from './pages/Founder';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import FamilyTechHome from './pages/family-tech/FamilyTechHome';
import BuildYourBloomSchool from './pages/family-tech/BuildYourBloomSchool';
import Intake from './pages/family-tech/Intake';
import Forecast from './pages/family-tech/Forecast';
import BloomHome from './pages/family-tech/BloomHome';
import BloomAcademy from './pages/family-tech/BloomAcademy';
import BloomAthletics from './pages/family-tech/BloomAthletics';
import BloomFamilyFit from './pages/family-tech/BloomFamilyFit';
import BloomOS from './pages/family-tech/BloomOS';
import FamilySetup from './pages/family-tech/FamilySetup';
import BloomMeals from './pages/family-tech/BloomMeals';
import ResourceVault from './pages/family-tech/ResourceVault';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isFamilyTech = location.pathname.startsWith('/family-tech');

  return (
    <>
      {!isFamilyTech && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/family-tech" element={<FamilyTechHome />} />
          <Route path="/family-tech/build-your-bloom-school" element={<BuildYourBloomSchool />} />
          <Route path="/family-tech/intake" element={<Intake />} />
          <Route path="/family-tech/forecast" element={<Forecast />} />
          <Route path="/family-tech/home" element={<BloomHome />} />
          <Route path="/family-tech/academy" element={<BloomAcademy />} />
          <Route path="/family-tech/athletics" element={<BloomAthletics />} />
          <Route path="/family-tech/family-fit" element={<BloomFamilyFit />} />
          <Route path="/family-tech/bloom-os" element={<BloomOS />} />
          <Route path="/family-tech/setup" element={<FamilySetup />} />
          <Route path="/family-tech/meals" element={<BloomMeals />} />
          <Route path="/family-tech/resources" element={<ResourceVault />} />
        </Routes>
      </main>
      {!isFamilyTech && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
