export type StudyNoteSource = {
  label: string;
  detail: string;
  url: string;
};

export type StudyNoteGroup = {
  title: string;
  items: string[];
};

export type StudyNoteSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  bullets?: string[];
  groups?: StudyNoteGroup[];
  examNote?: string;
};

export type StudyNoteTopic = {
  id: string;
  subject: string;
  title: string;
  description: string;
  status: "ready" | "planned";
  quickFacts: string[];
  sections: StudyNoteSection[];
  sources: StudyNoteSource[];
};

const MEBI_TYT_EARTH_SHAPE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page14.html";
const MEBI_TYT_DAILY_MOTION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page15.html";
const MEBI_TYT_ANNUAL_MOTION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page16.html";
const MEBI_TYT_SOLSTICES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page18.html";
const MEBI_TYT_MAP_BASICS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page24.html";
const MEBI_TYT_MAP_CALCULATIONS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page26.html";
const MEBI_TYT_CONTOURS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page30.html";
const MEBI_TYT_ATMOSPHERE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page32.html";
const MEBI_TYT_TEMPERATURE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page34.html";
const MEBI_TYT_PRESSURE_WINDS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page36.html";
const MEBI_TYT_HUMIDITY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page39.html";
const MEBI_TYT_CLIMATE_TYPES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page42.html";
const MEBI_TYT_TURKEY_CLIMATE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page45.html";
const MEBI_TYT_TURKEY_CLIMATE_TYPES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page48.html";
const MEBI_TYT_COORDINATES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page19.html";
const MEBI_TYT_LATITUDE_LONGITUDE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page20.html";
const MEBI_TYT_LOCAL_TIME =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page21.html";
const MEBI_TYT_TURKEY_LOCATION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page23.html";
const MEBI_TYT_INNER_FORCES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page62.html";
const MEBI_TYT_VOLCANISM =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page63.html";
const MEBI_TYT_ROCKS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page64.html";
const MEBI_TYT_EXTERNAL_FORCES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page65.html";
const MEBI_TYT_RIVERS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page67.html";
const MEBI_TYT_KARST =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page70.html";
const MEBI_TYT_COASTS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page71.html";
const MEBI_TYT_TURKEY_INNER_FORCES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page73.html";
const MEBI_TYT_GLACIERS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page75.html";
const MEBI_TYT_MAIN_LANDFORMS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page76.html";
const MEBI_TYT_WORLD_WATER =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page77.html";
const MEBI_TYT_RIVER_BASINS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page79.html";
const MEBI_TYT_TURKEY_WATER =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page81.html";
const MEBI_TYT_TURKEY_RIVERS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page82.html";
const MEBI_TYT_SOILS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page84.html";
const MEBI_TYT_TURKEY_SOILS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page86.html";
const MEBI_TYT_PLANTS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page88.html";
const MEBI_TYT_TURKEY_PLANTS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page90.html";
const MEBI_TYT_POPULATION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page92.html";
const MEBI_TYT_POPULATION_DISTRIBUTION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page96.html";
const MEBI_TYT_POPULATION_PYRAMIDS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page98.html";
const MEBI_TYT_TURKEY_POPULATION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page99.html";
const MEBI_TYT_TURKEY_POPULATION_DISTRIBUTION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page100.html";
const MEBI_TYT_MIGRATION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page102.html";
const MEBI_TYT_TURKEY_MIGRATION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page104.html";
const MEBI_TYT_SETTLEMENT =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page49.html";
const MEBI_TYT_SETTLEMENT_TYPES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page52.html";
const MEBI_TYT_ECONOMIC_ACTIVITIES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page106.html";
const MEBI_TYT_ECONOMIC_SECTORS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page107.html";
const MEBI_TYT_TRANSPORT =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page108.html";
const MEBI_AYT_AGRICULTURE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page28.html";
const MEBI_AYT_INDUSTRIAL_CROPS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page29.html";
const MEBI_AYT_SPECIAL_CROPS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page30.html";
const MEBI_AYT_ANIMAL_HUSBANDRY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page31.html";
const MEBI_AYT_LIVESTOCK_TYPES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page32.html";
const MEBI_AYT_MINING =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page34.html";
const MEBI_AYT_ENERGY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page35.html";
const MEBI_AYT_RENEWABLE_ENERGY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page36.html";
const MEBI_AYT_INDUSTRY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page37.html";
const MEBI_AYT_INDUSTRY_BRANCHES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page38.html";
const MEBI_AYT_TRADE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page82.html";
const MEBI_AYT_FOREIGN_TRADE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page83.html";
const MEBI_AYT_TOURISM =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page84.html";
const MEBI_AYT_TOURISM_TYPES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page85.html";
const MEBI_TYT_DISASTERS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page111.html";
const MEBI_TYT_CLIMATE_DISASTERS =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page112.html";
const MEBI_TYT_EARTHQUAKES =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page114.html";
const MEBI_AYT_ENVIRONMENT =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page53.html";
const MEBI_AYT_POLLUTION =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page54.html";
const MEBI_AYT_WASTE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page60.html";
const MEB_EKPSS_GEOGRAPHY_BOOK =
  "https://orgm.meb.gov.tr/ekpssmebozel/content/magazines/pdf/cografya2.pdf#page=55";

