# KPSS Çalışma Paketi

## CAPABILITY

Öğrenci mobilde harita, hazır setler, günlük çalışma ve yanlışlar arasında hızlı
geçiş yapabilir; bütün hazır setlerden karışık KPSS denemesi çözebilir ve yanlış
yaptığı soruları daha sonra yeniden çalışabilir.

## CONSTRAINTS

- Çalışma verileri IndexedDB'de yerel kalmalı ve oturum açan kullanıcının
  Supabase kaydıyla cihazlar arasında senkronize edilmelidir.
- Günlük çalışma en fazla 10 cevabı günlük ilerlemeye saymalı.
- Yanlış cevaplar soru kimliğiyle tekilleştirilmeli; tekrar yanlışta hata sayısı
  artmalı, doğru cevapta yanlışlar listesinden kaldırılmalı.
- Hazır setlerin kaynak verisi değiştirilmemeli.
- Yoğun haritalar bilgi kaybetmeden il bazında kümelenmeli; il seçilince ayrıntı
  mevcut bilgi panelinde gösterilmeli.

## IMPLEMENTATION CONTRACT

- IndexedDB çalışma sırasındaki yerel veri kaynağıdır; Supabase kullanıcıya ait
  bulut snapshot'ını RLS ile korur.
- Quiz ekranı `standart`, `günlük`, `yanlışlar` ve `karışık` modlarını destekler.
- Mobil alt menü Harita, Setler, Günlük ve Yanlışlar yüzeylerini açar.
- Karışık ve günlük modlar bütün hazır setlerin soru ve harita işaretlerinden
  dengeli bir oturum üretir.
- Yoğun işaret kümeleri il ve kümedeki işaret sayısını gösterir.

## NON-GOALS

- Çevrim içi liderlik tablosu ve kullanıcılar arası paylaşım yoktur.
- Günlük soru havuzu uzaktan güncellenmez.

## HANDOFF

Mevcut React, Dexie, Supabase Auth ve kullanıcı snapshot senkronizasyonu içinde
doğrudan uygulanabilir.
