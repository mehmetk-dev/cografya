import type { MarkerKind, MarkerSubtype } from "./types";
import { QUIZ_BANKS, type ReadyQuizQuestion } from "./quizBanks";

export type ReadySetItem = {
  id: string;
  label: string;
  provinceCode: number;
  kind: MarkerKind;
  subtype?: MarkerSubtype;
  description: string;
  topic?: string;
  place?: string;
  relation?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  branches?: string[];
  image?: string;
};

export type ReadyStudySet = {
  id: string;
  title: string;
  shortTitle: string;
  subject: string;
  description: string;
  color: string;
  icon: string;
  quizLabel: string;
  quizQuestions: ReadyQuizQuestion[];
  keyFacts: string[];
  items: ReadySetItem[];
};

const item = (
  id: string,
  label: string,
  provinceCode: number,
  kind: MarkerKind,
  subtype: MarkerSubtype | undefined,
  description: string,
  extra: Partial<
    Pick<
      ReadySetItem,
      | "branches"
      | "image"
      | "topic"
      | "place"
      | "relation"
      | "sourceLabel"
      | "sourceUrl"
    >
  > = {},
): ReadySetItem => ({
  id,
  label,
  provinceCode,
  kind,
  subtype,
  description,
  ...extra,
});

type StudySite = {
  id: string;
  place: string;
  provinceCode: number;
  note?: string;
  relation?: string;
  sourceLabel?: string;
};

const siteItems = (
  topic: string,
  kind: MarkerKind,
  subtype: MarkerSubtype | undefined,
  description: string,
  locations: StudySite[],
  source?: { label: string; url: string },
) =>
  locations.map((site) =>
    item(
      `${topic.toLocaleLowerCase("tr-TR").replace(/[^a-z0-9çğıöşü]+/g, "-")}-${site.id}`,
      `${topic} · ${site.place}`,
      site.provinceCode,
      kind,
      subtype,
      site.note ? `${description} ${site.note}` : description,
      {
        topic,
        place: site.place,
        relation:
          site.relation ??
          (kind === "agriculture"
            ? "Başlıca üretim alanı"
            : kind === "custom"
              ? "Sanayi tesisi / üretim merkezi"
              : kind === "energy"
                ? "Enerji sahası / tesisi"
                : "Çıkarım alanı"),
        sourceLabel: site.sourceLabel ?? source?.label,
        sourceUrl: source?.url,
      },
    ),
  );

const MEB_AGRICULTURE_PAGE_28 =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page28.html";
const MEB_AGRICULTURE_PAGE_29 =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page29.html";
const MEB_AGRICULTURE_PAGE_30 =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-cografya/files/basic-html/page30.html";

const mebAgricultureItems = (
  topic: string,
  subtype: MarkerSubtype,
  description: string,
  locations: StudySite[],
  page: string,
  label = "MEB ana merkez",
) =>
  siteItems(
    topic,
    "agriculture",
    subtype,
    description,
    locations,
    { label, url: page },
  );

const mountains: ReadySetItem[] = [
  item("agri", "Ağrı Dağı", 4, "mountain", "mountain-volcanic", "Türkiye'nin en yüksek dağıdır (5.137 m). Büyük Ağrı ve Küçük Ağrı konilerinden oluşur.", { image: "/images/sets/agri-dagi.jpg" }),
  item("tendurek", "Tendürek Dağı", 4, "mountain", "mountain-volcanic", "Doğu Anadolu'da Ağrı ile Van arasında bulunan volkanik dağdır."),
  item("suphan", "Süphan Dağı", 13, "mountain", "mountain-volcanic", "Van Gölü'nün kuzeyinde bulunan sönmüş volkanik dağdır."),
  item("nemrut", "Nemrut Dağı", 13, "mountain", "mountain-volcanic", "Bitlis'te kalderası ve kaldera gölüyle tanınan volkanik dağdır."),
  item("erciyes", "Erciyes Dağı", 38, "mountain", "mountain-volcanic", "İç Anadolu'nun en yüksek volkanik dağıdır (3.917 m).", { image: "/images/sets/erciyes.jpg" }),
  item("hasan", "Hasan Dağı", 68, "mountain", "mountain-volcanic", "Aksaray-Niğde çevresinde yükselen volkanik dağdır."),
  item("melendiz", "Melendiz Dağı", 51, "mountain", "mountain-volcanic", "Niğde çevresindeki volkanik dağ sırasıdır."),
  item("karadag", "Karadağ", 70, "mountain", "mountain-volcanic", "Karaman'ın kuzeyinde bulunan sönmüş volkanik dağdır."),
  item("karacadag", "Karacadağ", 21, "mountain", "mountain-volcanic", "Diyarbakır-Şanlıurfa arasında geniş tabanlı kalkan volkandır."),
  item("kackar", "Kaçkar Dağları", 53, "mountain", "mountain-fold", "Doğu Karadeniz Dağları'nın en yüksek bölümüdür; buzul şekilleri yaygındır.", { image: "/images/sets/kackar.jpg" }),
  item("kure", "Küre Dağları", 37, "mountain", "mountain-fold", "Batı Karadeniz'de kıyıya paralel uzanan Kuzey Anadolu Dağları bölümüdür."),
  item("ilgaz", "Ilgaz Dağları", 18, "mountain", "mountain-fold", "Kastamonu ile Çankırı arasında uzanan Kuzey Anadolu Dağları bölümüdür."),
  item("canik", "Canik Dağları", 52, "mountain", "mountain-fold", "Orta Karadeniz'de kıyıya paralel uzanır; yükseltisi Doğu Karadeniz'e göre daha azdır."),
  item("giresun", "Giresun Dağları", 28, "mountain", "mountain-fold", "Doğu Karadeniz Dağları'nın batı bölümünde kıyıya paralel uzanır."),
  item("yildiz", "Yıldız Dağları", 39, "mountain", "mountain-fold", "Trakya'nın kuzeyinde bulunan eski kütledir; Istranca adıyla da bilinir."),
  item("toros", "Toros Dağları", 7, "mountain", "mountain-fold", "Akdeniz kıyılarına paralel uzanan Alp-Himalaya kıvrım sisteminin Türkiye'deki ana koludur."),
  item("bolkar", "Bolkar Dağları", 33, "mountain", "mountain-fold", "Orta Toroslar'da Mersin-Niğde arasında uzanan kıvrım dağlarıdır."),
  item("aladaglar", "Aladağlar", 51, "mountain", "mountain-fold", "Kayseri-Niğde-Adana arasında, Orta Toroslar'ın yüksek bölümüdür."),
  item("bey", "Bey Dağları", 7, "mountain", "mountain-fold", "Batı Toroslar'ın Antalya çevresindeki bölümüdür."),
  item("geyik", "Geyik Dağları", 7, "mountain", "mountain-fold", "Batı ve Orta Toroslar arasında uzanan kıvrım dağ sırasıdır."),
  item("sultan", "Sultan Dağları", 3, "mountain", "mountain-fold", "Afyonkarahisar-Konya sınırında uzanan kıvrım dağlarıdır."),
  item("sundiken", "Sündiken Dağları", 26, "mountain", "mountain-fold", "Eskişehir'in kuzeyinde bulunan kıvrım dağlarıdır."),
  item("munzur", "Munzur Dağları", 62, "mountain", "mountain-fold", "Tunceli-Erzincan arasında Doğu Anadolu'nun yüksek kıvrım dağlarındandır."),
  item("mercan", "Mercan Dağları", 24, "mountain", "mountain-fold", "Erzincan-Tunceli çevresindeki kıvrım dağ sırasıdır."),
  item("kaz", "Kaz Dağı", 10, "mountain", "mountain-fault-block", "Edremit Körfezi'nin kuzeyinde yükselen kırık dağdır."),
  item("madra", "Madra Dağları", 10, "mountain", "mountain-fault-block", "Bakırçay ile Edremit ovaları arasında bulunan Ege horstudur."),
  item("yunt", "Yunt Dağı", 45, "mountain", "mountain-fault-block", "Bakırçay ve Gediz grabenleri arasında kalan kırık dağdır."),
  item("bozdaglar", "Bozdağlar", 35, "mountain", "mountain-fault-block", "Gediz ile Küçük Menderes grabenleri arasında uzanan horsttur."),
  item("aydin", "Aydın Dağları", 9, "mountain", "mountain-fault-block", "Küçük ve Büyük Menderes grabenleri arasında uzanan kırık dağlardır."),
  item("mentese", "Menteşe Dağları", 48, "mountain", "mountain-fault-block", "Güneybatı Anadolu'da faylanmayla belirginleşen dağlık kütledir."),
  item("amanos", "Amanos Dağları", 31, "mountain", "mountain-fault-block", "İskenderun Körfezi'nin doğusunda uzanan kırık dağlardır; Nur Dağları da denir."),
];

