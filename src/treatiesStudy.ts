// -*- coding: utf-8 -*-
/**
 * KPSS Tarih - Osmanlı ve Cumhuriyet Dönemi Savaşlar, Antlaşmalar ve Baş Harfli Kodlamalar Veri Havuzu
 */

export type TreatyPeriodId =
  | "all"
  | "kurulus"
  | "yukselme"
  | "duraklama"
  | "gerileme"
  | "dagilma"
  | "milli-mucadele-cumhuriyet";

export type TreatyPeriod = {
  id: TreatyPeriodId;
  name: string;
  century: string;
  badge: string;
  color: string;
  summary: string;
};

export const TREATY_PERIODS: TreatyPeriod[] = [
  {
    id: "kurulus",
    name: "Kuruluş Dönemi",
    century: "1299 - 1453",
    badge: "Beylikten Devlete",
    color: "#059669",
    summary: "Balkan fetihleri, Haçlı ittifaklarıyla yapılan ilk büyük meydan savaşları ve Rumeli'de kök salma evresi."
  },
  {
    id: "yukselme",
    name: "Yükselme Dönemi",
    century: "1453 - 1579",
    badge: "Cihan Devleti",
    color: "#d97706",
    summary: "İstanbul'un fethi, Doğu seferleri, Akdeniz hakimiyeti ve Osmanlı'nın Avrupa üzerindeki siyasi üstünlüğü."
  },
  {
    id: "duraklama",
    name: "Duraklama / 17. Yüzyıl",
    century: "1579 - 1699",
    badge: "Arayış Yılları",
    color: "#dc2626",
    summary: "Doğuda ve batıda en geniş sınırlara ulaşma, ardından II. Viyana sonrası büyük toprak kayıpları."
  },
  {
    id: "gerileme",
    name: "Gerileme / 18. Yüzyıl",
    century: "1699 - 1792",
    badge: "Değişim ve Diplomasi",
    color: "#7c3aed",
    summary: "Kaybedilen toprakları geri alma ümidiyle başlayan, Küçük Kaynarca ve Kırım'ın kaybıyla dağılmaya evrilen süreç."
  },
  {
    id: "dagilma",
    name: "Dağılma / 19-20. Yüzyıl",
    century: "1792 - 1918",
    badge: "En Uzun Yüzyıl",
    color: "#b45309",
    summary: "Denge siyaseti, azınlık isyanları, Boğazlar sorunu, Berlin Kongresi ve I. Dünya Savaşı yıkımı."
  },
  {
    id: "milli-mucadele-cumhuriyet",
    name: "Milli Mücadele & Cumhuriyet",
    century: "1919 - 1939+",
    badge: "Bağımsızlık ve Barış",
    color: "#2563eb",
    summary: "Mondros ve Sevr'in yırtılıp atılması, İnönü-Sakarya-Büyük Taarruz zaferleri, Lozan ve Montrö ile tam bağımsızlık."
  }
];

export type TreatyMnemonicItem = {
  letter: string;
  name: string;
  detail: string;
};

export type TreatyMnemonic = {
  id: string;
  periodId: TreatyPeriodId;
  title: string;
  code: string;
  slogan: string;
  description: string;
  items: TreatyMnemonicItem[];
  kpssTip: string;
  relatedEvents?: string[];
};

export type TreatyOrWarItem = {
  id: string;
  periodId: TreatyPeriodId;
  year: string;
  title: string;
  kind: "war" | "treaty" | "pact" | "protocol";
  parties: string; // Taraflar
  leader: string; // Padişah / Lider
  importance: string; // Önemi
  keyNotes: string[]; // KPSS Püf Noktaları
  mnemonicId?: string; // Bağlantılı kodlama
};

