export type HistoryEventKind =
  | "reform"
  | "constitution"
  | "war"
  | "treaty"
  | "diplomacy"
  | "turning-point";

export type HistorySource = {
  label: string;
  url: string;
};

export type HistoryEvent = {
  id: string;
  topicId: string;
  dateLabel: string;
  sortKey: number;
  title: string;
  eyebrow: string;
  kind: HistoryEventKind;
  summary: string;
  cause: string;
  result: string;
  actors: string[];
  keywords: string[];
  examNote: string;
  source: HistorySource;
};

export type HistoryTopic = {
  id: string;
  shortTitle: string;
  title: string;
  description: string;
  period: string;
  color: string;
  events: HistoryEvent[];
};

export type HistoryProgress = {
  visitedEventIds: string[];
  chronologyAttempts: number;
  chronologyCorrect: number;
  outcomeAttempts: number;
  outcomeCorrect: number;
  updatedAt: string;
};

export type ChronologyRound = {
  cards: HistoryEvent[];
  correctOrder: string[];
};

export type HistoryOutcomeQuestion = {
  eventId: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
};

export const HISTORY_PROGRESS_KEY = "kpss-atlasim-history-progress-v1";
export const HISTORY_PROGRESS_CHANGED_EVENT =
  "kpss-atlasim:history-progress-changed";

const MEB_TYT_HISTORY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/tyt-tarih/files/basic-html";
const MEB_AYT_HISTORY =
  "https://ogmmateryal.eba.gov.tr/kitap/mebi-konu-ozetleri/ayt-tarih/files/basic-html";

function source(book: "TYT" | "AYT", page: number): HistorySource {
  return {
    label: `MEBİ ${book} Tarih Konu Özetleri · s. ${page}`,
    url: `${book === "TYT" ? MEB_TYT_HISTORY : MEB_AYT_HISTORY}/page${page}.html`,
  };
}