export const STUDY_NOTE_TOPICS: StudyNoteTopic[] = [
  {
    id: "earth-movements",
    subject: "Doğal sistemler",
    title: "Dünya'nın Şekli ve Hareketleri",
    description:
      "Dünya'nın geoit şekli, günlük-yıllık hareketleri, eksen eğikliği ve özel tarihleri KPSS'de ayırt ettiren sonuçlarıyla özetler.",
    status: "ready",
    quickFacts: [
      "Dünya kutuplardan basık, Ekvator'dan şişkin kendine özgü geoit biçimindedir.",
      "Günlük hareket 24 saatte batıdan doğuya; yıllık hareket 365 gün 6 saatte tamamlanır.",
      "Mevsimlerin nedeni eksen eğikliği ile yıllık hareketin birlikte etkisidir.",
      "21 Mart ve 23 Eylül ekinoks; 21 Haziran ve 21 Aralık gündönümü tarihleridir.",
    ],
    sections: [
      {
        id: "geoid-shape",
        eyebrow: "ŞEKLİN KANITI",
        title: "Geoit ve küreselliğin sonuçları",
        summary:
          "Dünya tam küre değildir; kutuplardan basık, Ekvator'dan şişkin olan kendine özgü şekline geoit denir.",
        groups: [
          {
            title: "Geoit olmanın sonuçları",
            items: [
              "Ekvator yarıçapı kutup yarıçapından daha uzundur.",
              "Ekvator çevresi tam meridyen çevresinden daha uzundur.",
              "Yer çekimi Ekvator'dan kutuplara doğru artar.",
            ],
          },
          {
            title: "Küresel olmanın sonuçları",
            items: [
              "Güneş ışınlarının düşme açısı Ekvator'dan kutuplara azalır.",
              "Gölge boyu ve ışınların atmosferde aldığı yol kutuplara doğru artar.",
              "Paralellerin çevresi ve çizgisel hız kutuplara doğru azalır.",
              "Haritalarda alan ve şekil bozulmaları oluşur.",
            ],
          },
        ],
        examNote:
          "Yer çekimi, yarıçap ve çevre uzunluğu soruluyorsa geoit; ışın açısı, gölge ve harita bozulması soruluyorsa küresellik düşün.",
      },
      {
        id: "daily-motion",
        eyebrow: "24 SAATLİK DÖNÜŞ",
        title: "Günlük hareketin sonuçları",
        summary:
          "Dünya kendi ekseni çevresinde batıdan doğuya 24 saatte döner.",
        bullets: [
          "Gece ve gündüz birbirini izler; Güneş doğudan doğup batıdan batıyormuş gibi görünür.",
          "Yerel saat farkları ve doğu-batı yönleri oluşur.",
          "Gün içindeki sıcaklık, basınç ve gölge boyu değişir.",
          "Meltem rüzgârları gibi günlük basınç farkına bağlı rüzgârlar oluşur.",
          "Sürekli rüzgârlar ve okyanus akıntıları Kuzey Yarım Küre'de sağa, Güney Yarım Küre'de sola sapar.",
          "30° ve 60° enlemlerinde dinamik basınç kuşakları oluşur.",
        ],
        examNote:
          "Yerel saat, günlük sıcaklık farkı ve sapma günlük harekettir; mevsimler günlük hareketin sonucu değildir.",
      },
      {
        id: "rotation-speeds",
        eyebrow: "HIZ AYRIMI",
        title: "Açısal hız ve çizgisel hız",
        summary:
          "Dünya üzerindeki bütün noktalar aynı sürede 360° döner; fakat aldıkları yol enleme göre değişir.",
        bullets: [
          "Açısal hız her yerde aynıdır: 24 saatte 360°, saatte 15°.",
          "1° boylam farkı 4 dakika yerel saat farkı oluşturur.",
          "Çizgisel hız Ekvator'da en fazladır ve yaklaşık 1670 km/saattir.",
          "Çizgisel hız Ekvator'dan kutuplara doğru azalır; kutup noktalarında sıfırdır.",
          "Güneş'in doğuş ve batış süresi çizgisel hızın fazla olduğu alçak enlemlerde daha kısadır.",
        ],
        examNote:
          "Açısal hız değişmez; çizgisel hız enleme bağlıdır. KPSS'de en sık yapılan karışıklıklardan biridir.",
      },
      {
        id: "annual-motion",
        eyebrow: "YÖRÜNGE HAREKETİ",
        title: "Yıllık hareket ve yörünge",
        summary:
          "Dünya, Güneş çevresindeki elips yörüngesini 365 gün 6 saatte tamamlar.",
        bullets: [
          "Artan 6 saatler dört yılda 24 saate ulaşır ve şubat ayına bir gün eklenir.",
          "Dünya 3 Ocak'ta Güneş'e en yakın, 4 Temmuz'da en uzak konumdadır.",
          "Yörüngenin elips olması Dünya'nın yörünge hızını ve mevsim sürelerini değiştirir.",
          "Kuzey Yarım Küre'de sonbahar-kış süresi, ilkbahar-yaz süresinden daha kısadır.",
          "Dünya-Güneş uzaklığı mevsimlerin temel nedeni değildir.",
        ],
        examNote:
          "3 Ocak'ta Kuzey Yarım Küre kış yaşarken Dünya Güneş'e en yakındır; bu bilgi 'mevsimler uzaklığa bağlıdır' yanılgısını çürütür.",
      },
      {
        id: "axis-tilt",
        eyebrow: "23°27′ EĞİKLİK",
        title: "Eksen eğikliğinin sonuçları",
        summary:
          "Dünya'nın ekseni yörünge düzlemine 66°33′, yörünge düzleminin dikine 23°27′ eğiktir.",
        bullets: [
          "Mevsimler oluşur ve iki yarım kürede zıt mevsimler yaşanır.",
          "Güneş ışınlarının düşme açısı yıl içinde değişir.",
          "Gece-gündüz süreleri ve gölge boyları yıl boyunca değişir.",
          "Güneş'in doğuş-batış yeri ve saatleri değişir.",
          "Dönenceler, kutup daireleri ve matematik iklim kuşakları oluşur.",
          "Kutup noktalarında altışar aylık gece ve gündüz yaşanır.",
        ],
        examNote:
          "Mevsim için yalnız yıllık hareket yetmez; yıllık hareket ile eksen eğikliği birlikte gerekir.",
      },
      {
        id: "special-dates",
        eyebrow: "ÖZEL TARİHLER",
        title: "Ekinoks ve gündönümleri",
        summary:
          "Dört özel tarih, ışın açısı ile gece-gündüz sürelerinin uç ve eşit değerlerini gösterir.",
        groups: [
          {
            title: "21 Mart ve 23 Eylül",
            items: [
              "Güneş ışınları Ekvator'a dik gelir.",
              "Gece ve gündüz Dünya'nın her yerinde eşittir.",
              "Aydınlanma çemberi kutup noktalarından geçer.",
              "21 Mart Kuzey'de ilkbahar, 23 Eylül sonbahar başlangıcıdır.",
            ],
          },
          {
            title: "21 Haziran",
            items: [
              "Işınlar Yengeç Dönencesi'ne dik gelir.",
              "Kuzey Yarım Küre'de en uzun gündüz ve yaz başlangıcıdır.",
              "Kuzeye gidildikçe gündüz süresi uzar.",
            ],
          },
          {
            title: "21 Aralık",
            items: [
              "Işınlar Oğlak Dönencesi'ne dik gelir.",
              "Kuzey Yarım Küre'de en uzun gece ve kış başlangıcıdır.",
              "Kuzeye gidildikçe gece süresi uzar.",
            ],
          },
        ],
        examNote:
          "Ekinoksta her yerde 12 saat gece-gündüz vardır; gündönümünde yalnız Ekvator'da süreler yine eşittir.",
      },
      {
        id: "earth-traps",
        eyebrow: "KPSS AYIRICI NOTLAR",
        title: "Sık karıştırılan sonuçlar",
        summary:
          "Soruda verilen olayın şekil, günlük hareket, yıllık hareket veya eksen eğikliğinden hangisine bağlı olduğunu ayır.",
        bullets: [
          "Gece-gündüzün oluşması küresellik; birbirini izlemesi günlük harekettir.",
          "Güneş ışınlarının Ekvator'dan kutuplara küçülmesi şekil; yıl içinde değişmesi eksen eğikliğidir.",
          "Yerel saat farkı günlük hareket ve boylamla ilgilidir.",
          "Mevsim süresinin eşit olmaması elips yörünge ve değişen yörünge hızına bağlıdır.",
          "Türkiye'ye Güneş ışınlarının hiçbir zaman dik gelmemesi orta enlemde bulunmasının sonucudur.",
        ],
        examNote:
          "Sorudaki 'gün içinde', 'yıl içinde' ve 'Ekvator'dan kutuplara' ifadeleri doğru nedeni bulduran güçlü ipuçlarıdır.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dünya'nın şekli ve sonuçları, s. 14",
        url: MEBI_TYT_EARTH_SHAPE,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dünya'nın günlük hareketi, s. 15",
        url: MEBI_TYT_DAILY_MOTION,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Yıllık hareket ve eksen eğikliği, s. 16",
        url: MEBI_TYT_ANNUAL_MOTION,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Özel tarihler, s. 18",
        url: MEBI_TYT_SOLSTICES,
      },
    ],
  },
  {
    id: "latitude-longitude",
    subject: "Coğrafi konum",
    title: "Enlem ve Boylam",
    description:
      "Paralel-meridyen özellikleri, enlem etkileri, yerel saat kuralları ve Türkiye'nin mutlak konumunu birlikte öğreten MEB/KPSS özeti.",
    status: "ready",
    quickFacts: [
      "Enlem Ekvator'a, boylam başlangıç meridyenine olan açısal uzaklıktır.",
      "Ardışık iki paralel arası yaklaşık 111 km; iki meridyen arası yerel saat farkı 4 dakikadır.",
      "Doğudaki merkezin yerel saati ileride, batıdaki merkezin geridedir.",
      "Türkiye 36°-42° Kuzey paralelleri ile 26°-45° Doğu meridyenleri arasındadır.",
    ],
    sections: [
      {
        id: "coordinate-system",
        eyebrow: "TEMEL KAVRAM",
        title: "Koordinat sistemi ve mutlak konum",
        summary:
          "Paralel ve meridyenlerin oluşturduğu sistem bir noktanın Dünya üzerindeki yerini kesin olarak belirler.",
        bullets: [
          "Mutlak konum, bir yerin Ekvator ve Greenwich'e göre enlem-boylam değerleriyle gösterilmesidir.",
          "Göreceli konum; denizlere, kıtalara, ulaşım yollarına, komşulara ve kaynaklara göre değişebilen konum özellikleridir.",
          "Enlem kuzey-güney, boylam doğu-batı yönündeki konumu belirler.",
        ],
        examNote:
          "Koordinat, derece veya yerel saat bilgisi mutlak konumdur; boğaz, kıta köprüsü, komşu ve ticaret yolu bilgisi göreceli konumdur.",
      },
      {
        id: "parallels-latitude",
        eyebrow: "ENLEMİN ÇİZGİLERİ",
        title: "Paraleller ve enlem",
        summary:
          "Enlem, bir noktanın Ekvator'a olan açısal uzaklığıdır; paraleller bu uzaklığı gösteren doğu-batı yönlü çemberlerdir.",
        bullets: [
          "Başlangıç paraleli 0° Ekvator'dur ve en uzun paraleldir.",
          "90 Kuzey, 90 Güney olmak üzere 180 paralel derecesi vardır; kutup noktaları çember değildir.",
          "Paraleller kesişmez; Ekvator'dan kutuplara doğru çevre uzunlukları azalır.",
          "Ardışık iki paralel arasındaki kuş uçuşu uzaklık her yerde yaklaşık 111 km'dir.",
          "Dönenceler 23°27', kutup daireleri 66°33', kutup noktaları 90° özel enlemleridir.",
        ],
        examNote:
          "Kuzey-güney uzaklık sorularında enlem farkını 111 km ile çarp. 36°-42° arasındaki fark 6 × 111 = 666 km'dir.",
      },
      {
        id: "latitude-effects",
        eyebrow: "EKVATOR'DAN KUTUPLARA",
        title: "Enlemin başlıca etkileri",
        summary:
          "Enlem değiştikçe Güneş ışınlarının düşme açısı ve Dünya'nın şekline bağlı birçok özellik düzenli değişir.",
        groups: [
          {
            title: "Azalanlar",
            items: [
              "Güneş ışınlarının düşme açısı ve ufuk üzerindeki yüksekliği",
              "Çizgisel dönüş hızı",
              "Deniz suyu sıcaklığı ve genel olarak tuzluluk",
              "Tarım, orman, yerleşme ve kalıcı kar alt sınırı",
            ],
          },
          {
            title: "Artanlar",
            items: [
              "Gölge boyu",
              "Yer çekimi",
              "Gurup ve tan süresi",
              "Gece-gündüz süre farkı ve ışınların atmosferde aldığı yol",
            ],
          },
          {
            title: "Aynı enlemde aynı olanlar",
            items: [
              "Güneş ışınlarını alış açısı",
              "Gece-gündüz süreleri",
              "Çizgisel hız ve yer çekimi",
              "Gurup ve tan süreleri",
            ],
          },
        ],
        examNote:
          "Sıcaklık her zaman yalnız enlemle açıklanmaz; yükselti, denizellik, akıntı ve rüzgâr etkisi varsa önce bunları kontrol et.",
      },
      {
        id: "meridians-longitude",
        eyebrow: "BOYLAMIN ÇİZGİLERİ",
        title: "Meridyenler ve boylam",
        summary:
          "Boylam, bir noktanın Greenwich başlangıç meridyenine olan açısal uzaklığıdır ve temel olarak yerel saati etkiler.",
        bullets: [
          "Meridyenler kutuplarda birleşen, Ekvator'u dik kesen kuzey-güney yönlü yarım dairelerdir.",
          "180 Doğu, 180 Batı olmak üzere 360 meridyen derecesi vardır.",
          "Bütün meridyen yaylarının uzunluğu eşittir; aralarındaki mesafe kutuplara doğru azalır.",
          "Aynı meridyen üzerindeki noktaların yerel saatleri aynıdır.",
          "Bir meridyenle antimeridyeninin toplamı 180° ve aralarındaki yerel saat farkı 12 saattir.",
        ],
        examNote:
          "Paralellerin çevresi kutuplara doğru küçülür; meridyenlerin boyu değişmez. Meridyenler arası uzaklık ise kutuplara doğru daralır.",
      },
      {
        id: "local-time",
        eyebrow: "HESAP KURALI",
        title: "Yerel saat nasıl hesaplanır?",
        summary:
          "Dünya batıdan doğuya döndüğü için doğudaki yer Güneş'i daha önce görür ve yerel saati ileridir.",
        bullets: [
          "Aynı yarım küredeki boylamlar çıkarılır; farklı yarım kürelerdeki boylamlar toplanır.",
          "Boylam farkı 4 dakika ile çarpılarak zaman farkı bulunur.",
          "İstenen merkez doğudaysa zaman farkı eklenir, batıdaysa çıkarılır.",
          "360° / 24 saat = 15° bir saat; 1° = 4 dakika kuralını verir.",
          "180° meridyeni tarih değiştirme çizgisinin temelidir; çizginin iki yanında tarih bir gün farklıdır.",
        ],
        examNote:
          "Kısa şifre: Doğu ileri, batı geri. Saat sorusunda enlem değil yalnız boylam farkı kullanılır.",
      },
      {
        id: "turkey-location",
        eyebrow: "TÜRKİYE UYGULAMASI",
        title: "Türkiye'nin enlem-boylam sonuçları",
        summary:
          "Türkiye Kuzey ve Doğu Yarım Küre'de, orta enlemlerde bulunur.",
        groups: [
          {
            title: "Enlem sonuçları",
            items: [
              "Güneş ışınları hiçbir zaman dik gelmez.",
              "Dört mevsim belirgin, batı rüzgârları ve cephe yağışları etkilidir.",
              "Güneyden kuzeye ışın açısı ve genel sıcaklık azalır; gölge uzar.",
              "Kuzey-güney kuş uçuşu uzaklık 666 km'dir.",
            ],
          },
          {
            title: "Boylam sonuçları",
            items: [
              "Doğu-batı arasında 19° boylam ve 76 dakika yerel saat farkı vardır.",
              "Başlangıç meridyenine göre yerel saati ileridir.",
              "Toprakları 2. ve 3. saat dilimlerindedir.",
              "MEBİ'ye göre 45° Doğu meridyeninin saati ulusal saat olarak kullanılır.",
            ],
          },
        ],
        examNote:
          "Türkiye'de batıdan doğuya yükselti artışı göreceli konum/yer şekli sonucudur; 76 dakikalık saat farkı boylam sonucudur.",
      },
      {
        id: "coordinate-traps",
        eyebrow: "KPSS AYIRICI NOTLAR",
        title: "Sık karıştırılanlar",
        summary:
          "Enlem ve boylam sorularında benzer görünen kavramları kesin çizgilerle ayır.",
        bullets: [
          "Aynı paralelde yerel saat aynı olmak zorunda değildir; aynı meridyende aynıdır.",
          "Boylam sıcaklık ve iklim kuşağını değil, yerel saat ve mutlak konumu etkiler.",
          "İki paralel arası uzaklık her yerde yaklaşık 111 km; iki meridyen arası uzaklık yalnız Ekvator'da yaklaşık 111 km'dir.",
          "Aynı meridyendeki noktaların Güneş'i aynı anda doğup batırması yalnız ekinoks tarihlerinde gerçekleşir.",
          "Başlangıç paraleli Ekvator, başlangıç meridyeni Greenwich'tir.",
        ],
        examNote:
          "Soruda saat varsa boylam; Güneş açısı, gölge, çizgisel hız veya gece-gündüz süresi varsa enlem düşün.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Koordinat sistemi ve paraleller, s. 19",
        url: MEBI_TYT_COORDINATES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Enlem, meridyen ve boylam, s. 20",
        url: MEBI_TYT_LATITUDE_LONGITUDE,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Yerel saat hesaplama, s. 21",
        url: MEBI_TYT_LOCAL_TIME,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'nin mutlak konumu, s. 23",
        url: MEBI_TYT_TURKEY_LOCATION,
      },
    ],
  },
  {
    id: "map-knowledge",
    subject: "Coğrafi beceriler",
    title: "Harita Bilgisi",
    description:
      "Haritanın unsurlarını, ölçek hesaplarını, büyük-küçük ölçek farkını ve izohips okuma kurallarını KPSS odaklı özetler.",
    status: "ready",
    quickFacts: [
      "Harita; kuş bakışı görünüşün ölçekle küçültülerek düzleme aktarılmasıdır.",
      "Ölçeğin paydası küçüldükçe ölçek büyür, ayrıntı artar ve gösterilen alan daralır.",
      "Gerçek uzunluk = Harita uzunluğu × Ölçeğin paydasıdır.",
      "İzohipsler eş yükselti eğrileridir; sıklaştıkları yerde eğim fazladır.",
    ],
    sections: [
      {
        id: "map-definition",
        eyebrow: "TEMEL KAVRAM",
        title: "Harita, kroki ve harita unsurları",
        summary:
          "Bir çizimin harita sayılması için kuş bakışı hazırlanması, ölçekle küçültülmesi ve düzleme aktarılması gerekir.",
        bullets: [
          "Kroki kuş bakışı çizilebilir ancak belirli bir ölçeği olmadığı için harita değildir.",
          "Başlık haritanın konusunu ve kapsadığı alanı belirtir.",
          "Lejant kullanılan renk, çizgi ve sembollerin anlamını açıklar.",
          "Koordinatlar konumu, yön oku kuzeyi, ölçek küçültme oranını gösterir.",
          "Ölçek, haritadaki uzunluğun gerçek uzunluğa oranıdır.",
        ],
        examNote:
          "Ölçeksiz çizim kroki; ölçek, kuş bakışı ve düzleme aktarım şartlarını birlikte taşıyan çizim haritadır.",
      },
      {
        id: "projections",
        eyebrow: "DÜZLEME AKTARMA",
        title: "Projeksiyon yöntemleri",
        summary:
          "Küresel yüzey düzleme aktarılırken bozulma kaçınılmazdır; uygun projeksiyon bozulmayı azaltır.",
        groups: [
          {
            title: "Silindirik",
            items: [
              "Ekvator ve çevresinde bozulma azdır.",
              "Kutuplara doğru alan bozulması artar.",
            ],
          },
          {
            title: "Konik",
            items: [
              "Orta enlemlerde bozulma azdır.",
              "Türkiye gibi doğu-batı yönünde uzanan orta enlem ülkelerinde uygundur.",
            ],
          },
          {
            title: "Düzlem",
            items: [
              "Kutup çevreleri ve dar alanlarda daha uygundur.",
              "Temas noktasından uzaklaştıkça bozulma artar.",
            ],
          },
        ],
        examNote:
          "Ekvator-silindir, orta kuşak-koni, kutuplar-düzlem eşleştirmesini bil.",
      },
      {
        id: "scale-types",
        eyebrow: "KÜÇÜLTME ORANI",
        title: "Kesir ve çizgi ölçek",
        summary:
          "Kesir ölçek sayısal oranla, çizgi ölçek ise eşit bölümlere ayrılmış doğruyla gösterilir.",
        bullets: [
          "1 / 500.000 ölçekte haritadaki 1 cm gerçekte 500.000 cm, yani 5 km'dir.",
          "Kesir ölçekte pay her zaman 1'dir; payda küçültme miktarını gösterir.",
          "Kesir ölçeği çizgi ölçeğe çevirirken santimetreyi kilometreye dönüştürmek için beş sıfır silinir.",
          "Çizgi ölçek fotokopiyle büyütülüp küçültüldüğünde oranını korur; kesir ölçek korumaz.",
          "Ölçek karşılaştırırken paydası küçük olan daha büyük ölçektir.",
        ],
        examNote:
          "1 cm = 10 km ise 10 km = 1.000.000 cm olduğundan kesir ölçek 1 / 1.000.000'dur.",
      },
      {
        id: "map-formulas",
        eyebrow: "HESAP KURALLARI",
        title: "Uzunluk ve alan hesapları",
        summary:
          "Bütün uzunluk işlemlerinde birimleri eşitle; alan işlemlerinde ölçek paydasının karesini kullan.",
        bullets: [
          "Gerçek Uzunluk = Harita Uzunluğu × Ölçeğin Paydası.",
          "Harita Uzunluğu = Gerçek Uzunluk / Ölçeğin Paydası.",
          "Ölçeğin Paydası = Gerçek Uzunluk / Harita Uzunluğu.",
          "Gerçek Alan = Harita Alanı × Ölçeğin Paydasının karesi.",
          "Uzunluk sorularında cm-km dönüşümünde 5 sıfır; alan sorularında cm²-km² dönüşümünde 10 sıfır vardır.",
        ],
        examNote:
          "İşleme başlamadan gerçek ve harita uzunluğunu aynı birime çevir; alan sorusunda paydayı kare almayı unutma.",
      },
      {
        id: "scale-comparison",
        eyebrow: "BÜYÜK - KÜÇÜK ÖLÇEK",
        title: "Ölçek değişince ne değişir?",
        summary:
          "Aynı boyuttaki kâğıtta büyük ölçek dar alanı ayrıntılı, küçük ölçek geniş alanı daha az ayrıntılı gösterir.",
        groups: [
          {
            title: "Büyük ölçekli harita",
            items: [
              "Payda küçük, ayrıntı ve doğruluk fazladır.",
              "Gösterilen alan ve küçültme oranı azdır.",
              "İzohipsler arası yükselti farkı küçüktür.",
            ],
          },
          {
            title: "Küçük ölçekli harita",
            items: [
              "Payda büyük, ayrıntı ve doğruluk azdır.",
              "Gösterilen alan ve küçültme oranı fazladır.",
              "Bozulma ve hata oranı daha fazladır.",
            ],
          },
        ],
        examNote:
          "Ölçeğin 'büyüklüğü' paydanın büyüklüğü değildir: 1/100.000, 1/1.000.000'dan daha büyük ölçektir.",
      },
      {
        id: "contour-rules",
        eyebrow: "İZOHİPS",
        title: "Eş yükselti eğrilerinin kuralları",
        summary:
          "İzohips, deniz seviyesine göre aynı yükseltideki noktaları birleştiren kapalı eğridir.",
        bullets: [
          "Aynı haritada ardışık izohipsler arasındaki yükselti farkı sabittir.",
          "İzohipsler birbirini kesmez; yalnız dik yamaçlarda çakışabilir.",
          "Kıyı çizgisi 0 metre izohipsidir.",
          "İzohipsler sık ise eğim fazla, seyrek ise eğim azdır.",
          "Kapalı eğrilerin içe doğru yükselmesi tepeyi, tarama veya eksi değerle alçalması çukuru gösterir.",
          "Akarsular izohipsleri yükseltinin azaldığı yöne doğru keser.",
        ],
        examNote:
          "İzohips sıklığı yükseltiyi değil eğimi gösterir; iki yer aynı yükseklikte olup farklı eğime sahip olabilir.",
      },
      {
        id: "contour-landforms",
        eyebrow: "ŞEKİL OKUMA",
        title: "İzohipste yer şekillerini tanıma",
        summary:
          "Eğrilerin yükselti yönüne yaptığı bükülme vadi ile sırtı ayırt ettirir.",
        bullets: [
          "Vadi çizgileri yükseltinin arttığı yöne, sırt çizgileri yükseltinin azaldığı yöne uzanır.",
          "Zirve, kapalı eğrilerin içindeki en yüksek noktadır; üçgen veya noktayla gösterilebilir.",
          "Boyun, iki tepe arasındaki alçak geçiş alanıdır.",
          "Falezde izohipsler kıyıda çok sıklaşır veya çakışır.",
          "Akarsu ağzında kıyı çizgisi denize doğru çıkıntı yapıyorsa delta; kara içine sokuluyorsa haliç düşünülebilir.",
          "CBS konuma bağlı verileri toplar ve analiz eder; uzaktan algılama yeryüzünü temas etmeden görüntüler.",
        ],
        examNote:
          "Vadi V'sinin sivri ucu kaynağa ve yüksek yere bakar; akarsu ters yönde, aşağıya doğru akar.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Harita, projeksiyon ve harita unsurları, s. 24",
        url: MEBI_TYT_MAP_BASICS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Ölçek ve harita hesaplamaları, s. 26",
        url: MEBI_TYT_MAP_CALCULATIONS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "İzohips kuralları ve yer şekilleri, s. 30",
        url: MEBI_TYT_CONTOURS,
      },
    ],
  },
  {
    id: "climate-knowledge",
    subject: "Fiziki coğrafya",
    title: "İklim Bilgisi",
    description:
      "Atmosferden sıcaklık ve basınca, nem-yağıştan dünya ile Türkiye iklimlerine kadar KPSS'nin temel neden-sonuç bağlarını toplar.",
    status: "ready",
    quickFacts: [
      "Hava durumu kısa süreli ve dar alanlı; iklim uzun yılların ortalamasıdır.",
      "Sıcaklık dağılışında enlem, yükselti, denizellik ve akıntılar temel belirleyicilerdir.",
      "Rüzgâr yüksek basınçtan alçak basınca eser; basınç farkı arttıkça hızlanır.",
      "Türkiye'de kıyılar daha ılıman, iç ve doğu kesimler daha karasal özellik gösterir.",
    ],
    sections: [
      {
        id: "atmosphere",
        eyebrow: "HAVA KÜRE",
        title: "Atmosfer, hava durumu ve iklim",
        summary:
          "Atmosfer Dünya'yı çevreleyen gaz örtüsüdür; hava olaylarının büyük bölümü en alt katman olan troposferde gerçekleşir.",
        bullets: [
          "Atmosferin yaklaşık %78'i azot, %21'i oksijen; kalanı diğer gazlardır.",
          "Troposfer atmosfer gazlarının yaklaşık %75'ini ve su buharının neredeyse tamamını içerir.",
          "Troposferde yükseldikçe sıcaklık genel olarak her 200 metrede yaklaşık 1 °C azalır.",
          "Stratosferdeki ozon tabakası zararlı morötesi ışınların büyük bölümünü tutar.",
          "Hava durumu kısa süreli ve dar alanlı; iklim en az 30 yıllık gözlemlerin genel karakteridir.",
        ],
        examNote:
          "Bir gün veya birkaç günlük olay hava durumu; uzun yıllar boyunca tekrarlanan özellik iklimdir.",
      },
      {
        id: "temperature",
        eyebrow: "ISI DAĞILIŞI",
        title: "Sıcaklığı etkileyen faktörler",
        summary:
          "Yeryüzündeki sıcaklık yalnız enleme bağlı değildir; özel konum koşulları düzenli dağılışı değiştirebilir.",
        groups: [
          {
            title: "Güneş'e bağlı",
            items: [
              "Işınların düşme açısı ve enlem",
              "Günlük-yıllık hareket ve aydınlanma süresi",
              "Atmosferde alınan yol ve tutulma oranı",
            ],
          },
          {
            title: "Yeryüzüne bağlı",
            items: [
              "Yükselti, eğim ve bakı",
              "Kara-deniz dağılışı ve nemlilik",
              "Okyanus akıntıları ile rüzgârlar",
              "Bitki örtüsü ve yüzeyin ışığı yansıtma özelliği",
            ],
          },
        ],
        examNote:
          "Aynı enlemde sıcaklık farklıysa önce yükselti, denizellik, akıntı ve rüzgârı kontrol et; bu fark enlemle açıklanamaz.",
      },
      {
        id: "pressure",
        eyebrow: "BASINÇ MERKEZLERİ",
        title: "Basınç ve basıncı etkileyenler",
        summary:
          "Atmosfer basıncı havanın ağırlığıdır; deniz seviyesinde 45° enlemde ve 15 °C'de normal basınç 1013 mb kabul edilir.",
        bullets: [
          "Yükselti arttıkça üzerimizdeki hava miktarı azaldığı için basınç düşer.",
          "Hava ısınınca genleşip yükselir ve termik alçak basınç; soğuyunca yoğunlaşıp çöker ve termik yüksek basınç oluşur.",
          "Alçak basınçta hava yükselici, hava genellikle bulutlu ve yağışlıdır.",
          "Yüksek basınçta hava alçalıcı, hava genellikle açık ve kuraktır.",
          "30° yüksek ve 60° alçak basınç kuşakları Dünya'nın günlük hareketiyle oluşan dinamik merkezlerdir.",
        ],
        examNote:
          "Ekvator alçak ve kutuplar yüksek basıncı termik; 30° yüksek ve 60° alçak basıncı dinamiktir.",
      },
      {
        id: "winds",
        eyebrow: "YATAY HAVA HAREKETİ",
        title: "Rüzgârların temel kuralları",
        summary:
          "Rüzgâr, yüksek basınç alanından alçak basınç alanına doğru hareket eden havadır.",
        bullets: [
          "Basınç farkı arttıkça ve merkezler arası uzaklık azaldıkça rüzgâr hızlanır.",
          "Yüzey sürtünmesi arttıkça rüzgârın hızı azalır.",
          "Dünya'nın dönüşü rüzgârları Kuzey Yarım Küre'de sağa, Güney'de sola saptırır.",
          "Sürekli rüzgârlar alize, batı ve kutup rüzgârlarıdır.",
          "Musonlar mevsimlik; meltemler günlük yön değiştiren devirli rüzgârlardır.",
          "Föhn, yamaçtan alçalırken ısınan ve kuruyan yerel rüzgârdır.",
        ],
        examNote:
          "Rüzgâr geldiği yönün adını alır: kuzeyden güneye esen rüzgâr kuzey rüzgârıdır.",
      },
      {
        id: "humidity",
        eyebrow: "SU BUHARI",
        title: "Nem, yoğuşma ve yağış",
        summary:
          "Havanın taşıyabileceği nem sıcaklığa bağlıdır; hava doygunluğa ulaştığında yoğuşma başlar.",
        bullets: [
          "Mutlak nem, bir metreküp havadaki gerçek su buharı miktarıdır.",
          "Maksimum nem sıcaklık arttıkça artar; sıcak hava daha fazla nem taşıyabilir.",
          "Bağıl nem, mutlak nemin maksimum neme oranıdır; %100 olduğunda hava doygundur.",
          "Sıcaklık düştükçe maksimum nem azalır, bağıl nem yükselir ve yoğuşma kolaylaşır.",
          "Yoğuşma yerde veya yere yakınsa sis; yüksekteyse bulut oluşur.",
          "Sıcaklık 0 °C'nin üzerindeyse çiy, altındaysa kırağı oluşabilir.",
        ],
        examNote:
          "Mutlak nem değişmese bile sıcaklık düşerse maksimum nem azalır ve bağıl nem artar.",
      },
      {
        id: "precipitation",
        eyebrow: "OLUŞUM BİÇİMİ",
        title: "Yağış türleri",
        summary:
          "Yağışın oluşması için nemli havanın yükselip soğuyarak doygunluğa ulaşması gerekir.",
        groups: [
          {
            title: "Yükselim (konveksiyonel)",
            items: [
              "Isınan havanın dikey yükselmesiyle oluşur.",
              "Ekvator'da yıl boyu, Türkiye içlerinde ilkbaharda kırkikindi yağışları biçiminde görülür.",
            ],
          },
          {
            title: "Yamaç (orografik)",
            items: [
              "Nemli havanın dağ yamacı boyunca yükselip soğumasıyla oluşur.",
              "Türkiye'de Karadeniz ve Akdeniz dağlarının denize bakan yamaçlarında yaygındır.",
            ],
          },
          {
            title: "Cephe (frontal)",
            items: [
              "Sıcak ve soğuk hava kütlelerinin karşılaşmasıyla oluşur.",
              "Orta kuşakta ve Türkiye'de, özellikle kış döneminde etkilidir.",
            ],
          },
        ],
        examNote:
          "Ekvator-konveksiyonel, dağın denize bakan yamacı-orografik, orta kuşak-kış dönemi-frontal eşleştirmesi önemlidir.",
      },
      {
        id: "world-climates",
        eyebrow: "DÜNYA İKLİMLERİ",
        title: "İklim tiplerini ayıran işaretler",
        summary:
          "Sıcaklık ve yağış rejimi doğal bitki örtüsünü belirler; iklim sorularında bu üç veri birlikte okunur.",
        groups: [
          {
            title: "Sıcak iklimler",
            items: [
              "Ekvatoral: yıl boyu sıcak ve yağışlı, yağmur ormanı.",
              "Savan: yaz yağışlı, kış kurak, uzun boylu otlar.",
              "Muson: yaz çok yağışlı, kış daha kurak, muson ormanları.",
              "Çöl: yağış çok az, günlük sıcaklık farkı fazla, kurakçıl bitkiler.",
            ],
          },
          {
            title: "Ilıman iklimler",
            items: [
              "Akdeniz: yaz sıcak-kurak, kış ılık-yağışlı, maki.",
              "Okyanusal: her mevsim yağışlı ve ılıman, geniş yapraklı orman.",
              "Karasal: yaz sıcak, kış soğuk, yıllık sıcaklık farkı fazla, bozkır.",
            ],
          },
          {
            title: "Soğuk iklimler",
            items: [
              "Tundra: kısa serin yaz, donmuş toprak, yosun ve cılız ot.",
              "Kutup: yıl boyu çok soğuk, kalıcı buz, bitki örtüsü yok.",
            ],
          },
        ],
        examNote:
          "Yağışın toplamından çok yıl içindeki dağılımına bak: yaz kuraklığı Akdeniz, yıl boyu yağış okyanusal, yaz yağışı savan/muson ipucudur.",
      },
      {
        id: "turkey-climate",
        eyebrow: "TÜRKİYE",
        title: "Türkiye'de iklim ve dağılışı",
        summary:
          "Türkiye'nin orta kuşakta olması genel çerçeveyi; denizler, yükselti ve dağların uzanışı kısa mesafedeki çeşitliliği oluşturur.",
        groups: [
          {
            title: "İklimi belirleyenler",
            items: [
              "Orta kuşak konumu; batı rüzgârları ve cephe yağışları.",
              "Üç tarafının denizlerle çevrili olması.",
              "Yükseltinin batıdan doğuya artması.",
              "Kuzey ve güney kıyılarında dağların kıyıya paralel uzanması.",
            ],
          },
          {
            title: "Başlıca iklimler",
            items: [
              "Akdeniz: yaz sıcak-kurak, kış ılık-yağışlı; maki.",
              "Karadeniz: her mevsim yağışlı, en fazla yağış sonbaharda; orman.",
              "Karasal: yaz sıcak-kurak, kış soğuk; ilkbahar yağışlı, bozkır.",
              "Sert karasal: Kuzeydoğu Anadolu'da uzun-soğuk kış, yaz yağışı ve çayır.",
            ],
          },
        ],
        examNote:
          "Karadeniz'de yağış en fazla sonbaharda; Akdeniz'de kışta; iç kesimlerde ilkbaharda; Kuzeydoğu Anadolu'da yazda görülür.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Atmosfer ve katmanları, s. 32",
        url: MEBI_TYT_ATMOSPHERE,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Sıcaklığı etkileyen faktörler, s. 34",
        url: MEBI_TYT_TEMPERATURE,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Basınç ve rüzgârlar, s. 36",
        url: MEBI_TYT_PRESSURE_WINDS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Nem, yoğuşma ve yağış, s. 39",
        url: MEBI_TYT_HUMIDITY,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dünya iklim tipleri, s. 42",
        url: MEBI_TYT_CLIMATE_TYPES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'de iklimi etkileyen faktörler, s. 45",
        url: MEBI_TYT_TURKEY_CLIMATE,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'nin iklim tipleri, s. 48",
        url: MEBI_TYT_TURKEY_CLIMATE_TYPES,
      },
    ],
  },
  {
    id: "landforms",
    subject: "Fiziki coğrafya",
    title: "Yer Şekillerinin Oluşumu",
    description:
      "İç ve dış kuvvetleri, kayaç etkisini ve aşındırma-biriktirme şekillerini KPSS'de gereken temel eşleştirmelerle özetler.",
    status: "ready",
    quickFacts: [
      "İç kuvvetler enerjisini Dünya'nın içinden alır ve ana reliefi oluşturur.",
      "Dış kuvvetler enerjisini Güneş'ten alır; aşındırır, taşır ve biriktirir.",
      "Orojenez, epirojenez, volkanizma ve deprem başlıca iç kuvvet süreçleridir.",
      "Akarsu, rüzgâr, buzul, yer altı suyu, dalga ve akıntılar başlıca dış kuvvetlerdir.",
    ],
    sections: [
      {
        id: "inner-external-framework",
        eyebrow: "ANA AYRIM",
        title: "İç kuvvetler ve dış kuvvetler",
        summary:
          "Yeryüzü, yapıcı iç kuvvetlerle aşındırıp dengeleyen dış kuvvetlerin birlikte çalışmasıyla sürekli değişir.",
        groups: [
          {
            title: "İç kuvvetler",
            items: [
              "Enerji kaynağı Dünya'nın içidir.",
              "Orojenez, epirojenez, volkanizma ve deprem bu gruptadır.",
              "Yükselme, çökme, kıvrılma ve kırılma gibi büyük reliefi oluşturur.",
            ],
          },
          {
            title: "Dış kuvvetler",
            items: [
              "Enerji kaynağı temel olarak Güneş'tir.",
              "Aşındırma, taşıma ve biriktirme yapar.",
              "Akarsu, rüzgâr, buzul, yer altı suyu, dalga ve akıntılardan oluşur.",
            ],
          },
        ],
        examNote:
          "İç kuvvetler yükselti farklarını artırma, dış kuvvetler genel olarak azaltma eğilimindedir.",
      },
      {
        id: "orogenesis-epirogenesis",
        eyebrow: "İÇ KUVVETLER",
        title: "Orojenez ve epirojenez",
        summary:
          "Orojenez yan basınçlarla dağ oluşturur; epirojenez geniş kara parçalarının dikey yönde yükselip alçalmasıdır.",
        bullets: [
          "Esnek tabakalar kıvrılır: yükselen kısım antiklinal, alçalan kısım senklinaldir.",
          "Sert tabakalar kırılır: yükselen blok horst, çöken blok grabendir; kırık hattı faydır.",
          "İzostatik denge bozulduğunda epirojenez gerçekleşir.",
          "Karanın alçalması deniz ilerlemesine (transgresyon), yükselmesi deniz gerilemesine (regresyon) yol açar.",
          "Kıyı taraçaları epirojenik yükselmenin önemli kanıtlarındandır.",
        ],
        examNote:
          "Antiklinal-senklinal kıvrılma; horst-graben kırılma; transgresyon-regresyon epirojenez eşleştirmesidir.",
      },
      {
        id: "volcanism-earthquakes",
        eyebrow: "İÇ KUVVETLER",
        title: "Volkanizma ve deprem",
        summary:
          "Magma yüzeye ulaştığında yüzey, yer kabuğu içinde kaldığında derinlik volkanizması oluşur.",
        groups: [
          {
            title: "Yüzey volkanizması",
            items: [
              "Krater: volkan konisinin tepesindeki patlama çukuru",
              "Kaldera: patlama veya çökmeyle genişlemiş krater",
              "Maar: volkanik gaz patlamasıyla oluşan çukur",
            ],
          },
          {
            title: "Derinlik volkanizması",
            items: [
              "Batolit: çok geniş, kubbe biçimli magma kütlesi",
              "Lakolit ve sill: tabakalar arasına sokulan magma",
              "Dayk: tabakaları kesen damar biçimli magma",
            ],
          },
          {
            title: "Deprem",
            items: [
              "İç merkez odağın bulunduğu yer, dış merkez yüzeyde en çok etkilenen yerdir.",
              "Tektonik depremler faylar boyunca oluşur ve en yaygın deprem türüdür.",
              "Pasifik, Atlantik ve Akdeniz-Himalaya başlıca deprem kuşaklarıdır.",
            ],
          },
        ],
        examNote:
          "Krater-kaldera-maar yüzeyde; batolit-lakolit-sill-dayk yer kabuğu içinde oluşur.",
      },
      {
        id: "rocks-landforms",
        eyebrow: "KAYAÇ ETKİSİ",
        title: "Kayaç yapısı yer şeklini nasıl değiştirir?",
        summary:
          "Kayaçların sertliği, çözünürlüğü ve oluşum biçimi arazinin aşınma hızını ve ortaya çıkan şekli belirler.",
        bullets: [
          "Sert ve dirençli kayaçlar daha dik; kolay aşınan kayaçlar daha düz ve az eğimli şekiller oluşturur.",
          "Tüflerin aşınması peribacalarını, granitin ayrışması tor topoğrafyasını oluşturabilir.",
          "Kalker, jips ve kaya tuzunun çözünmesi karstik şekilleri meydana getirir.",
          "Magmatik kayaçlar fosil içermez; tortul kayaçlar fosil içerebilir.",
          "Başkalaşım kayaçları yüksek sıcaklık ve basınçla değişime uğramış kayaçlardır.",
        ],
        examNote:
          "Kalker → mermer, kil taşı → şist, granit → gnays, kum taşı → kuvarsit temel başkalaşım eşleştirmeleridir.",
      },
      {
        id: "river-landforms",
        eyebrow: "DIŞ KUVVETLER",
        title: "Akarsuların oluşturduğu şekiller",
        summary:
          "Akarsu eğim ve hızın yüksek olduğu yerde aşındırır; hızının azaldığı yerde taşıdığı malzemeyi biriktirir.",
        groups: [
          {
            title: "Aşındırma şekilleri",
            items: [
              "Vadiler ve dev kazanı",
              "Kırgıbayır ve peribacaları",
              "Plato ve peneplen",
            ],
          },
          {
            title: "Yatak gelişimi",
            items: [
              "Mendereste dış bükey kıyı aşınır, iç bükey kıyıda birikim olur.",
              "Seki (taraça), akarsuyun yeniden yatağına gömülmesiyle yüksekte kalan eski vadi tabanıdır.",
            ],
          },
          {
            title: "Biriktirme ağırlıklı",
            items: [
              "Birikinti konisi ve yelpazesi",
              "Dağ eteği ve dağ içi ovası",
              "Taban seviyesi ovası ve delta",
              "Irmak adası",
            ],
          },
        ],
        examNote:
          "Akarsu denge profiline yaklaştıkça akış hızı, aşındırma gücü ve hidroelektrik enerji potansiyeli azalır.",
      },
      {
        id: "karst-landforms",
        eyebrow: "DIŞ KUVVETLER",
        title: "Karstik şekiller",
        summary:
          "Kalker, jips ve kaya tuzu gibi çözünebilen kayaçlarda yer altı ve yer üstü suları karst topoğrafyası oluşturur.",
        groups: [
          {
            title: "Aşındırma/çözünme",
            items: [
              "Lapya, dolin, uvala ve polye",
              "Mağara, düden, obruk ve kör vadi",
            ],
          },
          {
            title: "Biriktirme/çökelme",
            items: [
              "Sarkıt tavandan aşağı uzar.",
              "Dikit tabandan yukarı uzar.",
              "Birleşirlerse sütun oluşur.",
              "Yüzeydeki başlıca örnek travertendir.",
            ],
          },
        ],
        examNote:
          "Boyut sırası: lapya küçük oluk; dolin çanak; dolinler birleşirse uvala; daha geniş tabanı düz çukur polye.",
      },
      {
        id: "wind-glacier-landforms",
        eyebrow: "DIŞ KUVVETLER",
        title: "Rüzgâr ve buzul şekilleri",
        summary:
          "Rüzgâr kurak ve bitki örtüsü zayıf alanlarda; buzullar kalıcı kar sınırının üzerindeki yüksek ve soğuk alanlarda etkilidir.",
        groups: [
          {
            title: "Rüzgâr aşındırması",
            items: [
              "Mantar kaya",
              "Tafoni",
              "Yardang",
              "Hamada ve şahit kaya",
            ],
          },
          {
            title: "Buzul şekilleri",
            items: [
              "Sirk ve tekne (U) vadi aşındırma şeklidir.",
              "Hörgüç kaya aşındırma şeklidir.",
              "Moren buzul biriktirme şeklidir.",
            ],
          },
        ],
        examNote:
          "Rüzgâr için kuraklık ve seyrek bitki; buzul için yükselti/enlem ve düşük sıcaklık ana ipucudur.",
      },
      {
        id: "coastal-landforms",
        eyebrow: "DIŞ KUVVETLER",
        title: "Dalga ve akıntı şekilleri",
        summary:
          "Kıyı çabuk derinleşiyorsa aşındırma, sığ ve alçaksa biriktirme şekilleri daha kolay gelişir.",
        groups: [
          {
            title: "Aşındırma",
            items: [
              "Falez (yalıyar)",
              "Abrazyon platformu (aşınım düzlüğü)",
            ],
          },
          {
            title: "Biriktirme",
            items: [
              "Kıyı oku, kıyı kordonu ve kıyı seti",
              "Lagün ve tombolo",
              "Kumsal",
            ],
          },
        ],
        examNote:
          "Kordon koyun önünü kapatırsa lagün; kıyı oku adayı karaya bağlarsa tombolo oluşur.",
      },
      {
        id: "turkey-landforms",
        eyebrow: "TÜRKİYE UYGULAMASI",
        title: "Türkiye yer şekillerinde temel sonuçlar",
        summary:
          "Türkiye genç, yüksek ve engebeli bir ülkedir; yükselti genel olarak batıdan doğuya artar.",
        bullets: [
          "Ortalama yükselti 1.141 metredir; dağ, plato ve ovalar ana yer şekilleridir.",
          "Yüksek eğim nedeniyle akarsuların akış ve aşındırma gücü ile enerji potansiyeli genellikle fazladır.",
          "Karstik şekiller Toroslar, Güneybatı Anadolu ve Orta Anadolu'da yaygındır.",
          "Rüzgâr şekilleri Tuz Gölü güneyi, Konya-Karapınar, Iğdır ve Güneydoğu Anadolu'nun kurak kesimlerinde belirgindir.",
          "Karadeniz ve Akdeniz'de boyuna, Ege'de enine kıyı tipi dağların uzanışıyla ilişkilidir.",
        ],
        examNote:
          "Türkiye'de yükselti fazlalığı, engebe, kısa mesafede iklim değişimi ve ulaşım güçlüğü çoğu kez birlikte sorulur.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "İç kuvvetler ve orojenez, s. 62",
        url: MEBI_TYT_INNER_FORCES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Volkanizma ve deprem, s. 63",
        url: MEBI_TYT_VOLCANISM,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Kayaçlar ve yer şekilleri, s. 64",
        url: MEBI_TYT_ROCKS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dış kuvvetler, s. 65-75",
        url: MEBI_TYT_EXTERNAL_FORCES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Akarsu şekilleri, s. 67",
        url: MEBI_TYT_RIVERS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Karstik şekiller, s. 70",
        url: MEBI_TYT_KARST,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dalga ve akıntı şekilleri, s. 71",
        url: MEBI_TYT_COASTS,
      },
    ],
  },
  {
    id: "mountains",
    subject: "Türkiye'nin yer şekilleri",
    title: "Türkiye'nin Dağları",
    description:
      "MEBİ TYT konu özetleri ile MEB e-KPSS Coğrafya kitabının 55-56. sayfalarındaki sınıflandırma esas alınarak hazırlanmış seçici KPSS notları.",
    status: "ready",
    quickFacts: [
      "Ortalama yükselti 1.141 metredir; yükselti genel olarak batıdan doğuya artar.",
      "Dağların genel uzanış doğrultusu doğu-batıdır.",
      "Temel sınıflandırma: kıvrım, kırık (horst) ve volkanik dağlar.",
      "Kırık dağların en yoğun olduğu bölge Ege; volkanik dağların yoğunlaştığı alanlar Doğu ve İç Anadolu'dur.",
    ],
    sections: [
      {
        id: "mountains-framework",
        eyebrow: "ÖNCE ÇERÇEVEYİ KUR",
        title: "Türkiye arazisinin genel özellikleri",
        summary:
          "Dağ adlarını ezberlemeden önce Türkiye'nin yükselti ve uzanış düzenini bilmek gerekir.",
        bullets: [
          "Türkiye'nin ortalama yükseltisi 1.141 metredir.",
          "Yükselti kıyılardan iç kesimlere ve genel olarak batıdan doğuya doğru artar.",
          "Topoğrafya yüksek ve engebelidir; ana yer şekilleri dağ, ova ve platolardır.",
          "Yeryüzü şekilleri ve başlıca dağ kuşakları genel olarak doğu-batı doğrultusunda uzanır.",
        ],
        examNote:
          "Batıdan doğuya gidildikçe yükseltinin artması; sıcaklık, karasallık, tarım süresi ve ulaşım koşullarıyla birlikte yorumlanır.",
      },
      {
        id: "fold-mountains",
        eyebrow: "1. OLUŞUM GRUBU",
        title: "Kıvrım dağları",
        summary:
          "Tetis Denizi'ndeki tortulların Afrika ve Arabistan levhalarının Avrasya'ya doğru hareketiyle sıkışıp yükselmesi sonucunda oluşmuştur.",
        bullets: [
          "Türkiye'nin genç kıvrım dağları Alp-Himalaya dağ sistemi içindedir.",
          "İki ana kuşak Kuzey Anadolu Dağları ve Toros Dağlarıdır.",
          "Sündiken, Elmadağ, Munzur ve Mercan dağları MEBİ'nin verdiği iç kesim kıvrım dağı örnekleridir.",
        ],
        groups: [
          {
            title: "Kuzey Anadolu kuşağı",
            items: [
              "Küre, Bolu, Köroğlu ve Ilgaz",
              "Canik, Giresun ve Rize dağları",
              "Kaçkar, Mescit, Kop ve Yalnızçam dağları",
            ],
          },
          {
            title: "Toros kuşağı",
            items: [
              "Sultan, Bey, Geyik, Aladağ ve Bolkar dağları",
              "Binboğa ve Tahtalı dağları",
            ],
          },
          {
            title: "İç ve doğu kesimler",
            items: [
              "Elmadağ, Akdağlar, Deveci ve Tecer dağları",
              "Munzur (Mercan), Bingöl, Palandöken, Allahuekber ve Aras Güneyi dağları",
            ],
          },
        ],
        examNote:
          "Kuzey Anadolu Dağları ile Toroslar birlikte verilirse ortak özellikleri genç kıvrım dağı ve Alp-Himalaya sistemine bağlı olmalarıdır.",
      },
      {
        id: "fault-block-mountains",
        eyebrow: "2. OLUŞUM GRUBU",
        title: "Kırık dağlar: horst-graben sistemi",
        summary:
          "Esnekliğini kaybetmiş kütleler kırıldığında yüksekte kalan blok horst, çöken blok graben olur; aralarında fay hatları bulunur.",
        bullets: [
          "Kırık dağların Türkiye'de en yoğun görüldüğü yer Ege Bölgesi'dir.",
          "Ege'deki horstlar kuzeyden güneye Kaz, Madra, Yunt, Bozdağlar, Aydın ve Menteşe (Muğla) dağlarıdır.",
          "Bu horstların arasındaki Bakırçay, Gediz, Küçük Menderes ve Büyük Menderes çöküntü alanları başlıca grabenlerdir.",
          "Akdeniz'de Çukurova ile Hatay arasındaki Nur (Amanos) Dağları da kırık dağ örneğidir.",
        ],
        examNote:
          "Ege sıralamasını kuzeyden güneye çalış: Kaz - Madra - Yunt - Bozdağlar - Aydın - Menteşe.",
      },
      {
        id: "volcanic-mountains",
        eyebrow: "3. OLUŞUM GRUBU",
        title: "Volkanik dağlar",
        summary:
          "Türkiye'deki volkanik şekillerin önemli bölümü Senozoyik'teki, eski adlandırmayla III ve IV. jeolojik zamanlardaki faaliyetlerle oluşmuştur.",
        bullets: [
          "Volkanik dağlar en çok Doğu Anadolu ve İç Anadolu'da toplanır.",
          "MEB e-KPSS kitabına göre Türkiye'de aktif yanardağ yoktur.",
          "Nemrut'ta kaldera, Kula çevresinde küçük volkan konileri ve Meke'de maar bulunması volkanizmanın farklı izleridir.",
        ],
        groups: [
          {
            title: "İç Anadolu",
            items: [
              "Erciyes, Melendiz, Hasan Dağı ve Karadağ",
              "İç Anadolu'daki Karacadağ",
            ],
          },
          {
            title: "Doğu Anadolu",
            items: [
              "Büyük Ağrı, Küçük Ağrı ve Tendürek",
              "Süphan ve Nemrut",
            ],
          },
          {
            title: "Güneydoğu ve Ege",
            items: [
              "Güneydoğu Anadolu'da Karacadağ",
              "Ege'de Kula kül konileri (devlitler)",
            ],
          },
        ],
        examNote:
          "Karacadağ adı iki ayrı volkanik sahada geçer: İç Anadolu'da Karaman-Konya çevresi ve Güneydoğu Anadolu'da Diyarbakır-Şanlıurfa çevresi.",
      },
      {
        id: "mountain-direction",
        eyebrow: "HARİTA YORUMU",
        title: "Dağların uzanışı ve kıyıya etkisi",
        summary:
          "Dağların kıyıya göre uzanışı yalnız yer şekillerini değil, kıyı tipini ve kıyı-iç kesim bağlantısını da belirler.",
        bullets: [
          "Karadeniz ve Akdeniz'de dağlar kıyıya paralel uzanır; boyuna kıyı tipi görülür.",
          "Paralel uzanış kıta sahanlığını daraltır, kıyının girinti-çıkıntısını azaltır ve kıyı ile iç kesimler arasındaki ulaşımı zorlaştırır.",
          "Ege'de dağlar kıyıya dik uzanır; enine kıyı tipi, geniş kıta sahanlığı ve girintili-çıkıntılı kıyılar görülür.",
          "Ege grabenleri ulaşımı ve deniz etkisinin iç kesimlere sokulmasını kolaylaştırır.",
        ],
        examNote:
          "Soruda kıyı tipi, ulaşım, liman hinterlandı veya deniz etkisi birlikte veriliyorsa önce dağların kıyıya paralel mi dik mi uzandığını belirle.",
      },
      {
        id: "mountain-glaciers",
        eyebrow: "YÜKSEK DAĞLAR",
        title: "Buzul şekilleriyle birlikte anılan dağlar",
        summary:
          "MEBİ, Türkiye'de kalıcı kar sınırının 3.200-4.000 metre arasında değiştiğini ve iç kesimlerde genel olarak daha yüksek olduğunu belirtir.",
        bullets: [
          "Süphan, Erciyes, Kaçkar, Buzul, Aladağ ve Sat dağlarının yükseklerinde sirk ve vadi buzulu şekilleri görülür.",
          "Ağrı Dağı'nda takke buzulu bulunur.",
          "Yüksek dağlarda sirk, buzul vadisi ve moren başlıca buzul şekilleridir.",
        ],
        examNote:
          "Ağrı Dağı'nı takke buzulu; diğer yüksek dağ örneklerini sirk ve vadi buzulu ile eşleştir.",
      },
      {
        id: "mountain-confusions",
        eyebrow: "KPSS AYIRICI NOTLAR",
        title: "Sık karıştırılanlar",
        summary:
          "Benzer adları ve farklı oluşum gruplarını birbirinden ayıran kısa tekrar listesi.",
        groups: [
          {
            title: "Ad benzerlikleri",
            items: [
              "Bitlis'teki Nemrut volkanik dağdır; Adıyaman'daki Nemrut tarihî ve turistik alandır.",
              "Nur Dağları ile Amanos Dağları aynı sıranın iki adıdır.",
              "Menteşe Dağları, Muğla Dağları adıyla da verilebilir.",
            ],
          },
          {
            title: "Oluşum ayrımları",
            items: [
              "Kaçkar kıvrım; Ağrı volkanik; Aydın kırık dağdır.",
              "Yıldız (Istranca) Dağları genç Alp kıvrımı değil, eski masif arazi örneğidir.",
            ],
          },
        ],
        examNote:
          "Bir dağı yalnız bulunduğu bölgeyle değil, oluşum türü ve varsa ikinci adıyla birlikte öğren.",
      },
    ],
    sources: [
      {
        label: "MEB e-KPSS Coğrafya kitabı",
        detail: "Türkiye'de başlıca yüzey şekilleri, s. 55-56",
        url: MEB_EKPSS_GEOGRAPHY_BOOK,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "İç kuvvetler, orojenez ve volkanizma, s. 73",
        url: MEBI_TYT_TURKEY_INNER_FORCES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Buzulların oluşturduğu yer şekilleri, s. 75",
        url: MEBI_TYT_GLACIERS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'nin ana yer şekilleri ve dağları, s. 76",
        url: MEBI_TYT_MAIN_LANDFORMS,
      },
    ],
  },
  {
    id: "water-resources",
    subject: "Doğal sistemler",
    title: "Su Kaynakları",
    description:
      "Su döngüsü, akarsu kavramları ve Türkiye'nin deniz-göl-akarsu özellikleri için kısa KPSS özeti.",
    status: "ready",
    quickFacts: [
      "Sularını denize ulaştıran havza açık, ulaştıramayan havza kapalıdır.",
      "Debi akarsuyun su miktarı; rejim debinin yıl içindeki değişimidir.",
      "Türkiye akarsuları genellikle kısa, eğimli, düzensiz rejimli ve enerji potansiyeli yüksektir.",
    ],
    sections: [
      {
        id: "water-cycle",
        eyebrow: "TEMEL ÇERÇEVE",
        title: "Dünya'nın su varlığı",
        summary:
          "Yeryüzünün yaklaşık %71'i sularla kaplıdır; kullanılabilir tatlı su bunun çok küçük bir bölümüdür.",
        bullets: [
          "Buharlaşma, yoğuşma, yağış ve yüzey-altı akış su döngüsünü oluşturur.",
          "Okyanusların ortalama tuzluluğu yaklaşık ‰35'tir.",
          "Gelgit, Ay'ın çekimine; dalga çoğunlukla rüzgâra bağlıdır.",
        ],
        examNote:
          "Su yenilenebilir olsa da kullanılabilir tatlı su sınırlıdır; kirlenme ve aşırı tüketim su kıtlığını artırır.",
      },
      {
        id: "river-concepts",
        eyebrow: "AKARSU KAVRAMLARI",
        title: "Havza, debi ve rejim",
        summary:
          "Akarsuyun bütün kollarıyla sularını topladığı alan havzadır.",
        bullets: [
          "Açık havza deniz veya okyanusa ulaşır; kapalı havza ulaşamaz.",
          "Debi, yatağın bir kesitinden birim zamanda geçen su miktarıdır.",
          "Debi yıl içinde az değişiyorsa düzenli, çok değişiyorsa düzensiz rejim görülür.",
          "Havzaları ayıran yüksek sınıra su bölümü çizgisi denir.",
        ],
        examNote:
          "Havza denize çıkışla, rejim ise yıl içindeki akım değişimiyle ilgilidir; ikisini karıştırma.",
      },
      {
        id: "turkey-water",
        eyebrow: "TÜRKİYE",
        title: "Türkiye'nin başlıca su özellikleri",
        summary:
          "Türkiye'nin genç ve engebeli yapısı akarsuların eğimini artırır; iklim çeşitliliği rejimleri düzensizleştirir.",
        bullets: [
          "Akarsuların boyları genellikle kısa, yatak eğimleri ve hidroelektrik potansiyelleri yüksektir; ulaşıma elverişli değildir.",
          "Karadeniz, Marmara, Ege, Akdeniz ve Basra havzaları açık; Tuz, Van ve Göller Yöresi havzaları kapalıdır.",
          "Van en büyük göl ve sodalı; Tuz Gölü tektonik ve tuzlu; Beyşehir en büyük tatlı su gölüdür.",
          "Ege kıyıları girintili-çıkıntılı ve doğal limanca zengin; Karadeniz kıyıları daha sadedir.",
        ],
        examNote:
          "Türkiye'de rejimi en düzenli akarsular Karadeniz'de olsa da ülke akarsularının genel özelliği düzensiz rejimdir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Dünyada su kaynakları, s. 77-79",
        url: MEBI_TYT_WORLD_WATER,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Akarsu havzası, debi ve rejim, s. 79",
        url: MEBI_TYT_RIVER_BASINS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'de denizler, göller ve akarsular, s. 81-82",
        url: MEBI_TYT_TURKEY_WATER,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye akarsularının özellikleri, s. 82",
        url: MEBI_TYT_TURKEY_RIVERS,
      },
    ],
  },
  {
    id: "soils",
    subject: "Doğal sistemler",
    title: "Topraklar",
    description:
      "Toprak oluşumu, ana toprak grupları ve Türkiye'deki önemli toprak-ürün eşleştirmeleri.",
    status: "ready",
    quickFacts: [
      "Fiziksel ayrışma kurak-soğuk; kimyasal çözünme sıcak-nemli bölgelerde güçlüdür.",
      "Zonal toprakta iklim, intrazonalde ana kaya, azonalde taşıma etkilidir.",
      "Alüvyal toprak taşınmış, genç, horizonsuz ve genellikle verimlidir.",
    ],
    sections: [
      {
        id: "soil-formation",
        eyebrow: "OLUŞUM",
        title: "Toprağı oluşturan faktörler",
        summary:
          "Toprak; kayaçların ayrışması, canlı kalıntıları ve uzun zamanın ortak etkisiyle oluşur.",
        bullets: [
          "İklim; ayrışma türünü, oluşum hızını, yıkanmayı ve humus miktarını belirler.",
          "A horizonu yıkanma ve humus, B birikme, C ayrışmış ana materyal katıdır.",
          "Eğim arttıkça erozyon artar ve toprağın kalınlaşması zorlaşır.",
        ],
        examNote:
          "A en verimli üst kat; B yukarıdan taşınan minerallerin biriktiği kattır.",
      },
      {
        id: "soil-groups",
        eyebrow: "SINIFLANDIRMA",
        title: "Zonal, intrazonal ve azonal",
        summary:
          "Toprağın oluşumunda baskın faktör, ait olduğu ana grubu belirler.",
        bullets: [
          "Zonal: iklim ve bitki örtüsünü yansıtır; horizonları gelişmiştir.",
          "İntrazonal: ana materyal veya taban suyu etkilidir; halomorfik, hidromorfik ve kalsimorfik örnektir.",
          "Azonal: akarsu, rüzgâr, buzul veya yer çekimiyle taşınır; horizonları gelişmemiştir.",
          "Alüvyal, lös, moren, kolüvyal, litosol ve regosol azonal gruptadır.",
        ],
        examNote:
          "Taşınmış deniyorsa azonal; tuzlu-batak-kireçli özel ortam deniyorsa intrazonal düşün.",
      },
      {
        id: "turkey-soils",
        eyebrow: "TÜRKİYE EŞLEŞTİRMELERİ",
        title: "Toprak, bölge ve ürün",
        summary:
          "Türkiye'nin iklim ve yer şekli çeşitliliği toprak çeşitliliğini artırmıştır.",
        bullets: [
          "Terra rossa Akdeniz'de kalker üzerinde; zeytin ve turunçgil üretim alanlarında görülür.",
          "Kahverengi step toprakları İç Anadolu ve Güneydoğu'da tahıllarla birlikte anılır.",
          "Çernezyom Erzurum-Kars çevresinde humuslu ve verimlidir; çayırlarla kaplıdır.",
          "Alüvyal topraklar delta ve taban ovalarında yoğun tarım için elverişlidir.",
        ],
        examNote:
          "En verimli toprak her zaman çernezyom değildir; taşınmış alüvyaller mineralce zengin ve tarımda çok önemlidir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Toprak oluşumu ve horizonlar, s. 84",
        url: MEBI_TYT_SOILS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "İntrazonal ve azonal topraklar, s. 86",
        url: MEBI_TYT_TURKEY_SOILS,
      },
    ],
  },
  {
    id: "vegetation",
    subject: "Doğal sistemler",
    title: "Bitki Örtüsü",
    description:
      "Bitkilerin dağılış nedenleri, temel formasyonlar ve Türkiye'deki orman-çalı-ot toplulukları.",
    status: "ready",
    quickFacts: [
      "Doğal bitki örtüsünü belirleyen en önemli faktör iklimdir.",
      "Maki Akdeniz, psödomaki Karadeniz, bozkır iç bölgelerle eşleştirilir.",
      "Endemik bitki dar bir alanda; kozmopolit bitki geniş alanlarda yaşar.",
    ],
    sections: [
      {
        id: "plant-factors",
        eyebrow: "DAĞILIŞ",
        title: "Bitki örtüsünü etkileyenler",
        summary:
          "Sıcaklık ve yağış başta olmak üzere yer şekilleri, toprak, canlılar ve insan etkisi dağılışı belirler.",
        bullets: [
          "Sıcak-nemli alanlarda bitkiler gür; kurak ve soğuk alanlarda seyrektir.",
          "Yükselti arttıkça bitki kuşakları sıcaklık değişimine bağlı olarak değişir.",
          "İnsanların aşırı otlatma, tarla açma ve yangınları doğal örtüyü bozar.",
        ],
        examNote:
          "Bitki örtüsü iklimin göstergesidir; ancak tahrip edilmiş sahalarda doğal değil antropojen topluluk görülebilir.",
      },
      {
        id: "plant-formations",
        eyebrow: "FORMASYONLAR",
        title: "Ağaç, çalı ve ot toplulukları",
        summary:
          "Bitkiler görünüşlerine göre ağaç, çalı ve ot formasyonları içinde incelenir.",
        bullets: [
          "Ekvatoral yağmur, muson, tayga ve karma ormanlar ağaç formasyonudur.",
          "Maki ve garig Akdeniz; psödomaki nemli ılıman kıyıların çalı topluluğudur.",
          "Savan yaz yağışlı; step yarı kurak; çayır yaz yağışlı-serin alanların ot topluluğudur.",
          "Tundra kısa yazda yeşeren yosun-ot; çöl bitkileri kurakçıl türlerdir.",
        ],
        examNote:
          "Step kısa ve seyrek; çayır uzun ve gür ottur. Küçükbaş-step, büyükbaş-çayır bağlantısı kur.",
      },
      {
        id: "turkey-vegetation",
        eyebrow: "TÜRKİYE",
        title: "Türkiye'de doğal bitki örtüsü",
        summary:
          "Türkiye'de kıyıdan içeriye ve yükseltiye bağlı olarak orman, çalı ve ot toplulukları değişir.",
        bullets: [
          "Karadeniz kıyıları orman; yüksek kesimler iğne yapraklı ve alpin çayırlıdır.",
          "Akdeniz'de kızılçamın tahribiyle maki, makinin tahribiyle garig oluşur.",
          "İç Anadolu ve Güneydoğu'da bozkır; Erzurum-Kars'ta yaz yağışlarıyla çayır yaygındır.",
          "Türkiye'de ormanların en yoğun olduğu bölge Karadeniz, en az olduğu bölge Güneydoğu Anadolu'dur.",
        ],
        examNote:
          "Maki doğal çalı formasyonu olsa da çoğu yerde kızılçam ormanlarının tahribiyle genişlemiştir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Bitki toplulukları ve dağılışı, s. 88",
        url: MEBI_TYT_PLANTS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'de bitki toplulukları, s. 90",
        url: MEBI_TYT_TURKEY_PLANTS,
      },
    ],
  },
  {
    id: "population-basics",
    subject: "Beşerî sistemler",
    title: "Nüfusun Özellikleri",
    description:
      "Nüfus artışı, yaş-cinsiyet yapısı ve gelişmişlik yorumlarında kullanılan temel göstergeler.",
    status: "ready",
    quickFacts: [
      "Doğal artış doğum-ölüm; gerçek artış doğum, ölüm ve göç birlikte hesaplanır.",
      "0-14 ve 65+ yaş grupları bağımlı nüfus kabul edilir.",
      "Gelişmiş ülkelerde doğum düşük, yaşam süresi ve yaşlı nüfus oranı yüksektir.",
    ],
    sections: [
      {
        id: "population-growth",
        eyebrow: "TEMEL KAVRAM",
        title: "Nüfus artışı",
        summary:
          "Belirli bir zamanda sınırları belli alanda yaşayan insan sayısı nüfustur; nüfus bilimi demografidir.",
        bullets: [
          "Doğal artış = doğumlar - ölümler.",
          "Gerçek artış = doğumlar + gelen göç - ölümler - giden göç.",
          "Doğal artış yüksekken göç nedeniyle gerçek nüfus azalabilir.",
        ],
        examNote:
          "Göç hesaba katılmışsa gerçek artış, yalnız doğum ve ölüm verilmişse doğal artış aranır.",
      },
      {
        id: "population-structure",
        eyebrow: "YAPISAL ÖZELLİKLER",
        title: "Yaş, cinsiyet ve bağımlılık",
        summary:
          "Nüfusun yaş grupları ve cinsiyet yapısı iş gücü ile sosyal ihtiyaçları gösterir.",
        bullets: [
          "0-14 genç, 15-64 çalışma çağında, 65 ve üzeri yaşlı nüfustur.",
          "Genç ve yaşlı nüfusun çalışma çağındaki nüfusa oranı bağımlılık oranını verir.",
          "Göç alan yerde çoğunlukla erkek, göç veren yerde kadın oranı artabilir.",
        ],
        examNote:
          "Çocuk nüfus fazlaysa eğitim; yaşlı nüfus fazlaysa sağlık ve sosyal güvenlik yatırımı ihtiyacı artar.",
      },
      {
        id: "development-population",
        eyebrow: "GELİŞMİŞLİK YORUMU",
        title: "Nüfustan ülke yorumu",
        summary:
          "Doğum, ölüm, yaşam süresi ve çalışanların sektörlere dağılışı gelişmişlik hakkında ipucu verir.",
        bullets: [
          "Tarımda çalışan oranının yüksekliği genellikle az gelişmişliği gösterir.",
          "Hizmet ve sanayide çalışan oranı geliştikçe tarımın payı azalır.",
          "Bebek ölümünün düşük, yaşam süresi ve eğitim düzeyinin yüksek olması gelişmişlik göstergesidir.",
        ],
        examNote:
          "Toplam nüfusun fazla olması tek başına gelişmişlik göstergesi değildir; nüfusun niteliği ve sektör yapısı önemlidir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Nüfusun özellikleri ve gelişimi, s. 92-95",
        url: MEBI_TYT_POPULATION,
      },
    ],
  },
  {
    id: "population-distribution",
    subject: "Beşerî sistemler",
    title: "Nüfus Dağılışı ve Piramitler",
    description:
      "Nüfusun dağılış nedenleri, yoğunluk türleri ve piramitlerin hızlı yorumlanması.",
    status: "ready",
    quickFacts: [
      "Nüfus; ılıman, düz, verimli ve ekonomik imkânı gelişmiş alanlarda yoğunlaşır.",
      "Aritmetik yoğunluk toplam nüfusun yüz ölçümüne bölünmesidir.",
      "Piramidin geniş tabanı yüksek doğumu, geniş üstü yaşlı nüfusu gösterir.",
    ],
    sections: [
      {
        id: "population-factors",
        eyebrow: "DAĞILIŞ",
        title: "Nüfus neden eşit dağılmaz?",
        summary:
          "İklim, yer şekilleri, su ve toprak doğal; sanayi, ulaşım, turizm ve göç beşerî etkenlerdir.",
        bullets: [
          "Aşırı sıcak, soğuk, kurak, dağlık ve batak alanlar seyrek nüfusludur.",
          "Verimli ovalar, kıyılar, sanayi-ticaret merkezleri ve ulaşım kavşakları yoğundur.",
          "Maden bulunan yerde nüfus, maden tükendiğinde azalabilir.",
        ],
        examNote:
          "Bir yerde doğal koşullar elverişsizken nüfus yoğunsa sanayi, madencilik veya ulaşım gibi beşerî neden ara.",
      },
      {
        id: "population-density",
        eyebrow: "YOĞUNLUK",
        title: "Üç nüfus yoğunluğu",
        summary:
          "Yoğunluk türlerinde payda değiştiği için her biri farklı bir baskıyı ölçer.",
        bullets: [
          "Aritmetik yoğunluk = Toplam nüfus / Toplam alan.",
          "Fizyolojik yoğunluk = Toplam nüfus / Tarım alanı.",
          "Tarımsal yoğunluk = Tarımla uğraşan nüfus / Tarım alanı.",
        ],
        examNote:
          "Tarım alanı dar ülkelerde fizyolojik yoğunluk yüksek olabilir; bu değer tarım toprağı üzerindeki nüfus baskısını gösterir.",
      },
      {
        id: "population-pyramids",
        eyebrow: "PİRAMİT OKUMA",
        title: "Şekilden hızlı yorum",
        summary:
          "Nüfus piramidi yaş ve cinsiyet yapısını gösterir; tek başına toplam nüfus miktarını göstermez.",
        bullets: [
          "Düzgün üçgen: yüksek doğum, hızlı artış, genç nüfus.",
          "Arı kovanı: düşük doğum-ölüm, uzun yaşam, gelişmiş ülke.",
          "Tabanın daralması doğumların azaldığını; üst kısmın genişlemesi yaşlanmayı gösterir.",
          "Bir yaş grubundaki belirgin girinti savaş, göç veya salgın etkisi olabilir.",
        ],
        examNote:
          "Piramidin alan büyüklüğüne değil biçimine bak; aynı biçimde iki ülkenin toplam nüfusu farklı olabilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Nüfusun dağılışı ve yoğunluğu, s. 96-97",
        url: MEBI_TYT_POPULATION_DISTRIBUTION,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Nüfus piramitleri, s. 98",
        url: MEBI_TYT_POPULATION_PYRAMIDS,
      },
    ],
  },
  {
    id: "turkey-population",
    subject: "Türkiye beşerî coğrafyası",
    title: "Türkiye Nüfusu",
    description:
      "Türkiye'de nüfusun tarihsel gelişimi, dağılışı ve yapısındaki temel değişimler.",
    status: "ready",
    quickFacts: [
      "Cumhuriyet döneminin ilk nüfus sayımı 1927'de yapılmıştır.",
      "2007'de Adrese Dayalı Nüfus Kayıt Sistemi'ne geçilmiştir.",
      "Nüfus kıyı, ova ve sanayi merkezlerinde yoğun; yüksek ve engebeli alanlarda seyrektir.",
    ],
    sections: [
      {
        id: "turkey-population-history",
        eyebrow: "TARİHSEL GELİŞİM",
        title: "Sayım ve artış dönemleri",
        summary:
          "Türkiye nüfusu Cumhuriyet boyunca artmış, ancak artış hızı dönemlere göre değişmiştir.",
        bullets: [
          "İlk modern sayım 1927; ADNKS başlangıcı 2007'dir.",
          "1940-1945'te savaş koşulları nedeniyle artış hızı düşmüştür.",
          "1955-1960 dönemi artış hızının en yüksek olduğu dönemlerdendir.",
          "Günümüzde doğurganlık azalırken ortanca yaş ve yaşlı nüfus payı artmaktadır.",
        ],
        examNote:
          "Nüfus miktarının artması ile nüfus artış hızının düşmesi aynı anda gerçekleşebilir.",
      },
      {
        id: "turkey-population-map",
        eyebrow: "DAĞILIŞ",
        title: "Sık ve seyrek nüfuslu yerler",
        summary:
          "Türkiye'de sanayi, hizmet ve verimli ovalar nüfusu toplarken engebe ve sert iklim nüfusu azaltır.",
        bullets: [
          "Çatalca-Kocaeli, Bursa, İzmir, Ankara, Antalya ve Çukurova çevresi sık nüfusludur.",
          "Tuz Gölü, Menteşe, Taşeli, Hakkâri ve Erzurum-Kars çevresi seyrektir.",
          "Doğu Karadeniz kıyısı sıkken dağlık iç kesimleri seyrektir.",
        ],
        examNote:
          "İstanbul'un yoğunluğu iklimle değil sanayi, ticaret, ulaşım ve göçle açıklanır.",
      },
      {
        id: "turkey-population-structure",
        eyebrow: "YAPISAL DEĞİŞİM",
        title: "Kentleşme ve yaşlanma",
        summary:
          "Köyden kente göç ve hizmet-sanayi sektörlerinin büyümesi Türkiye'nin nüfus yapısını değiştirmiştir.",
        bullets: [
          "1950 sonrasında kentlere göç hızlanmış, kentsel nüfus oranı yükselmiştir.",
          "Tarımda çalışanların oranı azalırken hizmet sektörünün payı artmıştır.",
          "Doğum oranının düşmesi tabanı daraltmış, yaşam süresinin uzaması yaşlı nüfusu artırmıştır.",
        ],
        examNote:
          "Kent nüfusunun artması her zaman doğal artış değildir; iç göç temel neden olabilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye nüfusunun gelişimi, s. 99",
        url: MEBI_TYT_TURKEY_POPULATION,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'de nüfusun dağılışı, s. 100",
        url: MEBI_TYT_TURKEY_POPULATION_DISTRIBUTION,
      },
    ],
  },
  {
    id: "migration",
    subject: "Beşerî sistemler",
    title: "Göçler",
    description:
      "Göç türleri, itici-çekici nedenler ve Türkiye'deki iç göçün temel sonuçları.",
    status: "ready",
    quickFacts: [
      "Göç; süreye göre sürekli-geçici, sınıra göre iç-dış, isteğe göre gönüllü-zorunludur.",
      "İşsizlik itici, iş imkânı çekici faktördür.",
      "Türkiye'de 1950'den sonra köyden kente göç hızlanmıştır.",
    ],
    sections: [
      {
        id: "migration-types",
        eyebrow: "SINIFLANDIRMA",
        title: "Göç türleri",
        summary:
          "İnsanların yaşadığı yeri geçici veya kalıcı biçimde değiştirmesi göçtür.",
        bullets: [
          "İç göç ülke sınırları içinde, dış göç ülkeler arasında gerçekleşir.",
          "Mevsimlik göçte kişi geri döner; sürekli göçte yerleşim kalıcı değişir.",
          "Mübadele, savaş ve afet göçleri zorunlu; iş ve eğitim göçleri çoğunlukla gönüllüdür.",
          "Nitelikli iş gücünün gelişmiş ülkeye gitmesi beyin göçüdür.",
        ],
        examNote:
          "Yaylacılık ve mevsimlik tarım işçiliği geçici iç göç; mübadele zorunlu dış göçtür.",
      },
      {
        id: "migration-causes",
        eyebrow: "İTİCİ - ÇEKİCİ",
        title: "Göçün nedenleri",
        summary:
          "Ekonomik nedenler en yaygın olmakla birlikte doğal, siyasi ve sosyal nedenler de göç oluşturur.",
        bullets: [
          "İşsizlik, düşük gelir, savaş, kuraklık ve yetersiz hizmetler iticidir.",
          "İş, yüksek gelir, güvenlik, eğitim ve sağlık imkânları çekicidir.",
          "Deprem, sel, heyelan ve çölleşme geçici veya sürekli göçe yol açabilir.",
        ],
        examNote:
          "İtici faktör çıkılan yere, çekici faktör gidilen yere aittir.",
      },
      {
        id: "turkey-migration",
        eyebrow: "TÜRKİYE",
        title: "İç göç ve sonuçları",
        summary:
          "Türkiye'de göçün ana yönü uzun süre doğudan batıya ve kırsaldan büyük kentlere olmuştur.",
        bullets: [
          "İstanbul, Ankara, İzmir, Bursa, Kocaeli ve Antalya önemli göç merkezleridir.",
          "Hızlı göç; plansız kentleşme, altyapı, trafik, işsizlik ve çevre sorunlarını artırabilir.",
          "Göç veren yerde genç iş gücü azalır; kadın ve yaşlı nüfus oranı yükselebilir.",
          "Turizm, tarım, inşaat ve yaylacılık mevsimlik göç oluşturur.",
        ],
        examNote:
          "İç göç ülke toplam nüfusunu değiştirmez; yalnız nüfusun ülke içindeki dağılışını değiştirir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Göç türleri ve nedenleri, s. 102",
        url: MEBI_TYT_MIGRATION,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'de iç ve mevsimlik göç, s. 104",
        url: MEBI_TYT_TURKEY_MIGRATION,
      },
    ],
  },
  {
    id: "settlement",
    subject: "Beşerî sistemler",
    title: "Yerleşme",
    description:
      "Yerleşmeyi etkileyen faktörler, kır-kent ayrımı ve Türkiye'deki yerleşme örnekleri.",
    status: "ready",
    quickFacts: [
      "İlk yerleşmeler suya, verimli toprağa ve korunaklı alanlara yakın kurulmuştur.",
      "Kırsal yerleşmede tarım-hayvancılık, kentte sanayi-hizmet öne çıkar.",
      "Toplu yerleşme kurak ve düz; dağınık yerleşme nemli ve engebeli alanlarda yaygındır.",
    ],
    sections: [
      {
        id: "settlement-factors",
        eyebrow: "KURULUŞ YERİ",
        title: "Yerleşmeyi etkileyenler",
        summary:
          "İklim, su, yer şekilleri ve toprak doğal; ekonomi, ulaşım ve teknoloji beşerî faktörlerdir.",
        bullets: [
          "Aşırı soğuk, kuraklık, yüksek dağlar, bataklık ve gür orman yerleşmeyi sınırlar.",
          "Su kaynakları, verimli ovalar, ulaşım kavşakları ve iş alanları yerleşmeyi çeker.",
          "Neolitik Çağ'da tarım, kalıcı yerleşmelerin gelişmesini sağlamıştır.",
        ],
        examNote:
          "Doğal koşullar yerleşmenin ilk kuruluşunda, ekonomik işlevler büyüyüp gelişmesinde daha belirleyicidir.",
      },
      {
        id: "rural-settlement",
        eyebrow: "KIRSAL YERLEŞME",
        title: "Toplu ve dağınık doku",
        summary:
          "Su ve arazinin dağılışı, kırsal yerleşmenin toplu ya da dağınık olmasını etkiler.",
        bullets: [
          "İç ve Güneydoğu Anadolu'da su az, arazi düz olduğu için toplu yerleşme yaygındır.",
          "Doğu Karadeniz'de su bol, arazi engebeli ve tarla parçalı olduğu için dağınık yerleşme yaygındır.",
          "Yayla, oba, kom ve ağıl geçici; köy ve çiftlik çoğunlukla sürekli kırsal yerleşmelerdir.",
        ],
        examNote:
          "Dağınık yerleşme nüfusun seyrek olduğu anlamına gelmez; konutların birbirinden uzak olduğunu anlatır.",
      },
      {
        id: "urban-functions",
        eyebrow: "ŞEHİR İŞLEVİ",
        title: "Fonksiyonlarına göre şehirler",
        summary:
          "Şehrin gelişmesini sağlayan baskın ekonomik veya idari faaliyet o şehrin fonksiyonudur.",
        bullets: [
          "Ankara idari; İstanbul ticaret, sanayi ve liman; Antalya turizm şehridir.",
          "Zonguldak maden, Bursa sanayi, Eskişehir kültür-eğitim işleviyle öne çıkar.",
          "Bir şehir aynı anda birden fazla fonksiyona sahip olabilir.",
        ],
        examNote:
          "Başkent olması Ankara'yı idari şehir; taş kömürü Zonguldak'ı maden şehri yapar.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Yerleşmelerin gelişimi ve faktörleri, s. 49",
        url: MEBI_TYT_SETTLEMENT,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Şehir yerleşmeleri ve fonksiyonları, s. 52",
        url: MEBI_TYT_SETTLEMENT_TYPES,
      },
    ],
  },
  {
    id: "economic-activities",
    subject: "Ekonomik coğrafya",
    title: "Ekonomik Faaliyetler",
    description:
      "Birincilden beşincile ekonomik faaliyetler ve gelişmişlik düzeyiyle sektör ilişkisi.",
    status: "ready",
    quickFacts: [
      "Tarım-madencilik birincil, sanayi-enerji üretimi ikincil faaliyettir.",
      "Ulaşım, ticaret, turizm, eğitim ve sağlık üçüncül yani hizmet sektörüdür.",
      "AR-GE dördüncül, üst düzey karar ve yönetim beşincil faaliyettir.",
    ],
    sections: [
      {
        id: "primary-secondary",
        eyebrow: "ÜRETİM",
        title: "Birincil ve ikincil faaliyetler",
        summary:
          "Birincil faaliyet doğadan ham madde alır; ikincil faaliyet ham maddeyi ürüne dönüştürür.",
        bullets: [
          "Tarım, hayvancılık, ormancılık, balıkçılık ve madencilik birincildir.",
          "Sanayi, inşaat ve elektrik enerjisi üretimi ikincildir.",
          "Buğday yetiştirmek birincil, undan makarna üretmek ikincildir.",
        ],
        examNote:
          "Madeni çıkarmak birincil; madeni fabrikada işlemek ikincil faaliyettir.",
      },
      {
        id: "service-information",
        eyebrow: "HİZMET VE BİLGİ",
        title: "Üçüncül, dördüncül ve beşincil",
        summary:
          "Doğrudan mal üretmeyen hizmet, bilgi ve yönetim faaliyetleri üst sektörleri oluşturur.",
        bullets: [
          "Ticaret, ulaşım, turizm, eğitim, sağlık ve bankacılık üçüncüldür.",
          "Yazılım, veri işleme, CBS ve AR-GE dördüncüldür.",
          "Üst düzey kamu yöneticileri ve şirket karar vericileri beşincildir.",
        ],
        examNote:
          "Öğretmen üçüncül, araştırmacı-yazılımcı dördüncül, şirket CEO'su beşincil örnektir.",
      },
      {
        id: "sector-development",
        eyebrow: "GELİŞMİŞLİK",
        title: "Sektör yapısı ne anlatır?",
        summary:
          "Kalkınma ilerledikçe tarımda çalışanların payı düşer, sanayi ve özellikle hizmetlerin payı yükselir.",
        bullets: [
          "Az gelişmiş ülkelerde birincil faaliyetlerde çalışan oranı yüksektir.",
          "Gelişmiş ülkelerde nitelikli iş gücü, teknoloji ve hizmet sektörleri öne çıkar.",
          "Tarım üretiminin fazla olması, tarımda çalışan oranının da yüksek olmasını gerektirmez.",
        ],
        examNote:
          "Modern tarım yapan gelişmiş ülke çok ürün üretirken az işçi çalıştırabilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Ekonomik faaliyet türleri, s. 106",
        url: MEBI_TYT_ECONOMIC_ACTIVITIES,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Ekonomik sektörler ve gelişmişlik, s. 107",
        url: MEBI_TYT_ECONOMIC_SECTORS,
      },
    ],
  },
  {
    id: "transport",
    subject: "Ekonomik coğrafya",
    title: "Ulaşım ve Ulaşım Hatları",
    description:
      "Ulaşımı etkileyen koşullar, ulaşım türlerinin üstünlükleri ve stratejik geçitler.",
    status: "ready",
    quickFacts: [
      "Kara yolu kapıdan kapıya ve yaygın; deniz yolu ağır yükte en ucuz ulaşım türüdür.",
      "Demir yolu ağır-yüksek hacimli yükte ekonomik, hava yolu en hızlı ve pahalıdır.",
      "Boğaz ve kanallar mesafeyi kısaltır, ülkelerin jeopolitik önemini artırır.",
    ],
    sections: [
      {
        id: "transport-factors",
        eyebrow: "DAĞILIŞ",
        title: "Ulaşımı etkileyen faktörler",
        summary:
          "Yer şekilleri ve iklim maliyeti; nüfus, ekonomi, sermaye ve teknoloji ağın gelişmesini belirler.",
        bullets: [
          "Düz ve alçak alanlarda yol yapımı kolay; engebeli sahalarda tünel ve köprü maliyeti yüksektir.",
          "Sanayi, ticaret ve nüfusun yoğun olduğu yerlerde ulaşım ağı sıktır.",
          "Ulaşım ağının sık ve çeşitli olması gelişmişlik göstergelerindendir.",
        ],
        examNote:
          "Doğu Anadolu'da yol maliyetinin yüksekliğinde yükselti, engebe, kar ve don birlikte etkilidir.",
      },
      {
        id: "transport-types",
        eyebrow: "ULAŞIM TÜRLERİ",
        title: "Hangi yol ne için?",
        summary:
          "Taşınan yükün miktarı, değeri, süre ve maliyet uygun ulaşım türünü belirler.",
        bullets: [
          "Kara yolu kısa mesafede esnek ve yaygındır, birim maliyeti yüksektir.",
          "Deniz yolu çok miktarda ağır yükü uzak mesafeye en düşük maliyetle taşır.",
          "Demir yolu kara yolundan ucuz, deniz yolundan hızlıdır; ağır yükte kullanılır.",
          "Hava yolu en hızlı ve pahalıdır; değerli, hafif ve acil yükte uygundur.",
          "Boru hatları petrol ve doğal gazı kesintisiz taşır.",
        ],
        examNote:
          "En ucuz deniz, en hızlı hava, kapıdan kapıya kara, petrol-doğal gaz boru hattıdır.",
      },
      {
        id: "strategic-routes",
        eyebrow: "BOĞAZ VE KANALLAR",
        title: "Stratejik geçitler",
        summary:
          "Dar geçitler deniz yollarını kısaltır ve küresel ticaretin düğüm noktalarını oluşturur.",
        bullets: [
          "Süveyş Kanalı Akdeniz-Kızıldeniz; Panama Atlas-Pasifik bağlantısını sağlar.",
          "Cebelitarık Akdeniz-Atlas; Hürmüz Basra Körfezi-Hint Okyanusu geçididir.",
          "İstanbul ve Çanakkale boğazları Karadeniz'i Akdeniz'e bağlayan tek deniz yoludur.",
          "Malakka Boğazı Hint Okyanusu ile Pasifik arasındaki yoğun ticaret geçididir.",
        ],
        examNote:
          "Kanal insan yapımı, boğaz doğal geçittir; ikisi de mesafe ve maliyeti azaltabilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Uluslararası ulaşım hatları, s. 108",
        url: MEBI_TYT_TRANSPORT,
      },
    ],
  },
  {
    id: "plains-plateaus",
    subject: "Türkiye'nin yer şekilleri",
    title: "Türkiye'nin Ova ve Platoları",
    description:
      "Platoların bölgesel dağılışı ile delta ve tektonik ovaların önemli KPSS eşleştirmeleri.",
    status: "ready",
    quickFacts: [
      "Plato, akarsularla yarılmış yüksek düzlük; ova, çevresine göre alçak ve az eğimli düzlük alanıdır.",
      "Bafra-Kızılırmak, Çarşamba-Yeşilırmak, Çukurova-Seyhan ve Ceyhan eşleştirilir.",
      "Erzurum-Kars hayvancılık, Şanlıurfa tarım, Çatalca-Kocaeli sanayi ve nüfusla öne çıkar.",
    ],
    sections: [
      {
        id: "turkey-plateaus",
        eyebrow: "PLATOLAR",
        title: "Bölgelere göre önemli platolar",
        summary:
          "Platolar yüksek düzlüklerdir; yüzeyleri akarsular tarafından yarılmıştır.",
        bullets: [
          "İç Anadolu: Haymana, Cihanbeyli, Obruk, Bozok ve Uzunyayla.",
          "Akdeniz: Teke ve Taşeli; Güneydoğu: Gaziantep ve Şanlıurfa.",
          "Doğu Anadolu: Erzurum-Kars ve Ardahan; İç Batı Anadolu: Yazılıkaya ve Uşak-Eşme.",
          "Marmara'da Çatalca-Kocaeli, Karadeniz'de Perşembe alçak aşınım platosudur.",
        ],
        examNote:
          "Erzurum-Kars çayır ve büyükbaş; İç Anadolu platoları bozkır ve küçükbaşla birlikte yorumlanır.",
      },
      {
        id: "delta-plains",
        eyebrow: "DELTA OVALARI",
        title: "Akarsu ve ova eşleştirmeleri",
        summary:
          "Akarsuyun taşıdığı alüvyonları sığ kıyıda biriktirmesiyle verimli delta ovaları oluşur.",
        bullets: [
          "Bafra-Kızılırmak, Çarşamba-Yeşilırmak.",
          "Çukurova-Seyhan ve Ceyhan, Silifke-Göksu.",
          "Menemen-Gediz, Balat-Büyük Menderes ve Bakırçay deltaları Ege kıyılarındadır.",
          "Delta için güçlü gelgitin olmaması, kıyının sığ ve birikmenin fazla olması gerekir.",
        ],
        examNote:
          "Merkezden dışarı doğru yelpaze biçimli akarsu ağı ve verimli alüvyal toprak delta ovası ipucudur.",
      },
      {
        id: "tectonic-plains",
        eyebrow: "İÇ OVALAR",
        title: "Tektonik ve yüksek ovalar",
        summary:
          "Faylanmayla çöken alanların tortullarla dolması tektonik ovaları oluşturur.",
        bullets: [
          "Ege grabenlerinde Bakırçay, Gediz, Küçük ve Büyük Menderes ovaları uzanır.",
          "Kuzey Anadolu Fay kuşağında Düzce, Bolu, Erbaa, Niksar ve Erzincan ovaları bulunur.",
          "Konya, Muş, Erzurum ve Yüksekova iç kesimlerin yüksek ova örnekleridir.",
          "Iğdır, Doğu Anadolu'da olmasına rağmen çevresine göre alçak ve mikroklima etkili bir ovadır.",
        ],
        examNote:
          "Doğu Anadolu'daki her ova yüksek değildir; Iğdır çevresine göre alçaklığıyla seçici bir örnektir.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Türkiye'nin plato ve ovaları, s. 76",
        url: MEBI_TYT_MAIN_LANDFORMS,
      },
      {
        label: "MEB e-KPSS Coğrafya kitabı",
        detail: "Türkiye'nin başlıca yüzey şekilleri",
        url: MEB_EKPSS_GEOGRAPHY_BOOK,
      },
    ],
  },
  {
    id: "turkey-agriculture",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Türkiye'de Tarım",
    description:
      "Tarımı etkileyen koşullar, başlıca ürünlerin istekleri ve üretim alanlarını ayıran kısa notlar.",
    status: "ready",
    quickFacts: [
      "Türkiye'de tarımsal üretimde yıldan yıla dalgalanmanın temel nedeni iklimdir.",
      "Nadas, kurak alanlarda toprağın bir yıl boş bırakılarak su toplamasıdır.",
      "Buğday iç kesimler, çay Doğu Karadeniz, pamuk Güneydoğu-Ege-Akdeniz ile eşleştirilir.",
    ],
    sections: [
      {
        id: "agriculture-factors",
        eyebrow: "VERİM VE ÜRETİM",
        title: "Tarımı etkileyen faktörler",
        summary:
          "İklim ve toprak doğal; sulama, makine, gübre, tohum, pazarlama ve çiftçi eğitimi beşerî faktörlerdir.",
        bullets: [
          "Sulama artarsa nadas alanı ve iklime bağımlılık azalır, verim yükselir.",
          "Makineleşme engebeli ve küçük-parçalı arazilerde sınırlanır.",
          "İntansif tarımda sermaye ve verim yüksek; ekstansif tarımda doğa koşullarına bağımlılık fazladır.",
        ],
        examNote:
          "Tarım alanını genişletmek üretimi artırabilir; verimi artıran asıl unsurlar sulama, gübreleme, ıslah ve teknolojidir.",
      },
      {
        id: "field-crops",
        eyebrow: "TAHIL VE SANAYİ BİTKİSİ",
        title: "Temel ürün eşleştirmeleri",
        summary:
          "Ürünün sıcaklık, su ve hasat dönemi isteği yetiştiği bölgeyi belirler.",
        bullets: [
          "Buğday yaz kuraklığı ister; Doğu Karadeniz dışında geniş alanda, en çok İç Anadolu'da yetişir.",
          "Çeltik bol su ister; Edirne, Samsun ve Balıkesir öne çıkar.",
          "Pamuk büyürken su, olgunlaşırken sıcak-kurak hava ister; Şanlıurfa, Aydın ve Adana çevresindedir.",
          "Şeker pancarı çabuk bozulduğu için fabrikası üretim alanına yakın kurulur; iç bölgelerde yaygındır.",
        ],
        examNote:
          "Şeker pancarı kıyıda yetişebilir; ancak kıyıda geliri daha yüksek ürünler seçildiği için iç kesimlerde yoğunlaşır.",
      },
      {
        id: "special-crops",
        eyebrow: "SEÇİCİ ÜRÜNLER",
        title: "Bölgeyi ele veren ürünler",
        summary:
          "Bazı ürünler dar iklim isteği nedeniyle harita sorularında güçlü ipucudur.",
        bullets: [
          "Çay yalnız Doğu Karadeniz; fındık Karadeniz; ayçiçeği özellikle Trakya.",
          "Zeytin Ege-Güney Marmara-Akdeniz; turunçgil Akdeniz ve Ege kıyıları.",
          "Antep fıstığı Güneydoğu; incir Aydın; kayısı Malatya; üzüm en yaygın meyvelerdendir.",
          "Haşhaş, pirinç, tütün ve kenevirin üretimi devlet iznine bağlıdır.",
        ],
        examNote:
          "Mikroklima sayesinde Iğdır'da pamuk, Rize çevresinde turunçgil yetişebilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Tahıllar ve tarım ürünleri, s. 28",
        url: MEBI_AYT_AGRICULTURE,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Sanayi bitkileri, s. 29",
        url: MEBI_AYT_INDUSTRIAL_CROPS,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Özel iklim isteyen ürünler, s. 30",
        url: MEBI_AYT_SPECIAL_CROPS,
      },
    ],
  },
  {
    id: "animal-husbandry",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Hayvancılık",
    description:
      "Mera-besi ayrımı ve hayvan türlerinin doğal bitki örtüsüyle kurduğu temel bölgesel ilişkiler.",
    status: "ready",
    quickFacts: [
      "Bozkır-koyun, çayır-sığır, maki-kıl keçisi temel KPSS eşleştirmesidir.",
      "Mera hayvancılığında üretim iklime; besi hayvancılığında yem ve pazara bağlıdır.",
      "Kümes hayvancılığı büyük tüketim merkezlerinin çevresinde gelişir.",
    ],
    sections: [
      {
        id: "livestock-methods",
        eyebrow: "YÖNTEM",
        title: "Mera ve besi hayvancılığı",
        summary:
          "Mera hayvancılığı doğal otlaklara, besi hayvancılığı yapay yem ve modern işletmeye dayanır.",
        bullets: [
          "Mera hayvancılığında maliyet ve verim düşük, iklim etkisi yüksektir.",
          "Besi ve ahır hayvancılığında verim, sermaye, bakım ve pazar ilişkisi güçlüdür.",
          "Hayvansal verimi artırmak için ırk ıslahı, yem üretimi ve veterinerlik hizmetleri önemlidir.",
        ],
        examNote:
          "Hayvan sayısı fazla olmak, et ve süt veriminin de yüksek olduğu anlamına gelmez.",
      },
      {
        id: "livestock-distribution",
        eyebrow: "BÖLGESEL DAĞILIŞ",
        title: "Küçükbaş ve büyükbaş",
        summary:
          "Bitki örtüsü ve arazi yapısı yetiştirilen hayvan türünü belirleyen ana doğal faktörlerdir.",
        bullets: [
          "Koyun bozkırın yaygın olduğu İç, Doğu ve Güneydoğu Anadolu'da yetiştirilir.",
          "Kıl keçisi Torosların makilik ve engebeli alanlarında; tiftik keçisi Ankara çevresinde yaygındır.",
          "Büyükbaş hayvancılık yaz yağışlı Erzurum-Kars ile çayırların yaygın olduğu Doğu Karadeniz'de gelişmiştir.",
          "Modern süt ve besi işletmeleri büyük şehirlerin çevresinde pazara yakın kurulur.",
        ],
        examNote:
          "Kıl keçisi ormana zarar verebildiği için sayısı sınırlandırılır; tiftik keçisi Ankara keçisidir.",
      },
      {
        id: "other-livestock",
        eyebrow: "DİĞER FAALİYETLER",
        title: "Arıcılık, kümes ve su ürünleri",
        summary:
          "Bitki çeşitliliği arıcılığı, pazar kümes hayvancılığını, temiz kıyı ve iç sular balıkçılığı destekler.",
        bullets: [
          "Arıcılıkta Muğla, Ordu, Adana ve Erzurum-Kars; çam balında Muğla öne çıkar.",
          "İpek böcekçiliği dut ağacı ve dokuma geleneği nedeniyle Bursa çevresiyle anılır.",
          "Kümes hayvancılığı İstanbul, Ankara, İzmir, Bursa ve Bolu çevresinde yoğundur.",
          "Deniz balıkçılığında üretimin en büyük bölümü Karadeniz'den sağlanır.",
        ],
        examNote:
          "Kümes hayvancılığının dağılışında iklimden çok tüketici pazarı ve ulaşım belirleyicidir.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Hayvancılık yöntemleri ve türleri, s. 31",
        url: MEBI_AYT_ANIMAL_HUSBANDRY,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Küçükbaş, büyükbaş ve kümes hayvancılığı, s. 32",
        url: MEBI_AYT_LIVESTOCK_TYPES,
      },
    ],
  },
  {
    id: "mining",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Türkiye'de Madenler",
    description:
      "Rezerv-tenör kavramları ile en önemli maden, çıkarım alanı ve kullanım eşleştirmeleri.",
    status: "ready",
    quickFacts: [
      "Rezerv toplam miktar, tenör maden içindeki saf mineral oranıdır.",
      "Bor-Eskişehir/Kütahya/Balıkesir; demir-Sivas/Malatya; boksit-Konya/Antalya eşleştirilir.",
      "Taş kömürü yalnız Zonguldak çevresinde, linyit Türkiye'nin birçok yerinde çıkarılır.",
    ],
    sections: [
      {
        id: "mining-concepts",
        eyebrow: "KAVRAMLAR",
        title: "Rezerv, tenör ve tuvenan",
        summary:
          "Bir yatağın işletilebilirliği yalnız miktarına değil kalite, ulaşım, teknoloji ve maliyete bağlıdır.",
        bullets: [
          "Rezerv, yatakta bulunan toplam maden miktarıdır.",
          "Tuvenan, ocaktan çıkarılmış taş ve toprakla karışık ham maddedir.",
          "Tenör, cevherdeki kullanılabilir saf maden oranıdır.",
          "Tenör ve rezerv yüksek, ulaşım kolay ise işletme olasılığı artar.",
        ],
        examNote:
          "Rezerv nicelik, tenör nitelik yani kalite bilgisidir.",
      },
      {
        id: "metallic-minerals",
        eyebrow: "METAL MADENLER",
        title: "Çıkarım alanları",
        summary:
          "Türkiye maden çeşitliliği bakımından zengin, bazı madenlerin rezervi bakımından güçlüdür.",
        bullets: [
          "Demir: Divriği-Sivas, Hekimhan-Hasançelebi-Malatya; bakır: Murgul-Artvin, Küre-Kastamonu, Maden-Elazığ.",
          "Krom: Guleman-Elazığ, Fethiye-Muğla ve Bursa çevresi.",
          "Boksit: Seydişehir-Konya ve Akseki-Antalya; alüminyumun ham maddesidir.",
          "Bor: Kırka-Eskişehir, Emet-Kütahya, Bigadiç-Balıkesir ve Kestelek-Bursa.",
        ],
        examNote:
          "Boksit çıkarım yeri Seydişehir; boksiti işleyen alüminyum tesisi de Seydişehir'dedir.",
      },
      {
        id: "nonmetallic-minerals",
        eyebrow: "DİĞER MADENLER",
        title: "Kullanım alanı eşleştirmeleri",
        summary:
          "Metal olmayan madenler kimya, cam, seramik ve yapı sanayisinde önem taşır.",
        bullets: [
          "Bor; cam, seramik, deterjan ve savunma sanayisinde kullanılır.",
          "Tuz; Tuz Gölü, İzmir-Çamaltı ve Çankırı çevresinden elde edilir.",
          "Mermer; Afyonkarahisar, Muğla, Bilecik ve Marmara Adası çevresinde yaygındır.",
          "Lüle taşı Eskişehir, oltu taşı Erzurum, zımpara taşı Ege Bölgesi ile özdeşleşir.",
        ],
        examNote:
          "Türkiye'nin dünya rezervinde belirgin üstünlüğe sahip olduğu maden bor mineralidir.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Türkiye'de madencilik ve madenler, s. 34",
        url: MEBI_AYT_MINING,
      },
    ],
  },
  {
    id: "energy-resources",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Enerji Kaynakları",
    description:
      "Fosil ve yenilenebilir enerji kaynaklarının Türkiye'deki başlıca üretim alanları.",
    status: "ready",
    quickFacts: [
      "Taş kömürü Zonguldak, petrol Güneydoğu Anadolu, linyit birçok bölgededir.",
      "Hidroelektrik potansiyeli yükselti ve eğim; jeotermal potansiyel faylarla ilişkilidir.",
      "Rüzgâr Ege-Marmara, güneş Güney ve İç Anadolu'da güçlüdür.",
    ],
    sections: [
      {
        id: "fossil-energy",
        eyebrow: "YENİLENEMEYEN",
        title: "Kömür, petrol ve doğal gaz",
        summary:
          "Fosil kaynaklar tükenebilir ve çevre kirliliği oluşturur; Türkiye enerji ihtiyacında dış alıma ihtiyaç duyar.",
        bullets: [
          "Taş kömürü Ereğli-Zonguldak-Amasra Havzası'nda, linyit birçok bölgede çıkarılır.",
          "Petrol başta Batman, Adıyaman, Diyarbakır ve çevresinde üretilir.",
          "Doğal gaz Hamitabat-Kırklareli ve Güneydoğu'daki sınırlı sahalardan çıkarılır.",
          "Petrol Batman, Kırıkkale, İzmit ve Aliağa rafinerilerinde işlenir.",
        ],
        examNote:
          "Taş kömürü yüksek kalorili ve demir-çelikte; linyit düşük kalorili ve termik santrallerde yaygındır.",
      },
      {
        id: "renewable-energy",
        eyebrow: "YENİLENEBİLİR",
        title: "Hidroelektrik, rüzgâr ve güneş",
        summary:
          "Yenilenebilir kaynakların dağılışı Türkiye'nin doğal koşullarına göre değişir.",
        bullets: [
          "Hidroelektrikte Fırat-Dicle havzası yüksek akım ve eğimle öne çıkar.",
          "Rüzgâr santralleri Çanakkale, Balıkesir, İzmir ve Manisa çevresinde yaygındır.",
          "Güneşlenme süresi Güneydoğu ve Akdeniz'de yüksek, Karadeniz'de düşüktür.",
          "Hidroelektrik üretimi yağış miktarına göre yıldan yıla değişebilir.",
        ],
        examNote:
          "Akarsu uzunluğu değil debi ve eğim hidroelektrik potansiyelini belirler.",
      },
      {
        id: "geothermal-energy",
        eyebrow: "FAY HATLARI",
        title: "Jeotermal ve diğer kaynaklar",
        summary:
          "Aktif tektonik yapı Türkiye'nin özellikle batısında sıcak su kaynaklarını artırmıştır.",
        bullets: [
          "Jeotermal enerji Aydın, Denizli, Manisa, İzmir ve Afyonkarahisar çevresinde yoğundur.",
          "Jeotermal; elektrik, konut-sera ısıtması ve termal turizmde kullanılır.",
          "Biyokütle tarımsal, hayvansal ve organik atıkların enerjiye dönüştürülmesidir.",
          "Nükleer enerji yenilenebilir değil; uranyum gibi tükenebilir yakıta dayanır.",
        ],
        examNote:
          "Jeotermal-fay, hidroelektrik-engebe, rüzgâr-boğaz ve kıyı, güneş-güneşlenme süresi bağlantısı kur.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Fosil ve hidroelektrik kaynaklar, s. 35",
        url: MEBI_AYT_ENERGY,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Güneş, rüzgâr ve jeotermal enerji, s. 36",
        url: MEBI_AYT_RENEWABLE_ENERGY,
      },
    ],
  },
  {
    id: "turkey-industry",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Türkiye'de Sanayi",
    description:
      "Sanayinin kuruluş koşulları, başlıca sanayi bölgeleri ve ürün-ham madde eşleştirmeleri.",
    status: "ready",
    quickFacts: [
      "Sanayinin en yoğun olduğu alan Çatalca-Kocaeli ve Güney Marmara çevresidir.",
      "Ham madde çabuk bozuluyorsa fabrika üretim alanına yakın kurulur.",
      "Demir-çelik Karabük, Ereğli ve İskenderun; otomotiv Bursa-Kocaeli-Sakarya ile anılır.",
    ],
    sections: [
      {
        id: "industry-location",
        eyebrow: "KURULUŞ YERİ",
        title: "Sanayinin dağılışını etkileyenler",
        summary:
          "Ham madde, enerji, sermaye, iş gücü, ulaşım ve pazar sanayi tesisinin yerini belirler.",
        bullets: [
          "Şeker, çay ve konserve fabrikaları bozulabilir ham maddeye yakın kurulur.",
          "Otomotiv ve beyaz eşya; pazar, sermaye, yan sanayi ve ulaşıma yakın büyük merkezlerde gelişir.",
          "Demir-çelik tesislerinde enerji, liman ve ham madde birlikte etkilidir.",
        ],
        examNote:
          "Kuruluş nedenini ürünün özelliğinden bul: çabuk bozulan ham maddeye, ağır ithal ham madde limana yakınlık ister.",
      },
      {
        id: "industry-regions",
        eyebrow: "SANAYİ BÖLGELERİ",
        title: "Türkiye'de yoğunlaşma alanları",
        summary:
          "Sanayi batıda ve büyük şehirler çevresinde daha yoğun, doğuda daha seyrektir.",
        bullets: [
          "İstanbul-Kocaeli-Sakarya-Bursa Türkiye'nin en büyük sanayi kuşağıdır.",
          "İzmir-Manisa-Denizli, Ankara-Eskişehir-Konya ve Adana-Mersin diğer önemli alanlardır.",
          "Gaziantep Güneydoğu'nun, Samsun Karadeniz'in önemli sanayi merkezlerindendir.",
          "Ulaşım, pazar ve sermaye batıdaki yoğunlaşmanın temel nedenleridir.",
        ],
        examNote:
          "Maden veya tarım ham maddesi bulunmayan büyük şehirde sanayi gelişmişse pazar, ulaşım ve sermaye etkisini ara.",
      },
      {
        id: "industry-pairs",
        eyebrow: "TESİS EŞLEŞTİRMELERİ",
        title: "Sık sorulan sanayi kolları",
        summary:
          "Bazı tesisler kuruluş yeri nedeniyle KPSS'de doğrudan eşleştirme olarak sorulur.",
        bullets: [
          "Demir-çelik: Karabük, Ereğli, İskenderun; alüminyum: Seydişehir.",
          "Petrol rafinerisi: İzmit, Aliağa, Kırıkkale ve Batman.",
          "Çay sanayisi Rize; ayçiçeği yağı Trakya; şeker fabrikaları iç bölgeler.",
          "Otomotiv Bursa, Kocaeli, Sakarya; pamuklu dokuma Adana, İzmir, Denizli ve Gaziantep.",
        ],
        examNote:
          "Karabük kömüre, İskenderun limana, Seydişehir boksit yatağına yakınlıkla açıklanır.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Sanayinin dağılış faktörleri, s. 37",
        url: MEBI_AYT_INDUSTRY,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Türkiye'de sanayi kolları, s. 38-39",
        url: MEBI_AYT_INDUSTRY_BRANCHES,
      },
    ],
  },
  {
    id: "trade",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Ticaret",
    description:
      "İç-dış ticaret kavramları, Türkiye'nin ürün yapısı ve ticareti geliştiren temel koşullar.",
    status: "ready",
    quickFacts: [
      "İhracat dış satım, ithalat dış alım; toplamları dış ticaret hacmidir.",
      "İhracat ithalattan azsa dış ticaret açığı oluşur.",
      "Türkiye'nin ihracatında sanayi, ithalatında enerji ve teknoloji ürünleri önemlidir.",
    ],
    sections: [
      {
        id: "trade-concepts",
        eyebrow: "KAVRAMLAR",
        title: "Dış ticaret hesabı",
        summary:
          "Ülkeler üretemediği veya daha pahalı ürettiği ürünleri dışarıdan alır, fazlasını dışarıya satar.",
        bullets: [
          "Dış ticaret hacmi = ihracat + ithalat.",
          "Dış ticaret dengesi = ihracat - ithalat.",
          "Sonuç negatifse açık, pozitifse fazla oluşur.",
          "Transit ticaret, malın bir ülke üzerinden başka ülkeye taşınmasıdır.",
        ],
        examNote:
          "Hacim toplama, denge çıkarma işlemidir; en sık karıştırılan iki kavramdır.",
      },
      {
        id: "turkey-trade-products",
        eyebrow: "TÜRKİYE",
        title: "Alınan ve satılan ürünler",
        summary:
          "Türkiye'nin dış ticaret yapısı tarım ağırlığından sanayi ürünleri ağırlığına dönüşmüştür.",
        bullets: [
          "İhracatta otomotiv, makine, tekstil-hazır giyim, demir-çelik ve işlenmiş gıda önemlidir.",
          "İthalatta petrol, doğal gaz, makine, elektronik, kimya ve ara malları öne çıkar.",
          "Enerji ithalatı dış ticaret açığını artıran temel kalemlerdendir.",
        ],
        examNote:
          "Türkiye yalnız tarım ürünü satan bir ülke değildir; dış satımın ana gövdesini sanayi ürünleri oluşturur.",
      },
      {
        id: "domestic-trade",
        eyebrow: "İÇ TİCARET",
        title: "Ticareti canlı tutan koşullar",
        summary:
          "Ürün ve nüfusun bölgeler arasında farklı dağılması iç ticareti geliştirir.",
        bullets: [
          "İklim çeşitliliği, üretim farkı, kalabalık nüfus, sanayi ve ulaşım iç ticareti canlandırır.",
          "İstanbul en büyük ticaret merkezi; İzmir, Ankara, Bursa, Gaziantep ve Adana önemli merkezlerdir.",
          "Anadolu, Kral Yolu, İpek Yolu ve Baharat Yolu üzerinde tarihsel köprü olmuştur.",
          "Serbest bölgeler ihracat, yabancı sermaye ve istihdamı artırmayı amaçlar.",
        ],
        examNote:
          "Üretim her yerde aynı olsaydı bölgeler arası ürün alışverişi ve iç ticaret daha zayıf olurdu.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Türkiye'de iç ticaret, s. 82",
        url: MEBI_AYT_TRADE,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Dış ticaret ve tarihî yollar, s. 83",
        url: MEBI_AYT_FOREIGN_TRADE,
      },
    ],
  },
  {
    id: "tourism",
    subject: "Türkiye ekonomik coğrafyası",
    title: "Türkiye'de Turizm",
    description:
      "Türkiye'nin doğal-kültürel turizm varlıkları ve önemli turizm türü-yer eşleştirmeleri.",
    status: "ready",
    quickFacts: [
      "Kıyı turizmi Ege-Akdeniz, kış turizmi yüksek dağlar, termal turizm fay alanlarında gelişir.",
      "Turizm görünmeyen ihracattır; döviz ve istihdam sağlar.",
      "Kapadokya peribacası, Pamukkale traverten, Afyonkarahisar termal turizmle eşleştirilir.",
    ],
    sections: [
      {
        id: "tourism-potential",
        eyebrow: "POTANSİYEL",
        title: "Türkiye turizmi neden çeşitlidir?",
        summary:
          "İklim, kıyı, yer şekli ve termal kaynak çeşitliliği; zengin tarihî mirasla birleşir.",
        bullets: [
          "Ege ve Akdeniz kıyıları deniz-kum-güneş turizminde öne çıkar.",
          "Anadolu'nun çok sayıda medeniyete ev sahipliği yapması kültür turizmini geliştirir.",
          "Dört mevsimin yaşanması turizm sezonunu ve türlerini çeşitlendirir.",
        ],
        examNote:
          "Turizmin yıl geneline yayılması mevsimlik istihdam ve kıyılardaki aşırı yoğunluğu azaltır.",
      },
      {
        id: "tourism-pairs",
        eyebrow: "YER - TÜR",
        title: "Önemli eşleştirmeler",
        summary:
          "Turistik çekiciliğin doğal ya da kültürel oluşu soruda doğru türü buldurur.",
        bullets: [
          "Kış: Uludağ, Kartalkaya, Erciyes, Palandöken; termal: Afyon, Denizli, Yalova, Bursa.",
          "Doğa-jeoloji: Kapadokya, Pamukkale, Damlataş, Ballıca, Uzungöl.",
          "İnanç-kültür: Konya, Şanlıurfa, İstanbul, Efes, Hattuşa, Göbeklitepe.",
          "Rafting: Çoruh; yat turizmi: Muğla-Antalya kıyıları; yayla turizmi: Karadeniz ve Toroslar.",
        ],
        examNote:
          "Nemrut adı iki turizm alanında geçer: Bitlis'te volkanik kaldera, Adıyaman'da tarihî heykeller.",
      },
      {
        id: "tourism-effects",
        eyebrow: "EKONOMİK ETKİ",
        title: "Turizmin sonuçları",
        summary:
          "Turizm hizmet ihracatı niteliğindedir ve çok sayıda sektörü birlikte etkiler.",
        bullets: [
          "Döviz girdisi sağlar, dış ticaret açığının azaltılmasına katkı verir.",
          "Ulaşım, konaklama, yeme-içme, el sanatları ve inşaatı geliştirir.",
          "Doğal ve kültürel mirasın korunmasına kaynak oluşturabilir.",
          "Plansız gelişirse kıyı tahribi, su tüketimi ve mevsimlik yoğunluk oluşturur.",
        ],
        examNote:
          "Turizm bacasız sanayi olarak anılsa da plansız yapıldığında çevresel baskı oluşturabilir.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Türkiye turizmi ve kültürel miras, s. 84",
        url: MEBI_AYT_TOURISM,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Türkiye'nin turizm türleri, s. 85-86",
        url: MEBI_AYT_TOURISM_TYPES,
      },
    ],
  },
  {
    id: "natural-disasters",
    subject: "Çevre ve toplum",
    title: "Doğal Afetler",
    description:
      "Afet sınıfları, Türkiye'deki risk alanları ve olayın afete dönüşmesini belirleyen temel koşullar.",
    status: "ready",
    quickFacts: [
      "Doğa olayı can-mal kaybı ve yaşamın aksamasına yol açtığında afete dönüşür.",
      "Deprem jeolojik; sel, kuraklık ve çığ klimatik; erozyon biyolojik kökenli afetler içinde verilir.",
      "Afet önlenemeyebilir; riskli yerde yanlış yapılaşma ve hazırlıksızlık zararı büyütür.",
    ],
    sections: [
      {
        id: "disaster-types",
        eyebrow: "SINIFLANDIRMA",
        title: "Afet türleri",
        summary:
          "Afetler oluşum nedenlerine göre jeolojik, klimatik, biyolojik, sosyal ve teknolojik sınıflara ayrılır.",
        bullets: [
          "Deprem, tsunami, volkanizma ve kütle hareketleri jeolojiktir.",
          "Sel, taşkın, kuraklık, fırtına ve çığ klimatik afetlerdir.",
          "Erozyon, salgın ve orman yangını biyolojik; sanayi-nükleer kazalar teknolojiktir.",
        ],
        examNote:
          "Her doğal olay afet değildir; insanı ve yaşam alanını etkileyerek kayıp oluşturması gerekir.",
      },
      {
        id: "turkey-disaster-map",
        eyebrow: "TÜRKİYE'DE DAĞILIŞ",
        title: "Hangi afet nerede?",
        summary:
          "Jeolojik yapı, iklim, eğim ve arazi kullanımı afet türlerinin bölgesel dağılışını belirler.",
        bullets: [
          "Deprem riski Kuzey Anadolu, Doğu Anadolu ve Batı Anadolu fay kuşaklarında yüksektir.",
          "Heyelan en çok eğim ve yağışın fazla olduğu Doğu Karadeniz'de görülür.",
          "Çığ Doğu Anadolu ve Doğu Karadeniz'in yüksek, eğimli ve karlı yamaçlarında yaygındır.",
          "Erozyon bitki örtüsü zayıf, eğimli ve kurak-yarı kurak iç kesimlerde güçlüdür.",
          "Orman yangını yazı sıcak-kurak Ege ve Akdeniz kıyılarında daha sık görülür.",
        ],
        examNote:
          "Konya çevresinde deprem riski görece düşük olabilir; fakat kuraklık, obruk ve erozyon riski bulunur.",
      },
      {
        id: "disaster-risk",
        eyebrow: "RİSK AZALTMA",
        title: "Tehlike, risk ve afet",
        summary:
          "Tehlikenin afete dönüşmesinde nüfus, yapı kalitesi, arazi kullanımı ve hazırlık düzeyi etkilidir.",
        bullets: [
          "Fay üzerine dayanıksız yapı yapmak deprem zararını artırır.",
          "Akarsu yatağında yapılaşma ve yüzeyi betonlaştırma sel-taşkın riskini büyütür.",
          "Ormansızlaşma erozyon, sel ve heyelan riskini artırabilir.",
          "Risk haritası, sağlam yapı, erken uyarı ve eğitim kayıpları azaltır.",
        ],
        examNote:
          "Depremin büyüklüğü aynı olsa bile nüfus ve yapı kalitesi farklıysa afetin sonucu farklı olur.",
      },
    ],
    sources: [
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Afetlerin sınıflandırılması, s. 111",
        url: MEBI_TYT_DISASTERS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Klimatik afetler ve erozyon, s. 112",
        url: MEBI_TYT_CLIMATE_DISASTERS,
      },
      {
        label: "MEBİ TYT Coğrafya",
        detail: "Deprem ve Türkiye'de deprem riski, s. 114",
        url: MEBI_TYT_EARTHQUAKES,
      },
    ],
  },
  {
    id: "environmental-issues",
    subject: "Çevre ve toplum",
    title: "Çevre Sorunları",
    description:
      "Küresel iklim değişikliği, ozon ve asit yağışı ayrımı ile kirlilik ve sürdürülebilirlik notları.",
    status: "ready",
    quickFacts: [
      "Sera gazlarının artışı küresel iklim değişikliğini güçlendirir.",
      "Ozon seyrelmesi ile küresel ısınma aynı çevre sorunu değildir.",
      "Asit yağışları fosil yakıtlardan çıkan kükürt ve azot oksitlerle ilişkilidir.",
    ],
    sections: [
      {
        id: "global-environment",
        eyebrow: "KÜRESEL SORUNLAR",
        title: "İklim, ozon ve asit yağışı",
        summary:
          "Üç sorun atmosferle ilgili olsa da nedenleri ve sonuçları farklıdır.",
        bullets: [
          "Küresel iklim değişikliği; sera gazları, fosil yakıt ve ormansızlaşmayla güçlenir.",
          "Ozon tabakasının seyrelmesi zararlı morötesi ışınların yeryüzüne ulaşmasını artırır.",
          "Asit yağışları sanayi ve fosil yakıt kaynaklı gazların su buharıyla birleşmesiyle oluşur.",
          "İklim değişikliği; buzulların erimesi, deniz seviyesinin yükselmesi ve uç hava olaylarını artırabilir.",
        ],
        examNote:
          "CFC-ozon, karbondioksit-sera etkisi, kükürt ve azot oksit-asit yağışı eşleştirmesini ayır.",
      },
      {
        id: "pollution-types",
        eyebrow: "KİRLİLİK",
        title: "Hava, su ve toprak",
        summary:
          "Sanayi, kentleşme, enerji, ulaşım ve tarım farklı çevre bileşenlerini birlikte kirletebilir.",
        bullets: [
          "Fosil yakıt ve egzoz hava; arıtılmayan evsel-sanayi atığı su kirliliği oluşturur.",
          "Pestisit, aşırı gübre, ağır metal ve atıklar toprağı kirletir.",
          "Ötrofikasyon, suya fazla besin maddesi karışmasıyla alglerin aşırı çoğalmasıdır.",
          "Gürültü ve ışık kirliliği özellikle yoğun kent ve ulaşım alanlarında artar.",
        ],
        examNote:
          "Bir kirletici yalnız tek ortamı etkilemez; kirli toprak sızmayla yer altı suyunu da kirletebilir.",
      },
      {
        id: "sustainability",
        eyebrow: "ÇÖZÜM",
        title: "Sürdürülebilir kullanım",
        summary:
          "Bugünün ihtiyacını karşılarken gelecek kuşakların kaynak hakkını korumak sürdürülebilirliktir.",
        bullets: [
          "Atık yönetiminde öncelik: oluşumu azaltma, yeniden kullanma, geri dönüşüm ve uygun bertaraf.",
          "Yenilenebilir enerji, enerji verimliliği ve toplu taşıma emisyonu azaltır.",
          "Erozyonla mücadelede bitki örtüsünü koruma, eğime dik sürme ve teraslama uygulanır.",
          "Korunan alanlar biyoçeşitlilik ve doğal mirasın devamını sağlar.",
        ],
        examNote:
          "Geri dönüşüm önemlidir; ancak atığı kaynağında azaltmak hiyerarşide daha önceliklidir.",
      },
    ],
    sources: [
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Çevre sorunları ve küresel iklim değişikliği, s. 53",
        url: MEBI_AYT_ENVIRONMENT,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Asit yağışları ve çevre kirliliği, s. 54",
        url: MEBI_AYT_POLLUTION,
      },
      {
        label: "MEBİ AYT Coğrafya",
        detail: "Atıklar ve geri dönüşüm, s. 60",
        url: MEBI_AYT_WASTE,
      },
    ],
  },
];
