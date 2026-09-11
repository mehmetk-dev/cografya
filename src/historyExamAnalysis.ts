export type ExamAnalysisSection = {
  id: string;
  title: string;
  pdfQuestionCount: number;
  projectQuestionCount: number;
  pageRange: string;
};

export type ExamFactCard = {
  id: string;
  sectionId: string;
  title: string;
  fact: string;
  trap: string;
  keywords: string[];
  directCount: number;
  optionCount: number;
  years: number[];
  sourceLabel: string;
  sourceUrl: string;
};

export const EXAM_ANALYSIS_SECTIONS: ExamAnalysisSection[] = [
  { id: "first-turks", title: "İslamiyet Öncesi Türk Tarihi", pdfQuestionCount: 13, projectQuestionCount: 8, pageRange: "1-5" },
  { id: "turk-islam", title: "İlk Türk-İslam Devletleri", pdfQuestionCount: 14, projectQuestionCount: 20, pageRange: "7-11" },
  { id: "anatolia", title: "Türkiye Tarihi: Selçuklu ve Beylikler", pdfQuestionCount: 6, projectQuestionCount: 8, pageRange: "13-16" },
  { id: "ottoman-rise", title: "Osmanlı Kuruluş ve Yükselme", pdfQuestionCount: 14, projectQuestionCount: 17, pageRange: "17-23" },
  { id: "ottoman-reform", title: "Osmanlı Duraklama ve Gerileme", pdfQuestionCount: 10, projectQuestionCount: 22, pageRange: "25-30" },
  { id: "ottoman-decline", title: "Osmanlı Dağılma Dönemi", pdfQuestionCount: 20, projectQuestionCount: 13, pageRange: "32-40" },
  { id: "ottoman-culture", title: "Osmanlı Kültür ve Medeniyeti", pdfQuestionCount: 32, projectQuestionCount: 18, pageRange: "44-54" },
  { id: "late-ottoman", title: "XX. Yüzyıl Başlarında Osmanlı", pdfQuestionCount: 14, projectQuestionCount: 14, pageRange: "60-66" },
  { id: "preparation", title: "Millî Mücadele Hazırlık", pdfQuestionCount: 21, projectQuestionCount: 21, pageRange: "69-77" },
  { id: "independence", title: "Kurtuluş Savaşı", pdfQuestionCount: 22, projectQuestionCount: 10, pageRange: "82-92" },
  { id: "revolutions", title: "Atatürk İnkılapları ve İlkeleri", pdfQuestionCount: 39, projectQuestionCount: 13, pageRange: "97-113" },
  { id: "foreign-policy", title: "Atatürk Dönemi İç ve Dış Politika", pdfQuestionCount: 26, projectQuestionCount: 3, pageRange: "114-121" },
  { id: "contemporary", title: "Çağdaş Türk ve Dünya Tarihi", pdfQuestionCount: 38, projectQuestionCount: 9, pageRange: "124-133" },
];

const OGM = "MEB OGM Materyal";
const SOURCES = {
  firstTurks: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/turkkulturvemedeniyettarihi/sec/unite1/files/basic-html/page51.html",
  turkIslam: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/defterim/9/tarih/files/basic-html/page192.html",
  turkIslamState: "https://ogmmateryal.eba.gov.tr/panel/upload/files/uhhkg1nwbix.pdf",
  ottomanOrder: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/tarih/10/unite3/icerik/uniteozeti.pdf",
  ottomanReform: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/tarih/11/unite4/files/basic-html/page43.html",
  ottomanDiplomacy: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/tarih/11/unite3/files/basic-html/page6.html",
  nationalStruggle: "https://ogmmateryal.eba.gov.tr/pdf-goster/176130",
  nationalDiplomacy: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/calisma_defteri/f5/12/tarih/files/basic-html/page18.html",
  principles: "https://ogmmateryal.eba.gov.tr/panel/upload/pdf/wlsv5k54ndd.pdf",
  foreignPolicy: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/uluslararasiiliskiler/sec/unite1/files/basic-html/page116.html",
  contemporary: "https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/cagdasturkvedunyatarihi/sec/unite2/files/basic-html/page20.html",
};