// ==========================================
// 1. TÜM KODLAMALAR (BAŞ HARFLERİ UYUMLU ŞİFRELER)
// ==========================================
export const ALL_TREATY_MNEMONICS: TreatyMnemonic[] = [
  // --- KURULUŞ ---
  {
    id: "sinav-2",
    periodId: "kurulus",
    title: "Kuruluş Haçlı Savaşları Sırası",
    code: "S - I - N - A - V  II (SINAV II)",
    slogan: "Kuruluşta Haçlılar Osmanlı'yı sınav yaptı ama Türkler kazandı!",
    description: "Osmanlı Devleti'nin Balkanlar'a yerleşmesini engellemek isteyen Haçlı ittifaklarıyla yapılan büyük meydan savaşları kronolojisi:",
    items: [
      { letter: "S", name: "Sırpsındığı (1364)", detail: "İlk Osmanlı - Haçlı savaşıdır. Hacı İlbey gece baskınıyla Haçlı ordusunu yok etti (I. Murad)." },
      { letter: "I", name: "I. Kosova (1389)", detail: "Büyük Haçlı ordusu imha edildi. İlk kez top kullanıldı. I. Murad savaş meydanını gezerken şehit düştü." },
      { letter: "N", name: "Niğbolu (1396)", detail: "Yıldırım Bayezid Haçlı şövalyelerini yendi. Abbasi Halifesi ona 'Sultan-ı İklîm-i Rûm' unvanı verdi." },
      { letter: "A", name: "Ankara Savaşı (1402) - TUZAK!", detail: "DİKKAT ÖSYM TUZAĞI! Ankara Savaşı Haçlılarla DEĞİL, Timur (Türk-İslam) ile yapıldı. 11 yıllık Fetret Devri başladı." },
      { letter: "V", name: "Varna Savaşı (1444)", detail: "II. Murad tahta tekrar geçerek Haçlıları ağır bir yenilgiye uğrattı." },
      { letter: "II", name: "II. Kosova (1448)", detail: "Haçlıların son taarruzu kırıldı. Balkanlar KESİN TÜRK YURDU oldu; Avrupalılar savunmaya çekildi." }
    ],
    kpssTip: "ÖSYM 'Aşağıdakilerden hangisi Haçlılarla yapılan bir savaş değildir?' diye sorup şıklara Ankara Savaşı'nı koyar. Ankara Timur iledir!",
    relatedEvents: ["sirpsindigi", "1-kosova", "nigbolu", "varna", "2-kosova"]
  },

  // --- DURAKLAMA / 17. YY ---
  {
    id: "fnsk-iran",
    periodId: "duraklama",
    title: "17. Yüzyıl İran Antlaşmaları Sırası",
    code: "F - N - S - K (Fil Ne Sert Koştu)",
    slogan: "İran sınırımız 4 büyük antlaşmayla adım adım çizildi!",
    description: "17. yüzyılda Safeviler (İran) ile imzalanan antlaşmaların kronolojik sırası ve sınır değişiklikleri:",
    items: [
      { letter: "F", name: "Ferhat Paşa Antlaşması (1590)", detail: "Tebriz, Karabağ, Gürcistan alındı. Osmanlı DOĞUDA EN GENİŞ SINIRLARA ulaştı (Hazar Denizi'ne çıkıldı)." },
      { letter: "N", name: "Nasuh Paşa Antlaşması (1612)", detail: "Ferhat Paşa ile alınan yerler geri verildi; İran yılda 200 deve yükü ipek vergi ödemeyi kabul etti." },
      { letter: "S", name: "Serav Antlaşması (1618)", detail: "Nasuh Paşa sınırları korundu; İran'ın ödeyeceği yıllık ipek vergisi 100 deve yüküne indirildi." },
      { letter: "K", name: "Kasr-ı Şirin Antlaşması (1639)", detail: "IV. Murad (Bağdat Fatihi); Bağdat Osmanlı'da, Revan İran'da kaldı. Zağros Dağları sınır oldu, GÜNÜMÜZ TÜRKİYE-İRAN SINIRI çizildi!" }
    ],
    kpssTip: "Doğuda en geniş sınırlar: FERHAT PAŞA. Günümüz sınırı: KASR-I ŞİRİN. Sıralama şifresi: F-N-S-K!",
    relatedEvents: ["ferhat-pasa", "nasuh-pasa", "serav", "kasri-sirin"]
  },

  {
    id: "17-yuzyil-sinirlar",
    periodId: "duraklama",
    title: "17. Yüzyıl En Geniş Sınırlar & İlkler",
    code: "B - B - K - F (Batı-Bucaş / Barış-Bahçesaray / Kayıp-Karlofça / Ferhat-Doğu)",
    slogan: "Duraklama döneminin sınır kaderini belirleyen 4 tarihi antlaşma:",
    description: "17. yüzyılda doğuda ve batıda sınırların zirveye ulaştığı ve ilk büyük kırılmaların yaşandığı antlaşmalar:",
    items: [
      { letter: "B", name: "Bucaş Antlaşması (1672)", detail: "Lehistan ile yapıldı. Podolya alındı. Osmanlı'nın BATIDA EN GENİŞ SINIRLARA ulaştığı ve toprak kattığı SON antlaşmadır." },
      { letter: "B", name: "Bahçesaray / Çehrin (1681)", detail: "Rusya ile tarihte imzalanan İLK RESMİ ANTLAŞMA'dır! Dinyeper (Özü) Nehri iki devlet arasında sınır oldu." },
      { letter: "K", name: "Karlofça Antlaşması (1699)", detail: "Osmanlı'nın BATIDA İLK BÜYÜK TOPRAK KAYBETTİĞİ antlaşmadır. Gerileme dönemi resmen başladı; garantör Avusturya oldu." },
      { letter: "F", name: "Ferhat Paşa (1590)", detail: "İran ile yapıldı; Osmanlı DOĞUDA EN GENİŞ SINIRLARINA ulaştı." }
    ],
    kpssTip: "Batıda en geniş sınır = BUCAŞ. Doğuda en geniş sınır = FERHAT PAŞA. Rusya ile ilk antlaşma = BAHÇESARAY (ÇEHRİN).",
    relatedEvents: ["bucas", "bahcesaray", "karlofca", "ferhat-pasa"]
  },

  // --- GERİLEME / 18. YY ---
  {
    id: "18-yuzyil-antlasmalari",
    periodId: "gerileme",
    title: "18. Yüzyıl Antlaşmaları Sırası",
    code: "P - P - B - K - Y (Padişah Para Bulursa Kolay Yaşar)",
    slogan: "18. yüzyılın tüm kritik antlaşmaları bu 5 harfte saklı!",
    description: "18. yüzyılda Osmanlı Devleti'nin kaderini çizen ve sınavda kronolojisi sorulan 5 ana antlaşma:",
    items: [
      { letter: "P", name: "Prut Antlaşması (1711)", detail: "Baltacı Mehmed Paşa Rus Çarı I. Petro'yu kuşattı. Azak Kalesi geri alındı. Karlofça ile kaybedilen yerleri geri alma ümidi doğdu!" },
      { letter: "P", name: "Pasarofça Antlaşması (1718)", detail: "Avusturya'ya Belgrad kaybedildi. Toprakları geri alma ümidi söndü, Avrupa'nın üstünlüğü kabul edildi ve LÂLE DEVRİ başladı!" },
      { letter: "B", name: "Belgrad Antlaşması (1739)", detail: "Fransa arabuluculuğuyla Belgrad geri alındı. 18. YÜZYILIN EN KÂRLI / SON KÂRLI ANTLAŞMASIDIR! Karadeniz son kez Türk gölü sayıldı." },
      { letter: "K", name: "Küçük Kaynarca (1774)", detail: "Tarihin en ağır antlaşmalarından biri: Kırım bağımsız oldu (halkı Müslüman ilk kayıp), Rusya'ya İLK KEZ SAVAŞ TAZMİNATI ödendi." },
      { letter: "Y", name: "Yaş Antlaşması (1792)", detail: "Kırım'ın kesin olarak Rusya'ya ait olduğu kabul edildi. Dniester sınırı çizildi ve Osmanlı DAĞILMA DÖNEMİNE girdi." }
    ],
    kpssTip: "18. yy Son Kazançlı Antlaşma = BELGRAD (1739). Karşılığında Fransa'ya kapitülasyonlar 1740'ta SÜREKLİ hale getirildi!",
    relatedEvents: ["prut", "pasarofca", "belgrad-1739", "kucuk-kaynarca", "yas"]
  },

  {
    id: "kirim-kay",
    periodId: "gerileme",
    title: "Kırım'ın Elden Çıkış Aşamaları",
    code: "K - A - Y (KAY: Küçük Kaynarca - Aynalıkavak - Yaş)",
    slogan: "Karadeniz'in kilidi Kırım elimizden adım adım 'KAY'dı gitti!",
    description: "Kırım'ın Osmanlı'dan kopup Rusya'ya bağlanmasının 3 aşaması:",
    items: [
      { letter: "K", name: "Küçük Kaynarca (1774)", detail: "Kırım bağımsız oldu (Osmanlı'dan koptu). Yalnızca dini bakımdan Halifeye bağlı kaldı (Halifelik ilk kez siyasi kullanıldı)." },
      { letter: "A", name: "Aynalıkavak Tenkihnamesi (1779)", detail: "Rus yanlısı Şahin Giray'ın Kırım Hanı olması Osmanlı tarafından resmen tanındı (Özerklik/Rus nüfuzu)." },
      { letter: "Y", name: "Yaş Antlaşması (1792)", detail: "Osmanlı, Kırım'ın Rusya'ya ilhakını ve bağlandığını resmen kabul etti (Tamamen Rusya'ya geçti)." }
    ],
    kpssTip: "Kırım Bağımsız = KÜÇÜK KAYNARCA. Kırım Rusya'ya Bağlandı = YAŞ ANTLAŞMASI. Kod: KAY!",
    relatedEvents: ["kucuk-kaynarca", "aynalikavak", "yas"]
  },

  // --- DAĞILMA / 19-20. YY ---
  {
    id: "balkan-azinlik-bagimsizlik",
    periodId: "dagilma",
    title: "Balkan Azınlıklarının Bağımsızlık Süreci",
    code: "İ S - Ö S - B Y - B E B (İsyan, Özerklik, Bağımsızlık)",
    slogan: "İlk imtiyaz Sırplara, ilk bağımsızlık Yunanlara!",
    description: "Milliyetçilik isyanları sonucu Balkan milletlerinin devletleşme aşamaları:",
    items: [
      { letter: "1", name: "Bükreş Antlaşması (1812)", detail: "Sırplara ilk kez İMTİYAZ (Ayrıcalık) verildi (Osmanlı'da ayrıcalık alan İLK topluluk Sırplardır)." },
      { letter: "2", name: "Edirne Antlaşması (1829)", detail: "Sırplara ÖZERKLİK verildi. YUNANİSTAN BAĞIMSIZ OLDU! (Osmanlı'dan ayrılarak bağımsız olan İLK azınlık Yunanistan'dır)." },
      { letter: "3", name: "Berlin Antlaşması (1878) - SAKAR", detail: "SIRBİSTAN, KARADAĞ ve ROMANYA bağımsız oldu! Kodlama: S-K-R (SAKAR)." }
    ],
    kpssTip: "İlk İsyan Eden = Sırplar (1804). İlk Ayrıcalık Alan = Sırplar (1812 Bükreş). İlk Bağımsız Olan = YUNANLAR (1829 Edirne).",
    relatedEvents: ["bukres-1812", "edirne-1829", "berlin-1878"]
  },

  {
    id: "berlin-bagimsiz-sakar",
    periodId: "dagilma",
    title: "1878 Berlin Antlaşması ile Bağımsız Olanlar",
    code: "S - A - K - A - R (Sırbistan, Karadağ, Romanya)",
    slogan: "Berlin Kongresi Osmanlı'nın Balkan topraklarında 'SAKAR'lık yarattı!",
    description: "93 Harbi (1877-78) sonrası Ayastefanos iptal edilip imzalanan Berlin Antlaşması'nda bağımsız olan devletler:",
    items: [
      { letter: "S", name: "Sırbistan", detail: "Bağımsız devlet oldu; Osmanlı egemenliğinden tamamen çıktı." },
      { letter: "K", name: "Karadağ", detail: "Bağımsız devlet statüsü kazandı." },
      { letter: "R", name: "Romanya", detail: "Eflak ve Boğdan birleşerek Romanya adıyla bağımsız oldu." }
    ],
    kpssTip: "Berlin'de bağımsız olan 3 devlet: SIRBİSTAN, KARADAĞ, ROMANYA. Ayrıca Kars, Ardahan, Batum (Elviye-i Selase) Rusya'ya bırakıldı; Kıbrıs yönetimi İngiltere'ye devredildi!",
    relatedEvents: ["berlin-1878"]
  },

  {
    id: "bogazlar-sureci",
    periodId: "dagilma",
    title: "Boğazlar Meselesinin Tarihsel Süreci",
    code: "H - B - L - S - L - M (Hünkâr, Balta, Londra, Sevr, Lozan, Montrö)",
    slogan: "Boğazlarımızın tek başına egemenlikten tam bağımsızlığa giden 6 adımı:",
    description: "Boğazlar sorununun Hünkar İskelesi ile doğup Montrö Boğazlar Sözleşmesi ile çözüldüğü 6 aşamalı tarihi süreç:",
    items: [
      { letter: "H", name: "Hünkâr İskelesi (1833)", detail: "Rusya ile yapıldı. Boğazlar üzerinde Osmanlı'nın TEK BAŞINA karar verdiği SON antlaşmadır; Boğazlar uluslararası sorun oldu." },
      { letter: "B", name: "Balta Limanı (1838)", detail: "İngiltere'nin desteğini almak için imzalandı; Osmanlı açık pazar haline geldi." },
      { letter: "L", name: "Londra Boğazlar Sözleşmesi (1841)", detail: "Boğazlar ilk kez ULUSLARARASI STATÜ kazandı; yabancı savaş gemilerine kapatıldı." },
      { letter: "S", name: "Sevr Antlaşması (1920)", detail: "Boğazlar başkanı Türk olmayan, ayrı bayrağı ve bütçesi olan uluslararası komisyona bırakıldı (Ölü doğdu)." },
      { letter: "L", name: "Lozan Antlaşması (1923)", detail: "Boğazlar Komisyonu başkanı TÜRK oldu ancak asker bulundurmamız yasaklandı (Kısmi egemenlik)." },
      { letter: "M", name: "Montrö Boğazlar Sözleşmesi (1936)", detail: "Komisyon kaldırıldı, tüm yetkiler ve askeri kontrol Türkiye'ye geçti. BOĞAZLARDA TAM TÜRK EGEMENLİĞİ sağlandı!" }
    ],
    kpssTip: "Boğazlar Sorunu Hünkar İskelesi (1833) ile BAŞLADI, Londra Boğazlar (1841) ile ULUSLARARASI oldu, MONTRÖ (1936) ile LEHİMİZE KESİN ÇÖZÜLDÜ!",
    relatedEvents: ["hunkar-iskelesi", "londra-bogazlar-1841", "lozan", "montro"]
  },

  // --- MİLLİ MÜCADELE & CUMHURİYET ---
  {
    id: "1-inonu-milat",
    periodId: "milli-mucadele-cumhuriyet",
    title: "I. İnönü Muharebesi Sonuçları",
    code: "M - İ - L - Â - T (MİLÂT)",
    slogan: "Düzenli ordunun ilk zaferi, TBMM için gerçek bir 'MİLÂT' oldu!",
    description: "İsmet Paşa komutasındaki düzenli ordunun Batı Cephesi'ndeki ilk zaferinin iç ve dış sonuçları:",
    items: [
      { letter: "M", name: "Moskova Antlaşması (16 Mart 1921)", detail: "Sovyet Rusya ile imzalandı. TBMM'yi tanıyan İLK BÜYÜK AVRUPA DEVLETİ Rusya oldu. Batum Gürcistan'a verilerek Misak-ı Milli'den İLK TAVİZ verildi." },
      { letter: "İ", name: "İstiklal Marşı'nın Kabulü (12 Mart 1921)", detail: "Mehmet Akif Ersoy'un şiiri milli marş kabul edildi. Şiir 'Kahraman Ordumuza' ithaf edildi." },
      { letter: "L", name: "Londra Konferansı (23 Şubat - 12 Mart 1921)", detail: "Bekir Sami Bey temsil etti. İtilaf Devletleri TBMM'yi İLK KEZ HUKUKEN VE RESMEN tanıdı." },
      { letter: "A", name: "Afganistan Dostluk Antlaşması (1 Mart 1921)", detail: "TBMM'yi ve Misak-ı Milli'yi tanıyan İLK MÜSLÜMAN DEVLET Afganistan oldu." },
      { letter: "T", name: "Teşkilat-ı Esasiye Kanunu (20 Ocak 1921)", detail: "Yeni Türk Devleti'nin İLK ANAYASASI kabul edildi ('Egemenlik kayıtsız şartsız milletindir')." }
    ],
    kpssTip: "MİLÂT şifresi KPSS'nin en çok çıkan sorusudur! Moskova, İstiklal Marşı, Londra, Afganistan, Teşkilat-ı Esasiye.",
    relatedEvents: ["1-inonu", "moskova-1921", "londra-konferansi", "afganistan-dostluk"]
  },

  {
    id: "dogu-siniri-gmk",
    periodId: "milli-mucadele-cumhuriyet",
    title: "Doğu Sınırımızı Çizen Antlaşmalar Sırası",
    code: "G - M - K (Gazi Mustafa Kemal)",
    slogan: "Doğu sınırımız Gazi Mustafa Kemal'in baş harfleriyle şekillendi!",
    description: "Doğu sınırımızın belirlenmesinde imzalanan 3 temel antlaşmanın kronolojik sırası:",
    items: [
      { letter: "G", name: "Gümrü Antlaşması (3 Aralık 1920)", detail: "Kazım Karabekir / Ermenistan. TBMM'nin İLK ASKERİ VE SİYASİ ZAFERİ! Sevr'i reddeden ve Misak-ı Milli'yi tanıyan ilk devlet Ermenistan oldu." },
      { letter: "M", name: "Moskova Antlaşması (16 Mart 1921)", detail: "Sovyet Rusya ile imzalandı. Çarlık Rusyası ile Osmanlı antlaşmaları geçersiz sayıldı. Batum Gürcistan'a bırakıldı." },
      { letter: "K", name: "Kars Antlaşması (13 Ekim 1921)", detail: "Sakarya Zaferi sonrası Kafkas Cumhuriyetleri (Azerbaycan, Ermenistan, Gürcistan) ile yapıldı. DOĞU SINIRIMIZ KESİNLEŞTİ!" }
    ],
    kpssTip: "Doğu Sınırı İlk Çizildi = GÜMRÜ. Doğu Sınırı KESİNLEŞTİ = KARS ANTLAŞMASI. Kod: GMK!",
    relatedEvents: ["gumru", "moskova-1921", "kars-1921"]
  },

  {
    id: "balkan-antanti-tayyar",
    periodId: "milli-mucadele-cumhuriyet",
    title: "Balkan Antantı'na Katılan Devletler (1934)",
    code: "T - A - Y - Y - A - R (TAYYAR)",
    slogan: "Batı sınırımızı İtalya ve Almanya tehlikesine karşı güvenceye aldık!",
    description: "Almanya ve İtalya'nın saldırgan yayılmacı politikalarına karşı Batı sınırını korumak amacıyla kurulan ittifak:",
    items: [
      { letter: "T", name: "Türkiye", detail: "Öncü kurucu devlet." },
      { letter: "Y", name: "Yunanistan", detail: "Ege ve Balkan sınır güvencesi." },
      { letter: "Y", name: "Yugoslavya", detail: "Balkan içi istikrar." },
      { letter: "R", name: "Romanya", detail: "Karadeniz ve Balkan güvenliği." }
    ],
    kpssTip: "Balkan Antantı'na KATILMAYANLAR: 1) Bulgaristan (Ege'ye inmek istediği ve yayılmacı olduğu için), 2) Arnavutluk (İtalya baskısından dolayı).",
    relatedEvents: ["balkan-antanti"]
  },

  {
    id: "sadabat-pakti-itay",
    periodId: "milli-mucadele-cumhuriyet",
    title: "Sadabat Paktı'na Katılan Devletler (1937)",
    code: "İ - T - A - Y (İTAY) veya İ - T - İ - A",
    slogan: "Doğu ve Güney sınırlarımızı güvenceye alan Ortadoğu paktı!",
    description: "İtalya'nın Habeşistan'ı (Etiyopya) işgali ve Akdeniz'deki saldırganlığı üzerine Tahran'da imzalanan güvenlik paktı:",
    items: [
      { letter: "İ", name: "İran", detail: "Sadabat Sarayı'nda ev sahipliği yaptı." },
      { letter: "T", name: "Türkiye", detail: "Bölgesel barış lideri." },
      { letter: "A", name: "Afganistan", detail: "Asya bağlantılı güvenlik ortağı." },
      { letter: "Y / İ", name: "Irak", detail: "Mezopotamya sınırı güvenliği." }
    ],
    kpssTip: "Sadabat Paktı'na KATILMAYAN komşumuz: SURİYE (Türkiye ile Hatay sorunu ve Irak ile sınır anlaşmazlıkları sebebiyle katılmadı).",
    relatedEvents: ["sadabat-pakti"]
  }
];

