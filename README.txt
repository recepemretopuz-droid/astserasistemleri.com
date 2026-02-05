# Topuz Sera & Yapı - Kurumsal Web Sitesi (Statik)

Bu klasör, hazır bir kurumsal web sitesi şablonudur. **Fotoğraflarınızı ekleyip** hızlıca yayına alabilirsiniz.

## Sayfalar
- `index.html` (Ana sayfa)
- `hizmetler.html`
- `projeler.html`
- `instagram.html` (Instagram gönderi linkleriyle çalışan galeri)
- `urunler.html` (1.8 ton mini ekskavatör - 2 adet stok)
- `iletisim.html` (adres + harita)

## Fotoğraflarınızı ekleme
1. Fotoğraflarınızı `assets/img/` klasörüne kopyalayın.
2. İlgili sayfadaki `<img src="...">` alanlarında dosya adlarını değiştirin.
   - Örnek: `assets/img/proje-1.svg` yerine `assets/img/sera-1.jpg`



## Instagram galerisini kullanma (video + fotoğraf)
Instagram'daki içerikleri siteye **embed** ederek (gömerek) göstermek için:

1. `data/instagram.json` dosyasını açın.
2. `items` listesine gönderi linklerini ekleyin.

Örnek:
{
  "category": "Sera Kurulumu",
  "permalink": "https://www.instagram.com/p/XXXXXXXXXXX/",
  "title": "Anahtar teslim sera kurulumu"
}

- Fotoğraf gönderileri genelde `.../p/.../`
- Reels videoları genelde `.../reel/.../`

Sonra `instagram.html` sayfasını yenileyin.

## Marka adı / metin güncelleme
- Marka adı ve metinleri HTML dosyalarından kolayca düzenleyebilirsiniz.
- Renkleri `assets/css/style.css` içinde `:root` bölümünden değiştirebilirsiniz.

## Yayınlama
- Dosyaları bir hosting'e yükleyin (cPanel, FTP, GitHub Pages, Netlify vb.)
- Statik site olduğu için özel bir sunucu yazılımı gerekmez.

## İletişim
- Yetkili: Süleyman Topuz
- Telefon: +90 535 218 71 33
- Adres: Merve Mahallesi Rauf Sokak No:10, Sancaktepe / İstanbul


## Temsili görseller
- Ana sayfada ve hizmetler sayfasında kullanılan bazı görseller **temsili (AI/illüstrasyon)** amaçlıdır.
- Kendi iş fotoğraflarınızı özellikle `projeler.html` bölümüne eklemeniz önerilir.

Yeni eklenen temsili görseller:
- `assets/img/hero-tarim.svg`
- `assets/img/svc-sera.svg`
- `assets/img/svc-sulu.svg`
- `assets/img/svc-sutasarruf.svg`
- `assets/img/svc-topraksiz.svg`
- `assets/img/svc-zemin.svg`
- `assets/img/svc-epoksi.svg`
- `assets/img/svc-cevreleme.svg`

İsterseniz bu dosyaların yerine kendi görsellerinizi koyabilir veya dosya adlarını HTML içinde değiştirebilirsiniz.
