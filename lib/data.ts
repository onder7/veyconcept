import { Locale } from '@/lib/i18n/dictionary';

export type Localized = { tr: string; en: string };

export type Product = {
  id: string;
  name: string;
  tagline: Localized;
  category: 'Seating' | 'Tables' | 'Lighting' | 'Objects';
  price: number;
  designer: string;
  year: string;
  material: Localized;
  edition: Localized;
  description: Localized;
  imageOff: string;
  imageOn: string;
  hasLamp: boolean;
};

export type Project = {
  id: string;
  title: string;
  location: string;
  year: string;
  typology: Localized;
  image: string;
  span: 'tall' | 'wide' | 'large' | 'regular';
  description: Localized;
  gallery: string[];
  client: string;
  area: string;
  scope: Localized;
  status: Localized;
};

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Casa Lumen',
    location: 'Marakeş, MA',
    year: '2024',
    typology: { tr: 'Özel Konut', en: 'Private Residence' },
    image:
      'https://images.pexels.com/photos/34688219/pexels-photo-34688219.jpeg?auto=compress&cs=tinysrgb&w=1200',
    span: 'large',
    description: {
      tr: 'Marakeş medinasının kalbinde, geleneksel riad mimarisini çağdaş bir ışık jestiyle yeniden yorumlayan özel konut. Tadelakt duvarlar, elle oyma sedir kapılar ve gizli LED şeritler, iç avluyu gün batımında bir fener gibi aydınlatır.',
      en: 'A private residence in the heart of the Marrakech medina, reinterpreting traditional riad architecture with a contemporary gesture of light. Tadelakt walls, hand-carved cedar doors, and concealed LED strips turn the inner courtyard into a lantern at dusk.',
    },
    gallery: [
      'https://images.pexels.com/photos/33529500/pexels-photo-33529500.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/27543248/pexels-photo-27543248.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/34903881/pexels-photo-34903881.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Özel Müşteri',
    area: '420 m²',
    scope: { tr: 'Mimari, İç Mimari, Aydınlatma', en: 'Architecture, Interior, Lighting' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
  {
    id: 'p2',
    title: 'Daire Nº7',
    location: 'Paris, FR',
    year: '2023',
    typology: { tr: 'İç Mimari', en: 'Interior Architecture' },
    image:
      'https://images.pexels.com/photos/6970061/pexels-photo-6970061.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: 'tall',
    description: {
      tr: 'Haussmann binasının üst katında, osmanlı mimarisinin yüksek tavanlarını koruyarak minimal bir paletle yeniden düzenlenen daire. Tek duvar boyunca uzanan gizli aydınlatma şeridi, gün batımında salonu amber bir tonla yıkar.',
      en: 'A top-floor apartment in a Haussmann building, reorganized with a minimal palette while preserving the high ceilings of Ottoman architecture. A concealed lighting strip running along a single wall washes the salon in an amber tone at dusk.',
    },
    gallery: [
      'https://images.pexels.com/photos/28853362/pexels-photo-28853362.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/27604139/pexels-photo-27604139.png?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/13398027/pexels-photo-13398027.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Özel Müşteri',
    area: '180 m²',
    scope: { tr: 'İç Mimari, Aydınlatma', en: 'Interior, Lighting' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
  {
    id: 'p3',
    title: 'Villa Orbe',
    location: 'Mykonos, GR',
    year: '2024',
    typology: { tr: 'Misafirperverlik', en: 'Hospitality' },
    image:
      'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=1200',
    span: 'wide',
    description: {
      tr: 'Mykonos kayalıklarına yaslanan, Ege denizine bakan bir misafirperverlik villası. Beyaz beton, fırçalanmış pirinç ve doğal taş; akşam saatlerinde entegre aydınlatma ile sahile doğru bir ışık yolu oluşturur.',
      en: 'A hospitality villa perched on the Mykonos cliffs, facing the Aegean Sea. White concrete, brushed brass, and natural stone form a path of light toward the shore through integrated lighting in the evening hours.',
    },
    gallery: [
      'https://images.pexels.com/photos/27562217/pexels-photo-27562217.png?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7031722/pexels-photo-7031722.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/29012619/pexels-photo-29012619.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Orbe Hospitality Group',
    area: '650 m²',
    scope: { tr: 'Mimari, İç Mimari, Peyzaj, Aydınlatma', en: 'Architecture, Interior, Landscape, Lighting' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
  {
    id: 'p4',
    title: 'The Monolith Ofis',
    location: 'Milano, İT',
    year: '2022',
    typology: { tr: 'Çalışma Alanı', en: 'Workspace' },
    image:
      'https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: 'regular',
    description: {
      tr: 'Milano Brera bölgesinde, eski bir matbaa binasının içine kurulan monolitik ofis. Tek blok beton masası, duvardan duvara uzanan pirinç ızgara aydınlatma ve siyah meşe paneller ile çalışma alanı bir heykel gibi kurgulanmıştır.',
      en: 'A monolithic office set inside a former printing house in Milan Brera. A single-block concrete desk, wall-to-wall brass grid lighting, and black oak panels compose the workspace like a sculpture.',
    },
    gallery: [
      'https://images.pexels.com/photos/20418705/pexels-photo-20418705.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/38481078/pexels-photo-38481078.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/18420993/pexels-photo-18420993.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Studio Orbe',
    area: '320 m²',
    scope: { tr: 'İç Mimari, Mobilya, Aydınlatma', en: 'Interior, Furniture, Lighting' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
  {
    id: 'p5',
    title: 'Atelier Blanc',
    location: 'Lizbon, PT',
    year: '2023',
    typology: { tr: 'Showroom', en: 'Showroom' },
    image:
      'https://images.pexels.com/photos/12441654/pexels-photo-12441654.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: 'regular',
    description: {
      tr: 'Lizbon Chiado bölgesinde, beyaz beton ve buzlu cam ile tasarlanmış bir showroom. Her parça, içeriden aydınlatılan vitrinlerde sergilenir; ziyaretçi, bir müze rotasında gibi parçalar arasında dolaşır.',
      en: 'A showroom in Lisbon Chiado, designed with white concrete and frosted glass. Each piece is displayed in internally-lit vitrines; the visitor wanders among the pieces as if on a museum route.',
    },
    gallery: [
      'https://images.pexels.com/photos/19164602/pexels-photo-19164602.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/30711607/pexels-photo-30711607.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/16955371/pexels-photo-16955371.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Vey Concept',
    area: '240 m²',
    scope: { tr: 'İç Mimari, Aydınlatma, Kürasyon', en: 'Interior, Lighting, Curation' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
  {
    id: 'p6',
    title: 'Penthouse Noir',
    location: 'New York, US',
    year: '2024',
    typology: { tr: 'Özel Konut', en: 'Private Residence' },
    image:
      'https://images.pexels.com/photos/36353380/pexels-photo-36353380.png?auto=compress&cs=tinysrgb&w=900',
    span: 'tall',
    description: {
      tr: 'Tribeca çatı katında, siyah ceviz, dövme demir ve fümeli cam ile tasarlanmış bir penthouse. Şehre bakan cam cephe boyunca uzayan halo aydınlatma, akşam saatlerinde iç mekanı bir ışık kutusuna dönüştürür.',
      en: 'A penthouse in a Tribeca loft, designed with black walnut, forged iron, and smoked glass. Halo lighting extending along the glass facade facing the city transforms the interior into a light box in the evening hours.',
    },
    gallery: [
      'https://images.pexels.com/photos/33529500/pexels-photo-33529500.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/27543248/pexels-photo-27543248.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/34903881/pexels-photo-34903881.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    client: 'Özel Müşteri',
    area: '380 m²',
    scope: { tr: 'İç Mimari, Mobilya, Aydınlatma', en: 'Interior, Furniture, Lighting' },
    status: { tr: 'Tamamlandı', en: 'Completed' },
  },
];

export const products: Product[] = [
  {
    id: 'sofa-marshmallow',
    name: 'Marshmallow Sofa',
    tagline: {
      tr: 'Entegre ortam lambalı modüler oturma grubu',
      en: 'Modular seating with integrated ambient lamp',
    },
    category: 'Seating',
    price: 6800,
    designer: 'Studio Orbe',
    year: '2024',
    material: {
      tr: 'Bouclé yün, fırçalanmış pirinç, meşe taban',
      en: 'Bouclé wool, brushed brass, oak base',
    },
    edition: { tr: '12 adetlik edisyon', en: 'Edition of 12' },
    description: {
      tr: 'Fildişi bouclé ile sarılmış heykelsel modüler kanepe, sırtlık boyunca gizli sıcak LED şerit gömülü. Entegre lamba yumuşak bir amber ık yayarak kanepeyi gün batımında aydınlık bir objeye dönüştürür.',
      en: 'A sculptural modular sofa wrapped in ivory bouclé, with a concealed warm-LED strip embedded along the backrest. The integrated lamp casts a soft amber wash, turning the sofa into a luminous object at dusk.',
    },
    imageOff:
      'https://images.pexels.com/photos/4846087/pexels-photo-4846087.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/6186848/pexels-photo-6186848.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: true,
  },
  {
    id: 'sofa-curve',
    name: 'Curve Sofa',
    tagline: {
      tr: 'Halo aydınlatmalı heykelsel teal oturma grubu',
      en: 'Sculptural teal lounge with halo lighting',
    },
    category: 'Seating',
    price: 8400,
    designer: 'Léa Orbe',
    year: '2024',
    material: { tr: 'Kadife, paslanmaz çelik', en: 'Velvet, stainless steel' },
    edition: { tr: 'Siparişe özel', en: 'Made to order' },
    description: {
      tr: 'Halo sarkıt ile sabitlenmiş derin kadifeden sürekli bir eğri. Gömülü aydınlatma çevreyi samimi, galeri kalitesinde bir parıltıyla doldurur.',
      en: 'A continuous curve of deep velvet anchored by a halo pendant. The embedded lighting floods the surround with an intimate, gallery-grade glow.',
    },
    imageOff:
      'https://images.pexels.com/photos/5662652/pexels-photo-5662652.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/5662652/pexels-photo-5662652.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: true,
  },
  {
    id: 'table-pretzel',
    name: 'Pretzel Table',
    tagline: {
      tr: 'Bükümlü masif meşeden heykelsel sehpa',
      en: 'Twisted solid-oak sculptural coffee table',
    },
    category: 'Tables',
    price: 3200,
    designer: 'Studio Orbe',
    year: '2023',
    material: { tr: 'Fümeli meşe, el ile bitirilmiş', en: 'Fumed oak, hand-finished' },
    edition: { tr: '24 adetlik edisyon', en: 'Edition of 24' },
    description: {
      tr: 'Pretzel siluetli bükümlü masif meşe sehpa. Damı derinleştiren doğal yağ ile elle bitirilmiş. Koleksiyonluk bir merkez parçası.',
      en: 'A looping solid-oak coffee table with a pretzel silhouette. Hand-finished with a natural oil that deepens the grain. A collectible centerpiece.',
    },
    imageOff:
      'https://images.pexels.com/photos/7607460/pexels-photo-7607460.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/7607460/pexels-photo-7607460.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: false,
  },
  {
    id: 'armchair-bordeaux',
    name: 'Bordeaux Armchair',
    tagline: {
      tr: 'Düğmeli deri, okuma lambalı',
      en: 'Button-tufted leather with reading lamp',
    },
    category: 'Seating',
    price: 4600,
    designer: 'Léa Orbe',
    year: '2023',
    material: { tr: 'Tam tahıllı deri, pirinç', en: 'Full-grain leather, brass' },
    edition: { tr: '30 adetlik edisyon', en: 'Edition of 30' },
    description: {
      tr: 'Konyak deride klasik düğmeli koltuk, tabandan uzanan eklemli pirinç okuma lambasıyla.',
      en: 'A classic button-tufted armchair in cognac leather with an articulated brass reading lamp extending from the base.',
    },
    imageOff:
      'https://images.pexels.com/photos/14110168/pexels-photo-14110168.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/14110168/pexels-photo-14110168.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: true,
  },
  {
    id: 'vase-frost',
    name: 'Frost Vase',
    tagline: {
      tr: 'Elle üflenmiş buzlu cam kap',
      en: 'Hand-blown frosted glass vessel',
    },
    category: 'Objects',
    price: 420,
    designer: 'Studio Orbe',
    year: '2024',
    material: { tr: 'Elle üflenmiş buzlu cam', en: 'Hand-blown frosted glass' },
    edition: { tr: 'Açık edisyon', en: 'Open edition' },
    description: {
      tr: 'Sabah kırağısı gibi ışığı yakalayan minimal buzlu cam vazo. Her parça ağızdan üflenmiş ve eşsizdir.',
      en: 'A minimalist frosted glass vase that catches light like morning frost. Each piece is mouth-blown and unique.',
    },
    imageOff:
      'https://images.pexels.com/photos/37440415/pexels-photo-37440415.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/37440415/pexels-photo-37440415.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: false,
  },
  {
    id: 'vase-triad',
    name: 'Triad Vases',
    tagline: {
      tr: 'Üç renkli cam kap seti',
      en: 'Set of three tinted glass vessels',
    },
    category: 'Objects',
    price: 680,
    designer: 'Studio Orbe',
    year: '2023',
    material: { tr: 'Renkli borosilikat cam', en: 'Tinted borosilicate glass' },
    edition: { tr: '50 adetlik edisyon', en: 'Edition of 50' },
    description: {
      tr: 'Yakut, amber ve umbradan üç uzun kap. Heykelsel bir doğaçlama olarak gruplanmak üzere tasarlandı.',
      en: 'A trio of tall vessels in ruby, amber, and umber. Designed to be grouped as a sculptural still life.',
    },
    imageOff:
      'https://images.pexels.com/photos/36124521/pexels-photo-36124521.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageOn:
      'https://images.pexels.com/photos/36124521/pexels-photo-36124521.jpeg?auto=compress&cs=tinysrgb&w=900',
    hasLamp: false,
  },
];

/** Get a localized string from a Localized field */
export function L(field: Localized, locale: Locale): string {
  return field[locale];
}