// ==========================================
// 2. DÖNEM DÖNEM SAVAŞLAR VE ANTLAŞMALAR LİSTESİ
// ==========================================
export const ALL_TREATIES_AND_WARS: TreatyOrWarItem[] = [
  // --- KURULUŞ DÖNEMİ ---
  {
    id: "koyunhisar",
    periodId: "kurulus",
    year: "1302",
    title: "Koyunhisar (Bafeus) Savaşı",
    kind: "war",
    parties: "Osmanlı Beyliği vs Bizans Tekfurları",
    leader: "Osman Gazi",
    importance: "Osmanlı ile Bizans ordusu arasında yapılan İLK MEYDAN SAVAŞI ve İLK ZAFERDİR.",
    keyNotes: [
      "Halil İnalcık'a göre Osmanlı Devleti'nin gerçek kuruluş tarihi bu zaferle (1302) başlar.",
      "İzmit yolu Osmanlı'ya açılmış, Bursa'nın fethine zemin hazırlanmıştır."
    ]
  },
  {
    id: "sazlidere",
    periodId: "kurulus",
    year: "1361",
    title: "Sazlıdere Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Bizans & Bulgar",
    leader: "I. Murad",
    importance: "Edirne fethedilmiş ve kısa süre sonra başkent yapılmıştır.",
    keyNotes: [
      "Bizans'ın Balkanlar ve Avrupa ile karadan olan fiziki bağlantısı tamamen kesilmiştir.",
      "Haçlı ittifaklarının kurulmasını tetikleyen temel askeri gelişmedir."
    ]
  },
  {
    id: "sirpsindigi",
    periodId: "kurulus",
    year: "1364",
    title: "Sırpsındığı Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Haçlı İttifakı (Sırp, Macar, Bulgar, Bosna, Eflak)",
    leader: "I. Murad (Komutan: Hacı İlbey)",
    importance: "Osmanlı Devleti ile Haçlı ittifakı arasında yapılan İLK SAVAŞ ve İLK ZAFERDİR.",
    keyNotes: [
      "Hacı İlbey emrindeki öncü Türk birlikleri gece baskınıyla dev Haçlı ordusunu Meriç Nehri'ne dökmüştür.",
      "Sındığı kelimesi eski Türkçede 'kırılma / bozgun' anlamına gelir (Sırp bozgunu)."
    ],
    mnemonicId: "sinav-2"
  },
  {
    id: "cirmen",
    periodId: "kurulus",
    year: "1371",
    title: "Çirmen Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Sırp Krallığı",
    leader: "I. Murad (Lala Şahin Paşa)",
    importance: "Makedonya'nın kapıları Osmanlı Türklerine tamamen açılmıştır.",
    keyNotes: [
      "Sırp Krallığı Osmanlı hakimiyetini kabul ederek vergiye bağlanmıştır.",
      "Kavala, Drama ve Serez gibi stratejik merkezler fethedilmiştir."
    ]
  },
  {
    id: "1-kosova",
    periodId: "kurulus",
    year: "1389",
    title: "I. Kosova Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Büyük Haçlı Ordusu (Sırp, Bosna, Macar, Arnavut)",
    leader: "I. Murad",
    importance: "Balkanlarda Osmanlı'nın varlığı perçinlenmiş, ilk kez meydan savaşında TOP kullanılmıştır.",
    keyNotes: [
      "Sultan I. Murad zafer sonrasında harp meydanında gezerken yaralı bir Sırp asilzadesi (Miloş Obiliç) tarafından şehit edilmiştir.",
      "Savaş meydanında şehit düşen İLK ve TEK Osmanlı padişahı I. Murad'dır (Hüdavendigar)."
    ],
    mnemonicId: "sinav-2"
  },
  {
    id: "nigbolu",
    periodId: "kurulus",
    year: "1396",
    title: "Niğbolu Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Haçlı İttifakı (Fransız, İngiliz, Macar, Alman şövalyeleri)",
    leader: "Yıldırım Bayezid",
    importance: "Ortaçağın en görkemli Haçlı şövalye ordusu Tuna Nehri kıyısında imha edilmiştir.",
    keyNotes: [
      "Bu zafer üzerine Mısır'daki Abbasi Halifesi I. Mütevekkil, Yıldırım Bayezid'e 'Sultan-ı İklîm-i Rûm' (Anadolu Diyarının Sultanı) unvanını vermiştir.",
      "Bulgar Krallığı'na tamamen son verilmiş ve Bulgaristan doğrudan Osmanlı sancağı olmuştur.",
      "Elde edilen ganimetlerle Bursa Ulu Cami inşa edilmiştir."
    ],
    mnemonicId: "sinav-2"
  },
  {
    id: "ankara-savasi",
    periodId: "kurulus",
    year: "1402",
    title: "Ankara Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Timur İmparatorluğu",
    leader: "Yıldırım Bayezid vs Emir Timur",
    importance: "Osmanlı ağır yenilgiye uğramış; Anadolu Türk Siyasi Birliği bozulmuş ve 11 yıllık FETRET DEVRİ başlamıştır.",
    keyNotes: [
      "ÖSYM TUZAĞI: Haçlılarla DEĞİL, iki Müslüman-Türk hükümdar arasında gerçekleşmiştir.",
      "İstanbul'un fethi yaklaşık 50 yıl gecikmiştir.",
      "Yıldırım Bayezid esir düşmüş; taht kavgaları sonrası Mehmed Çelebi devleti toparlayarak '2. Kurucu' olmuştur."
    ],
    mnemonicId: "sinav-2"
  },
  {
    id: "edirne-segedin",
    periodId: "kurulus",
    year: "1444",
    title: "Edirne-Segedin Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Macaristan & Sırbistan",
    leader: "II. Murad",
    importance: "Osmanlı Devleti'nin Batılı bir devletle (Haçlılarla) imzaladığı İLK BARIŞ ANTLAŞMASIDIR.",
    keyNotes: [
      "Taraflar 10 yıl boyunca birbirine saldırmayacağına yemin etmiştir.",
      "II. Murad barış ortamına güvenerek tahtı 12 yaşındaki oğlu II. Mehmed'e (Fatih) bırakmıştır.",
      "Haçlılar antlaşmayı bozup saldırınca Varna Savaşı çıkmıştır."
    ]
  },
  {
    id: "varna",
    periodId: "kurulus",
    year: "1444",
    title: "Varna Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Haçlı Ordusu (Macar, Leh, Papalık)",
    leader: "II. Murad",
    importance: "Edirne-Segedin yeminini bozan Haçlı ordusu ezici bir mağlubiyete uğratılmıştır.",
    keyNotes: [
      "Macar Kralı Ladislas savaş meydanında öldürülmüştür.",
      "II. Murad ordunun başına geçmiş, Balkanlardaki Türk hakimiyeti pekişmiştir."
    ],
    mnemonicId: "sinav-2"
  },
  {
    id: "2-kosova",
    periodId: "kurulus",
    year: "1448",
    title: "II. Kosova Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Haçlı İttifakı (Hunyadi Yanoş)",
    leader: "II. Murad",
    importance: "Balkanlar KESİN OLARAK TÜRK YURDU haline gelmiştir.",
    keyNotes: [
      "Avrupalıların Türkleri Balkanlardan atma ümidi tamamen sona ermiştir.",
      "Haçlılar savunmaya çekilmiş, Osmanlı taarruza geçmiştir (Tıpkı Miryokefalon ve Sakarya gibi dönüm noktasıdır)."
    ],
    mnemonicId: "sinav-2"
  },

  // --- YÜKSELME DÖNEMİ ---
  {
    id: "otlukbeli",
    periodId: "yukselme",
    year: "1473",
    title: "Otlukbeli Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Akkoyunlu Devleti",
    leader: "Fatih Sultan Mehmed vs Uzun Hasan",
    importance: "Akkoyunlu Devleti yıkılış sürecine girmiş, Doğu Anadolu'nun güvenliği sağlanmıştır.",
    keyNotes: [
      "Fatih'in ateşli silahlar ve topçu üstünlüğü zaferi getirmiştir.",
      "Büyük matematikçi ve astronom Ali Kuşçu bu zaferin ardından İstanbul'a gelerek Ayasofya medresesine başmüderris olmuştur."
    ]
  },
  {
    id: "1479-istanbul",
    periodId: "yukselme",
    year: "1479",
    title: "İstanbul (Venedik) Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Venedik Cumhuriyeti",
    leader: "Fatih Sultan Mehmed",
    importance: "Venedik'e ticari ayrıcalıklar (kapitülasyon benzeri) verilmiş ve İstanbul'da elçi (Balyos) bulundurma hakkı tanınmıştır.",
    keyNotes: [
      "Amaç Hristiyan birliğini parçalamak ve Akdeniz ticaretini canlandırmaktır.",
      "Venedik elçisine 'Balyos' adı verilmiştir."
    ]
  },
  {
    id: "caldiran",
    periodId: "yukselme",
    year: "1514",
    title: "Çaldıran Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Safevi Devleti (İran)",
    leader: "Yavuz Sultan Selim vs Şah İsmail",
    importance: "Safevilerin Doğu Anadolu üzerindeki Şiilik propagandası ve siyasi tehdidi durdurulmuştur.",
    keyNotes: [
      "Osmanlı ordusunun seyyar top arabaları savaşın kaderini çizmiştir.",
      "Tebriz Osmanlı kontrolüne girmiş, birçok sanatkar ve ilim adamı İstanbul'a nakledilmiştir."
    ]
  },
  {
    id: "turnadag",
    periodId: "yukselme",
    year: "1515",
    title: "Turnadağ Savaşı",
    kind: "war",
    parties: "Osmanlı Devleti vs Dulkadiroğulları Beyliği",
    leader: "Yavuz Sultan Selim",
    importance: "Dulkadiroğulları Beyliği fethedilmiş ve ANADOLU TÜRK SİYASİ BİRLİĞİ (ATSB) KESİN OLARAK SAĞLANMIŞTIR.",
    keyNotes: [
      "ATSB'yi ilk kuran: Yıldırım Bayezid. ATSB'yi KESİN olarak tamamlayan: Yavuz Sultan Selim.",
      "Memlük Devleti ile Osmanlı komşu olmuş ve savaşa giden kapı aralanmıştır."
    ]
  },
  {
    id: "mercidabik-ridaniye",
    periodId: "yukselme",
    year: "1516 - 1517",
    title: "Mercidabık ve Ridaniye Savaşları",
    kind: "war",
    parties: "Osmanlı Devleti vs Memlük Sultanlığı",
    leader: "Yavuz Sultan Selim",
    importance: "Memlük Devleti tarihe karışmış; Suriye, Filistin, Lübnan, Mısır ve Hicaz fethedilmiştir.",
    keyNotes: [
      "HALİFELİK MAKAMİ Osmanlı Hanedanına geçmiştir (İlk Osmanlı Halifesi: Yavuz Sultan Selim).",
      "Kutsal Emanetler Topkapı Sarayı'na getirilmiştir.",
      "Baharat Yolu tamamen Osmanlı denetimine girmiştir."
    ]
  },
  {
    id: "mohac",
    periodId: "yukselme",
    year: "1526",
    title: "Mohaç Meydan Muharebesi",
    kind: "war",
    parties: "Osmanlı Devleti vs Macar Krallığı",
    leader: "Kanuni Sultan Süleyman",
    importance: "Tarihin en kısa süren (yaklaşık 2 saat) meydan savaşıdır; Macar Krallığı yıkılmış, Budin fethedilmiştir.",
    keyNotes: [
      "Macaristan Osmanlı'ya bağlı bir krallık (Jan Zapolya / Yanoş) haline gelmiştir.",
      "Orta Avrupa'da Osmanlı - Avusturya rekabeti doğrudan başlamıştır."
    ]
  },
  {
    id: "1533-istanbul-ibrahimpasa",
    periodId: "yukselme",
    year: "1533",
    title: "1533 İstanbul (İbrahim Paşa) Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya Arşidüklüğü",
    leader: "Kanuni Sultan Süleyman (Sadrazam: Pargalı İbrahim Paşa)",
    importance: "Osmanlı Devleti, Avrupa üzerindeki SİYASİ VE PROTOKOL ÜSTÜNLÜĞÜNÜ kabul ettirmiştir.",
    keyNotes: [
      "Maddesi: Avusturya Kralı (Arşidük), protokolde Osmanlı SADRAZAMINA denk sayılacaktır!",
      "Avusturya Osmanlı'ya yıllık vergi ödemeyi kabul etmiştir.",
      "Bu üstünlük 1606 Zitvatorok Antlaşması'na kadar kesintisiz sürmüştür."
    ]
  },
  {
    id: "preveze",
    periodId: "yukselme",
    year: "1538",
    title: "Preveze Deniz Zaferi",
    kind: "war",
    parties: "Osmanlı Donanması vs Haçlı Donanması (Andrea Doria)",
    leader: "Kaptan-ı Derya Barbaros Hayreddin Paşa",
    importance: "AKDENİZ BİR TÜRK GÖLÜ HALİNE GELMİŞTİR.",
    keyNotes: [
      "Akdeniz'deki deniz üstünlüğü kesin olarak Osmanlı'ya geçmiştir.",
      "Her yıl 28 Eylül günü Türkiye'de 'Deniz Kuvvetleri Günü' olarak kutlanmaktadır."
    ]
  },
  {
    id: "amasya-1555",
    periodId: "yukselme",
    year: "1555",
    title: "Amasya Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Safevi Devleti (İran)",
    leader: "Kanuni Sultan Süleyman vs Şah Tahmasb",
    importance: "Osmanlı Devleti ile İran arasında imzalanan İLK RESMİ BARIŞ ANTLAŞMASIDIR.",
    keyNotes: [
      "Tebriz, Karabağ, Revan ve Bağdat Osmanlı idaresinde kalmıştır.",
      "Doğu sınırlarında yaklaşık 25 yıllık uzun soluklu bir barış dönemi başlamıştır."
    ]
  },

  // --- DURAKLAMA / 17. YÜZYIL ---
  {
    id: "ferhat-pasa",
    periodId: "duraklama",
    year: "1590",
    title: "Ferhat Paşa (İstanbul) Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Safeviler (İran)",
    leader: "III. Murad",
    importance: "Osmanlı Devleti'nin DOĞUDA EN GENİŞ SINIRLARINA ulaştığı antlaşmadır.",
    keyNotes: [
      "Tebriz, Karabağ, Gence, Şirvan, Gürcistan ve Dağıstan Osmanlı'ya geçti.",
      "Hazar Denizi'ne kadar Osmanlı sınırları genişlemiştir.",
      "Kodlama: F-N-S-K zincirinin ilk ve en geniş halkasıdır."
    ],
    mnemonicId: "fnsk-iran"
  },
  {
    id: "zitvatorok",
    periodId: "duraklama",
    year: "1606",
    title: "Zitvatorok Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya",
    leader: "I. Ahmed",
    importance: "Osmanlı Devleti'nin 1533 İstanbul Antlaşması ile kazandığı siyasi protokol üstünlüğü SONA ERMİŞTİR.",
    keyNotes: [
      "Avusturya Arşidükü protokolde artık Sadrazama değil, doğrudan Osmanlı Padişahına (Sezar unvanıyla) denk sayılmıştır.",
      "Uluslararası hukukta 'Mütekabiliyet' (diplomatik eşitlik) ilkesi devreye girmiştir."
    ]
  },
  {
    id: "nasuh-pasa",
    periodId: "duraklama",
    year: "1612",
    title: "Nasuh Paşa Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Safeviler (İran)",
    leader: "I. Ahmed",
    importance: "Ferhat Paşa ile alınan yerler İran'a geri verilmiş, İran yıllık 200 deve yükü ipek vermeyi taahhüt etmiştir.",
    keyNotes: [
      "Osmanlı doğuda ilk kez toprak kaybı yaşamıştır.",
      "İpek vergisiyle ekonomik tazminat amaçlanmıştır."
    ],
    mnemonicId: "fnsk-iran"
  },
  {
    id: "serav",
    periodId: "duraklama",
    year: "1618",
    title: "Serav Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Safeviler (İran)",
    leader: "II. Osman (Genç Osman)",
    importance: "Nasuh Paşa sınırları esas alınmış; İran'ın ödeyeceği ipek vergisi 100 deve yüküne indirilmiştir.",
    keyNotes: [
      "İran'ın taahhüt ettiği vergiyi ödememesi üzerine başlayan savaşı sonlandırmıştır."
    ],
    mnemonicId: "fnsk-iran"
  },
  {
    id: "hotin",
    periodId: "duraklama",
    year: "1621",
    title: "Hotin Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Lehistan",
    leader: "II. Osman (Genç Osman)",
    importance: "Genç Osman bu sefer sırasında Yeniçerilerin gevşekliğini görerek Yeniçeri Ocağı'nı kaldırmaya karar vermiştir.",
    keyNotes: [
      "Osmanlı tarihinde ilk kez bir padişah askeri ıslahat için ocak kaldırmayı düşünmüş ve bu yüzden şehit edilmiştir."
    ]
  },
  {
    id: "kasri-sirin",
    periodId: "duraklama",
    year: "1639",
    title: "Kasr-ı Şirin Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Safeviler (İran)",
    leader: "IV. Murad (Bağdat Fatihi)",
    importance: "GÜNÜMÜZ TÜRKİYE - İRAN SINIRININ TEMELİ ATILMIŞTIR.",
    keyNotes: [
      "Bağdat Osmanlı'da kalmış, Revan (Erivan) İran'a bırakılmıştır.",
      "Zağros Dağları iki ülke arasında doğal sınır kabul edilmiş ve yüzyıllarca bozulmamıştır."
    ],
    mnemonicId: "fnsk-iran"
  },
  {
    id: "vasvar",
    periodId: "duraklama",
    year: "1664",
    title: "Vasvar Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya",
    leader: "IV. Mehmed (Sadrazam: Köprülü Fazıl Ahmed Paşa)",
    importance: "Avusturya karşısında son kez üstünlük kurulup tazminat alınan antlaşmadır.",
    keyNotes: [
      "Uyvar ve Neograd kaleleri fethedilmiştir.",
      "Tarihte meşhur 'Uyvar önünde bir Türk gibi kuvvetli' deyimi bu zaferden doğmuştur."
    ]
  },
  {
    id: "bucas",
    periodId: "duraklama",
    year: "1672",
    title: "Bucaş Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Lehistan",
    leader: "IV. Mehmed (Köprülü Fazıl Ahmed Paşa)",
    importance: "Osmanlı Devleti'nin BATIDA EN GENİŞ SINIRLARA ulaştığı ve fethettiği SON antlaşmadır.",
    keyNotes: [
      "Podolya arazisi Osmanlı'ya geçmiş, Ukrayna Kazaklara bırakılmıştır.",
      "Bu tarihten sonra Osmanlı Batıda yeni bir toprak fethi yapamamıştır."
    ],
    mnemonicId: "17-yuzyil-sinirlar"
  },
  {
    id: "bahcesaray",
    periodId: "duraklama",
    year: "1681",
    title: "Bahçesaray (Çehrin) Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rus Çarlığı",
    leader: "IV. Mehmed",
    importance: "Osmanlı Devleti ile Rusya arasında tarihte imzalanan İLK RESMİ ANTLAŞMADIR.",
    keyNotes: [
      "Dinyeper (Özü) Nehri iki devlet arasında sınır tayin edilmiştir.",
      "Rus Çarlığı'nın Karadeniz'e ve güneye sarkma çabalarına karşı ilk hukuki settir."
    ],
    mnemonicId: "17-yuzyil-sinirlar"
  },
  {
    id: "karlofca",
    periodId: "duraklama",
    year: "1699",
    title: "Karlofça Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Kutsal İttifak (Avusturya, Lehistan, Venedik)",
    leader: "II. Mustafa (Sadrazam: Amcazade Hüseyin Paşa)",
    importance: "Osmanlı'nın BATIDA İLK BÜYÜK TOPRAK KAYBETTİĞİ ve GERİLEME DÖNEMİNİ başlatan antlaşmadır.",
    keyNotes: [
      "Macaristan ve Erdel Avusturya'ya, Podolya Lehistan'a, Mora ve Dalmaçya kıyıları Venedik'e verildi.",
      "25 yıl süreliğine imzalanmış, garantör devlet AVUSTURYA olmuştur.",
      "Osmanlı'da taarruz devri bitmiş, savunma ve geri çekilme süreci başlamıştır."
    ],
    mnemonicId: "17-yuzyil-sinirlar"
  },
  {
    id: "1700-istanbul",
    periodId: "duraklama",
    year: "1700",
    title: "1700 İstanbul Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rus Çarlığı",
    leader: "II. Mustafa",
    importance: "Karlofça'nın devamı niteliğindedir; Rusya İLK KEZ Karadeniz'e inme fırsatı yakalamıştır.",
    keyNotes: [
      "Azak Kalesi Rusya'ya verilmiştir (Karadeniz'de Rus varlığı başladı).",
      "Rusya İstanbul'da daimi elçi bulundurma hakkı kazanmıştır."
    ]
  },

  // --- GERİLEME / 18. YÜZYIL ---
  {
    id: "prut",
    periodId: "gerileme",
    year: "1711",
    title: "Prut Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya",
    leader: "III. Ahmed (Sadrazam: Baltacı Mehmed Paşa)",
    importance: "1700 İstanbul Antlaşması ile kaybedilen Azak Kalesi geri alınmış; Karlofça kayıplarını geri alma ümidi doğmuştur.",
    keyNotes: [
      "Baltacı Mehmed Paşa Prut bataklığında Çar I. Petro'yu kuşatmış ancak yeniçerilere güvenemeyerek barış yapmıştır.",
      "Rusya İstanbul'da elçi bulundurma hakkını kaybetmiştir."
    ],
    mnemonicId: "18-yuzyil-antlasmalari"
  },
  {
    id: "pasarofca",
    periodId: "gerileme",
    year: "1718",
    title: "Pasarofça Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya ve Venedik",
    leader: "III. Ahmed (Sadrazam: Nevşehirli Damat İbrahim Paşa)",
    importance: "Toprakları geri alma ümidi sönmüş, savunma politikası benimsenmiş ve LÂLE DEVRİ başlamıştır.",
    keyNotes: [
      "Belgrad, Temeşvar ve Kuzey Sırbistan Avusturya'ya bırakılmıştır.",
      "Avrupa'nın askeri ve teknik üstünlüğü İLK KEZ kabul edilmiş; Batılılaşma hareketleri başlamıştır."
    ],
    mnemonicId: "18-yuzyil-antlasmalari"
  },
  {
    id: "belgrad-1739",
    periodId: "gerileme",
    year: "1739",
    title: "Belgrad Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya ve Rusya",
    leader: "I. Mahmud (Humbaracı Ahmed Paşa / Kont de Bonneval ıslahatları)",
    importance: "18. YÜZYILIN EN KÂRLI ve KAZANÇLI SON BÜYÜK ANTLAŞMASIDIR.",
    keyNotes: [
      "Avusturya'dan Belgrad geri alınmıştır.",
      "Rusya Azak Kalesi'ni yıkmak ve Karadeniz'de savaş/ticaret gemisi bulundurmamak şartıyla antlaşmayı imzalamıştır.",
      "KARADENİZ'İN TÜRK GÖLÜ OLDUĞU SON KEZ TESCİLLENMİŞTİR.",
      "Fransa'nın arabuluculuk yapması karşılığında 1740'ta kapitülasyonlar SÜREKLİ hale getirilmiştir."
    ],
    mnemonicId: "18-yuzyil-antlasmalari"
  },
  {
    id: "kerden-2-kasrisirin",
    periodId: "gerileme",
    year: "1746",
    title: "Kerden Antlaşması (II. Kasr-ı Şirin)",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Afşar Hanedanı (İran - Nadir Şah)",
    leader: "I. Mahmud",
    importance: "Kasr-ı Şirin Antlaşması sınırları aynen onaylanmış ve iki ülke arasındaki savaşlar uzun süre durmuştur.",
    keyNotes: [
      "Tarihe 'İkinci Kasr-ı Şirin' olarak geçmiştir."
    ]
  },
  {
    id: "kucuk-kaynarca",
    periodId: "gerileme",
    year: "1774",
    title: "Küçük Kaynarca Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rus İmparatorluğu (Çariçe II. Katerina)",
    leader: "I. Abdülhamid",
    importance: "Osmanlı tarihinin Sevr'e kadar imzalanan EN AĞIR ŞARTLI ANTLAŞMASIDIR.",
    keyNotes: [
      "KIRIM BAĞIMSIZ OLDU; halkı Türk ve Müslüman olan bir toprak İLK KEZ kaybedildi!",
      "Halifelik makamı ilk kez siyasi/hukuki bir amaçla sınır dışındaki Kırım Müslümanları için kullanıldı.",
      "Rusya'ya tarihte İLK KEZ SAVAŞ TAZMİNATI ödendi.",
      "Rusya Osmanlı Ortodokslarını koruma ve dilediği yerde konsolosluk açma hakkı aldı (iç işlerimize müdahale kapısı açıldı).",
      "Karadeniz Türk gölü olma vasfını KESİN OLARAK kaybetti."
    ],
    mnemonicId: "kirim-kay"
  },
  {
    id: "aynalikavak",
    periodId: "gerileme",
    year: "1779",
    title: "Aynalıkavak Tenkihnamesi",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya",
    leader: "I. Abdülhamid",
    importance: "Rus yanlısı Şahin Giray'ın Kırım Hanlığı Osmanlı tarafından zorunlu olarak onaylandı.",
    keyNotes: [
      "Kırım üzerindeki Rus nüfuzu ve kontrolü tescillenmiştir (Kırım'ın kaybının 2. basamağı)."
    ],
    mnemonicId: "kirim-kay"
  },
  {
    id: "zistovi",
    periodId: "gerileme",
    year: "1791",
    title: "Ziştovi Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Avusturya",
    leader: "III. Selim",
    importance: "1789 Fransız İhtilali'nin yaydığı milliyetçilik akımından korkan Avusturya savaştan çekilmiş ve barış yapmıştır.",
    keyNotes: [
      "Avusturya aldığı yerleri geri vermiştir.",
      "Bu tarihten sonra Osmanlı ile Avusturya arasında bir daha hiçbir savaş yaşanmamıştır!"
    ]
  },
  {
    id: "yas",
    periodId: "gerileme",
    year: "1792",
    title: "Yaş Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya",
    leader: "III. Selim",
    importance: "Kırım'ın KESİN OLARAK Rusya'ya ait olduğu kabul edilmiş ve Osmanlı DAĞILMA DÖNEMİNE girmiştir.",
    keyNotes: [
      "Dniester (Turla) Nehri iki ülke arasında sınır kabul edilmiştir.",
      "Osmanlı Karadeniz ve Kafkasya'da savunmaya çekilmek zorunda kalmıştır."
    ],
    mnemonicId: "kirim-kay"
  },

  // --- DAĞILMA / 19-20. YÜZYIL ---
  {
    id: "el-aris-1801",
    periodId: "dagilma",
    year: "1801 - 1802",
    title: "El-Ariş & Paris Antlaşmaları",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Fransa (Napolyon Bonapart)",
    leader: "III. Selim (Cezzar Ahmed Paşa)",
    importance: "Napolyon'un Mısır işgali sonlandırılmış; Akka'da Nizam-ı Cedid ordusu Napolyon'u durdurmuştur.",
    keyNotes: [
      "Nizam-ı Cedid ordusunun İLK ve TEK askeri zaferidir.",
      "Osmanlı tarihinde İLK KEZ İNGİLTERE VE RUSYA'NIN DESTEĞİYLE DENGE SİYASETİ uygulanmıştır."
    ]
  },
  {
    id: "bukres-1812",
    periodId: "dagilma",
    year: "1812",
    title: "Bükreş Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya",
    leader: "II. Mahmud",
    importance: "SIRPLARA İLK KEZ İMTİYAZ (AYRICALIK) VERİLMİŞTİR.",
    keyNotes: [
      "Osmanlı tarihinde ayrıcalık elde eden İLK AZINLIK Sırplar olmuştur.",
      "Besarabya bölgesi Rusya'ya bırakılmıştır."
    ],
    mnemonicId: "balkan-azinlik-bagimsizlik"
  },
  {
    id: "edirne-1829",
    periodId: "dagilma",
    year: "1829",
    title: "Edirne Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya (Navarin Baskını sonrası)",
    leader: "II. Mahmud",
    importance: "YUNANİSTAN BAĞIMSIZ OLMUŞ; Osmanlı'dan ayrılarak bağımsızlık kazanan İLK AZINLIK tescillenmiştir.",
    keyNotes: [
      "Sırbistan'a ÖZERKLİK verilmiştir.",
      "Eflak ve Boğdan'a özerklik statüsü tanınmıştır."
    ],
    mnemonicId: "balkan-azinlik-bagimsizlik"
  },
  {
    id: "kutahya-1833",
    periodId: "dagilma",
    year: "1833",
    title: "Kütahya Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Mısır Valisi Kavalalı Mehmed Ali Paşa",
    leader: "II. Mahmud",
    importance: "Osmanlı kendi valisine boyun eğmek zorunda kalmış ve valilikler vermiştir.",
    keyNotes: [
      "Mehmed Ali Paşa'ya Mısır ve Girit valiliklerine ek olarak Suriye valiliği verildi.",
      "Oğlu İbrahim Paşa'ya Adana ve Cidde valilikleri verildi."
    ]
  },
  {
    id: "hunkar-iskelesi",
    periodId: "dagilma",
    year: "1833",
    title: "Hünkar İskelesi Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Rusya",
    leader: "II. Mahmud",
    importance: "Osmanlı'nın Boğazlar üzerinde TEK BAŞINA karar verdiği SON ANTLAŞMADIR.",
    keyNotes: [
      "Mısır isyanına karşı 'Denize düşen yılana sarılır' diyerek Rusya ile imzalanmıştır.",
      "Saldırı durumunda Rus donanması Boğazlara gelebilecek, Osmanlı Rusya lehine Boğazları kapatacaktır.",
      "Boğazlar ilk kez ULUSLARARASI BİR SORUN haline gelmiştir."
    ],
    mnemonicId: "bogazlar-sureci"
  },
  {
    id: "balta-limani",
    periodId: "dagilma",
    year: "1838",
    title: "Balta Limanı Ticaret Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs İngiltere",
    leader: "II. Mahmud",
    importance: "Osmanlı Devleti Avrupalıların AÇIK PAZARI ve yarı sömürgesi haline gelmiştir.",
    keyNotes: [
      "İç gümrük vergileri kaldırılmış, tekel sistemi (Yed-i Vahid) lağvedilmiştir.",
      "Yerli esnaf ve loncalar çökmüş, Osmanlı yabancı malların istilasına uğramıştır."
    ],
    mnemonicId: "bogazlar-sureci"
  },
  {
    id: "londra-bogazlar-1841",
    periodId: "dagilma",
    year: "1841",
    title: "Londra Boğazlar Sözleşmesi",
    kind: "treaty",
    parties: "Osmanlı Devleti vs İngiltere, Rusya, Fransa, Avusturya, Prusya",
    leader: "Abdülmecid",
    importance: "BOĞAZLAR İLK KEZ ULUSLARARASI STATÜ KAZANMIŞTIR.",
    keyNotes: [
      "Barış zamanında Boğazlar bütün yabancı savaş gemilerine kapatılmıştır.",
      "Osmanlı'nın Boğazlar üzerindeki mutlak egemenliği uluslararası kurala bağlanarak kısıtlanmıştır."
    ],
    mnemonicId: "bogazlar-sureci"
  },
  {
    id: "paris-1856",
    periodId: "dagilma",
    year: "1856",
    title: "Paris Barış Antlaşması",
    kind: "treaty",
    parties: "Osmanlı, İngiltere, Fransa, Piyomente vs Rusya (Kırım Savaşı sonu)",
    leader: "Sultan Abdülmecid",
    importance: "Osmanlı Devleti İLK KEZ bir AVRUPA DEVLETİ sayılmış ve Avrupa hukukundan yararlanma hakkı tanınmıştır.",
    keyNotes: [
      "Osmanlı Devleti'nin toprak bütünlüğü Avrupalı devletlerin garantisi altına alınmıştır.",
      "Karadeniz tarafsız hale getirilmiş; Osmanlı galip geldiği halde Karadeniz'de donanma bulunduramamıştır (galipken mağlup muamelesi!).",
      "Avrupalıların baskısını önlemek amacıyla Islahat Fermanı ilan edilip antlaşma metnine yazdırılmıştır."
    ]
  },
  {
    id: "berlin-1878",
    periodId: "dagilma",
    year: "1878",
    title: "Berlin Antlaşması",
    kind: "treaty",
    parties: "Osmanlı vs Rusya, İngiltere, Almanya, Fransa, Avusturya, İtalya",
    leader: "II. Abdülhamid",
    importance: "Ayastefanos (Yeşilköy) iptal edilmiş; Sırbistan, Karadağ ve Romanya BAĞIMSIZ olmuştur (SAKAR).",
    keyNotes: [
      "Kars, Ardahan ve Batum (Elviye-i Selase) Rusya'ya savaş tazminatı karşılığı bırakılmıştır.",
      "Ermeni Meselesi ilk kez uluslararası bir antlaşma metnine (61. madde) girmiştir.",
      "İngiltere'nin desteğini almak için Kıbrıs'ın idaresi geçici olarak İngiltere'ye bırakılmıştır."
    ],
    mnemonicId: "berlin-bagimsiz-sakar"
  },
  {
    id: "usi-1912",
    periodId: "dagilma",
    year: "1912",
    title: "Uşi (Ouchy) Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs İtalya (Trablusgarp Savaşı sonu)",
    leader: "V. Mehmed Reşad",
    importance: "Osmanlı Devleti KUZEY AFRİKA'DAKİ SON TOPRAK PARÇASINI (Trablusgarp ve Bingazi) kaybetmiştir.",
    keyNotes: [
      "Trablusgarp halkı dini bakımdan Halifeye bağlı kalmıştır.",
      "On İki Ada Balkan Savaşı tehlikesine karşı geçici olarak İtalya'ya emanet edilmiş ancak bir daha geri alınamamıştır."
    ]
  },
  {
    id: "londra-1913",
    periodId: "dagilma",
    year: "1913",
    title: "Londra Antlaşması (I. Balkan Sonu)",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Balkan İttifakı (Bulgaristan, Yunanistan, Sırbistan, Karadağ)",
    leader: "V. Mehmed Reşad",
    importance: "Osmanlı MİDYE-ENEZ HATTININ batısındaki tüm Rumeli ve Balkan topraklarını kaybetmiştir.",
    keyNotes: [
      "Edirne ve Kırklareli Bulgaristan'a bırakılmıştır.",
      "Arnavutluk bu kargaşada bağımsızlığını ilan ederek Osmanlı'dan ayrılan SON BALKAN DEVLETİ olmuştur.",
      "İttihat ve Terakki bu yenilgi üzerine Bab-ı Ali Baskını ile hükümeti darbeyle ele geçirmiştir."
    ]
  },
  {
    id: "istanbul-1913",
    periodId: "dagilma",
    year: "1913",
    title: "İstanbul Antlaşması (II. Balkan Sonu)",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Bulgaristan",
    leader: "V. Mehmed Reşad (Enver Paşa Edirne Fatihi)",
    importance: "Edirne, Kırklareli ve Dimetoka geri alınmış; günümüz Türk-Bulgar sınırı (Meriç Nehri) çizilmiştir.",
    keyNotes: [
      "Bulgaristan'da kalan Türklerin mülkiyet ve ibadet hakları güvence altına alınmıştır."
    ]
  },
  {
    id: "atina-1913",
    periodId: "dagilma",
    year: "1913",
    title: "Atina Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs Yunanistan",
    leader: "V. Mehmed Reşad",
    importance: "Girit, Selanik ve Yanya'nın Yunanistan'a ait olduğu kabul edilmiştir.",
    keyNotes: [
      "Batı Trakya Türk Azınlığı hakları protokol altına alınmıştır."
    ]
  },
  {
    id: "mondros-1918",
    periodId: "dagilma",
    year: "30 Ekim 1918",
    title: "Mondros Ateşkes Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Devleti vs İtilaf Devletleri (İngiltere)",
    leader: "VI. Mehmed Vahdeddin (Bahriye Nazırı Rauf Orbay vs Amiral Calthorpe)",
    importance: "Osmanlı Devleti FİİLEN SONA ERMİŞ, Anadolu işgallere açık hale gelmiştir.",
    keyNotes: [
      "7. Madde: İtilaf Devletleri güvenliklerini tehdit eden herhangi bir stratejik noktayı işgal edebilecektir (İşgallere hukuki kılıf!).",
      "24. Madde: Vilâyat-ı Sitte'de (6 Doğu ili: Bitlis, Erzurum, Sivas, Van, Elazığ, Diyarbakır - BESVAD) karışıklık çıkarsa işgal edilecektir (Büyük Ermenistan hedefi!).",
      "Ordu terhis edilmiş, haberleşme ve demir yolları İtilaf kontrolüne bırakılmıştır."
    ]
  },
  {
    id: "sevr-1920",
    periodId: "dagilma",
    year: "10 Ağustos 1920",
    title: "Sevr Barış Antlaşması",
    kind: "treaty",
    parties: "Osmanlı Saltanat Şurası vs İtilaf Devletleri",
    leader: "Damat Ferit Paşa Hükümeti (İmzalayan: Rıza Tevfik, Hadi Paşa, Reşat Halis)",
    importance: "Mebusan Meclisi ve TBMM tarafından onaylanmadığı için HUKUKEN GEÇERSİZ / ÖLÜ DOĞMUŞ BİR ANTLAŞMADIR.",
    keyNotes: [
      "Türk milletinin Kurtuluş Savaşı'ndaki büyük direnişi ve İstiklal Harbi zaferleriyle çöpe atılmıştır."
    ]
  },

  // --- MİLLİ MÜCADELE & CUMHURİYET DÖNEMİ ---
  {
    id: "gumru",
    periodId: "milli-mucadele-cumhuriyet",
    year: "3 Aralık 1920",
    title: "Gümrü Barış Antlaşması",
    kind: "treaty",
    parties: "TBMM Hükümeti vs Ermenistan Demokratik Cumhuriyeti",
    leader: "Kazım Karabekir Paşa (Şark Fatihi)",
    importance: "TBMM'nin uluslararası alandaki İLK ASKERİ VE SİYASİ ZAFERİDİR.",
    keyNotes: [
      "Ermenistan Sevr'deki hayallerinden vazgeçmiş ve Misak-ı Milli'yi tanıyan İLK DEVLET olmuştur.",
      "Kars, Sarıkamış, Kağızman ve Iğdır kurtarılmıştır.",
      "Doğu Cephesi kapanmış, buradaki birlik ve cephaneler Batı Cephesi'ne aktarılmıştır.",
      "Antlaşma metninde ilk kez 'Türkiye' ismi resmen kullanılmıştır."
    ],
    mnemonicId: "dogu-siniri-gmk"
  },
  {
    id: "1-inonu",
    periodId: "milli-mucadele-cumhuriyet",
    year: "6 - 11 Ocak 1921",
    title: "I. İnönü Muharebesi",
    kind: "war",
    parties: "TBMM Düzenli Ordusu vs Yunan Krallığı Ordusu",
    leader: "Albay İsmet (İnönü) Bey",
    importance: "Düzenli Türk ordusunun Batı Cephesi'ndeki İLK ASKERİ ZAFERİDİR.",
    keyNotes: [
      "İç ve dış siyasette devasa sonuçlar doğurmuştur (Şifre: MİLÂT).",
      "Halkın TBMM'ye ve düzenli orduya güveni tam olarak pekişmiştir."
    ],
    mnemonicId: "1-inonu-milat"
  },
  {
    id: "moskova-1921",
    periodId: "milli-mucadele-cumhuriyet",
    year: "16 Mart 1921",
    title: "Moskova Antlaşması",
    kind: "treaty",
    parties: "TBMM Hükümeti vs Sovyet Rusya",
    leader: "Ali Fuat Cebesoy, Yusuf Kemal Tengirşenk, Rıza Nur",
    importance: "TBMM'yi ve Misak-ı Milli'yi tanıyan İLK BÜYÜK AVRUPALI DEVLET Sovyet Rusya olmuştur.",
    keyNotes: [
      "İki devletten birinin tanımadığı antlaşmayı diğeri de tanımayacaktır (Sovyetler Sevr'i resmen reddetmiştir).",
      "Çarlık ile Osmanlı arasındaki tüm antlaşmalar ve kapitülasyonlar geçersiz sayılmıştır.",
      "Batum Gürcistan'a bırakılarak Misak-ı Milli'den İLK TAVİZ verilmiştir."
    ],
    mnemonicId: "dogu-siniri-gmk"
  },
  {
    id: "2-inonu",
    periodId: "milli-mucadele-cumhuriyet",
    year: "23 Mart - 1 Nisan 1921",
    title: "II. İnönü Muharebesi",
    kind: "war",
    parties: "TBMM Düzenli Ordusu vs Yunan Ordusu",
    leader: "Tümgeneral İsmet (İnönü) Paşa",
    importance: "İtilaf Devletleri arasındaki birlik çatlamış; İtalya Anadolu'dan çekilmeye başlamış, Fransa barış için Ankara'ya temsilci göndermiştir.",
    keyNotes: [
      "Mustafa Kemal'in tarihi telgrafı: 'Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz!'"
    ]
  },
  {
    id: "kutahya-eskisehir",
    periodId: "milli-mucadele-cumhuriyet",
    year: "10 - 24 Temmuz 1921",
    title: "Kütahya - Eskişehir Muharebeleri",
    kind: "war",
    parties: "TBMM Ordusu vs Yunan Ordusu",
    leader: "İsmet Paşa / Mustafa Kemal Paşa",
    importance: "Kurtuluş Savaşı Batı Cephesi'ndeki İLK ve TEK YENİLGİMİZDİR.",
    keyNotes: [
      "Mustafa Kemal ordunun tamamen yok olmasını engellemek için kuvvetleri Sakarya Nehri'nin doğusuna çekmiştir.",
      "TBMM'de Meclis'in Kayseri'ye taşınması tartışmaları yaşanmıştır.",
      "Mustafa Kemal'e 3 aylığına BAŞKOMUTANLIK yetkisi verilmiş ve Tekâlif-i Milliye Emirleri yayımlanmıştır."
    ]
  },
  {
    id: "sakarya",
    periodId: "milli-mucadele-cumhuriyet",
    year: "23 Ağustos - 13 Eylül 1921",
    title: "Sakarya Meydan Muharebesi",
    kind: "war",
    parties: "TBMM Ordusu vs Yunan Ordusu",
    leader: "Başkomutan Mustafa Kemal Paşa",
    importance: "1683 II. Viyana Kuşatması'ndan beri 238 yıldır süren Türk geri çekilişi SON BULMUŞTUR.",
    keyNotes: [
      "Mustafa Kemal'in askeri deha doktrini: 'Hatt-ı müdafaa yoktur, sath-ı müdafaa vardır. O satıh bütün vatandır!'",
      "Mustafa Kemal'e TBMM tarafından 'Gazi' unvanı ve 'Mareşal' rütbesi verilmiştir.",
      "Subaylar Savaşı (Melhame-i Kübra) olarak da anılır.",
      "Hemen ardından Kars ve Ankara Antlaşmaları imzalanmıştır."
    ]
  },
  {
    id: "kars-1921",
    periodId: "milli-mucadele-cumhuriyet",
    year: "13 Ekim 1921",
    title: "Kars Antlaşması",
    kind: "treaty",
    parties: "TBMM Hükümeti vs Kafkas Cumhuriyetleri (Azerbaycan, Ermenistan, Gürcistan)",
    leader: "Kazım Karabekir Paşa",
    importance: "TÜRKİYE'NİN DOĞU SINIRI KESİNLEŞMİŞTİR.",
    keyNotes: [
      "Moskova Antlaşması'nın Kafkas cumhuriyetlerince teyit edilmesidir.",
      "Doğu sınırı zinciri: Gümrü -> Moskova -> Kars (Kod: GMK)."
    ],
    mnemonicId: "dogu-siniri-gmk"
  },
  {
    id: "ankara-1921",
    periodId: "milli-mucadele-cumhuriyet",
    year: "20 Ekim 1921",
    title: "1921 Ankara Antlaşması",
    kind: "treaty",
    parties: "TBMM Hükümeti vs Fransa (Franklin-Bouillon)",
    leader: "Yusuf Kemal Tengirşenk",
    importance: "Fransa TBMM'yi tanıyan İLK İTİLAF DEVLETİ olmuş; GÜNEY CEPHESİ KAPANMIŞTIR.",
    keyNotes: [
      "İtilaf bloğu resmen parçalanmıştır.",
      "Hatay, özel bir yönetim ve Fransız mandasındaki Suriye'de kalmak şartıyla bırakılmıştır (Misak-ı Milli'den 2. Taviz).",
      "Güneydeki Türk birlikleri Batı Cephesi'ne kaydırılmıştır."
    ]
  },
  {
    id: "buyuk-taarruz",
    periodId: "milli-mucadele-cumhuriyet",
    year: "26 Ağustos - 9 Eylül 1922",
    title: "Büyük Taarruz ve Başkomutanlık Meydan Muharebesi",
    kind: "war",
    parties: "Türk Ordusu vs Yunan Ordusu",
    leader: "Başkomutan Gazi Mustafa Kemal Paşa, Fevzi Paşa, İsmet Paşa",
    importance: "Batı Anadolu düşman işgalinden tamamen temizlenmiş, Kurtuluş Savaşı'nın askeri safhası zaferle bitmiştir.",
    keyNotes: [
      "Dumlupınar'da Yunan ordusu imha edilmiş; Yunan Başkomutanı Trikopis esir alınmıştır.",
      "Tarihi emir: 'Ordular! İlk hedefiniz Akdeniz'dir, ileri!'",
      "9 Eylül 1922'de Türk ordusu İzmir'e girmiştir.",
      "Fevzi Çakmak'a Mareşal rütbesi verilmiştir."
    ]
  },
  {
    id: "mudanya",
    periodId: "milli-mucadele-cumhuriyet",
    year: "11 Ekim 1922",
    title: "Mudanya Ateşkes Antlaşması",
    kind: "treaty",
    parties: "TBMM vs İngiltere, Fransa, İtalya (Yunanistan açıkta gemide)",
    leader: "İsmet İnönü",
    importance: "Doğu Trakya, Boğazlar ve İstanbul TEK BİR KURŞUN ATILMADAN DİPLOMATİK YOLLA KURTARILMIŞTIR.",
    keyNotes: [
      "İstanbul'un yönetimi TBMM'ye bırakıldığı için OSMANLI DEVLETİ HUKUKEN SONA ERMİŞTİR.",
      "Milli Mücadele'nin silahlı çatışma dönemi sona ermiş, diplomasi dönemi başlamıştır.",
      "Refet Bele Trakya Yüksek Komiseri olarak İstanbul'a girmiştir."
    ]
  },
  {
    id: "lozan",
    periodId: "milli-mucadele-cumhuriyet",
    year: "24 Temmuz 1923",
    title: "Lozan Barış Antlaşması",
    kind: "treaty",
    parties: "TBMM vs İngiltere, Fransa, İtalya, Japonya, Yunanistan, Romanya, Yugoslavya",
    leader: "İsmet İnönü, Dr. Rıza Nur, Hasan Saka",
    importance: "TÜRKİYE CUMHURİYETİ'NİN KURUCU TAPU SENEDİDİR; Sevr paçavrası yırtılıp çöpe atılmıştır.",
    keyNotes: [
      "KAPİTÜLASYONLAR TAVİZSİZ VE TAMAMEN KALDIRILDI.",
      "Bütün azınlıklar Türk vatandaşı sayıldı (yabancı müdahalesi engellendi).",
      "Savaş tazminatı olarak Yunanistan'dan Karaağaç ve Bosnaköy alındı.",
      "Düyun-ı Umumiye idaresi kaldırıldı; borçlar Osmanlı'dan ayrılan devletlere paylaştırıldı.",
      "LOZAN'DA ÇÖZÜLEMEYİP SONRAYA BIRAKILAN TEK KONU: MUSUL (IRAK SINIRI) MESELESİDİR!"
    ],
    mnemonicId: "bogazlar-sureci"
  },
  {
    id: "ankara-1926",
    periodId: "milli-mucadele-cumhuriyet",
    year: "5 Haziran 1926",
    title: "1926 Ankara Antlaşması",
    kind: "treaty",
    parties: "Türkiye Cumhuriyeti vs İngiltere ve Irak",
    leader: "Tevfik Rüştü Aras",
    importance: "Türkiye - Irak sınırı çizilmiş; Musul İngiliz mandasındaki Irak'a bırakılmıştır.",
    keyNotes: [
      "Şeyh Said İsyanı nedeniyle askeri müdahale yapılamamış ve aleyhimize sonuçlanmıştır.",
      "Musul petrol gelirlerinin %10'u 25 yıl süreyle Türkiye'ye tahsis edilmiştir (Türkiye daha sonra toplu para karşılığı feragat etmiştir)."
    ]
  },
  {
    id: "balkan-antanti",
    periodId: "milli-mucadele-cumhuriyet",
    year: "9 Şubat 1934",
    title: "Balkan Antantı",
    kind: "pact",
    parties: "Türkiye, Yunanistan, Yugoslavya, Romanya (TAYYAR)",
    leader: "Mustafa Kemal Atatürk / Tevfik Rüştü Aras",
    importance: "BATI SINIRIMIZ İtalya ve Almanya tehdidine karşı karşılıklı güvence altına alınmıştır.",
    keyNotes: [
      "Bulgaristan yayılmacı emelleri, Arnavutluk ise İtalya baskısı nedeniyle katılmamıştır.",
      "Kodlama: TAYYAR."
    ],
    mnemonicId: "balkan-antanti-tayyar"
  },
  {
    id: "montro",
    periodId: "milli-mucadele-cumhuriyet",
    year: "20 Temmuz 1936",
    title: "Montrö Boğazlar Sözleşmesi",
    kind: "treaty",
    parties: "Türkiye vs İngiltere, Fransa, Sovyetler, Japonya, Romanya, Yugoslavya, Yunanistan",
    leader: "Tevfik Rüştü Aras (Dışişleri Bakanı)",
    importance: "BOĞAZLAR KOMİSYONU KALDIRILDI; BOĞAZLARDA TAM TÜRK EGEMENLİĞİ SAĞLANDI.",
    keyNotes: [
      "Boğazlar askerden arındırılmış bölge statüsünden çıkarıldı; Türkiye Boğazlara asker ve top yerleştirme hakkı aldı.",
      "Ticaret gemilerine serbest geçiş, savaş gemilerine tonaj ve süre kısıtlaması getirildi.",
      "Savaş tehlikesi durumunda Boğazları kapatma yetkisi tamamen Türkiye'ye verildi."
    ],
    mnemonicId: "bogazlar-sureci"
  },
  {
    id: "sadabat-pakti",
    periodId: "milli-mucadele-cumhuriyet",
    year: "8 Temmuz 1937",
    title: "Sadabat Paktı",
    kind: "pact",
    parties: "Türkiye, İran, Irak, Afganistan (İTAY)",
    leader: "Mustafa Kemal Atatürk / Tevfik Rüştü Aras",
    importance: "DOĞU VE GÜNEY SINIRLARIMIZ İtalyan faşizminin yayılmacılığına karşı güvenceye alınmıştır.",
    keyNotes: [
      "Tahran'daki Sadabat Sarayı'nda imzalanmıştır.",
      "Suriye; Hatay meselesi ve Irak ile sınır sorunları nedeniyle pakta katılmamıştır.",
      "Kodlama: İTAY."
    ],
    mnemonicId: "sadabat-pakti-itay"
  },
  {
    id: "hatay-antlasmasi",
    periodId: "milli-mucadele-cumhuriyet",
    year: "1938 - 1939",
    title: "Hatay'ın Anavatana Katılması",
    kind: "treaty",
    parties: "Türkiye Cumhuriyeti vs Fransa & Hatay Cumhuriyeti",
    leader: "Mustafa Kemal Atatürk (fikri mimarı) / İsmet İnönü dönemi",
    importance: "Misak-ı Milli'den verilen Hatay tavizi telafi edilmiş ve Hatay Türkiye toprağı olmuştur.",
    keyNotes: [
      "Atatürk: 'Hatay benim şahsi meselemdir' ve 'Kırk asırlık Türk yurdu düşman elinde esir kalamaz' demiştir.",
      "Milletler Cemiyeti Sandoval Raporu doğrultusunda 1938'de bağımsız Hatay Cumhuriyeti kurulmuştur (İlk Cumhurbaşkanı: Tayfur Sökmen, Başbakan: Abdurrahman Melek).",
      "23 Haziran 1939'da Hatay Millet Meclisi oybirliğiyle Türkiye'ye katılma kararı almıştır."
    ]
  }
];

