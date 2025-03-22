import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './icerik.css';
function SEOContentControl() {
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [anahtarKelime, setAnahtarKelime] = useState('');
    const [icerik, setIcerik] = useState('');
    const [seoKontrolSonucu, setSeoKontrolSonucu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hata, setHata] = useState('');

    const handleInputChange = (e, setterFunction) => {
        setterFunction(e.target.value);
    };

    const handleSEOControl = async () => {
        if (!baslik || !aciklama || !anahtarKelime || !icerik) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        setLoading(true);
        setHata('');

        try {
            const response = await axios.post('http://localhost:3001/seo-analyze-content', {
                baslik,
                aciklama,
                anahtarKelime,
                icerik,
            });
            setSeoKontrolSonucu(response.data);
        } catch (error) {
            console.error('SEO kontrolü sırasında hata oluştu:', error);
            setHata('SEO kontrolü sırasında bir hata oluştu!');
        }
        setLoading(false);
    };

    return (
        <div className="seo-content-control">
            <header className="header">
                <h1>SEO İçerik Kontrolcusu</h1>
            </header>
            <div className="content-form">
                <input
                    type="text"
                    placeholder="Başlık"
                    value={baslik}
                    onChange={(e) => handleInputChange(e, setBaslik)}
                />
                <textarea
                    placeholder="Açıklama"
                    value={aciklama}
                    onChange={(e) => handleInputChange(e, setAciklama)}
                />
                <input
                    type="text"
                    placeholder="Anahtar Kelime"
                    value={anahtarKelime}
                    onChange={(e) => handleInputChange(e, setAnahtarKelime)}
                />
                <textarea
                    placeholder="İçerik"
                    value={icerik}
                    onChange={(e) => handleInputChange(e, setIcerik)}
                />
                <button onClick={handleSEOControl} disabled={loading}>
                    {loading ? 'Kontrol Ediliyor...' : 'SEO Kontrolünü Başlat'}
                </button>
            </div>
            {hata && <div className="error-message">{hata}</div>}
            {seoKontrolSonucu && (
                <div className="seo-result">
                    <h2>SEO Sonuçları</h2>
                    <div className="result-item">
                        <strong>Başlık:</strong>
                        <p>{seoKontrolSonucu.baslik}</p>
                    </div>
                    <div className="result-item">
                        <strong>Açıklama:</strong>
                        <p>{seoKontrolSonucu.aciklama}</p>
                    </div>
                    <div className="result-item">
                        <strong>Anahtar Kelime:</strong>
                        <p>{seoKontrolSonucu.anahtarKelime}</p>
                    </div>
                    <div className="result-item">
                        <strong>İçerik:</strong>
                        <p>{seoKontrolSonucu.icerik}</p>
                    </div>
                    <div className="result-item">
                        <strong>SEO Durumu:</strong>
                        <p>
                            {seoKontrolSonucu.seoUyumlu ? (
                                <FaCheckCircle size={20} color="green" />
                            ) : (
                                <FaExclamationCircle size={20} color="red" />
                            )}
                        </p>
                    </div>
                </div>
            )}
            <footer>
                <p>&copy; 2025 SEO İçerik Kontrolcusu. Tüm Hakları Saklıdır.</p>
            </footer>
        </div>
    );
}

export default SEOContentControl;
