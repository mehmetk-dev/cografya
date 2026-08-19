// Atatürk, Kurtuluş Savaşı ve İnkılap Tarihi Kapsamlı Çalışma Seti
// MEB 8, 11, 12. Sınıf ve ÖSYM KPSS / YKS Müfredatı Tam Uyumludur (%100 Doğrulanmış)

export interface AtaturkMnemonic {
  code: string;
  title: string;
  items: { letter: string; word: string; note?: string }[];
  context: string;
  category: "hazirlik" | "cepheler" | "antlasmalar" | "inkilaplar" | "ilkeler" | "dis_politika" | "hayati";
}

export interface AtaturkExamTrap {
  id: string;
  topic: string;
  warning: string;
  correctFact: string;
  examPointers: string;
}

export interface AtaturkTreaty {
  id: string;
  name: string;
  date: string;
  parties: string;
  significance: string;
  keyPoints: string[];
  kpssNote: string;
}

export interface AtaturkEvent {
  id: string;
  periodId: string;
  title: string;
  date: string;
  category: "hayati" | "hazirlik" | "cephe" | "antlasma" | "inkilap" | "ilke" | "dis_politika";
  importance: "high" | "critical" | "legendary";
  summary: string;
  details: string[];
  kpssKeyPoints: string[];
  causalChain?: {
    cause: string;
    event: string;
    result: string;
  };
  quote?: {
    text: string;
    context: string;
  };
}

export interface AtaturkPeriod {
  id: string;
  title: string;
  subtitle: string;
  years: string;
  badge: string;
  description: string;
  events: AtaturkEvent[];
}

export interface AtaturkQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  periodId: string;
  examType: "KPSS" | "YKS" | "MEB";
}

