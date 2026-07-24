# Türkiye Coğrafya Çalışma Haritası — Yapım Planı

## 1. Projenin amacı

Türkiye'nin gerçek il sınırlarını gösteren, 81 ilin ayrı ayrı seçilebildiği ve kullanıcının farklı çalışma haritaları oluşturup kaydedebildiği bir web uygulaması yapılacak.

Örnek kullanım:

- "Türkiye'deki Dağlar" isimli bir harita oluşturmak
- Ağrı iline tıklayıp "Ağrı Dağı" kaydı eklemek
- "Tarım Ürünleri" isimli başka bir harita oluşturmak
- Rize'ye "Çay", Ordu'ya "Fındık" eklemek
- Her haritanın içeriğini birbirinden bağımsız kaydetmek
- Daha sonra kayıtlı haritayı yeniden açıp düzenlemek

## 2. Temel ürün kararı

Harita bir fotoğraf üzerine görünmez tıklama alanları çizilerek yapılmayacak. Bunun yerine gerçek il sınırlarını içeren vektörel SVG veya GeoJSON veri seti kullanılacak.

Bunun nedenleri:

- Her il kendi gerçek sınırı üzerinden tıklanabilir.
- Harita büyütülünce bozulmaz.
- Seçilen il renklendirilebilir.
- İl adları ve kayıt işaretleri haritanın üzerine yerleştirilebilir.
- Mobil ve masaüstü ekranlara uyarlanabilir.
- 81 ilin tamamının bulunduğu otomatik bir doğrulama testi yazılabilir.

Kullanıcı tarafından verilecek bir Türkiye haritası görseli renk ve görünüm referansı olabilir; etkileşim altyapısının kaynağı yine vektörel il sınırları olmalıdır.

## 3. Önerilen teknoloji

İlk sürüm için:

- React
- TypeScript
- Vite
- Tailwind CSS
- Türkiye il sınırları için lisansı doğrulanmış GeoJSON/SVG veri seti
- Harita katmanı için React Leaflet veya doğrudan etkileşimli SVG
- Yerel kayıt için IndexedDB
- IndexedDB kullanımını sadeleştirmek için Dexie
- Form doğrulama için Zod
- Testler için Vitest ve React Testing Library
- Tarayıcı akış testleri için Playwright

Tercih: İlk sürümde doğrudan etkileşimli SVG. Türkiye tek ülke olarak gösterileceği için hafif, hızlı ve kontrolü kolaydır. Serbest yakınlaştırma ve ayrıntılı coğrafi işaretleme önemli hâle gelirse GeoJSON + Leaflet katmanına geçilebilir.

## 4. İlk sürümde bulunacak ekranlar

### 4.1. Haritalarım

- Kayıtlı çalışma haritalarını kartlar hâlinde gösterir.
- Yeni harita oluşturur.
- Haritanın adını değiştirir.
- Haritayı çoğaltır.
- Haritayı silmeden önce onay ister.
- Son düzenleme tarihini gösterir.

Örnek haritalar:

- Türkiye'deki Dağlar
- Tarım Ürünleri
- Akarsular
- İklim Tipleri
- Madenler

### 4.2. Yeni harita oluşturma

Alanlar:

- Harita adı
- İsteğe bağlı açıklama
- Tema rengi
- Boş harita veya örnek şablon

İlk sürümde şablonlar veriyle dolu olmak zorunda değildir; yalnızca kullanıcıya çalışma türü seçtirebilir.

### 4.3. Harita düzenleyici

Ana alan gerçek Türkiye haritasını gösterir.

- 81 il tıklanabilir.
- Üzerine gelinen il vurgulanır.
- Seçilen il farklı renkle gösterilir.
- Not bulunan illerde küçük bir işaret veya renk görünür.
- İl adı haritanın üzerinde veya yakınında gösterilir.
- Yakınlaştırma, uzaklaştırma ve haritayı ekrana sığdırma düğmeleri bulunur.
- Mobilde seçilen ilin düzenleme alanı alttan açılır.
- Masaüstünde seçilen ilin düzenleme alanı sağ panelde açılır.

### 4.4. İl kayıt paneli

Bir ile tıklanınca şu alanlar açılır:

- İl adı ve plaka kodu
- Kısa başlık
- Birden fazla bilgi maddesi ekleme
- Madde türü veya kategori
- Açıklama/not
- Renk
- İsteğe bağlı simge

Örnek:

```text
İl: Rize
Kategori: Tarım
Bilgiler:
- Çay
- Kivi
Not: Türkiye'de çay üretiminin merkezi.
```

Bir ilde yalnızca tek metin yerine birden fazla bilgi maddesi tutulmalıdır. Böylece aynı il için birden fazla dağ, ürün, maden veya akarsu kaydedilebilir.

## 5. Haritanın üzerinde yazı gösterme kuralı

Uzun metinlerin tamamını küçük illerin içine yazmak okunabilir olmayacaktır. Bu nedenle iki seviyeli gösterim kullanılacak:

