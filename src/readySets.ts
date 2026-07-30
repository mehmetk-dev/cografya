import { MOUNTAIN_ATLAS_ENTRIES } from "./mountainAtlas";
import type {
  MapPresentation,
  MarkerKind,
  MarkerSubtype,
} from "./types";
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
  presentation?: MapPresentation;
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
const MEB_PLATEAUS_PAGE =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-cografya/files/basic-html/page76.html";
const MEB_EKPSS_GEOGRAPHY_BOOK =
  "https://orgm.meb.gov.tr/ekpssmebozel/content/magazines/pdf/cografya2.pdf";
const DKMP_NATIONAL_PARKS =
  "https://www.tarimorman.gov.tr/DKMP/Menu/27/Milli-Parklar%3B";

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

const mountains: ReadySetItem[] = MOUNTAIN_ATLAS_ENTRIES.map((entry) =>
  item(
    entry.id,
    entry.label,
    entry.provinceCode,
    "mountain",
    entry.subtype,
    entry.description,
    {
      image: entry.image,
      topic:
        entry.subtype === "mountain-volcanic"
          ? "Volkanik Dağlar"
          : entry.subtype === "mountain-fault-block"
            ? "Kırık Dağlar (Horst)"
            : "Kıvrım Dağları",
      sourceLabel: entry.sourceLabel,
      sourceUrl: entry.sourceUrl,
    },
  ),
);

const plateau = (
  id: string,
  label: string,
  provinceCode: number,
  subtype: MarkerSubtype,
  topic: string,
  place: string,
  description: string,
  sourceUrl = MEB_PLATEAUS_PAGE,
  sourceLabel = "MEBİ TYT sayfa 76",
) =>
  item(id, label, provinceCode, "plain", subtype, description, {
    topic,
    place,
    relation: "Plato–il/bölge eşleştirmesi",
    sourceLabel,
    sourceUrl,
  });

const plateaus: ReadySetItem[] = [
  plateau("plateau-haymana", "Haymana Platosu", 6, "plain-plateau-tabular", "Tabaka düzlüğü", "Ankara", "Ankara'nın güneyinde yer alan İç Anadolu tabaka düzlüğü platosudur."),
  plateau("plateau-cihanbeyli", "Cihanbeyli Platosu", 42, "plain-plateau-tabular", "Tabaka düzlüğü", "Konya", "Konya'nın kuzeyinde yer alan geniş İç Anadolu platosudur."),
  plateau("plateau-bozok", "Bozok Platosu", 66, "plain-plateau-tabular", "Tabaka düzlüğü", "Yozgat", "Yozgat çevresinde Kızılırmak yayı içinde uzanan tabaka düzlüğü platosudur.", MEB_EKPSS_GEOGRAPHY_BOOK, "MEB e-KPSS sayfa 59"),
  plateau("plateau-obruk", "Obruk Platosu", 42, "plain-plateau-tabular", "Tabaka düzlüğü", "Konya", "Konya'nın güneydoğusunda, karstik çukurlarıyla da tanınan tabaka düzlüğü platosudur."),
  plateau("plateau-uzunyayla", "Uzunyayla Platosu", 38, "plain-plateau-tabular", "Tabaka düzlüğü", "Kayseri-Sivas", "Kayseri ile Sivas arasında uzanan yüksek İç Anadolu platosudur."),
  plateau("plateau-gaziantep", "Gaziantep Platosu", 27, "plain-plateau-tabular", "Tabaka düzlüğü", "Gaziantep", "Fırat'ın batısında yer alan Güneydoğu Anadolu platosudur."),
  plateau("plateau-sanliurfa", "Şanlıurfa Platosu", 63, "plain-plateau-tabular", "Tabaka düzlüğü", "Şanlıurfa", "Fırat'ın doğusunda geniş alan kaplayan Güneydoğu Anadolu platosudur."),
  plateau("plateau-yazilikaya", "Yazılıkaya Platosu", 26, "plain-plateau-tabular", "Tabaka düzlüğü", "Eskişehir-Afyonkarahisar", "İç Batı Anadolu'da Frigya Yazılıkaya çevresinde uzanan platodur."),
  plateau("plateau-usak-esme", "Uşak-Eşme Platosu", 64, "plain-plateau-tabular", "Tabaka düzlüğü", "Uşak", "MEBİ TYT özetinde İç Batı Anadolu'nun başlıca platoları arasında gösterilir."),
  plateau("plateau-teke", "Teke Platosu", 7, "plain-plateau-karstic", "Karstik", "Antalya", "Antalya'nın batısında, kalkerli arazide gelişmiş karstik platodur."),
  plateau("plateau-taseli", "Taşeli Platosu", 33, "plain-plateau-karstic", "Karstik", "Antalya-Mersin", "Orta Toroslar'da Antalya ile Mersin arasında uzanan karstik platodur."),
  plateau("plateau-erzurum-kars", "Erzurum-Kars Platosu", 36, "plain-plateau-volcanic", "Volkanik", "Erzurum-Kars", "Lav örtülerinin akarsularla yarılması sonucu oluşmuş yüksek volkanik platodur."),
  plateau("plateau-ardahan", "Ardahan Platosu", 75, "plain-plateau-volcanic", "Volkanik", "Ardahan", "Doğu Anadolu'nun kuzeydoğusunda yer alan yüksek volkanik platodur."),
  plateau("plateau-catalca-kocaeli", "Çatalca-Kocaeli Platosu", 41, "plain-plateau-erosion", "Aşınım düzlüğü", "İstanbul-Kocaeli", "Deniz seviyesine yakın eski aşınım yüzeyleri üzerinde gelişmiş platodur."),
  plateau("plateau-persembe", "Perşembe Platosu", 52, "plain-plateau-erosion", "Aşınım düzlüğü", "Ordu", "Ordu çevresinde denize yakın eski aşınım yüzeyleri üzerinde gelişmiş platodur."),
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
].map((entry) => ({
  ...entry,
  topic:
    entry.subtype === "river-black-sea"
      ? "Karadeniz Havzası"
      : entry.subtype === "river-aegean"
        ? "Ege Denizi Havzası"
        : entry.subtype === "river-mediterranean"
          ? "Akdeniz Havzası"
          : entry.subtype === "river-persian-gulf"
            ? "Basra Körfezi Havzası"
            : "Hazar Havzası",
}));

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