const ottomanDissolutionEvents: HistoryEvent[] = [
  {
    id: "tanzimat-1839",
    topicId: "ottoman-dissolution",
    dateLabel: "1839",
    sortKey: 1839,
    title: "Tanzimat Fermanı",
    eyebrow: "HUKUK VE MERKEZÎLEŞME",
    kind: "reform",
    summary:
      "Osmanlı yönetimi iç bütünlüğü korumak, devletin zayıflamasını engellemek ve Avrupa kamuoyunun desteğini kazanmak için kapsamlı bir yenileşme programı ilan etti.",
    cause:
      "Milliyetçilik etkisiyle ayrılıkçı hareketlerin güçlenmesi, iç ve dış sorunların büyümesi ve Osmanlı birliğini koruyacak daha kapsamlı düzenlemelere ihtiyaç duyulması.",
    result:
      "Padişah hukukun üstünlüğünü kabul etti; modernleşme devlet siyaseti hâline geldi ve anayasal yönetime giden yolda önemli bir adım atıldı.",
    actors: ["Sultan Abdülmecid", "Koca Hüsrev Paşa"],
    keywords: ["Tanzimat", "hukukun üstünlüğü", "Osmanlı birliği"],
    examNote:
      "MEBİ, Tanzimat Fermanı’nı modernleşmeyi devlet siyaseti hâline getiren resmî belge olarak vurgular.",
    source: source("TYT", 127),
  },
  {
    id: "islahat-1856",
    topicId: "ottoman-dissolution",
    dateLabel: "1856",
    sortKey: 1856,
    title: "Islahat Fermanı",
    eyebrow: "AZINLIK HAKLARI",
    kind: "reform",
    summary:
      "Paris Konferansı öncesinde ilan edilen ferman, özellikle gayrimüslimlere yönelik hakları genişletti ve Tanzimat kararlarını yeniledi.",
    cause:
      "Rusya’nın Hristiyan kamuoyunu yanına çekmesini önlemek, İngiltere ve Fransa’nın taleplerini karşılamak ve azınlıkların imparatorluktan ayrılma çabalarını durdurmak.",
    result:
      "Gayrimüslimlere yeni haklar tanındı; ferman Paris Antlaşması’na eklenerek Osmanlı iç düzenlemelerinin uluslararası siyasetin konusu hâline gelmesine yol açtı.",
    actors: ["Sultan Abdülmecid", "İngiltere", "Fransa"],
    keywords: ["Islahat", "Paris Antlaşması", "gayrimüslimler"],
    examNote:
      "Azınlıklara yönelik hazırlanması ve Paris Antlaşması’nda yer alması, Tanzimat’tan ayıran temel ipuçlarıdır.",
    source: source("TYT", 127),
  },
  {
    id: "kanun-i-esasi-1876",
    topicId: "ottoman-dissolution",
    dateLabel: "1876",
    sortKey: 1876,
    title: "Kanun-ı Esasi ve I. Meşrutiyet",
    eyebrow: "İLK ANAYASA",
    kind: "constitution",
    summary:
      "Mithat Paşa başkanlığındaki komisyonun hazırladığı 119 maddelik Kanun-ı Esasi ilan edildi ve Osmanlı Devleti anayasal yönetime geçti.",
    cause:
      "Dış sorunlara çözüm bulma, içeride devlet-toplum ilişkisini iyileştirme ve Osmanlı Devleti’ni Avrupa siyasi sistemine yaklaştırma isteği.",
    result:
      "Âyan ve Mebusan meclislerinden oluşan Meclis-i Umumi açıldı; dönem, anayasanın askıya alınıp meclisin tatil edildiği 1878’e kadar sürdü.",
    actors: ["II. Abdülhamid", "Mithat Paşa", "Mebusan Meclisi"],
    keywords: ["Kanun-ı Esasi", "I. Meşrutiyet", "Meclis-i Umumi"],
    examNote:
      "1876–1878 arası I. Meşrutiyet’tir; Mebusan üyelerinin sınırlı da olsa halk tarafından seçilmesi demokratikleşme adımıdır.",
    source: source("TYT", 128),
  },
  {
    id: "berlin-1878",
    topicId: "ottoman-dissolution",
    dateLabel: "1878",
    sortKey: 1878,
    title: "Berlin Antlaşması",
    eyebrow: "93 HARBİ SONRASI",
    kind: "treaty",
    summary:
      "93 Harbi sonrasında imzalanan Ayastefanos Antlaşması’nın Rusya lehine bozduğu Avrupa dengesi, Berlin Konferansı’nda yeniden düzenlendi.",
    cause:
      "Rusya’nın Panslavizm siyaseti, 1877–1878 Osmanlı-Rus Savaşı ve Ayastefanos Antlaşması’nın Avrupa’daki güç dengesini Rusya lehine değiştirmesi.",
    result:
      "Berlin Antlaşması imzalandı; MEBİ’nin vurgusuyla Ermeni Meselesi ilk kez uluslararası bir sorun niteliği kazandı.",
    actors: ["Osmanlı Devleti", "Rusya", "İngiltere", "Avusturya"],
    keywords: ["93 Harbi", "Ayastefanos", "Berlin", "Ermeni Meselesi"],
    examNote:
      "Ermeni Meselesi’nin uluslararası sorun hâline gelmesi Berlin Antlaşması’nın ayırıcı sonucudur.",
    source: source("TYT", 125),
  },
  {
    id: "second-constitutional-1908",
    topicId: "ottoman-dissolution",
    dateLabel: "1908",
    sortKey: 1908,
    title: "II. Meşrutiyet",
    eyebrow: "ANAYASANIN DÖNÜŞÜ",
    kind: "constitution",
    summary:
      "İttihat ve Terakki’nin harekete geçmesi ve askerî baskı sonucunda Kanun-ı Esasi yeniden yürürlüğe kondu, mebus seçimleri yapıldı.",
    cause:
      "1908’de içeride ve dışarıda yaşanan gelişmelerin yarattığı baskı ile İttihat ve Terakki mensubu askerlerin anayasal düzeni yeniden kurma isteği.",
    result:
      "Otuz yıllık aradan sonra meclis açıldı; siyasal örgütlenme ve toplantı hakkı genişledi, gerçek anlamda siyasi partiler kurulmaya başladı.",
    actors: ["II. Abdülhamid", "İttihat ve Terakki Cemiyeti"],
    keywords: ["II. Meşrutiyet", "İttihat ve Terakki", "siyasi partiler"],
    examNote:
      "23 Temmuz 1908’de Kanun-ı Esasi yeniden yürürlüğe girdi; ilk meclis 17 Aralık 1908’de açıldı.",
    source: source("TYT", 129),
  },
  {
    id: "march-31-1909",
    topicId: "ottoman-dissolution",
    dateLabel: "1909",
    sortKey: 1909,
    title: "31 Mart Vakası",
    eyebrow: "REJİME TEPKİ",
    kind: "turning-point",
    summary:
      "Yeni rejime karşı başlayan darbe girişimi, Selanik’ten gelen Hareket Ordusu tarafından bastırıldı.",
    cause:
      "II. Meşrutiyet sonrasında yeni rejime karşı oluşan muhalefet, askerî ve toplumsal gerilimler ile bazı grupların ayrıcalıklarını kaybetmesi.",
    result:
      "II. Abdülhamid tahttan indirildi, V. Mehmet Reşad tahta çıktı ve anayasal düzen devam etti.",
    actors: [
      "Mahmud Şevket Paşa",
      "Mustafa Kemal Bey",
      "II. Abdülhamid",
    ],
    keywords: ["31 Mart", "Hareket Ordusu", "V. Mehmet Reşad"],
    examNote:
      "Olay 13 Nisan 1909’da yaşandı; adı Rûmî takvimdeki 31 Mart 1325 tarihinden gelir.",
    source: source("TYT", 131),
  },
  {
    id: "balkan-wars-1912",
    topicId: "ottoman-dissolution",
    dateLabel: "1912–1913",
    sortKey: 1912,
    title: "Balkan Savaşları",
    eyebrow: "BALKANLARIN KAYBI",
    kind: "war",
    summary:
      "Osmanlı Devleti Trablusgarp’ta İtalya ile savaşırken Balkan devletleri birleşerek Osmanlı Devleti’ne savaş açtı.",
    cause:
      "Bulgaristan, Yunanistan, Sırbistan ve Karadağ’ın Osmanlı Devleti’nin zor durumundan yararlanarak Balkan topraklarını paylaşmak istemesi.",
    result:
      "Osmanlı Devleti Balkan topraklarının hemen hemen tamamını kaybetti; bölgedeki siyasi ve demografik yapı köklü biçimde değişti.",
    actors: [
      "Osmanlı Devleti",
      "Bulgaristan",
      "Yunanistan",
      "Sırbistan",
      "Karadağ",
    ],
    keywords: ["Balkan Savaşları", "Trablusgarp", "toprak kaybı"],
    examNote:
      "Savaşlar, Osmanlı Devleti’nin Trablusgarp’ta İtalya ile mücadele ettiği sırada başladı.",
    source: source("AYT", 155),
  },
  {
    id: "babiali-1913",
    topicId: "ottoman-dissolution",
    dateLabel: "1913",
    sortKey: 1913,
    title: "Bâbıâli Baskını",
    eyebrow: "İKTİDAR DEĞİŞİMİ",
    kind: "turning-point",
    summary:
      "İttihat ve Terakki, Kâmil Paşa Hükûmeti’ne karşı gerçekleştirdiği Bâbıâli Baskını ile iktidarı ele geçirdi.",
    cause:
      "Balkan Savaşları sırasında Edirne’nin Bulgarlara bırakılacağı yönündeki iddialar ve İttihatçıların hükûmete karşı yükselttiği muhalefet.",
    result:
      "İttihat ve Terakki iktidarı ele aldı ve Osmanlı Devleti’ni I. Dünya Savaşı’nın sonuna kadar tek partili bir rejimle yönetti.",
    actors: ["İttihat ve Terakki", "Kâmil Paşa"],
    keywords: ["Bâbıâli Baskını", "1913 Darbesi", "İttihat ve Terakki"],
    examNote:
      "1913 Bâbıâli Baskını’nın temel sonucu İttihat ve Terakki’nin savaş sonuna kadar iktidarı elinde tutmasıdır.",
    source: source("AYT", 153),
  },
  {
    id: "german-alliance-1914",
    topicId: "ottoman-dissolution",
    dateLabel: "2 Ağustos 1914",
    sortKey: 1914,
    title: "Osmanlı–Almanya İttifakı",
    eyebrow: "I. DÜNYA SAVAŞI",
    kind: "treaty",
    summary:
      "İngiltere’nin ittifak teklifini kabul etmemesinin ardından Osmanlı Devleti ile Almanya arasında gizli ittifak antlaşması imzalandı.",
    cause:
      "Osmanlı Devleti’nin yalnızlıktan çıkmak istemesi, İngiltere’nin tarafsızlık önermesi ve Almanya ile II. Abdülhamid döneminden beri gelişen ilişkiler.",
    result:
      "Osmanlı Devleti Almanya’nın yanında yer alan ittifak sistemine bağlandı ve kısa süre sonra I. Dünya Savaşı’na katıldı.",
    actors: ["Osmanlı Devleti", "Almanya", "İngiltere"],
    keywords: ["Almanya", "ittifak", "I. Dünya Savaşı"],
    examNote:
      "Antlaşma 2 Ağustos 1914’te imzalandı; Osmanlı Devleti önce İngiltere’ye ittifak teklif etmişti.",
    source: source("AYT", 155),
  },
  {
    id: "mondros-1918",
    topicId: "ottoman-dissolution",
    dateLabel: "30 Ekim 1918",
    sortKey: 1918,
    title: "Mondros Ateşkes Antlaşması",
    eyebrow: "SAVAŞIN SONU",
    kind: "treaty",
    summary:
      "I. Dünya Savaşı’nın İtilaf Devletleri üstünlüğüyle sona ermesi üzerine Osmanlı heyeti ile İtilaf temsilcileri Mondros Limanı’nda ateşkes imzaladı.",
    cause:
      "Bulgaristan’ın savaştan çekilmesi, İngilizlerin İstanbul’a yönelmesi ve İttihat ve Terakki Hükûmeti’nin savaşı sürdüremeyecek duruma gelmesi.",
    result:
      "Osmanlı Devleti için I. Dünya Savaşı sona erdi; savunma ve ulaşım imkânlarını sınırlayan hükümler işgallerin önünü açtı.",
    actors: ["Rauf Orbay", "Ahmet İzzet Paşa", "Amiral Calthorpe"],
    keywords: ["Mondros", "ateşkes", "30 Ekim 1918"],
    examNote:
      "Görüşmeler Limni Adası’ndaki Mondros Limanı’nda Agamemnon zırhlısında yapıldı.",
    source: source("TYT", 154),
  },
];