// ----------------------------------------------------
// 1. DÖNEMLER VE TÜM KRONOLOJİK OLAYLAR
// ----------------------------------------------------
export const ATATURK_PERIODS: AtaturkPeriod[] = [
  {
    id: "hayati",
    title: "1. Atatürk'ün Hayatı, Fikir Dünyası ve Görevleri",
    subtitle: "Selanik'ten Çanakkale'ye Bir Liderin Doğuşu",
    years: "1881 – 1919",
    badge: "Biyografi & Askeri Kariyer",
    description:
      "Mustafa Kemal'in doğumu, tahsil hayatı, fikir dünyasını şekillendiren şehirler ve yazarlar, katıldığı ilk savaşlar ve I. Dünya Savaşı'ndaki efsanevi başarıları.",
    events: [
      {
        id: "tahsil-hayati",
        periodId: "hayati",
        title: "Öğrenim Gördüğü Okullar (Kronolojik Sıra)",
        date: "1886 – 1905",
        category: "hayati",
        importance: "critical",
        summary: "Mustafa Kemal'in geleneksel mahalle mektebinden Kurmay Yüzbaşı olarak mezun olduğu Harp Akademisi'ne uzanan eğitim serüveni.",
        details: [
          "1. Mahalle Mektebi (Annesinin isteğiyle başladığı geleneksel okul).",
          "2. Şemsi Efendi Mektebi (Babasının isteğiyle geçtiği çağdaş ve modern okul).",
          "3. Selanik Mülkiye Rüştiyesi (Kısa süre devam ettiği sivil ortaokul).",
          "4. Selanik Askeri Rüştiyesi: Matematik öğretmeni Yüzbaşı Mustafa Bey tarafından 'Kemal' adının verildiği okuldur.",
          "5. Manastır Askeri İdadisi (Lise): Tarih öğretmeni Kolası Mehmet Tevfik Bey'den tarih bilinci, arkadaşı Ömer Naci'den edebiyat ve hitabet sevgisi kazandığı okuldur. Namık Kemal, Mehmet Emin Yurdakul, J.J. Rousseau, Voltaire ve Montesquieu'dan etkilendi.",
          "6. İstanbul Harp Okulu: 1902 yılında Teğmen rütbesiyle mezun oldu.",
          "7. İstanbul Harp Akademisi: 1905 yılında Kurmay Yüzbaşı rütbesiyle mezun olarak orduya katıldı."
        ],
        kpssKeyPoints: [
          "ÖSYM Sorusu: Mustafa Kemal'e 'Kemal' adını veren okul -> Selanik Askeri Rüştiyesi.",
          "ÖSYM Sorusu: Edebiyat ve tarih sevgisinin filizlendiği okul -> Manastır Askeri İdadisi.",
          "ÖSYM Sorusu: Mezuniyet rütbesi -> İstanbul Harp Akademisi'nden Kurmay Yüzbaşı."
        ]
      },
      {
        id: "fikir-sehirleri",
        periodId: "hayati",
        title: "Mustafa Kemal'in Fikir Hayatını Etkileyen 5 Şehir",
        date: "1881 – 1918",
        category: "hayati",
        importance: "high",
        summary: "Atatürk'ün dünya görüşünün, vatanseverliğinin ve vizyonunun geliştiği kritik şehirler.",
        details: [
          "1. Selanik: Batı'ya açılan liman ve demiryolu kenti; farklı kültürler ve özgürlükçü fikir akımları.",
          "2. Manastır: Çok uluslu yapı, Balkan milliyetçiliği isyanları ve askeri lise eğitimi.",
          "3. İstanbul: Başkent siyasetini, saray entrikalarını ve çöküş sürecini yakından izleme.",
          "4. Şam: İlk görev yeri; 5. Ordu'da 'Vatan ve Hürriyet Cemiyeti'ni kurarak teşkilatçılığını gösterdi (1906).",
          "5. Sofya: Askeri Ataşemiliterlik görevi (1913); Batı diplomasisi, opera kültürü ve Bulgar Parlamentosu'nu izleyerek parlamenter sistemi tanıması."
        ],
        kpssKeyPoints: [
          "KPSS Kodlaması: S-M-İ-Ş-S (Selanik, Manastır, İstanbul, Şam, Sofya).",
          "İlk kurduğu cemiyet: Şam'da 'Vatan ve Hürriyet Cemiyeti'."
        ]
      },
      {
        id: "ilk-askeri-basarilar",
        periodId: "hayati",
        title: "İlk Askeri Faaliyetler: 31 Mart, Trablusgarp ve Balkan Savaşları",
        date: "1909 – 1913",
        category: "hayati",
        importance: "critical",
        summary: "Mustafa Kemal'in tarih sahnesine çıkışı, emperyalizme karşı ilk savaşı ve Balkanlar tecrübesi.",
        details: [
          "31 Mart Vakası (1909): Mahmut Şevket Paşa komutasındaki Hareket Ordusu'nda Kurmay Başkanı olarak isyanı bastırdı (Tarih sahnesine çıktığı İLK olay).",
          "Trablusgarp Savaşı (1911-1912): 'Gazeteci Şerif Bey' takma adıyla gizlice gitti; Derne ve Tobruk'ta yerel Arapları örgütleyerek İtalyanları durdurdu (İlk askeri zaferi & sömürgeciliğe karşı ilk mücadelesi).",
          "Picardie Manevraları (1910): Fransa'daki askeri tatbikata Osmanlı gözlemcisi olarak katıldı ve havacılığın gelecekteki önemini vurguladı.",
          "Balkan Savaşları (1912-1913): Akdeniz Boğazı Birleşik Kuvvetleri Harekât Şubesi Müdürlüğü yaptı; Gelibolu Yarımadası'nı çok iyi tanıdı (Bu coğrafi bilgi Çanakkale Zaferi'nin anahtarı oldu)."
        ],
        kpssKeyPoints: [
          "Mustafa Kemal'in tarih sahnesine çıktığı ilk olay: 31 Mart Vakası (1909).",
          "Emperyalizme karşı ilk savaşı ve ilk askeri başarısı: Trablusgarp Savaşı (Derne & Tobruk).",
          "Trablusgarp'ta kullandığı takma ad: Gazeteci Şerif Bey."
        ],
        causalChain: {
          cause: "İtalya'nın hammadde ve pazar arayışıyla Osmanlı'nın Kuzey Afrika'daki son toprağına saldırması.",
          event: "Mustafa Kemal ve Enver Bey gibi vatansever subayların gizlice bölgeye gidip halkı teşkilatlandırması.",
          result: "İtalyanlar kıyıdan içeri sokulmadı; ancak Balkan Savaşı çıkınca 1912 Uşi Antlaşması ile Trablusgarp İtalya'ya bırakıldı."
        }
      },
      {
        id: "birinci-dunya-savasi-cepheleri",
        periodId: "hayati",
        title: "I. Dünya Savaşı'nda Savaştığı Cepheler (Şifre: Ç-A-K)",
        date: "1914 – 1918",
        category: "cephe",
        importance: "legendary",
        summary: "Çanakkale, Kafkas ve Suriye-Filistin cephelerinde gösterdiği üstün askeri deha.",
        details: [
          "1. Çanakkale Cephesi (1915): 19. Tümen Komutanı olarak Anafartalar, Conkbayırı, Arıburnu ve Kireçtepe'de İtilaf ordularını bozguna uğrattı. 'Anafartalar Kahramanı' unvanı aldı ve Albaylığa terfi etti.",
          "2. Kafkas Cephesi (1916): 16. Kolordu Komutanı olarak Rus işgalindeki Muş ve Bitlis'i geri aldı. Generalliğe (Tuğgeneral / Mirliva - Paşa) terfi etti ve Altın Kılıçlı İmtiyaz Madalyası aldı.",
          "3. Suriye-Filistin Cephesi (1917-1918): 7. Ordu Komutanı ve Yıldırım Orduları Grup Komutanı olarak görev yaptı. Katma Zaferi ile İngilizleri Halep'in kuzeyinde durdurarak Anadolu'nun işgalini engelledi."
        ],
        kpssKeyPoints: [
          "Kronolojik Cephe Şifresi: Ç-A-K (Çanakkale -> Kafkas -> Kanal/Suriye).",
          "Muş ve Bitlis'i Ruslardan geri alan komutan: Mustafa Kemal Paşa (1916).",
          "Mustafa Kemal'in Generalliğe (Paşalığa) yükseldiği cephe: Kafkas Cephesi."
        ],
        quote: {
          text: "Ben size taarruz emretmiyorum, ölmeyi emrediyorum! Biz ölünceye kadar geçecek zaman zarfında yerimize başka kuvvetler ve kumandanlar gelecektir!",
          context: "25 Nisan 1915 - Çanakkale Conkbayırı Taarruzu"
        }
      },
      {
        id: "ataturkun-eserleri",
        periodId: "hayati",
        title: "Mustafa Kemal Atatürk'ün Yazdığı Eserler",
        date: "1908 – 1938",
        category: "hayati",
        importance: "high",
        summary: "Nutuk başta olmak üzere askeri doktrin, geometri ve vatandaşlık eğitimi alanındaki eserleri.",
        details: [
          "Nutuk (Söylev): 1919 - 1927 arasını kapsar. 1927 CHP II. Kurultayı'nda 6 günde 36.5 saatte okunmuştur. '1919 yılı Mayısının 19. günü Samsun'a çıktım' ile başlar, 'Gençliğe Hitabe' ile biter. Gelirleri Türk Hava Kurumu'na (THK) bağışlanmıştır.",
          "Geometri Kitabı: 1937'de bizzat yazdı; üçgen, açı, teğet, alan, yatay, düşey, boyut, artı, eksi gibi Türkçe bilim terimlerini dile kazandırdı.",
          "Zabit ve Kumandan ile Hasbihal: Nuri Conker'in kitabına karşılık yazdığı subaylık sanatı kitabı.",
          "Cumali Ordugâhı: Süvari tatbikatı notları.",
          "Medeni Bilgiler: Afet İnan ile birlikte vatandaşlık haklarını anlattığı eser.",
          "Tâbiye Meselesinin Halli ve Emirlerin Sureti Tahririne Dair & Bölüğün Muharebe Eğitimi."
        ],
        kpssKeyPoints: [
          "Nutuk'un kapsadığı yıllar: 1919 – 1927 (1927 sonrası inkılaplar Nutuk'ta YOKTUR!).",
          "Nutuk'un telif gelirleri: Türk Hava Kurumu'na (Türk Tayyare Cemiyeti) bırakılmıştır."
        ]
      }
    ]
  },
  {
    id: "hazirlik",
    title: "2. Millî Mücadele Hazırlık Dönemi",
    subtitle: "Genelgeler, Kongreler, Misak-ı Millî ve TBMM'nin Açılışı",
    years: "1919 – 1920",
    badge: "Örgütlenme & Milli İrade",
    description:
      "Samsun'a çıkıştan Havza ve Amasya Genelgelerine, Erzurum ve Sivas Kongrelerinden Misak-ı Milli ve I. TBMM'nin kurulmasına kadar millet egemenliğinin adım adım inşası.",
    events: [
      {
        id: "samsun-ve-havza",
        periodId: "hazirlik",
        title: "Samsun'a Çıkış (19 Mayıs 1919) ve Havza Genelgesi (28 Mayıs 1919)",
        date: "Mayıs 1919",
        category: "hazirlik",
        importance: "critical",
        summary: "9. Ordu Müfettişi olarak Bandırma Vapuru ile Samsun'a ayak basış ve ilk milli uyanış genelgesi.",
        details: [
          "Samsun Raporu (22 Mayıs 1919): Rumların iddialarının asılsız olduğunu ve Türk milletinin mandayı kabul etmeyeceğini İstanbul'a bildirdi (Milli Mücadele'nin ilk resmi raporu).",
          "Havza Genelgesi (28 Mayıs 1919): İşgallere karşı tüm yurtta protesto mitingleri düzenlenmesi, İtilaf devletlerine telgraflar çekilmesi ancak Hristiyan azınlıklara taşkınlık yapılmaması istendi (Milli bilinci uyandıran İLK genelgedir).",
          "İlk miting: Havza Mitingi; ardından Sultanahmet ve Kadıköy mitingleri (Halide Edib Adıvar öncülüğünde)."
        ],
        kpssKeyPoints: [
          "Milli Mücadele'nin başladığı tarih: 19 Mayıs 1919 Samsun.",
          "Milli bilinci uyandırmak için miting ve protesto çağrısı yapılan ilk belge: Havza Genelgesi."
        ]
      },
      {
        id: "amasya-genelgesi",
        periodId: "hazirlik",
        title: "Amasya Genelgesi (21-22 Haziran 1919): İhtilal Beyannamesi",
        date: "21-22 Haziran 1919",
        category: "hazirlik",
        importance: "legendary",
        summary: "Milli Mücadele'nin gerekçesi, amacı ve yönteminin ilk kez ilan edildiği tarihi belge.",
        details: [
          "İmzacı / Onaylayan Komutanlar: Mustafa Kemal Paşa, Rauf Orbay, Refet Bele, Ali Fuat Cebesoy (Telgrafla onaylayanlar: Kazım Karabekir, Cemal Paşa - Mersinli).",
          "Gerekçe 1: 'Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir.'",
          "Gerekçe 2: 'İstanbul Hükümeti üzerine aldığı sorumluluğu yerine getirememektedir.'",
          "Amaç ve Yöntem: 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.' (İlk kez milli egemenlik ve halk iradesi vurgulandı).",
          "Temsil Heyeti Kararı: 'Milletin sesini duyurmak için her türlü etki ve denetimden uzak milli bir heyetin varlığı şarttır.'",
          "Sine-i Millete Dönüş: Genelge sonrası İstanbul Hükümeti Mustafa Kemal'i geri çağırdı; Mustafa Kemal 8-9 Temmuz 1919 gecesi askerlik mesleğinden ve resmi görevinden istifa ederek 'Sine-i Millete' döndü."
        ],
        kpssKeyPoints: [
          "Milli Mücadele'nin Amacı, Gerekçesi ve Yöntemi -> İlk kez Amasya Genelgesi'nde belirtildi.",
          "İlk kez üstü kapalı rejim değişikliği ve milli egemenlik -> Amasya Genelgesi.",
          "Mustafa Kemal'in resmi görevinden ve askerlikten istifası -> Amasya Genelgesi sonrası, Erzurum Kongresi öncesi (8-9 Temmuz 1919)."
        ],
        quote: {
          text: "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.",
          context: "Amasya Genelgesi - Madde 3"
        }
      },
      {
        id: "erzurum-kongresi",
        periodId: "hazirlik",
        title: "Erzurum Kongresi (23 Temmuz – 7 Ağustos 1919)",
        date: "Temmuz – Ağustos 1919",
        category: "hazirlik",
        importance: "critical",
        summary: "Toplanış bakımından bölgesel, aldığı kararlar bakımından TAMAMEN MİLLÎ ilk kongre.",
        details: [
          "Düzenleyen Cemiyetler: Doğu Anadolu Müdafaa-i Hukuk Cemiyeti ve Trabzon Muhafaza-i Hukuk Cemiyeti.",
          "Mustafa Kemal ve Rauf Orbay'ın kongreye delege olarak katılabilmesi için Kazım Yurdalan ve Cevat Dursunoğlu istifa etti. Mustafa Kemal Kongre Başkanı seçildi.",
          "Milli Sınırlar: 'Milli sınırlar içinde vatan bir bütündür, parçalanamaz.' (Misak-ı Milli'nin temeli atıldı).",
          "Kuva-yı Milliye & İrade: 'Kuva-yı Milliyeyi amil, irade-i milliyeyi hakim kılmak esastır.'",
          "Manda ve Himaye: İLK KEZ REDDEDİLDİ.",
          "Temsil Heyeti (Heyet-i Temsiliye): 9 kişilik bölgesel heyet olarak kuruldu (Başkan: Mustafa Kemal)."
        ],
        kpssKeyPoints: [
          "Manda ve himaye fikrinin İLK KEZ reddedildiği yer: Erzurum Kongresi.",
          "Misak-ı Milli sınırlarından İLK KEZ bahsedilen kongre: Erzurum Kongresi.",
          "Temsil Heyeti İLK KEZ nerede kuruldu: Erzurum Kongresi."
        ]
      },
      {
        id: "sivas-kongresi",
        periodId: "hazirlik",
        title: "Sivas Kongresi (4 – 11 Eylül 1919): Ulusal Birlik",
        date: "Eylül 1919",
        category: "hazirlik",
        importance: "legendary",
        summary: "Hem toplanış hem kararları bakımından TAMAMEN ULUSAL kongre. Tüm cemiyetler birleştirildi.",
        details: [
          "Engelleme Girişimleri: Elazığ Valisi Ali Galip olayı ve Ankara Valisi Muhittin Paşa girişimleri boşa çıkarıldı.",
          "Bütün Müdafaa-i Hukuk cemiyetleri 'Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti (ARMHC)' adı altında TEK ÇATI altında birleştirildi.",
          "Manda ve Himaye: KESİN OLARAK ve EBEDİYEN REDDEDİLDİ (Amerikan mandası tartışmaları son buldu).",
          "Temsil Heyeti'nin Yetkisi: Üye sayısı 15'e çıkarıldı ve 'Tüm yurdu temsil eder' hale getirildi.",
          "İlk Yürütme Gücü Kullanımı: Temsil Heyeti, Ali Fuat Paşa'yı Batı Cephesi Kuva-yı Milliye Genel Komutanlığı'na atadı (Hükümet gibi hareket etti).",
          "Basın: Milli Mücadele'nin ilk yayın organı olan 'İrade-i Milliye' gazetesi çıkarıldı.",
          "İlk Siyasi Başarı: Kongre sonrası Damat Ferit Paşa Hükümeti istifa etmek zorunda kaldı; yerine ılımlı Ali Rıza Paşa kabinesi kuruldu."
        ],
        kpssKeyPoints: [
          "Manda ve himayenin KESİN olarak reddedildiği yer: Sivas Kongresi.",
          "Tüm milli cemiyetlerin ARMHC adıyla birleştiği kongre: Sivas Kongresi.",
          "Temsil Heyeti'nin hükümet gibi YÜRÜTME yetkisi kullandığı ilk olay: Ali Fuat Cebesoy'u Batı Cephesi Komutanlığı'na ataması.",
          "Temsil Heyeti'nin İstanbul Hükümeti'ne karşı İLK SİYASİ ZAFERİ: Damat Ferit Hükümeti'nin düşürülmesi."
        ]
      },
      {
        id: "amasya-gorusmeleri-ve-ankara",
        periodId: "hazirlik",
        title: "Amasya Görüşmeleri (Ekim 1919) ve Temsil Heyeti'nin Ankara'ya Gelişi (27 Aralık 1919)",
        date: "Ekim – Aralık 1919",
        category: "hazirlik",
        importance: "critical",
        summary: "İstanbul Hükümeti'nin Temsil Heyeti'ni hukuken tanıması ve Ankara'nın milli mücadele merkezi seçilmesi.",
        details: [
          "Amasya Görüşmeleri (20-22 Ekim 1919): Temsil Heyeti (Mustafa Kemal, Rauf Orbay, Bekir Sami) ile İstanbul Hükümeti Bahriye Nazırı Salih Paşa arasında yapıldı.",
          "Önemi: İstanbul Hükümeti, Temsil Heyeti'nin varlığını İLK KEZ HUKUKEN TANIDI. Mebusan Meclisi'nin açılması kabul edildi.",
          "Ankara'nın Merkez Seçilme Nedenleri (27 Aralık 1919): İşgal altında olmaması (güvenli olması), Batı Cephesi'ne yakınlığı, demiryolu ve telgraf ağının bulunması, 20. Kolordu'nun (Ali Fuat Paşa) burada olması.",
          "Milli Mücadele Basını: Ankara'da yarı resmi 'Hâkimiyet-i Milliye' gazetesi ve Yunus Nadi ile Halide Edib'in katkılarıyla 'Anadolu Ajansı (AA)' kuruldu (6 Nisan 1920)."
        ],
        kpssKeyPoints: [
          "İstanbul Hükümeti Temsil Heyeti'ni HUKUKEN ilk nerede tanıdı: Amasya Görüşmeleri (1919).",
          "Anadolu Ajansı'nın kurucuları: Halide Edib Adıvar ve Yunus Nadi (1920)."
        ]
      },
      {
        id: "misaki-milli-ve-tbmm",
        periodId: "hazirlik",
        title: "Misak-ı Millî (28 Ocak 1920) ve I. TBMM'nin Açılışı (23 Nisan 1920)",
        date: "Ocak – Nisan 1920",
        category: "hazirlik",
        importance: "legendary",
        summary: "Son Osmanlı Mebusan Meclisi'nin milli yemini, İstanbul'un işgali ve Ankara'da kurucu meclisin açılması.",
        details: [
          "Son Mebusan Meclisi'nde Mustafa Kemal'in isteğiyle kurulan grup: 'Felah-ı Vatan' (Başkan: Rauf Orbay).",
          "Misak-ı Millî Kararları (Şifre: B-O-R-S-A-K): Boğazlar, Osmanlı Borçları, Referandum (Kars-Ardahan-Batum, Batı Trakya, Arap toprakları), Sınırlar, Azınlıklar, Kapitülasyonlar (Kapitülasyonların koşulsuz kaldırılması ilk kez karara bağlandı).",
          "İstanbul'un Resmen İşgali (16 Mart 1920): Misak-ı Milli'ye öfkelenen İtilaf devletleri Şehzadebaşı karakolunu basarak meclisi kapattı ve mebusları Malta'ya sürdü (Manastırlı Hamdi Bey bu işgali telgrafla Mustafa Kemal'e bildirdi).",
          "I. TBMM'nin Açılışı (23 Nisan 1920): Sinop Mebusu Şerif Bey'in en yaşlı üye sıfatıyla açılış konuşması; ardından Mustafa Kemal Meclis Başkanı seçildi.",
          "I. TBMM'nin Nitelikleri: Kurucu Meclis, İhtilalci Meclis, Savaşçı Meclis, Güçler Birliği (Yasama-Yürütme-Yargı mecliste), Meclis Hükümeti Sistemi (Başbakan yok, Meclis Başkanı hükümetin de başı)."
        ],
        kpssKeyPoints: [
          "Misak-ı Milli Kararları Şifresi: B-O-R-S-A-K (Boğazlar, Borçlar, Referandum, Sınırlar, Azınlıklar, Kapitülasyonlar).",
          "İstanbul'un işgalini Ankara'ya bildiren kahraman: Manastırlı Hamdi Bey.",
          "I. TBMM'nin ilk çıkardığı kanun: Anam Vergisi Kanunu (Ağnam vergisinin 4 katına çıkarılması)."
        ]
      }
    ]
  },
  {
    id: "cepheler",
    title: "3. Millî Mücadele Cepheleri ve Muharebeler",
    subtitle: "Doğu, Güney ve Batı Cephelerinde Kazanılan Zaferler",
    years: "1920 – 1922",
    badge: "Askeri Zaferler",
    description:
      "Kazım Karabekir'in Doğu zaferi, Güney'deki efsanevi Kuva-yı Milliye destanı ve Batı Cephesi'nde I. İnönü'den Büyük Taarruz'a kadar Türk ordusunun şanlı yürüyüşü.",
    events: [
      {
        id: "dogu-ve-guney-cephesi",
        periodId: "cepheler",
        title: "Doğu ve Güney Cepheleri",
        date: "1920 – 1921",
        category: "cephe",
        importance: "critical",
        summary: "Kazım Karabekir komutasındaki Doğu zaferi ve Güney'deki sivil Kuva-yı Milliye kahramanlıkları.",
        details: [
          "Doğu Cephesi Komutanı: Kazım Karabekir (15. Kolordu - Osmanlı'dan kalan tek düzenli kolordu).",
          "Ermenilere karşı zafer kazanıldı (Kars, Sarıkamış, Gümrü alındı). 3 Aralık 1920'de GÜMRÜ ANTLAŞMASI imzalandı.",
          "Güney Cephesi: Düzenli ordu SAVAŞMAMIŞTIR; tamamen yerel halk ve KUVA-YI MİLLİYE direnmiştir.",
          "Kahraman Şehirler: Maraş (Sütçü İmam, Rıdvan Hoca), Antep (Şahin Bey, Şehit Kamil, Karayılan), Urfa (Ali Saip Ursavaş).",
          "Fransız ve Ermeni intikam birliklerine karşı destansı direniş gösterildi; Sakarya Zaferi sonrası 1921 Ankara Antlaşması ile Güney Cephesi kapandı."
        ],
        kpssKeyPoints: [
          "TBMM'nin uluslararası alandaki İLK Askeri ve Siyasi Zaferi: Doğu Cephesi & Gümrü Antlaşması (1920).",
          "Düzenli ordunun bulunmadığı, sadece Kuva-yı Milliye ile kazanılan cephe: Güney Cephesi."
        ]
      },
      {
        id: "birinci-inonu-savasi",
        periodId: "cepheler",
        title: "I. İnönü Savaşı (6 – 10 Ocak 1921): Düzenli Ordunun İlk Zaferi",
        date: "Ocak 1921",
        category: "cephe",
        importance: "legendary",
        summary: "Düzenli Türk ordusunun Yunan taarruzunu durdurduğu ve içerideki Çerkez Ethem isyanını bastırdığı ilk sınavı.",
        details: [
          "Komutan: Batı Cephesi Komutanı Albay İsmet İnönü.",
          "Yunan ordusu İnönü mevzilerinde hezimete uğratılarak geri çekilmek zorunda bırakıldı.",
          "Savaşın İç ve Dış Sonuçları (KPSS Şifresi: M-İ-L-A-T):",
          "  M -> Moskova Antlaşması (16 Mart 1921 - Sovyet Rusya TBMM'yi tanıyan ilk büyük Avrupa devleti oldu. Batum Gürcistan'a bırakıldı: Misak-ı Milli'den 1. Taviz).",
          "  İ -> İstiklal Marşı'nın Kabulü (12 Mart 1921 - Mehmet Akif Ersoy yazdı, Maarif Vekili Hamdullah Suphi Meclis'te okudu).",
          "  L -> Londra Konferansı (21 Şubat - 12 Mart 1921 - İtilaf Devletleri TBMM'yi İLK KEZ HUKUKEN TANIDI. Tevfik Paşa: 'Söz milletin asıl vekili olan TBMM temsilcisinindir' dedi).",
          "  A -> Afganistan Dostluk Antlaşması (1 Mart 1921 - TBMM'yi tanıyan İLK Müslüman devlet oldu).",
          "  T -> Teşkilat-ı Esasiye Kanunu (20 Ocak 1921 - TBMM'nin ilk anayasası kabul edildi)."
        ],
        kpssKeyPoints: [
          "I. İnönü Sonuçları Şifresi: M-İ-L-A-T (Moskova, İstiklal Marşı, Londra, Afganistan, Teşkilat-ı Esasiye).",
          "İtilaf Devletleri TBMM'yi hukuken ilk nerede tanıdı: Londra Konferansı (1921).",
          "Misak-ı Milli'den verilen İLK TAVİZ: Batum (1921 Moskova Antlaşması)."
        ]
      },
      {
        id: "ikinci-inonu-ve-kutahya",
        periodId: "cepheler",
        title: "II. İnönü Savaşı ve Kütahya-Eskişehir Muharebeleri",
        date: "Mart – Temmuz 1921",
        category: "cephe",
        importance: "critical",
        summary: "Milletin makus talihinin yenilişi ve ardından gelen geri çekilme süreci.",
        details: [
          "II. İnönü Savaşı (23 Mart - 1 Nisan 1921): Yunan ordusu ikinci kez mağlup edildi. Mustafa Kemal'in İsmet Paşa'ya tarihi telgrafı: 'Siz orada yalnız düşmanı değil, milletin makûs (ters giden) talihini de yendiniz.'",
          "Sonuç: İtalya Anadolu'dan askerlerini çekmeye başladı, Fransa barış için Ankara'ya temsilci gönderdi.",
          "Kütahya-Eskişehir Muharebeleri (10 - 24 Temmuz 1921): Düzenli ordunun TEK YENİLGİSİ. Afyon, Kütahya, Eskişehir işgal edildi. Mustafa Kemal orduyu yok olmaktan kurtarmak için Sakarya Nehri'nin doğusuna çekti.",
          "Meclisteki Gelişmeler: Meclisin Kayseri'ye taşınması tartışıldı. Mustafa Kemal'e 5 Ağustos 1921'de 3 aylık süreyle BAŞKOMUTANLIK YETKİSİ verildi (Yasama ve yürütme yetkilerini tek başına kullanma).",
          "Tekalif-i Milliye Emirleri (7-8 Ağustos 1921): Ordunun silah, cephane, giyim ve gıda ihtiyacını karşılamak için milli yükümlülük emirleri yayımlandı.",
          "I. Maarif Kongresi: Savaşın en şiddetli anında Ankara'da eğitim kongresi toplandı (Eğitime verilen büyük önem)."
        ],
        kpssKeyPoints: [
          "Mustafa Kemal'in 'Milletin makûs talihini yendiniz' dediği savaş: II. İnönü.",
          "Mustafa Kemal'e Başkomutanlık yetkisinin verilmesi: Kütahya-Eskişehir yenilgisi sonrası.",
          "Tekalif-i Milliye Emirleri'nin çıkarılışı: Sakarya Meydan Muharebesi öncesi."
        ]
      },
      {
        id: "sakarya-meydan-muharebesi",
        periodId: "cepheler",
        title: "Sakarya Meydan Muharebesi (23 Ağustos – 13 Eylül 1921)",
        date: "Ağustos – Eylül 1921",
        category: "cephe",
        importance: "legendary",
        summary: "Subaylar Savaşı / Melhame-i Kübra. 1683'ten beri süren 238 yıllık Türk geri çekilişinin son bulduğu dönüm noktası.",
        details: [
          "22 gün 22 gece aralıksız süren kanlı boğazlaşma. Çok sayıda subay şehit düştüğü için 'Subaylar Savaşı' olarak da anılır.",
          "Mustafa Kemal'in Dünya Savaş Tarihine geçen doktrini: 'Hatt-ı müdafaa yoktur, sath-ı müdafaa vardır. O satıh bütün vatandır. Vatanın her karış toprağı vatandaşın kanıyla ıslanmadıkça terk olunamaz.'",
          "Tarihi Sonuçları:",
          "  1. 1683 II. Viyana Kuşatması'ndan beri süren Türk geri çekilmesi SON BULDU; taarruz sırası Türklere geçti.",
          "  2. TBMM, Mustafa Kemal'e 'GAZİ' unvanı ve 'MAREŞAL' rütbesi verdi (19 Eylül 1921).",
          "  3. KARS ANTLAŞMASI (13 Ekim 1921): Kafkas Cumhuriyetleri ile imzalandı; DOĞU SINIRIMIZ KESİNLEŞTİ.",
          "  4. ANKARA ANTLAŞMASI (20 Ekim 1921): Fransa ile imzalandı. Fransa TBMM'yi tanıyan İLK İTİLAF DEVLETİ oldu. Güney Cephesi kapandı. (Hatay Fransa mandasındaki Suriye'ye bırakıldı: Misak-ı Milli'den 2. Taviz).",
          "  5. İtalya Anadolu'yu tamamen boşalttı."
        ],
        kpssKeyPoints: [
          "Doğu sınırımızın KESİN ve NİHAİ şeklini aldığı antlaşma: Kars Antlaşması (1921).",
          "TBMM'yi tanıyan İLK İtilaf Devleti: Fransa (1921 Ankara Antlaşması).",
          "Misak-ı Milli'den verilen İKİNCİ taviz: Hatay (1921 Ankara Antlaşması).",
          "Mustafa Kemal'e Gazi ve Mareşallik unvanı: Sakarya Zaferi sonrası."
        ],
        quote: {
          text: "Hatt-ı müdafaa yoktur, sath-ı müdafaa vardır. O satıh bütün vatandır. Vatanın her karış toprağı vatandaşın kanıyla ıslanmadıkça terk olunamaz!",
          context: "Sakarya Meydan Muharebesi - Taktik Emri"
        }
      },
      {
        id: "buyuk-taarruz-ve-zafer",
        periodId: "cepheler",
        title: "Büyük Taarruz ve Başkomutanlık Meydan Muharebesi (26 Ağustos – 9 Eylül 1922)",
        date: "Ağustos – Eylül 1922",
        category: "cephe",
        importance: "legendary",
        summary: "Afyon Kocatepe'den Akdeniz'e uzanan imha savaşı ve İzmir'in kurtuluşu.",
        details: [
          "Hazırlıklar: 1 yıl boyunca ordu taarruz eğitimine tabi tutuldu, doğu ve güney birlikleri batıya kaydırıldı, Akşehir'de gizli futbol maçı süsüyle komutanlar toplandı.",
          "26 Ağustos 1922 sabahı Kocatepe'den topçu ateşiyle taarruz başladı.",
          "30 Ağustos Dumlupınar'da Başkomutanlık Meydan Muharebesi ile Yunan ordusu tamamen kuşatılıp imha edildi. Yunan Başkomutanı Trikopis esir alındı.",
          "Tarihi Emir: 'Ordular! İlk hedefiniz Akdeniz'dir, ileri!'",
          "9 Eylül 1922'de Türk süvarileri İzmir'e girdi, Türk bayrağı Kadifekale ve Hükümet Konağı'na çekildi. 18 Eylül'de Batı Anadolu düşmandan tamamen temizlendi."
        ],
        kpssKeyPoints: [
          "Büyük Taarruz'un parolası: 'Ordular! İlk hedefiniz Akdeniz'dir, ileri!'",
          "İzmir'in kurtuluş tarihi: 9 Eylül 1922.",
          "Fevzi Çakmak'a Mareşallik rütbesi: Büyük Taarruz sonrası (Mustafa Kemal'den sonraki 2. Mareşal)."
        ]
      }
    ]
  },
  {
    id: "antlasmalar",
    title: "4. Diplomatik Zaferler ve Barış Antlaşmaları",
    subtitle: "Mudanya, Lozan ve Sınırların Tescili",
    years: "1922 – 1923",
    badge: "Diplomasi & Bağımsızlık",
    description:
      "Mudanya Ateşkesi ile savaşsız kazanılan topraklar, Saltanatın kaldırılması ve Lozan Barış Antlaşması ile Türkiye Cumhuriyeti'nin tapu senedinin tescili.",
    events: [
      {
        id: "mudanya-ateskesi",
        periodId: "antlasmalar",
        title: "Mudanya Ateşkes Antlaşması (11 Ekim 1922)",
        date: "11 Ekim 1922",
        category: "antlasma",
        importance: "critical",
        summary: "Kurtuluş Savaşı'nın silahlı dönemini sona erdiren ve Doğu Trakya ile Boğazları savaşsız kazandıran diplomatik zafer.",
        details: [
          "Taraflar: TBMM (Temsilci: İsmet İnönü) <-> İngiltere, Fransa, İtalya (Yunanistan açıkta gemide beklemiştir).",
          "Maddeler:",
          "  1. Türk-Yunan savaşı sona erecektir.",
          "  2. Doğu Trakya (Edirne, Kırklareli, Tekirdağ) 15 gün içinde boşaltılıp 30 gün içinde TBMM'ye teslim edilecektir.",
          "  3. İstanbul ve Boğazlar TBMM Hükümeti yönetimine bırakılacaktır.",
          "Önemi:",
          "  - Doğu Trakya, İstanbul ve Boğazlar SAVAŞ YAPILMADAN (DİPLOMATİK YOLLA) kurtarılmıştır.",
          "  - İstanbul TBMM'ye devredildiği için OSMANLI DEVLETİ HUKUKEN SONA ERMİŞTİR.",
          "  - Refet Bele 'Trakya Yüksek Komiseri' olarak İstanbul'a girmiştir.",
          "  - İngiltere Başbakanı Lloyd George hükümeti istifa etmiştir."
        ],
        kpssKeyPoints: [
          "Osmanlı Devleti'nin HUKUKEN sona erdiği olay: Mudanya Ateşkes Antlaşması (1922).",
          "Doğu Trakya'yı teslim alan komutan: Refet Bele (Trakya Yüksek Komiseri).",
          "Mudanya'da TBMM'yi temsil eden delege: İsmet İnönü."
        ]
      },
      {
        id: "saltanatin-kaldirilmasi",
        periodId: "antlasmalar",
        title: "Saltanatın Kaldırılması (1 Kasım 1922)",
        date: "1 Kasım 1922",
        category: "inkilap",
        importance: "critical",
        summary: "Lozan'a gidecek tek meşru temsilci olmak ve ikiliği önlemek amacıyla saltanatın ilga edilmesi.",
        details: [
          "Neden: İtilaf Devletlerinin Lozan Konferansı'na hem TBMM'yi hem de İstanbul Hükümeti'ni (Sadrazam Tevfik Paşa) davet ederek ikilik çıkartmak istemesi.",
          "1 Kasım 1922'de çıkarılan kanunla Saltanat ile Hilafet birbirinden ayrıldı ve SALTANAT KALDIRILDI.",
          "Sonuçları:",
          "  - Osmanlı Devleti RESMEN VE FİİLEN SONA ERDİ (623 yıllık imparatorluk bitti).",
          "  - Son Padişah VI. Mehmed Vahdettin 17 Kasım 1922'de İngiliz Malaya zırhlısıyla ülkeyi terk etti.",
          "  - TBMM, Abdülmecid Efendi'yi siyasi yetkileri olmayan sadece 'Halife' olarak seçti.",
          "  - Laiklik yolunda atılan İLK BÜYÜK ADIMDIR. Devlet başkanlığı ve rejim sorunu ortaya çıktı."
        ],
        kpssKeyPoints: [
          "Osmanlı Devleti'nin RESMEN sona erdiği inkılap: Saltanatın Kaldırılması (1 Kasım 1922).",
          "Laiklik yolundaki ilk büyük inkılap: Saltanatın kaldırılması.",
          "Lozan'daki Türk temsilcisi ikiliğini önleyen olay: Saltanatın kaldırılması."
        ]
      },
      {
        id: "lozan-baris-antlasmasi",
        periodId: "antlasmalar",
        title: "Lozan Barış Antlaşması (24 Temmuz 1923): Türkiye'nin Tapu Senedi",
        date: "24 Temmuz 1923",
        category: "antlasma",
        importance: "legendary",
        summary: "Sevr paçavrasını yırtıp atan, Türkiye Cumhuriyeti'nin bağımsızlığını ve sınırlarını tüm dünyaya kabul ettiren başyapıt.",
        details: [
          "TBMM Heyeti: Başdelege İsmet İnönü, Dr. Rıza Nur, Hasan Saka.",
          "Mustafa Kemal'in Kesinlikle Taviz Verilmeyecek Dediği 2 Kırmızı Çizgi: 1. Kapitülasyonlar, 2. Ermeni Yurdu Meselesi.",
          "Kritik Kararlar & Konular:",
          "  1. Sınırlar:",
          "     - Suriye Sınırı: 1921 Ankara Antlaşması esas alındı (Hatay dışarıda kaldı).",
          "     - Irak Sınırı: Musul sorunu çözülemedi; 9 ay içinde İngiltere ile ikili görüşmelere bırakıldı (Lozan'da ÇÖZÜLEMEYEN TEK KONUDUR).",
          "     - Batı Sınırı: Meriç Nehri sınır oldu; Karaağaç ve Bosnaköy savaş tazminatı olarak Türkiye'ye verildi.",
          "     - Ege Adaları: Gökçeada, Bozcaada ve Tavşan Adaları Türkiye'ye; 12 Ada İtalya'ya; diğer adalar silahsızlandırılmak şartıyla Yunanistan'a bırakıldı.",
          "  2. Boğazlar: Başkanı Türk olan uluslararası bir Boğazlar Komisyonu'na bırakıldı; Boğazların her iki yakası silahsızlandırıldı (Egemenliği kısıtlayan madde - 1936 Montrö ile düzeltildi).",
          "  3. Kapitülasyonlar: ADLİ, MALİ VE TİCARİ TÜM KAPİTÜLASYONLAR KAYITSIZ ŞARTSIZ TAMAMEN KALDIRILDI.",
          "  4. Dış Borçlar: Osmanlı borçları, Osmanlı'dan ayrılan devletler arasında bölüştürüldü; Türk payı taksitlendirildi (Fransız Frangı/TL).",
          "  5. Azınlıklar: Bütün gayrimüslimler 'Türk Vatandaşı' sayıldı; ayrıcalıklar bitti, yabancı devletlerin iç işlerimize karışması engellendi.",
          "  6. Nüfus Mübadelesi: İstanbul Rumları ile Batı Trakya Türkleri hariç (Etabli / Yerleşik), Türkiye'deki Rumlar ile Yunanistan'daki Türklerin zorunlu değişimi kabul edildi.",
          "  7. Yabancı Okullar: Türk kanunlarına ve MEB müfredatına tabi olması kararlaştırıldı (İç mesele sayıldı).",
          "  8. Patrikhane: Siyasi yetkileri kaldırılarak İstanbul'da kalmasına izin verildi."
        ],
        kpssKeyPoints: [
          "Lozan'da çözülemeyip sonraya bırakılan TEK konu: Musul Sorunu (Irak Sınırı).",
          "Lozan'da Mustafa Kemal'in asla taviz verilmemesini istediği 2 konu: Kapitülasyonlar ve Ermeni Yurdu.",
          "Savaş tazminatı olarak Yunanistan'dan alınan yer: Karaağaç (Edirne).",
          "Lozan'ı onaylayan meclis: II. TBMM (Lozan'ı I. TBMM heyeti imzaladı, II. TBMM onayladı)."
        ]
      }
    ]
  },
  {
    id: "inkilaplar",
    title: "5. Atatürk İnkılapları (Çağdaşlaşma Hamleleri)",
    subtitle: "Siyasi, Hukuk, Eğitim, Toplum ve Ekonomi Alanında Devrimler",
    years: "1923 – 1938",
    badge: "Büyük Devrimler",
    description:
      "Cumhuriyetin ilanı, Halifeliğin kaldırılması, Medeni Kanun, Harf İnkılabı, Tevhid-i Tedrisat, Soyadı Kanunu ve İzmir İktisat Kongresi ile modern Türkiye'nin inşası.",
    events: [
      {
        id: "siyasi-inkilaplar",
        periodId: "inkilaplar",
        title: "Siyasi Alandaki İnkılaplar ve Çok Partili Hayat",
        date: "1923 – 1934",
        category: "inkilap",
        importance: "critical",
        summary: "Cumhuriyetin ilanı, Ankara'nın başkent oluşu, Halifeliğin ilgası ve kadınlara siyasi haklar.",
        details: [
          "Ankara'nın Başkent Oluşu: 13 Ekim 1923 (İsmet İnönü teklifiyle).",
          "Cumhuriyetin İlanı: 29 Ekim 1923. Devletin adı, rejimi ve başkanlığı sorunu çözüldü. İlk Cumhurbaşkanı: Mustafa Kemal Atatürk, İlk Başbakan: İsmet İnönü, İlk Meclis Başkanı: Ali Fethi Okyar.",
          "Halifeliğin Kaldırılması (3 Mart 1924): Aynı gün Tevhid-i Tedrisat Kanunu çıktı, Şer'iye ve Evkaf Vekaleti ile Erkan-ı Harbiye Vekaleti kaldırıldı, Osmanlı Hanedanı yurt dışına çıkarıldı.",
          "Çok Partili Hayat Denemeleri:",
          "  - Halk Fırkası (CHP - 1923): İlk siyasi parti (Kurucu: Mustafa Kemal).",
          "  - Terakkiperver Cumhuriyet Fırkası (1924): İlk muhalefet partisi (Şifre: K-A-R-A-R -> Kazım Karabekir, Ali Fuat Cebesoy, Refet Bele, Adnan Adıvar, Rauf Orbay). Şeyh Sait İsyanı ve Takrir-i Sükun Kanunu ile kapatıldı.",
          "  - Serbest Cumhuriyet Fırkası (1930): İkinci muhalefet partisi (Kurucu: Ali Fethi Okyar - Menemen Olayı öncesi feshedildi).",
          "Kadınlara Siyasi Hakların Verilmesi (KPSS Şifresi: 034 BMW):",
          "  - 1930: Belediye Seçimlerine katılma hakkı.",
          "  - 1933: Muhtarlık Seçimlerine katılma hakkı (İlk kadın muhtar: Gül Esin).",
          "  - 1934: Milletvekili Seçme ve Seçilme hakkı (1935 meclisine 18 kadın milletvekili girdi)."
        ],
        kpssKeyPoints: [
          "Kadınlara Siyasi Haklar Şifresi: 0-3-4 B-M-W (1930 Belediye, 1933 Muhtar, 1934 Vekil).",
          "3 Mart 1924'te aynı gün yapılanlar: Halifeliğin kaldırılması, Tevhid-i Tedrisat, Şer'iye-Evkaf kaldırıldı (Diyanet & Vakıflar kuruldu), Erkan-ı Harbiye kaldırıldı (Genelkurmay ayrıldı), Hanedan yurt dışına çıkarıldı.",
          "İlk kadın muhtarımız: Gül Esin (Aydın Çine Karpuzlu)."
        ]
      },
      {
        id: "hukuk-inkilaplari",
        periodId: "inkilaplar",
        title: "Hukuk Alanındaki İnkılaplar ve Türk Medeni Kanunu (17 Şubat 1926)",
        date: "1924 – 1926",
        category: "inkilap",
        importance: "critical",
        summary: "Şer'i hukuktan laik hukuka geçiş, Mecelle'nin kaldırılması ve İsviçre'den uyarlanan Medeni Kanun.",
        details: [
          "Anayasalar: 1921 Teşkilat-ı Esasiye (Tek yumuşak ve çerçeve anayasa), 1924 Anayasası (1928'de 'Devletin dini İslam'dır' ibaresi çıkarıldı, 1937'de 6 Atatürk İlkesi anayasaya girdi).",
          "Türk Medeni Kanunu'nun Kabulü (17 Şubat 1926): İsviçre'den tercüme edilip uyarlandı (Avrupa'nın en yeni, pratik ve eşitlikçi kanunu olduğu için).",
          "Medeni Kanun ile Gelen Haklar:",
          "  - Kadın-erkek eşitliği sağlandı.",
          "  - Tek eşlilik zorunlu oldu, resmi nikah şart koşuldu.",
          "  - Mirasta ve mahkemede şahitlikte kadın-erkek eşitliği getirildi.",
          "  - Kadınlara istediği mesleğe girme ve boşanma hakkı tanındı.",
          "  - Patrikhanenin dünyevi/hukuki yetkileri elinden alındı.",
          "  - DİKKAT KPSS SINAV TUZAĞI: Medeni Kanun'da KADINLARA SİYASİ HAK (Seçme ve Seçilme) KESİNLİKLE YOKTUR! Siyasi haklar 1930-1934 arasında verilmiştir.",
          "Diğer Kanunlar ve Alındığı Ülkeler:",
          "  - Ceza Kanunu -> İtalya",
          "  - Borçlar Kanunu -> İsviçre",
          "  - Ticaret Kanunu -> Almanya",
          "  - İcra-İflas Kanunu -> İsviçre",
          "  - Ceza Muhakemeleri Kanunu -> Almanya",
          "  - Deniz Ticareti Kanunu -> Almanya",
          "  - İdare Hukuku -> Fransa"
        ],
        kpssKeyPoints: [
          "EN BÜYÜK KPSS TUZAĞI: Medeni Kanun ile kadınlara SİYASİ HAK VERİLMEMİŞTİR! (Sadece sosyal, medeni ve ekonomik haklar).",
          "Medeni Kanun'un alındığı ülke: İsviçre.",
          "Ceza Kanunu'nun alındığı ülke: İtalya."
        ]
      },
      {
        id: "egitim-kultur-inkilaplari",
        periodId: "inkilaplar",
        title: "Eğitim ve Kültür Alanındaki İnkılaplar",
        date: "1924 – 1935",
        category: "inkilap",
        importance: "critical",
        summary: "Tevhid-i Tedrisat, Yeni Türk Harfleri, Millet Mektepleri, Türk Tarih ve Dil Kurumları, Üniversite Reformu.",
        details: [
          "Tevhid-i Tedrisat Kanunu (3 Mart 1924): Ülkedeki tüm eğitim kurumları MEB'e bağlandı; medreseler kapatıldı; eğitimde birlik, laiklik ve millilik sağlandı.",
          "Yeni Türk Harflerinin Kabulü (1 Kasım 1928): Okuma yazmayı kolaylaştırmak ve çağdaşlaşmak amacıyla Latin esaslı alfabe kabul edildi.",
          "Millet Mektepleri (24 Kasım 1928): Yeni harfleri yetişkin halka öğretmek için açıldı. Mustafa Kemal'e 'BAŞÖĞRETMEN' unvanı verildi (24 Kasım Öğretmenler Günü).",
          "Türk Tarih Kurumu (1931) & Türk Dil Kurumu (1932): Türk milletinin köklü geçmişini ve Türkçenin zenginliğini ortaya çıkarmak için kuruldu (Milliyetçilik).",
          "Üniversite Reformu (1933): İsviçreli Prof. Albert Malche'nin hazırladığı rapor doğrultusunda çağdışı kalan Darülfünun kapatılarak yerine modern İSTANBUL ÜNİVERSİTESİ kuruldu.",
          "Dil ve Tarih-Coğrafya Fakültesi (DTCF - 1935): Ankara'da kuruldu.",
          "Sanat Hamleleri: Musiki Muallim Mektebi (1924), Sanayi-i Nefise Mektebi -> Güzel Sanatlar Akademisi'ne dönüştürüldü, Resim ve Heykel Müzesi açıldı (1937)."
        ],
        kpssKeyPoints: [
          "Mustafa Kemal'e 'Başöğretmen' unvanının verildiği kurum: Millet Mektepleri (24 Kasım 1928).",
          "İstanbul Üniversitesi Reformu raporunu hazırlayan yabancı uzman: Prof. Albert Malche (1933).",
          "Tevhid-i Tedrisat Kanunu tarihi: 3 Mart 1924."
        ]
      },
      {
        id: "toplumsal-ve-ekonomik-inkilaplar",
        periodId: "inkilaplar",
        title: "Toplumsal ve Ekonomik Alandaki İnkılaplar",
        date: "1923 – 1937",
        category: "inkilap",
        importance: "critical",
        summary: "Şapka Kanunu, Soyadı Kanunu, Aşar vergisinin kalkması, Kabotaj Kanunu ve Sanayi Planları.",
        details: [
          "Şapka Kanunu (25 Kasım 1925): Mustafa Kemal Kastamonu ve İnebolu gezisinde şapkayı halka tanıttı.",
          "Tekke, Zaviye ve Türbelerin Kapatılması (30 Kasım 1925): Şeyhlik, dervişlik, müritlik, falcılık, büyücülük unvanları yasaklandı ('Türkiye Cumhuriyeti şeyhler, dervişler, müritler memleketi olamaz').",
          "Zaman, Ölçü ve Takvimde Değişiklik: Miladi takvim (1926), Alaturka saat yerine uluslararası saat (1926), Uluslararası rakamlar (1928), Metre ve kilo sistemi (1931), Hafta tatilinin Cumadan Pazara alınması (1935) -> Batı ile ticari uyumu sağlamak için yapıldı.",
          "Soyadı Kanunu (21 Haziran 1934): Her vatandaşa Türkçe bir soyadı alma zorunluluğu getirildi; ayrıcalık bildiren unvanlar (ağa, paşa, hacı, hoca, molla, bey) kaldırıldı (Halkçılık). 24 Kasım 1934'te TBMM Mustafa Kemal'e 'ATATÜRK' soyadını verdi.",
          "İzmir İktisat Kongresi (17 Şubat 1923): Başkanlığını Kazım Karabekir yaptı. 'Misak-ı İktisadi' (Milli Ekonomi Andı) kabul edildi.",
          "Aşar (Öşür) Vergisinin Kaldırılması (17 Şubat 1925): Köylünün üzerindeki en ağır vergi yükü kaldırılarak tarımsal üretim desteklendi (Halkçılık).",
          "Kabotaj Kanunu (1 Temmuz 1926): Türk karasularında ve limanlarında gemi işletme ve ticaret hakkı millileştirildi (Milliyetçilik - 1 Temmuz Denizcilik Günü).",
          "Teşvik-i Sanayi Kanunu (1927): Özel sektörü desteklemek için çıkarıldı; ancak sermaye yetersizliği ve 1929 Dünya Ekonomik Buhranı (Kara Perşembe) yüzünden başarılı olamadı -> DEVLETÇİLİK İLKESİNE GEÇİLDİ.",
          "I. Beş Yıllık Sanayi Planı (1934): Sovyetler Birliği uzmanlarının desteğiyle başarıyla uygulandı; Sümerbank, Şeker fabrikaları, Dokuma fabrikaları, Paşabahçe Cam, Karabük Demir-Çelik Fabrikası kuruldu.",
          "Milli Bankalar: Türkiye İş Bankası (1924 - İlk özel/milli banka, ilk Genel Müdürü Celal Bayar), Merkez Bankası (1930), Sümerbank (1933), Etibank (1935)."
        ],
        kpssKeyPoints: [
          "Türkiye'nin ilk özel/milli bankası: Türkiye İş Bankası (1924 - İlk Genel Müdür: Celal Bayar).",
          "Türk karasularını millileştiren kanun: Kabotaj Kanunu (1 Temmuz 1926).",
          "Hafta tatilinin Cumadan Pazara alınma, metre-kilo ve takvim inkılaplarının temel amacı: Batı (Avrupa) ile ticari ve ekonomik ilişkilerde uyum sağlamak."
        ]
      }
    ]
  },
  {
    id: "ilkeler",
    title: "6. Atatürk İlkeleri ve Bütünleyici İlkeler",
    subtitle: "Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık",
    years: "1923 – 1938",
    badge: "Fikir Sistemi",
    description:
      "Atatürkçü Düşünce Sistemi'nin 6 temel ilkesi, anahtar kelimeleri, ilişkili inkılaplar ve soru çözdüren sınav şifreleri.",
    events: [
      {
        id: "cumhuriyetcilik-ve-milliyetcilik",
        periodId: "ilkeler",
        title: "1. Cumhuriyetçilik ve 2. Milliyetçilik",
        date: "Temel İlkeler",
        category: "ilke",
        importance: "critical",
        summary: "Milli egemenlik ve milli bağımsızlık temelleri.",
        details: [
          "1. CUMHURİYETÇİLİK: Halkın kendi kendini yönetmesi, milli irade ve seçim esasına dayanır.",
          "  - Anahtar Kelimeler: Ulusal egemenlik, milli irade, seçim, meclis (TBMM), çok partili hayat, oy kullanma, demokrasi, anayasa.",
          "  - İlgili İnkılaplar: TBMM'nin açılması, Saltanatın kaldırılması, Cumhuriyetin ilanı, Kadınlara siyasi haklar, Çok partili rejim denemeleri.",
          "2. MİLLİYETÇİLİK: Türk milletinin birlik, beraberlik ve bağımsızlığını yüceltme ülküsüdür. Irkçılığa ve kafatasçılığa kesinlikle karşıdır; birleştirici ve bütünleştiricidir.",
          "  - Anahtar Kelimeler: Milli benlik, bağımsızlık, Türk kültürü, Türk tarihi, Türk dili, Misak-ı Milli, vatan sevgisi, millileştirme.",
          "  - İlgili İnkılaplar: TTK ve TDK'nin kurulması, Kabotaj Kanunu, Kapitülasyonların kaldırılması, Merkez Bankası'nın kurulması, Yeni Türk Harfleri, Yabancı işletmelerin satın alınması/kamulaştırılması."
        ],
        kpssKeyPoints: [
          "Kabotaj Kanunu -> Doğrudan MİLLİYETÇİLİK (Denizlerimizin millileşmesi).",
          "Seçim, meclis, milletvekili, oy -> Doğrudan CUMHURİYETÇİLİK."
        ]
      },
      {
        id: "halkcilik-ve-devletcilik",
        periodId: "ilkeler",
        title: "3. Halkçılık ve 4. Devletçilik",
        date: "Temel İlkeler",
        category: "ilke",
        importance: "critical",
        summary: "Toplumsal eşitlik ve ekonomik kalkınma modelleri.",
        details: [
          "3. HALKÇILIK: Toplumda hiçbir zümreye, sınıfa veya aileye ayrıcalık tanınmaması; kanun önünde eşitlik ve sosyal adalet ilkesidir.",
          "  - Anahtar Kelimeler: Eşitlik, adalet, sosyal devlet, sınıfsız toplum, dayanışma, ayrıcalıkların reddi, halk yararı.",
          "  - İlgili İnkılaplar: Aşar vergisinin kaldırılması, Medeni Kanun (kadın-erkek eşitliği), Soyadı Kanunu (unvanların kalkması), Kılık-kıyafet kanunu, İlköğretimin zorunlu ve parasız olması.",
          "4. DEVLETÇİLİK: Özel sektörün yetersiz kaldığı büyük yatırımların devlet eliyle yapılmasıdır. Özel mülkiyete ve serbest piyasaya karşı DEĞİLDİR; milli kalkınmayı hızlandırma modelidir.",
          "  - Anahtar Kelimeler: Ekonomi, kamu yatırımı, kamulaştırma, fabrika, Beş Yıllık Sanayi Planı, Sümerbank, Etibank, KİT'ler, Merkez Bankası, demiryolu inşası.",
          "  - İlgili İnkılaplar: I. Beş Yıllık Sanayi Planı'nın uygulanması, Karabük Demir-Çelik ve şeker fabrikalarının kurulması, madenlerin devletçe işletilmesi (MTA)."
        ],
        kpssKeyPoints: [
          "Aşar Vergisinin kaldırılması -> Doğrudan HALKÇILIK (Köylü üzerindeki yükün kalkması ve eşitlik).",
          "Fabrika açılması, devlet yatırımı, sanayi planı -> Doğrudan DEVLETÇİLİK."
        ]
      },
      {
        id: "laiklik-ve-inkilapcilik",
        periodId: "ilkeler",
        title: "5. Laiklik ve 6. İnkılapçılık",
        date: "Temel İlkeler",
        category: "ilke",
        importance: "critical",
        summary: "Akılcılık, bilim ve sürekli çağdaşlaşma dinamizmi.",
        details: [
          "5. LAİKLİK: Din ve devlet işlerinin birbirinden ayrılması, hukukun ve eğitimin akla ve bilime dayandırılması; din, vicdan ve ibadet hürriyetidir.",
          "  - Anahtar Kelimeler: Akıl ve bilim, din-devlet ayrımı, vicdan özgürlüğü, inanç hürriyeti, taassup ve dogmatizm karşıtlığı.",
          "  - İlgili İnkılaplar: Halifeliğin kaldırılması, Saltanatın kaldırılması, Tevhid-i Tedrisat (medreselerin kapanması), Şer'iye ve Evkaf Vekaletinin ilgası, Tekke ve Zaviyelerin kapatılması, Medeni Kanun, 1928'de 'Devletin dini İslam'dır' maddesinin anayasadan çıkarılması.",
          "6. İNKILAPÇILIK: Zamanın gerisinde kalmış kurumları yıkarak yerine çağdaş, dinamik kurumlar kurmak ve sürekli yenilik içinde olmaktır.",
          "  - Anahtar Kelimeler: Çağdaşlaşma, modernleşme, dinamizm, yenilik, Batılılaşma, köklü değişim, muasır medeniyet seviyesi.",
          "  - İlgili İnkılaplar: Bütün Atatürk inkılapları İnkılapçılık ilkesi kapsamındadır; özellikle Takvim, Saat, Rakam, Ölçü ve Şapka inkılapları doğrudan örnektir."
        ],
        kpssKeyPoints: [
          "Atatürk İlkeleri Anayasaya ne zaman girdi: 1937 yılında.",
          "Bütün inkılapları kapsayan çatı ilke: İnkılapçılık."
        ]
      }
    ]
  },
  {
    id: "dis_politika",
    title: "7. Atatürk Dönemi Türk Dış Politikası",
    subtitle: "Lozan'dan Kalan Sorunlar, Milletler Cemiyeti, Montrö, Sadabat ve Hatay",
    years: "1923 – 1938",
    badge: "Milli Dış Politika",
    description:
      "Mustafa Kemal'in 'Yurtta sulh, cihanda sulh' ilkesi doğrultusunda Musul meselesi, Nüfus mübadelesi, Montrö Boğazlar Sözleşmesi, Balkan Antantı, Sadabat Paktı ve Hatay'ın anavatana katılışı.",
    events: [
      {
        id: "lozan-sonrasi-sorunlar",
        periodId: "dis_politika",
        title: "I. Dönem Dış Politika (1923 – 1930): Lozan'dan Kalan Sorunlar",
        date: "1923 – 1930",
        category: "dis_politika",
        importance: "critical",
        summary: "Yabancı Okullar, Musul Sorunu, Nüfus Mübadelesi ve Dış Borçlar meseleleri.",
        details: [
          "1. Yabancı Okullar Sorunu (1924-1926): Fransa ve Papalık müdahale etmek istedi; Türkiye 'Bu bizim iç meselemizdir' diyerek taviz vermedi ve Türk kanunlarına uymayanları kapattı.",
          "2. Musul Sorunu / Irak Sınırı (1926 Ankara Antlaşması):",
          "   - İngiltere ile Haliç Konferansı (Ali Fethi Okyar) yapıldı ancak uzlaşılamadı; konu Milletler Cemiyeti'ne gitti.",
          "   - 1925 Şeyh Sait İsyanı sebebiyle askeri müdahale yapılamadı; 1926 Ankara Antlaşması imzalandı.",
          "   - Karar: Musul ve Kerkük İngiliz mandasındaki Irak'a bırakıldı (Misak-ı Milli'den 3. Taviz); Musul petrol gelirlerinin %10'u 25 yıllığına Türkiye'ye verildi (Türkiye 500 bin sterline devretti).",
          "3. Nüfus Mübadelesi / Etabli Sorunu (1930 Ahali Sözleşmesi): Yunanistan ile çözüldü; İstanbul Rumları ile Batı Trakya Türkleri yerleşik (etabli) sayıldı, diğerleri mübadele edildi. Türk-Yunan dostluğu başladı (Venizelos Atatürk'ü Nobel Barış Ödülü'ne aday gösterdi).",
          "4. Dış Borçlar Sorunu: 1929 Dünya Buhranı sonrası Fransa ile 1933 Paris Sözleşmesi imzalanarak borçlar yapılandırıldı."
        ],
        kpssKeyPoints: [
          "Misak-ı Milli'den verilen ÜÇÜNCÜ taviz: Musul (1926 Ankara Antlaşması).",
          "Mustafa Kemal Atatürk'ü Nobel Barış Ödülü'ne aday gösteren yabancı lider: Yunanistan Başbakanı Venizelos (1934).",
          "Şeyh Sait İsyanı sebebiyle aleyhimize sonuçlanan dış politika konusu: Musul Meselesi."
        ]
      },
      {
        id: "guvenlik-ve-antlasmalar",
        periodId: "dis_politika",
        title: "II. Dönem Dış Politika (1930 – 1938): İttifaklar ve Montrö Zaferi",
        date: "1930 – 1938",
        category: "dis_politika",
        importance: "legendary",
        summary: "Milletler Cemiyeti, Balkan Antantı, Montrö Boğazlar Sözleşmesi, Sadabat Paktı ve Hatay.",
        details: [
          "1. Milletler Cemiyeti'ne Giriş (18 Temmuz 1932): İspanya'nın teklifi ve Yunanistan'ın desteğiyle DAVET EDİLEREK üye olan tek devlettir.",
          "2. Balkan Antantı (9 Şubat 1934 - Şifre: T-A-Y-Y-A-R):",
          "   - Almanya ve İtalya'nın saldırgan politikalarına karşı Batı sınırını korumak için imzalandı.",
          "   - Katılan Devletler: Türkiye, Yunanistan, Yugoslavya, Romanya (T-A-Y-Y-A-R).",
          "   - Katılmayanlar: Bulgaristan (revizyonist/yayılmacı olduğu için), Arnavutluk (İtalya baskısı yüzünden).",
          "3. Montrö Boğazlar Sözleşmesi (20 Temmuz 1936):",
          "   - İtalya ve Almanya'nın silahlanması üzerine Türkiye Boğazlar statüsünün değiştirilmesini istedi.",
          "   - İmzacı: Dışişleri Bakanı Tevfik Rüştü Aras.",
          "   - Kararlar: Uluslararası Boğazlar Komisyonu KALDIRILDI; tüm yetkiler ve asker bulundurma hakkı TÜRKİYE'YE VERİLDİ. Boğazlar üzerinde TAM TÜRK EGEMENLİĞİ sağlandı.",
          "4. Sadabat Paktı (8 Temmuz 1937 - Şifre: İ-T-A-N):",
          "   - İtalya'nın Habeşistan'ı (Etiyopya) işgali üzerine Doğu sınırını güvenceye almak için Tahran'da imzalandı.",
          "   - Katılan Devletler: İran, Türkiye, Afganistan, Irak (İ-T-A-N).",
          "   - Katılmayan: Suriye (Türkiye ile Hatay ve Irak ile sınır sorunları yüzünden katılmadı).",
          "5. Hatay Sorunu ve Hatay'ın Anavatana Katılması (1936 – 1939):",
          "   - Fransa 1936'da Suriye mandasından çekilince Hatay sorunu doğdu.",
          "   - Atatürk: 'Hatay benim şahsi meselemdir', 'Kırk asırlık Türk yurdu düşman elinde esir kalamaz' dedi. Kurun gazetesinde 'Asım Us' takma adıyla hükümeti eleştiren makaleler yazdı.",
          "   - Milletler Cemiyeti İsveçli diplomat Sandler Raporu'nu kabul etti.",
          "   - 2 Eylül 1938'de bağımsız HATAY DEVLETİ kuruldu (İlk Cumhurbaşkanı: Tayfur Sökmen, İlk Başbakan: Abdurrahman Melek).",
          "   - 23 Haziran 1939'da Hatay Meclisi Türkiye'ye iltihak (katılma) kararı aldı (Atatürk'ün vefatından sonra tamamlandı)."
        ],
        kpssKeyPoints: [
          "Balkan Antantı Şifresi: T-A-Y-Y-A-R (Türkiye, Yunanistan, Yugoslavya, Romanya).",
          "Sadabat Paktı Şifresi: İ-T-A-N (İran, Türkiye, Afganistan, Irak).",
          "Boğazlar Komisyonunu kaldıran ve tam Türk egemenliğini kuran belge: Montrö Boğazlar Sözleşmesi (1936).",
          "Hatay Devleti'nin ilk ve tek Cumhurbaşkanı: Tayfur Sökmen."
        ],
        quote: {
          text: "Kırk asırlık Türk yurdu düşman elinde esir kalamaz. Hatay benim şahsi meselemdir!",
          context: "Mustafa Kemal Atatürk - Hatay Davası"
        }
      }
    ]
  }
];

