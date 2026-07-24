import type { MapMarker, MarkerKind, MarkerSubtype } from "./types";

export type MarkerKindOption = {
  id: MarkerKind;
  label: string;
  icon: string;
  color: string;
};

export const MARKER_KINDS: MarkerKindOption[] = [
  { id: "mountain", label: "Dağ", icon: "mountain", color: "#a85d42" },
  { id: "plain", label: "Ova", icon: "land", color: "#bf9a45" },
  { id: "agriculture", label: "Tarım", icon: "sprout", color: "#4f8b67" },
  { id: "river", label: "Akarsu", icon: "spline", color: "#397ca8" },
  { id: "lake", label: "Göl", icon: "waves", color: "#4d91bd" },
  { id: "mine", label: "Maden", icon: "pickaxe", color: "#80649b" },
  { id: "energy", label: "Enerji", icon: "zap", color: "#c77c38" },
  { id: "tourism", label: "Turizm", icon: "landmark", color: "#d08b35" },
  { id: "city", label: "Yerleşim", icon: "building", color: "#5b6f69" },
  { id: "custom", label: "Özel", icon: "star", color: "#d05f64" },
];

export type MarkerSubtypeOption = {
  id: MarkerSubtype;
  parent: MarkerKind;
  group: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
};

const subtype = (
  parent: MarkerKind,
  id: string,
  group: string,
  label: string,
  icon: string,
  color: string,
  description: string,
): MarkerSubtypeOption => ({
  id: `${parent}-${id}`,
  parent,
  group,
  label,
  shortLabel: label,
  icon,
  color,
  description,
});

