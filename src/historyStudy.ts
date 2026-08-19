export type HistoryEventKind =
  | "sultan"
  | "war"
  | "treaty"
  | "reform"
  | "crisis"
  | "constitution"
  | "diplomacy"
  | "culture"
  | "turning-point";

export type CausalChain = {
  cause: string;
  event: string;
  result: string;
};

export type Mnemonic = {
  title: string;
  code: string;
  description: string;
  items: { letter: string; name: string; detail: string }[];
};

export type KeyPointSection = {
  title: string;
  icon?: string;
  items: string[];
};

export type HistoryTimelineEvent = {
  id: string;
  topicId: string;
  sortKey: number;
  dateLabel: string;
  title: string;
  eyebrow: string;
  kind: HistoryEventKind;
  sultan?: string;
  mahlas?: string;
  reign?: string;
  summary: string;
  details?: string[];
  keySections?: KeyPointSection[];
  causalChain?: CausalChain;
  examNote?: string;
  mnemonic?: Mnemonic;
  actors?: string[];
  keywords?: string[];
  image?: string;
};

export type CultureTopicSection = {
  id: string;
  title: string;
  badge: string;
  icon: string;
  summary: string;
  details: string[];
  keySections?: KeyPointSection[];
  subTables?: {
    title: string;
    headers: string[];
    rows: { col1: string; col2: string; col3?: string }[];
  }[];
  mnemonic?: Mnemonic;
  examNote?: string;
};

export type HistoryPeriod = {
  id: string;
  shortTitle: string;
  title: string;
  period: string;
  badge: string;
  slogan: string;
  description: string;
  color: string;
  accentColor: string;
  image: string;
  events: HistoryTimelineEvent[];
  cultureSections?: CultureTopicSection[];
};

export type HistoryProgress = {
  visitedEventIds: string[];
  chronologyAttempts: number;
  chronologyCorrect: number;
  outcomeAttempts: number;
  outcomeCorrect: number;
  quizAttempts?: number;
  quizCorrect?: number;
  updatedAt: string;
};

export const HISTORY_PROGRESS_KEY = "kpss-atlasim-history-progress-v2";
export const HISTORY_PROGRESS_CHANGED_EVENT = "kpss-atlasim:history-progress-changed";

// ============================================================================
// 1. KURULUŞ DÖNEMİ (1299 – 1453) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const kurulusEvents: HistoryTimelineEvent[] = [
  {
    id: "kurulus-genel-dinamikler",
    topicId: "kurulus",
    sortKey: 1299.0,
    dateLabel: "1299 Öncesi & Kuruluş Şartları",
    title: "Beyliğin Kuruluşu ve Hızlı Büyüme Nedenleri",
    eyebrow: "BEYLİKTEN DEVLETE",
    kind: "culture",
    summary:
      "Söğüt ve Domaniç merkezli kurulan Osmanlı Beyliği; jeopolitik uç konumu, gaza anlayışı, adil İstimâlet ve planlı İskân siyaseti sayesinde kısa sürede cihan imparatorluğuna dönüştü.",
    keySections: [
      {
        title: "Jeopolitik ve Dış Faktörler (MEB 10. Sınıf)",
        items: [
          "Uç Beyliği Konumu: Bizans sınırında kurulması ve gazayı taht kavgalarıyla zayıflayan Bizans tekfurlarına yöneltmesi.",
          "Balkanlar ve Anadolu: Balkanlar'da feodal ve mezhepsel bölünmüşlük (Katolik-Ortodoks çatışması); Anadolu'da Kösedağ (1243) sonrası Selçuklu otoritesinin çökmesi ve batıya göç eden yoğun Türkmen nüfusu.",
          "Yüzyıl Savaşları (1337–1453): İngiltere ve Fransa'nın birbiriyle savaşması sebebiyle Avrupa'nın Osmanlı'ya karşı ortak ve erken birleşememesi.",
        ],
      },
      {
        title: "İç Dinamikler ve Sosyal Politikalar",
        items: [
          "Gaza ve Cihat Anlayışı: İslamiyet'i yayma gayesiyle savaşılması ve Alperenlerin desteği.",
          "İskân Politikası (Şenlendirme): Fethedilen Balkan topraklarına konargöçer Türkmenlerin yerleştirilmesi (Bölgenin Türkleşmesi, İslamlaşması ve üretimin sürekliliği).",
          "İstimâlet Politikası (Meyil Ettirme / Hoşgörü ve Adalet): Gayrimüslim tebaanın can, mal, inanç özgürlüğünün güvenceye alınması ve vergi adaleti.",
          "Ahiyân-ı Rûm (Ahiler): Şeyh Edebali önderliğindeki esnaf teşkilatının güveni ve iktisadi desteği.",
          "Bâciyân-ı Rûm (Anadolu Kadınları), Abdalân-ı Rûm (Dervişler / Alperenler) ve Gaziyân-ı Rûm (Gaziler).",
        ],
      },
    ],
    mnemonic: {
      title: "Kuruluşu Destekleyen 4 Büyük Zümre",
      code: "A - B - A - G (ABAG)",
      description: "Aşıkpaşazade Tarihi'nde geçen ve kuruluşu sağlayan sosyal zümreler:",
      items: [
        { letter: "A", name: "Ahiyân-ı Rûm", detail: "Ahiler (Şeyh Edebali, esnaf ve tüccarlar)." },
        { letter: "B", name: "Bâciyân-ı Rûm", detail: "Anadolu Kadınları Teşkilatı (Fatma Bacı)." },
        { letter: "A", name: "Abdalân-ı Rûm", detail: "Dervişler ve Alperenler (Geyikli Baba, Kumral Abdal)." },
        { letter: "G", name: "Gaziyân-ı Rûm", detail: "Gaziler, alpler ve cengaverler." },
      ],
    },
    examNote:
      "MEB & KPSS Standart Notu: İskân ve İstimâlet (hoşgörü) politikaları, Balkanlar'da Osmanlı kalıcılığını sağlayan en kritik iki temel faktördür. Yüzyıl Savaşları ise dış faktördür.",
    keywords: ["İskân", "İstimâlet", "Ahilik", "Uç Beyliği", "Gaza", "ABAG", "Yüzyıl Savaşları"],
  },
  {
    id: "osman-bey-donemi",
    topicId: "kurulus",
    sortKey: 1299.1,
    dateLabel: "1299 – 1324",
    title: "Osman Bey (Fahrüddin)",
    sultan: "Osman Gazi",
    reign: "1299 – 1324",
    eyebrow: "DEVLETİN KURUCUSU",
    kind: "sultan",
    summary:
      "Şeyh Edebali'nin kızı Bala Hatun ile evlenerek Ahilerin desteğini aldı. İlk fetihleri gerçekleştirdi, ilk vergiyi toplattı ve Bizans'a karşı ilk zaferi kazandı.",
    details: [
      "İlk fethedilen kale: Kulacahisar (1285).",
      "1299 Karacahisar'ın fethi: Dursun Fakih ilk kadı olarak atandı, ilk hutbe okutuldu ve ilk vergi olan Bâc-ı Bazar (çarşı vergisi) toplandı.",
      "İnegöl, Bilecik, Yarhisar ve Yenişehir fethedildi; Yenişehir beylik merkezi yapıldı. Bilecik'in demir madenleri işletildi.",
      "İlk bakır para (Mangır) basıldı.",
    ],
    causalChain: {
      cause: "Bizans tekfurlarının Osmanlı'nın İznik kuşatmasını kırmak için birleşmesi.",
      event: "Koyunhisar / Bafeus Savaşı (1302)",
      result:
        "Bizans ile yapılan ilk meydan savaşı kazanıldı. Prof. Dr. Halil İnalcık'a ve MEB kaynaklarına göre Osmanlı Devleti'nin hanedan olarak asıl kuruluşu bu zaferle tescillendi.",
    },
    mnemonic: {
      title: "Osman Bey Dönemi İlkleri",
      code: "M - A - K - B - A (MAKBA)",
      description: "Osman Bey zamanında atılan ilk devletleşme adımları:",
      items: [
        { letter: "M", name: "Mangır", detail: "İlk bakır para basıldı." },
        { letter: "A", name: "Ahi Desteği", detail: "Şeyh Edebali'nin kızıyla evlenip Ahiyân-ı Rûm desteği alındı." },
        { letter: "K", name: "Kadı (Dursun Fakih)", detail: "İlk kadı ataması Karacahisar'a yapıldı." },
        { letter: "B", name: "Bâc-ı Bazar", detail: "İlk Osmanlı çarşı-pazar vergisi toplandı." },
        { letter: "A", name: "Asıl Kuruluş (Bafeus)", detail: "1302 Koyunhisar Savaşı ile Bizans tekfurları ilk kez yenildi." },
      ],
    },
    examNote:
      "Koyunhisar (Bafeus) Savaşı, Osmanlı ile Bizans arasındaki İLK savaştır. Halil İnalcık Osmanlı'nın gerçek kuruluşunu 1302 Bafeus Zaferi olarak kabul eder.",
    actors: ["Osman Bey", "Şeyh Edebali", "Dursun Fakih"],
    keywords: ["Koyunhisar", "Bafeus", "Mangır", "Dursun Fakih", "Bâc", "MAKBA", "Halil İnalcık"],
  },
  {
    id: "orhan-bey-donemi",
    topicId: "kurulus",
    sortKey: 1324,
    dateLabel: "1324 – 1362",
    title: "Orhan Bey (İhtiyareddin)",
    sultan: "Orhan Gazi",
    reign: "1324 – 1362",
    eyebrow: "BEYLİKTEN DEVLETE GEÇİŞ",
    kind: "sultan",
    summary:
      "Beyliği gerçek anlamda teşkilatlı bir devlete dönüştürdü. Bursa'yı başkent yaptı, ilk düzenli orduyu, ilk medreseyi ve ilk donanmayı kurdu. İbni Batuta kendisinden 'Türkmen hükümdarlarının en ulusu' diye bahseder.",
    details: [
      "1326 Bursa'nın Fethi: Kuşatmayı Osman Bey başlattı, Orhan Bey fethetti ve Bursa başkent yapıldı.",
      "1329 Maltepe (Pelekanon) Savaşı: Bizans İmparatoru III. Andronikos mağlup edildi, Bizans'ın Anadolu ile kara bağı tamamen koptu.",
      "1331 İznik ve 1337 İzmit fethedilerek Kocaeli Yarımadası tamamen alındı.",
      "İlk gümüş para (Akçe) basıldı.",
    ],
    causalChain: {
      cause: "Karesioğulları Beyliği'ndeki iç taht kavgaları ve Bizans İmparatoru Kantakuzen'e yardıma gidilmesi.",
      event: "Karesioğulları'nın Alınması (1345) & Çimpe Kalesi (1353)",
      result:
        "Karesi'nin alınmasıyla Anadolu Türk Siyasi Birliği (ATSB) için İLK adım atıldı ve Karesi donanması ile komutanları (Hacı İlbey, Evrenos Bey) Osmanlı'ya geçti. Çimpe Kalesi ile Rumeli'deki İLK köprübaşı kazanıldı.",
    },
    mnemonic: {
      title: "Orhan Bey Teşkilatlanma İlkleri",
      code: "D - İ - V - A - N (DİVAN)",
      description: "Devletleşmenin temelleri Orhan Gazi döneminde atıldı:",
      items: [
        { letter: "D", name: "Divan-ı Hümayun", detail: "İlk devlet divan teşkilatı kuruldu." },
        { letter: "İ", name: "İznik Medresesi", detail: "İlk medrese açıldı (Dâvûd-ı Kayserî ilk müderris)." },
        { letter: "V", name: "Vezirlik Makamı", detail: "İlk vezir atandı (Alaeddin Paşa)." },
        { letter: "A", name: "Akçe ve Asker", detail: "İlk gümüş para basıldı; ilk düzenli ordu (Yaya ve Müsellem) kuruldu." },
        { letter: "N", name: "Naval / Donanma", detail: "Karesioğulları alınarak ilk donanma ve Karamürsel tersanesi kuruldu." },
      ],
    },
    examNote:
      "Karesioğulları Osmanlı'ya katılan İLK Türk beyliğidir (ATSB'nin ilk adımı); Çimpe Kalesi ise Osmanlı'nın Rumeli'deki İLK toprağıdır.",
    actors: ["Orhan Gazi", "Alaeddin Paşa", "Süleyman Paşa (Rumeli Fatihi)", "Dâvûd-ı Kayserî"],
    keywords: ["Bursa", "Pelekanon", "Karesioğulları", "Çimpe Kalesi", "Divan", "Yaya ve Müsellem", "İznik Orhaniyesi", "DİVAN"],
  },
  {
    id: "birinci-murad-donemi",
    topicId: "kurulus",
    sortKey: 1362,
    dateLabel: "1362 – 1389",
    title: "I. Murad (Hüdavendigar)",
    sultan: "I. Murad",
    reign: "1362 – 1389",
    eyebrow: "İMPARATORLUĞUN MİMARI",
    kind: "sultan",
    summary:
      "Sınırları Tuna Nehri'ne kadar genişletti, devleti imparatorluk yapısına kavuşturdu, Yeniçeri Ocağı'nı, Pençik sistemini ve Rumeli Beylerbeyliği'ni kurdu.",
    details: [
      "1361 Sazlıdere Savaşı: Bizans ve Bulgar kuvvetleri yenildi, Edirne fethedilerek başkent yapıldı.",
      "1364 Sırpsındığı Savaşı: Edirne'yi geri almak isteyen Haçlı ittifakına karşı kazanılan İLK Osmanlı-Haçlı zaferidir (Hacı İlbey gece baskını).",
      "1371 Çirmen Savaşı: Sırplar mağlup edildi, Makedonya kapıları açıldı.",
      "Germiyanoğulları'ndan çeyizle (Kütahya, Simav, Emet), Hamitoğulları'ndan parayla (Isparta, Yalvaç, Akşehir) toprak alındı.",
      "İlk kez Rumeli Beylerbeyliği kuruldu (Merkez: Manastır - İlk Beylerbeyi: Lala Şahin Paşa).",
      "Çandarlı Kara Halil Paşa öncülüğünde Pençik Sistemi (savaş esirlerinin 1/5'i) ve Kapıkulu / Yeniçeri Ocağı kuruldu.",
      "Verasette ilk değişiklik yapıldı: 'Ülke padişah ve oğullarınındır' kuralı getirildi.",
    ],
    causalChain: {
      cause: "Balkan Haçlı ittifakının Osmanlı'yı Rumeli'den tamamen atmak istemesi.",
      event: "I. Kosova Savaşı (1389)",
      result:
        "Büyük Haçlı ordusu imha edildi. Savaşta İLK KEZ sesinden yararlanmak amacıyla top kullanıldı. I. Murad savaş meydanını gezerken Sırp Miloş Obiliç tarafından şehit edildi (Şehit düşen İLK ve TEK padişah).",
    },
    mnemonic: {
      title: "Kuruluş Dönemi Haçlı Savaşları Şifresi",
      code: "S - I - N - A - V - II",
      description: "Haçlı ittifakları ile yapılan büyük meydan savaşları kronolojisi:",
      items: [
        { letter: "S", name: "Sırpsındığı (1364)", detail: "İlk Osmanlı-Haçlı savaşı ve zaferi (I. Murad)." },
        { letter: "I", name: "I. Kosova (1389)", detail: "İlk kez top kullanıldı; I. Murad şehit edildi." },
        { letter: "N", name: "Niğbolu (1396)", detail: "Haçlılar bozguna uğradı; Sultan-ı İklîm-i Rûm (Yıldırım)." },
        { letter: "A", name: "Ankara (DİKKAT!)", detail: "ÇELBİRİCİ: Ankara Savaşı Haçlılarla DEĞİL, Timur ile yapıldı!" },
        { letter: "V", name: "Varna (1444)", detail: "Haçlılar ezici mağlubiyete uğratıldı (II. Murad)." },
        { letter: "II", name: "II. Kosova (1448)", detail: "Balkanlar KESİN Türk yurdu oldu; taarruza geçildi (II. Murad)." },
      ],
    },
    examNote:
      "Sırpsındığı İLK Osmanlı-Haçlı savaşıdır. I. Murad savaş meydanında şehit düşen tek Osmanlı padişahıdır. İlk beylerbeyliği Rumeli Beylerbeyliği'dir.",
    actors: ["I. Murad", "Çandarlı Kara Halil Paşa", "Lala Şahin Paşa", "Hacı İlbey"],
    keywords: ["Sazlıdere", "Sırpsındığı", "I. Kosova", "Yeniçeri Ocağı", "Pençik", "Rumeli Beylerbeyliği", "SINAV II"],
  },
  {
    id: "yildirim-bayezid-donemi",
    topicId: "kurulus",
    sortKey: 1389,
    dateLabel: "1389 – 1402",
    title: "I. Bayezid (Yıldırım Bayezid)",
    sultan: "Yıldırım Bayezid",
    reign: "1389 – 1402",
    eyebrow: "ANADOLU BİRLİĞİ VE FETRET",
    kind: "sultan",
    summary:
      "Anadolu Türk Siyasi Birliğini (ATSB) geniş ölçüde ilk kez sağladı. İstanbul'u 4 kez kuşattı, Niğbolu'da Haçlıları bozguna uğrattı; 1402 Ankara Savaşı ile esir düştü.",
    details: [
      "Aydınoğulları, Saruhanoğulları, Menteşeoğulları, Germiyanoğulları ve Karamanoğulları topraklarını katarak Anadolu Beylerbeyliği'ni kurdu (Merkez: Kütahya - İlk Beylerbeyi: Kara Timurtaş Paşa).",
      "İstanbul'u ilk kez kuşatan Osmanlı padişahıdır; kuşatma için Güzelcehisar (Anadolu Hisarı)'nı inşa ettirdi.",
      "1396 Niğbolu Zaferi: Haçlı ordusu imha edildi. Abbasi Halifesi I. Mütevekkil tarafından 'Sultan-ı İklîm-i Rûm' unvanı verildi. Zafer ganimetleriyle 20 kubbeli Bursa Ulu Camii yapıldı.",
    ],
    causalChain: {
      cause: "Timur ile Yıldırım arasındaki cihan hakimiyeti rekabeti, beylerin kışkırtması ve karşılıklı sığınan emirlerin (Kara Yusuf, Ahmed Celayir) iade edilmemesi.",
      event: "Ankara Savaşı (1402) - Çubuk Ovası",
      result:
        "Osmanlı ordusu mağlup oldu. Yıldırım esir düştü. Anadolu beylikleri yeniden kurularak ATSB bozuldu, İstanbul'un fethi 50 yıl gecikti ve 11 yıllık Fetret Devri başladı.",
    },
    mnemonic: {
      title: "Yıldırım'ın Son Verdiği Beylikler Şifresi",
      code: "A - S - M - G - K (Aydınoğulları, Saruhan, Menteşe, Germiyan, Karaman)",
      description: "Anadolu Türk Siyasi Birliği (ATSB) için Yıldırım'ın fethettiği beylikler:",
      items: [
        { letter: "A", name: "Aydınoğulları", detail: "Batı Anadolu denizci beyliği." },
        { letter: "S", name: "Saruhanoğulları", detail: "Manisa çevresi." },
        { letter: "M", name: "Menteşeoğulları", detail: "Muğla çevresi denizci beylik." },
        { letter: "G", name: "Germiyanoğulları", detail: "Kütahya ve çevresi." },
        { letter: "K", name: "Karamanoğulları", detail: "Konya ve Karaman bölgesi." },
      ],
    },
    examNote:
      "Niğbolu sonrası Yıldırım'a 'Sultan-ı İklîm-i Rûm' unvanı verilmiştir. Ankara Savaşı ile ATSB tamamen dağılmış ve Fetret Devri başlamıştır.",
    actors: ["Yıldırım Bayezid", "Timur", "Kara Timurtaş Paşa"],
    keywords: ["Niğbolu", "Sultan-ı İklim-i Rum", "Anadolu Hisarı", "Ankara Savaşı", "Bursa Ulu Camii", "ASMGK"],
  },
  {
    id: "fetret-devri-ve-mehmed-celebi",
    topicId: "kurulus",
    sortKey: 1402,
    dateLabel: "1402 – 1421",
    title: "Fetret Devri ve I. Mehmed (Çelebi)",
    sultan: "Çelebi Mehmed",
    reign: "1413 – 1421",
    eyebrow: "DEVLETİN İKİNCİ KURUCUSU",
    kind: "sultan",
    summary:
      "11 yıllık taht kavgalarına son vererek devleti dağılmaktan kurtardı. İlk deniz savaşını ve ilk dini-sosyal isyanı bu dönemde yaşadı.",
    details: [
      "Fetret Devri (1402–1413): İsa, Musa, Süleyman ve Mehmed Çelebi arasındaki taht kavgaları. Mehmed Çelebi kardeşlerini eleyerek birliği sağladı.",
      "1416 Çalı Bey (Lapseki) Savaşı: Venedik ile yapılan İLK deniz savaşıdır (Osmanlı yenildi).",
      "1420 Şeyh Bedrettin İsyanı: Osmanlı tarihindeki İLK dini ve sosyal nitelikli isyandır (Torlak Kemal ve Börklüce Mustafa destekledi).",
      "Düzmece Mustafa (Mustafa Çelebi) İsyanı bastırıldı; Mustafa Bizans'a sığındı.",
      "Devşirme sistemi kurumsal olarak uygulanmaya başlandı.",
    ],
    mnemonic: {
      title: "Fetret Devri Kardeşleri Şifresi",
      code: "İ - S - İ - M (İSİM: İsa, Süleyman, İkinci Mehmed, Musa)",
      description: "11 yıl süren taht kavgasındaki 4 kardeş şehzade:",
      items: [
        { letter: "İ", name: "İsa Çelebi", detail: "Balıkesir ve Bursa kolu." },
        { letter: "S", name: "Süleyman Çelebi", detail: "Edirne kolu." },
        { letter: "İ", name: "İkinci Kurucu Mehmed Çelebi", detail: "Amasya kolu (Birliği sağlayıp devleti kurtaran 2. Kurucu)." },
        { letter: "M", name: "Musa Çelebi", detail: "Rumeli kolu (İstanbul'u kuşattı)." },
      ],
    },
    examNote:
      "Çelebi Mehmed devleti dağılmaktan kurtardığı için 'Devletin 2. Kurucusu' sayılır. Şeyh Bedrettin ilk dini-sosyal isyandır. Çalı Bey ilk deniz savaşıdır.",
    actors: ["Çelebi Mehmed", "Şeyh Bedrettin", "Çalı Bey", "Börklüce Mustafa"],
    keywords: ["Fetret Devri", "2. Kurucu", "Çalı Bey", "Şeyh Bedrettin", "Devşirme", "İSİM"],
  },
  {
    id: "ikinci-murad-donemi",
    topicId: "kurulus",
    sortKey: 1421,
    dateLabel: "1421 – 1451",
    title: "II. Murad (Koca Murad)",
    sultan: "II. Murad",
    mahlas: "Muradî",
    reign: "1421 – 1444 / 1446 – 1451",
    eyebrow: "BALKANLARIN KESİN TÜRK YURDU OLMASI",
    kind: "sultan",
    summary:
      "Tahtı kendi isteğiyle 12 yaşındaki oğlu II. Mehmed'e bırakan, Haçlı tehlikesi üzerine geri dönüp Varna ve II. Kosova zaferleriyle Balkan hakimiyetini perçinleyen padişahtır.",
    details: [
      "1444 Edirne-Segedin Antlaşması: Macarlarla imzalanan ilk barış antlaşmasıdır (10 yıl savaşılmayacak dendi).",
      "1444 Varna Zaferi: Antlaşmayı bozan Haçlı ittifakı imha edildi.",
      "1446 Buçuktepe İsyanı: Yeniçerilerin maaş düşüklüğü sebebiyle çıkardığı İLK yeniçeri isyanıdır (II. Murad tahta geri çağrıldı).",
      "Enderun Mektebi'nin ilk temelleri Edirne Sarayı'nda bu dönemde atıldı.",
    ],
    causalChain: {
      cause: "Haçlıların Varna yenilgisinin intikamını almak ve Osmanlı'yı Balkanlar'dan atmak istemesi.",
      event: "II. Kosova Savaşı (1448)",
      result:
        "Haçlılar kesin mağlubiyete uğradı. Balkanlar'ın kesin Türk yurdu olduğu tescillendi. Avrupalılar savunmaya, Osmanlı taarruza geçti (Miryokefalon benzeri).",
    },
    mnemonic: {
      title: "II. Murad Dönemi Üçlemesi",
      code: "S - V - K (Segedin - Varna - Kosova)",
      description: "Balkan hakimiyetini kesinleştiren üç büyük aşama:",
      items: [
        { letter: "S", name: "Edirne-Segedin (1444)", detail: "Macarlarla 10 yıllık ilk barış antlaşması." },
        { letter: "V", name: "Varna Savaşı (1444)", detail: "Antlaşmayı bozan Haçlıların ezici hezimeti." },
        { letter: "K", name: "II. Kosova (1448)", detail: "Balkanların KESİN Türk yurdu olması ve Haçlıların savunmaya çekilmesi." },
      ],
    },
    examNote:
      "II. Kosova Savaşı (1448) ile Balkanlar KESİN Türk yurdu olmuştur. Buçuktepe İLK yeniçeri isyanıdır. Kendi isteğiyle tahttan feragat eden ilk padişahtır.",
    actors: ["II. Murad", "II. Mehmed (Fatih)", "Hunyadi Yanoş", "Çandarlı Halil Paşa"],
    keywords: ["Edirne-Segedin", "Varna", "II. Kosova", "Buçuktepe İsyanı", "Muradî", "SVK"],
  },
];

