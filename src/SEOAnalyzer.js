import React, { useState } from 'react';
import axios from 'axios';
import './analiz.css';

const SEOAnalyzer = () => {
    const [alanAdi, setAlanAdi] = useState('');
    const [seoVerileri, setSeoVerileri] = useState(null);
    const [seoOnerileri, setSeoOnerileri] = useState({});
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState(null);


    const seoElemanlari = {
        title: 'Site Başlığı',
        description: 'Site Açıklaması',
        url: 'Site Adresi',
        pageSpeed: 'Site Hızı',
        titleLength: 'Başlık Uzunluğu',
        descriptionLength: 'Açıklama Uzunluğu',
        wordCount: 'Kelime Sayısı',
        h1Tag: 'H1 Etiketi',
        altTextCount: 'Alt Metin Sayısı',
        internalLinks: 'Dahili Bağlantılar',
        isHttps: 'HTTPS Protokolü',
        canonicalTag: 'Canonical Etiketi',
        schemaMarkup: 'Şema Markup',
        robotsTxt: 'Robots.txt Dosyası',
        xmlSitemap: 'XML Sitemap'
    };

    const handleInputChange = (e) => {
        setAlanAdi(e.target.value);
    };

    const getAIRecommendation = async (seoElemani, deger) => {
        try {
            const response = await axios.get(`http://localhost:3001/ai-recommendation?q=${seoElemani}&value=${deger}`);
            return response.data.recommendation;
        } catch (error) {
            console.error("AI önerisi alınırken hata oluştu:", error);
            return "Bu alan için AI önerisi alınamadı.";
        }
    };

    const handleAnalyze = async () => {
        if (!alanAdi) {
            alert('Lütfen bir alan adı girin!');
            return;
        }

        setYukleniyor(true);
        setHata(null);
        setSeoOnerileri({});

        try {
            const response = await axios.get(`http://localhost:3001/seo-analyze?q=${alanAdi}`);
            if (response.data) {
                setSeoVerileri(response.data.seoData);

                const oneriler = {};


                await Promise.all(
                    Object.entries(response.data.seoData).map(async ([anahtar, deger]) => {
                        const seoBaslik = seoElemanlari[anahtar] || anahtar;


                        let öneri = '';


                        if (anahtar === 'titleLength' && deger < 50) {
                            öneri = 'Başlık uzunluğu 50 karakterden kısa. SEO için başlık uzunluğunu artırmalısınız.';
                        }

                        else if (anahtar === 'h1Tag' && !deger) {
                            öneri = 'Sayfanızda H1 etiketi bulunmuyor. Her sayfada bir H1 etiketi olmalıdır.';
                        }

                        else if (anahtar === 'altTextCount' && deger < 1) {
                            öneri = 'Resimlerinizde alt metin eksik. SEO uyumlu olmak için her resme alt metin eklemelisiniz.';
                        }

                        else if (anahtar === 'isHttps' && !deger) {
                            öneri = 'Sayfanızda HTTPS kullanılmıyor. HTTPS kullanmanız güvenlik açısından önemlidir.';
                        }

                        if (!öneri) {
                            öneri = await getAIRecommendation(anahtar, deger);
                        }


                        oneriler[anahtar] = öneri;
                    })
                );

                setSeoOnerileri(oneriler);
            }
        } catch (error) {
            console.error('Hata:', error);
            setHata("SEO analizi sırasında bir hata oluştu!");
        }

        setYukleniyor(false);
    };

    return (
        <div className="seo-analyzer">
            <h2 className="main-title">SEO Analiz Aracı</h2>
            <div className="input-container">
                <input
                    type="text"
                    value={alanAdi}
                    onChange={handleInputChange}
                    placeholder="Alan adı girin (ör: google.com)"
                    className="input-field"
                />
                <button onClick={handleAnalyze} disabled={yukleniyor} className="action-btn">
                    {yukleniyor ? 'Analiz Ediliyor...' : 'Analiz Başlat'}
                </button>
            </div>

            {yukleniyor && <div className="loading-message">Analiz Yapılıyor...</div>}

            {hata && <div className="error-message">{hata}</div>}

            {seoVerileri && (
                <div className="results-container">
                    <h3 className="section-title">SEO Verileri</h3>
                    <div className="seo-data-grid">
                        {Object.entries(seoVerileri).map(([anahtar, deger], index) => (
                            <div className="seo-data-item" key={index}>
                                <strong>{seoElemanlari[anahtar] || anahtar}:</strong>
                                <p>{deger || 'Veri Bulunamadı'}</p>

                                { }
                                {seoOnerileri[anahtar] && (
                                    <div className="seo-recommendation">
                                        <strong>Öneri:</strong>
                                        <p>{seoOnerileri[anahtar]}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SEOAnalyzer;