const lakes: ReadySetItem[] = [
  item("van", "Van Gölü", 65, "lake", "lake-tectonic-volcanic-set", "Türkiye'nin en büyük gölüdür; tektonik çanakta Nemrut volkanından çıkan lavların oluşturduğu set de etkili olmuştur."),
  item("tuz", "Tuz Gölü", 68, "lake", "lake-tectonic", "İç Anadolu'da sığ ve tuzlu tektonik göldür; kapalı havzada yer alır."),
  item("beysehir", "Beyşehir Gölü", 42, "lake", "lake-tectonic-karstic", "Türkiye'nin en büyük tatlı su gölüdür; tektonik-karstik karma oluşumludur."),
  item("egirdir", "Eğirdir Gölü", 32, "lake", "lake-tectonic-karstic", "Göller Yöresi'nde bulunan tatlı su ve tektonik-karstik karma oluşumlu göldür."),
  item("burdur", "Burdur Gölü", 15, "lake", "lake-tectonic", "Kapalı havzada yer alan tektonik ve tuzlu göldür."),
  item("iznik", "İznik Gölü", 16, "lake", "lake-tectonic", "Marmara Bölgesi'nin en büyük, tektonik kökenli tatlı su gölüdür."),
  item("sapanca", "Sapanca Gölü", 54, "lake", "lake-tectonic", "Kuzey Anadolu Fay kuşağındaki tektonik çukurda yer alır."),
  item("manyas", "Manyas Gölü", 10, "lake", "lake-tectonic", "Kuş Cenneti ile bilinen sığ tektonik göldür."),
  item("ulubat", "Uluabat Gölü", 16, "lake", "lake-tectonic", "Güney Marmara'da sığ, tatlı su gölüdür."),
  item("salda", "Salda Gölü", 15, "lake", "lake-karstic", "Burdur'da karstik çanakta bulunan kapalı havza gölüdür."),
  item("meke", "Meke Gölü", 42, "lake", "lake-volcanic", "Karapınar'da bir maar içinde gelişmiş volkanik göldür."),
  item("nemrut-krater", "Nemrut Krater Gölü", 13, "lake", "lake-volcanic", "Nemrut Dağı kalderası içinde bulunan volkanik göldür."),
  item("tortum", "Tortum Gölü", 25, "lake", "lake-set", "Heyelan kütlesinin Tortum Çayı'nı kapatmasıyla oluşmuş set gölüdür."),
  item("uzungol", "Uzungöl", 61, "lake", "lake-set", "Heyelan setinin Haldizen Deresi vadisini kapatmasıyla oluşmuştur."),
  item("sera", "Sera Gölü", 61, "lake", "lake-set", "Trabzon'da heyelan sonucu oluşmuş set gölüdür."),
  item("abant", "Abant Gölü", 14, "lake", "lake-set", "Heyelan seti gerisinde oluşmuş tatlı su gölüdür."),
  item("keban", "Keban Baraj Gölü", 23, "lake", "lake-dam", "Fırat Nehri üzerindeki Keban Barajı'nın oluşturduğu yapay göldür."),
  item("ataturk", "Atatürk Baraj Gölü", 63, "lake", "lake-dam", "Fırat Nehri üzerinde enerji ve sulama amacıyla oluşturulmuş yapay göldür."),
];

const rivers: ReadySetItem[] = [
  item("kizilirmak", "Kızılırmak", 58, "river", "river-black-sea", "Türkiye sınırları içinde doğup denize ulaşan en uzun akarsudur. Sivas'tan doğar, Bafra Deltası'nda Karadeniz'e dökülür.", { branches: ["Delice Irmağı", "Devrez Çayı", "Gökırmak"] }),
  item("yesilirmak", "Yeşilırmak", 60, "river", "river-black-sea", "Sivas çevresinden doğar, Çarşamba Deltası'nı oluşturarak Karadeniz'e ulaşır.", { branches: ["Kelkit Çayı", "Çekerek Irmağı", "Tersakan Çayı"] }),
  item("sakarya", "Sakarya", 26, "river", "river-black-sea", "İç Anadolu'dan doğar; batı ve kuzeye yönelerek Karadeniz'e dökülür.", { branches: ["Porsuk Çayı", "Ankara Çayı", "Göksu"] }),
  item("filyos", "Filyos Çayı", 67, "river", "river-black-sea", "Batı Karadeniz'in önemli akarsularındandır; Zonguldak'ta denize ulaşır.", { branches: ["Devrek Çayı", "Soğanlı Çayı", "Araç Çayı"] }),
  item("coruh", "Çoruh", 8, "river", "river-black-sea", "Türkiye'den doğup Gürcistan'da Karadeniz'e ulaşır; yatak eğimi ve enerji potansiyeli yüksektir.", { branches: ["Oltu Çayı", "Berta Çayı", "Barhal Çayı"] }),
  item("meric", "Meriç", 22, "river", "river-aegean", "Bulgaristan'dan doğar, Türkiye-Yunanistan sınırının bir bölümünü izleyerek Ege Denizi'ne dökülür.", { branches: ["Arda", "Tunca", "Ergene"] }),
  item("gediz", "Gediz", 45, "river", "river-aegean", "İç Batı Anadolu'dan doğar ve İzmir Körfezi'nin kuzeyinden Ege'ye ulaşır.", { branches: ["Alaşehir Çayı", "Gördes Çayı", "Kum Çayı"] }),
  item("buyuk-menderes", "Büyük Menderes", 20, "river", "river-aegean", "Ege'de geniş kıvrımlar yaparak akar ve Büyük Menderes Deltası'nı oluşturur.", { branches: ["Banaz Çayı", "Çürüksu", "Akçay", "Çine Çayı"] }),
  item("kucuk-menderes", "Küçük Menderes", 35, "river", "river-aegean", "Bozdağlar'dan doğar, Küçük Menderes grabenini izleyerek Ege'ye ulaşır.", { branches: ["Fetrek Çayı", "Ilıca Deresi"] }),
  item("bakircay", "Bakırçay", 35, "river", "river-aegean", "Kırık dağlar arasındaki Bakırçay grabeninden geçerek Çandarlı Körfezi'ne dökülür.", { branches: ["Yağcılı Çayı", "Geyikli Deresi"] }),
  item("seyhan", "Seyhan", 1, "river", "river-mediterranean", "Tahtalı ve Binboğa dağlık alanlarından gelen kolların birleşmesiyle oluşur; Adana'dan Akdeniz'e ulaşır.", { branches: ["Zamantı Irmağı", "Göksu"] }),
  item("ceyhan", "Ceyhan", 46, "river", "river-mediterranean", "Elbistan çevresinden doğar, Çukurova'nın doğusundan Akdeniz'e dökülür.", { branches: ["Hurman Çayı", "Göksun Çayı", "Aksu Çayı"] }),
  item("asi", "Asi", 31, "river", "river-mediterranean", "Lübnan'dan doğar, Suriye'den geçip Hatay'da Akdeniz'e dökülür.", { branches: ["Afrin Çayı", "Karasu"] }),
  item("goksu", "Göksu", 33, "river", "river-mediterranean", "Toroslardan doğar, Silifke yakınında delta oluşturarak Akdeniz'e dökülür.", { branches: ["Ermenek Çayı", "Hadim Göksu"] }),
  item("firat", "Fırat", 23, "river", "river-persian-gulf", "Türkiye'nin su toplama havzası en geniş akarsuyudur; Suriye ve Irak üzerinden Basra Körfezi'ne ulaşır.", { branches: ["Karasu", "Murat", "Peri Suyu", "Tohma Çayı"] }),
  item("dicle", "Dicle", 21, "river", "river-persian-gulf", "Güneydoğu Toroslardan doğar; Irak'ta Fırat'la birleşerek Şattülarap'ı oluşturur.", { branches: ["Batman Çayı", "Botan Çayı", "Büyük Zap"] }),
  item("aras", "Aras", 4, "river", "river-caspian", "Erzurum çevresinden doğar; Türkiye-Ermenistan sınırının bir bölümünü izleyip Kura'ya katılır.", { branches: ["Arpaçay", "Zengmar Çayı"] }),
];