// ============================================================================
// 2. YÜKSELME DÖNEMİ (1453 – 1579) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const yukselmeEvents: HistoryTimelineEvent[] = [
  {
    id: "istanbulun-fethi",
    topicId: "yukselme",
    sortKey: 1453,
    dateLabel: "29 Mayıs 1453",
    title: "İstanbul'un Fethi ve II. Mehmed (Fatih)",
    sultan: "Fatih Sultan Mehmed",
    mahlas: "Avnî",
    reign: "1444 – 1446 / 1451 – 1481",
    eyebrow: "ÇAĞ AÇIP ÇAĞ KAPATAN FETİH",
    kind: "turning-point",
    summary:
      "1058 yıllık Doğu Roma (Bizans) İmparatorluğu tarihe karıştı, Orta Çağ kapandı, Yeni Çağ başladı. Osmanlı Cihan İmparatorluğu seviyesine yükseldi.",
    details: [
      "Hazırlıklar: Boğazkesen (Rumeli Hisarı) yapıldı, Şahi topları döktürüldü (Mühendis Urban), 400 parçalık donanma kuruldu, tekerlekli kuleler ve karadan Haliç'e 72 kadırga indirildi.",
      "Bizans Savunması: Grejuva ateşi, Haliç zinciri; Notaras'ın meşhur sözü: 'İstanbul'da kardinal külahı görmektense Türk sarığı görmeyi yeğlerim.'",
      "Dünya Tarihi Sonuçları: Feodalite çöktü (büyük toplarla surlar yıkıldı, mutlak krallıklar güçlendi), İpek Yolu Osmanlı'ya geçti ve Coğrafi Keşifler tetiklendi, İtalya'ya giden bilginler Rönesans'ı başlattı.",
      "Türk Tarihi Sonuçları: Toprak bütünlüğü sağlandı, başkent İstanbul oldu, II. Mehmed 'Fatih' ve 'Kayser-i Rûm' unvanlarını aldı. Yükselme Dönemi başladı.",
    ],
    causalChain: {
      cause: "Bizans'ın Osmanlı toprak bütünlüğünü bozması, şehzadeleri ve Haçlıları kışkırtması ve ticaret yollarının denetimi arzusu.",
      event: "İstanbul Kuşatması ve Fethi (1453)",
      result:
        "Osmanlı Yükselme Dönemi başladı, ticaret yolları Osmanlı kontrolüne geçti, Orta Çağ kapandı Yeni Çağ başladı.",
    },
    mnemonic: {
      title: "İstanbul'un Fethinin Dünya Tarihi Sonuçları",
      code: "F - E - T - İ - H",
      description: "Orta Çağ'ı kapatıp Yeni Çağ'ı başlatan 5 küresel sonuç:",
      items: [
        { letter: "F", name: "Feodalite Çöktü", detail: "Büyük şahi toplarıyla surlar yıkıldı, krallıklar güçlendi." },
        { letter: "E", name: "Ekonomik Ticaret Yolları", detail: "İpek Yolu ve Boğazlar Osmanlı'ya geçti." },
        { letter: "T", name: "Tetiklenen Keşifler", detail: "Avrupalılar yeni yollar arayarak Coğrafi Keşifler'i başlattı." },
        { letter: "İ", name: "İtalya'ya Kaçan Bilginler", detail: "Bizanslı bilginlerin İtalya'ya gitmesi Rönesans'ı doğurdu." },
        { letter: "H", name: "Hristiyan Birliğinin Bölünmesi", detail: "Ortodokslara himaye verilerek Katolik birliği parçalandı." },
      ],
    },
    examNote:
      "İstanbul'un fethiyle feodalite zayıflamış, Coğrafi Keşifler ve Rönesans doğrudan tetiklenmiştir. Fatih Ortodoksları koruyarak Hristiyan birliğini engellemiştir.",
    actors: ["Fatih Sultan Mehmed", "Akşemseddin", "Ulubatlı Hasan", "Urban", "Gennadios"],
    keywords: ["İstanbul'un Fethi", "Şahi Topu", "Rumeli Hisarı", "Kayser-i Rum", "Yeni Çağ", "FETİH"],
  },
  {
    id: "fatih-diger-fetihler-ve-teskilat",
    topicId: "yukselme",
    sortKey: 1454,
    dateLabel: "1453 – 1481",
    title: "Fatih'in Seferleri ve Kanunname-i Âli Osman",
    sultan: "Fatih Sultan Mehmed",
    reign: "1451 – 1481",
    eyebrow: "CİHAN DEVLETİ KURUMSALLAŞMASI",
    kind: "reform",
    summary:
      "Balkanlar, Anadolu ve denizlerde fetihler tamamlandı. Karadeniz Türk gölü oldu; devletin ilk anayasal kanunnamesi yürürlüğe girdi.",
    keySections: [
      {
        title: "Balkan ve Anadolu Fetihleri",
        items: [
          "Balkanlar: Sırbistan (Belgrad hariç), Mora, Eflak, Boğdan, Bosna-Hersek (Bogomillere ahidname verilerek İslamlaşmaları sağlandı) ve Arnavutluk.",
          "Anadolu & Karadeniz: Amasra (Cenevizlilerden), Sinop (Candaroğulları), Trabzon Rum İmp. (1461 son verildi), Karamanoğulları (Konya), Otlukbeli Savaşı (1473 Akkoyunlu Uzun Hasan mağlup edildi).",
        ],
      },
      {
        title: "Deniz Seferleri ve Karadeniz Türk Gölü",
        items: [
          "1475 Kırım'ın Fethi (Gedik Ahmed Paşa): Karadeniz resmen TÜRK GÖLÜ haline geldi; İpek Yolu kuzey kolu tamamen bağlandı.",
          "Ege adaları alındı; 1480 Otranto Seferi (İtalya) düzenlendi.",
          "1479 Venedik İmtiyazları: İlk ticari imtiyaz; İstanbul'da elçi (Balyos) bulundurma hakkı tanındı.",
        ],
      },
    ],
    mnemonic: {
      title: "Kanunname-i Âli Osman Maddeleri",
      code: "K - A - M - C - I (KAMCI)",
      description: "Fatih'in ilk yazılı anayasal kanunnamesiyle yasalaşan 5 kural:",
      items: [
        { letter: "K", name: "Kardeş Katli", detail: "Nizam-ı âlem için kardeş katli caiz kılındı." },
        { letter: "A", name: "Altın Para", detail: "İlk altın para (Sultani / Sikke-i Hasene) basıldı." },
        { letter: "M", name: "Müsadere Sistemi", detail: "Devlet adamının haksız malına el koyma kanunlaştı." },
        { letter: "C", name: "Cülus Bahşişi", detail: "Tahta çıkışta yeniçerilere bahşiş vermek zorunlu kural oldu." },
        { letter: "I", name: "İdarede Sadrazam", detail: "Divan başkanlığı sadrazama devredildi (Kasr-ı Adl)." },
      ],
    },
    examNote:
      "Kırım'ın fethiyle Karadeniz Türk gölü olmuştur. Kanunname-i Âli Osman ile kardeş katli, müsadere, cülus bahşişi ve sancağa çıkma ilk kez kanunlaşmıştır.",
    actors: ["Fatih Sultan Mehmed", "Gedik Ahmed Paşa", "Ali Kuşçu", "Gentile Bellini"],
    keywords: ["Kırım", "Karadeniz Türk Gölü", "Kanunname-i Âli Osman", "Kardeş Katli", "Müsadere", "Topkapı", "KAMCI", "Otlukbeli"],
  },
  {
    id: "ikinci-bayezid-donemi",
    topicId: "yukselme",
    sortKey: 1481,
    dateLabel: "1481 – 1512",
    title: "II. Bayezid (Sofu Bayezid)",
    sultan: "II. Bayezid",
    mahlas: "Adlî",
    reign: "1481 – 1512",
    eyebrow: "YÜKSELME İÇİNDE DURAKLAMA",
    kind: "sultan",
    summary:
      "Cem Sultan Olayı nedeniyle fetihlerin yavaşladığı, ancak İspanya Müslümanlarına/Yahudilerine yardım edilen ve Şahkulu İsyanı ile uğraşılan dönemdir.",
    details: [
      "Cem Sultan Olayı: Taht kavgası iç sorun iken Rodos Şövalyeleri, Memlükler ve Papalık karışınca İLK KEZ bir DIŞ SORUN haline geldi.",
      "1511 Şahkulu İsyanı: Safevilerin (Şah İsmail) kışkırttığı Antalya kökenli Şii nitelikli isyandır.",
      "Kili ve Akkerman kaleleri alındı (Boğdan fethi tamamlandı, Kırım ile karadan doğrudan bağlantı kuruldu).",
      "İspanya'da Engizisyon zulmü gören Yahudi ve Müslümanlar Kemal Reis komutasındaki gemilerle Osmanlı topraklarına getirildi.",
      "1509 Küçük Kıyamet (Büyük İstanbul Depremi) yaşandı; olağanüstü hal vergisi olan Avarız vergisi ilk kez toplandı.",
    ],
    mnemonic: {
      title: "II. Bayezid Dönemi Önemli Olayları",
      code: "C - A - K - İ - Ş (CAKİŞ)",
      description: "Yükselme içinde duraklama döneminin 5 anahtar olayı:",
      items: [
        { letter: "C", name: "Cem Sultan Olayı", detail: "İlk kez iç sorun dış soruna dönüştü." },
        { letter: "A", name: "Avarız Vergisi", detail: "1509 Küçük Kıyamet depremi sonrası ilk kez toplandı." },
        { letter: "K", name: "Kili ve Akkerman", detail: "Kırım ile karadan fiziki bağlantı sağlandı." },
        { letter: "İ", name: "İspanya Yardımı", detail: "Kemal Reis ile Yahudi ve Müslümanlar kurtarıldı." },
        { letter: "Ş", name: "Şahkulu İsyanı", detail: "Safevi destekli Şii nitelikli Antalya isyanı." },
      ],
    },
    examNote:
      "Cem Sultan olayı Osmanlı'nın bir iç sorununun DIŞ SORUN haline geldiği İLK örnektir.",
    actors: ["II. Bayezid", "Cem Sultan", "Kemal Reis", "İdris-i Bitlisi"],
    keywords: ["Cem Sultan", "Şahkulu İsyanı", "Kili-Akkerman", "Küçük Kıyamet", "Avarız", "Adlî", "CAKİŞ"],
  },
  {
    id: "yavuz-sultan-selim-donemi",
    topicId: "yukselme",
    sortKey: 1512,
    dateLabel: "1512 – 1520",
    title: "I. Selim (Yavuz Sultan Selim)",
    sultan: "Yavuz Sultan Selim",
    mahlas: "Selimî",
    reign: "1512 – 1520",
    eyebrow: "8 YILA 80 YILLIK İŞ SIĞDIRAN SULTAN",
    kind: "sultan",
    summary:
      "Hazineyi ağzına kadar doldurdu, Doğu seferleriyle Memlük Devleti'ne son verdi, Halifeliği Osmanlı'ya getirdi ve Baharat Yolu'nu bağladı.",
    keySections: [
      {
        title: "Doğu Seferleri ve Büyük Zaferler",
        items: [
          "1514 Çaldıran Savaşı: Safevi Şah İsmail mağlup edildi, Doğu Anadolu güvenliği sağlandı, Şii yayılması önlendi.",
          "1515 Turnadağ Savaşı: Dulkadiroğulları Beyliği'ne son verildi. Anadolu Türk Siyasi Birliği (ATSB) KESİN olarak sağlandı.",
          "1516 Mercidabık Savaşı: Memlükler mağlup edildi (Kansu Gavri öldü), Suriye ve Filistin alındı.",
          "1517 Ridaniye Savaşı: Memlük Devleti tamamen yıkıldı; Mısır ve Hicaz (Mekke-Medine) fethedildi. Halifelik Osmanlı'ya geçti; Kutsal Emanetler Topkapı Sarayı'na getirildi. Yavuz 'Hâdimü'l-Haremeyni'ş-Şerîfeyn' unvanını aldı.",
        ],
      },
    ],
    mnemonic: {
      title: "Yavuz'un Büyük Doğu Zaferleri Sırası",
      code: "Ç - T - M - R (ÇATAMAR)",
      description: "Yavuz Sultan Selim'in 4 büyük doğu meydan zaferi:",
      items: [
        { letter: "Ç", name: "Çaldıran (1514)", detail: "Safevi Şah İsmail yenildi; Şii tehlikesi önlendi." },
        { letter: "T", name: "Turnadağ (1515)", detail: "Dulkadiroğulları yıkıldı; ATSB KESİN sağlandı." },
        { letter: "M", name: "Mercidabık (1516)", detail: "Memlükler yenildi; Suriye-Filistin alındı." },
        { letter: "R", name: "Ridaniye (1517)", detail: "Memlük yıkıldı; Mısır, Hicaz, Halifelik alındı." },
      ],
    },
    examNote:
      "Turnadağ Savaşı (1515) ile Anadolu Türk Siyasi Birliği (ATSB) KESİN olarak sağlanmıştır. Mısır Seferi ile Halifelik Osmanlı'ya geçmiş ve Baharat Yolu denetimi ele girmiştir.",
    actors: ["Yavuz Sultan Selim", "Şah İsmail", "Kansu Gavri", "Tomanbay", "İdris-i Bitlisi"],
    keywords: ["Çaldıran", "Turnadağ", "Mercidabık", "Ridaniye", "Halifelik", "Baharat Yolu", "ATSB", "ÇTMR", "Hâdimü'l-Haremeyn"],
  },
  {
    id: "kanuni-sultan-suleyman-donemi",
    topicId: "yukselme",
    sortKey: 1520,
    dateLabel: "1520 – 1566",
    title: "I. Süleyman (Kanuni Sultan Süleyman)",
    sultan: "Kanuni Sultan Süleyman",
    mahlas: "Muhibbî",
    reign: "1520 – 1566",
    eyebrow: "MUHTEŞEM SÜLEYMAN VE ALTIN ÇAĞ",
    kind: "sultan",
    summary:
      "46 yıllık saltanatıyla en uzun süre tahtta kalan padişahtır. Mohaç ile Macaristan çöktü, Preveze ile Akdeniz Türk gölü oldu, 1533 İstanbul Antlaşması ile Avrupa'ya mutlak üstünlük sağlandı.",
    keySections: [
      {
        title: "Batı Seferleri ve Siyasi Üstünlük",
        items: [
          "1521 Belgrad'ın Fethi: Orta Avrupa kapıları açıldı.",
          "1526 Mohaç Meydan Muharebesi: 2 saatte Macar ordusu imha edildi (Dünyanın en kısa meydan savaşı).",
          "1529 I. Viyana Kuşatması: Kış şartları nedeniyle kaldırıldı; 1532 Almanya Seferi yapıldı.",
          "1533 İstanbul (İbrahim Paşa) Antlaşması: Avusturya Arşidükü protokolde Osmanlı Sadrazamına denk sayıldı (Mütekabiliyette mutlak siyasi üstünlük).",
          "1566 Zigetvar Seferi: Kanuni'nin son seferidir (Kale alınmadan önce vefat etti).",
        ],
      },
      {
        title: "Denizler ve Akdeniz'in Türk Gölü Olması",
        items: [
          "1522 Rodos fethedildi; Trablusgarp ve Cezayir Osmanlı'ya bağlandı (Barbaros Kaptan-ı Derya oldu).",
          "1538 Preveze Deniz Zaferi: Barbaros Hayreddin Paşa komutasında Haçlı donanması (Andrea Doria) imha edildi. AKDENİZ TÜRK GÖLÜ OLDU (28 Eylül Türk Donanma Günü).",
          "1560 Cerbe Deniz Savaşı kazanıldı; Hint Deniz Seferleri düzenlendi (Hadım Süleyman, Piri Reis, Murat Reis, Seydi Ali Reis).",
          "1555 Amasya Antlaşması: Safeviler (İran) ile imzalanan İLK RESMİ ANTLAŞMADIR (Bağdat, Karabağ, Revan Osmanlı'da kaldı).",
          "1535 Fransa Kapitülasyonları: Hristiyan birliğini bölmek ve Akdeniz ticaretini canlandırmak amacıyla verildi.",
        ],
      },
    ],
    mnemonic: {
      title: "Kanuni Dönemi İç İsyanları",
      code: "C - A - B - K (CABK: Canberdi, Ahmet, Baba Zünnun, Kalender)",
      description: "Kanuni'nin saltanatının ilk yıllarında çıkan 4 iç isyan:",
      items: [
        { letter: "C", name: "Canberdi Gazali İsyanı", detail: "Mısır'da Memlük Devleti'ni canlandırma isyanı." },
        { letter: "A", name: "Ahmet Paşa İsyanı", detail: "Sadrazam yapılmayınca Mısır valiliğinde isyan etti." },
        { letter: "B", name: "Baba Zünnun İsyanı", detail: "Yozgat'ta vergi/arazi sebebiyle çıkan Türkmen isyanı." },
        { letter: "K", name: "Kalender Çelebi İsyanı", detail: "Maraş/Anadolu'da dini-sosyal nitelikli Şii isyanı." },
      ],
    },
    examNote:
      "1533 İstanbul Antlaşması ile Avusturya karşısında mutlak protokol üstünlüğü kazanıldı. Preveze ile Akdeniz Türk gölü oldu. 1555 Amasya İran ile İLK resmi antlaşmadır.",
    actors: ["Kanuni Sultan Süleyman", "Pargalı İbrahim Paşa", "Barbaros Hayreddin Paşa", "Mimar Sinan", "Seydi Ali Reis", "Piri Reis"],
    keywords: ["Mohaç", "1533 İstanbul Antlaşması", "Preveze", "Akdeniz Türk Gölü", "1555 Amasya", "Kapitülasyon", "CABK", "Zigetvar"],
  },
  {
    id: "sokullu-ve-ikinci-selim-ucuncu-murad",
    topicId: "yukselme",
    sortKey: 1566,
    dateLabel: "1566 – 1579",
    title: "Sokullu Mehmed Paşa & II. Selim, III. Murad",
    sultan: "II. Selim & III. Murad",
    reign: "1566 – 1579 (Sokullu Sadareti)",
    eyebrow: "YÜKSELME DÖNEMİNİN ZİRVESİ VE SONU",
    kind: "turning-point",
    summary:
      "Sokullu Mehmed Paşa'nın devlet yönetiminde belirleyici olduğu dönemdir. Kıbrıs fethedilmiş, İnebahtı'da donanma yakılmış, sınırlar Atlas Okyanusu'na dayanmıştır.",
    details: [
      "II. Selim ordunun başında sefere çıkmayan ilk padişahtır.",
      "1571 Kıbrıs'ın Fethi (Lala Mustafa Paşa): Doğu Akdeniz ticaret ve güvenlik kontrolü sağlandı.",
      "1571 İnebahtı Deniz Muharebesi: Haçlılar Osmanlı donanmasını yaktı (Osmanlı donanmasının İLK yakılışı). Sokullu'nun meşhur sözü: 'Biz Kıbrıs'ı almakla sizin kolunuzu kestik; siz İnebahtı'da donanmamızı yakmakla bizim sakalımızı tıraş ettiniz.'",
      "1578 Vadi'üs-Seyl (Kasrü'l-Kebir) Savaşı: Portekizliler yenildi, Fas Osmanlı himayesine girdi; sınırlar Atlas Okyanusu'na dayandı.",
      "1590 Ferhat Paşa Antlaşması: Safeviler ile yapıldı; Osmanlı DOĞU'DA EN GENİŞ SINIRLARA ulaştı.",
      "Sokullu'nun Kanal Projeleri: Don-Volga Kanalı (İpek Yolu'nu canlandırma, Rusya'yı engelleme, Orta Asya Türkleri ile birleşme ve Hazar'a inme) ve Süveyş Kanalı (Baharat Yolu'nu Akdeniz'e bağlama).",
      "1579 Sokullu Mehmed Paşa'nın vefatı: Yükselme Döneminin sonu, Duraklama Döneminin başlangıcı kabul edilir.",
      "Mimar Sinan'ın Ustalık eseri olan Edirne Selimiye Camii bu dönemde inşa edildi.",
    ],
    mnemonic: {
      title: "Osmanlı Donanmasının Yakıldığı 4 Yer",
      code: "İ - Ç - N - S (İÇİNİZ)",
      description: "Osmanlı deniz donanmasının tarihte yakıldığı 4 büyük baskın:",
      items: [
        { letter: "İ", name: "İnebahtı (1571)", detail: "Haçlılar yaktı (II. Selim / Kıbrıs fethi sonrası - İlk yakılış)." },
        { letter: "Ç", name: "Çeşme (1770)", detail: "Ruslar yaktı (III. Mustafa - İkinci yakılış)." },
        { letter: "N", name: "Navarin (1827)", detail: "İngiltere, Fransa, Rusya birleşik donanması yaktı (II. Mahmud - Üçüncü yakılış)." },
        { letter: "S", name: "Sinop (1853)", detail: "Ruslar yaktı (Sultan Abdülmecid / Kırım Savaşı öncesi - Dördüncü yakılış)." },
      ],
    },
    examNote:
      "İnebahtı Osmanlı donanmasının İLK KEZ yakıldığı yerdir. 1590 Ferhat Paşa ile DOĞUDA EN GENİŞ sınırlara ulaşılmıştır. Don-Volga kanalı Rusya'yı durdurma ve Hazar'a inme projesidir.",
    actors: ["Sokullu Mehmed Paşa", "II. Selim", "III. Murad", "Lala Mustafa Paşa", "Kılıç Ali Paşa"],
    keywords: ["Sokullu", "Kıbrıs'ın Fethi", "İnebahtı", "Vadi'üs-Seyl", "Ferhat Paşa", "Selimiye", "İÇNS", "Don-Volga"],
  },
];

