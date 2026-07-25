# KPSS Çalışma Paketi

## CAPABILITY

Öğrenci mobilde harita, hazır setler, günlük çalışma ve yanlışlar arasında hızlı
geçiş yapabilir; bütün hazır setlerden karışık KPSS denemesi çözebilir ve yanlış
yaptığı soruları daha sonra yeniden çalışabilir.

## CONSTRAINTS

- Çalışma verileri çevrimdışı kalmalı ve yalnız kullanıcının cihazında tutulmalı.
- Günlük çalışma en fazla 10 cevabı günlük ilerlemeye saymalı.
- Yanlış cevaplar soru kimliğiyle tekilleştirilmeli; tekrar yanlışta hata sayısı
  artmalı, doğru cevapta yanlışlar listesinden kaldırılmalı.
- Hazır setlerin kaynak verisi değiştirilmemeli.
- Yoğun haritalar bilgi kaybetmeden il bazında kümelenmeli; il seçilince ayrıntı
  mevcut bilgi panelinde gösterilmeli.

## IMPLEMENTATION CONTRACT

- IndexedDB, günlük ilerleme ve yanlış soru kayıtlarının sahibidir.
- Quiz ekranı `standart`, `günlük`, `yanlışlar` ve `karışık` modlarını destekler.
- Mobil alt menü Harita, Setler, Günlük ve Yanlışlar yüzeylerini açar.
- Karışık ve günlük modlar bütün hazır setlerin soru ve harita işaretlerinden
  dengeli bir oturum üretir.
- Yoğun işaret kümeleri il ve kümedeki işaret sayısını gösterir.

## NON-GOALS

- Kullanıcı hesabı, sunucu senkronizasyonu ve çevrim içi liderlik tablosu yoktur.
- Günlük soru havuzu uzaktan güncellenmez.

## OPEN QUESTIONS

- Çoklu cihaz senkronizasyonu ileride ayrı bir hesap/senkronizasyon paketi olarak
  ele alınabilir.

## HANDOFF

Mevcut React, Dexie ve hazır set mimarisi içinde doğrudan uygulanabilir.