// ----------------------------------------------------
// 2. KPSS & MEB İÇİN TÜM ATATÜRK KODLAMALARI / ŞİFRELERİ
// ----------------------------------------------------
export const ATATURK_MASTER_MNEMONICS: AtaturkMnemonic[] = [
  {
    code: "Ç - K - S (Çanakkale -> Kafkas -> Suriye)",
    title: "I. Dünya Savaşı'nda Savaştığı Cepheler (Kronolojik)",
    context: "Mustafa Kemal'in I. Dünya Savaşı'nda savaştığı cephelerin tarih sırasıdır.",
    category: "hayati",
    items: [
      { letter: "Ç", word: "Çanakkale Cephesi (1915)", note: "19. Tümen - Anafartalar Kahramanı" },
      { letter: "K", word: "Kafkas Cephesi (1916)", note: "Muş ve Bitlis'i kurtardı, Generallik" },
      { letter: "S", word: "Suriye-Filistin Cephesi (1917-1918)", note: "7. Ordu & Yıldırım Orduları Komutanlığı" }
    ]
  },
  {
    code: "M - İ - L - A - T",
    title: "I. İnönü Savaşı'nın Sonuçları",
    context: "I. İnönü Zaferi sonrası içeride ve dışarıda yaşanan 5 büyük gelişme.",
    category: "cepheler",
    items: [
      { letter: "M", word: "Moskova Antlaşması (1921)", note: "Sovyet Rusya ile (Batum taviz)" },
      { letter: "İ", word: "İstiklal Marşı'nın Kabulü (12 Mart 1921)", note: "Mehmet Akif Ersoy" },
      { letter: "L", word: "Londra Konferansı (1921)", note: "TBMM hukuken ilk kez tanındı" },
      { letter: "A", word: "Afganistan Dostluk Antlaşması (1921)", note: "İlk Müslüman devlet" },
      { letter: "T", word: "Teşkilat-ı Esasiye Kanunu (1921)", note: "İlk Anayasa" }
    ]
  },
  {
    code: "B - O - R - S - A - K",
    title: "Misak-ı Millî Konuları / Kararları",
    context: "Son Osmanlı Mebusan Meclisi'nde kabul edilen milli yemin maddeleri.",
    category: "hazirlik",
    items: [
      { letter: "B", word: "Boğazlar", note: "İstanbul ve Marmara güvenliği şartıyla açılabilir" },
      { letter: "O", word: "Osmanlı Borçları", note: "Adil paylaşım esastır" },
      { letter: "R", word: "Referandum (Halk Oylaması)", note: "Kars, Ardahan, Batum, Batı Trakya, Arap toprakları" },
      { letter: "S", word: "Sınırlar", note: "Mondros anında işgal edilmemiş vatan bir bütündür" },
      { letter: "A", word: "Azınlık Hakları", note: "Komşu ülkelerdeki Müslümanlar kadar hak verilir" },
      { letter: "K", word: "Kapitülasyonlar", note: "Adli ve mali sınırlamalar kesinlikle kabul edilemez" }
    ]
  },
  {
    code: "0 3 4   B - M - W",
    title: "Türk Kadınına Verilen Siyasi Haklar",
    context: "Kadınların siyasal hayata katılım aşamaları ve yılları.",
    category: "inkilaplar",
    items: [
      { letter: "1930 (B)", word: "Belediye Seçimleri", note: "İlk kadın belediye başkanı: Sadiye Hanım" },
      { letter: "1933 (M)", word: "Muhtarlık Seçimleri", note: "İlk kadın muhtar: Gül Esin" },
      { letter: "1934 (W / V)", word: "Vekillik (Milletvekili)", note: "1935 Meclisine 18 kadın milletvekili girdi" }
    ]
  },
  {
    code: "K - A - R - A - R",
    title: "Terakkiperver Cumhuriyet Fırkası Kurucuları",
    context: "Cumhuriyet tarihinin ilk muhalefet partisini kuran paşalar.",
    category: "inkilaplar",
    items: [
      { letter: "K", word: "Kâzım Karabekir", note: "Genel Başkan" },
      { letter: "A", word: "Ali Fuat Cebesoy", note: "Genel Sekreter" },
      { letter: "R", word: "Refet Bele", note: "Kurucu Üye" },
      { letter: "A", word: "Adnan Adıvar", note: "Kurucu Üye" },
      { letter: "R", word: "Rauf Orbay", note: "Kurucu Üye" }
    ]
  },
  {
    code: "T - A - Y - Y - A - R",
    title: "Balkan Antantı'na Katılan Devletler (1934)",
    context: "Batı sınırını İtalyan ve Alman tehdidine karşı koruyan pakt.",
    category: "dis_politika",
    items: [
      { letter: "T", word: "Türkiye", note: "Öncü devlet" },
      { letter: "A", word: "Yunanistan (Atina)", note: "Venizelos dönemi işbirliği" },
      { letter: "Y", word: "Yugoslavya", note: "Balkan müttefiki" },
      { letter: "R", word: "Romanya", note: "Karadeniz-Balkan müttefiki" }
    ]
  },
  {
    code: "İ - T - A - I (İran, Türkiye, Afganistan, Irak)",
    title: "Sadabat Paktı'na Katılan Devletler (1937)",
    context: "Doğu sınırını İtalyan yayılmacılığına karşı koruyan Tahran Paktı.",
    category: "dis_politika",
    items: [
      { letter: "İ", word: "İran", note: "Ev sahibi devlet (Sadabat Sarayı)" },
      { letter: "T", word: "Türkiye", note: "Öncü devlet" },
      { letter: "A", word: "Afganistan", note: "Doğu müttefiki" },
      { letter: "I", word: "Irak", note: "Ortadoğu komşusu" }
    ]
  },
  {
    code: "1-2-3 TAVİZ",
    title: "Misak-ı Millî'den Verilen 3 Taviz",
    context: "Sırasıyla verilen toprak tavizleri ve ilgili antlaşmalar.",
    category: "antlasmalar",
    items: [
      { letter: "1. Taviz", word: "Batum (1921 Moskova Antlaşması)", note: "Gürcistan'a bırakıldı" },
      { letter: "2. Taviz", word: "Hatay (1921 Ankara Antlaşması)", note: "Fransa mandasındaki Suriye'ye bırakıldı (1939'da geri alındı)" },
      { letter: "3. Taviz", word: "Musul (1926 Ankara Antlaşması)", note: "İngiliz mandasındaki Irak'a bırakıldı" }
    ]
  }
];