type NationalPark = {
  id: string;
  name: string;
  provinceCode: number;
  provinces: string;
  declaredAt: string;
  historical?: boolean;
  note?: string;
};

const nationalParkData: NationalPark[] = [
  { id: "nemrut-dagi", name: "Nemrut Dağı Millî Parkı", provinceCode: 2, provinces: "Adıyaman-Malatya", declaredAt: "7 Aralık 1988", note: "Kommagene kalıntılarıyla tanınır; Bitlis'teki volkanik Nemrut Dağı ile karıştırılmamalıdır." },
  { id: "akdag", name: "Akdağ Millî Parkı", provinceCode: 3, provinces: "Afyonkarahisar-Denizli", declaredAt: "17 Ocak 2024" },
  { id: "baskomutan", name: "Başkomutan Tarihî Millî Parkı", provinceCode: 3, provinces: "Afyonkarahisar-Kütahya-Uşak", declaredAt: "8 Kasım 1981", historical: true, note: "MEBİ'nin millî park örnekleri arasında vurguladığı tarihî alandır." },
  { id: "agri-dagi", name: "Ağrı Dağı Millî Parkı", provinceCode: 4, provinces: "Ağrı-Iğdır", declaredAt: "17 Kasım 2004", note: "Yaklaşık 88 bin hektarla güncel resmî listedeki en geniş millî parktır." },
  { id: "soguksu", name: "Soğuksu Millî Parkı", provinceCode: 6, provinces: "Ankara", declaredAt: "19 Şubat 1959" },
  { id: "sakarya-meydan-muharebesi", name: "Sakarya Meydan Muharebesi Tarihî Millî Parkı", provinceCode: 6, provinces: "Ankara", declaredAt: "8 Şubat 2015", historical: true, note: "Polatlı-Haymana çevresindedir; Sakarya iliyle karıştırılmamalıdır." },
  { id: "saricali-dagi", name: "Sarıçalı Dağı Millî Parkı", provinceCode: 6, provinces: "Ankara", declaredAt: "28 Ekim 2021" },
  { id: "gulluk-dagi-termessos", name: "Güllük Dağı-Termessos Millî Parkı", provinceCode: 7, provinces: "Antalya", declaredAt: "3 Kasım 1970" },
  { id: "beydaglari-sahil", name: "Beydağları Sahil Millî Parkı", provinceCode: 7, provinces: "Antalya", declaredAt: "16 Mart 1972" },
  { id: "altinbesik-magarasi", name: "Altınbeşik Mağarası Millî Parkı", provinceCode: 7, provinces: "Antalya", declaredAt: "31 Ağustos 1994" },
  { id: "koprulu-kanyon", name: "Köprülü Kanyon Millî Parkı", provinceCode: 7, provinces: "Antalya-Isparta", declaredAt: "12 Aralık 1973" },
  { id: "hatila-vadisi", name: "Hatila Vadisi Millî Parkı", provinceCode: 8, provinces: "Artvin", declaredAt: "31 Ağustos 1994" },
  { id: "kackar-daglari", name: "Kaçkar Dağları Millî Parkı", provinceCode: 8, provinces: "Artvin", declaredAt: "31 Ağustos 1994", note: "Güncel DKMP listesinde Artvin ile eşleştirilir; dağ sırası Rize-Artvin kuşağındadır." },
  { id: "dilek-yarimadasi", name: "Dilek Yarımadası-Büyük Menderes Deltası Millî Parkı", provinceCode: 9, provinces: "Aydın", declaredAt: "19 Mayıs 1966" },
  { id: "kuscenneti", name: "Kuşcenneti Millî Parkı", provinceCode: 10, provinces: "Balıkesir", declaredAt: "27 Temmuz 1959", note: "Manyas Kuş Gölü çevresindedir." },
  { id: "kazdagi", name: "Kazdağı Millî Parkı", provinceCode: 10, provinces: "Balıkesir", declaredAt: "17 Nisan 1993" },
  { id: "kop-dagi-mudafaasi", name: "Kop Dağı Müdafaası Tarihî Millî Parkı", provinceCode: 69, provinces: "Bayburt-Erzurum", declaredAt: "15 Kasım 2016", historical: true },
  { id: "yedigoller", name: "Yedigöller Millî Parkı", provinceCode: 14, provinces: "Bolu", declaredAt: "29 Nisan 1965" },
  { id: "abant-golu", name: "Abant Gölü Millî Parkı", provinceCode: 14, provinces: "Bolu", declaredAt: "10 Haziran 2022" },
  { id: "uludag", name: "Uludağ Millî Parkı", provinceCode: 16, provinces: "Bursa", declaredAt: "20 Eylül 1961" },
  { id: "troya", name: "Troya Tarihî Millî Parkı", provinceCode: 17, provinces: "Çanakkale", declaredAt: "7 Kasım 1996", historical: true },
  { id: "bogazkoy-alacahoyuk", name: "Boğazköy-Alacahöyük Millî Parkı", provinceCode: 19, provinces: "Çorum", declaredAt: "21 Eylül 1988", historical: true },
  { id: "honaz-dagi", name: "Honaz Dağı Millî Parkı", provinceCode: 20, provinces: "Denizli", declaredAt: "21 Nisan 1998" },
  { id: "gala-golu", name: "Gala Gölü Millî Parkı", provinceCode: 22, provinces: "Edirne", declaredAt: "5 Mart 2005" },
  { id: "nene-hatun", name: "Nene Hatun Tarihî Millî Parkı", provinceCode: 25, provinces: "Erzurum", declaredAt: "6 Haziran 2009", historical: true },
  { id: "cilo-sat-daglari", name: "Hakkâri Cilo ve Sat Dağları Millî Parkı", provinceCode: 30, provinces: "Hakkâri", declaredAt: "26 Eylül 2020" },
  { id: "kizildag", name: "Kızıldağ Millî Parkı", provinceCode: 32, provinces: "Isparta", declaredAt: "9 Mayıs 1969" },
  { id: "kovada-golu", name: "Kovada Gölü Millî Parkı", provinceCode: 32, provinces: "Isparta", declaredAt: "3 Kasım 1970" },
  { id: "geben-vadisi", name: "Geben Vadisi Millî Parkı", provinceCode: 46, provinces: "Kahramanmaraş", declaredAt: "30 Mayıs 2025", note: "Güncel 50 parklık resmî listenin en son ilan edilen parkıdır." },
  { id: "sarikamis-allahuekber", name: "Sarıkamış-Allahuekber Dağları Millî Parkı", provinceCode: 36, provinces: "Kars-Erzurum", declaredAt: "19 Ekim 2004" },
  { id: "kure-daglari", name: "Küre Dağları Millî Parkı", provinceCode: 37, provinces: "Kastamonu-Bartın", declaredAt: "7 Temmuz 2000" },
  { id: "ilgaz-dagi", name: "Ilgaz Dağı Millî Parkı", provinceCode: 37, provinces: "Kastamonu-Çankırı", declaredAt: "2 Haziran 1976" },
  { id: "istiklal-yolu", name: "İstiklal Yolu Tarihî Millî Parkı", provinceCode: 37, provinces: "Kastamonu-Çankırı", declaredAt: "2 Kasım 2018", historical: true, note: "MEBİ'nin millî park örnekleri arasında vurguladığı tarihî güzergâhtır." },
  { id: "sultan-sazligi", name: "Sultan Sazlığı Millî Parkı", provinceCode: 38, provinces: "Kayseri", declaredAt: "17 Mart 2006" },
  { id: "igneada-longoz", name: "İğneada Longoz Ormanları Millî Parkı", provinceCode: 39, provinces: "Kırklareli", declaredAt: "13 Kasım 2007" },
  { id: "beysehir-golu", name: "Beyşehir Gölü Millî Parkı", provinceCode: 42, provinces: "Konya", declaredAt: "11 Ocak 1993" },
  { id: "derebucak-camlik-magaralari", name: "Derebucak Çamlık Mağaraları Millî Parkı", provinceCode: 42, provinces: "Konya", declaredAt: "7 Haziran 2022" },
  { id: "spil-dagi", name: "Spil Dağı Millî Parkı", provinceCode: 45, provinces: "Manisa", declaredAt: "22 Nisan 1968" },
  { id: "marmaris", name: "Marmaris Millî Parkı", provinceCode: 48, provinces: "Muğla", declaredAt: "8 Mart 1996" },
  { id: "saklikent", name: "Saklıkent Millî Parkı", provinceCode: 48, provinces: "Muğla-Antalya", declaredAt: "6 Haziran 1996" },
  { id: "malazgirt", name: "Malazgirt Meydan Muharebesi Tarihî Millî Parkı", provinceCode: 49, provinces: "Muş", declaredAt: "17 Mart 2018", historical: true, note: "MEBİ'nin millî park örnekleri arasında vurguladığı tarihî alandır." },
  { id: "aladaglar", name: "Aladağlar Millî Parkı", provinceCode: 51, provinces: "Niğde-Adana-Kayseri", declaredAt: "21 Nisan 1995" },
  { id: "karatepe-aslantas", name: "Karatepe-Aslantaş Millî Parkı", provinceCode: 80, provinces: "Osmaniye", declaredAt: "29 Mayıs 1958" },
  { id: "karagol-sahara", name: "Karagöl-Sahara Millî Parkı", provinceCode: 53, provinces: "Rize-Artvin", declaredAt: "31 Ağustos 1994" },
  { id: "botan-vadisi", name: "Botan Vadisi Millî Parkı", provinceCode: 56, provinces: "Siirt", declaredAt: "15 Ağustos 2019" },
  { id: "divrigi", name: "Divriği Millî Parkı", provinceCode: 58, provinces: "Sivas", declaredAt: "2 Kasım 2024" },
  { id: "tek-tek-daglari", name: "Tek Tek Dağları Millî Parkı", provinceCode: 63, provinces: "Şanlıurfa", declaredAt: "29 Mayıs 2007" },
  { id: "altindere-vadisi", name: "Altındere Vadisi Millî Parkı", provinceCode: 61, provinces: "Trabzon", declaredAt: "9 Eylül 1987", note: "Sümela Manastırı'nın bulunduğu vadiyi kapsar." },
  { id: "munzur-vadisi", name: "Munzur Vadisi Millî Parkı", provinceCode: 62, provinces: "Tunceli", declaredAt: "21 Aralık 1971" },
  { id: "yozgat-camligi", name: "Yozgat Çamlığı Millî Parkı", provinceCode: 66, provinces: "Yozgat", declaredAt: "5 Şubat 1958", note: "Türkiye'nin ilk millî parkıdır." },
];