// ============================================================================
// 3. DURAKLAMA DÖNEMİ (1579 – 1699) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const duraklamaEvents: HistoryTimelineEvent[] = [
  {
    id: "duraklama-nedenleri-ve-isyanlar",
    topicId: "duraklama",
    sortKey: 1579,
    dateLabel: "1579 – 1699 Genel Bakış",
    title: "Duraklama Nedenleri ve XVII. Yüzyıl İsyanları",
    eyebrow: "ARAYIŞ YILLARI",
    kind: "crisis",
    summary:
      "Merkezi otoritenin bozulması, tımar ve ilmiye sisteminin çöküşü (beşik ulemalığı), 'Ocak devlet içindir' anlayışının 'Devlet ocak içindir'e dönmesi ve Celali isyanları devleti sarstı.",
    keySections: [
      {
        title: "Duraklamanın İç ve Dış Nedenleri",
        items: [
          "İç Nedenler: Küçük yaşta padişahlar, saray kadınları ve ocak ağalarının müdahalesi, sancağa çıkmanın kalkması (tecrübesizlik), beşik ulemalığı (alimin oğlu alimdir anlayışı), tımar bozulması, lüks ve saray harcamaları.",
          "Dış Nedenler: Doğal sınırlara ulaşılması (çöller, okyanuslar, güçlü imparatorluklar), Coğrafi Keşifler ile ticaret yollarının yön değiştirmesi ve gümüş akışıyla enflasyon, Rönesans ve Reform ile Batı'nın askeri/teknik ilerlemesi.",
        ],
      },
      {
        title: "XVII. Yüzyıl İsyanları (MEB 11. Sınıf)",
        items: [
          "İstanbul (Yeniçeri) İsyanları: Ulufe ve cülus yetersizliği, tağşiş (paranın ayarının düşürülmesi). Genç Osman katledildi, Çınar Vakası yaşandı.",
          "Celali (Anadolu) İsyanları: Ağır vergiler, tımar bozulması ve valilerin zulmü. 'Büyük Kaçgun' yaşandı (Köylü toprağı terk etti, tarım çöktü, şehirlere göç oldu).",
          "Eyalet İsyanları: Eflak, Boğdan, Erdel gibi uzak eyalet yöneticilerinin isyanları (Milliyetçilik etkisi KESİNLİKLE YOKTUR).",
          "Suhte (Medrese) İsyanları: Medrese öğrencilerinin atama adaletsizliğine karşı isyanları.",
        ],
      },
    ],
    mnemonic: {
      title: "XVII. Yüzyıl İsyan Türleri Şifresi",
      code: "İ - C - E - S (İCES)",
      description: "Duraklama dönemini sarsan 4 ana isyan kolu:",
      items: [
        { letter: "İ", name: "İstanbul (Merkez / Yeniçeri)", detail: "Cülus/ulufe azlığı; padişah ve devlet adamları kurban verildi." },
        { letter: "C", name: "Celali (Anadolu)", detail: "Ağır vergiler ve tımar bozulması; Büyük Kaçgun yaşandı." },
        { letter: "E", name: "Eyalet İsyanları", detail: "Uzak eyalet yöneticilerinin bağımsızlaşma çabası (Milliyetçilik YOK)." },
        { letter: "S", name: "Suhte (Medrese) İsyanları", detail: "İşsiz kalan medrese talebelerinin adaletsizliğe isyanı." },
      ],
    },
    examNote:
      "XVII. yüzyıl isyanlarında KESİNLİKLE milliyetçilik ve KESİNLİKLE rejim değişikliği amacı yoktur. Kişilere karşı çıkmıştır; ıslahatlar şahıslara bağlı kalmış, köklü çözülememiştir.",
    keywords: ["Beşik Ulemalığı", "Celali İsyanları", "Büyük Kaçgun", "Çınar Vakası", "Tağşiş", "İCES"],
  },
  {
    id: "ucuncu-mehmed-ve-birinci-ahmed",
    topicId: "duraklama",
    sortKey: 1595,
    dateLabel: "1595 – 1617",
    title: "III. Mehmed & I. Ahmed (Ekber ve Erşed)",
    sultan: "III. Mehmed & I. Ahmed",
    reign: "1595 – 1617",
    eyebrow: "VERASETTE DÖNÜM NOKTASI",
    kind: "sultan",
    summary:
      "Haçova Zaferi kazanıldı; sancağa çıkma kaldırılarak Kafes Sistemi ve hanedanın en yaşlısının tahta geçmesini öngören Ekber-Erşed Sistemi getirildi.",
    details: [
      "III. Mehmed: Sancağa çıkan SON padişahtır. Eğri Fatihi unvanını aldı. 1596 Haçova Meydan Muharebesi ile Avusturya'ya karşı son büyük meydan zaferini kazandı. Kanije'de Tiryaki Hasan Paşa efsanevi savunma yaptı.",
      "I. Ahmed: Sancağa çıkmadan tahta oturan İLK padişahtır. Taht kavgalarını önlemek için EKBER VE ERŞED SİSTEMİ'ni getirdi (Hanedanın en yaşlı ve en akıllı üyesi tahta geçer). Kafes (Şimşirlik) usulü başladı.",
      "1606 Zitvatorok Antlaşması (Avusturya): 1533 İstanbul Antlaşması'ndaki protokol üstünlüğü bitti; Avusturya Arşidükü Osmanlı Padişahına (Sezar / İmparator) denk sayıldı. Mütekabiliyet (karşılıklı eşitlik) ilkesine dönüldü.",
      "1612 Nasuh Paşa Antlaşması: Safevilere Ferhat Paşa ile alınan yerler geri verildi, İran her yıl 200 deve yükü ipek vermeyi kabul etti.",
      "Mimar Sedefkâr Mehmed Ağa'ya Sultanahmet Camii (Blue Mosque) yaptırıldı.",
    ],
    examNote:
      "Zitvatorok Antlaşması (1606) ile 1533 İstanbul Antlaşması'ndaki protokol üstünlüğü sona ermiş ve Avusturya ile eşitlik başlamıştır. Ekber-Erşed taht kavgalarını bitirmiş ancak deneyimsiz sultanlara yol açmıştır.",
    actors: ["III. Mehmed", "I. Ahmed", "Tiryaki Hasan Paşa", "Kuyucu Murad Paşa"],
    keywords: ["Haçova", "Kanije", "Ekber ve Erşed", "Kafes Sistemi", "Zitvatorok", "Sultanahmet"],
  },
  {
    id: "genc-osman-ve-dorduncu-murad",
    topicId: "duraklama",
    sortKey: 1618,
    dateLabel: "1618 – 1640",
    title: "II. Osman (Genç Osman) & IV. Murad",
    sultan: "Genç Osman & IV. Murad",
    reign: "1618 – 1640",
    eyebrow: "İLK RADİKAL ISLAHATÇILAR",
    kind: "sultan",
    summary:
      "Genç Osman Yeniçeri Ocağı'nı kaldırmak isterken şehit edildi. IV. Murad içki/tütün yasakları ve Koçi Bey Risalesi ile sert otorite kurup Bağdat'ı fethetti.",
    details: [
      "II. Osman (Genç Osman): İlk köklü ıslahatçı padişahtır. 1621 Hotin Seferi'nde yeniçerilerin disiplinsizliğini görerek ocağı kaldırmayı planladı. Saray dışından evlenerek sarayı halka açtı, Şeyhülislamın fetva dışındaki yetkilerini kısıtladı. Yeniçeriler tarafından Yedikule Zindanları'nda katledildi (İsyanla öldürülen ilk padişah).",
      "IV. Murad (Bağdat Fatihi): Annesi Kösem Sultan'ın vesayetinden sonra mutlak otorite kurdu. İçki, tütün ve gece sokağa çıkma yasağı koydu, kahvehaneleri kapattı.",
      "Koçi Bey ve Kâtip Çelebi'ye bozulmanın nedenlerini tespit eden 'Layihalar / Risaleler' hazırlattı.",
      "1635 Revan ve 1638 Bağdat Seferleri'ni bizzat yönetti ('Bağdat Fatihi' unvanı).",
    ],
    causalChain: {
      cause: "IV. Murad'ın Bağdat Seferi ile Safevileri kesin mağlubiyete uğratması.",
      event: "Kasr-ı Şirin Antlaşması (1639)",
      result:
        "Zağros Dağları sınır kabul edildi. Bugünkü Türkiye – İran sınırının temelini oluşturan tarihi antlaşmadır.",
    },
    examNote:
      "Kasr-ı Şirin Antlaşması (1639) günümüz Türkiye-İran sınırını büyük ölçüde belirleyen antlaşmadır. Genç Osman isyanla öldürülen ilk padişahtır.",
    actors: ["Genç Osman", "IV. Murad", "Koçi Bey", "Kâtip Çelebi", "Kösem Sultan"],
    keywords: ["Genç Osman", "Hotin", "IV. Murad", "Bağdat Fatihi", "Koçi Bey Risalesi", "Kasr-ı Şirin"],
  },
  {
    id: "koprululer-ve-ikinci-viyana",
    topicId: "duraklama",
    sortKey: 1648,
    dateLabel: "1648 – 1687",
    title: "IV. Mehmed, Köprülüler ve II. Viyana Kuşatması",
    sultan: "IV. Mehmed (Avcı)",
    reign: "1648 – 1687",
    eyebrow: "DURAKLAMA İÇİNDE YÜKSELME VE KIRILMA",
    kind: "war",
    summary:
      "Tarhuncu ilk denk bütçeyi yaptı; Köprülüler dönemiyle devlet toparlandı. Ancak 1683 II. Viyana Kuşatması büyük bir hezimete ve Karlofça'ya yol açtı.",
    details: [
      "1656 Çınar Vakası (Vaka-i Vakvakiye): Yeniçerilerin isteğiyle 30'a yakın devlet adamı Sultanahmet'te çınar ağacına asıldı.",
      "Tarhuncu Ahmed Paşa: Osmanlı tarihinde modern anlamda İLK DENK BÜTÇEYİ hazırladı.",
      "Köprülü Mehmed Paşa: Şartlar öne sürerek (can güvenliği, bağımsız karar) sadrazam olan İLK devlet adamıdır.",
      "Köprülü Fazıl Ahmed Paşa: 1669 Girit'in Fethi'ni tamamladı (24 yıllık kuşatma bitti). 1664 Vasvar Antlaşması ile Uyvar Kalesi alındı ('Uyvar önünde bir Türk gibi kuvvetli' sözü).",
      "1672 Bucaş Antlaşması (Lehistan): Podolya ve Kamaniçe alındı. Osmanlı BATI'DA EN GENİŞ SINIRLARA ulaştı.",
      "Merzifonlu Kara Mustafa Paşa: 1681 Bahçesaray (Çehrin) Antlaşması ile Rusya ile İLK resmi antlaşma yapıldı.",
      "1683 II. Viyana Kuşatması: Lehistan Kralı Jan Sobieski'nin yardıma gelmesiyle ordu iki ateş arasında kalarak bozguna uğradı; Merzifonlu Belgrad'da idam edildi.",
    ],
    mnemonic: {
      title: "Osmanlı'nın En Geniş Sınır Antlaşmaları",
      code: "F - B - B - K (FABBİK)",
      description: "Osmanlı'nın dört bir yanda en geniş sınırlara ulaştığı antlaşmalar:",
      items: [
        { letter: "F", name: "Ferhat Paşa (1590)", detail: "DOĞUDA en geniş sınırlar (Hazar Denizi'ne ulaşıldı)." },
        { letter: "B", name: "Bucaş (1672)", detail: "BATIDA en geniş sınırlar (Podolya & Ukrayna alındı)." },
        { letter: "B", name: "Bahçesaray (1681)", detail: "KUZEYDE Rusya ile imzalanan ilk resmi antlaşma (Çehrin)." },
        { letter: "K", name: "Kasr-ı Şirin (1639)", detail: "GÜNEYDOĞU / İRAN günümüz sınırının temeli (Zağros Dağları)." },
      ],
    },
    examNote:
      "1672 Bucaş ile BATI'DA EN GENİŞ sınırlara ulaşılmıştır. 1681 Çehrin Rusya ile İLK resmi antlaşmadır. Tarhuncu ilk modern denk bütçeyi yapmıştır.",
    actors: ["IV. Mehmed", "Tarhuncu Ahmed Paşa", "Köprülü Mehmed Paşa", "Köprülü Fazıl Ahmed Paşa", "Merzifonlu Kara Mustafa Paşa"],
    keywords: ["Tarhuncu", "Denk Bütçe", "Köprülüler", "Bucaş", "Batıda En Geniş Sınırlar", "II. Viyana Kuşatması", "Çehrin", "FABBİK"],
  },
  {
    id: "kutsal-ittifak-ve-karlofca",
    topicId: "duraklama",
    sortKey: 1683,
    dateLabel: "1683 – 1699",
    title: "Kutsal İttifak Savaşları ve Karlofça Antlaşması",
    eyebrow: "BÜYÜK GERİ ÇEKİLİŞİN BAŞLANGICI",
    kind: "treaty",
    summary:
      "16 yıl süren savaşlar sonrası Karlofça ile Batı'da ilk kez devasa toprak kaybedildi, Duraklama bitti ve Gerileme Dönemi başladı.",
    details: [
      "Kutsal İttifak: Viyana bozgunu üzerine Papa XI. Innocentius'un çağrısıyla Avusturya, Rusya, Lehistan, Venedik ve Malta birleşti (Şifre: MARVEL).",
      "1699 Karlofça Antlaşması (Avusturya, Lehistan, Venedik): Macaristan ve Erdel Avusturya'ya, Podolya ve Ukrayna Lehistan'a, Mora ve Dalmaçya Venedik'e verildi (İngiltere ve Hollanda arabulucu oldu; antlaşma 25 yıl Avusturya garantisinde kaldı).",
      "Karlofça'nın Önemi: Osmanlı'nın Batı'da büyük çapta toprak kaybettiği İLK antlaşmadır. Orta Avrupa egemenliği sona erdi. Taarruzdan müdafaaya (savunmaya) geçildi. Gerileme Dönemi başladı.",
      "1700 İstanbul Antlaşması (Rusya): Azak Kalesi Rusya'ya verildi (Rusya Karadeniz'e ilk kez indi) ve Rusya İstanbul'da elçi bulundurma hakkı elde etti.",
    ],
    mnemonic: {
      title: "Kutsal İttifak Devletleri Şifresi",
      code: "M - A - R - V - E - L (MARVEL)",
      description: "II. Viyana sonrası Papa'nın kurduğu Haçlı Kutsal İttifakı:",
      items: [
        { letter: "M", name: "Malta", detail: "Akdeniz korsan şövalyeleri ittifakı." },
        { letter: "A", name: "Avusturya", detail: "Habsburg İmparatorluğu (Macaristan'ı aldı)." },
        { letter: "R", name: "Rusya", detail: "Çarlık Rusyası (1700 İstanbul ile Azak'ı aldı)." },
        { letter: "V", name: "Venedik", detail: "Mora ve Dalmaçya kıyılarını aldı." },
        { letter: "L", name: "Lehistan", detail: "Podolya ve Ukrayna'yı aldı (Polonya)." },
      ],
    },
    examNote:
      "Karlofça Osmanlı'nın Batı'da büyük toprak kaybettiği İLK antlaşmadır. XVII. yüzyıl ıslahatlarında (TOKMAK) BATI ETKİSİ KESİNLİKLE YOKTUR.",
    actors: ["II. Mustafa", "Köprülü Amcazade Hüseyin Paşa", "Jan Sobieski"],
    keywords: ["Kutsal İttifak", "Karlofça", "1700 İstanbul Antlaşması", "Azak Kalesi", "TOKMAK", "MARVEL"],
  },
];