const agriculture: ReadySetItem[] = [
  ...mebAgricultureItems("Nohut", "agriculture-chickpea", "Kuraklığa dayanıklı ve bakımı kolay baklagildir.", [
    { id: "kirsehir", place: "Kırşehir", provinceCode: 40 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Fasulye", "agriculture-bean", "Yükseltisi 1.200 metreyi aşmayan, yazın sulanabilen ovalarda yetişir.", [
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "nigde", place: "Niğde", provinceCode: 51 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Mercimek", "agriculture-lentil", "Kuraklığa dayanıklı ve bakımı kolay baklagildir.", [
    { id: "diyarbakir", place: "Diyarbakır", provinceCode: 21 },
    { id: "yozgat", place: "Yozgat", provinceCode: 66 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Buğday", "agriculture-wheat", "İlkbahar ve sonbaharı yağışlı, yazı kurak alanlarda yetişir; Doğu Karadeniz kıyıları hariç ülke genelinde üretilebilir.", [
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
    { id: "diyarbakir", place: "Diyarbakır", provinceCode: 21 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Arpa", "agriculture-barley", "Buğdaydan erken olgunlaşır; soğuk ve sıcağa daha dayanıklıdır.", [
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
    { id: "sanliurfa", place: "Şanlıurfa", provinceCode: 63 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Mısır", "agriculture-corn", "Nemli ve ılıman bölgelerde veya sulamayla yetişir; belirtilen alanlarda ikinci ürün olarak yaygındır.", [
    { id: "cukurova", place: "Çukurova", provinceCode: 1 },
    { id: "amik", place: "Amik Ovası", provinceCode: 31 },
    { id: "guneydogu", place: "Güneydoğu Anadolu", provinceCode: 63 },
    { id: "kiyi-ege", place: "Kıyı Ege", provinceCode: 35 },
  ], MEB_AGRICULTURE_PAGE_28, "MEB dağılış bölgesi"),
  ...mebAgricultureItems("Çeltik", "agriculture-rice", "Yüksek sıcaklık ve bol su ister; akarsu boyları ile vadi tabanlarında yoğunlaşır.", [
    { id: "edirne", place: "Edirne", provinceCode: 22 },
    { id: "samsun", place: "Samsun", provinceCode: 55 },
    { id: "balikesir", place: "Balıkesir", provinceCode: 10 },
  ], MEB_AGRICULTURE_PAGE_28),
  ...mebAgricultureItems("Tütün", "agriculture-tobacco", "Kalitesiz üretimi önlemek için ekim alanları devlet tarafından sınırlandırılmıştır.", [
    { id: "denizli", place: "Denizli", provinceCode: 20 },
    { id: "manisa", place: "Manisa", provinceCode: 45 },
    { id: "adiyaman", place: "Adıyaman", provinceCode: 2 },
    { id: "samsun", place: "Samsun", provinceCode: 55 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Şeker Pancarı", "agriculture-sugar-beet", "Sökümden hemen sonra işlenmesi gerektiği için şeker fabrikaları üretim alanlarına yakın kurulur.", [
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "yozgat", place: "Yozgat", provinceCode: 66 },
    { id: "aksaray", place: "Aksaray", provinceCode: 68 },
    { id: "eskisehir", place: "Eskişehir", provinceCode: 26 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Pamuk", "agriculture-cotton", "Büyüme döneminde su, olgunlaşma döneminde kuraklık ve yüksek sıcaklık ister.", [
    { id: "sanliurfa", place: "Şanlıurfa", provinceCode: 63 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Pamuk", "agriculture-cotton", "Iğdır'da pamuk yetişmesi mikroklima koşullarının sonucudur.", [
    { id: "igdir", place: "Iğdır mikrokliması", provinceCode: 76 },
  ], MEB_AGRICULTURE_PAGE_30, "MEB mikroklima notu"),
  ...mebAgricultureItems("Zeytin", "agriculture-olive", "Akdeniz ikliminin hem sofralık hem yağlık üretilen önemli ürünüdür.", [
    { id: "manisa", place: "Manisa", provinceCode: 45 },
    { id: "aydin", place: "Aydın", provinceCode: 9 },
    { id: "bursa", place: "Bursa", provinceCode: 16 },
    { id: "balikesir", place: "Balıkesir", provinceCode: 10 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Ayçiçeği", "agriculture-sunflower", "Yetişme döneminde su, hasat döneminde kuraklık isteyen başlıca yağ bitkisidir.", [
    { id: "tekirdag", place: "Tekirdağ", provinceCode: 59 },
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "edirne", place: "Edirne", provinceCode: 22 },
    { id: "kirklareli", place: "Kırklareli", provinceCode: 39 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Fındık", "agriculture-hazelnut", "Karadeniz iklimine uyumlu ve Türkiye'nin dünyada söz sahibi olduğu üründür.", [
    { id: "ordu", place: "Ordu", provinceCode: 52 },
    { id: "giresun", place: "Giresun", provinceCode: 28 },
    { id: "sakarya", place: "Sakarya", provinceCode: 54 },
  ], MEB_AGRICULTURE_PAGE_29),
  ...mebAgricultureItems("Çay", "agriculture-tea", "Bol yağış, kalın ve kireçsiz toprak ister; yalnız Doğu Karadeniz'de yetişir.", [
    { id: "rize", place: "Rize", provinceCode: 53 },
    { id: "artvin", place: "Artvin", provinceCode: 8 },
    { id: "trabzon", place: "Trabzon", provinceCode: 61 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Yer Fıstığı", "agriculture-peanut", "Sıcak iklim ve bol su isteyen yağ bitkisidir.", [
    { id: "adana", place: "Adana", provinceCode: 1 },
    { id: "osmaniye", place: "Osmaniye", provinceCode: 80 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Üzüm", "agriculture-grape", "İklim ve toprak açısından çok seçici olmadığı için yaygın yetiştirilir.", [
    { id: "manisa", place: "Manisa", provinceCode: 45 },
    { id: "denizli", place: "Denizli", provinceCode: 20 },
    { id: "mersin", place: "Mersin", provinceCode: 33 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Soya Fasulyesi", "agriculture-soy", "Bol su ister; Karadeniz kıyıları dışında sulamayla üretilir.", [
    { id: "adana", place: "Adana", provinceCode: 1 },
    { id: "mersin", place: "Mersin", provinceCode: 33 },
    { id: "samsun", place: "Samsun", provinceCode: 55 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Antep Fıstığı", "agriculture-pistachio", "Yazları sıcak-kurak, kışları çok soğuk olmayan alanlarda yetişir.", [
    { id: "gaziantep", place: "Gaziantep", provinceCode: 27 },
    { id: "sanliurfa", place: "Şanlıurfa", provinceCode: 63 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Turunçgiller", "agriculture-citrus", "Don olayından olumsuz etkilenen Akdeniz iklimi ürünleridir.", [
    { id: "adana", place: "Adana", provinceCode: 1 },
    { id: "hatay", place: "Hatay", provinceCode: 31 },
    { id: "mersin", place: "Mersin", provinceCode: 33 },
    { id: "antalya", place: "Antalya", provinceCode: 7 },
  ], MEB_AGRICULTURE_PAGE_30),
  ...mebAgricultureItems("Turunçgiller", "agriculture-citrus", "Karadeniz kıyılarının mikroklima görülen alanlarında da yetiştirilebilir.", [
    { id: "dogu-karadeniz", place: "Doğu Karadeniz mikrokliması", provinceCode: 53 },
  ], MEB_AGRICULTURE_PAGE_30, "MEB mikroklima notu"),
];

const resources: ReadySetItem[] = [
  ...siteItems("Bakır", "mine", "mine-copper", "Elektrik-elektronik ve kablo sanayisinin önemli ham maddesidir.", [
    { id: "murgul", place: "Murgul", provinceCode: 8 },
    { id: "cayeli", place: "Çayeli", provinceCode: 53 },
    { id: "kure", place: "Küre", provinceCode: 37 },
    { id: "maden", place: "Maden", provinceCode: 23 },
  ]),
  ...siteItems("Bakır", "custom", "custom-factory", "Çıkarılan bakır cevherinin işlendiği önemli metalürji tesisidir.", [
    { id: "ergani-isletme", place: "Ergani Bakır İşletmeleri", provinceCode: 23, relation: "İşleme tesisi" },
    { id: "samsun-izabe", place: "Samsun Bakır İzabe", provinceCode: 55, relation: "İzabe / işleme tesisi" },
  ]),
  ...siteItems("Demir", "mine", "mine-iron", "Gemi, otomotiv ve inşaat sanayisinin temel ham maddesidir.", [
    { id: "divrigi", place: "Divriği", provinceCode: 58 },
    { id: "hasancelebi", place: "Hasançelebi", provinceCode: 44 },
    { id: "avnik", place: "Avnik", provinceCode: 12 },
    { id: "feke", place: "Feke-Mansurlu", provinceCode: 1 },
    { id: "kesikkopru", place: "Kesikköprü", provinceCode: 71 },
  ]),
  ...siteItems("Demir", "custom", "custom-factory", "Demir cevherini işleyen başlıca demir-çelik tesisidir.", [
    { id: "eregli", place: "Ereğli Demir-Çelik", provinceCode: 67, relation: "Demir-çelik fabrikası" },
    { id: "karabuk", place: "Karabük Demir-Çelik", provinceCode: 78, relation: "Demir-çelik fabrikası" },
    { id: "iskenderun", place: "İskenderun Demir-Çelik", provinceCode: 31, relation: "Demir-çelik fabrikası" },
  ]),
  ...siteItems("Krom", "mine", "mine-chromium", "Paslanmaz çelik, metal kaplama ve kimya sanayisinde kullanılır.", [
    { id: "guleman", place: "Guleman", provinceCode: 23 },
    { id: "kop", place: "Kop Dağı Bölgesi", provinceCode: 69 },
    { id: "fethiye", place: "Fethiye-Köyceğiz", provinceCode: 48 },
    { id: "denizli", place: "Denizli Bölgesi", provinceCode: 20 },
    { id: "mersin", place: "Mersin-Kayseri Kuşağı", provinceCode: 33 },
    { id: "bursa", place: "Bursa-Kütahya Kuşağı", provinceCode: 16 },
    { id: "iskenderun", place: "İskenderun-Gaziantep", provinceCode: 31 },
  ]),
  ...siteItems("Krom", "custom", "custom-factory", "Krom cevherini ferro-kroma dönüştüren işleme tesisidir.", [
    { id: "elazig", place: "Elazığ Ferro-Krom", provinceCode: 23, relation: "İşleme tesisi" },
    { id: "antalya", place: "Antalya Ferro-Krom", provinceCode: 7, relation: "İşleme tesisi" },
  ]),
  ...siteItems("Bor", "mine", "mine-boron", "Cam, seramik, temizlik, savunma ve enerji teknolojilerinde kullanılır.", [
    { id: "kirka", place: "Kırka", provinceCode: 26 },
    { id: "bigadic", place: "Bigadiç", provinceCode: 10 },
    { id: "kestelek", place: "Kestelek", provinceCode: 16 },
    { id: "emet", place: "Emet", provinceCode: 43 },
  ]),
  ...siteItems("Boksit", "mine", "mine-bauxite", "Alüminyumun ham maddesidir.", [
    { id: "seydisehir", place: "Seydişehir", provinceCode: 42 },
    { id: "kokaksu", place: "Kokaksu", provinceCode: 67 },
    { id: "payas", place: "Payas", provinceCode: 31 },
  ]),
  ...siteItems("Boksit", "custom", "custom-factory", "Boksitten alüminyum üreten tesistir.", [
    { id: "seydisehir-aluminyum", place: "Seydişehir Alüminyum", provinceCode: 42, relation: "İşleme tesisi" },
  ]),
  ...siteItems("Kurşun-Çinko", "mine", "mine-lead-zinc", "Akü, galvanizleme ve metal sanayisinde kullanılır.", [
    { id: "balya", place: "Balya", provinceCode: 10 },
    { id: "yenice", place: "Yenice", provinceCode: 17 },
    { id: "keban", place: "Keban", provinceCode: 23 },
    { id: "bolkar", place: "Bolkar Dağları", provinceCode: 51 },
    { id: "zamanti", place: "Zamantı", provinceCode: 38 },
    { id: "akdagmadeni", place: "Akdağmadeni", provinceCode: 66 },
    { id: "cayeli", place: "Çayeli", provinceCode: 53 },
  ]),
  ...siteItems("Fosfat", "mine", "mine-phosphate", "Başta gübre sanayisi olmak üzere kimya sanayisinde kullanılır.", [
    { id: "mazidagi", place: "Mazıdağı", provinceCode: 47 },
    { id: "adiyaman", place: "Adıyaman", provinceCode: 2 },
    { id: "bingol", place: "Bingöl", provinceCode: 12 },
    { id: "sanliurfa", place: "Şanlıurfa", provinceCode: 63 },
    { id: "bitlis", place: "Bitlis", provinceCode: 13 },
  ]),
  ...siteItems("Tuz", "mine", "mine-salt", "Gıda, kimya, dericilik ve kara yollarında kullanılır.", [
    { id: "cankiri", place: "Çankırı", provinceCode: 18 },
    { id: "gulsehir", place: "Gülşehir", provinceCode: 50 },
    { id: "yerkoy", place: "Yerköy", provinceCode: 66 },
    { id: "tuzluca", place: "Tuzluca", provinceCode: 76 },
    { id: "tuzgolu", place: "Tuz Gölü", provinceCode: 68 },
    { id: "camalti", place: "Çamaltı Tuzlası", provinceCode: 35 },
  ]),
  ...siteItems("Mermer", "mine", "mine-marble", "İnşaat, dekorasyon ve süs eşyasında kullanılan doğal taştır.", [
    { id: "marmara", place: "Marmara Adası", provinceCode: 10 },
    { id: "afyon", place: "Afyonkarahisar", provinceCode: 3 },
    { id: "bilecik", place: "Bilecik", provinceCode: 11 },
    { id: "denizli", place: "Denizli-Traverten", provinceCode: 20 },
    { id: "mugla", place: "Muğla-Milas", provinceCode: 48 },
    { id: "bursa", place: "Bursa-Gemlik", provinceCode: 16 },
  ]),
  ...siteItems("Altın", "mine", "mine-gold", "Kıymetli metal ve finansal değer taşıyan stratejik madendir.", [
    { id: "ovacik", place: "Bergama-Ovacık", provinceCode: 35, note: "Cumhuriyet döneminde resmî üretimin başladığı ilk altın madenidir." },
    { id: "kisladag", place: "Kışladağ", provinceCode: 64 },
    { id: "copler", place: "İliç-Çöpler", provinceCode: 24 },
    { id: "mastra", place: "Mastra", provinceCode: 29 },
    { id: "kaymaz", place: "Kaymaz", provinceCode: 26 },
  ]),
  ...siteItems("Lületaşı", "mine", "mine-meerschaum", "Süs eşyası, takı ve pipo yapımında kullanılır.", [
    { id: "eskisehir", place: "Eskişehir", provinceCode: 26 },
  ]),
  ...siteItems("Oltu Taşı", "mine", "mine-oltu-stone", "Tespih ve süs eşyası yapımıyla özdeşleşmiştir.", [
    { id: "oltu", place: "Oltu", provinceCode: 25 },
  ]),
  ...siteItems("Manganez", "mine", "mine-manganese", "Sert ve dayanıklı sanayi çeliği ile kimya sanayisinde kullanılır.", [
    { id: "tavas", place: "Tavas", provinceCode: 20 },
  ]),
  ...siteItems("Gümüş", "mine", "mine-silver", "Elektronik, kuyumculuk ve çeşitli sanayi kollarında kullanılan kıymetli metaldir.", [
    { id: "gumuskoy", place: "Gümüşköy", provinceCode: 43, note: "Eti Gümüş tesisi cevherden metalik gümüş üretimiyle öne çıkar." },
  ]),
  ...siteItems("Trona", "mine", "mine-trona", "Doğal soda külü üretiminin temel ham maddesidir.", [
    { id: "beypazari", place: "Beypazarı", provinceCode: 6 },
    { id: "kazan-sincan", place: "Kazan-Sincan", provinceCode: 6 },
  ]),
  ...siteItems("Taşkömürü", "energy", "energy-hard-coal", "Yüksek kalorilidir; demir-çelikte ve termik santralde kullanılır.", [
    { id: "eregli", place: "Ereğli Havzası", provinceCode: 67 },
    { id: "zonguldak", place: "Zonguldak Havzası", provinceCode: 67 },
    { id: "amasra", place: "Amasra Havzası", provinceCode: 74 },
    { id: "catalagzi", place: "Çatalağzı Termik Santrali", provinceCode: 67, relation: "Taşkömürü termik santrali" },
    { id: "erdemir", place: "Ereğli Demir-Çelik", provinceCode: 67, relation: "Taşkömürü kullanan sanayi" },
  ]),
  ...siteItems("Linyit", "energy", "energy-lignite", "Termik santrallerde ve ısınmada kullanılan düşük kalorili kömürdür.", [
    { id: "elbistan", place: "Afşin-Elbistan", provinceCode: 46 },
    { id: "soma", place: "Soma", provinceCode: 45 },
    { id: "tuncbilek", place: "Tunçbilek-Seyitömer", provinceCode: 43 },
    { id: "can", place: "Çan", provinceCode: 17 },
    { id: "yatagan", place: "Yatağan", provinceCode: 48 },
    { id: "cayirhan", place: "Nallıhan-Çayırhan", provinceCode: 6 },
    { id: "dodurga", place: "Dodurga", provinceCode: 19 },
    { id: "askale", place: "Aşkale", provinceCode: 25 },
  ]),
  ...siteItems("Petrol", "energy", "energy-petroleum", "Türkiye'nin geleneksel petrol çıkarım alanları Güneydoğu Anadolu'dadır.", [
    { id: "batman", place: "Batman", provinceCode: 72 },
    { id: "adiyaman", place: "Adıyaman", provinceCode: 2 },
    { id: "siirt", place: "Siirt", provinceCode: 56 },
    { id: "diyarbakir", place: "Diyarbakır", provinceCode: 21 },
    { id: "batman-rafineri", place: "Batman Rafinerisi", provinceCode: 72, relation: "Rafineri" },
    { id: "kirikkale-rafineri", place: "Kırıkkale Rafinerisi", provinceCode: 71, relation: "Rafineri" },
    { id: "izmit-rafineri", place: "İzmit Rafinerisi", provinceCode: 41, relation: "Rafineri" },
    { id: "aliaga-rafineri", place: "Aliağa Rafinerisi", provinceCode: 35, relation: "Rafineri" },
  ]),
  ...siteItems("Doğal Gaz", "energy", "energy-natural-gas", "Fosil yakıtlar içinde görece daha temiz enerji kaynağıdır.", [
    { id: "hamitabat", place: "Hamitabat", provinceCode: 39 },
    { id: "camurlu", place: "Çamurlu", provinceCode: 47 },
    { id: "sakarya-gaz", place: "Sakarya Gaz Sahası", provinceCode: 67, relation: "Deniz üretim sahası" },
    { id: "ambarli", place: "Ambarlı Termik Santrali", provinceCode: 34, relation: "Doğal gaz santrali" },
    { id: "ovaakca", place: "Ovaakça Termik Santrali", provinceCode: 16, relation: "Doğal gaz santrali" },
  ]),
  ...siteItems("Rüzgâr Enerjisi", "energy", "energy-wind", "Ege ve Marmara kıyılarında yoğunlaşan temiz ve tükenmez enerji kaynağıdır.", [
    { id: "balikesir", place: "Balıkesir", provinceCode: 10 },
    { id: "izmir", place: "İzmir-Çeşme", provinceCode: 35 },
    { id: "manisa", place: "Manisa", provinceCode: 45 },
    { id: "canakkale", place: "Çanakkale", provinceCode: 17 },
    { id: "hatay", place: "Hatay", provinceCode: 31 },
    { id: "osmaniye", place: "Osmaniye", provinceCode: 80 },
  ]),
  ...siteItems("Jeotermal Enerji", "energy", "energy-geothermal", "Elektrik, sera ısıtması ve termal turizmde kullanılır.", [
    { id: "germencik", place: "Germencik", provinceCode: 9 },
    { id: "saraykoy", place: "Sarayköy", provinceCode: 20 },
    { id: "alasehir", place: "Alaşehir", provinceCode: 45 },
    { id: "afyon", place: "Afyonkarahisar", provinceCode: 3 },
  ]),
  ...siteItems("Güneş Enerjisi", "energy", "energy-solar", "Güneşlenme süresi yüksek iç ve güney bölgelerde potansiyeli fazladır.", [
    { id: "karapinar", place: "Karapınar GES", provinceCode: 42 },
    { id: "sanliurfa", place: "Şanlıurfa", provinceCode: 63 },
    { id: "karaman", place: "Karaman", provinceCode: 70 },
    { id: "antalya", place: "Antalya", provinceCode: 7 },
  ]),
  ...siteItems("Hidroelektrik", "energy", "energy-hydroelectric", "Yükselti, eğim ve akıştan yararlanarak elektrik üretilir.", [
    { id: "ataturk", place: "Atatürk Barajı", provinceCode: 63 },
    { id: "keban", place: "Keban Barajı", provinceCode: 23 },
    { id: "karakaya", place: "Karakaya Barajı", provinceCode: 44 },
    { id: "deriner", place: "Deriner Barajı", provinceCode: 8 },
    { id: "altinkaya", place: "Altınkaya Barajı", provinceCode: 55 },
  ]),
];

const trade: ReadySetItem[] = [
  item("istanbul-port", "İstanbul Limanları", 34, "city", "city-port", "Boğazlar üzerindeki konumu, büyük pazar ve ulaşım bağlantılarıyla dış ticaretin ana düğümlerindendir."),
  item("izmir-port", "İzmir / Alsancak Limanı", 35, "city", "city-port", "Ege'nin tarım ve sanayi hinterlandını dış pazarlara bağlayan önemli limandır."),
  item("mersin-port", "Mersin Limanı", 33, "city", "city-port", "Çukurova ve Güneydoğu Anadolu'nun dış ticaret kapılarındandır; geniş hinterlanda sahiptir."),
  item("iskenderun-port", "İskenderun Limanı", 31, "city", "city-port", "Doğu Akdeniz'de demir-çelik ve sanayi yükleriyle öne çıkan limandır."),
  item("samsun-port", "Samsun Limanı", 55, "city", "city-port", "Orta Karadeniz'in İç Anadolu bağlantılı önemli ticaret limanıdır."),
  item("trabzon-port", "Trabzon Limanı", 61, "city", "city-port", "Doğu Karadeniz'in tarihî transit ticaret ve deniz ulaşımı merkezidir."),
  item("bandirma-port", "Bandırma Limanı", 10, "city", "city-port", "Güney Marmara'nın sanayi ve tarım ürünlerini İstanbul ve dış pazarlara bağlar."),
  item("derince-port", "Derince Limanı", 41, "city", "city-port", "İzmit Körfezi'nde sanayi hinterlandına hizmet veren yük limanıdır."),
  item("kapikule", "Kapıkule Sınır Kapısı", 22, "city", "city-border-gate", "Türkiye'nin Avrupa kara ve demir yolu ticaretindeki en önemli sınır geçişlerindendir."),
  item("habur", "Habur Sınır Kapısı", 73, "city", "city-border-gate", "Irak yönündeki kara yolu ticaretinin başlıca sınır kapısıdır."),
  item("gurbulak", "Gürbulak Sınır Kapısı", 4, "city", "city-border-gate", "İran ve Orta Asya yönündeki kara yolu ticaretinde önemlidir."),
  item("cilvegozu", "Cilvegözü Sınır Kapısı", 31, "city", "city-border-gate", "Suriye yönündeki kara yolu geçişlerinden biridir."),
];

const industry: ReadySetItem[] = [
  ...siteItems("Demir-Çelik", "custom", "custom-factory", "Ağır sanayinin temel üretim koludur.", [
    { id: "eregli", place: "Ereğli Demir-Çelik", provinceCode: 67, note: "Taşkömürü havzası ve liman etkili olmuştur." },
    { id: "karabuk", place: "Karabük Demir-Çelik", provinceCode: 78, note: "Cumhuriyet döneminin ilk ağır sanayi tesislerindendir." },
    { id: "iskenderun", place: "İskenderun Demir-Çelik", provinceCode: 31, note: "İthal ham madde ve deniz ulaşımı avantajlıdır." },
  ]),
  ...siteItems("Maden İşleme", "custom", "custom-factory", "Maden cevherini sanayide kullanılabilir ürüne dönüştürür.", [
    { id: "ergani", place: "Ergani Bakır İşletmeleri", provinceCode: 23 },
    { id: "kirka", place: "Kırka Bor İşletmesi", provinceCode: 26 },
    { id: "antalya-krom", place: "Antalya Ferro-Krom", provinceCode: 7 },
    { id: "seydisehir", place: "Seydişehir Alüminyum", provinceCode: 42 },
    { id: "samsun-bakir", place: "Samsun Bakır İzabe", provinceCode: 55 },
  ]),
  ...siteItems("Petrol Rafinerisi", "custom", "custom-factory", "Ham petrolü akaryakıt ve petrokimya girdilerine dönüştürür.", [
    { id: "ipras", place: "İPRAŞ-İzmit", provinceCode: 41 },
    { id: "aliaga", place: "Aliağa", provinceCode: 35 },
    { id: "kirikkale", place: "Orta Anadolu-Kırıkkale", provinceCode: 71 },
    { id: "batman", place: "Batman Rafinerisi", provinceCode: 72, note: "Yalnız Türkiye'de çıkarılan petrolü işler." },
  ]),
  ...siteItems("Otomotiv", "custom", "custom-factory", "Pazar, ulaşım, iş gücü ve yan sanayi nedeniyle Marmara'da yoğunlaşır.", [
    { id: "bursa", place: "Bursa", provinceCode: 16 },
    { id: "kocaeli", place: "Kocaeli", provinceCode: 41 },
    { id: "sakarya", place: "Sakarya", provinceCode: 54 },
    { id: "istanbul", place: "İstanbul", provinceCode: 34 },
    { id: "izmir", place: "İzmir", provinceCode: 35 },
  ]),
  ...siteItems("Traktör", "custom", "custom-factory", "Tarım makinesi ve traktör üretim merkezidir.", [
    { id: "adapazari", place: "Adapazarı", provinceCode: 54 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
    { id: "istanbul", place: "İstanbul", provinceCode: 34 },
    { id: "tekirdag", place: "Tekirdağ", provinceCode: 59 },
    { id: "konya", place: "Konya", provinceCode: 42 },
  ]),
  ...siteItems("Beyaz Eşya", "custom", "custom-factory", "Dayanıklı tüketim malları üreten makine sanayisi koludur.", [
    { id: "istanbul", place: "İstanbul", provinceCode: 34 },
    { id: "izmir", place: "İzmir", provinceCode: 35 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
    { id: "bursa", place: "Bursa", provinceCode: 16 },
    { id: "gaziantep", place: "Gaziantep", provinceCode: 27 },
    { id: "manisa", place: "Manisa", provinceCode: 45 },
  ]),
  ...siteItems("Lokomotif ve Raylı Sistem", "custom", "custom-factory", "Demir yolu araçları ve lokomotif üretim-bakım merkezidir.", [
    { id: "adapazari", place: "Adapazarı", provinceCode: 54 },
    { id: "eskisehir", place: "Eskişehir", provinceCode: 26 },
    { id: "sivas", place: "Sivas", provinceCode: 58 },
    { id: "ankara", place: "Ankara", provinceCode: 6 },
  ]),
  ...siteItems("Tersane", "custom", "custom-factory", "Gemi yapımı ve bakım-onarım faaliyetlerinin yoğunlaştığı merkezdir.", [
    { id: "golcuk", place: "Gölcük", provinceCode: 41 },
    { id: "tuzla", place: "Tuzla", provinceCode: 34 },
    { id: "pendik", place: "Pendik", provinceCode: 34 },
    { id: "halic", place: "Haliç", provinceCode: 34 },
    { id: "bodrum-yat", place: "Bodrum Yat Sanayisi", provinceCode: 48 },
  ]),
  ...siteItems("Şeker Sanayisi", "custom", "custom-factory", "Bozulabilir ve taşınması maliyetli pancar nedeniyle ham maddeye yakın kurulur.", [
    { id: "konya", place: "Konya", provinceCode: 42 },
    { id: "eskisehir", place: "Eskişehir", provinceCode: 26 },
    { id: "kayseri", place: "Kayseri", provinceCode: 38 },
    { id: "turhal", place: "Turhal", provinceCode: 60 },
    { id: "erzurum", place: "Erzurum", provinceCode: 25 },
  ]),
  ...siteItems("Yağ Sanayisi", "custom", "custom-factory", "Tarım ürününün yetiştiği alana yakın gelişen gıda sanayisidir.", [
    { id: "edirne-aycicek", place: "Edirne-Ayçiçeği Yağı", provinceCode: 22 },
    { id: "tekirdag-aycicek", place: "Tekirdağ-Ayçiçeği Yağı", provinceCode: 59 },
    { id: "edremit-zeytin", place: "Edremit-Zeytinyağı", provinceCode: 10 },
    { id: "ayvalik-zeytin", place: "Ayvalık-Zeytinyağı", provinceCode: 10 },
    { id: "gemlik-zeytin", place: "Gemlik-Zeytinyağı", provinceCode: 16 },
    { id: "adana-misir", place: "Adana-Mısır/Soya Yağı", provinceCode: 1 },
  ]),
  ...siteItems("Çay Sanayisi", "custom", "custom-factory", "Çay yaprağı çabuk bozulduğu için üretim alanına yakın kurulmuştur.", [
    { id: "rize", place: "Rize", provinceCode: 53 },
    { id: "trabzon", place: "Trabzon", provinceCode: 61 },
    { id: "artvin", place: "Artvin", provinceCode: 8 },
  ]),
  ...siteItems("Pamuklu Dokuma", "custom", "custom-factory", "Pamuk tarımı, pazar, ulaşım ve iş gücüyle ilişkili sanayi koludur.", [
    { id: "adana", place: "Adana", provinceCode: 1 },
    { id: "izmir", place: "İzmir", provinceCode: 35 },
    { id: "denizli", place: "Denizli", provinceCode: 20 },
    { id: "aydin", place: "Aydın", provinceCode: 9 },
    { id: "manisa", place: "Manisa", provinceCode: 45 },
    { id: "gaziantep", place: "Gaziantep", provinceCode: 27 },
    { id: "bursa", place: "Bursa", provinceCode: 16 },
    { id: "kayseri", place: "Kayseri", provinceCode: 38 },
  ]),
  ...siteItems("Halı ve Kilim", "custom", "custom-factory", "Geleneksel dokuma ile modern sanayinin birlikte görüldüğü merkezlerdir.", [
    { id: "isparta", place: "Isparta", provinceCode: 32 },
    { id: "bunyan", place: "Bünyan", provinceCode: 38 },
    { id: "demirci", place: "Demirci-Gördes-Kula", provinceCode: 45 },
    { id: "hereke", place: "Hereke", provinceCode: 41 },
    { id: "usak", place: "Uşak", provinceCode: 64 },
    { id: "gaziantep", place: "Gaziantep", provinceCode: 27 },
  ]),
  ...siteItems("Kâğıt Sanayisi", "custom", "custom-factory", "Orman ürünü, su ve ulaşım koşullarıyla ilişkili sanayi koludur.", [
    { id: "izmit", place: "İzmit", provinceCode: 41 },
    { id: "caycuma", place: "Çaycuma", provinceCode: 67 },
    { id: "dalaman", place: "Dalaman", provinceCode: 48 },
    { id: "balikesir", place: "Balıkesir", provinceCode: 10 },
    { id: "taskopru", place: "Taşköprü", provinceCode: 37 },
  ]),
  ...siteItems("Gübre Sanayisi", "custom", "custom-factory", "Kimya sanayisinin tarımsal üretime girdi sağlayan koludur.", [
    { id: "bandirma", place: "Bandırma", provinceCode: 10 },
    { id: "aliaga", place: "Aliağa", provinceCode: 35 },
    { id: "kocaeli", place: "Kocaeli", provinceCode: 41 },
    { id: "iskenderun", place: "İskenderun", provinceCode: 31 },
    { id: "ceyhan", place: "Ceyhan", provinceCode: 1 },
    { id: "mersin", place: "Mersin", provinceCode: 33 },
    { id: "kutahya", place: "Kütahya", provinceCode: 43 },
    { id: "gemlik", place: "Gemlik", provinceCode: 16 },
    { id: "samsun", place: "Samsun", provinceCode: 55 },
  ]),
  ...siteItems("Seramik-Porselen", "custom", "custom-factory", "Kil ve kaolen gibi ham maddelere dayalı sanayi koludur.", [
    { id: "can", place: "Çan", provinceCode: 17 },
    { id: "bozuyuk", place: "Bozüyük-Söğüt", provinceCode: 11 },
    { id: "kutahya", place: "Kütahya", provinceCode: 43 },
    { id: "eskisehir", place: "Eskişehir", provinceCode: 26 },
    { id: "izmir", place: "İzmir", provinceCode: 35 },
  ]),
];

export const READY_STUDY_SETS: ReadyStudySet[] = [
  {
    id: "mountains",
    title: "Türkiye'nin Dağları",
    shortTitle: "Dağlar",
    subject: "Yeryüzü şekilleri",
    description: "KPSS ve TYT için başlıca dağlar; kıvrım, kırık (horst) ve volkanik oluşumlarına göre ayrılmıştır.",
    color: "#a85d42",
    icon: "mountain",
    quizLabel: "Dağın bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS.mountains,
    keyFacts: [
      "Kuzey Anadolu Dağları ve Toroslar, Alp-Himalaya sistemine bağlı genç kıvrım dağlarıdır.",
      "Ege Bölgesi'nde kırılma sonucu yükselen horstlar ile çöken grabenler yan yana bulunur.",
      "Ağrı, Tendürek, Süphan, Nemrut ve Erciyes Türkiye'nin başlıca volkanik dağlarındandır.",
      "Karadeniz ve Akdeniz'de dağların kıyıya paralel uzanması kıyı ile iç kesimler arasındaki ulaşımı zorlaştırır.",
    ],
    items: mountains,
  },
  {
    id: "lakes",
    title: "Türkiye'nin Gölleri",
    shortTitle: "Göller",
    subject: "Sular coğrafyası",
    description: "Başlıca doğal ve yapay göller; oluşum türleri ve ayırt edici özellikleriyle birlikte.",
    color: "#4d91bd",
    icon: "waves",
    quizLabel: "Gölün bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS.lakes,
    keyFacts: [
      "Van Gölü Türkiye'nin en büyük gölü, Beyşehir Gölü en büyük tatlı su gölüdür.",
      "Beyşehir ve Eğirdir tektonik-karstik; Van Gölü tektonik-volkanik set oluşumludur.",
      "Abant, Sera ve Tortum heyelan seti; Meke ve Nemrut volkanik kökenli göllerdir.",
      "Baraj gölleri sulama, enerji üretimi, taşkın kontrolü ve içme suyu gibi amaçlarla oluşturulur.",
    ],
    items: lakes,
  },
  {
    id: "rivers",
    title: "Türkiye'nin Akarsuları",
    shortTitle: "Akarsular",
    subject: "Havzalar ve kollar",
    description: "Başlıca akarsu sistemleri; döküldükleri havza, önemli kolları ve sınavlık özellikleriyle.",
    color: "#397ca8",
    icon: "spline",
    quizLabel: "Akarsuyun geçtiği başlangıç ilini bul",
    quizQuestions: QUIZ_BANKS.rivers,
    keyFacts: [
      "Türkiye akarsularının rejimi genellikle düzensiz, yatak eğimleri ve hidroelektrik potansiyelleri yüksektir.",
      "Kızılırmak, tamamı Türkiye sınırları içindeki en uzun akarsudur.",
      "Asi ve Meriç yurt dışından Türkiye'ye girer; Çoruh Türkiye'den doğup Gürcistan'da Karadeniz'e dökülür.",
      "Fırat ve Dicle Türkiye'den doğar, ülke dışında birleşerek Basra Körfezi'ne ulaşır.",
      "Fırat, Karasu ve Murat'ın birleşmesiyle oluşur; Bartın Çayı'nın bazı kesimlerinde ulaşım yapılabilir.",
    ],
    items: rivers,
  },
  {
    id: "agriculture",
    title: "Türkiye'de Tarım Ürünleri",
    shortTitle: "Tarım",
    subject: "Üretim ve dağılış",
    description: "Sınavlarda sık sorulan tarım ürünleri; iklim isteği ve öne çıkan üretim alanlarıyla.",
    color: "#4f8b67",
    icon: "sprout",
    quizLabel: "Ürünün öne çıktığı ili bul",
    quizQuestions: QUIZ_BANKS.agriculture,
    keyFacts: [
      "Buğday, Doğu Karadeniz kıyıları dışında Türkiye'nin büyük bölümünde yetiştirilebilir.",
      "Çay yalnızca bol yağışlı ve kireçsiz topraklara sahip Doğu Karadeniz'de yetişir.",
      "Fındık, incir, kayısı ve turunçgiller Türkiye'nin önemli ihraç ürünlerindendir.",
      "Haşhaş, kenevir, çeltik ve tütün gibi bazı ürünlerin yetiştirilmesi devlet iznine bağlıdır.",
    ],
    items: agriculture,
  },
  {
    id: "resources",
    title: "Maden ve Enerji Kaynakları",
    shortTitle: "Maden & Enerji",
    subject: "Yer altı kaynakları",
    description: "Başlıca madenler, çıkarıldıkları alanlar ve fosil-yenilenebilir enerji kaynakları.",
    color: "#80649b",
    icon: "pickaxe",
    quizLabel: "Kaynağın öne çıktığı ili bul",
    quizQuestions: QUIZ_BANKS.resources,
    keyFacts: [
      "Rezerv, yataktaki toplam maden miktarı; tenör ise ayrıştırma sonrası elde edilen net maden oranıyla ilgilidir.",
      "Bor yataklarında Eskişehir-Kırka, Kütahya-Emet, Balıkesir-Bigadiç ve Bursa-Kestelek öne çıkar.",
      "Taşkömürü Zonguldak çevresinde, petrol üretimi geleneksel olarak Güneydoğu Anadolu'da yoğunlaşır.",
      "Ege'de jeotermal ve rüzgâr, Doğu Anadolu'da hidroelektrik enerji potansiyeli yüksektir.",
    ],
    items: resources,
  },
  {
    id: "trade",
    title: "Ticaret ve Ulaşım Düğümleri",
    shortTitle: "Ticaret",
    subject: "Limanlar ve sınır kapıları",
    description: "Türkiye'nin başlıca ticaret limanları, sınır kapıları ve hinterland ilişkileri.",
    color: "#c77c38",
    icon: "ship",
    quizLabel: "Ticaret düğümünün bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS.trade,
    keyFacts: [
      "Limanın gelişmesini yalnız kıyı yapısı değil, gerisindeki üretim ve ulaşım alanı olan hinterlandı da belirler.",
      "İstanbul ve Çanakkale boğazları Karadeniz'i Akdeniz'e bağlayan stratejik su yollarıdır.",
      "İzmir, Mersin, İskenderun, Samsun ve Trabzon Türkiye'nin başlıca dış ticaret limanlarındandır.",
      "Kapıkule Avrupa, Habur Irak ve Gürbulak İran yönündeki kara yolu ticaretinde öne çıkar.",
    ],
    items: trade,
  },
  {
    id: "industry",
    title: "Sanayi ve Fabrikalar",
    shortTitle: "Sanayi",
    subject: "Üretim merkezleri",
    description: "Demir-çelikten otomotive, tekstilden gıdaya başlıca sanayi tesisleri ve kuruluş nedenleri.",
    color: "#5b6f69",
    icon: "factory",
    quizLabel: "Sanayi merkezinin bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS.industry,
    keyFacts: [
      "Sanayi tesislerinin kuruluşunda ham madde, enerji, sermaye, iş gücü, ulaşım ve pazar etkili olur.",
      "Demir-çelik tesisleri Karabük, Ereğli ve İskenderun'da; otomotiv Bursa, Kocaeli ve Sakarya'da öne çıkar.",
      "Tarıma dayalı sanayi çoğunlukla bozulabilir veya taşınması zor ham maddeye yakın kurulur.",
      "İstanbul-İzmit çevresi pazar, ulaşım, sermaye ve iş gücü avantajlarıyla Türkiye'nin en yoğun sanayi alanıdır.",
    ],
    items: industry,
  },
];

export function getReadySet(id?: string) {
  return READY_STUDY_SETS.find((set) => set.id === id);
}