// ----------------------------------------------------
// 3. KPSS SINAV TUZAKLARI VE KRİTİK AYIRT EDİCİ BİLGİLER
// ----------------------------------------------------
export const ATATURK_EXAM_TRAPS: AtaturkExamTrap[] = [
  {
    id: "medeni-kanun-siyasi-hak",
    topic: "Türk Medeni Kanunu (1926) ve Siyasi Haklar",
    warning: "ÖSYM'nin en çok sorduğu çeldirici: Medeni Kanun ile kadınlara seçme-seçilme hakkı verildi mi?",
    correctFact: "KESİNLİKLE HAYIR! 1926 Medeni Kanunu sadece SOSYAL, HUKUKİ ve EKONOMİK hakları kapsar. Kadınlara siyasi haklar (Belediye 1930, Muhtarlık 1933, Milletvekilliği 1934) anayasa değişiklikleriyle verilmiştir.",
    examPointers: "Şıklarda 'Kadınların milletvekili olması Medeni Kanun sonucudur' görürseniz DİREKT ELEME YAPIN."
  },
  {
    id: "nutuk-kapsami",
    topic: "Nutuk'un Tarihsel Kapsamı (1919 – 1927)",
    warning: "1928 Harf İnkılabı, 1930 Kadın hakları, Menemen Olayı, Montrö veya Hatay davası Nutuk'ta geçer mi?",
    correctFact: "HAYIR! Nutuk 1919 Samsun'a çıkış ile başlar, 1927 CHP II. Kurultayı'nda okunarak sona erer. 1927'den sonraki hiçbir olay Nutuk'ta yer almaz.",
    examPointers: "ÖSYM Soru Kalıbı: 'Hangisi Nutuk'ta yer almaz?' -> Cevap daima 1928 ve sonrası bir inkılaptır (Harf İnkılabı, Soyadı Kanunu, Montrö vb.)."
  },
  {
    id: "lozan-cozulemeyen-konu",
    topic: "Lozan'da Çözülemeyen Tek Konu: Musul Sorunu",
    warning: "Boğazlar, Kapitülasyonlar veya Dış Borçlar Lozan'da çözülemedi mi?",
    correctFact: "HAYIR! Boğazlar komisyona bırakılarak, kapitülasyonlar kaldırılarak, borçlar paylaştırılarak çözülmüştür. Lozan'da ÇÖZÜLEMEYİP sonraya bırakılan TEK KONU: Türkiye ile İngiltere arasındaki Irak Sınırı (Musul) konusudur.",
    examPointers: "Boğazlar lehimize çözülmemiş olsa da bir statüye bağlanmıştır; fakat Musul hiç çözülememiştir."
  },
  {
    id: "erzurum-vs-sivas",
    topic: "Erzurum Kongresi vs. Sivas Kongresi Farkı",
    warning: "Erzurum ve Sivas kongrelerinin toplanış ve karar nitelikleri karışır.",
    correctFact: "Erzurum: Toplanış bakımından BÖLGESEL, Kararları bakımından MİLLÎ'dir. Sivas: Hem toplanış hem de kararları bakımından TAMAMEN MİLLÎ'dir. Manda fikri Erzurum'da İLK KEZ, Sivas'ta KESİN OLARAK reddedilmiştir.",
    examPointers: "Bütün cemiyetlerin ARMHC adıyla tek çatı altında birleştiği kongre SİVAS Kongresi'dir."
  },
  {
    id: "balkan-ve-sadabat-katilmayanlar",
    topic: "Balkan Antantı ve Sadabat Paktı'na Katılmayan Devletler",
    warning: "Balkan ve Doğu sınır paktlarında kimlerin olmadığı ÖSYM tarafından sürekli sorulur.",
    correctFact: "Balkan Antantı'na Bulgaristan (yayılmacı olduğu için) ve Arnavutluk (İtalya korkusuyla) KATILMAMIŞTIR. Sadabat Paktı'na Suriye (Hatay ve sınır sorunları yüzünden) KATILMAMIŞTIR.",
    examPointers: "Balkan'da 'Bulgaristan', Sadabat'ta 'Suriye' şıkkı ÖSYM'nin klasik doğru cevabıdır."
  }
];