// ============================================================================
// 4. GERİLEME DÖNEMİ (1699/1700 – 1792) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const gerilemeEvents: HistoryTimelineEvent[] = [
  {
    id: "gerileme-genel-politika-ve-prut-pasarofca",
    topicId: "gerileme",
    sortKey: 1700,
    dateLabel: "1700 – 1718",
    title: "Toprakları Geri Alma Ümidi, Prut ve Pasarofça",
    eyebrow: "DEĞİŞİM VE DİPLOMASİ",
    kind: "diplomacy",
    summary:
      "Karlofça kayıplarını geri alma politikası Prut Zaferi ile umutlandırdı; ancak Pasarofça yenilgisiyle Batı'nın üstünlüğü kabul edilip Lale Devri'ne geçildi.",
    details: [
      "1703 Edirne Olayı (Cebeci İsyanı): Şeyhülislam Feyzullah Efendi'ye tepki sonucu II. Mustafa tahttan indirildi, III. Ahmed tahta çıkarıldı.",
      "1711 Prut Savaşı ve Antlaşması: Baltacı Mehmed Paşa Rus Çarı I. Petro'yu Prut Bataklığı'nda kuşattı. Azak Kalesi geri alındı. Karlofça'da kaybedilen yerleri geri alma ümidi doğdu.",
      "1715–1718 Venedik & Avusturya Savaşları: Mora geri alındı fakat Petrovaradin'de Avusturya'ya yenilindi.",
      "1718 Pasarofça Antlaşması: Belgrad, Temeşvar, Banat Avusturya'ya bırakıldı. Osmanlı Batı'nın askeri/teknik üstünlüğünü KESİN olarak kabul etti. Kaybedilen yerleri geri alma ümidi bitti; mevcut toprakları koruma ve Lale Devri başladı.",
    ],
    mnemonic: {
      title: "Gerileme Dönemi İki Ana Politikası",
      code: "G - E - R - İ",
      description: "18. Yüzyıl Osmanlı Dış Politikasının Dönüm Noktaları:",
      items: [
        { letter: "G", name: "Geri Alma Dönemi (1700-1718)", detail: "Karlofça ve İstanbul ile kaybedilen toprakları geri alma ümidi (Prut zaferi)." },
        { letter: "E", name: "Eldekini Koruma (1718-1792)", detail: "Pasarofça ile Batı üstünlüğü kabul edilip barış ve savunmaya geçildi." },
        { letter: "R", name: "Reform ve Batılılaşma", detail: "Avrupa tarzı askeri ve teknik okullar açıldı (Lale Devri, Hendesehane)." },
        { letter: "İ", name: "İttifak ve Denge", detail: "Fransa arabuluculuğu ve Kapitülasyonların daimi oluşu (1740)." },
      ],
    },
    examNote:
      "Pasarofça Antlaşması (1718) ile Osmanlı Devleti Batı'nın üstünlüğünü İLK KEZ kabul etmiş ve Lale Devri başlamıştır.",
    actors: ["III. Ahmed", "Baltacı Mehmed Paşa", "Nevşehirli Damat İbrahim Paşa"],
    keywords: ["Prut Zaferi", "Baltacı Mehmed", "Pasarofça", "Lale Devri", "Batı Üstünlüğü", "GERİ"],
  },
  {
    id: "lale-devri-islahatlari",
    topicId: "gerileme",
    sortKey: 1718,
    dateLabel: "1718 – 1730",
    title: "1. Lale Devri Islahatları (III. Ahmed)",
    sultan: "III. Ahmed",
    reign: "1718 – 1730",
    eyebrow: "KÜLTÜR, SANAT VE İLK BATI ETKİSİ",
    kind: "reform",
    summary:
      "Pasarofça ile başlayıp Patrona Halil İsyanı ile biten; zevk, sefa, diplomasi ve kültürün ön planda olduğu dönemdir. KESİNLİKLE ASKERİ ISLAHAT YAPILMAMIŞTIR.",
    keySections: [
      {
        title: "Dönemin Kadrosu ve Karakteri",
        items: [
          "Padişah: III. Ahmed | Sadrazam: Nevşehirli Damat İbrahim Paşa | Şair: Nedim | Minyatürcü: Levni.",
          "Dönemin adı sonradan Yahya Kemal Beyatlı ve Ahmet Refik Altınay tarafından verilmiştir.",
          "EN KRİTİK MEB VURGUSU: Bu dönemde KESİNLİKLE ASKERİ ISLAHAT YAPILMAMIŞTIR!",
        ],
      },
      {
        title: "Yapılan Başlıca Islahatlar",
        items: [
          "Geçici Elçilikler: Avrupa'yı tanımak için ilk kez geçici elçilikler açıldı. Paris'e giden 28 Çelebi Mehmed Efendi, 'Fransa Sefaretnamesi' ile Batı'ya açılan ilk pencere oldu.",
          "İlk Türk / Özel Matbaası (1727): İbrahim Müteferrika ve Sait Efendi kurdu (Şeyhülislam Yenişehirli Abdullah Efendi fetvasıyla). Hattatlar mağdur olmasın diye dini kitaplar hariç tarih/coğrafya/lügat basıldı. İlk basılan eser: Vankulu Lügatı.",
          "Tulumbacılar Ocağı: Yeniçerilerden oluşan ilk itfaiye teşkilatı kuruldu (Gerçek Davud / Fransız Kontu Rochefort öncülüğünde).",
          "Sağlık: Çiçek aşısı ilk kez uygulandı (Doğu'dan/İran'dan alındı).",
          "Sanayi: Yalova'da kağıt imalathanesi, İstanbul'da kumaş ve çini atölyeleri açıldı.",
          "Mimari: Barok, Rokoko tarzı girdi. İlk örnek: III. Ahmed Çeşmesi; ilk batı tarzı cami temeli: Nuruosmaniye Camii.",
          "1730 Patrona Halil İsyanı ile Lale Devri sona erdi (III. Ahmed tahttan indirildi; matbaaya dokunulmadı).",
        ],
      },
    ],
    mnemonic: {
      title: "Lale Devri Yenilikleri Şifresi",
      code: "M - E - T - A - L (METAL)",
      description: "Lale Devri'nde yapılan sivil ve kültürel yenilikler (Askeri ıslahat YOK):",
      items: [
        { letter: "M", name: "Matbaa", detail: "İlk özel Türk matbaası (İbrahim Müteferrika & Sait Efendi / Vankulu Lügatı)." },
        { letter: "E", name: "Elçilikler", detail: "İlk geçici elçilikler açıldı (28 Çelebi Mehmed - Fransa Sefaretnamesi)." },
        { letter: "T", name: "Tulumbacılar", detail: "İlk itfaiye teşkilatı kuruldu." },
        { letter: "A", name: "Aşı (Çiçek)", detail: "İlk kez çiçek aşısı uygulandı (Doğu'dan alındı)." },
        { letter: "L", name: "Lüks Mimari", detail: "Barok ve Rokoko mimarisi girdi (III. Ahmed Çeşmesi, Nuruosmaniye Camii)." },
      ],
    },
    examNote:
      "Lale Devri'nde KESİNLİKLE askeri ıslahat yoktur. İlk geçici elçi 28 Çelebi Mehmed, ilk matbaada basılan ilk eser Vankulu Lügatı'dır. Patrona Halil İsyanı'nda matbaaya zarar verilmemiştir.",
    actors: ["III. Ahmed", "Nevşehirli Damat İbrahim Paşa", "28 Çelebi Mehmed", "İbrahim Müteferrika", "Nedim", "Levni"],
    keywords: ["Lale Devri", "28 Çelebi Mehmed", "Fransa Sefaretnamesi", "İbrahim Müteferrika", "Vankulu Lügatı", "Patrona Halil", "METAL"],
  },
  {
    id: "belgrad-kucuk-kaynarca-ve-yass",
    topicId: "gerileme",
    sortKey: 1739,
    dateLabel: "1739 – 1792",
    title: "Belgrad Antlaşması, Küçük Kaynarca ve Yaş Antlaşması",
    eyebrow: "GERİLEMENİN DÖNÜM NOKTALARI",
    kind: "treaty",
    summary:
      "Belgrad 18. yüzyılın son kazançlı antlaşması oldu; Küçük Kaynarca ile Kırım elden çıktı ve Yaş Antlaşması ile Dağılma Dönemi başladı.",
    details: [
      "1736–1739 Savaşları ve Belgrad Antlaşması (1739): I. Mahmud'un askeri ıslahatları sayesinde Rusya ve Avusturya yenildi. Belgrad geri alındı. 18. yüzyılda imzalanan EN SON KAZANÇLI ANTLAŞMADIR. Karadeniz'in Türk gölü olduğu SON KEZ kabul edildi.",
      "1740 Kapitülasyonları: Arabuluculuk yaptığı için Fransa'ya verilen kapitülasyonlar I. Mahmud tarafından SÜREKLİ (DAİMİ) hale getirildi.",
      "1770 Çeşme Baskını: Rus donanması Baltık'tan gelerek Çeşme'de Osmanlı donanmasını yaktı (2. büyük yakılış).",
      "1774 Küçük Kaynarca Antlaşması (Rusya): 1) Kırım bağımsız oldu (Halkı Türk ve Müslüman bir yer İLK KEZ elden çıktı; Halifelik ilk kez siyasi güç olarak dini bağla kullanıldı). 2) Rusya'ya İLK KEZ kapitülasyon verildi. 3) Osmanlı tarihinde İLK KEZ SAVAŞ TAZMİNATI ödedi. 4) Rusya Ortodoksları koruma ve elçilik açma hakkı aldı. 5) Karadeniz Türk gölü olma vasfını kaybetti.",
      "1779 Aynalıkavak Tenkihnamesi: Kırım'da Rus yanlısı Şahin Giray'ın hanlığı tanındı.",
      "1791 Ziştovi Antlaşması: Avusturya Fransız İhtilali (1789) milliyetçilik korkusuyla savaştan çekildi (Avusturya ile yapılan SON savaştır).",
      "1792 Yaş Antlaşması (Rusya): Kırım'ın Rusya'ya ait olduğu KESİN kabul edildi. Dinyester sınır oldu. Gerileme bitti, Dağılma Dönemi başladı.",
    ],
    mnemonic: {
      title: "Küçük Kaynarca Antlaşması Maddeleri Şifresi",
      code: "K - A - R - I - M (KIRIM)",
      description: "Osmanlı'yı sarsan Küçük Kaynarca'nın (1774) 5 ağır maddesi:",
      items: [
        { letter: "K", name: "Kırım Bağımsız Oldu", detail: "Halkı Müslüman bir toprak ilk kez elden çıktı; halifelik siyasi araç yapıldı." },
        { letter: "A", name: "Azak ve Karadeniz", detail: "Karadeniz Türk gölü olma vasfını kaybetti; Rus gemilerine açıldı." },
        { letter: "R", name: "Rusya'ya Kapitülasyon", detail: "Rusya'ya ilk kez kapitülasyon hakkı tanındı." },
        { letter: "I", name: "İlk Savaş Tazminatı", detail: "Osmanlı tarihinde İLK KEZ savaş tazminatı ödemek zorunda kaldı." },
        { letter: "M", name: "Müdahale (Ortodoks Himayesi)", detail: "Rusya Osmanlı Ortodokslarını himaye hakkı ve elçilik açma yetkisi aldı." },
      ],
    },
    examNote:
      "Belgrad 18. yüzyılın son kazançlı antlaşmasıdır. Küçük Kaynarca'da halifelik ilk kez siyasi bir araç olarak kullanılmış ve ilk kez savaş tazminatı ödenmiştir.",
    actors: ["I. Mahmud", "III. Mustafa", "I. Abdülhamid", "III. Selim", "Kont de Bonneval"],
    keywords: ["Belgrad Antlaşması", "Çeşme Baskını", "Küçük Kaynarca", "Kırım Bağımsız", "Savaş Tazminatı", "Yaş Antlaşması", "KIRIM"],
  },
  {
    id: "onsekizinci-yuzyil-islahatlari",
    topicId: "gerileme",
    sortKey: 1789,
    dateLabel: "XVIII. Yüzyıl Islahatçıları",
    title: "XVIII. Yüzyıl Islahatları ve Nizam-ı Cedit",
    eyebrow: "BATI TARZI KÖKLÜ REFORMLAR",
    kind: "reform",
    summary:
      "İlk kez Batı tarzı askeri ve teknik kurumlar açıldı. Padişah şifresi 3-1-3-1-3 olup III. Selim ile Nizam-ı Cedit dönemi başladı.",
    mnemonic: {
      title: "XVIII. Yüzyıl Padişahları Şifresi",
      code: "3 - 1 - 3 - 1 - 3",
      description: "Batı tarzı askeri ve teknik ıslahatlar yapılmış; yönetim ve hukukta ıslahat yapılmamıştır.",
      items: [
        { letter: "3", name: "III. Ahmed", detail: "Lale Devri (Geçici elçilikler, ilk matbaa, çiçek aşısı, askeri ıslahat YOK)." },
        { letter: "1", name: "I. Mahmud", detail: "İlk Batı tarzı askeri ıslahat; Kont de Bonneval (Humbaracı Ahmed Paşa); Hendesehane (1734 - ilk askeri teknik okul)." },
        { letter: "3", name: "III. Mustafa", detail: "Baron de Tott; Sürat Topçuları Ocağı; Mühendishane-i Bahr-i Hümayun (1773); Esham iç borç senetleri hazırlığı." },
        { letter: "1", name: "I. Abdülhamid", detail: "Esham ilk fiili uygulama; Cülus bahşişi tamamen kaldırıldı; Yeniçeri sayımı ve ulufe alım-satım yasağı; İstihkam Okulu." },
        { letter: "3", name: "III. Selim", detail: "Nizam-ı Cedit dönemi; İrad-ı Cedit hazinesi; Akka Zaferi (1799 Cezzar Ahmed vs Napolyon); İlk daimi elçilik Londra (Yusuf Agah Efendi); Mühendishane-i Berr-i Hümayun (1795); Matbaa-i Amire (1797 devlet matbaası); Fransızca zorunlu askeri dil; Kabakçı Mustafa İsyanı (1807) ile son buldu." },
      ],
    },
    examNote:
      "İlk askeri okul Hendesehane (I. Mahmud); ilk daimi elçilik Londra / Yusuf Agah Efendi (III. Selim); cülus bahşişini tamamen kaldıran I. Abdülhamid'dir.",
    keywords: ["31313", "Nizam-ı Cedit", "Hendesehane", "Esham", "Cülus Kalktı", "Yusuf Agah Efendi", "Akka Zaferi"],
  },
];