export const MARKER_SUBTYPES: MarkerSubtypeOption[] = [
  subtype("mountain", "fold", "Oluşum", "Kıvrım Dağı", "spline", "#9c6548", "Sıkışıp kıvrılan tabakaların yükselmesi"),
  subtype("mountain", "fault-block", "Oluşum", "Kırık Dağ (Horst)", "activity", "#75594d", "Faylanma sonucunda yüksekte kalan blok"),
  subtype("mountain", "volcanic", "Oluşum", "Volkanik Dağ", "volcano", "#c8563f", "Volkanik faaliyetlerle oluşan dağ"),

  subtype("plain", "tectonic", "Oluşum", "Tektonik Ova", "activity", "#b6863f", "Fay hatları boyunca çökme sonucu oluşur"),
  subtype("plain", "delta", "Oluşum", "Delta Ovası", "waves", "#4f9082", "Akarsuyun kıyıda biriktirdiği alüvyonlarla oluşur"),
  subtype("plain", "karstic", "Oluşum", "Karstik Ova", "circle", "#8b7b5a", "Karstik çözünme ve çökme süreçleriyle oluşur"),
  subtype("plain", "coastal", "Konum", "Kıyı Ovası", "umbrella", "#4b8ea8", "Denize yakın alçak kıyı düzlüğü"),
  subtype("plain", "interior", "Konum", "İç Bölge Ovası", "land", "#a18c4b", "İç kesimlerde bulunan ova"),

  subtype("river", "black-sea", "Döküldüğü Havza", "Karadeniz Havzası", "waves", "#367ca5", "Sularını Karadeniz’e ulaştıran akarsu"),
  subtype("river", "marmara", "Döküldüğü Havza", "Marmara Havzası", "waves", "#4c88a6", "Sularını Marmara Denizi’ne ulaştıran akarsu"),
  subtype("river", "aegean", "Döküldüğü Havza", "Ege Havzası", "spline", "#3f83ad", "Sularını Ege Denizi’ne ulaştıran akarsu"),
  subtype("river", "mediterranean", "Döküldüğü Havza", "Akdeniz Havzası", "spline", "#3475a2", "Sularını Akdeniz’e ulaştıran akarsu"),
  subtype("river", "persian-gulf", "Döküldüğü Havza", "Basra Körfezi Havzası", "droplet", "#4d79a1", "Fırat-Dicle sistemiyle Basra Körfezi’ne ulaşır"),
  subtype("river", "caspian", "Döküldüğü Havza", "Hazar Havzası", "droplet", "#5b809a", "Aras-Kura sistemiyle Hazar Denizi’ne ulaşır"),
  subtype("river", "closed-basin", "Döküldüğü Havza", "Kapalı Havza", "land", "#667f8b", "Suları denize ulaşmayan kapalı havza akarsuyu"),

  subtype("agriculture", "wheat", "Tahıllar", "Buğday", "wheat", "#c89b3c", "Türkiye’de en yaygın yetiştirilen tahıl"),
  subtype("agriculture", "barley", "Tahıllar", "Arpa", "wheat", "#ad8b45", "Soğuk ve kuraklığa buğdaydan daha dayanıklı"),
  subtype("agriculture", "corn", "Tahıllar", "Mısır", "corn", "#d9a72c", "Nemli alanlarda veya sulamayla yetiştirilir"),
  subtype("agriculture", "rice", "Tahıllar", "Çeltik (Pirinç)", "waves", "#8fa85a", "Bol su isteyen ve su içinde yetişen ürün"),
  subtype("agriculture", "rye", "Tahıllar", "Çavdar", "wheat", "#9e8651", "Soğuğa ve verimsiz toprağa dayanıklı tahıl"),
  subtype("agriculture", "oat", "Tahıllar", "Yulaf", "wheat", "#b49b65", "Serin iklim koşullarına uyumlu tahıl"),
  subtype("agriculture", "chickpea", "Baklagiller", "Nohut", "bean", "#c7a367", "Kuraklığa dayanıklı baklagil"),
  subtype("agriculture", "lentil", "Baklagiller", "Mercimek", "bean", "#a87349", "Kurak alanlarda yaygın baklagil"),
  subtype("agriculture", "bean", "Baklagiller", "Fasulye", "bean", "#6f9b64", "Yazın sulanabilen ovalarda yetişir"),
  subtype("agriculture", "tobacco", "Endüstri Bitkileri", "Tütün", "cigarette", "#8b7753", "Ekim alanı izin ve kalite denetimine bağlıdır"),
  subtype("agriculture", "sugar-beet", "Endüstri Bitkileri", "Şeker Pancarı", "sprout", "#b45a68", "İç kesimlerde şeker fabrikaları çevresinde yoğunlaşır"),
  subtype("agriculture", "cotton", "Endüstri Bitkileri", "Pamuk", "cotton", "#7d8fa0", "Tekstil ve yağ sanayisinin önemli ham maddesi"),
  subtype("agriculture", "poppy", "Endüstri Bitkileri", "Haşhaş", "flower", "#9a77a8", "İzinle yetiştirilen endüstri bitkisi"),
  subtype("agriculture", "hemp", "Endüstri Bitkileri", "Kenevir", "leaf", "#4c8960", "İzinle yetiştirilen lif ve endüstri bitkisi"),
  subtype("agriculture", "sunflower", "Yağ Bitkileri", "Ayçiçeği", "sun", "#d49a25", "Türkiye’nin başlıca yağ bitkisi"),
  subtype("agriculture", "olive", "Yağ Bitkileri", "Zeytin", "leaf", "#758548", "Akdeniz ikliminin önemli yağ ve sofralık ürünü"),
  subtype("agriculture", "soy", "Yağ Bitkileri", "Soya Fasulyesi", "bean", "#729a4e", "Yağ, yem ve biyodizelde kullanılan ürün"),
  subtype("agriculture", "peanut", "Yağ Bitkileri", "Yer Fıstığı", "nut", "#b77a46", "Sıcak iklim ve sulama isteyen yağ bitkisi"),
  subtype("agriculture", "sesame", "Yağ Bitkileri", "Susam", "circle", "#a98758", "Sıcak bölgelerde yetiştirilen yağ bitkisi"),
  subtype("agriculture", "canola", "Yağ Bitkileri", "Kanola", "flower", "#d3ad39", "Bitkisel yağ üretiminde kullanılan ürün"),
  subtype("agriculture", "hazelnut", "Meyveler", "Fındık", "nut", "#8d673e", "Karadeniz iklimine uyumlu önemli ihraç ürünü"),
  subtype("agriculture", "pistachio", "Meyveler", "Antep Fıstığı", "nut", "#7d9951", "Sıcak ve kurak yaz koşullarına uyumlu"),
  subtype("agriculture", "grape", "Meyveler", "Üzüm", "grape", "#7d609d", "Türkiye’de yaygın yetiştirilen bağ ürünü"),
  subtype("agriculture", "citrus", "Meyveler", "Turunçgiller", "citrus", "#d8822e", "Don olayına duyarlı sıcak iklim meyveleri"),
  subtype("agriculture", "apple", "Meyveler", "Elma", "apple", "#b7534d", "İç ve geçiş bölgelerinde yaygın meyve"),
  subtype("agriculture", "fig", "Meyveler", "İncir", "cherry", "#7b644f", "Özellikle Ege’de önemli ihraç ürünü"),
  subtype("agriculture", "apricot", "Meyveler", "Kayısı", "cherry", "#d68b3f", "Malatya çevresiyle özdeşleşen ihraç ürünü"),
  subtype("agriculture", "banana", "Meyveler", "Muz", "banana", "#c9a52c", "Akdeniz kıyılarındaki mikroklima ürünü"),
  subtype("agriculture", "kiwi", "Meyveler", "Kivi", "circle", "#658e47", "Nemli kıyı kuşağında yetişen meyve"),
  subtype("agriculture", "tea", "İçecek Bitkileri", "Çay", "coffee", "#3f8053", "Doğu Karadeniz’in bol yağış isteyen ürünü"),
  subtype("agriculture", "potato", "Yumru Bitkiler", "Patates", "potato", "#9b794d", "Serin koşullarda yaygın yetiştirilen yumru bitki"),
  subtype("agriculture", "tomato", "Sebzeler", "Domates", "tomato", "#c75345", "Açık tarla ve seralarda yaygın sebze"),

  subtype("mine", "boron", "Metalik Olmayan", "Bor", "gem", "#7c6ea6", "Türkiye’nin stratejik rezervleriyle öne çıkan madeni"),
  subtype("mine", "iron", "Metalik", "Demir", "anvil", "#6c7175", "Demir-çelik sanayisinin temel ham maddesi"),
  subtype("mine", "copper", "Metalik", "Bakır", "zap", "#b36e45", "Elektrik-elektronik sanayisinin önemli ham maddesi"),
  subtype("mine", "chromium", "Metalik", "Krom", "gem", "#66737b", "Çeliği sertleştirmede kullanılan ihraç madeni"),
  subtype("mine", "bauxite", "Metalik", "Boksit", "layers", "#a86445", "Alüminyumun ham maddesi"),
  subtype("mine", "manganese", "Metalik", "Manganez", "activity", "#5d6470", "Demir-çelik üretiminde kullanılan metalik maden"),
  subtype("mine", "mercury", "Metalik", "Cıva", "droplet", "#84949a", "Sıvı metal niteliğindeki maden"),
  subtype("mine", "lead-zinc", "Metalik", "Kurşun-Çinko", "battery", "#657282", "Metal ve akü sanayisinde kullanılan madenler"),
  subtype("mine", "tungsten", "Metalik", "Volfram", "drill", "#4e5661", "Yüksek sıcaklığa dayanıklı stratejik metal"),
  subtype("mine", "sulfur", "Metalik Olmayan", "Kükürt", "flame", "#c3a32f", "Kimya ve gübre sanayisinde kullanılan maden"),
  subtype("mine", "phosphate", "Metalik Olmayan", "Fosfat", "sprout", "#7e8550", "Gübre sanayisinin ham maddesi"),
  subtype("mine", "salt", "Metalik Olmayan", "Tuz", "shell", "#7e9ca1", "Gıda ve kimya sanayisinde kullanılan kaynak"),
  subtype("mine", "marble", "Taşlar", "Mermer", "landmark", "#8f8792", "Yapı ve süsleme taşı"),
  subtype("mine", "meerschaum", "Taşlar", "Lületaşı", "cloud", "#9b9182", "Eskişehir çevresiyle özdeşleşen süs taşı"),
  subtype("mine", "barite", "Metalik Olmayan", "Barit", "gem", "#687a8a", "Sondaj ve kimya sanayisinde kullanılan maden"),
  subtype("mine", "gold", "Metalik", "Altın", "gem", "#c5962f", "Kuyumculuk, elektronik ve değer saklama amacıyla kullanılan kıymetli metal"),
  subtype("mine", "silver", "Metalik", "Gümüş", "gem", "#8b969b", "Elektronik, kuyumculuk ve çeşitli sanayi kollarında kullanılan metal"),
  subtype("mine", "trona", "Metalik Olmayan", "Trona", "layers", "#7b9a9b", "Doğal soda külünün temel ham maddesi"),
  subtype("mine", "oltu-stone", "Taşlar", "Oltu Taşı", "gem", "#4c4a49", "Erzurum-Oltu ile özdeşleşen süs taşı"),

  subtype("energy", "hard-coal", "Fosil", "Taşkömürü", "factory", "#3f4548", "Zonguldak çevresinde çıkarılan yüksek kalorili kömür"),
  subtype("energy", "lignite", "Fosil", "Linyit", "factory", "#6a5545", "Türkiye’de yaygın bulunan düşük kalorili kömür"),
  subtype("energy", "petroleum", "Fosil", "Petrol", "fuel", "#3c4f4a", "Başlıca Güneydoğu Anadolu’da çıkarılan enerji kaynağı"),
  subtype("energy", "natural-gas", "Fosil", "Doğal Gaz", "flame", "#4f82a4", "Isınma ve elektrik üretiminde kullanılan kaynak"),
  subtype("energy", "hydroelectric", "Yenilenebilir", "Hidroelektrik", "waves", "#3f86ae", "Akarsu gücüne dayalı yenilenebilir enerji"),
  subtype("energy", "geothermal", "Yenilenebilir", "Jeotermal", "gauge", "#c45f47", "Yer içi ısısından yararlanan enerji"),
  subtype("energy", "wind", "Yenilenebilir", "Rüzgâr", "wind", "#6d99a2", "Rüzgâr gücüne dayalı yenilenebilir enerji"),
  subtype("energy", "solar", "Yenilenebilir", "Güneş", "sun", "#d49b27", "Güneşlenme potansiyeline dayalı enerji"),

  subtype("lake", "tectonic", "Oluşum", "Tektonik Göl", "activity", "#4e82a0", "Tektonik çukurlarda oluşan göl"),
  subtype("lake", "volcanic", "Oluşum", "Volkanik Göl", "volcano", "#7c688d", "Krater, kaldera veya maar içinde oluşan göl"),
  subtype("lake", "karstic", "Oluşum", "Karstik Göl", "circle", "#5e91a5", "Karstik çözünme çukurlarında oluşan göl"),
  subtype("lake", "glacial", "Oluşum", "Buzul Gölü", "snow", "#6fa2bd", "Buzul aşındırma çukurlarında oluşan göl"),
  subtype("lake", "set", "Oluşum", "Set Gölü", "layers", "#537f92", "Doğal bir setin gerisinde oluşan göl"),
  subtype("lake", "dam", "Yapay", "Baraj Gölü", "factory", "#467d9c", "Akarsu önüne yapılan barajla oluşan yapay göl"),
  subtype("lake", "tectonic-karstic", "Karma Oluşum", "Tektonik-Karstik Göl", "layers", "#568aa2", "Tektonik çanak ve karstik süreçlerin birlikte etkili olduğu göl"),
  subtype("lake", "tectonic-volcanic-set", "Karma Oluşum", "Tektonik-Volkanik Set Gölü", "volcano", "#657691", "Tektonik çanakta volkanik setin de etkili olduğu göl"),

  subtype("tourism", "historical", "Tür", "Tarihî Turizm", "castle", "#a06f3f", "Tarihî ve kültürel varlıklar"),
  subtype("tourism", "coastal", "Tür", "Kıyı Turizmi", "palm", "#418c9f", "Deniz, kum ve güneş turizmi"),
  subtype("tourism", "winter", "Tür", "Kış Turizmi", "snow", "#718ba7", "Kayak ve kış sporları merkezi"),
  subtype("tourism", "thermal", "Tür", "Termal Turizm", "droplet", "#b45f50", "Kaplıca ve sıcak su kaynakları"),
  subtype("tourism", "nature", "Tür", "Doğa Turizmi", "tree", "#4c845c", "Doğal alan ve ekoturizm"),

  subtype("city", "metropolis", "Yerleşme", "Büyükşehir", "building", "#4f6861", "Büyükşehir niteliğindeki yerleşme"),
  subtype("city", "district", "Yerleşme", "İlçe Merkezi", "house", "#65776f", "İlçe ölçeğindeki yerleşme"),
  subtype("city", "village", "Yerleşme", "Köy", "tent", "#71825e", "Kırsal yerleşme"),
  subtype("city", "port", "Ticaret", "Ticaret Limanı", "ship", "#397b92", "Deniz ticareti ve yük aktarım merkezi"),
  subtype("city", "border-gate", "Ticaret", "Sınır Kapısı", "signpost", "#a8743c", "Kara yolu dış ticaret geçiş noktası"),

  subtype("custom", "factory", "Sanayi", "Fabrika / Sanayi Tesisi", "factory", "#5b6f69", "Ham maddeyi işleyen üretim tesisi veya sanayi merkezi"),
];

export function getMarkerKind(kind: MarkerKind) {
  return (
    MARKER_KINDS.find((option) => option.id === kind) ??
    MARKER_KINDS[MARKER_KINDS.length - 1]
  );
}

export function getMarkerSubtypes(kind: MarkerKind) {
  return MARKER_SUBTYPES.filter((entry) => entry.parent === kind);
}

export function getMarkerVisual(
  marker: Pick<MapMarker, "kind" | "subtype" | "color">,
) {
  const detail = marker.subtype
    ? MARKER_SUBTYPES.find((option) => option.id === marker.subtype)
    : undefined;
  const kind = getMarkerKind(marker.kind);

  return detail
    ? {
        id: detail.id,
        label: detail.label,
        icon: detail.icon,
        color: marker.color || detail.color,
        parentLabel: kind.label,
        group: detail.group,
      }
    : {
        id: kind.id,
        label: kind.label,
        icon: kind.icon,
        color: marker.color || kind.color,
        parentLabel: kind.label,
        group: kind.label,
      };
}