const ataturkForeignPolicyEvents: HistoryEvent[] = [
  {
    id: "lausanne-1923",
    topicId: "ataturk-foreign-policy",
    dateLabel: "24 Temmuz 1923",
    sortKey: 1923,
    title: "Lozan Barış Antlaşması",
    eyebrow: "YENİ DEVLETİN TEMELİ",
    kind: "treaty",
    summary:
      "İsmet Paşa başkanlığındaki Türk heyeti, tam bağımsızlık ve ülke bütünlüğü ilkelerinden taviz vermeden barış görüşmelerini yürüttü.",
    cause:
      "Mudanya Ateşkes Antlaşması’yla çatışmaların sona ermesi ve Millî Mücadele’nin siyasi sonuçlarını uluslararası bir barış antlaşmasına bağlama ihtiyacı.",
    result:
      "Yeni Türk devletinin sınır ve bağımsızlık meselelerinin büyük bölümü çözüldü; Musul, nüfus mübadelesi ve bazı ekonomik konular sonraki yıllara kaldı.",
    actors: ["İsmet Paşa", "TBMM Hükûmeti", "İtilaf Devletleri"],
    keywords: ["Lozan", "tam bağımsızlık", "Misak-ı Millî"],
    examNote:
      "Türk heyetine Ermeni yurdu ve kapitülasyonlar konusunda taviz verilmemesi talimatı verildi.",
    source: source("AYT", 197),
  },
  {
    id: "population-exchange",
    topicId: "ataturk-foreign-policy",
    dateLabel: "1923–1930",
    sortKey: 1923.5,
    title: "Nüfus Mübadelesi",
    eyebrow: "TÜRKİYE–YUNANİSTAN",
    kind: "diplomacy",
    summary:
      "Lozan’da kararlaştırılan nüfus değişiminde kimlerin yerleşik sayılacağı Türkiye ile Yunanistan arasında uzun süren bir anlaşmazlık oluşturdu.",
    cause:
      "Yunanistan’ın İstanbul’da daha fazla Rum bırakmak ve Batı Trakya Türklerinin bir bölümünü mübadele kapsamına almak istemesi.",
    result:
      "10 Haziran 1930 Ankara Antlaşması’yla İstanbul Rumları ve Batı Trakya Türkleri yerleşme tarihlerine bakılmadan yerleşik sayıldı; yakınlaşma dönemi başladı.",
    actors: ["Türkiye", "Yunanistan", "Venizelos", "İsmet İnönü"],
    keywords: ["mübadele", "etabli", "Yunanistan", "Ankara Antlaşması"],
    examNote:
      "İstanbul Rumları ile Batı Trakya Türkleri mübadelenin dışında bırakılmıştır.",
    source: source("AYT", 214),
  },
  {
    id: "foreign-schools",
    topicId: "ataturk-foreign-policy",
    dateLabel: "1920’ler",
    sortKey: 1925,
    title: "Yabancı Okullar Sorunu",
    eyebrow: "TÜRKİYE–FRANSA",
    kind: "diplomacy",
    summary:
      "Tevhid-i Tedrisat Kanunu uyarınca yabancı okullarda Türkçe, tarih ve coğrafya derslerinin Türk öğretmenlerce Türkçe okutulması istendi.",
    cause:
      "Eğitimde birlik sağlama ve Türkiye’de faaliyet gösteren yabancı okulları millî eğitim mevzuatına bağlama kararı.",
    result:
      "Fransa’nın itirazına karşı Türkiye konunun bir iç mesele olduğunu savundu; Fransa geri adım atmak zorunda kaldı.",
    actors: ["Türkiye", "Fransa", "Millî Eğitim Bakanlığı"],
    keywords: ["yabancı okullar", "Tevhid-i Tedrisat", "iç mesele"],
    examNote:
      "Sorunun dış politikadaki ana kavramı egemenliktir: Türkiye yabancı müdahalesini kabul etmedi.",
    source: source("AYT", 215),
  },
  {
    id: "mosul-1926",
    topicId: "ataturk-foreign-policy",
    dateLabel: "5 Haziran 1926",
    sortKey: 1926,
    title: "Musul Sorunu ve Ankara Antlaşması",
    eyebrow: "TÜRKİYE–İNGİLTERE",
    kind: "treaty",
    summary:
      "Lozan’da çözülemeyen Musul meselesi Türkiye ile İngiltere arasındaki görüşmelerden sonra Milletler Cemiyeti’ne taşındı.",
    cause:
      "Irak sınırının Lozan’da belirlenememesi, Türkiye’nin Misak-ı Millî hedefi ve İngiltere’nin Musul’u Irak’a bırakmak istemesi.",
    result:
      "1926 Ankara Antlaşması’yla Musul Irak’a bırakıldı; petrol gelirlerinin yüzde 10’unun 25 yıl süreyle Türkiye’ye verilmesi kabul edildi.",
    actors: ["Türkiye", "İngiltere", "Irak", "Milletler Cemiyeti"],
    keywords: ["Musul", "Irak sınırı", "1926 Ankara Antlaşması"],
    examNote:
      "Musul, Lozan’da çözülemeyip daha sonra Ankara Antlaşması’yla sonuçlanan sınır sorunudur.",
    source: source("AYT", 214),
  },
  {
    id: "ottoman-debts-1928",
    topicId: "ataturk-foreign-policy",
    dateLabel: "13 Haziran 1928",
    sortKey: 1928,
    title: "Osmanlı Dış Borçları",
    eyebrow: "TÜRKİYE–FRANSA",
    kind: "treaty",
    summary:
      "Lozan sonrasında Osmanlı borçlarının ödeme süresi ve hangi para birimiyle ödeneceği Türkiye ile Fransa arasında tartışıldı.",
    cause:
      "Osmanlı Devleti’nin en fazla Fransa’ya borçlanmış olması ve Lozan sonrasında borçların yeni devletler arasında paylaştırılması.",
    result:
      "13 Haziran 1928 antlaşmasıyla ödemeler bir sisteme bağlandı; Türkiye son taksidi 1954’te ödedi.",
    actors: ["Türkiye", "Fransa"],
    keywords: ["dış borçlar", "Fransa", "1928"],
    examNote:
      "Borç sorunu 1928’de sisteme bağlandı; son taksit 1954’te ödendi.",
    source: source("AYT", 215),
  },
  {
    id: "league-of-nations-1932",
    topicId: "ataturk-foreign-policy",
    dateLabel: "18 Temmuz 1932",
    sortKey: 1932,
    title: "Milletler Cemiyeti’ne Giriş",
    eyebrow: "DÜNYA BARIŞI",
    kind: "diplomacy",
    summary:
      "Milletler Cemiyeti, Yunanistan ve İspanya’nın önerisiyle Türkiye’yi üyeliğe davet etti.",
    cause:
      "Türkiye’nin barışçı dış politika izlemesi ve uluslararası iş birliğine katılma isteğinin güçlenmesi.",
    result:
      "Türkiye daveti dünya barışını koruma niyetinin göstergesi olarak kabul etti ve 18 Temmuz 1932’de örgüte katıldı.",
    actors: ["Türkiye", "Milletler Cemiyeti", "Yunanistan", "İspanya"],
    keywords: ["Milletler Cemiyeti", "1932", "dünya barışı"],
    examNote:
      "Türkiye örgüte başvuruyla değil, davet üzerine katıldı.",
    source: source("AYT", 215),
  },
  {
    id: "balkan-entente-1934",
    topicId: "ataturk-foreign-policy",
    dateLabel: "9 Şubat 1934",
    sortKey: 1934,
    title: "Balkan Antantı",
    eyebrow: "BATI SINIRLARI",
    kind: "diplomacy",
    summary:
      "Türkiye, Yunanistan, Yugoslavya ve Romanya Balkanlarda güvenliği ve mevcut sınırları korumak amacıyla bir araya geldi.",
    cause:
      "İtalya ve Almanya’daki totaliter rejimlerin saldırgan ve yayılmacı politikalarının Balkan ülkelerinde güvenlik kaygısı oluşturması.",
    result:
      "Dört devlet Balkan Antantı’nı kurdu; yayılmacı Bulgaristan ile İtalya’nın baskısı altındaki Arnavutluk birliğe katılmadı.",
    actors: ["Türkiye", "Yunanistan", "Yugoslavya", "Romanya"],
    keywords: ["Balkan Antantı", "1934", "Bulgaristan", "Arnavutluk"],
    examNote:
      "Üyeler Türkiye, Yunanistan, Yugoslavya ve Romanya’dır; Bulgaristan ve Arnavutluk üye değildir.",
    source: source("AYT", 216),
  },
  {
    id: "montreux-1936",
    topicId: "ataturk-foreign-policy",
    dateLabel: "20 Temmuz 1936",
    sortKey: 1936,
    title: "Montrö Boğazlar Sözleşmesi",
    eyebrow: "BOĞAZLARDA EGEMENLİK",
    kind: "treaty",
    summary:
      "Türkiye değişen güvenlik şartlarını gerekçe göstererek Lozan’ın Boğazlar düzenini yeniden gündeme taşıdı.",
    cause:
      "İtalya’nın Habeşistan’a, Japonya’nın Mançurya’ya saldırması ve Lozan’da Boğazların bir komisyon tarafından yönetilmesinin Türkiye için güvenlik riski oluşturması.",
    result:
      "Boğazlar Komisyonu kaldırıldı ve yönetim Türkiye’ye geçti; ticaret gemilerine serbestlik, savaş gemilerine sınırlamalar getirildi.",
    actors: ["Türkiye", "Milletler Cemiyeti", "Boğazlar Komisyonu"],
    keywords: ["Montrö", "Boğazlar", "egemenlik", "1936"],
    examNote:
      "Montrö’nün ayırıcı sonucu Boğazlar Komisyonu’nun kaldırılması ve yönetimin Türkiye’ye geçmesidir.",
    source: source("AYT", 216),
  },
  {
    id: "sadabad-1937",
    topicId: "ataturk-foreign-policy",
    dateLabel: "1937",
    sortKey: 1937,
    title: "Sadabat Paktı",
    eyebrow: "DOĞU SINIRLARI",
    kind: "diplomacy",
    summary:
      "Türkiye, Irak, İran ve Afganistan doğu sınırlarında güvenlik ve iş birliği amacıyla Sadabat Paktı’nı kurdu.",
    cause:
      "İtalya’nın Habeşistan’ı işgal etmesi ve doğu ülkelerini hedef alan yayılmacı siyasetinin bölgesel güvenlik kaygısını artırması.",
    result:
      "Dört ülke arasında bölgesel dayanışma kuruldu; Türkiye ile Hatay, Irak ile toprak sorunu bulunan Suriye pakta katılmadı.",
    actors: ["Türkiye", "Irak", "İran", "Afganistan"],
    keywords: ["Sadabat", "1937", "doğu sınırları", "Suriye"],
    examNote:
      "Balkan Antantı batıda; Sadabat Paktı doğuda güvenlik iş birliğidir.",
    source: source("AYT", 216),
  },
  {
    id: "hatay-1939",
    topicId: "ataturk-foreign-policy",
    dateLabel: "1936–1939",
    sortKey: 1939,
    title: "Hatay’ın Türkiye’ye Katılması",
    eyebrow: "MİSAK-I MİLLÎ",
    kind: "diplomacy",
    summary:
      "Fransa’nın Suriye’den çekilme kararı üzerine Türkiye, Hatay halkının kendi geleceğine karar vermesi için Milletler Cemiyeti’ne başvurdu.",
    cause:
      "Hatay’ın Lozan’da Türkiye sınırları dışında kalması ve Fransa’nın 1936’da Suriye’den çekilme kararı alması.",
    result:
      "1938’de Hatay Devleti kuruldu; Hatay Meclisinin kararıyla bölge 23 Temmuz 1939’da Türkiye’ye katıldı.",
    actors: ["Türkiye", "Fransa", "Milletler Cemiyeti", "Hatay Meclisi"],
    keywords: ["Hatay", "1939", "Fransa", "Misak-ı Millî"],
    examNote:
      "Hatay Devleti 2 Eylül 1938’de kuruldu; katılma 23 Temmuz 1939’da gerçekleşti.",
    source: source("AYT", 215),
  },
];