// ============================================================================
// 5. DAĞILMA DÖNEMİ (1792 – 1922) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const dagilmaEvents: HistoryTimelineEvent[] = [
  {
    id: "dagilma-dinamikler-ve-sirp-yunan",
    topicId: "dagilma",
    sortKey: 1792,
    dateLabel: "1792 – 1829",
    title: "Dağılma Dinamikleri, Sırp ve Yunan İsyanları",
    eyebrow: "EN UZUN YÜZYIL",
    kind: "crisis",
    summary:
      "Denge politikası ve Şark Meselesi gölgesinde milliyetçilik isyanları patlak verdi. İlk isyan eden Sırplar, ilk bağımsız olan Yunanistan oldu.",
    details: [
      "Temel Dinamikler: 1789 Fransız İhtilali milliyetçilik akımı, Sanayi İnkılabı ile hammadde/pazar arayışı, Denge Politikası ve 1815 Viyana Kongresi'nde Rus Çarı I. Aleksandr tarafından ortaya atılan Şark Meselesi (Hasta Adam tabiri).",
      "1798–1801 Fransa'nın Mısır'ı İşgali: Napolyon 1799 Akka'da Cezzar Ahmed Paşa'ya yenildi. İngiltere ve Rusya Osmanlı yanında yer aldı (Denge politikasının ilk uygulaması; Rus donanması ilk kez Boğazlardan geçti).",
      "Sırp İsyanları (İlk İsyan Eden Azınlık - Kara Yorgi): 1812 Bükreş ile İMTİYAZ, 1829 Edirne ile ÖZERKLİK (Muhtariyet), 1878 Berlin ile BAĞIMSIZLIK kazandılar (Şifre: İ-M-B).",
      "Yunan İsyanı (Etniki Eterya) & 1827 Navarin Baskını: İngiltere, Fransa, Rusya donanması Osmanlı-Mısır donanmasını Navarin'de yaktı (3. büyük yakılış).",
      "1829 Edirne Antlaşması: YUNANİSTAN BAĞIMSIZ OLDU (Osmanlı'dan ayrılarak bağımsızlığını kazanan İLK AZINLIK / DEVLET).",
    ],
    mnemonic: {
      title: "Sırpların Bağımsızlık Aşamaları",
      code: "İ - M - B",
      description: "Sırplar Osmanlı'da milliyetçilikle ilk isyan eden azınlıktır:",
      items: [
        { letter: "İ", name: "1812 Bükreş Antlaşması", detail: "İlk kez İMTİYAZ (ayrıcalık) elde ettiler." },
        { letter: "M", name: "1829 Edirne Antlaşması", detail: "MUHTARİYET (özerklik) kazandılar." },
        { letter: "B", name: "1878 Berlin Antlaşması", detail: "Tam BAĞIMSIZ oldular." },
      ],
    },
    examNote:
      "İlk isyan eden azınlık SIRPLAR (1804); ilk bağımsız olan azınlık/devlet YUNANİSTAN'dır (1829 Edirne). Şark Meselesi ilk kez 1815 Viyana Kongresi'nde kullanılmıştır.",
    actors: ["II. Mahmud", "Kara Yorgi", "Kavalalı Mehmed Ali Paşa", "Cezzar Ahmed Paşa"],
    keywords: ["Şark Meselesi", "Hasta Adam", "Sırp İsyanı", "Navarin Baskını", "Edirne Antlaşması", "Yunanistan Bağımsız", "İMB"],
  },
  {
    id: "misir-sorunu-ve-bogazlar",
    topicId: "dagilma",
    sortKey: 1831,
    dateLabel: "1831 – 1841",
    title: "Mısır Sorunu, Hünkâr İskelesi ve Balta Limanı",
    eyebrow: "İÇ SORUNDAN ULUSLARARASI KRİZE",
    kind: "diplomacy",
    summary:
      "Kavalalı isyanı Kütahya'ya kadar dayandı. Rusya ile Hünkâr İskelesi, İngiltere ile Balta Limanı imzalandı; Boğazlar uluslararası sorun oldu.",
    details: [
      "Kavalalı Mehmed Ali Paşa İsyanı: Mora yerine Suriye valiliği verilmeyince oğlu İbrahim Paşa Osmanlı ordularını yenip Kütahya'ya kadar ilerledi.",
      "1833 Kütahya Antlaşması ile Kavalalı'ya Şam ve Girit valilikleri verildi.",
      "1833 Hünkâr İskelesi Antlaşması (Rusya): Kavalalı tehlikesine karşı Rusya ile 8 yıllık savunma ittifakı yapıldı ('Denize düşen yılana sarılır'). OSMANLI'NIN BOĞAZLAR ÜZERİNDE MUTLAK EGEMENLİĞİNİ TEK BAŞINA KULLANDIĞI SON ANTLAŞMADIR.",
      "1838 Balta Limanı Ticaret Antlaşması (İngiltere): Mısır meselesinde İngiliz desteği için imzalandı. İhracat vergisi %12, ithalat vergisi %5 yapıldı; tekel sistemi (Yed-i Vâhid) kaldırıldı. Osmanlı pazarı Avrupa'nın açık sömürgesi haline geldi, loncalar çöktü.",
      "1840 Londra Konferansı: Mısır hukuken Osmanlı'da kaldı, valilik Kavalalı ailesine bırakıldı.",
      "1841 Londra Boğazlar Sözleşmesi: Boğazlar uluslararası statü kazandı; barış zamanında tüm yabancı savaş gemilerine kapatıldı.",
    ],
    mnemonic: {
      title: "Boğazlar Sorununun 3 Aşaması",
      code: "H - L - M (HÜNKÂR - LONDRA - MONTRÖ)",
      description: "Boğazların mutlak hakimiyetten uluslararası statüye ve Türkiye'ye geçişi:",
      items: [
        { letter: "H", name: "1833 Hünkâr İskelesi", detail: "Osmanlı'nın Boğazlar'da tek başına karar verdiği SON antlaşma (Boğazlar sorunu başladı)." },
        { letter: "L", name: "1841 Londra Boğazlar", detail: "Boğazlar İLK KEZ uluslararası statü kazandı; savaş gemilerine kapatıldı." },
        { letter: "M", name: "1936 Montrö Sözleşmesi", detail: "Boğazlar Komisyonu kalktı; mutlak egemenlik Türkiye Cumhuriyeti'ne geçti." },
      ],
    },
    examNote:
      "Hünkâr İskelesi Osmanlı'nın Boğazlar üzerinde tek başına karar verdiği SON antlaşmadır; 1841 Londra Boğazlar Sözleşmesi ile Boğazlar uluslararası statüye geçmiştir. Balta Limanı Osmanlı ekonomisini çökerten açık pazar antlaşmasıdır.",
    actors: ["II. Mahmud", "Kavalalı Mehmed Ali Paşa", "İbrahim Paşa"],
    keywords: ["Kavalalı", "Hünkâr İskelesi", "Balta Limanı", "Yed-i Vahid", "Londra Boğazlar", "HLM"],
  },
  {
    id: "ikinci-mahmud-islahatlari",
    topicId: "dagilma",
    sortKey: 1808,
    dateLabel: "1808 – 1839",
    title: "II. Mahmud Dönemi Devrimleri",
    sultan: "II. Mahmud",
    reign: "1808 – 1839",
    eyebrow: "DEVLETİN YENİDEN YAPILANMASI",
    kind: "reform",
    summary:
      "Sened-i İttifak imzalandı, Yeniçeri Ocağı kaldırılarak Vaka-i Hayriye gerçekleştirildi, Divan kaldırılıp Bakanlıklar kuruldu ve modern kurumlar açıldı.",
    keySections: [
      {
        title: "Yönetim, Hukuk ve Toplum",
        items: [
          "1808 Sened-i İttifak: Âyanlarla imzalandı; padişahın yetkileri İLK KEZ sınırlandırıldı (İngiliz Magna Carta benzeri).",
          "Divan-ı Hümayun kaldırıldı; yerine Heyet-i Vükela / Nazırlıklar (Bakanlıklar) kuruldu.",
          "Köy ve mahalle muhtarlıkları kuruldu; Müsadere sistemi kaldırıldı (Mülkiyet hakkı ilk kez güvenceye alındı).",
          "İlk resmi gazete Takvim-i Vekayi (1831) çıkarıldı; ilk nüfus sayımı (1831 - sadece erkekler ve asker/vergi amaçlı) yapıldı.",
          "Mürur Tezkeresi (İstanbul'a giriş için iç pasaport) ve ilk posta/karantina teşkilatı kuruldu.",
          "Kılık-kıyafet reformu yapıldı (Fes ve pantolon mecburiyeti); devlet dairelerine Tasvir-i Hümayun (padişah portresi) asıldı.",
        ],
      },
      {
        title: "Askeri ve Eğitim Islahatları",
        items: [
          "Sekban-ı Cedit ve Eşkinci Ocağı denendi; 1826 Vaka-i Hayriye ile Yeniçeri Ocağı tamamen kaldırıldı.",
          "Asakir-i Mansure-i Muhammediye ordusu kuruldu; seraskerlik makamı ve Redif birlikleri (taşra yedek askerliği) ihdas edildi.",
          "Mekteb-i Tıbbiye ve Mekteb-i Harbiye açıldı; Mekteb-i Maarif-i Adliye kuruldu; Mızıka-i Hümayun (Donizetti Paşa) kuruldu.",
          "İlk kez Avrupa'ya öğrenci gönderildi; ilköğretim İstanbul'da zorunlu hale getirildi.",
        ],
      },
    ],
    mnemonic: {
      title: "II. Mahmud Dönemi İdari Yenilikleri",
      code: "N - A - Z - I - R",
      description: "II. Mahmud'un kurduğu modern idari düzen:",
      items: [
        { letter: "N", name: "Nazırlıklar (Bakanlıklar)", detail: "Divan kaldırılarak bakanlıklar ve Heyet-i Vükela kuruldu." },
        { letter: "A", name: "Asakir-i Mansure", detail: "Yeniçeri kalktı (Vaka-i Hayriye), modern ordu ve seraskerlik kuruldu." },
        { letter: "Z", name: "Zorunlu İlköğretim", detail: "İstanbul'da ilköğretim zorunlu kılındı; Harbiye ve Tıbbiye açıldı." },
        { letter: "I", name: "İlk Resmi Gazete", detail: "1831 Takvim-i Vekayi çıkarıldı; ilk nüfus sayımı yapıldı." },
        { letter: "R", name: "Ruhsat / Pasaport (Mürur)", detail: "İç pasaport (Mürur Tezkeresi) ve muhtarlıklar kuruldu; müsadere kalktı." },
      ],
    },
    examNote:
      "Sened-i İttifak padişah yetkisini sınırlayan İLK belgedir. Vaka-i Hayriye (1826) ile Yeniçeri Ocağı kaldırılmıştır. Müsaderenin kalkması özel mülkiyetin güvencesidir.",
    actors: ["II. Mahmud", "Alemdar Mustafa Paşa", "Donizetti Paşa"],
    keywords: ["Sened-i İttifak", "Vaka-i Hayriye", "Nazırlıklar", "Takvim-i Vekayi", "Müsadere Kalktı", "Harbiye", "Tıbbiye", "NAZIR"],
  },
  {
    id: "tanzimat-islahat-ve-kirim-savasi",
    topicId: "dagilma",
    sortKey: 1839,
    dateLabel: "1839 – 1861",
    title: "Tanzimat Fermanı, Kırım Savaşı ve Islahat Fermanı",
    sultan: "Sultan Abdülmecid",
    reign: "1839 – 1861",
    eyebrow: "HUKUKUN ÜSTÜNLÜĞÜ VE İLK DIŞ BORÇ",
    kind: "reform",
    summary:
      "Tanzimat ile hukukun üstünlüğü kabul edildi; Kırım Savaşı'nda ilk dış borç alındı ve Islahat Fermanı ile gayrimüslim hakları genişletildi.",
    details: [
      "1839 Tanzimat Fermanı (Gülhane Hatt-ı Hümayunu): Mustafa Reşit Paşa hazırladı. Padişah kanun gücünün üstünlüğünü İLK KEZ kabul etti. Müslüman-gayrimüslim tüm halk kanun önünde eşit sayıldı, vergi ve askerlik vatan görevi haline getirildi.",
      "1853–1856 Kırım Savaşı: Rusya'nın 'Kutsal Yerler Sorunu' ve Sinop Baskını (1853 - 4. donanma yakılışı) ile çıktı. İngiltere, Fransa ve Piyemonte Osmanlı yanında savaştı.",
      "İLK DIŞ BORÇ: 1854 Kırım Savaşı sırasında İngiltere'den alındı (Palmer & Goldschmidt).",
      "Florence Nightingale (Modern hemşireliğin kurucusu / Lambalı Kadın) Selimiye Kışlası'nda yaralıları tedavi etti.",
      "1856 Islahat Fermanı: Paris Konferansı kararlarına ek olarak ilan edildi. Özellikle gayrimüslim azınlıklara yönelik hazırlandı; cizye kaldırıldı, devlet memuru olma, okul ve kilise açma, bedelli askerlik (nakdi bedel) hakkı tanındı; 'gâvur' demek yasaklandı.",
      "1856 Paris Antlaşması: Osmanlı bir AVRUPA DEVLETİ sayıldı, Avrupa kamu hukukundan yararlanması ve toprak bütünlüğünün Avrupa garantisinde olması kabul edildi. Karadeniz tarafsız ilan edildi.",
      "Dönemin Diğer Yenilikleri: İlk kağıt para (Kaime), ilk banka (Bank-ı Dersaadet), Encümen-i Daniş, Şirket-i Hayriye, ilk telgraf hattı (Edirne-Varna-Kırım), ilk özel gazete Tercüman-ı Ahval (Şinasi & Agah Efendi), Muhassıllık meclisleri.",
    ],
    mnemonic: {
      title: "Tanzimat ve Islahat Ayrımı Şifresi",
      code: "T - Ü - M  vs  G - A - Y - R - İ",
      description: "Tanzimat tüm halkı kapsarken, Islahat özellikle gayrimüslimlere yöneliktir:",
      items: [
        { letter: "TANZİMAT", name: "TÜM Halk İçin", detail: "Müslüman-gayrimüslim ayrımı yapmadan kanun önünde eşitlik ve hukukun üstünlüğü." },
        { letter: "ISLAHAT", name: "GAYRİMÜSLİM İçin", detail: "Paris Antlaşması baskısıyla sadece azınlıklara okul, memurluk, cizye muafiyeti." },
      ],
    },
    examNote:
      "Tanzimat ile HUKUKUN ÜSTÜNLÜĞÜ ilk kez kabul edilmiştir. İlk dış borç 1854 Kırım Savaşı'nda İngiltere'den alınmıştır. Osmanlı Paris Antlaşması ile Avrupa devleti sayılmıştır.",
    actors: ["Sultan Abdülmecid", "Mustafa Reşit Paşa", "Florence Nightingale", "Şinasi", "Agah Efendi"],
    keywords: ["Tanzimat Fermanı", "Islahat Fermanı", "Kırım Savaşı", "İlk Dış Borç", "Paris Antlaşması", "Kaime", "Tercüman-ı Ahval"],
  },
  {
    id: "sultan-abdulaziz-ve-kanun-i-esasi",
    topicId: "dagilma",
    sortKey: 1861,
    dateLabel: "1861 – 1876",
    title: "Sultan Abdülaziz & I. Meşrutiyet (Kanun-ı Esasi)",
    sultan: "Sultan Abdülaziz & II. Abdülhamid",
    reign: "1861 – 1876 / 1876",
    eyebrow: "İLK ANAYASA VE PARLAMENTER DÜZEN",
    kind: "constitution",
    summary:
      "Abdülaziz Avrupa seyahatine çıkan ilk padişah oldu; Mecelle yazıldı. Genç Osmanlılar baskısıyla 1876'da Kanun-ı Esasi ilan edilerek I. Meşrutiyet başladı.",
    details: [
      "Sultan Abdülaziz: Avrupa'ya resmi seyahat düzenleyen İLK Osmanlı padişahıdır (İngiltere, Fransa, Avusturya). Dünyanın 3. büyük deniz donanmasını kurdu. Darüşşafaka, Darülmuallimat (kız öğretmen okulu), Şura-yı Devlet (Danıştay), Divan-ı Ahkam-ı Adliye (Yargıtay), Memleket Sandıkları (Ziraat Bankası temeli) ve Galatasaray Sultanisi açıldı.",
      "Mecelle: Ahmet Cevdet Paşa başkanlığındaki komisyon tarafından hazırlanan İLK İSLAMİ MEDENİ KANUN'dur (Borçlar, eşya, yargılama; aile hukuku hariç).",
      "1876 I. Meşrutiyet ve Kanun-ı Esasi: Genç Osmanlılar (Namık Kemal, Ziya Paşa, Mithat Paşa) öncülüğünde ilan edildi. TÜRK TARİHİNİN İLK YAZILI ANAYASASIDIR.",
      "Çift Meclisli Sistem: Meclis-i Mebusan (halk seçimi, 4 yılda bir) ve Meclis-i Âyan (padişah ataması ömür boyu). Halk ilk kez yönetime katıldı; rejim mutlakiyetten meşrutiyete dönüştü.",
    ],
    mnemonic: {
      title: "I. Meşrutiyet'in 4 Temel Ayağı",
      code: "G - E - N - Ç (GENÇ OSMANLILAR)",
      description: "I. Meşrutiyet'i getiren temel unsurlar:",
      items: [
        { letter: "G", name: "Genç Osmanlılar (Jön Türkler)", detail: "Namık Kemal, Şinasi, Ziya Paşa ve Mithat Paşa'nın meşrutiyet mücadelesi." },
        { letter: "E", name: "Esas Teşkilat (Kanun-ı Esasi)", detail: "Türk tarihinin ilk yazılı anayasası ilan edildi." },
        { letter: "N", name: "Nizam-ı Meclis (Çift Meclis)", detail: "Meclis-i Mebusan (halk) ve Meclis-i Âyan (padişah ataması) açıldı." },
        { letter: "Ç", name: "Çift Başlı Rejim Değişimi", detail: "Mutlak monarşiden meşruti monarşiye geçildi; halk ilk kez yönetime katıldı." },
      ],
    },
    examNote:
      "Kanun-ı Esasi (1876) Türk tarihinin İLK anayasasıdır. Rejim mutlak monarşiden meşruti monarşiye geçmiştir. Mecelle ilk medeni kanundur.",
    actors: ["Sultan Abdülaziz", "II. Abdülhamid", "Ahmet Cevdet Paşa", "Mithat Paşa", "Namık Kemal"],
    keywords: ["Mecelle", "Kanun-ı Esasi", "I. Meşrutiyet", "Meclis-i Mebusan", "Meclis-i Âyan", "Ahmet Cevdet Paşa", "GENÇ"],
  },
  {
    id: "doksan-uc-harbi-ve-berlin-antlasmasi",
    topicId: "dagilma",
    sortKey: 1877,
    dateLabel: "1877 – 1878",
    title: "93 Harbi ve Berlin Antlaşması",
    eyebrow: "BALKANLARIN PARÇALANMASI VE ERMENİ MESELESİ",
    kind: "war",
    summary:
      "Gazi Osman Paşa Plevne'de, Nene Hatun Erzurum'da destan yazdı. Berlin Antlaşması ile Sırbistan, Karadağ, Romanya bağımsız oldu ve Ermeni meselesi uluslararasılaştı.",
    details: [
      "1877–1878 Osmanlı-Rus Savaşı (93 Harbi): Tersane (İstanbul) Konferansı kararlarının reddi üzerine çıktı. Ruslar batıda Yeşilköy'e (Ayastefanos), doğuda Erzurum'a kadar geldi.",
      "Kahramanlar: Batı cephesinde Plevne Kahramanı Gazi Osman Paşa; Doğu cephesinde Aziziye Tabyası kahramanı Nene Hatun ve Ahmet Muhtar Paşa.",
      "1878 Ayastefanos Antlaşması: İngiltere ve Avusturya'nın itirazı üzerine yürürlüğe giremedi (Ölü doğan antlaşma).",
      "1878 Berlin Antlaşması: 1) Sırbistan, Karadağ ve Romanya TAM BAĞIMSIZ oldu (Şifre: SAKAR). 2) Kars, Ardahan, Batum (Elviye-i Selâse) Rusya'ya bırakıldı; Doğubayazıt Osmanlı'da kaldı. 3) Ermenilerin yaşadığı yerlerde ıslahat şartı getirildi (Ermeni Meselesi İLK KEZ uluslararası sorun oldu). 4) Bulgaristan 3 bölgeye ayrıldı.",
      "Kıbrıs'ın İdaresi: Berlin Konferansı'nda desteğini almak amacıyla İngiltere'ye geçici üs olarak bırakıldı.",
    ],
    mnemonic: {
      title: "1878 Berlin Antlaşması ile Bağımsız Olanlar",
      code: "S - K - R (SAKAR / SeKeR: Sırbistan, Karadağ, Romanya)",
      description: "93 Harbi sonrası Berlin Antlaşması ile bağımsız olan 3 Balkan devleti:",
      items: [
        { letter: "S", name: "Sırbistan", detail: "Tam bağımsız oldu." },
        { letter: "K", name: "Karadağ", detail: "Tam bağımsız oldu." },
        { letter: "R", name: "Romanya", detail: "Tam bağımsız oldu." },
      ],
    },
    examNote:
      "Berlin Antlaşması ile Sırbistan, Karadağ ve Romanya bağımsız olmuştur. Ermeni Meselesi İLK KEZ uluslararası bir antlaşmada (Berlin 61. madde) yer almıştır.",
    actors: ["II. Abdülhamid", "Gazi Osman Paşa", "Nene Hatun", "Ahmet Muhtar Paşa"],
    keywords: ["93 Harbi", "Plevne Savunması", "Gazi Osman Paşa", "Nene Hatun", "Berlin Antlaşması", "SAKAR", "Ermeni Meselesi"],
  },
  {
    id: "ikinci-abdulhamid-istibdat-ve-ikinci-mesrutiyet",
    topicId: "dagilma",
    sortKey: 1878,
    dateLabel: "1878 – 1909",
    title: "II. Abdülhamid Dönemi & II. Meşrutiyet (1908)",
    sultan: "II. Abdülhamid",
    reign: "1876 – 1909",
    eyebrow: "PANİSLAMİZM, EĞİTİM HAMLESİ VE 31 MART",
    kind: "turning-point",
    summary:
      "İstibdat döneminde İslamcılık politikası ve eğitim hamlesi uygulandı; 1908'de II. Meşrutiyet ilan edildi ve 31 Mart Vakası ile II. Abdülhamid tahttan indirildi.",
    details: [
      "İstibdat Dönemi (1878–1908): 93 Harbi gerekçesiyle Meclis-i Mebusan tatil edildi. İslamcılık (Ümmetçilik) devlet politikası oldu. Yıldız İstihbarat Teşkilatı ve Hamidiye Alayları kuruldu.",
      "Eğitim ve Kurumlar: Sanayi-i Nefise Mektebi (1882 Osman Hamdi Bey - İlk güzel sanatlar okulu), Asar-ı Atika (Arkeoloji Müzesi), Dârülaceze, Dârülhayr-ı Âlî, Ziraat Bankası (1888 Mithat Paşa öncülüğünde Memleket Sandıklarından), Hicaz Demiryolu ve Bağdat Demiryolu inşa edildi.",
      "1881 Muharrem Kararnamesi ve Düyun-ı Umumiye İdaresi: Dış borçlar ödenemeyince Genel Borçlar İdaresi kuruldu (Osmanlı gelirlerine el konuldu; mali bağımsızlık çöktü).",
      "1908 Reval Görüşmeleri: İngiltere ve Rusya Makedonya ve Boğazlar üzerinde anlaşınca İttihat ve Terakki harekete geçti.",
      "1908 II. Meşrutiyet'in İlanı ve 1908 Kayıpları (Şifre: BBG): Bulgaristan bağımsızlığını ilan etti, Avusturya-Macaristan Bosna-Hersek'i ilhak etti, Girit Yunanistan'a bağlandı.",
      "1909 Anayasa Değişikliği: Padişahın meclisi kapatma yetkisi zorlaştırıldı, hükümet meclise karşı sorumlu oldu, ilk kez ÇOK PARTİLİ HAYAT başladı (İttihat ve Terakki, Ahrar Fırkası vb.).",
      "1909 31 Mart Vakası (13 Nisan 1909): Meşrutiyet rejimine karşı çıkan ilk irticai isyandır. Selanik'ten gelen Hareket Ordusu (Komutan: Mahmud Şevket Paşa, Kurmay Başkanı: Mustafa Kemal) tarafından bastırıldı. II. Abdülhamid tahttan indirildi, V. Mehmet Reşad tahta çıkarıldı.",
    ],
    mnemonic: {
      title: "1908 II. Meşrutiyet İlanı Sırasındaki Toprak Kayıpları",
      code: "B - B - G (BBG)",
      description: "Meşrutiyet kargaşasında elden çıkan 3 toprak:",
      items: [
        { letter: "B", name: "Bulgaristan", detail: "Bağımsızlığını ilan etti." },
        { letter: "B", name: "Bosna-Hersek", detail: "Avusturya-Macaristan tarafından ilhak edildi." },
        { letter: "G", name: "Girit", detail: "Yunanistan'a bağlandığını duyurdu." },
      ],
    },
    examNote:
      "31 Mart Vakası Türk tarihinde MEVCUT REJİME (Meşrutiyete) karşı yapılan İLK isyandır; Mustafa Kemal'in tarih sahnesine çıktığı ilk olaydır. Düyun-ı Umumiye mali bağımsızlığı sona erdirmiştir.",
    actors: ["II. Abdülhamid", "Osman Hamdi Bey", "Mahmud Şevket Paşa", "Mustafa Kemal Atatürk", "Enver Paşa", "Resneli Niyazi"],
    keywords: ["İstibdat", "Düyun-ı Umumiye", "Sanayi-i Nefise", "Ziraat Bankası", "II. Meşrutiyet", "BBG", "31 Mart Vakası", "Hareket Ordusu"],
  },
  {
    id: "trablusgarp-ve-balkan-savaslari",
    topicId: "dagilma",
    sortKey: 1911,
    dateLabel: "1911 – 1913",
    title: "Trablusgarp Savaşı ve Balkan Savaşları",
    eyebrow: "İMPARATORLUĞUN SON SAVAŞLARI",
    kind: "war",
    summary:
      "Trablusgarp ile Kuzey Afrika'daki son vatan toprağı kaybedildi; Balkan Savaşları ile Rumeli tamamen elden çıktı ve Arnavutluk bağımsız oldu.",
    details: [
      "1911–1912 Trablusgarp Savaşı: İtalya'nın sömürge arayışıyla çıktı. Mustafa Kemal (Derne ve Tobruk'ta 'Gazeteci Şerif Bey' lakabıyla) ve Enver Paşa (Bingazi'de 'Kuyumcu Hamdi' lakabıyla) yerel halkı teşkilatlandırarak İtalyanları durdurdu (Mustafa Kemal'in ilk askeri başarısı; ilk kez uçak bu savaşta İtalyanlarca kullanıldı).",
      "1912 Uşi Antlaşması: Balkan Savaşı çıkınca imzalandı. Trablusgarp ve Bingazi İtalya'ya bırakıldı (KUZEY AFRİKA'DAKİ SON TOPRAK ELDEN ÇIKTI). On İki Ada geçici olarak İtalya'ya bırakıldı.",
      "1912–1913 I. Balkan Savaşı: Karadağ (savaşı başlatan ilk devlet), Sırbistan, Yunanistan, Bulgaristan Osmanlı'ya saldırdı. Ordu içindeki particilik/siyaset nedeniyle ağır yenilgi alındı. Londra Antlaşması ile Midye-Enez hattının batısı kaybedildi.",
      "1912 Arnavutluk'un Bağımsızlığı: I. Balkan Savaşı kargaşasında bağımsız oldu (OSMANLI'DAN AYRILAN EN SON BALKAN DEVLETİ).",
      "1913 Bâbıâli Baskını: Enver Paşa ve İttihatçılar Kamil Paşa hükümetini devirerek hükümet darbesiyle iktidarı tamamen ele geçirdi (İlk hükümet darbesi).",
      "1913 II. Balkan Savaşı: Bulgaristan'ın fazla pay alması üzerine diğer Balkan devletleri + Romanya (I. Balkan'da olmayıp II. Balkan'a giren devlet) Bulgaristan'a saldırdı. Fırsattan yararlanan Enver Paşa komutasındaki ordu Edirne ve Kırklareli'yi geri aldı ('Edirne Fatihi Enver Paşa'). Hamidiye Kahramanı Rauf Orbay oldu.",
    ],
    mnemonic: {
      title: "Kuzey Afrika'da Toprak Kayıp Sırası (Kronolojik)",
      code: "C - T - M - T (Ce-Ti-Me-Te: Cezayir -> Tunus -> Mısır -> Trablusgarp)",
      description: "Osmanlı'nın Kuzey Afrika'daki topraklarını kaybetme kronolojisi:",
      items: [
        { letter: "C", name: "Cezayir (1830)", detail: "Fransa tarafından işgal edildi (İlk kayıp)." },
        { letter: "T", name: "Tunus (1881)", detail: "Fransa tarafından işgal edildi." },
        { letter: "M", name: "Mısır (1882)", detail: "İngiltere tarafından işgal edildi." },
        { letter: "T", name: "Trablusgarp (1912)", detail: "İtalya'ya bırakıldı (Uşi Antlaşması - Kuzey Afrika'daki son vatan toprağı)." },
      ],
    },
    examNote:
      "Trablusgarp ile Kuzey Afrika'daki son toprak kaybedilmiştir. Arnavutluk Osmanlı'dan ayrılan EN SON Balkan devletidir. Romanya I. Balkan'da olmayıp II. Balkan'a katılmıştır. Bâbıâli Baskını ilk hükümet darbesidir.",
    actors: ["Mustafa Kemal Atatürk", "Enver Paşa", "Rauf Orbay", "Mahmud Şevket Paşa"],
    keywords: ["Trablusgarp", "Derne-Tobruk", "Uşi Antlaşması", "Balkan Savaşları", "Arnavutluk", "Bâbıâli Baskını", "Edirne Fatihi", "CTMT", "Romanya"],
  },
  {
    id: "osmanli-fikir-akimlari",
    topicId: "dagilma",
    sortKey: 1914,
    dateLabel: "Fikir Akımları Özeti",
    title: "Devleti Kurtarma Fikir Akımları",
    eyebrow: "DÜŞÜNCE DÜNYASI",
    kind: "culture",
    summary:
      "Dağılmayı önlemek amacıyla aydınlar ve yöneticiler tarafından savunulan 5 temel düşünce akımı.",
    keySections: [
      {
        title: "5 Temel Fikir Akımı (MEB 12. Sınıf)",
        items: [
          "1. Osmanlıcılık: Dil, din, ırk farkı gözetmeksizin tüm Osmanlı tebaasını eşit haklarla bir arada tutma ülküsü (Genç Osmanlılar, Namık Kemal, Mithat Paşa, Ziya Paşa; Tanzimat ve I. Meşrutiyet dönemi; Balkan Savaşları ile çöktü).",
          "2. İslamcılık (Ümmetçilik / Panislamizm): Tüm Müslümanları Halife etrafında toplama ideali (II. Abdülhamid, Mehmet Akif Ersoy, Sait Halim Paşa; I. Dünya Savaşı'nda Şerif Hüseyin / Arapların İngilizlerle iş birliği yapmasıyla çöktü).",
          "3. Türkçülük (Turancılık): Türk dünyasını ve milli bilinci birleştirme gayesi (Ziya Gökalp, Yusuf Akçura 'Üç Tarz-ı Siyaset', Mehmet Emin Yurdakul, İsmail Gaspıralı 'Dilde, işte, fikirde birlik', İttihat ve Terakki; Milli Mücadele'nin temel fikridir).",
          "4. Batıcılık: Batı'nın bilim, teknik ve kurumlarını benimseyerek kurtulma anlayışı (Tevfik Fikret, Celal Nuri, Abdullah Cevdet).",
          "5. Adem-i Merkeziyetçilik: Yerel yönetimlerin yetkilerinin artırılması ve federalizm (Prens Sabahattin).",
        ],
      },
    ],
    mnemonic: {
      title: "5 Fikir Akımı ve Baş Temsilcileri",
      code: "O - İ - T - B - A (OİTBA)",
      description: "İmparatorluğu kurtarmayı hedefleyen 5 fikir akımı:",
      items: [
        { letter: "O", name: "Osmanlıcılık", detail: "Namık Kemal, Mithat Paşa, Ziya Paşa (Balkan Savaşları ile bitti)." },
        { letter: "İ", name: "İslamcılık (Ümmetçilik)", detail: "II. Abdülhamid, Mehmet Akif, Sait Halim Paşa (Hicaz isyanı ile bitti)." },
        { letter: "T", name: "Türkçülük (Turancılık)", detail: "Ziya Gökalp, Yusuf Akçura, İsmail Gaspıralı (Milli Mücadele temeli)." },
        { letter: "B", name: "Batıcılık", detail: "Tevfik Fikret, Abdullah Cevdet, Celal Nuri." },
        { letter: "A", name: "Adem-i Merkeziyetçilik", detail: "Prens Sabahattin (Yerel yönetim ve federalizm)." },
      ],
    },
    examNote:
      "Osmanlıcılık Balkan Savaşları ile; İslamcılık I. Dünya Savaşı Hicaz-Yemen cephesinde Arapların isyanıyla geçerliliğini yitirmiştir. Milli Mücadele'nin fikir temeli Türkçülüktür.",
    actors: ["Namık Kemal", "Ziya Gökalp", "Mehmet Akif Ersoy", "Yusuf Akçura", "İsmail Gaspıralı", "Prens Sabahattin"],
    keywords: ["Osmanlıcılık", "İslamcılık", "Türkçülük", "Batıcılık", "Adem-i Merkeziyetçilik", "Yusuf Akçura", "Ziya Gökalp", "OİTBA"],
  },
];

