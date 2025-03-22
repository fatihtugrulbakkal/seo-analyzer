import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SEOAnalyzer from './SEOAnalyzer';
import SEOContentControl from './SEOContentControl';
import { FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        { }
        <header className="header">
          <h1>🚀 SEO Optimizasyon Aracı</h1>
          <p>SEO Optimizasyon Aracı, web sitenizin SEO uyumluluğunu hızla analiz eder ve iyileştirmeler için pratik öneriler sunar. İçeriğinizin başlık, açıklama, anahtar kelime ve içerik uzunluğunu kontrol ederek SEO kriterlerine uygun hale getirir. SEO Analiz Aracı ile sitenizin SEO performansını değerlendirirken, Makale Kontrolcüsü içeriklerinizi optimize etmenize yardımcı olur. Bu araçları kullanarak, arama motorlarında daha yüksek sıralamalar elde edebilirsiniz.</p>
        </header>

        { }
        <nav className="navbar">
          <h2 className="logo">🔍 SEO Aracı</h2>
          <div className="nav-links">
            <Link to="/" className="nav-item">
              <FaChartLine className="nav-icon" /> SEO Analiz
            </Link>
            <Link to="/icerik" className="nav-item">
              <FaClipboardCheck className="nav-icon" /> SEO İçerik Kontrolcusu
            </Link>
          </div>
        </nav>

        { }
        <div className="content">
          <Routes>
            <Route path="/" element={<SEOAnalyzer />} />
            <Route path="/icerik" element={<SEOContentControl />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
