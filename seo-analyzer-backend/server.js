const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { getJson } = require('serpapi');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const serpApiKey = "SERPAPI_API";
const openAiApiKey = "OPENAI_API";
const pageSpeedApiKey = "PAGESPEED_API"; // Google PageSpeed API Anahtarınız

// SEO Analiz Endpoinit
app.get('/seo-analyze', async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.status(400).json({ error: "Arama terimi gereklidir!" });
    }

    try {
        getJson({
            engine: "google",
            q: searchQuery,
            api_key: serpApiKey,
            location: "Turkey",
            hl: "tr",
            gl: "tr",
            num: 10,
        }, async (json) => {
            if (json.error) {
                console.error("SerpApi Hata:", json.error);
                return res.status(500).json({ error: json.error });
            }

            const url = json["organic_results"]?.[0]?.link || "URL bulunamadı";
            let h1Tag = "H1 etiketi analiz edilmedi";
            let altTextCount = 0;
            let internalLinks = 0;
            let canonicalTag = "Canonical etiketi analiz edilmedi";
            let schemaMarkup = "Schema markup analiz edilmedi";

            let robotsTxt = "Robots.txt dosyası analiz edilmedi";
            let xmlSitemap = "XML Sitemap dosyası analiz edilmedi";

            try {
                const pageResponse = await axios.get(url);
                const $ = cheerio.load(pageResponse.data);

                const h1 = $('h1').first().text();
                h1Tag = h1 || "H1 etiketi bulunamadı";
                altTextCount = $('img[alt]').length;

                $('a[href]').each((index, element) => {
                    const link = $(element).attr('href');
                    if (link && (link.startsWith('/') || link.includes(url))) {
                        internalLinks++;
                    }
                });

                const canonicalLink = $('link[rel="canonical"]').attr('href');
                if (canonicalLink) {
                    canonicalTag = canonicalLink;
                }

                const schemaJsonLd = $('script[type="application/ld+json"]').html();
                if (schemaJsonLd) {
                    schemaMarkup = "Schema markup bulundu.";
                }

                try {
                    const robotsResponse = await axios.get(`${url}/robots.txt`);
                    robotsTxt = robotsResponse.status === 200 ? "Robots.txt dosyası mevcut" : "Robots.txt dosyası bulunamadı";
                } catch (robotsError) {
                    robotsTxt = "Robots.txt dosyasına erişilemedi";
                }

                try {
                    const sitemapResponse = await axios.get(`${url}/sitemap.xml`);
                    xmlSitemap = sitemapResponse.status === 200 ? "XML Sitemap dosyası mevcut" : "XML Sitemap dosyası bulunamadı";
                } catch (sitemapError) {
                    xmlSitemap = "XML Sitemap dosyasına erişilemedi";
                }

            } catch (error) {
                console.error("Sayfa verisi alınırken hata oluştu:", error);
                h1Tag = "Veri alınamadı";
            }

            const seoData = {
                title: json["organic_results"]?.[0]?.title || "Başlık bulunamadı",
                description: json["organic_results"]?.[0]?.snippet || "Açıklama bulunamadı",
                url: url,
                titleLength: json["organic_results"]?.[0]?.title?.length || 0,
                descriptionLength: json["organic_results"]?.[0]?.snippet?.length || 0,
                wordCount: json["organic_results"]?.[0]?.snippet?.split(' ').length || 0,
                h1Tag: h1Tag,
                altTextCount: altTextCount,
                internalLinks: internalLinks,
                pageSpeed: "Analiz ediliyor...",
                isHttps: url.startsWith('https'),
                canonicalTag: canonicalTag,
                schemaMarkup: schemaMarkup,
                robotsTxt: robotsTxt,
                xmlSitemap: xmlSitemap
            };

            try {
                const pageSpeedResponse = await axios.get(
                    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${pageSpeedApiKey}`
                );
                seoData.pageSpeed = pageSpeedResponse.data.lighthouseResult.categories.performance.score * 100; // 0-100 arası skor
            } catch (pageSpeedError) {
                console.error("PageSpeed verisi alınırken hata oluştu:", pageSpeedError);
                seoData.pageSpeed = "Sayfa hızı alınamadı.";
            }

            res.json({ seoData });
        });
    } catch (error) {
        console.error("SEO verisi alma sırasında hata oluştu:", error);
        res.status(500).json({ error: "SEO verisi alınamadı." });
    }
});

// AI Öneri Sistemi Endpoint'i
app.get('/ai-recommendation', async (req, res) => {
    const { q, value } = req.query;

    if (!q || !value) {
        return res.status(400).json({ error: "Alan ve değer gereklidir!" });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `Sen bir SEO danışmanısın ve belirli bir SEO alanına göre önerilerde bulunacaksın. Önerilerin en fazla 4 cümle içermelidir Cümleler tam olmalı yarım bırakılmamalıdır.`
                    },
                    {
                        role: "user",
                        content: `SEO alanı: ${q}, Değer: ${value}. Bu alan için bir değerlendirme ve en fazla 3 cümlelik öneri sun.`
                    }
                ],
                max_tokens: 125,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${openAiApiKey}`,
                },
                timeout: 10000, // 10 saniye zaman aşımı
            }
        );

        console.log("OpenAI Yanıtı:", response.data); // Yanıtı console'a yazdırarak daha fazla bilgi alın

        const recommendation = response.data.choices?.[0]?.message?.content || "Bu alan için AI önerisi alınamadı.";
        res.json({ recommendation });
    } catch (error) {
        console.error("OpenAI API isteği sırasında hata oluştu:", error.response?.data || error.message);
        res.status(500).json({ error: "Bu alan için AI önerisi alınamadı." });
    }
});

app.listen(port, () => {
    console.log(`Backend server'ı http://localhost:${port} adresinde çalışıyor...`);
});