// ============================================================================
// 6. KÜLTÜR VE UYGARLIK (UYGARLIĞI) - MEB & KPSS MÜFREDAT KONTROLLÜ
// ============================================================================
const kulturSections: CultureTopicSection[] = [
  {
    id: "devlet-yonetimi-ve-veraset",
    title: "1. Devlet Yönetimi, Kut ve Veraset Sistemi",
    badge: "MERKEZÎ OTORİTE",
    icon: "crown",
    summary:
      "Devlet yönetimi Kut anlayışı, cihan hakimiyeti, nizam-ı âlem ve kanun-ı kadim prensiplerine dayanırdı. Veraset sistemi taht kavgalarını önlemek için aşamalı olarak değiştirildi.",
    details: [
      "Hükümdarlık Alametleri: Hutbe okutmak, sikke (para) bastırmak, tuğra, otağ, nevbet (davul), sancak/alem, kılıç alayı (Eyüp Sultan'da cülus töreni), hilat (kaftan), çetr (şemsiye), taht ve sorguç.",
      "Veraset Evreleri: 1) Osman & Orhan Bey: Ülke hanedanın ortak malıdır. 2) I. Murad: Ülke padişah ve oğullarınındır. 3) Fatih: Devlet padişahındır (Kardeş katli yasalaştı). 4) I. Ahmed: Ekber ve Erşed sistemi (Hanedanın en yaşlı ve olgun üyesi) ve Kafes sistemi.",
      "Şehzade Eğitimi: Şehzadeler 'Lala' eşliğinde sancaklara vali gönderilirdi (Sancağa Çıkma). Önemli sancaklar: Manisa (Taht beşiği / Dârülmülk), Amasya, Trabzon, Kütahya, Kefe (Anadolu dışındaki tek sancak - Kırım).",
    ],
    subTables: [
      {
        title: "Veraset Sistemindeki Değişimler",
        headers: ["Dönem / Hükümdar", "Veraset Kuralı", "Temel Amaç ve Sonuç"],
        rows: [
          { col1: "Osman & Orhan Bey", col2: "Ülke hanedanın ortak malıdır", col3: "Geleneksel Türk töresi; taht kavgaları fazladır." },
          { col1: "I. Murad", col2: "Ülke padişah ve oğullarınındır", col3: "Merkezi otorite güçlendirildi; amca/yeğen elendi." },
          { col1: "Fatih Sultan Mehmed", col2: "Devlet padişahındır (Kardeş Katli)", col3: "Mutlak merkeziyetçilik; bölünme önlendi." },
          { col1: "I. Ahmed", col2: "Ekber ve Erşed (En yaşlı ve olgun)", col3: "Taht kavgaları bitti; deneyimsiz sultanlar yetişti." },
        ],
      },
    ],
    mnemonic: {
      title: "Veraset Sisteminin 4 Dönemi Şifresi",
      code: "O - M - F - A (OMFA)",
      description: "Veraset değişimini yapan 4 büyük hükümdar kronolojisi:",
      items: [
        { letter: "O", name: "Osman & Orhan", detail: "Ülke hanedanın ortak malı." },
        { letter: "M", name: "Murad I", detail: "Ülke padişah ve oğullarının malı." },
        { letter: "F", name: "Fatih (Mehmed II)", detail: "Devlet padişahın malı (Kardeş katli kanunlaştı)." },
        { letter: "A", name: "Ahmed I", detail: "Ekber ve Erşed sistemi (En yaşlı ve olgun hanedan üyesi)." },
      ],
    },
    examNote:
      "Sancağa çıkmadan tahta oturan İLK padişah I. Ahmed; sancağa çıkan SON padişah III. Mehmed'dir. Kefe Anadolu dışındaki tek sancaktır.",
  },
  {
    id: "saray-teskilati",
    title: "2. Saray Teşkilatı (Topkapı Sarayı)",
    badge: "İDARE & AKADEMİ",
    icon: "landmark",
    summary:
      "Saray hem padişahın ikametgahı hem devletin yönetim merkezi hem de üst düzey devlet adamı yetiştiren bir akademiydi.",
    details: [
      "Başlıca Saraylar: Bursa Bey Sarayı (İlk saray), Edirne Sarayı, Topkapı Sarayı (Fatih - 400 yıl merkez), Dolmabahçe (Sultan Abdülmecid - İlk batı tarzı anıtsal saray), Çırağan, Beylerbeyi, Yıldız Sarayı (II. Abdülhamid), İshak Paşa Sarayı (Doğubayazıt - İlk kalorifer/merkezi ısıtma teşkilatlı sivil saray).",
      "Topkapı Sarayı 3 Ana Bölümden Oluşur:",
      "1) Birun (Dış Saray): Devlet işlerinin yürütüldüğü dış kısımdır. Yeniçeri Ağası, Çavuşbaşı, Şehremini (belediye), Müneccimbaşı, Hekimbaşı burada görev yapar.",
      "2) Enderun (İç Saray / Saray Okulu): Devşirme çocukların eğitildiği üst düzey bürokrat akademisidir. Sadrazam, vezir, kaptan-ı derya ve sanatkar yetiştirilir. Odaları: Has Oda (Kutsal emanetler), Hazine-i Hassa, Kiler Odası, Seferli Odası.",
      "3) Harem (Darüssaade): Padişah ailesinin yaşadığı bölümdür. Kadınlar için bir terbiye ve eğitim mektebidir. Yöneticisi Valide Sultan ve Harem Ağasıdır.",
    ],
    mnemonic: {
      title: "Topkapı Sarayı'nın 3 Bölümü",
      code: "B - E - H (BEH)",
      description: "Topkapı Sarayı'nın 3 ana idari ve yaşam alanı:",
      items: [
        { letter: "B", name: "Birun", detail: "Dış saray; devletin dış idaresi ve protokol." },
        { letter: "E", name: "Enderun", detail: "İç saray; devşirme bürokrat akademisi ve Has Oda." },
        { letter: "H", name: "Harem", detail: "Özel yaşam alanı ve saray kadınları mektebi." },
      ],
    },
    examNote:
      "Enderun II. Murad zamanında Edirne'de kurulmuş, Fatih ile Topkapı'da kurumsallaşmıştır. Sadrazamların çoğu buradan yetişmiştir. İshak Paşa Sarayı ilk merkezi ısıtmalı saraydır.",
  },
  {
    id: "merkez-teskilati-ve-divan",
    title: "3. Merkez Teşkilatı ve Divan-ı Hümayun (Seyfiye, İlmiye, Kalemiye)",
    badge: "DEVLET SINIFLARI",
    icon: "scale",
    summary:
      "Devlet yönetimi Divan-ı Hümayun ve üç büyük bürokrasi sınıfı (Kılıç, Din-Hukuk-İlim, Kalem) üzerine kuruluydu.",
    details: [
      "Divan-ı Hümayun: Orhan Bey kurdu, II. Mahmud kaldırdı. Fatih'ten itibaren Sadrazam başkanlık etti; padişah Kasr-ı Adl penceresinden izledi. En yüksek karar ve yargı organıdır.",
      "Seyfiye (Yönetim ve Askeri): Sadrazam (Veziriazam - Padişah mutlak vekili), Kubbealtı Vezirleri, Kaptan-ı Derya (Deniz kuvvetleri başı), Yeniçeri Ağası, Beylerbeyi, Sancakbeyi, Subaşı.",
      "İlmiye (Din, Hukuk, Eğitim - Devşirmeler giremez, Türk/Müslüman köken zorunlu): Şeyhülislam (Fetva makamı), Kazasker (Askeri hakim; kadı ve müderrisleri atar; tuttuğu defter: Ruznamçe), Kadı, Müderris (Öğretim üyesi), Nakibüleşraf (Peygamber soyunu takip eden).",
      "Kalemiye (Bürokrasi ve Maliye): Defterdar (Maliye başı), Nişancı (Padişah tuğrasını çeker, Tapu-Tahrir defterlerini tutar, örfi hukuku yorumlar), Reisülküttap (Dışişleri ve diplomasi), Divan Katipleri.",
    ],
    subTables: [
      {
        title: "Osmanlı Yönetici Sınıfları Karşılaştırması",
        headers: ["Sınıf", "Alanı / Yetkisi", "Divan Üyeleri & Temsilcileri"],
        rows: [
          { col1: "Seyfiye (Kılıç Ehli)", col2: "Yönetim ve Askeri Güç", col3: "Sadrazam, Vezirler, Kaptan-ı Derya, Yeniçeri Ağası" },
          { col1: "İlmiye (İlim / Ulema)", col2: "Din, Hukuk, Adalet, Eğitim", col3: "Şeyhülislam, Kazasker, Kadılar, Müderrisler" },
          { col1: "Kalemiye (Kalem Ehli)", col2: "Maliye, Yazışma, Bürokrasi, Dışişleri", col3: "Defterdar, Nişancı, Reisülküttap" },
        ],
      },
    ],
    mnemonic: {
      title: "Yönetici Zümreler (Seyfiye - İlmiye - Kalemiye)",
      code: "K - İ - S (KİS)",
      description: "Devlet idaresindeki üç büyük bürokrasi sınıfı:",
      items: [
        { letter: "K", name: "Kalemiye (Bürokrasi & Maliye)", detail: "Defterdar (Maliye), Nişancı (Tuğra & Tapu), Reisülküttap (Dışişleri)." },
        { letter: "İ", name: "İlmiye (Din, Hukuk, Eğitim)", detail: "Şeyhülislam (Fetva), Kazasker (Kadı-Müderris atayan), Kadılar, Müderrisler." },
        { letter: "S", name: "Seyfiye (Kılıç & Askeri / İdare)", detail: "Sadrazam, Vezirler, Kaptan-ı Derya, Yeniçeri Ağası, Beylerbeyi." },
      ],
    },
    examNote:
      "İlmiye sınıfına devşirmeler KESİNLİKLE giremez; mutlaka Türk/Müslüman kökenli medrese mezunları girer. Kadı ve müderrisleri Kazasker atar; fetvayı Şeyhülislam verir. Reisülküttap 18. yy'da Nişancı'dan ayrılarak dışişleri bakanı olmuştur.",
  },
  {
    id: "tasra-teskilati-ve-eyaletler",
    title: "4. Taşra Teşkilatı ve Eyalet Türleri",
    badge: "İDARİ BİRİMLER",
    icon: "map-pin",
    summary:
      "Taşra idari bölünüşü Eyalet -> Sancak -> Kaza -> Köy şeklindeydi. Eyaletler vergi ve yönetim yapılarına göre üçe ayrılırdı.",
    details: [
      "İdari Sıralama: Eyalet (Yönetici: Beylerbeyi, Güvenlik: Subaşı, Adalet: Kadı) -> Sancak (Sancakbeyi) -> Kaza (Kadı) -> Köy (Köy Kethüdası / Yiğitbaşı).",
      "Eyalet Türleri (MEB Müfredatı):",
      "1) Salyanesiz (Yıllıksız) Eyaletler: Merkeze yakın eyaletlerdir. Tımar (Dirlik) sistemi uygulanır; doğrudan maaş verilmez, vergi karşılığı sipahi beslenir (Rumeli, Anadolu, Şam, Sivas, Karaman).",
      "2) Salyaneli (Yıllıklı) Eyaletler: Merkezden uzak eyaletlerdir. Tımar uygulanmaz; vergiler İLTİZAM sistemiyle Mültezimler aracılığıyla peşin toplanıp merkeze gönderilir (Mısır, Trablusgarp, Tunus, Cezayir, Yemen, Habeş).",
      "3) İmtiyazlı (Özerk) Eyaletler: İç işlerinde serbest, dışta Osmanlı'ya bağlı eyaletlerdir. Kırım (Vergi vermez, asker gönderir), Hicaz (Hem vergi vermez hem asker göndermez), Eflak-Boğdan-Erdel (Vergi verir, asker gönderir).",
    ],
    mnemonic: {
      title: "Eyalet Çeşitleri Şifresi",
      code: "S - S - İ (Salyanesiz - Salyaneli - İmtiyazlı)",
      description: "Osmanlı'nın 3 farklı taşra yönetim modeli:",
      items: [
        { letter: "S", name: "Salyanesiz (Tımarlı)", detail: "Merkeze yakın; maaş yok, tımar var (Rumeli, Anadolu)." },
        { letter: "S", name: "Salyaneli (İltizamlı)", detail: "Uzak eyaletler; iltizam ile nakit vergi toplanır (Mısır, Cezayir)." },
        { letter: "İ", name: "İmtiyazlı (Özerk)", detail: "Kırım (asker verir), Hicaz (muaf), Eflak-Boğdan (vergi verir)." },
      ],
    },
    examNote:
      "Salyanesiz eyaletlerde Tımar uygulanır; Salyaneli eyaletlerde İltizam uygulanır. Hicaz kutsal bölge olduğu için hem vergiden hem askerden muaftır.",
  },
  {
    id: "toprak-sistemi",
    title: "5. Toprak Sistemi (Mîrî, Mülk, Vakıf)",
    badge: "EKONOMİK OMURGA",
    icon: "layers",
    summary:
      "Osmanlı'da toprakların büyük kısmı devlete aitti (Mîrî Arazi). Tımar sistemiyle hazineden para çıkmadan devasa bir ordu ve tarımsal üretim güvenceye alınırdı.",
    details: [
      "A. Mîrî Arazi (Mülkiyeti Devlete Ait Topraklar):",
      "- Dirlik Arazi (Has, Zeamet, Tımar): Geliri devlet adamlarına ve askerlere hizmet karşılığı verilen topraklar.",
      "  * Has: Geliri 100.000 akçeden fazla (Padişah, hanedan, sadrazam).",
      "  * Zeamet: Geliri 20.000 – 100.000 akçe arası (Subaşı, kadı, sancakbeyi).",
      "  * Tımar: Geliri 3.000 – 20.000 akçe arası (Asker ve memurlar; Cebelü adlı atlı asker beslenir).",
      "- Mukataa: Geliri doğrudan devlet hazinesine giden iltizam arazisi.",
      "- Paşmaklık (Padişah eş ve kızlarına), Yurtluk (Sınır muhafızlarına), Ocaklık (Kale koruyucuları ve tersaneye), Malikâne (Üstün hizmet gösterenlere), Metruk (Halkın ortak kullandığı mera/otlak), Mevat (Ölü/çorak arazi).",
      "B. Mülk Arazi: Şahıslara ait araziler (Öşriye: Müslümanlara ait; Haraciye: Gayrimüslimlere ait).",
      "C. Vakıf Arazi: Geliri cami, medrese, hastane, kervansaray gibi hayır kurumlarına ayrılan, alınıp satılamayan topraklardır.",
    ],
    mnemonic: {
      title: "Dirlik Toprakları Gelir Sıralaması",
      code: "H - Z - T (Hızlı Zenginleşen Toprak)",
      description: "Gelirine göre dirlik toprakları:",
      items: [
        { letter: "H", name: "Has (100.000+)", detail: "Padişah, hanedan ve veziriazam için en yüksek gelir." },
        { letter: "Z", name: "Zeamet (20.000 - 100.000)", detail: "Kadı, subaşı ve sancakbeyi gibi orta düzey yöneticiler." },
        { letter: "T", name: "Tımar (3.000 - 20.000)", detail: "Sipahiler ve askerler için; Cebelü atlı askeri beslenir." },
      ],
    },
    examNote:
      "Tımar sisteminde köylü toprağı sebepsiz terk ederse Çiftbozan vergisi öderdi (üretimde süreklilik). Tımar ile taşra güvenliği ve masrafsız ordu sağlanırdı.",
  },
  {
    id: "ordu-teskilati",
    title: "6. Ordu Teşkilatı (Kapıkulu ve Eyalet Askerleri)",
    badge: "ASKERÎ GÜÇ",
    icon: "shield",
    summary:
      "Kara ordusu merkezdeki Kapıkulu Ordusu ile taşradaki Tımarlı Sipahiler ve Eyalet Askerlerinden meydana gelirdi.",
    details: [
      "A. Kapıkulu Ordusu (Merkez Askerleri - 3 ayda bir Ulufe maaşı alırlar; cülus bahşişi alırlar):",
      "1) Kapıkulu Piyadeleri: Acemi Ocağı (İlk eğitim), Yeniçeri Ocağı (Merkez piyadeler), Cebeci Ocağı (Silah bakım-onarım), Topçu Ocağı, Top Arabacıları, Humbaracı Ocağı (Havan topu ve el bombası), Lağımcı Ocağı (Tünel ve sur çökertme), Bostancı Ocağı (Saray ve iskele koruması).",
      "2) Kapıkulu Süvarileri (6 Bölük Halkı - Atlı Birlikler): Sipahi ve Silahtar (Padişah çadırını korurlar), Sağ ve Sol Ulufeciler (Saltanat sancaklarını korurlar), Sağ ve Sol Garipler (Devlet hazinesini ve ganimeti korurlar).",
      "B. Eyalet Askerleri (Tımarlı Sipahiler): Ordunun en kalabalık atlı kuvvetidir. Maaş almazlar, tımar gelirleriyle beslenirler; yetiştirdikleri atlı askere 'Cebelü' denir.",
      "C. Yardımcı Kuvvetler: Akıncılar (Sınır öncüleri), Azaplar (Bekar Türk gençleri), Deliler (Cesur sınır süvarileri), Sakalar (Su taşıyıcılar), Beşliler.",
      "D. Donanma: Komutan: Kaptan-ı Derya; Asker: Levent; Önemli tersaneler: Karamürsel, Gelibolu, Haliç, Sinop, Süveyş.",
    ],
    mnemonic: {
      title: "Kapıkulu Süvarileri (6 Bölük Halkı) Görevleri",
      code: "S - S - U - G (Sağdan Sola Uçan Güvercin)",
      description: "Merkez atlı birliklerinin koruma görevleri:",
      items: [
        { letter: "S - S", name: "Sipahi ve Silahtar", detail: "Padişahı ve otağ-ı hümayunu korurlar." },
        { letter: "U", name: "Sağ ve Sol Ulufeciler", detail: "Saltanat sancaklarını ve bayrakları korurlar." },
        { letter: "G", name: "Sağ ve Sol Garipler", detail: "Devlet hazinesini ve savaş ganimetlerini korurlar." },
      ],
    },
    examNote:
      "Kapıkulu Süvarileri (Sipahi, Silahtar, Ulufeciler, Garipler) padişahı, sancağı ve hazineyi korur. Tımarlı Sipahi ise taşra ordusunun omurgasıdır.",
  },
  {
    id: "hukuk-maliye-ve-sosyal-hayat",
    title: "7. Hukuk, Maliye, Vergiler ve Lonca Teşkilatı",
    badge: "HUKUK & EKONOMİ",
    icon: "banknote",
    summary:
      "Hukuk Şer'i ve Örfî olarak ikiye ayrılırdı. Maliyede Hazine-i Âmire esastı; esnaf hayatı Lonca teşkilatı ve Ahilik ilkeleriyle denetlenirdi.",
    details: [
      "Şer'i Hukuk İslam kaynaklarına, Örfî Hukuk Türk töresine ve fermanlara dayanırdı.",
      "Vergiler Şer'i (Öşür, Haraç, Cizye, Ağnam) ve Örfî (Çiftbozan, Çift Resmi, İspenç, Avarız, Bâc) olarak alınırdı.",
      "Toplum Millet Sistemi ile inanca göre sınıflandırılmıştı; esnaflar Lonca teşkilatında Narh ve Gedik usulüyle çalışırdı."
    ],
    keySections: [
      {
        title: "Hukuk Sistemi",
        items: [
          "Şer'i Hukuk: İslam hukukuna dayanır (Kuran, Sünnet, İcma, Kıyas); başı Şeyhülislamdır.",
          "Örfî Hukuk: Türk töresi, padişah fermanları ve kanunnamelerdir (En kapsamlısı: Fatih'in Kanunname-i Âli Osman'ı); başı Nişancıdır.",
          "Mahkemeler: Şer'iyye Mahkemeleri, Tanzimat Mahkemeleri (Nizamiye), Ticaret Mahkemeleri, Cemaat ve Konsolosluk Mahkemeleri.",
          "Mecelle: Ahmet Cevdet Paşa'nın yazdığı ilk medeni kanun.",
        ],
      },
      {
        title: "Vergiler Sistemi",
        items: [
          "Şer'i Vergiler: Öşür (Müslümandan 1/10 ürün vergisi), Haraç (Gayrimüslimden ürün vergisi), Cizye (Gayrimüslim askerlik çağı erkeklerinden can/güvenlik vergisi), Ağnam (Küçükbaş hayvan vergisi).",
          "Örfî Vergiler: Çiftbozan (Toprağı sebepsiz terk eden köylüden), Çift Resmi (Müslüman köylüden çiftlik arazisi vergisi), İspenç (Gayrimüslimden arazi vergisi), Avarız (Olağanüstü hal vergisi), Bâc-ı Bazar (Çarşı-pazar vergisi), İmdadiye, İane-i Cihadiye.",
          "Finans Sistemleri: İltizam (Vergiyi peşin satma), Mültezim (İltizamı alan kişi), Malikâne (İltizamın ömür boyu kiralanması), Esham (İç borçlanma senetleri).",
        ],
      },
    ],
    mnemonic: {
      title: "Şer'i Vergiler Şifresi",
      code: "Ö - H - C - A (ÖHCA)",
      description: "İslam hukukuna göre toplanan 4 temel şer'i vergi:",
      items: [
        { letter: "Ö", name: "Öşür", detail: "Müslüman köylüden alınan 1/10 ürün vergisi." },
        { letter: "H", name: "Haraç", detail: "Gayrimüslim çiftçiden alınan ürün vergisi." },
        { letter: "C", name: "Cizye", detail: "Gayrimüslim askerlik çağı erkeklerinden alınan can/güvenlik vergisi." },
        { letter: "A", name: "Ağnam", detail: "Küçükbaş hayvan yetiştiricilerinden alınan vergi." },
      ],
    },
    examNote:
      "Ahilikte gayrimüslim üye olamazken, Lonca teşkilatına gayrimüslim esnaflar da üye olabilmiştir. Narh tavan fiyat belirleme, Gedik dükkan açma ruhsatıdır.",
  },
  {
    id: "bilim-egitim-ve-sanat",
    title: "8. Bilim, Eğitim, Mimari ve Sanat",
    badge: "MEDENİYET MİRASI",
    icon: "book-open",
    summary:
      "Medreseler ve Enderun ilim merkeziydi. Mimar Sinan klasik mimariyi zirveye taşıdı; Ali Kuşçu, Piri Reis, Kâtip Çelebi gibi dehalar eserler bıraktı.",
    details: [
      "Önemli Bilim İnsanları (MEB Müfredatı):",
      "- Ali Kuşçu: Fatih dönemi matematikçi ve astronomu; İstanbul'un enlem ve boylamını hesapladı; Fethiye risalesini sundu; Ay'ın haritasını çıkardı (NASA krater adı verdi).",
      "- Akşemseddin: Fatih'in hocası; mikrobu ilk tarif eden tıp bilgini ('Maddetü'l-Hayat').",
      "- Sabuncuoğlu Şerefeddin: İlk resimli cerrahi tıp kitabını yazdı ('Cerrâhiyyetü'l-Hâniyye').",
      "- Piri Reis: İlk dünya haritasını çizdi; ünlü denizcilik eseri 'Kitab-ı Bahriye'.",
      "- Seydi Ali Reis: 'Mir'atü'l-Memalik' (Memleketlerin Aynası) ve 'Kitabü'l-Muhit' adlı eserleri yazdı.",
      "- Kâtip Çelebi: 'Cihannüma' (Coğrafya) ve 'Keşfü'z-Zünun' (Bibliyografya) yazarı; Hacı Kalfa olarak bilinir.",
      "- Evliya Çelebi: 50 yıllık gezilerini anlattığı 10 ciltlik muazzam 'Seyahatname' yazarı.",
      "- Naima: Osmanlı Devleti'nin İLK RESMİ VAKANÜVİSİDİR (Tarih yazarı).",
      "- Ahmet Cevdet Paşa: 'Tarih-i Cevdet' ve 'Mecelle' yazarı son büyük vakanüvis.",
      "- Takiyüddin Mehmed: İstanbul'da ilk rasathaneyi kuran astronom.",
      "- Osman Hamdi Bey: Sanayi-i Nefise Mektebi'ni kurdu, İstanbul Arkeoloji Müzesi'ni açtı, 'Kaplumbağa Terbiyecisi' tablosunun ressamı.",
      "Mimari Evreler:",
      "1) Erken Dönem: İznik Hacı Özbek Camii (İlk cami), Bursa Ulu Camii, Edirne Üç Şerefeli Camii.",
      "2) Klasik Dönem (Mimar Sinan): Şehzadebaşı (Çıraklık), Süleymaniye (Kalfalık), Edirne Selimiye (Ustalık).",
      "3) Geç / Batı Etkisi Dönemi (Barok, Rokoko): Nuruosmaniye Camii (İlk batı tarzı cami), III. Ahmed Çeşmesi, Dolmabahçe Sarayı, Ortaköy Camii, İshak Paşa Sarayı.",
    ],
    mnemonic: {
      title: "Mimar Sinan'ın 3 Büyük Başyapıtı",
      code: "Ş - S - S (Şehzadebaşı -> Süleymaniye -> Selimiye)",
      description: "Mimar Sinan'ın kariyer basamakları (Çıraklık -> Kalfalık -> Ustalık):",
      items: [
        { letter: "Ş", name: "Şehzadebaşı Camii (İstanbul)", detail: "Çıraklık Eseri (Kanuni'nin şehzadesi Mehmed anısına yapıldı)." },
        { letter: "S", name: "Süleymaniye Camii (İstanbul)", detail: "Kalfalık Eseri (Kanuni Sultan Süleyman adına inşa edilen külliye)." },
        { letter: "S", name: "Selimiye Camii (Edirne)", detail: "Ustalık Eseri (II. Selim adına yapıldı - UNESCO Dünya Mirası)." },
      ],
    },
    examNote:
      "İlk resmi vakanüvis NAİMA'dır. Piri Reis'in eseri Kitab-ı Bahriye; Seydi Ali Reis'in eseri Mir'atü'l-Memalik'tir. Mimar Sinan'ın ustalık eseri Edirne Selimiye'dir. İznik Hacı Özbek Camii Osmanlı'nın İLK camisidir.",
  },
];