function fact(
  id: string, sectionId: string, title: string, body: string, trap: string,
  keywords: string[], directCount: number, optionCount: number, years: number[], sourceUrl: string,
): ExamFactCard {
  return { id, sectionId, title, fact: body, trap, keywords, directCount, optionCount, years, sourceLabel: OGM, sourceUrl };
}

// Sıklık alanları, 2014-2024 sorularının OCR ile taranıp kavram rollerinin
// birleştirilmesinden elde edilen çalışma sinyalleridir. Kart bilgileri OGM/EBA ile doğrulanır.
export const EXAM_FACT_CARDS: ExamFactCard[] = [
  fact("kut", "first-turks", "Kut ve veraset", "Hükümdarlık yetkisinin Tanrı tarafından hanedana verildiğine inanılır; ülke hanedanın ortak malı sayılabilir.", "Kut halkın yönetime katılması değil, iktidarın meşruiyet kaynağıdır.", ["kut", "veraset", "hanedan", "taht"], 4, 6, [2017, 2018, 2021, 2023], SOURCES.firstTurks),
  fact("dual-rule", "first-turks", "İkili teşkilat", "Doğu kanadı kağan, batı kanadı yabgu yönetir; doğu üstündür.", "Yabgu bağımsız hükümdar değil, kağana bağlı batı kanadı yöneticisidir.", ["ikili teşkilat", "yabgu", "kağan"], 3, 5, [2018, 2020, 2024], SOURCES.firstTurks),
  fact("uyghurs", "first-turks", "Uygurları ayıran özellikler", "Manihaizm, yerleşik hayat, kâğıt-matbaa ve şehir kültürü Uygurlarla birlikte anılır.", "Manas Kırgızlara; Ergenekon ve Bozkurt Göktürklere aittir.", ["uygur", "manihaizm", "matbaa", "yerleşik"], 4, 7, [2014, 2019, 2021, 2023], SOURCES.firstTurks),
  fact("orkhon", "first-turks", "Orhun Yazıtları", "Bilge Kağan, Kül Tigin ve Tonyukuk adına dikilen yazıtlar Türk tarihinin temel yazılı kaynaklarındandır.", "Mukan Kağan ve Bögü Kağan yazıtların adına dikildiği kişiler değildir.", ["orhun", "bilge kağan", "kül tigin", "tonyukuk"], 3, 4, [2016, 2021, 2024], SOURCES.firstTurks),
  fact("society", "first-turks", "Oguş-urug-boy-budun-il", "Eski Türk toplumunda aileden devlete sıralama oguş, urug, boy, budun ve il biçimindedir.", "Oguş devlet değil ailedir; il devlet karşılığıdır.", ["oguş", "urug", "boy", "budun", "il"], 2, 5, [2022, 2024], SOURCES.firstTurks),

  fact("karakhanids", "turk-islam", "Karahanlılar", "Karahanlılar Asya'daki ilk Türk-İslam devleti kabul edilir; Satuk Buğra Han İslamiyet'i kabul eden hükümdardır.", "İlk Müslüman Türk devleti ile Mısır'daki ilk Türk devleti aynı şey değildir.", ["karahanlı", "satuk buğra", "ilk türk islam"], 3, 5, [2015, 2019, 2023], SOURCES.turkIslam),
  fact("ghaznavids", "turk-islam", "Gazneliler ve Hindistan", "Gazneli Mahmut'un Hindistan seferleri İslamiyet'in bölgede yayılmasını sağladı.", "Gaznelilerin kuruluşu ile Dandanakan sonrası yıkılış sürecini karıştırma.", ["gazneli", "hindistan", "sultan mahmut"], 2, 4, [2017, 2020], SOURCES.turkIslam),
  fact("dandanakan", "turk-islam", "Dandanakan dönüm noktası", "1040 Dandanakan Savaşı ile Büyük Selçuklu Devleti kuruluşunu tamamladı.", "Malazgirt Anadolu'nun kapılarını açar; Dandanakan devleti kurar.", ["dandanakan", "büyük selçuklu", "gazneli"], 2, 5, [2018, 2022], SOURCES.turkIslam),
  fact("sovereignty-symbols", "turk-islam", "Bağımsızlık sembolleri", "Hutbe, para, menşur, tıraz, çetr ve nevbet hükümdarlık ve bağımsızlık sembolleri arasındadır.", "Siyasetname bir sembol değil, hükümdara yönetim öğüdü veren eser türüdür.", ["hutbe", "para", "menşur", "tıraz", "çetr", "nevbet"], 3, 7, [2016, 2020, 2024], SOURCES.turkIslamState),
  fact("iqta", "turk-islam", "İkta sistemi", "Devlet gelirlerinin hizmet ve asker yetiştirme karşılığında tahsis edilmesi ikta sistemidir.", "Toprağın mülkiyeti ikta sahibine geçmez.", ["ikta", "toprak", "asker"], 2, 5, [2019, 2023], SOURCES.turkIslamState),

  fact("malazgirt", "anatolia", "Malazgirt ve Anadolu", "1071 Malazgirt Zaferi Anadolu'nun Türk yurdu olma sürecini hızlandırdı ve ilk beyliklerin kurulmasına ortam hazırladı.", "Pasinler ilk Büyük Selçuklu-Bizans savaşı; Miryokefalon kalıcılığın kanıtıdır.", ["malazgirt", "pasinler", "miryokefalon"], 2, 5, [2016, 2021], SOURCES.turkIslam),
  fact("anatolian-beyliks", "anatolia", "İlk Anadolu beylikleri", "Saltuklular, Danişmentliler, Mengücekliler, Artuklular ve Çaka Beyliği Anadolu'nun Türkleşmesine katkı verdi.", "Taceddinoğulları ilk beylikler grubunda değildir.", ["saltuklu", "danişment", "mengücek", "artuklu", "çaka"], 2, 6, [2016, 2023], SOURCES.turkIslam),
  fact("capital-konya", "anatolia", "İznik'ten Konya'ya", "I. Haçlı Seferi baskısı sonrasında Türkiye Selçuklu başkenti İznik'ten Konya'ya taşındı.", "Başkentin taşınması Kösedağ Savaşı'nın sonucu değildir.", ["İznik", "Konya", "haçlı"], 1, 4, [2018], SOURCES.turkIslam),

  fact("iskan-istimalet", "ottoman-rise", "İskân ve istimâlet", "İskân Balkanların Türkleşmesini ve üretimi; istimâlet hoşgörü yoluyla bağlılığı destekledi.", "İskân zorunlu din değiştirme politikası değildir.", ["iskân", "istimâlet", "rumeli"], 3, 7, [2015, 2021, 2024], SOURCES.ottomanOrder),
  fact("karesi-cimpe", "ottoman-rise", "Karesi ve Çimpe", "Karesioğullarının alınması donanma ve komutan kazandırdı; Çimpe Osmanlı'nın Rumeli'deki ilk toprağıdır.", "Rumeli'ye geçişi yalnızca fetihle açıklama; Kantakuzen'e yardım bağlamını hatırla.", ["karesi", "çimpe", "rumeli", "kantakuzen"], 3, 6, [2017, 2022, 2024], SOURCES.ottomanOrder),
  fact("devshirme", "ottoman-rise", "Devşirme ve Kapıkulu", "Devşirme sistemi merkez ordusu ve saray için insan kaynağı oluşturdu; Kapıkulu askerleri merkezîde bağlıydı.", "Tımarlı sipahiler Kapıkulu değil eyalet askeridir.", ["devşirme", "kapıkulu", "yeniçeri", "tımarlı sipahi"], 2, 6, [2020, 2023], SOURCES.ottomanOrder),
  fact("fatih", "ottoman-rise", "Fatih'in merkezîleşmesi", "Kanunname, kardeş katli düzenlemesi ve Divan'a sadrazamın başkanlık etmesi merkezî otoriteyi güçlendirdi.", "Millet sistemi ile merkezîleşme araçlarını aynı başlıkta toplama.", ["fatih", "kanunname", "kardeş katli", "divan"], 3, 7, [2016, 2020, 2024], SOURCES.ottomanOrder),
  fact("sultan-i-iklim-i-rum", "ottoman-rise", "Niğbolu ve unvan", "Yıldırım Bayezid Niğbolu Zaferi sonrasında halife tarafından Sultan-ı İklim-i Rum unvanıyla anıldı.", "Unvanı Ankara Savaşı veya İstanbul'un fethiyle eşleştirme.", ["niğbolu", "yıldırım", "sultan-ı iklim-i rum"], 1, 4, [2023], SOURCES.ottomanOrder),

  fact("seventeenth-reforms", "ottoman-reform", "XVII. yüzyıl ıslahatları", "XVII. yüzyıl ıslahatları kişilere bağlı, baskıcı ve eski düzeni yeniden kurmaya yöneliktir.", "Avrupa örnek alınmadı; bu belirgin biçimde XVIII. yüzyılda başladı.", ["XVII. yüzyıl", "ıslahat", "Koçi Bey", "Tarhuncu"], 3, 7, [2014, 2018, 2022], SOURCES.ottomanReform),
  fact("tulip-era", "ottoman-reform", "Lale Devri", "Lale Devri'nde Avrupa geçici elçiliklerle izlenmeye, matbaa ve yeni kültür kurumları kullanılmaya başlandı.", "Daimî elçilikler Lale Devri'nde değil III. Selim dönemindedir.", ["lale devri", "matbaa", "elçilik", "III. Selim"], 3, 8, [2016, 2019, 2024], SOURCES.ottomanReform),
  fact("nizam-i-cedid", "ottoman-reform", "Nizam-ı Cedid", "III. Selim'in yeni ordusu ve reform programı Nizam-ı Cedid, finansmanı ise İrad-ı Cedid'dir.", "Sekban-ı Cedid II. Mahmut; Eşkinci Ocağı Yeniçeriliğin kaldırılması öncesidir.", ["nizam-ı cedid", "irad-ı cedid", "III. Selim"], 2, 6, [2018, 2021], SOURCES.ottomanReform),
  fact("vakayi-hayriye", "ottoman-reform", "Vaka-i Hayriye", "1826'da Yeniçeri Ocağı kaldırıldı ve Asakir-i Mansure-i Muhammediye kuruldu.", "Nizam-ı Cedid'in kaldırılması Vaka-i Hayriye değildir.", ["vaka-i hayriye", "yeniçeri", "asakir-i mansure"], 2, 6, [2019, 2023], SOURCES.ottomanReform),

  fact("sened-i-ittifak", "ottoman-decline", "Sened-i İttifak", "1808 Sened-i İttifak merkez ile ayanlar arasında imzalandı; padişah otoritesinin sınırlanması yönünde bir adım sayılır.", "Halka anayasal hak veren bir anayasa değildir.", ["sened-i ittifak", "ayan", "II. Mahmut"], 2, 6, [2015, 2022], SOURCES.ottomanReform),
  fact("tanzimat", "ottoman-decline", "Tanzimat Fermanı", "1839 Tanzimat Fermanı can-mal-namus güvenliği, vergi ve askerlikte düzen ile hukuk güvencesi getirmeyi amaçladı.", "Müslim-gayrimüslim eşitliğini ayrıntılandıran metin Islahat Fermanı'dır.", ["tanzimat", "gülhane", "can mal namus"], 4, 8, [2014, 2018, 2021, 2024], SOURCES.ottomanReform),
  fact("reform-edict", "ottoman-decline", "Islahat Fermanı", "1856 Islahat Fermanı gayrimüslimlere tanınan hakları genişletti ve eşitlik vurgusunu artırdı.", "Tanzimat'la aynı metin değildir; Kırım Savaşı ve Paris Konferansı ortamını hatırla.", ["ıslahat fermanı", "gayrimüslim", "paris"], 3, 7, [2016, 2020, 2023], SOURCES.ottomanReform),
  fact("kanun-i-esasi", "ottoman-decline", "Kanun-ı Esasi ve Meşrutiyet", "1876 Kanun-ı Esasi ilk Osmanlı anayasası; I. Meşrutiyet ise parlamentolu yönetime geçiştir.", "Padişahın yetkileri tamamen sona ermedi.", ["kanun-ı esasi", "meşrutiyet", "meclis-i mebusan"], 4, 8, [2015, 2018, 2022, 2024], SOURCES.ottomanReform),
  fact("balta-limani", "ottoman-decline", "Balta Limanı", "1838 Balta Limanı Ticaret Antlaşması tekel usulünü kaldırıp yabancı tüccara geniş imkânlar sağladı.", "Siyasi anayasa belgesi değil ekonomik antlaşmadır.", ["balta limanı", "tekel", "ticaret"], 3, 7, [2018, 2021, 2023], SOURCES.ottomanDiplomacy),
  fact("straits-chronology", "ottoman-decline", "Boğazlar kronolojisi", "Hünkâr İskelesi Rusya'ya avantaj; Londra Boğazlar Sözleşmesi Boğazları uluslararası statüye taşıdı.", "Kütahya, Hünkâr İskelesi, Balta Limanı ve Londra sırasını karıştırma.", ["hünkâr iskelesi", "londra", "boğazlar", "kütahya"], 3, 8, [2016, 2020, 2024], SOURCES.ottomanDiplomacy),

  fact("timar", "ottoman-culture", "Tımar sistemi: dört işlev", "Tımar; vergi toplama, atışlı asker yetiştirme, üretim sürekliliği ve taşra güvenliğini birlikte sağlar.", "Tımar sahibi toprağın mülkiyetini kazanmaz.", ["tımar", "dirlik", "sipahi", "reaya"], 5, 10, [2014, 2017, 2020, 2022, 2024], SOURCES.ottomanOrder),
  fact("dirlik", "ottoman-culture", "Has-zeamet-tımar", "Dirlikler gelirlerine göre has, zeamet ve tımar olarak ayrılır.", "Bu ayrım arazi mülkiyetini değil vergi geliri tahsisini gösterir.", ["has", "zeamet", "tımar", "dirlik"], 3, 8, [2016, 2021, 2023], SOURCES.ottomanOrder),
  fact("classes", "ottoman-culture", "Seyfiye-ilmiye-kalemiye", "Seyfiye yönetim ve askerlik; ilmiye din, eğitim ve hukuk; kalemiye yazışma ve maliyedir.", "Defterdar kalemiye, kazasker ilmiye, vezir seyfiye içinde düşünülür.", ["seyfiye", "ilmiye", "kalemiye", "kazasker", "defterdar"], 4, 11, [2015, 2018, 2021, 2024], SOURCES.ottomanOrder),
  fact("taxes", "ottoman-culture", "Şerî ve örfî vergiler", "Şerî vergiler dinî hukuka, örfî vergiler devlet ihtiyacı ve padişah düzenlemelerine dayanır.", "Avarız örfî; öşür ve cizye şerî vergilerdendir.", ["vergi", "öşür", "cizye", "avarız"], 3, 9, [2017, 2020, 2023], SOURCES.ottomanOrder),
  fact("vakif", "ottoman-culture", "Vakıf sistemi", "Vakıflar eğitim, sağlık, bayındırlık ve sosyal yardım hizmetlerinin finansmanında rol oynadı.", "Vakıf doğrudan asker yetiştiren bir toprak sistemi değildir.", ["vakıf", "imaret", "darüşşifa", "külliye"], 2, 8, [2019, 2022], SOURCES.ottomanOrder),
  fact("guild", "ottoman-culture", "Lonca ve narh", "Lonca üretim kalitesi ve meslek düzenini; narh fiyat denetimini sağladı.", "Gedik işyeri açma hakkı; narh fiyat belirlemedir.", ["lonca", "narh", "gedik", "esnaf"], 3, 8, [2016, 2020, 2024], SOURCES.ottomanOrder),
  fact("palace-school", "ottoman-culture", "Enderun ve Birun", "Enderun saray içi eğitim ve idareci yetiştirme; Birun sarayın dış hizmetleridir.", "Harem yalnızca özel hayat alanı değil, hanedan ve saray eğitimi alanıdır.", ["enderun", "birun", "harem", "saray"], 3, 9, [2015, 2019, 2023], SOURCES.ottomanOrder),

  fact("balkan-wars", "late-ottoman", "Balkan Savaşları sonucu", "Osmanlı Midye-Enez hattının batısını kaybetti; II. Balkan Savaşı'nda Edirne ve Kırklareli geri alındı.", "Batı Trakya ile Doğu Trakya'yı karıştırma.", ["balkan savaşı", "edirne", "midye enez"], 3, 7, [2016, 2020, 2024], SOURCES.nationalStruggle),
  fact("ww1-fronts", "late-ottoman", "I. Dünya Savaşı cepheleri", "Kafkas, Kanal, Çanakkale, Irak, Suriye-Filistin ve Hicaz-Yemen cephelerini açılış amacı-sonucu ile birlikte öğren.", "Taarruz ve savunma cephelerini sadece coğrafyaya bakarak ayırma.", ["Kafkas", "Kanal", "Çanakkale", "Irak", "Suriye"], 4, 10, [2014, 2017, 2021, 2024], SOURCES.nationalStruggle),
  fact("mondros-seven", "late-ottoman", "Mondros'un 7. maddesi", "İtilaf Devletleri güvenliklerini tehdit eden bir durum olursa stratejik yerleri işgal edebilecekti.", "24. madde Doğu Anadolu'daki altı il; 7. madde genel işgal dayanağıdır.", ["mondros", "7. madde", "24. madde", "işgal"], 4, 8, [2016, 2019, 2022, 2024], SOURCES.nationalStruggle),

  fact("amasya", "preparation", "Amasya Genelgesi", "Millî egemenlik fikri ve Millî Mücadele'nin gerekçe, amaç ve yöntemi Amasya Genelgesi'nde belirginleşti.", "Temsil Heyeti Erzurum'da oluşturuldu; tüm vatanı temsil yetkisi Sivas'ta verildi.", ["amasya", "milletin azim ve kararı", "temsil heyeti"], 4, 9, [2015, 2018, 2021, 2024], SOURCES.nationalStruggle),
  fact("erzurum-sivas", "preparation", "Erzurum-Sivas ayrımı", "Erzurum bölgesel toplanıp millî kararlar aldı; Sivas ulusal kongredir ve cemiyetleri birleştirdi.", "Manda ve himaye ilk kez Erzurum'da reddedildi, kesin olarak Sivas'ta kapandı.", ["erzurum", "sivas", "manda", "cemiyet"], 5, 11, [2014, 2016, 2019, 2022, 2024], SOURCES.nationalStruggle),
  fact("misak", "preparation", "Misak-ı Millî", "Son Osmanlı Mebusan Meclisi millî sınır ve tam bağımsızlık esaslarını kabul etti.", "Misak-ı Millî TBMM'de değil Osmanlı Mebusan Meclisinde kabul edildi.", ["misak-ı millî", "mebusan", "millî sınır"], 4, 9, [2014, 2017, 2021, 2024], SOURCES.nationalStruggle),
  fact("first-assembly", "preparation", "I. TBMM'nin yapısı", "I. TBMM olağanüstü yetkili, güçler birliği ve meclis hükûmeti esaslı, çoğulcu bir meclistir.", "Yetkilerini Başkomutanlık Kanunu'yla devretmesi olağanüstülüğün kanıtı sayılmaz.", ["I. TBMM", "güçler birliği", "meclis hükûmeti"], 4, 8, [2017, 2020, 2022, 2024], SOURCES.nationalStruggle),

  fact("inonu", "independence", "İnönü savaşları", "I. İnönü düzenli ordunun ilk başarısı; II. İnönü siyasi ve askerî güveni artıran zaferdir.", "Londra Konferansı ve Moskova Antlaşması I. İnönü sonrası gelişmelerdir.", ["İnönü", "düzenli ordu", "Londra", "Moskova"], 3, 8, [2015, 2018, 2023], SOURCES.nationalStruggle),
  fact("sakarya", "independence", "Sakarya'nın sonuçları", "Sakarya ile savunmadan taarruza geçildi; Mustafa Kemal'e mareşallik ve gazilik verildi.", "Tekâlif-i Milliye Sakarya'dan önce ordunun ihtiyacı için yayımlandı.", ["sakarya", "mareşal", "gazi", "tekâlif-i milliye"], 5, 10, [2014, 2017, 2020, 2022, 2024], SOURCES.nationalStruggle),
  fact("great-offensive", "independence", "Büyük Taarruz-Mudanya", "Büyük Taarruz askerî mücadeleyi, Mudanya Ateşkesi silahlı çatışmayı sona erdirdi.", "Siyasi bağımsızlığın uluslararası belgesi Lozan'dır.", ["büyük taarruz", "başkomutanlık", "mudanya", "lozan"], 4, 10, [2016, 2019, 2022, 2024], SOURCES.nationalDiplomacy),
  fact("lozan", "independence", "Lozan'ın çözdükleri", "Kapitülasyonlar kaldırıldı; sınırların büyük bölümü ve yeni devletin tanınması sağlandı.", "Musul Lozan'da çözülemedi; Hatay o tarihte ayrı bir sorun olarak sonraya kaldı.", ["lozan", "kapitülasyon", "musul", "hatay"], 6, 12, [2014, 2016, 2018, 2020, 2022, 2024], SOURCES.nationalDiplomacy),

  fact("sultanate-caliphate", "revolutions", "Saltanat ve halifelik", "Saltanat 1922'de millî egemenlik; halifelik 1924'te laiklik ve devlet otoritesi yönüyle kaldırıldı.", "Aynı tarihte ve aynı gerekçeyle kaldırılmadılar.", ["saltanat", "halifelik", "egemenlik", "laiklik"], 5, 10, [2015, 2017, 2020, 2022, 2024], SOURCES.principles),
  fact("education-unity", "revolutions", "Tevhid-i Tedrisat", "1924 Tevhid-i Tedrisat Kanunu eğitimi Millî Eğitim Bakanlığına bağlayarak birlik sağladı.", "Yalnızca medreselerin kapatılması olarak daraltma; asıl kavram eğitim birliğidir.", ["tevhid-i tedrisat", "eğitim", "medrese"], 3, 8, [2016, 2019, 2023], SOURCES.principles),
  fact("civil-code", "revolutions", "Türk Medeni Kanunu", "1926 Medeni Kanun aile, miras ve kişiler hukukunda kadın-erkek eşitliği yönünde temel adımdır.", "Seçme-seçilme hakkı Medeni Kanun'la verilmedi.", ["medeni kanun", "aile", "miras", "kadın"], 3, 9, [2015, 2020, 2022], SOURCES.principles),
  fact("economic-reforms", "revolutions", "Ekonomi kurumları kronolojisi", "İzmir İktisat Kongresi, İş Bankası, Aşarın kaldırılması, Kabotaj ve Teşvik-i Sanayi birbirini izleyen millî ekonomi adımlarıdır.", "I. Beş Yıllık Sanayi Planı 1934'te uygulanmaya başladı.", ["İzmir iktisat", "İş Bankası", "aşar", "kabotaj", "teşvik-i sanayi"], 5, 12, [2014, 2017, 2020, 2022, 2024], SOURCES.principles),
  fact("principles-map", "revolutions", "Atatürk ilkelerini ayır", "Cumhuriyetçilik millî egemenlik; halkçılık eşitlik; devletçilik ekonomi; laiklik din-devlet işlerinin ayrılması eksenindedir.", "Bir inkılap birden fazla ilkeyle ilişkili olabilir; sorudaki vurguya bak.", ["cumhuriyetçilik", "halkçılık", "devletçilik", "laiklik"], 7, 14, [2015, 2017, 2019, 2020, 2022, 2023, 2024], SOURCES.principles),

  fact("mosul", "foreign-policy", "Musul Sorunu", "Musul Lozan'da çözülemedi; Haliç Konferansı sonuçsuz kaldı ve 1926 Ankara Antlaşması ile Irak'a bırakıldı.", "Milletler Cemiyeti kararı Türkiye lehine değildi.", ["musul", "haliç", "ankara antlaşması", "Irak"], 4, 9, [2017, 2020, 2022, 2024], SOURCES.nationalDiplomacy),
  fact("straits", "foreign-policy", "Boğazlar ve Montrö", "1936 Montrö ile Türkiye Boğazlar üzerindeki egemenliğini güçlendirdi ve asker bulundurma hakkı kazandı.", "Lozan Boğazlar rejimi tam egemenlik sağlamamıştı.", ["montrö", "boğazlar", "lozan"], 4, 10, [2015, 2018, 2021, 2024], SOURCES.nationalDiplomacy),
  fact("hatay", "foreign-policy", "Hatay'ın katılması", "Hatay 1938'de bağımsız devlet oldu, 1939'da Türkiye'ye katıldı.", "Atatürk Hatay'ın Türkiye'ye katılmasını göremedi.", ["hatay", "Fransa", "1938", "1939"], 4, 8, [2016, 2020, 2022, 2024], SOURCES.nationalDiplomacy),
  fact("regional-pacts", "foreign-policy", "Balkan Antantı-Sadabat", "Balkan Antantı batı sınırları, Sadabat Paktı doğu sınırları için bölgesel güvenlik iş birliğidir.", "Akdeniz Paktını bu iki komşuluk paktıyla karıştırma.", ["balkan antantı", "sadabat", "akdeniz paktı"], 4, 11, [2015, 2017, 2021, 2024], SOURCES.nationalDiplomacy),

  fact("un-conferences", "contemporary", "Yalta-San Francisco-BM", "Yalta'da BM'nin yapısı ve veto ilkesi görüşüldü; San Francisco'da Birleşmiş Milletler kuruldu.", "BM'nin kurulması fikri ile resmen kurulmasını aynı konferans sayma.", ["yalta", "san francisco", "birleşmiş milletler", "veto"], 4, 9, [2017, 2020, 2022, 2024], SOURCES.contemporary),
  fact("cold-war", "contemporary", "Soğuk Savaş'ın başlangıcı", "II. Dünya Savaşı sonrasında ABD ve SSCB liderliğinde iki kutuplu sistem oluştu.", "Kore Savaşı Soğuk Savaş'ı başlatmadı; dönemin ilk sıcak çatışmalarındandır.", ["soğuk savaş", "ABD", "SSCB", "iki kutuplu"], 5, 11, [2015, 2018, 2021, 2022, 2024], SOURCES.contemporary),
  fact("nato-korea", "contemporary", "Kore Savaşı ve NATO", "Türkiye Kore'ye asker gönderdi; bu katkı NATO üyeliği sürecini destekledi ve Türkiye 1952'de üye oldu.", "NATO ile Bağdat Paktı/CENTO aynı örgüt değildir.", ["kore", "nato", "1952", "Türkiye"], 4, 9, [2015, 2018, 2020, 2023], SOURCES.contemporary),
  fact("baghdad-cento", "contemporary", "Bağdat Paktı ve CENTO", "1955 Bağdat Paktı'ndan Irak'ın ayrılması sonrasında örgüt CENTO adını aldı.", "Bağlantısızlar veya COMECON ile karıştırma.", ["bağdat paktı", "CENTO", "Irak"], 3, 8, [2014, 2019, 2024], SOURCES.contemporary),
  fact("cyprus", "contemporary", "Kıbrıs ve ABD ambargosu", "1974 Kıbrıs Barış Harekâtı sonrasında ABD 1975-1978 arasında Türkiye'ye silah ambargosu uyguladı.", "Johnson Mektubu 1964; ambargo 1975 sonrasıdır.", ["Kıbrıs", "Johnson mektubu", "ambargo", "1974"], 5, 12, [2016, 2018, 2020, 2022, 2024], SOURCES.contemporary),
  fact("coups-parties", "contemporary", "Darbeler ve kurumlar", "27 Mayıs sonrası Millî Birlik Komitesi ve 1961 Anayasası; 12 Eylül sonrası YÖK gibi kurumlar soru konusu olur.", "24 Ocak Kararları 12 Eylül'den önce alındı.", ["27 Mayıs", "Millî Birlik Komitesi", "12 Eylül", "YÖK"], 4, 11, [2018, 2020, 2022, 2024], SOURCES.contemporary),
  fact("non-aligned", "contemporary", "Bağlantısızlar Hareketi", "Hindistan, Yugoslavya ve Mısır iki blok dışında Bağlantısızlar Hareketinin öncüleridir.", "Varşova askerî, COMECON ekonomik Doğu Bloku örgütlenmeleridir.", ["bağlantısızlar", "Yugoslavya", "Mısır", "Hindistan"], 2, 7, [2021, 2024], SOURCES.contemporary),
  fact("locarno", "contemporary", "Locarno Antlaşmaları", "Locarno, iki savaş arasında Almanya'yı uluslararası sisteme alarak Avrupa'da güveni artırmayı amaçladı.", "Saint Germain Avusturya barışı; Nyon Akdeniz'deki korsan denizaltı faaliyetleriyle ilgilidir.", ["locarno", "saint germain", "nyon", "almanya"], 2, 8, [2022, 2024], SOURCES.contemporary),
];

export const PDF_ANALYSIS_META = {
  title: "Yediiklim KPSS 2025 - Son 11 Yıl Tarih Çıkmış Sorular",
  pageCount: 140,
  detectedQuestionLabels: 269,
  examYears: "2014-2024",
  note: "Kapak 2025 baskısını belirtir; kitapta tespit edilen en yeni sınav soruları 2024 yılına aittir.",
};