1. Harita üzerinde il adı ve kısa kayıt özeti veya simge
2. İle tıklanınca sağ panelde bütün kayıtlar ve açıklamalar

Kullanıcı isterse "Haritada yazıları göster" seçeneğini açıp kapatabilir. Küçük illerde çakışmayı azaltmak için yazılar il merkez koordinatına yerleştirilecek; gerekirse işaret çizgisi veya numaralı rozet kullanılacak.

## 6. Veri modeli

### StudyMap

```ts
type StudyMap = {
  id: string;
  name: string;
  description?: string;
  themeColor: string;
  showLabels: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### ProvinceRecord

```ts
type ProvinceRecord = {
  id: string;
  mapId: string;
  provinceCode: number;
  provinceName: string;
  title?: string;
  note?: string;
  color?: string;
  items: ProvinceItem[];
  updatedAt: string;
};
```

### ProvinceItem

```ts
type ProvinceItem = {
  id: string;
  text: string;
  category?: string;
  icon?: string;
};
```

Temel bütünlük kuralı:

- Bir çalışma haritasındaki kayıtlar yalnızca o haritaya aittir.
- İl eşleştirmesinde isim yerine değişmeyen 1–81 plaka kodu kullanılır.
- Aynı haritada bir il için tek `ProvinceRecord`, onun içinde birden fazla `ProvinceItem` bulunur.

## 7. Kayıt sistemi

### İlk sürüm: yerel ve çevrimdışı

- Veriler tarayıcıdaki IndexedDB'ye otomatik kaydedilir.
- Kullanıcı ayrıca "Kaydet" düğmesiyle görünür geri bildirim alır.
- Sayfa yenilendiğinde son içerik geri gelir.
- Farklı çalışma haritalarının verileri birbirine karışmaz.
- JSON olarak dışa aktar ve içe aktar özelliği bulunur.
- Böylece tarayıcı verileri silinse bile kullanıcı yedek alabilir.

### İkinci sürüm: hesap ve bulut eşitleme

İhtiyaç oluşursa:

- Kullanıcı hesabı
- Bulut veritabanı
- Telefon ve bilgisayar arasında eşitleme
- Paylaşılabilir salt okunur harita bağlantısı
- Öğretmen/öğrenci paylaşımı

eklenebilir. İlk MVP için sunucu zorunlu değildir.

## 8. Yapım aşamaları

### Aşama 1 — Proje iskeleti ve harita verisi

Bağımlılık: Yok.

Yapılacaklar:

- React + TypeScript projesini kurmak
- Temel sayfa düzenini ve yönlendirmeyi hazırlamak
- Lisansı uygun Türkiye il sınırı verisini projeye almak
- İl yollarını plaka kodları ve standart il adlarıyla eşleştirmek
- Veri kaynağı ve lisans bilgisini projede belgelemek

Çıkış ölçütleri:

- Uygulama açılır.
- Türkiye haritası görünür.
- Veri setinde 81 benzersiz il vardır.
- Her ilde plaka kodu ve standart ad vardır.

### Aşama 2 — 81 ilin tıklanabilir olması

Bağımlılık: Aşama 1.

Yapılacaklar:

- Hover, seçili ve kayıtlı il durumlarını oluşturmak
- Klavye ile il seçimini desteklemek
- İl etiketlerini ve merkez noktalarını yerleştirmek
- Yakınlaştırma ve ekrana sığdırma davranışını eklemek

Çıkış ölçütleri:

- Her il fare, dokunma ve klavye ile seçilebilir.
- Seçilen ilin adı ve plaka kodu doğru görünür.
- Hiçbir il başka bir ilin kaydını açmaz.

### Aşama 3 — Harita oluşturma ve yönetme

Bağımlılık: Aşama 1.

Yapılacaklar:

- Haritalarım ekranını oluşturmak
- Yeni çalışma haritası eklemek
- Yeniden adlandırma, çoğaltma ve silme işlemlerini eklemek
- Son açılan haritayı hatırlamak

Çıkış ölçütleri:

- Birden fazla çalışma haritası oluşturulabilir.
- Her harita bağımsız açılır.
- Silme işlemi yanlışlıkla tek tıklamada gerçekleşmez.

### Aşama 4 — İl notları ve bilgi maddeleri

Bağımlılık: Aşama 2 ve Aşama 3.

Yapılacaklar:

- İl kayıt panelini oluşturmak
- Başlık, not, renk ve birden fazla madde eklemek
- Düzenleme ve silme işlemlerini eklemek
- Kayıt bulunan ili haritada görsel olarak belirtmek
- Uzun yazıları panelde, kısa özeti harita üzerinde göstermek

Çıkış ölçütleri:

- Kullanıcı bir ile bir veya daha fazla bilgi ekleyebilir.
- Eklenen bilgi doğru ilin üzerinde işaretlenir.
- Aynı il farklı çalışma haritalarında farklı içerik taşıyabilir.

### Aşama 5 — Kalıcı kayıt ve yedekleme

Bağımlılık: Aşama 3 ve Aşama 4.

Yapılacaklar:

- IndexedDB veri katmanını kurmak
- Otomatik kaydetme durumunu göstermek
- JSON dışa aktarma ve içe aktarma eklemek
- Bozuk veya uyumsuz dosyalarda anlaşılır hata göstermek

Çıkış ölçütleri:

- Sayfa yenilendiğinde veriler kaybolmaz.
- Tarayıcı kapatılıp açıldığında kayıtlar geri gelir.
- Dışa aktarılan dosya tekrar içe alınabilir.
- Bir haritadaki veriler başka bir haritaya sızmaz.

### Aşama 6 — Mobil uyum, erişilebilirlik ve son doğrulama

Bağımlılık: Aşama 2–5.

Yapılacaklar:

- Telefon, tablet ve masaüstü görünümünü düzenlemek
- Renk körlüğü için yalnızca renge bağlı olmayan işaretler kullanmak
- Klavye odağı ve ekran okuyucu etiketleri eklemek
- Boş durum, hata durumu ve kaydetme geri bildirimlerini tamamlamak
- Son kullanım akışlarını Playwright ile sınamak

Çıkış ölçütleri:

- 81 il testi geçer.
- Yeni harita oluşturma, ile veri ekleme, yenileme ve geri açma testi geçer.
- İki ayrı haritada aynı ile farklı veri ekleme testi geçer.
- Mobil ekranda harita ve kayıt paneli kullanılabilir.
- Dışa aktarma/içe aktarma testi geçer.

## 9. Bağımlılık sırası

```text
Aşama 1
├── Aşama 2
└── Aşama 3
    Aşama 2 + Aşama 3
            └── Aşama 4
                └── Aşama 5
                    └── Aşama 6