// ============================================================================
// TÜM DÖNEMLER LİSTESİ
// ============================================================================
export const HISTORY_PERIODS: HistoryPeriod[] = [
  {
    id: "kurulus",
    shortTitle: "1. Kuruluş",
    title: "Osmanlı Kuruluş Dönemi",
    period: "1299 – 1453",
    badge: "BEYLİKTEN DEVLETE",
    slogan: "Söğüt'ten Balkanlar'a Uzanan Çınarın Doğuşu",
    description:
      "Osman Gazi ile başlayan, İskân ve İstimâlet politikalarıyla Rumeli'ye kök salan, teşkilatlanarak beylikten cihan devletine evrilen kuruluş destanı.",
    color: "#b45309",
    accentColor: "#f59e0b",
    image: "/images/tarih/osman_gazi.jpg",
    events: kurulusEvents,
  },
  {
    id: "yukselme",
    shortTitle: "2. Yükselme",
    title: "Osmanlı Yükselme / Klasik Dönemi",
    period: "1453 – 1579",
    badge: "CİHAN HÂKİMİYETİ",
    slogan: "Üç Kıtaya Hükmeden Dünya Gücü Osmanlı",
    description:
      "İstanbul'un fethiyle çağ açıp çağ kapatan, Karadeniz ve Akdeniz'i Türk gölü yapan, Halifeliği devralıp kanun ve adaleti zirveye taşıyan altın çağ.",
    color: "#047857",
    accentColor: "#10b981",
    image: "/images/tarih/istanbul_fethi.jpg",
    events: yukselmeEvents,
  },
  {
    id: "duraklama",
    shortTitle: "3. Duraklama",
    title: "Osmanlı Duraklama Dönemi",
    period: "1579 – 1699",
    badge: "ARAYIŞ YILLARI",
    slogan: "İç İsyanlar, Doğal Sınırlar ve Karlofça Kırılması",
    description:
      "Merkezi otoritede sarsıntılar, Celali isyanları, Kasr-ı Şirin ve Bucaş ile en geniş sınırlar; ardından II. Viyana ve Karlofça ile taarruzdan savunmaya geçiş.",
    color: "#854d0e",
    accentColor: "#eab308",
    image: "/images/tarih/viyana_kusatmasi.jpg",
    events: duraklamaEvents,
  },
  {
    id: "gerileme",
    shortTitle: "4. Gerileme",
    title: "Osmanlı Gerileme Dönemi",
    period: "1699 – 1792",
    badge: "DEĞİŞİM VE DİPLOMASİ",
    slogan: "Batı'nın Üstünlüğü, Lale Devri ve Askeri Islahatlar",
    description:
      "Pasarofça ile Batı'nın üstünlüğünü kabul eden, matbaa ve elçiliklerle yenileşen, Küçük Kaynarca acısını yaşayıp Nizam-ı Cedit ile modernleşmeyi başlatan dönem.",
    color: "#be123c",
    accentColor: "#f43f5e",
    image: "/images/tarih/lale_devri.jpg",
    events: gerilemeEvents,
  },
  {
    id: "dagilma",
    shortTitle: "5. Dağılma",
    title: "Osmanlı Dağılma Dönemi",
    period: "1792 – 1922",
    badge: "EN UZUN YÜZYIL",
    slogan: "Milliyetçilik İsyanları, Denge Politikası ve Anayasal Düzen",
    description:
      "Tanzimat ve Islahat fermanları, Kanun-ı Esasi ve Meclis, Denge Politikası, 93 Harbi, Trablusgarp ve Balkan Savaşları ile imparatorluktan Milli Mücadele'ye giden süreç.",
    color: "#6d28d9",
    accentColor: "#a855f7",
    image: "/images/tarih/osmanli_dagilma.jpg",
    events: dagilmaEvents,
  },
  {
    id: "kultur-uygarlik",
    shortTitle: "6. Kültür & Medeniyet",
    title: "Osmanlı Kültür ve Medeniyeti",
    period: "1299 – 1922 Külliyatı",
    badge: "DEVLET & TOPLUM MİRASI",
    slogan: "Devlet Teşkilatı, Toprak, Ordu, Hukuk, Maliye ve Bilim",
    description:
      "Saraydan Divan'a, Seyfiye-İlmiye-Kalemiye'den Tımar ve Lonca teşkilatına, Mimar Sinan'dan Ali Kuşçu'ya 623 yıllık muazzam medeniyet atlası.",
    color: "#1d4ed8",
    accentColor: "#3b82f6",
    image: "/images/tarih/divan_humayun.jpg",
    events: [],
    cultureSections: kulturSections,
  },
];

// Helper: All events
export const ALL_HISTORY_TIMELINE_EVENTS = HISTORY_PERIODS.flatMap((period) => period.events);