const nationalParks: ReadySetItem[] = nationalParkData.map((park) =>
  item(
    `national-park-${park.id}`,
    park.name,
    park.provinceCode,
    "tourism",
    park.historical ? "tourism-historical" : "tourism-nature",
    `${park.provinces} sınırlarında yer alır; ${park.declaredAt} tarihinde ilan edilmiştir.${park.note ? ` ${park.note}` : ""}`,
    {
      topic: park.historical ? "Tarihî millî parklar" : "Doğal millî parklar",
      place: park.provinces,
      relation: park.historical
        ? "Tarihî millî park–il eşleştirmesi"
        : "Millî park–il eşleştirmesi",
      sourceLabel: "DKMP güncel liste",
      sourceUrl: DKMP_NATIONAL_PARKS,
    },
  ),
);

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
    description: "KPSS ve TYT için Türkiye'nin 68 önemli dağı; referans atlas düzeninde, kıvrım, kırık (horst) ve volkanik gruplarıyla birlikte gösterilir. Dağ sıraları birden fazla ile uzanabilir.",
    color: "#a85d42",
    icon: "mountain",
    presentation: "mountain-atlas",
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
    id: "plateaus",
    title: "Türkiye'nin Platoları",
    shortTitle: "Platolar",
    subject: "Yeryüzü şekilleri",
    description: "MEBİ TYT ve MEB e-KPSS haritalarında öne çıkan 15 plato; tabaka düzlüğü, karstik, volkanik ve aşınım düzlüğü gruplarıyla.",
    color: "#b58a3c",
    icon: "land",
    quizLabel: "Platonun bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS.plateaus,
    keyFacts: [
      "Platoların Türkiye'de en geniş yer kapladığı bölge İç Anadolu'dur.",
      "Teke ve Taşeli karstik; Erzurum-Kars ve Ardahan volkanik platolardır.",
      "Çatalca-Kocaeli ile Perşembe, deniz seviyesine yakın aşınım düzlüğü platolarıdır.",
      "Haymana Ankara; Cihanbeyli ve Obruk Konya; Bozok Yozgat ile eşleştirilir.",
    ],
    items: plateaus,
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
    description: "Başlıca akarsu sistemleri; ana yatakları kalın, önemli kolları ince çizgilerle şematik olarak gösterilir. Havza, akış yönü ve kol bağlantıları birlikte çalışılabilir.",
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
    id: "national-parks",
    title: "Türkiye'nin Millî Parkları",
    shortTitle: "Millî Parklar",
    subject: "Korunan alanlar ve tarihî parklar",
    description: "DKMP'nin güncel resmî listesindeki 50 millî park; MEBİ'de vurgulanan tarihî parklar ve KPSS'de öne çıkan il–park eşleştirmeleriyle.",
    color: "#3f7c58",
    icon: "tree",
    quizLabel: "Millî parkın bulunduğu ili bul",
    quizQuestions: QUIZ_BANKS["national-parks"],
    keyFacts: [
      "Türkiye'nin ilk millî parkı, 5 Şubat 1958'de ilan edilen Yozgat Çamlığı'dır.",
      "Ağrı Dağı yaklaşık 88 bin hektarla güncel resmî listedeki en geniş millî parktır.",
      "MEBİ; Başkomutan, İstiklal Yolu, Malazgirt ve Sakarya Meydan Muharebesi tarihî millî parklarını özellikle örnekler.",
      "Sakarya Meydan Muharebesi Parkı Ankara'da; Nemrut Dağı Millî Parkı Adıyaman-Malatya sınırındadır.",
    ],
    items: nationalParks,
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