export const HISTORY_TOPICS: HistoryTopic[] = [
  {
    id: "ottoman-dissolution",
    shortTitle: "Osmanlı Dağılma",
    title: "Osmanlı Dağılma Dönemi",
    description:
      "Modernleşme adımlarından I. Dünya Savaşı’nın sonuna uzanan olayları neden–sonuç ilişkisiyle kur.",
    period: "1839–1918",
    color: "#a9524f",
    events: ottomanDissolutionEvents,
  },
  {
    id: "ataturk-foreign-policy",
    shortTitle: "Atatürk Dış Politika",
    title: "Atatürk Dönemi Türk Dış Politikası",
    description:
      "Lozan sonrasında kalan sorunları, barışçı ittifakları ve egemenlik kazanımlarını birbirine bağla.",
    period: "1923–1939",
    color: "#2f6b68",
    events: ataturkForeignPolicyEvents,
  },
];

const ALL_HISTORY_EVENTS = HISTORY_TOPICS.flatMap((topic) => topic.events);

export function getHistoryTopic(topicId: string) {
  return HISTORY_TOPICS.find((topic) => topic.id === topicId);
}

export function getHistoryEvent(eventId: string) {
  return ALL_HISTORY_EVENTS.find((event) => event.id === eventId);
}

export function filterHistoryEvents(
  topics: HistoryTopic[],
  query: string,
): HistoryEvent[] {
  const normalized = query.trim().toLocaleLowerCase("tr-TR");
  if (!normalized) return topics.flatMap((topic) => topic.events);

  return topics
    .flatMap((topic) => topic.events)
    .filter((event) =>
      [
        event.title,
        event.dateLabel,
        event.summary,
        event.cause,
        event.result,
        event.examNote,
        ...event.actors,
        ...event.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalized),
    );
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function buildChronologyRound(
  topic: HistoryTopic,
  limit = 5,
  random = Math.random,
): ChronologyRound {
  const count = Math.max(2, Math.min(limit, topic.events.length));
  const selected = shuffle(topic.events, random)
    .slice(0, count)
    .sort((left, right) => left.sortKey - right.sortKey);

  let cards = shuffle(selected, random);
  if (
    cards.length > 2 &&
    cards.every((card, index) => card.id === selected[index]?.id)
  ) {
    cards = [cards[1], cards[0], ...cards.slice(2)];
  }

  return {
    cards,
    correctOrder: selected.map((event) => event.id),
  };
}

export function evaluateChronology(
  answer: string[],
  correctOrder: string[],
) {
  return (
    answer.length === correctOrder.length &&
    answer.every((eventId, index) => eventId === correctOrder[index])
  );
}

export function buildOutcomeQuestion(
  eventId: string,
  choiceCount = 4,
  random = Math.random,
): HistoryOutcomeQuestion | null {
  const event = getHistoryEvent(eventId);
  if (!event) return null;
  const topic = getHistoryTopic(event.topicId);
  if (!topic) return null;

  const distractors = shuffle(
    topic.events
      .filter((candidate) => candidate.id !== event.id)
      .map((candidate) => candidate.result),
    random,
  ).slice(0, Math.max(1, choiceCount - 1));
  const choices = shuffle([event.result, ...distractors], random);

  return {
    eventId: event.id,
    prompt: `“${event.title}” gelişmesinin sonucu hangisidir?`,
    choices,
    correctAnswer: event.result,
  };
}

export function emptyHistoryProgress(): HistoryProgress {
  return {
    visitedEventIds: [],
    chronologyAttempts: 0,
    chronologyCorrect: 0,
    outcomeAttempts: 0,
    outcomeCorrect: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

export function parseHistoryProgress(value: string | null): HistoryProgress {
  if (!value) return emptyHistoryProgress();
  try {
    const parsed = JSON.parse(value) as Partial<HistoryProgress>;
    if (
      !Array.isArray(parsed.visitedEventIds) ||
      !parsed.visitedEventIds.every((id) => typeof id === "string") ||
      typeof parsed.chronologyAttempts !== "number" ||
      !Number.isInteger(parsed.chronologyAttempts) ||
      typeof parsed.chronologyCorrect !== "number" ||
      !Number.isInteger(parsed.chronologyCorrect) ||
      typeof parsed.outcomeAttempts !== "number" ||
      !Number.isInteger(parsed.outcomeAttempts) ||
      typeof parsed.outcomeCorrect !== "number" ||
      !Number.isInteger(parsed.outcomeCorrect) ||
      typeof parsed.updatedAt !== "string"
    ) {
      return emptyHistoryProgress();
    }
    return {
      visitedEventIds: [...new Set(parsed.visitedEventIds)],
      chronologyAttempts: Math.max(0, parsed.chronologyAttempts),
      chronologyCorrect: Math.max(0, parsed.chronologyCorrect),
      outcomeAttempts: Math.max(0, parsed.outcomeAttempts),
      outcomeCorrect: Math.max(0, parsed.outcomeCorrect),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return emptyHistoryProgress();
  }
}

export function loadHistoryProgress() {
  try {
    return parseHistoryProgress(
      window.localStorage.getItem(HISTORY_PROGRESS_KEY),
    );
  } catch {
    return emptyHistoryProgress();
  }
}

export function saveHistoryProgress(progress: HistoryProgress) {
  const next = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(
      HISTORY_PROGRESS_KEY,
      JSON.stringify(next),
    );
    window.dispatchEvent(new Event(HISTORY_PROGRESS_CHANGED_EVENT));
  } catch {
    // Depolama kapalıysa çalışma oturum içinde devam eder.
  }
  return next;
}