// Master list of all mnemonics across all periods
export const ALL_MASTER_MNEMONICS: (Mnemonic & { periodName: string; periodId: string })[] = [
  // Kuruluş
  {
    periodName: "1. Kuruluş Dönemi",
    periodId: "kurulus",
    title: "Kuruluşu Destekleyen 4 Zümre",
    code: "A - B - A - G (ABAG)",
    description: "Aşıkpaşazade Tarihi'nde geçen kurucu toplumsal zümreler:",
    items: [
      { letter: "A", name: "Ahiyân-ı Rûm", detail: "Ahiler (Şeyh Edebali, esnaf teşkilatı)." },
      { letter: "B", name: "Bâciyân-ı Rûm", detail: "Anadolu Kadınları Teşkilatı (Fatma Bacı)." },
      { letter: "A", name: "Abdalân-ı Rûm", detail: "Dervişler ve Alperenler (Geyikli Baba)." },
      { letter: "G", name: "Gaziyân-ı Rûm", detail: "Gaziler, alpler ve cengaverler." },
    ],
  },
  {
    periodName: "1. Kuruluş Dönemi",
    periodId: "kurulus",
    title: "Orhan Bey Teşkilatlanma İlkleri",
    code: "D - İ - V - A - N (DİVAN)",
    description: "Devletleşmenin temelleri Orhan Gazi döneminde atıldı:",
    items: [
      { letter: "D", name: "Divan-ı Hümayun", detail: "İlk devlet divan teşkilatı kuruldu." },
      { letter: "İ", name: "İznik Medresesi", detail: "İlk medrese açıldı (Dâvûd-ı Kayserî ilk müderris)." },
      { letter: "V", name: "Vezirlik Makamı", detail: "İlk vezir atandı (Alaeddin Paşa)." },
      { letter: "A", name: "Akçe ve Asker", detail: "İlk gümüş para basıldı; ilk düzenli ordu (Yaya ve Müsellem) kuruldu." },
      { letter: "N", name: "Naval / Donanma", detail: "Karesioğulları alınarak ilk donanma ve Karamürsel tersanesi kuruldu." },
    ],
  },
  {
    periodName: "1. Kuruluş Dönemi",
    periodId: "kurulus",
    title: "Haçlı Savaşları Kronolojisi",
    code: "S - I - N - A - V - II (SINAV II)",
    description: "Kuruluş döneminde Haçlı ittifaklarıyla yapılan büyük meydan savaşları:",
    items: [
      { letter: "S", name: "Sırpsındığı (1364)", detail: "İlk Osmanlı-Haçlı savaşı ve zaferi." },
      { letter: "I", name: "I. Kosova (1389)", detail: "İlk kez top kullanıldı; I. Murad şehit düştü." },
      { letter: "N", name: "Niğbolu (1396)", detail: "Haçlılar imha edildi; Yıldırım'a Sultan-ı İklîm-i Rûm unvanı." },
      { letter: "A", name: "Ankara Savaşı", detail: "DİKKAT! Ankara Savaşı Haçlılarla DEĞİL, Timur ile yapıldı (Çeldirici!)." },
      { letter: "V", name: "Varna (1444)", detail: "Haçlı ordusu ezici mağlubiyete uğratıldı (II. Murad)." },
      { letter: "II", name: "II. Kosova (1448)", detail: "Balkanlar KESİN Türk yurdu oldu; taarruza geçildi." },
    ],
  },
  {
    periodName: "1. Kuruluş Dönemi",
    periodId: "kurulus",
    title: "Yıldırım'ın Son Verdiği Beylikler (ATSB)",
    code: "A - S - M - G - K",
    description: "Anadolu Türk Siyasi Birliği için Yıldırım'ın fethettiği beylikler:",
    items: [
      { letter: "A", name: "Aydınoğulları", detail: "Batı Anadolu denizci beyliği." },
      { letter: "S", name: "Saruhanoğulları", detail: "Manisa çevresi." },
      { letter: "M", name: "Menteşeoğulları", detail: "Muğla çevresi denizci beylik." },
      { letter: "G", name: "Germiyanoğulları", detail: "Kütahya ve çevresi." },
      { letter: "K", name: "Karamanoğulları", detail: "Konya ve Karaman bölgesi." },
    ],
  },
  {
    periodName: "1. Kuruluş Dönemi",
    periodId: "kurulus",
    title: "Fetret Devri Şehzadeleri (1402-1413)",
    code: "İ - S - İ - M (İSİM: İsa, Süleyman, İkinci Mehmed, Musa)",
    description: "11 yıllık taht kavgasına katılan 4 kardeş şehzade:",
    items: [
      { letter: "İ", name: "İsa Çelebi", detail: "Balıkesir/Bursa kolu." },
      { letter: "S", name: "Süleyman Çelebi", detail: "Edirne kolu." },
      { letter: "İ", name: "İkinci Kurucu Mehmed Çelebi", detail: "Amasya kolu (Birliği sağlayıp devleti toparlayan 2. Kurucu)." },
      { letter: "M", name: "Musa Çelebi", detail: "Edirne/Rumeli kolu (İstanbul'u kuşattı)." },
    ],
  },

  // Yükselme
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "İstanbul'un Fethinin Dünya Tarihi Sonuçları",
    code: "F - E - T - İ - H (FETİH)",
    description: "Orta Çağ'ı kapatıp Yeni Çağ'ı başlatan 5 küresel sonuç:",
    items: [
      { letter: "F", name: "Feodalite Çöktü", detail: "Büyük şahi toplarıyla surlar yıkıldı, krallıklar güçlendi." },
      { letter: "E", name: "Ekonomik Yollar", detail: "İpek Yolu ve Boğazlar Osmanlı'ya geçti." },
      { letter: "T", name: "Tetiklenen Keşifler", detail: "Avrupalılar yeni yollar arayarak Coğrafi Keşifler'i başlattı." },
      { letter: "İ", name: "İtalya'ya Kaçan Bilginler", detail: "Bizanslı bilginlerin İtalya'ya gitmesi Rönesans'ı doğurdu." },
      { letter: "H", name: "Hristiyan Birliği Bölündü", detail: "Ortodokslara himaye verilerek Katolik birliği parçalandı." },
    ],
  },
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "Kanunname-i Âli Osman Maddeleri",
    code: "K - A - M - C - I (KAMCI)",
    description: "Fatih'in ilk yazılı anayasal kanunnamesiyle yasalaşan 5 kural:",
    items: [
      { letter: "K", name: "Kardeş Katli", detail: "Nizam-ı âlem için kardeş katli caiz kılındı." },
      { letter: "A", name: "Altın Para", detail: "İlk altın para (Sultani / Sikke-i Hasene) basıldı." },
      { letter: "M", name: "Müsadere Sistemi", detail: "Devlet adamının haksız malına el koyma kanunlaştı." },
      { letter: "C", name: "Cülus Bahşişi", detail: "Tahta çıkışta yeniçerilere bahşiş vermek zorunlu kural oldu." },
      { letter: "I", name: "İdarede Sadrazam", detail: "Divan başkanlığı sadrazama devredildi (Kasr-ı Adl)." },
    ],
  },
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "Yavuz'un Doğu Seferleri Sırası (Kronolojik)",
    code: "Ç - T - M - R (Çaldıran -> Turnadağ -> Mercidabık -> Ridaniye)",
    description: "Yavuz Sultan Selim'in 8 yıla sığdırdığı 4 büyük meydan zaferi:",
    items: [
      { letter: "Ç", name: "Çaldıran (1514)", detail: "Safevi Şah İsmail yenildi; Şii tehlikesi durduruldu." },
      { letter: "T", name: "Turnadağ (1515)", detail: "Dulkadiroğulları yıkıldı; ATSB KESİN sağlandı." },
      { letter: "M", name: "Mercidabık (1516)", detail: "Memlükler yenildi; Suriye ve Filistin alındı." },
      { letter: "R", name: "Ridaniye (1517)", detail: "Memlük yıkıldı; Mısır, Hicaz, Halifelik alındı." },
    ],
  },
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "Kanuni Dönemi İç İsyanları",
    code: "C - A - B - K (CABK: Canberdi, Ahmet, Baba Zünnun, Kalender)",
    description: "Kanuni Sultan Süleyman'ın saltanatının ilk yıllarındaki 4 isyan:",
    items: [
      { letter: "C", name: "Canberdi Gazali", detail: "Mısır'da Memlük Devleti'ni canlandırma isyanı." },
      { letter: "A", name: "Ahmet Paşa", detail: "Sadrazam yapılmayınca Mısır'da isyan etti." },
      { letter: "B", name: "Baba Zünnun", detail: "Yozgat'ta arazi/vergi anlaşmazlığı isyanı." },
      { letter: "K", name: "Kalender Çelebi", detail: "Maraş çevresi dini/sosyal Şii Türkmen isyanı." },
    ],
  },
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "Donanmanın Yakıldığı 4 Yer",
    code: "İ - Ç - N - S (İ Ç i N i Z)",
    description: "Osmanlı donanmasının tarihte yakıldığı 4 büyük felaket:",
    items: [
      { letter: "İ", name: "İnebahtı (1571)", detail: "Haçlılar yaktı (Kıbrıs fethi sonrası / II. Selim - İlk yakılış)." },
      { letter: "Ç", name: "Çeşme (1770)", detail: "Ruslar yaktı (III. Mustafa - İkinci yakılış)." },
      { letter: "N", name: "Navarin (1827)", detail: "İngiltere, Fransa, Rusya yaktı (II. Mahmud - Üçüncü yakılış)." },
      { letter: "S", name: "Sinop (1853)", detail: "Ruslar yaktı (Sultan Abdülmecid / Kırım Savaşı - Dördüncü yakılış)." },
    ],
  },
  {
    periodName: "2. Yükselme Dönemi",
    periodId: "yukselme",
    title: "Mimar Sinan'ın 3 Büyük Başyapıtı",
    code: "Ş - S - S (Şehzadebaşı -> Süleymaniye -> Selimiye)",
    description: "Mimar Sinan'ın mimari kariyer basamakları (Çıraklık -> Kalfalık -> Ustalık):",
    items: [
      { letter: "Ş", name: "Şehzadebaşı Camii (İstanbul)", detail: "Çıraklık Eseri (Kanuni'nin şehzadesi Mehmed adına)." },
      { letter: "S", name: "Süleymaniye Camii (İstanbul)", detail: "Kalfalık Eseri (Kanuni Sultan Süleyman adına inşa edilen külliye)." },
      { letter: "S", name: "Selimiye Camii (Edirne)", detail: "Ustalık Eseri (II. Selim adına - UNESCO Dünya Kültür Mirası)." },
    ],
  },

  // Duraklama
  {
    periodName: "3. Duraklama Dönemi",
    periodId: "duraklama",
    title: "XVII. Yüzyıl Islahatçıları",
    code: "T - O - K - M - A - K (TOKMAK)",
    description: "XVII. yüzyıl ıslahatlarında BATI ETKİSİ KESİNLİKLE YOKTUR:",
    items: [
      { letter: "T", name: "Tarhuncu Ahmed Paşa", detail: "İlk modern denk bütçe." },
      { letter: "O", name: "Osman II (Genç Osman)", detail: "İlk radikal ıslahatçı, saray dışı evlilik, ocağı kaldırma planı." },
      { letter: "K", name: "Kuyucu Murad Paşa", detail: "Celali isyanlarını sert tedbirlerle bastıran sadrazam." },
      { letter: "M", name: "Murad IV", detail: "İçki-tütün yasağı, Koçi Bey Risalesi, Bağdat Fatihi." },
      { letter: "A", name: "Ahmed I", detail: "Ekber ve Erşed sistemi, Kafes sistemi." },
      { letter: "K", name: "Köprülüler", detail: "Köprülü Mehmed, Fazıl Ahmed paşalar (Duraklama içinde yükselme)." },
    ],
  },
  {
    periodName: "3. Duraklama Dönemi",
    periodId: "duraklama",
    title: "En Geniş Sınır Antlaşmaları",
    code: "F - B - B - K (Ferhat Paşa, Bucaş, Bahçesaray, Kasr-ı Şirin)",
    description: "Osmanlı'nın dört bir yanda en geniş sınırlara ulaştığı antlaşmalar:",
    items: [
      { letter: "F", name: "Ferhat Paşa (1590)", detail: "DOĞUDA en geniş sınırlar (Hazar Denizi)." },
      { letter: "B", name: "Bucaş (1672)", detail: "BATIDA en geniş sınırlar (Podolya & Kamaniçe)." },
      { letter: "B", name: "Bahçesaray (1681)", detail: "KUZEYDE Rusya ile imzalanan ilk resmi antlaşma." },
      { letter: "K", name: "Kasr-ı Şirin (1639)", detail: "GÜNEYDOĞU / İRAN günümüz sınırının temeli." },
    ],
  },
  {
    periodName: "3. Duraklama Dönemi",
    periodId: "duraklama",
    title: "Kutsal İttifak Devletleri",
    code: "M - A - R - V - E - L (MARVEL)",
    description: "II. Viyana sonrası Papa'nın kurduğu Haçlı Kutsal İttifakı:",
    items: [
      { letter: "M", name: "Malta", detail: "Akdeniz korsan şövalyeleri." },
      { letter: "A", name: "Avusturya", detail: "Habsburg Hanedanı." },
      { letter: "R", name: "Rusya", detail: "Çarlık Rusyası (1700 İstanbul Antlaşması ile Azak'ı aldı)." },
      { letter: "V", name: "Venedik", detail: "Mora ve Dalmaçya kıyılarını aldı." },
      { letter: "L", name: "Lehistan", detail: "Podolya ve Ukrayna'yı aldı (Polonya)." },
    ],
  },
  {
    periodName: "3. Duraklama Dönemi",
    periodId: "duraklama",
    title: "XVII. Yüzyıl İsyan Türleri",
    code: "İ - C - E - S (İCES)",
    description: "Duraklama dönemindeki 4 ana isyan türü (Milliyetçilik ve Rejim Değişimi YOK):",
    items: [
      { letter: "İ", name: "İstanbul (Yeniçeri)", detail: "Maaş ve ulufe yetersizliği; padişah kurban verildi." },
      { letter: "C", name: "Celali (Anadolu)", detail: "Ağır vergiler ve tımar bozulması; Büyük Kaçgun yaşandı." },
      { letter: "E", name: "Eyalet İsyanları", detail: "Uzak eyalet yöneticilerinin ayrılık hareketleri." },
      { letter: "S", name: "Suhte (Medrese)", detail: "İşsiz medrese talebelerinin adaletsizliğe isyanı." },
    ],
  },

  // Gerileme
  {
    periodName: "4. Gerileme Dönemi",
    periodId: "gerileme",
    title: "XVIII. Yüzyıl Islahatçı Padişahları",
    code: "3 - 1 - 3 - 1 - 3 (Gerileme Islahatçıları)",
    description: "Batı tarzı askeri ve teknik ıslahat yapan 18. yüzyıl padişahları:",
    items: [
      { letter: "3", name: "III. Ahmed", detail: "Lale Devri (Geçici elçilikler, ilk matbaa, çiçek aşısı, askeri ıslahat YOK)." },
      { letter: "1", name: "I. Mahmud", detail: "İlk Batı tarzı askeri ıslahat; Hendesehane (1734)." },
      { letter: "3", name: "III. Mustafa", detail: "Baron de Tott; Sürat Topçuları; Esham hazırlığı." },
      { letter: "1", name: "I. Abdülhamid", detail: "Esham ilk fiili uygulama; Cülus bahşişi tamamen kaldırıldı." },
      { letter: "3", name: "III. Selim", detail: "Nizam-ı Cedit; İrad-ı Cedit; Akka Zaferi; İlk daimi elçilik Londra." },
    ],
  },
  {
    periodName: "4. Gerileme Dönemi",
    periodId: "gerileme",
    title: "Küçük Kaynarca Ağır Maddeleri",
    code: "K - A - R - I - M (KIRIM)",
    description: "1774 Küçük Kaynarca Antlaşması'nın 5 ağır sonucu:",
    items: [
      { letter: "K", name: "Kırım Bağımsız", detail: "Müslüman bir toprak ilk kez elden çıktı; Halifelik siyasi araç oldu." },
      { letter: "A", name: "Azak & Karadeniz", detail: "Karadeniz Türk gölü olma vasfını kaybetti." },
      { letter: "R", name: "Rusya'ya Kapitülasyon", detail: "Rusya'ya ilk kez ticari kapitülasyon verildi." },
      { letter: "I", name: "İlk Savaş Tazminatı", detail: "Osmanlı tarihinde İLK KEZ tazminat ödedi." },
      { letter: "M", name: "Müdahale Hakkı", detail: "Rusya Ortodoksları koruma ve elçilik açma yetkisi aldı." },
    ],
  },
  {
    periodName: "4. Gerileme Dönemi",
    periodId: "gerileme",
    title: "Lale Devri Yenilikleri",
    code: "M - E - T - A - L (METAL)",
    description: "1718-1730 Lale Devri'ndeki sivil yenilikler (Askeri ıslahat KESİNLİKLE YOK):",
    items: [
      { letter: "M", name: "Matbaa", detail: "İlk özel Türk matbaası (İbrahim Müteferrika / Vankulu Lügatı)." },
      { letter: "E", name: "Elçilikler", detail: "İlk geçici elçilikler (28 Çelebi Mehmed - Fransa Sefaretnamesi)." },
      { letter: "T", name: "Tulumbacılar", detail: "İlk itfaiye teşkilatı kuruldu." },
      { letter: "A", name: "Aşı (Çiçek)", detail: "İlk kez çiçek aşısı uygulandı (Doğu'dan alındı)." },
      { letter: "L", name: "Lüks Mimari", detail: "Barok/Rokoko tarzı girdi (III. Ahmed Çeşmesi, Nuruosmaniye)." },
    ],
  },

  // Dağılma
  {
    periodName: "5. Dağılma Dönemi",
    periodId: "dagilma",
    title: "Sırpların Bağımsızlık Aşamaları",
    code: "İ - M - B (İmtiyaz -> Muhtariyet -> Bağımsızlık)",
    description: "İlk isyan eden azınlık olan Sırpların 3 aşaması:",
    items: [
      { letter: "İ", name: "1812 Bükreş Antlaşması", detail: "İlk kez İMTİYAZ (Ayrıcalık) elde ettiler." },
      { letter: "M", name: "1829 Edirne Antlaşması", detail: "MUHTARİYET (Özerklik) kazandılar." },
      { letter: "B", name: "1878 Berlin Antlaşması", detail: "Tam BAĞIMSIZ oldular." },
    ],
  },
  {
    periodName: "5. Dağılma Dönemi",
    periodId: "dagilma",
    title: "1878 Berlin'de Bağımsız Olanlar",
    code: "S - K - R (SAKAR / SeKeR: Sırbistan, Karadağ, Romanya)",
    description: "93 Harbi sonrası Berlin Antlaşması ile bağımsız olan 3 devlet:",
    items: [
      { letter: "S", name: "Sırbistan", detail: "Tam bağımsız oldu." },
      { letter: "K", name: "Karadağ", detail: "Tam bağımsız oldu." },
      { letter: "R", name: "Romanya", detail: "Tam bağımsız oldu." },
    ],
  },
  {
    periodName: "5. Dağılma Dönemi",
    periodId: "dagilma",
    title: "1908 II. Meşrutiyet Kayıpları",
    code: "B - B - G (BBG)",
    description: "II. Meşrutiyet'in ilanı kargaşasında elden çıkan 3 toprak:",
    items: [
      { letter: "B", name: "Bulgaristan", detail: "Bağımsızlığını ilan etti." },
      { letter: "B", name: "Bosna-Hersek", detail: "Avusturya-Macaristan tarafından ilhak edildi." },
      { letter: "G", name: "Girit", detail: "Yunanistan'a bağlandığını duyurdu." },
    ],
  },
  {
    periodName: "5. Dağılma Dönemi",
    periodId: "dagilma",
    title: "Kuzey Afrika'da Toprak Kayıp Sırası (Kronolojik)",
    code: "C - T - M - T (Ce-Ti-Me-Te: Cezayir -> Tunus -> Mısır -> Trablusgarp)",
    description: "Kuzey Afrika topraklarının elden çıkış sırası:",
    items: [
      { letter: "C", name: "Cezayir (1830)", detail: "Fransa tarafından işgal edildi (İlk kayıp)." },
      { letter: "T", name: "Tunus (1881)", detail: "Fransa tarafından işgal edildi." },
      { letter: "M", name: "Mısır (1882)", detail: "İngiltere tarafından işgal edildi." },
      { letter: "T", name: "Trablusgarp (1912)", detail: "İtalya'ya bırakıldı (Uşi Antlaşması - Kuzey Afrika'daki son toprak)." },
    ],
  },
  {
    periodName: "5. Dağılma Dönemi",
    periodId: "dagilma",
    title: "5 Fikir Akımı ve Temsilcileri",
    code: "O - İ - T - B - A (OİTBA)",
    description: "Devleti kurtarma amaçlı 5 ana düşünce akımı:",
    items: [
      { letter: "O", name: "Osmanlıcılık", detail: "Namık Kemal, Mithat Paşa (Tanzimat & I. Meşrutiyet)." },
      { letter: "İ", name: "İslamcılık", detail: "II. Abdülhamid, Mehmet Akif Ersoy (İstibdat dönemi)." },
      { letter: "T", name: "Türkçülük", detail: "Ziya Gökalp, Yusuf Akçura (Milli Mücadele temeli)." },
      { letter: "B", name: "Batıcılık", detail: "Tevfik Fikret, Abdullah Cevdet." },
      { letter: "A", name: "Adem-i Merkeziyetçilik", detail: "Prens Sabahattin (Yerel yönetim/federalizm)." },
    ],
  },

  // Kültür ve Medeniyet
  {
    periodName: "6. Kültür & Medeniyet",
    periodId: "kultur-uygarlik",
    title: "Divan-ı Hümayun 3 Sınıfı (Yönetici Zümreler)",
    code: "K - İ - S (KİS)",
    description: "Devlet idaresindeki üç büyük bürokrasi sınıfı:",
    items: [
      { letter: "K", name: "Kalemiye (Bürokrasi & Maliye)", detail: "Defterdar (Maliye), Nişancı (Tuğra & Tapu), Reisülküttap (Dışişleri)." },
      { letter: "İ", name: "İlmiye (Din, Hukuk, Eğitim)", detail: "Şeyhülislam (Fetva), Kazasker (Kadı-Müderris atayan), Kadılar, Müderrisler." },
      { letter: "S", name: "Seyfiye (Kılıç & Askeri / İdare)", detail: "Sadrazam, Vezirler, Kaptan-ı Derya, Yeniçeri Ağası, Beylerbeyi." },
    ],
  },
  {
    periodName: "6. Kültür & Medeniyet",
    periodId: "kultur-uygarlik",
    title: "Dirlik Toprakları Gelir Sırası",
    code: "H - Z - T (Hızlı Zenginleşen Toprak)",
    description: "Gelirine göre dirlik toprakları hiyerarşisi:",
    items: [
      { letter: "H", name: "Has (100.000+)", detail: "Padişah, hanedan ve veziriazam için en yüksek gelir." },
      { letter: "Z", name: "Zeamet (20.000 - 100.000)", detail: "Kadı, subaşı ve sancakbeyi gibi orta düzey yöneticiler." },
      { letter: "T", name: "Tımar (3.000 - 20.000)", detail: "Sipahiler ve askerler için; Cebelü atlı askeri beslenir." },
    ],
  },
  {
    periodName: "6. Kültür & Medeniyet",
    periodId: "kultur-uygarlik",
    title: "Kapıkulu Süvarileri (6 Bölük Halkı)",
    code: "S - S - U - G (Sağdan Sola Uçan Güvercin)",
    description: "Merkez atlı birliklerinin koruma görevleri:",
    items: [
      { letter: "S - S", name: "Sipahi ve Silahtar", detail: "Padişahı ve otağ-ı hümayunu korurlar." },
      { letter: "U", name: "Sağ ve Sol Ulufeciler", detail: "Saltanat sancaklarını ve bayrakları korurlar." },
      { letter: "G", name: "Sağ ve Sol Garipler", detail: "Devlet hazinesini ve savaş ganimetlerini korurlar." },
    ],
  },
  {
    periodName: "6. Kültür & Medeniyet",
    periodId: "kultur-uygarlik",
    title: "Şer'i Vergiler Şifresi",
    code: "Ö - H - C - A (ÖHCA)",
    description: "İslam hukukuna göre toplanan 4 temel şer'i vergi:",
    items: [
      { letter: "Ö", name: "Öşür", detail: "Müslüman köylüden alınan 1/10 ürün vergisi." },
      { letter: "H", name: "Haraç", detail: "Gayrimüslim çiftçiden alınan ürün vergisi." },
      { letter: "C", name: "Cizye", detail: "Gayrimüslim askerlik çağı erkeklerinden alınan can/güvenlik vergisi." },
      { letter: "A", name: "Ağnam", detail: "Küçükbaş hayvan yetiştiricilerinden alınan vergi." },
    ],
  },
  {
    periodName: "6. Kültür & Medeniyet",
    periodId: "kultur-uygarlik",
    title: "Mimar Sinan'ın 3 Büyük Başyapıtı",
    code: "Ş - S - S (Şehzadebaşı -> Süleymaniye -> Selimiye)",
    description: "Mimar Sinan'ın kariyer basamakları (Çıraklık -> Kalfalık -> Ustalık):",
    items: [
      { letter: "Ş", name: "Şehzadebaşı Camii (İstanbul)", detail: "Çıraklık Eseri (Kanuni'nin şehzadesi Mehmed adına)." },
      { letter: "S", name: "Süleymaniye Camii (İstanbul)", detail: "Kalfalık Eseri (Kanuni Sultan Süleyman adına inşa edilen külliye)." },
      { letter: "S", name: "Selimiye Camii (Edirne)", detail: "Ustalık Eseri (II. Selim adına yapıldı - UNESCO Dünya Kültür Mirası)." },
    ],
  },
];

export function getHistoryPeriod(periodId: string) {
  return HISTORY_PERIODS.find((p) => p.id === periodId);
}

export function getHistoryTimelineEvent(eventId: string) {
  return ALL_HISTORY_TIMELINE_EVENTS.find((e) => e.id === eventId);
}

export function filterHistoryTimelineEvents(query: string, kindFilter?: string) {
  const normalized = query.trim().toLocaleLowerCase("tr-TR");

  return ALL_HISTORY_TIMELINE_EVENTS.filter((event) => {
    if (kindFilter && kindFilter !== "all" && event.kind !== kindFilter) {
      return false;
    }

    if (!normalized) return true;

    const searchableText = [
      event.title,
      event.dateLabel,
      event.sultan,
      event.mahlas,
      event.eyebrow,
      event.summary,
      event.examNote,
      ...(event.details || []),
      ...(event.actors || []),
      ...(event.keywords || []),
      event.causalChain ? `${event.causalChain.cause} ${event.causalChain.event} ${event.causalChain.result}` : "",
      event.mnemonic ? `${event.mnemonic.title} ${event.mnemonic.code} ${event.mnemonic.description}` : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr-TR");

    return searchableText.includes(normalized);
  });
}

// ============================================================================
// Progress Storage
// ============================================================================
export function emptyHistoryProgress(): HistoryProgress {
  return {
    visitedEventIds: [],
    chronologyAttempts: 0,
    chronologyCorrect: 0,
    outcomeAttempts: 0,
    outcomeCorrect: 0,
    quizAttempts: 0,
    quizCorrect: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

export function parseHistoryProgress(value: string | null): HistoryProgress {
  if (!value) return emptyHistoryProgress();
  try {
    const parsed = JSON.parse(value) as Partial<HistoryProgress>;
    return {
      visitedEventIds: Array.isArray(parsed.visitedEventIds) ? parsed.visitedEventIds : [],
      chronologyAttempts: typeof parsed.chronologyAttempts === "number" ? parsed.chronologyAttempts : 0,
      chronologyCorrect: typeof parsed.chronologyCorrect === "number" ? parsed.chronologyCorrect : 0,
      outcomeAttempts: typeof parsed.outcomeAttempts === "number" ? parsed.outcomeAttempts : 0,
      outcomeCorrect: typeof parsed.outcomeCorrect === "number" ? parsed.outcomeCorrect : 0,
      quizAttempts: typeof parsed.quizAttempts === "number" ? parsed.quizAttempts : 0,
      quizCorrect: typeof parsed.quizCorrect === "number" ? parsed.quizCorrect : 0,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return emptyHistoryProgress();
  }
}

export function loadHistoryProgress(): HistoryProgress {
  try {
    return parseHistoryProgress(localStorage.getItem(HISTORY_PROGRESS_KEY));
  } catch {
    return emptyHistoryProgress();
  }
}

export function saveHistoryProgress(progress: HistoryProgress): HistoryProgress {
  const next = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(HISTORY_PROGRESS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(HISTORY_PROGRESS_CHANGED_EVENT));
  } catch {
    // ignore local storage restrictions
  }
  return next;
}