// ----------------------------------------------------
// 4. ANLAŞMALAR KARŞILAŞTIRMA MATRİSİ
// ----------------------------------------------------
export const ATATURK_TREATIES_LIST: AtaturkTreaty[] = [
  {
    id: "gumru-1920",
    name: "Gümrü Antlaşması",
    date: "3 Aralık 1920",
    parties: "TBMM (Kazım Karabekir) <-> Ermenistan",
    significance: "TBMM'nin uluslararası alandaki İLK siyasi ve askeri zaferidir.",
    keyPoints: [
      "Ermenistan Sevr'i tanımadığını kabul eden ilk devlet oldu.",
      "Kars, Sarıkamış ve Kağızman kurtarıldı; Aras Nehri ve Çıldır Gölü sınır oldu.",
      "Resmi bir antlaşmada ilk kez 'Türkiye / TBMM' adı geçti."
    ],
    kpssNote: "Misak-ı Milli'yi tanıyan ve Sevr'den vazgeçen İLK DEVLET Ermenistan'dır."
  },
  {
    id: "moskova-1921",
    name: "Moskova Antlaşması",
    date: "16 Mart 1921",
    parties: "TBMM (Yusuf Kemal Tengirşenk, Ali Fuat Cebesoy) <-> Sovyet Rusya",
    significance: "TBMM'yi tanıyan İLK BÜYÜK AVRUPA DEVLETİ Sovyet Rusya oldu.",
    keyPoints: [
      "İki taraftan birinin tanımadığı antlaşmayı diğeri de tanımayacaktır (Sevr geçersiz kılındı).",
      "Çarlık Rusyası ile Osmanlı arasındaki tüm antlaşmalar ve kapitülasyonlar geçersiz sayıldı.",
      "Batum Gürcistan'a bırakıldı (Misak-ı Milli'den 1. Taviz)."
    ],
    kpssNote: "Kapitülasyonların kaldırıldığını kabul eden ilk büyük Avrupa devleti Sovyet Rusya'dır."
  },
  {
    id: "kars-1921",
    name: "Kars Antlaşması",
    date: "13 Ekim 1921",
    parties: "TBMM (Kazım Karabekir) <-> Kafkas Cumhuriyetleri (Azerbaycan, Ermenistan, Gürcistan)",
    significance: "DOĞU SINIRIMIZ KESİN VE NİHAİ ŞEKLİNİ ALDI.",
    keyPoints: [
      "Moskova Antlaşması Kafkas cumhuriyetleri tarafından onaylandı.",
      "Nahçıvan'a özerklik statüsü verildi.",
      "Doğu Cephesi'ndeki birlikler Batı Cephesi'ne kaydırıldı."
    ],
    kpssNote: "Doğu sınırının evreleri: Gümrü -> Moskova -> Kars (Kesin sınır)."
  },
  {
    id: "ankara-1921",
    name: "Ankara Antlaşması (1921)",
    date: "20 Ekim 1921",
    parties: "TBMM (Yusuf Kemal Tengirşenk) <-> Fransa (Franklin Bouillon)",
    significance: "TBMM'yi tanıyan İLK İTİLAF DEVLETİ Fransa oldu. Güney Cephesi kapandı.",
    keyPoints: [
      "Türk-Fransız savaşı bitti; Güney sınırı çizildi.",
      "Hatay ve İskenderun Fransa mandasındaki Suriye'ye bırakıldı (Misak-ı Milli'den 2. Taviz).",
      "Hatay'da özel yönetim ve Türkçe kültür güvenceye alındı; Caber Kalesi Türk toprağı sayıldı."
    ],
    kpssNote: "İtilaf Devletleri bloğu resmen parçalandı."
  },
  {
    id: "mudanya-1922",
    name: "Mudanya Ateşkes Antlaşması",
    date: "11 Ekim 1922",
    parties: "TBMM (İsmet İnönü) <-> İngiltere, Fransa, İtalya",
    significance: "Doğu Trakya, İstanbul ve Boğazlar SAVAŞSIZ kurtarıldı. Osmanlı HUKUKEN bitti.",
    keyPoints: [
      "Doğu Trakya 30 gün içinde TBMM yönetimine bırakıldı.",
      "İstanbul ve Boğazlar TBMM'ye devredildi.",
      "İsmet İnönü'nün diplomatik başarısı onu Lozan başdelegeliğine taşıdı."
    ],
    kpssNote: "Savaş yapılmadan masada kazanılan topraklar: Doğu Trakya, İstanbul ve Boğazlar."
  },
  {
    id: "lozan-1923",
    name: "Lozan Barış Antlaşması",
    date: "24 Temmuz 1923",
    parties: "TBMM (İsmet İnönü) <-> İtilaf Devletleri (İngiltere, Fransa, İtalya, Yunanistan, Japonya vb.)",
    significance: "Türkiye Cumhuriyeti'nin kurucu tapu senedi ve tam bağımsızlık belgesidir.",
    keyPoints: [
      "Kapitülasyonlar tamamen kaldırıldı.",
      "Ermeni Yurdu iddiaları tarihe gömüldü.",
      "Karaağaç savaş tazminatı olarak alındı.",
      "Bütün azınlıklar Türk vatandaşı sayıldı.",
      "Musul konusu hariç tüm ana meseleler çözüldü."
    ],
    kpssNote: "Lozan'ı I. TBMM heyeti imzaladı, yeni kurulan II. TBMM onayladı."
  },
  {
    id: "montro-1936",
    name: "Montrö Boğazlar Sözleşmesi",
    date: "20 Temmuz 1936",
    parties: "Türkiye (Tevfik Rüştü Aras) <-> İngiltere, Fransa, SSCB, Japonya, Romanya, Yunanistan vb.",
    significance: "Boğazlar üzerinde TAM VE MUTLAK TÜRK EGEMENLİĞİ sağlandı.",
    keyPoints: [
      "Uluslararası Boğazlar Komisyonu kaldırıldı; yetkileri Türk Devleti'ne devredildi.",
      "Boğazların her iki yakasında asker ve tahkimat bulundurma hakkı Türkiye'ye verildi.",
      "Savaş gemilerinin geçişi Türkiye'nin kontrolüne bağlandı; ticaret gemilerine serbest geçiş tanındı."
    ],
    kpssNote: "Lozan'ın kısıtlayıcı maddesi Montrö ile lehimize tam egemenliğe dönüştürülmüştür."
  }
];

