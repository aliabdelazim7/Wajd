import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import About from './pages/About.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Services from './pages/Services.jsx';
import Admin from './pages/Admin.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Error from './pages/Error.jsx';

const AppV2 = () => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<CaseStudy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/services" element={<Services />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
};

export default AppV2;
