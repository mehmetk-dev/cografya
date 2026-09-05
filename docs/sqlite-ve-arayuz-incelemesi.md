# SQLite ve arayüz düzenlemesi — 5 Eylül 2026

## Düzeltilen kayıt sorunları

- `.env.local` içindeki `VITE_PUBLIC_ACCESS=true`, AuthGate ve CloudWorkspace'i tamamen atlıyordu. Hesaplı kullanım için false yapıldı. Misafir modu ayrı olarak duruyor; tarayıcıya kaydeder.
- `sqliteClient.atlas.syncRow` ağ/sunucu hatalarını sahte bir sürüm numarasıyla başarıya çeviriyordu. Hatalar artık yukarı taşınıyor; kayıt göstergesi bekleyen kaydı gösteriyor.
- Başarısız atlas okuması ile sunucuda henüz kayıt bulunmaması ayrıldı. Başarısız okuma boş snapshot yazımına dönüşmüyor.
- Backend atlas ve soru uçları istemcinin gönderdiği kullanıcı kimliğine güveniyordu. Artık token zorunlu; başka kullanıcı kimliği 403 alır.
- Şifresiz ortak hesap girişi ve ağ hatasında uydurma oturum üretimi kaldırıldı. Mevcut hesap kimlikleri ve kayıtları korundu.
- Boş/geçersiz sunucu oturumu artık tarayıcıda aktif tutulmuyor. Geçici bağlantı kesintisi yerel çalışma verisini silmiyor.
- SQLite foreign key denetimi etkin. Yazımlar BEGIN IMMEDIATE ve zorunlu revision karşılaştırması kullanıyor. `force` artık çakışma kontrolünü atlayamıyor. Önceki atlas sürümleri ayrı tabloda korunuyor.
- Soru ilerlemesi GET uç noktasının eksik JSON cevabı düzeltildi.
- Soru havuzunun cevapları ve yıldızlı listesi atlas snapshot'ına eklendi. Üç yönlü birleştirme cevap sıfırlama ve yıldız kaldırma işlemlerini koruyor.
- Başarısız yazımlar bağlantı geri geldiğinde, pencere odağında ve periyodik denetimde yeniden deneniyor.
- Hesap/provider değişmeden önce mevcut tarayıcı verisi IndexedDB `workspaceBackups` tablosunda eski kullanıcı kimliğiyle saklanıyor. Yedekleme başarısız olursa farklı hesaba ait çalışma alanı açılmıyor.
- Eski SHA-256 şifreleri başarılı girişte salt içeren PBKDF2 formatına yükseltiliyor. Oturum ömrü 30 gün. Var olan varsayılan şifre otomatik değiştirilmedi; `python3 server.py --set-password EPOSTA` ile değiştirilebilir.
- Statik dosya yolunun `dist` dışına çıkması engellendi; JSON giriş tipi/boyutu kontrol ediliyor. Yerel sunucu yalnızca localhost dinliyor.

## Arayüz

- Osmanlı, Atatürk, konu notları ve soru havuzu ortak Atlasım gezinmesini kullanıyor.
- Koyu sayfa yüzeyleri ana menüdeki krem, kâğıt, koyu yeşil ve sıcak sarı renklerle uyumlu hale getirildi.
- Soru cevabı verildiğinde soru ve açıklaması ekranda kalıyor. Sonraki soruya kullanıcı geçiyor.
- Ders ilerlemesi, doğruluk ve tekrar edilecek soru sayısı gerçek cevaplardan hesaplanıyor. Ders toplamları sabit metin olmaktan çıkarıldı.
- Cevaptan emin olma seçimi ve doğru/yanlış açıklaması eklendi. Açıklamayı gizleyerek kendini yoklama ve tekrar listesine kaydetme erişilebilir.
- Yanlış soruyu yeniden çözmek filtre yüzünden soruyu kaybettirmiyor. Ders sıfırlama yalnızca seçili dersin cevaplarını temizliyor, diğer dersler ve yıldızlı sorular korunuyor.
- Mobil üst alan küçültüldü; şıklar ve önemli kontroller en az 44 piksel dokunma alanına sahip. Alt eylem çubuğu güvenli ekran boşluklarını hesaba katıyor.
- Filtre paneli Escape ile kapanıyor; klavye odağı panelde tutulup kapanınca geri veriliyor. Depolama hatası görünür uyarı veriyor.

## Mevcut veri ve dağıtım

Mevcut SQLite dosyasının salt okunur bütünlük kontrolü `ok` döndürdü; atlas JSON kaydı geçerliydi. Şema açılışından önce SQLite backup API ile `/tmp/cografya-before-update-44248981428442c38be85cf1e4afa62f.db` yedeği alındı. `/tmp` kalıcı yedek alanı değildir.

Aktif Supabase istemcisi/bağımlılığı kaldırıldı. Eski `supabase/` migration klasörü tarihsel kayıt olarak kaldı. Supabase'deki uzak veriyle birebir aktarım karşılaştırması yapılmadı; yerel veritabanının sağlam olması uzak verilerin tamamının aktarılmış olduğunu kanıtlamaz.

Docker `/data/cografya.db` kullanıyor. Coolify'da `/data` kalıcı volume'a bağlanmalı. Nixpacks için DB_PATH kalıcı disk konumuna ayarlanmalı. Yalnızca dist klasörünü statik bir servise yüklemek artık hesaplı SQLite kullanımını sağlamaz. Derleme zamanındaki VITE_PUBLIC_ACCESS ayarı üretimde de false olmalıdır.

Ayrıntılı kurulum ve şifre yenileme için README'ye bakın. Değişiklikler yereldir; uzak sunucuya dağıtım yapılmadı.
