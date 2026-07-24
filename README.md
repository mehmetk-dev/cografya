# Coğrafya Atlasım

Türkiye'nin 81 ilini seçerek farklı çalışma haritaları oluşturabileceğiniz
yerel ve çevrimdışı çalışan bir coğrafya not uygulaması.

## Özellikler

- Gerçek il sınırlarına sahip, 81 ili ayrı ayrı seçilebilen SVG harita
- Dağlar, tarım ürünleri, akarsular gibi bağımsız çalışma haritaları
- Soldan tek tıkla açılan 7 içerik dolu hazır set: dağlar, göller, akarsular,
  tarım, maden ve enerji, ticaret, sanayi ve fabrikalar
- Hazır setlerde il adları, il seçildiğinde salt okunur ayrıntı paneli ve
  MEB/KPSS hızlı notları
- Hazır ders setini koruyan salt okunur yapı; kişisel not için tek tıkla
  düzenlenebilir kopya oluşturma
- Hazır akarsu sistemlerinde önemli kollar, döküldüğü havza ve sınav notları
- Tarım, maden-enerji ve sanayi setlerinde konu seçici; aynı ürün veya kaynağın
  bütün önemli ilçe/havza dağılışlarını ayrı işaretlerle gösterme
- Madenin çıkarıldığı saha ile ilişkili rafineri, izabe, termik santral veya
  fabrika bağlantısını birlikte çalışma
- Dağ setinde kıvrım/kırık/volkanik grupları, lisanslı örnek fotoğraflar ve
  doğrudan set içeriğinden üretilen quiz
- Yedi hazır ders sayfasının tamamında toplam 56 açıklamalı KPSS/MEB bilgi
  sorusu; her turda haritada yer bulma sorularıyla karışık quiz
- Yanlış cevapta doğru seçeneği, kısa konu açıklamasını ve harita sorularında
  ilgili bilgi kartını gösteren öğrenme geri bildirimi
- Bir ile birden fazla kategorili bilgi maddesi ve ayrıntılı not ekleme
- Harita üzerinde kısa bilgi etiketi ve il renklendirme
- İl sınırları içinde tam koordinata dağ, tarım, akarsu, göl, maden,
  turizm, yerleşim veya özel simge bırakma
- Dağ işaretlerini kıvrım, kırık/horst ve volkanik; ova işaretlerini tektonik,
  delta, karstik, kıyı ve iç bölge sınıflarına ayırma
- Her KPSS yer şekli alt türü için ayrı simge, varsayılan renk ve oluşum özeti
- Başlıca Türkiye tarım ürünlerini tahıl, baklagil, endüstri bitkisi, yağ
  bitkisi, meyve, içecek bitkisi, yumru bitki ve sebze gruplarında seçme
- Madenleri metalik, metalik olmayan ve taş; enerji kaynaklarını fosil ve
  yenilenebilir alt türleriyle işaretleme
- Gölleri oluşumuna, akarsuları döküldüğü havzaya, turizmi ve yerleşmeleri
  kendi KPSS alt başlıklarına göre ayırma
- Karakter işaretleri yerine Lucide tabanlı ve projeye özel gerçek SVG ikonlar
- Kullanılan işaret türlerinden otomatik harita lejantı oluşturma
- Dağ, tarım, akarsu ve diğer işaret katmanlarını ayrı ayrı açıp kapatma
- Kalem, ok, daire ve metin araçlarıyla harita üzerine kalıcı çizim yapma
- İl bulma test modu, doğru cevap oranı ve en iyi seri takibi
- İl, not, kategori ve işaret açıklamalarında gelişmiş arama
- Boş konu şablonlarıyla sıfırdan kişisel çalışma haritası oluşturma
- Harita tamamlama oranı ve çalışma ilerlemesi ekranı
- Tarayıcıda IndexedDB ile kalıcı kayıt
- Haritayı bütün notlarıyla çoğaltma
- JSON yedeği indirme ve geri yükleme
- Haritayı bütün il notlarıyla birlikte yüksek çözünürlüklü PNG olarak indirme
- A4 yatay yazdırma/PDF düzeni ve cihazın paylaşım menüsüyle harita gönderme
- Mobil, tablet ve masaüstü uyumlu arayüz

## Çalıştırma

```bash
npm install --include=dev
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

## Üretim derlemesi

```bash
npm run build
npm run preview
```

Harita verisinin kaynağı ve lisansı için [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)
dosyasına bakın.
