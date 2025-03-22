import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './icerik.css';

const SEOContentControl = () => {
    const [baslik, setBaslik] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [anahtarKelime, setAnahtarKelime] = useState('');
    const [icerik, setIcerik] = useState('');
    const [seoKontrolu, setSeoKontrolu] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSeoControl = () => {
        setLoading(true);
        setTimeout(() => {
            const titleValid = baslik.length >= 10 && baslik.length <= 60;
            const descriptionValid = aciklama.length >= 50 && aciklama.length <= 160;
            const keywordsValid = anahtarKelime.split(',').length >= 2;
            const contentValid = icerik.length >= 300;

            setSeoKontrolu({
                title: titleValid,
                description: descriptionValid,
                keywords: keywordsValid,
                content: contentValid,
                titleMessage: titleValid ? '' : 'Başlık 10-60 karakter arasında olmalıdır.',
                descriptionMessage: descriptionValid ? '' : 'Açıklama 50-160 karakter arasında olmalıdır.',
                keywordsMessage: keywordsValid ? '' : 'En az iki anahtar kelime girilmelidir.',
                contentMessage: contentValid ? '' : 'İçerik en az 300 karakter olmalıdır.',
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="seo-content-control">
            <header>
                <h2>SEO İçerik Kontrolcusu</h2>
                <p>İçeriğinizi analiz edin ve SEO uyumluluğunu artırın.</p>
            </header>
            <div className="input-group">
                <label htmlFor="baslik">Başlık:</label>
                <input
                    type="text"
                    id="baslik"
                    value={baslik}
                    onChange={(e) => setBaslik(e.target.value)}
                    placeholder="Başlık girin"
                />
            </div>
            <div className="input-group">
                <label htmlFor="aciklama">Açıklama:</label>
                <textarea
                    id="aciklama"
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                    placeholder="Açıklama girin"
                ></textarea>
            </div>
            <div className="input-group">
                <label htmlFor="anahtarKelime">Anahtar Kelime (virgülle ayırın):</label>
                <input
                    type="text"
                    id="anahtarKelime"
                    value={anahtarKelime}
                    onChange={(e) => setAnahtarKelime(e.target.value)}
                    placeholder="Anahtar kelime girin"
                />
            </div>
            <div className="input-group">
                <label htmlFor="icerik">İçerik:</label>
                <textarea
                    id="icerik"
                    value={icerik}
                    onChange={(e) => setIcerik(e.target.value)}
                    placeholder="İçerik girin"
                ></textarea>
            </div>
            <button onClick={handleSeoControl} disabled={loading}>
                {loading ? 'SEO Kontrolü Yapılıyor...' : 'SEO Kontrolünü Başlat'}
            </button>

            {seoKontrolu && (
                <div className="seo-result">
                    <h3>SEO Kontrol Sonuçları:</h3>
                    <div className="result-item">
                        <strong>Başlık:</strong> {seoKontrolu.title ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
                        {seoKontrolu.titleMessage && <p>{seoKontrolu.titleMessage}</p>}
                    </div>
                    <div className="result-item">
                        <strong>Açıklama:</strong> {seoKontrolu.description ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
                        {seoKontrolu.descriptionMessage && <p>{seoKontrolu.descriptionMessage}</p>}
                    </div>
                    <div className="result-item">
                        <strong>Anahtar Kelime:</strong> {seoKontrolu.keywords ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
                        {seoKontrolu.keywordsMessage && <p>{seoKontrolu.keywordsMessage}</p>}
                    </div>
                    <div className="result-item">
                        <strong>İçerik:</strong> {seoKontrolu.content ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
                        {seoKontrolu.contentMessage && <p>{seoKontrolu.contentMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SEOContentControl;