// ----------------------------------------------------
// 5. TEST VE QUIZ SORULARI (ÖSYM & KPSS STANDARTLARINDA)
// ----------------------------------------------------
export const ATATURK_QUIZ_QUESTIONS: AtaturkQuizQuestion[] = [
  {
    id: "q1",
    periodId: "hazirlik",
    examType: "KPSS",
    question: "Millî Mücadele'nin gerekçesi, amacı ve yöntemi ilk kez aşağıdaki belgelerin hangisinde belirtilmiştir?",
    options: [
      "A) Havza Genelgesi",
      "B) Amasya Genelgesi",
      "C) Erzurum Kongresi",
      "D) Sivas Kongresi",
      "E) Misak-ı Millî"
    ],
    correctIndex: 1,
    explanation: "Amasya Genelgesi'nde yer alan 'Vatanın bütünlüğü tehlikededir' (Gerekçe) ve 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır' (Amaç ve Yöntem) maddeleriyle ihtilal beyannamesi ilan edilmiştir."
  },
  {
    id: "q2",
    periodId: "cepheler",
    examType: "KPSS",
    question: "Mustafa Kemal Paşa'nın 'Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz' tarihi telgrafını çektiği muharebe hangisidir?",
    options: [
      "A) I. İnönü Savaşı",
      "B) II. İnönü Savaşı",
      "C) Sakarya Meydan Muharebesi",
      "D) Büyük Taarruz",
      "E) Aslıhanlar-Dumlupınar Muharebesi"
    ],
    correctIndex: 1,
    explanation: "Mustafa Kemal, II. İnönü Zaferi sonrası Batı Cephesi Komutanı İsmet Paşa'ya çektiği tebrik telgrafında bu ifadeyi kullanmıştır."
  },
  {
    id: "q3",
    periodId: "inkilaplar",
    examType: "KPSS",
    question: "17 Şubat 1926'da kabul edilen Türk Medeni Kanunu ile kadınlara aşağıdaki haklardan hangisi VERİLMEMİŞTİR?",
    options: [
      "A) İstediği mesleği seçme hakkı",
      "B) Mirasta erkeklerle eşit pay alma hakkı",
      "C) Mahkemelerde şahitlikte eşitlik",
      "D) Milletvekili seçme ve seçilme hakkı",
      "E) Resmi nikah ve boşanma hakkı"
    ],
    correctIndex: 3,
    explanation: "Medeni Kanun sadece sosyal, hukuki ve ekonomik haklar getirmiştir. Kadınlara milletvekili seçme ve seçilme hakkı 1934 yılında yapılan anayasa değişikliği ile verilmiştir."
  },
  {
    id: "q4",
    periodId: "antlasmalar",
    examType: "KPSS",
    question: "Lozan Barış Konferansı'nda çözüme kavuşturulamayıp ikili görüşmelere bırakılan TEK konu aşağıdakilerden hangisidir?",
    options: [
      "A) Boğazlar Meselesi",
      "B) Kapitülasyonlar",
      "C) Musul Sorunu (Irak Sınırı)",
      "D) Dış Borçlar",
      "E) Nüfus Mübadelesi"
    ],
    correctIndex: 2,
    explanation: "Musul Sorunu (Irak Sınırı), Türkiye ile İngiltere arasında Lozan'da çözülemeyen ve 9 ay içinde ikili görüşmelere bırakılan tek konudur."
  },
  {
    id: "q5",
    periodId: "dis_politika",
    examType: "KPSS",
    question: "Aşağıdaki devletlerden hangisi 1934 yılında kurulan Balkan Antantı'na yayılmacı (revizyonist) politikaları sebebiyle KATILMAMIŞTIR?",
    options: [
      "A) Romanya",
      "B) Yunanistan",
      "C) Yugoslavya",
      "D) Bulgaristan",
      "E) Türkiye"
    ],
    correctIndex: 3,
    explanation: "Bulgaristan, I. Dünya Savaşı ve Balkan savaşlarında kaybettiği Ege ve Dobruca topraklarını geri alma arzusu ve yayılmacı politikası nedeniyle Balkan Antantı'na katılmamıştır."
  },
  {
    id: "q6",
    periodId: "hayati",
    examType: "KPSS",
    question: "Mustafa Kemal Atatürk'ün gelirlerini Türk Hava Kurumu'na bağışladığı ve 1919-1927 yıllarını kapsayan başyapıtı hangisidir?",
    options: [
      "A) Medeni Bilgiler",
      "B) Zabit ve Kumandan ile Hasbihal",
      "C) Nutuk",
      "D) Geometri",
      "E) Cumali Ordugâhı"
    ],
    correctIndex: 2,
    explanation: "Nutuk, 1919-1927 yıllarını anlatan ve telif hakları Türk Tayyare Cemiyeti'ne (Türk Hava Kurumu) bırakılan tarihi eserdir."
  },
  {
    id: "q7",
    periodId: "ilkeler",
    examType: "KPSS",
    question: "1 Temmuz 1926'da yürürlüğe giren ve Türk karasularında deniz ticareti ile liman işletme hakkını millileştiren Kabotaj Kanunu doğrudan hangi Atatürk ilkesiyle ilişkilidir?",
    options: [
      "A) Laiklik",
      "B) Milliyetçilik",
      "C) Halkçılık",
      "D) Devletçilik",
      "E) Cumhuriyetçilik"
    ],
    correctIndex: 1,
    explanation: "Kabotaj Kanunu ile Türk denizleri yabancı tekelinden kurtarılıp millileştirildiği için doğrudan Milliyetçilik ve Bağımsızlık ilkesiyle ilgilidir."
  },
  {
    id: "q8",
    periodId: "hazirlik",
    examType: "KPSS",
    question: "Temsil Heyeti'nin bir hükümet gibi hareket ederek ilk kez YÜRÜTME yetkisini kullandığı gelişme aşağıdakilerden hangisidir?",
    options: [
      "A) Amasya Genelgesi'ni yayımlaması",
      "B) Ali Fuat Paşa'yı Batı Cephesi Komutanlığı'na ataması",
      "C) Erzurum Kongresi'ni toplaması",
      "D) Damat Ferit Hükümeti'ni düşürmesi",
      "E) TBMM'nin açılışını gerçekleştirmesi"
    ],
    correctIndex: 1,
    explanation: "Sivas Kongresi'nde Temsil Heyeti, Ali Fuat Cebesoy Paşa'yı Batı Cephesi Kuva-yı Milliye Komutanlığı'na atayarak ilk kez yürütme yetkisi kullanmıştır."
  }
];