// ==========================================
// 3. KPSS KARŞILAŞTIRMA VE ÖZET TABLOLARI
// ==========================================
export type QuickCheatsheet = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  rows: {
    event: string;
    year: string;
    feature: string;
    kpssTrap: string;
  }[];
};

export const QUICK_CHEATSHEETS: QuickCheatsheet[] = [
  {
    id: "dogu-sinirlari-karsilastirma",
    title: "Doğu Sınırının Tarihsel Gelişimi (Amasya'dan Kars'a)",
    subtitle: "Safevi ve Rusya mücadeleleri sonucu doğu sınırımızın evrimi",
    badge: "Sınır Gelişimi",
    rows: [
      { event: "1555 Amasya Antlaşması", year: "1555", feature: "İran ile İLK resmi barış antlaşması.", kpssTrap: "Safevilerle yapılan ilk antlaşmadır." },
      { event: "Ferhat Paşa Antlaşması", year: "1590", feature: "Osmanlı DOĞUDA EN GENİŞ sınırlara ulaştı.", kpssTrap: "Hazar Denizi'ne kadar çıkılmıştır." },
      { event: "Nasuh Paşa Antlaşması", year: "1612", feature: "Ferhat Paşa kazanımları geri verildi; 200 deve yükü ipek.", kpssTrap: "Doğuda ilk toprak kaybıdır." },
      { event: "Kasr-ı Şirin Antlaşması", year: "1639", feature: "Günümüz Türkiye-İran sınırının temelini attı (Zağros Dağları).", kpssTrap: "IV. Murad Bağdat fethi sonrası imzaladı." },
      { event: "Gümrü Antlaşması", year: "1920", feature: "TBMM'nin ilk askeri-siyasi zaferi; Doğu sınırı ilk kez çizildi.", kpssTrap: "Sevr'i reddeden ilk devlet Ermenistan oldu." },
      { event: "Moskova Antlaşması", year: "1921", feature: "Sovyetler Sevr'i reddetti; Batum taviz verildi.", kpssTrap: "Misak-ı Milli'den ilk taviz Batum'dur." },
      { event: "Kars Antlaşması", year: "1921", feature: "Türkiye'nin DOĞU SINIRI KESİNLEŞTİ!", kpssTrap: "Kafkas cumhuriyetleriyle Sakarya sonrası yapıldı." }
    ]
  },
  {
    id: "bati-sinirlari-karsilastirma",
    title: "Batı Sınırları & Dönüm Noktaları",
    subtitle: "Zirveden gerilemeye Avrupa sınırlarının değişimi",
    badge: "Batı Cephesi",
    rows: [
      { event: "1533 İstanbul Antlaşması", year: "1533", feature: "Avusturya kralı Osmanlı Sadrazamına denk sayıldı.", kpssTrap: "Avrupa üzerindeki mutlak siyasi üstünlük belgesidir." },
      { event: "1606 Zitvatorok Antlaşması", year: "1606", feature: "Avusturya kralı Osmanlı Padişahına denk sayıldı.", kpssTrap: "Siyasi üstünlük bitti; 'mütekabiliyet' başladı." },
      { event: "1672 Bucaş Antlaşması", year: "1672", feature: "Osmanlı BATIDA EN GENİŞ sınırlara ulaştı.", kpssTrap: "Topraklarımıza yeni toprak kattığımız son antlaşmadır." },
      { event: "1699 Karlofça Antlaşması", year: "1699", feature: "Batıda ilk büyük çaplı toprak kaybı; Gerileme dönemi başladı.", kpssTrap: "Garantör devlet Avusturya olmuştur." },
      { event: "1718 Pasarofça Antlaşması", year: "1718", feature: "Belgrad kaybedildi; Lâle Devri ve Batılılaşma başladı.", kpssTrap: "Toprakları geri alma ümidi sona ermiştir." },
      { event: "1739 Belgrad Antlaşması", year: "1739", feature: "18. yüzyıldaki son karlı antlaşma; Belgrad geri alındı.", kpssTrap: "Karadeniz'in Türk gölü olduğu son kez onaylandı." },
      { event: "1923 Lozan Antlaşması", year: "1923", feature: "Meriç Nehri sınır oldu; Karaağaç savaş tazminatı alındı.", kpssTrap: "Batı Trakya ve Ege adaları Lozan'da sınırlarımız dışındadır." }
    ]
  },
  {
    id: "lozan-sonrasi-meseleler",
    title: "Lozan'dan Sonra Çözülen Dış Politika Meseleleri",
    subtitle: "Cumhuriyet döneminde lehimize ve aleyhimize sonuçlanan başlıklar",
    badge: "Cumhuriyet Dış Politika",
    rows: [
      { event: "Yabancı Okullar Meselesi", year: "1924-1926", feature: "Tevhid-i Tedrisat gereği MEB kurallarına bağlandı (Lehimize).", kpssTrap: "Fransa ve Papalık karşı çıktı; iç meselemiz sayarak görüştürmedik." },
      { event: "Musul / Irak Sınırı", year: "1926", feature: "Musul İngiliz mandasındaki Irak'a bırakıldı (ALEYHİMİZE).", kpssTrap: "Şeyh Said İsyanı nedeniyle askeri müdahale yapılamadı." },
      { event: "Nüfus Mübadelesi", year: "1930", feature: "Yunanistan ile ahali antlaşması imzalandı (Çözüldü).", kpssTrap: "İstanbul Rumları ile Batı Trakya Türkleri muaf tutuldu." },
      { event: "Bozkurt - Lotus Olayı", year: "1926", feature: "Lahey Adalet Divanı'nda Mahmut Esat Bozkurt davayı kazandı.", kpssTrap: "Türk karasularında yargı yetkimiz uluslararası tescillendi." },
      { event: "Montrö Boğazlar Sözleşmesi", year: "1936", feature: "Boğazlar Komisyonu kalktı, tam Türk egemenliği sağlandı (LEHİMİZE).", kpssTrap: "Lozan'daki askersizleştirme ve komisyon engeli temizlendi." },
      { event: "Hatay'ın Anavatana Katılması", year: "1939", feature: "Hatay Meclisi kararıyla Türkiye'ye katıldı (LEHİMİZE).", kpssTrap: "Atatürk'ün sağlığında Hatay Cumhuriyeti kurulmuş, ilhakı 1939'da olmuştur." }
    ]
  }
];