```

Aşama 2 ile Aşama 3, proje iskeleti tamamlandıktan sonra birbirinden büyük ölçüde bağımsız ilerleyebilir.

## 10. MVP dışında tutulacaklar

İlk sürümün gereksiz büyümemesi için aşağıdakiler sonraya bırakılacak:

- Kullanıcı hesabı
- İnternet üzerinden paylaşma
- Öğretmen sınıf yönetimi
- Hazır coğrafya bilgi bankası
- Sınav ve puanlama sistemi
- Haritayı görsel veya PDF olarak dışa aktarma
- İl sınırları dışında serbest nokta, çizgi ve alan çizme

## 11. Daha sonraki geliştirmeler

- Hazır "Dağlar", "Akarsular", "Tarım", "Madenler" şablonları
- İl üzerine özel simge sürükleyip bırakma
- Dağın gerçek konumuna nokta koyma
- Akarsuları çizgi olarak ekleme
- Bölgeleri veya illeri renklendirerek lejant oluşturma
- Kendini test et modu: il adlarını gizle ve doğru ili bul
- Haritayı PNG/PDF olarak alma
- Paylaşılabilir bağlantı
- Bulut eşitleme

## 12. Riskler ve önlemler

### Harita veri kaynağında lisans belirsizliği

Önlem: Veri projeye alınmadan önce lisansı doğrulanacak ve kaynak dosyasıyla beraber kayıt altına alınacak.

### Küçük illerde yazıların üst üste binmesi

Önlem: Haritada kısa etiket/rozet, ayrıntılar için yan panel kullanılacak. Etiket açma-kapama seçeneği bulunacak.

### Tarayıcı verisinin kullanıcı tarafından silinmesi

Önlem: JSON yedekleme ilk sürümde bulunacak. Bulut eşitleme sonraki sürüme bırakılacak.

### İl isimlerinin farklı yazılması

Önlem: Ana anahtar olarak isim değil plaka kodu kullanılacak; Türkçe karakterli standart il adı ayrıca tutulacak.

### Fotoğraf üzerinden tıklanabilirlik

Önlem: Piksel koordinatlarına bağlı görsel hotspot yaklaşımı kullanılmayacak; vektör sınırlar kullanılacak.

## 13. Tamamlanmış MVP tanımı

Proje aşağıdaki senaryo eksiksiz çalıştığında MVP sayılır:

1. Kullanıcı "Tarım Ürünleri" adlı yeni bir harita oluşturur.
2. Türkiye haritasındaki Rize iline tıklar.
3. "Çay" ve "Kivi" maddelerini ekler.
4. Ordu'ya "Fındık" ekler.
5. Sayfayı yeniler ve bütün kayıtlarını tekrar görür.
6. "Dağlar" adlı ikinci bir harita oluşturur.
7. Ağrı'ya "Ağrı Dağı" ekler.
8. İki haritanın kayıtları birbirine karışmaz.
9. Çalışmasını JSON dosyası olarak dışa aktarır ve yeniden içe alabilir.

