export type Locale = 'tr' | 'en';

export const locales: Locale[] = ['tr', 'en'];
export const defaultLocale: Locale = 'tr';

export const dictionary = {
  // Navigation
  nav: {
    projects: { tr: 'Projeler', en: 'Projects' },
    shop: { tr: 'Mağaza', en: 'Shop' },
    atelier: { tr: 'Atölye', en: 'Atelier' },
    journal: { tr: 'Günce', en: 'Journal' },
    contact: { tr: 'İletişim', en: 'Contact' },
    enquire: { tr: 'Soru Sor', en: 'Enquire' },
    account: { tr: 'Hesap', en: 'Account' },
    login: { tr: 'Giriş Yap', en: 'Sign In' },
    register: { tr: 'Kayıt Ol', en: 'Register' },
    profile: { tr: 'Profil', en: 'Profile' },
    orders: { tr: 'Siparişler', en: 'Orders' },
    settings: { tr: 'Ayarlar', en: 'Settings' },
    logout: { tr: 'Çıkış', en: 'Log out' },
  },

  // Marquee
  marquee: {
    architecture: { tr: 'Mimari', en: 'Architecture' },
    bespoke: { tr: 'Özel Mobilya', en: 'Bespoke Furniture' },
    lighting: { tr: 'Entegre Aydınlatma', en: 'Integrated Lighting' },
    collectible: { tr: 'Koleksiyon Tasarım', en: 'Collectible Design' },
    sculptural: { tr: 'Heykelsel İç Mekanlar', en: 'Sculptural Interiors' },
    madetoorder: { tr: 'Siparişe Özel', en: 'Made to Order' },
  },

  // Hero
  hero: {
    eyebrow: {
      tr: 'Mimari · Özel Mobilya · Koleksiyon Tasarım',
      en: 'Architecture · Bespoke Furniture · Collectible Design',
    },
    title1: { tr: 'Işığı', en: 'Rooms that' },
    title2: { tr: 'tutan odalar.', en: 'hold the light.' },
    body: {
      tr: 'Vey Concept, heykelsel iç mekânlar ve aydınlatmalı objeler tasarlayan bir atölyedir — mimarinin, özenle tasarlanmış tek bir lambanın sıcak ışığıyla buluştuğı yer.',
      en: 'Vey Concept is an atelier shaping sculptural interiors and illuminated objects — where architecture meets the warm hum of a single, considered lamp.',
    },
    cta1: { tr: 'Projeleri Gör', en: 'View Projects' },
    cta2: { tr: 'Mağazayı Keşfet', en: 'Explore the Shop' },
    scroll: { tr: 'Kaydır', en: 'Scroll' },
    slides: [
      {
        eyebrow: { tr: 'Marakeş · 2024', en: 'Marrakech · 2024' },
        title: { tr: 'Casa Lumen', en: 'Casa Lumen' },
        body: {
          tr: 'Medina içinde, ışıkla yeniden yazılan bir riad.',
          en: 'A riad rewritten by light, inside the medina.',
        },
      },
      {
        eyebrow: { tr: 'Paris · 2023', en: 'Paris · 2023' },
        title: { tr: 'Daire Nº7', en: 'Apartment Nº7' },
        body: {
          tr: 'Haussmann tavanları, amber bir ışık şeridi.',
          en: 'Haussmann ceilings, a ribbon of amber light.',
        },
      },
      {
        eyebrow: { tr: 'Mykonos · 2024', en: 'Mykonos · 2024' },
        title: { tr: 'Villa Orbe', en: 'Villa Orbe' },
        body: {
          tr: 'Ege kayalıklarında, sahile inen bir ışık yolu.',
          en: 'A path of light descending to the Aegean shore.',
        },
      },
      {
        eyebrow: { tr: 'Milano · 2022', en: 'Milan · 2022' },
        title: { tr: 'The Monolith', en: 'The Monolith' },
        body: {
          tr: 'Eski matbaada, heykele dönüşen bir ofis.',
          en: 'A former printing house, turned into sculpture.',
        },
      },
    ],
  },

  // Projects
  projects: {
    eyebrow: { tr: 'Seçili İşler · 2022—2024', en: 'Selected Work · 2022—2024' },
    title: { tr: 'Portföy.', en: 'The Portfolio.' },
    body: {
      tr: 'On yıllık iç mekan, konut ve misafirperverlik alanları — her biri tek bir ışık jesti etrafında kurgulanmış.',
      en: 'A decade of interiors, residences, and hospitality spaces — each composed around a single gesture of light.',
    },
    selectHint: { tr: 'Bir projeyi seçin', en: 'Select a project' },
    viewProject: { tr: 'Projeyi Gör', en: 'View Project' },
  },

  // Project detail page
  projectDetail: {
    back: { tr: 'Tüm Projeler', en: 'All Projects' },
    overview: { tr: 'Genel Bakış', en: 'Overview' },
    details: { tr: 'Detaylar', en: 'Details' },
    client: { tr: 'Müşteri', en: 'Client' },
    area: { tr: 'Alan', en: 'Area' },
    scope: { tr: 'Kapsam', en: 'Scope' },
    status: { tr: 'Durum', en: 'Status' },
    location: { tr: 'Konum', en: 'Location' },
    year: { tr: 'Yıl', en: 'Year' },
    typology: { tr: 'Tipoloji', en: 'Typology' },
    gallery: { tr: 'Galeri', en: 'Gallery' },
    nextProject: { tr: 'Sonraki Proje', en: 'Next Project' },
    notFound: { tr: 'Proje bulunamadı.', en: 'Project not found.' },
  },

  // Shop
  shop: {
    eyebrow: { tr: 'Mağaza · Koleksiyon Parçalar', en: 'The Shop · Collectible Pieces' },
    title1: { tr: 'Objeler &', en: 'Objects &' },
    title2: { tr: 'Mobilya.', en: 'Furniture.' },
    body: {
      tr: 'Özel koltuklar, heykelsel masalar ve elle üflenmiş kaplar. Seçili parçalar entegre ortam aydınlatmasına sahiptir — ışığı açarak parçayı gün batımında önizleyin.',
      en: 'Bespoke sofas, sculptural tables, and hand-blown vessels. Select pieces feature integrated ambient lighting — toggle the light to preview them at dusk.',
    },
    all: { tr: 'Tümü', en: 'All' },
    seating: { tr: 'Oturma', en: 'Seating' },
    tables: { tr: 'Masalar', en: 'Tables' },
    objects: { tr: 'Objeler', en: 'Objects' },
    viewDetail: { tr: 'Detay', en: 'View Detail' },
    smartLamp: { tr: 'Akıllı Lamba', en: 'Smart Lamp' },
  },

  // Product detail
  detail: {
    integrated: { tr: 'Entegre Aydınlatma', en: 'Integrated Lighting' },
    designer: { tr: 'Tasarımcı', en: 'Designer' },
    material: { tr: 'Malzeme', en: 'Material' },
    edition: { tr: 'Edisyon', en: 'Edition' },
    freeShip: { tr: 'Dünya çapında ücretsiz kargo', en: 'Free global shipping' },
    addToBag: { tr: 'Sepete Ekle', en: 'Add to bag' },
    added: { tr: 'Eklendi', en: 'Added to bag' },
    lightHint: {
      tr: 'Entegre ortam lambasını önizlemek için ışık kontrolüne dokunun.',
      en: 'Tap the light control to preview the integrated ambient lamp.',
    },
  },

  // Smart lamp
  lamp: {
    on: { tr: 'Işık Açık', en: 'Light On' },
    off: { tr: 'Işığı Aç', en: 'Turn on Light' },
    onLabel: { tr: 'Ortam ışığını kapat', en: 'Turn off ambient light' },
    offLabel: { tr: 'Ortam ışığını aç', en: 'Turn on ambient light' },
  },

  // Atelier
  atelier: {
    eyebrow: { tr: 'Atölye', en: 'The Atelier' },
    title1: { tr: 'Açılan', en: 'Furniture that' },
    title2: { tr: 'mobilya.', en: 'turns on.' },
    body: {
      tr: 'Mimari gibi davranan objeler tasarlıyoruz — katmanlar halinde kurgulanmış, elle bitirilmiş ve içeriden aydınlatılmış. Akıllı Lamba serimiz imzamızdır: ışığa dönüşen mobilya.',
      en: 'We design objects that behave like architecture — composed in layers, finished by hand, and lit from within. The Smart Lamp series is our signature: furniture that becomes light.',
    },
    hint: {
      tr: 'Mağazadaki herhangi bir Akıllı Lamba parçasındaki ışık düğmesine basarak ortam parıltısını önizleyin.',
      en: 'Try the light toggle on any Smart Lamp piece in the shop to preview the ambient glow.',
    },
    p1Title: { tr: 'Entegre Aydınlatma', en: 'Integrated Lighting' },
    p1Body: {
      tr: 'Her Akıllı Lamba objesi sıcak bir LED çekirdeği gizler. Tek dokunuş parçayı objeden ortam ışığı kaynağına dönüştürür — düğme yok, görünür kablo yok.',
      en: 'Every Smart Lamp object hides a warm LED core. One tap transitions the piece from object to ambient light source — no switches, no cords on show.',
    },
    p2Title: { tr: 'Katmanlı Görseller', en: 'Layered Renders' },
    p2Body: {
      tr: 'Her aydınlatmalı parça iki durumda fotoğraflanır. Kapalı ve aydınlatılmış haller arasında geçiş yaparak odanızda nasıl parlayacağını tam olarak görürsünüz.',
      en: 'Each illuminated piece is photographed in two states. We crossfade between the off and lit renders so you see exactly how it glows in your room.',
    },
    p3Title: { tr: 'Atölye Yapımı', en: 'Atelier Made' },
    p3Body: {
      tr: 'Sınırlı edisyonlar ve siparişe özel üretimler, atölyemizde elle bitirilir. Numaralandırılır, imzalanır ve nesiller boyu kullanılmak üzere üretilir.',
      en: 'Limited editions and made-to-order runs, hand-finished in our workshop. Numbered, signed, and built to be inherited.',
    },
  },

  // Journal / newsletter
  journal: {
    eyebrow: { tr: 'Günce', en: 'The Journal' },
    title1: { tr: 'Yeni ürünler, stüdyo notları,', en: 'New drops, studio notes,' },
    title2: { tr: 've ara sıra bir krokiler.', en: 'and the occasional blueprint.' },
    body: {
      tr: 'Yılda birkaç kez gönderilen sessiz bir mektup. Gürültü yok — sadece bir sonraki koleksiyon ve arkasındaki düşünce.',
      en: 'A quiet letter, a few times a year. No noise — just the next collection and the thinking behind it.',
    },
    placeholder: { tr: 'email@adresiniz.com', en: 'your@email.com' },
    subscribe: { tr: 'Abone Ol', en: 'Subscribe' },
    success: {
      tr: 'Atölyeye hoş geldiniz. Gelen kutunuzu kontrol edin.',
      en: 'Welcome to the atelier. Check your inbox.',
    },
  },

  // Cart
  cart: {
    title: { tr: 'Sepet', en: 'Cart' },
    empty: { tr: 'Sepetiniz boş', en: 'Your cart is empty' },
    emptyBody: {
      tr: 'Mağazadan bir parça seçerek başlayın.',
      en: 'Start by selecting a piece from the shop.',
    },
    subtotal: { tr: 'Ara Toplam', en: 'Subtotal' },
    checkout: { tr: 'Ödemeye Geç', en: 'Checkout' },
    continue: { tr: 'Alışverişe Devam', en: 'Continue Shopping' },
    remove: { tr: 'Kaldır', en: 'Remove' },
    each: { tr: 'adet', en: 'each' },
    freeShip: { tr: 'Ücretsiz kargo', en: 'Free shipping' },
  },

  // Footer
  footer: {
    desc: {
      tr: 'Mimari ve özel mobilya atölyesi. Paris, Milano ve Marakeş\'te randevu ile stüdyo ziyareti.',
      en: 'An atelier of architecture and bespoke furniture. Studio visits by appointment in Paris, Milan, and Marrakech.',
    },
    explore: { tr: 'Keşfet', en: 'Explore' },
    connect: { tr: 'Bağlan', en: 'Connect' },
    rights: { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },
    privacy: { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
    terms: { tr: 'Mesafeli Satış', en: 'Terms of Sale' },
    shipping: { tr: 'Kargo', en: 'Shipping' },
    returns: { tr: 'İadeler & Değişimler', en: 'Returns & Exchanges' },
    faq: { tr: 'SSS', en: 'FAQ' },
    about: { tr: 'Hakkımızda', en: 'About' },
    contact: { tr: 'İletişim', en: 'Contact' },
    trade: { tr: 'Ticari Program', en: 'Trade Program' },
    press: { tr: 'Basın Kiti', en: 'Press Kit' },
  },

  // Auth page
  auth: {
    signInTitle: { tr: 'Giriş Yap', en: 'Sign In' },
    signUpTitle: { tr: 'Hesap Oluştur', en: 'Create Account' },
    email: { tr: 'E-posta', en: 'Email' },
    password: { tr: 'Şifre', en: 'Password' },
    name: { tr: 'Ad Soyad', en: 'Full Name' },
    signInBtn: { tr: 'Giriş Yap', en: 'Sign In' },
    signUpBtn: { tr: 'Kayıt Ol', en: 'Sign Up' },
    noAccount: { tr: 'Hesabınız yok mu?', en: "Don't have an account?" },
    haveAccount: { tr: 'Zaten hesabınız var mı?', en: 'Already have an account?' },
    createOne: { tr: 'Hesap oluştur', en: 'Create one' },
    signInHere: { tr: 'Giriş yapın', en: 'Sign in' },
    backHome: { tr: 'Ana sayfaya dön', en: 'Back to home' },
    welcome: { tr: 'Atölyeye tekrar hoş geldiniz.', en: 'Welcome back to the atelier.' },
    welcomeNew: { tr: 'Atölyeye katılın. Hesabınızı oluşturun.', en: 'Join the atelier. Create your account.' },
    errorEmpty: { tr: 'Lütfen tüm alanları doldurun.', en: 'Please fill in all fields.' },
    errorSignin: { tr: 'E-posta veya şifre hatalı.', en: 'Invalid email or password.' },
    errorExists: { tr: 'Bu e-posta zaten kayıtlı.', en: 'This email is already registered.' },
    errorGeneric: { tr: 'Bir şeyler ters gitti. Tekrar deneyin.', en: 'Something went wrong. Please try again.' },
    or: { tr: 'veya', en: 'or' },
  },

  // Profile page
  profile: {
    title: { tr: 'Profilim', en: 'My Profile' },
    member: { tr: 'Üye', en: 'Member' },
    since: { tr: 'Üyelik', en: 'Member since' },
    email: { tr: 'E-posta', en: 'Email' },
    name: { tr: 'Ad', en: 'Name' },
    address: { tr: 'Adres', en: 'Address' },
    city: { tr: 'Şehir', en: 'City' },
    country: { tr: 'Ülke', en: 'Country' },
    save: { tr: 'Kaydet', en: 'Save Changes' },
    saved: { tr: 'Kaydedildi', en: 'Saved' },
    quickLinks: { tr: 'Hızlı Erişim', en: 'Quick Links' },
    myOrders: { tr: 'Siparişlerim', en: 'My Orders' },
    myCart: { tr: 'Sepetim', en: 'My Cart' },
    signOut: { tr: 'Çıkış Yap', en: 'Sign Out' },
    notSignedIn: { tr: 'Giriş yapmadınız.', en: 'You are not signed in.' },
    signInPrompt: { tr: 'Bu sayfayı görmek için giriş yapın.', en: 'Sign in to view this page.' },
  },

  // Cart page
  cartPage: {
    title: { tr: 'Sepetim', en: 'Shopping Cart' },
    product: { tr: 'Ürün', en: 'Product' },
    price: { tr: 'Fiyat', en: 'Price' },
    qty: { tr: 'Adet', en: 'Quantity' },
    total: { tr: 'Toplam', en: 'Total' },
    empty: { tr: 'Sepetiniz boş.', en: 'Your cart is empty.' },
    emptyBody: { tr: 'Mağazadan bir parça seçerek başlayın.', en: 'Start by selecting a piece from the shop.' },
    goShop: { tr: 'Mağazaya Git', en: 'Go to Shop' },
    subtotal: { tr: 'Ara Toplam', en: 'Subtotal' },
    shipping: { tr: 'Kargo', en: 'Shipping' },
    free: { tr: 'Ücretsiz', en: 'Free' },
    grandTotal: { tr: 'Genel Toplam', en: 'Grand Total' },
    checkout: { tr: 'Ödemeye Geç', en: 'Proceed to Checkout' },
    continueShopping: { tr: 'Alışverişe Devam Et', en: 'Continue Shopping' },
  },

  // Checkout page
  checkout: {
    title: { tr: 'Ödeme', en: 'Checkout' },
    shipping: { tr: 'Teslimat Bilgileri', en: 'Shipping Details' },
    fullName: { tr: 'Ad Soyad', en: 'Full Name' },
    email: { tr: 'E-posta', en: 'Email' },
    address: { tr: 'Adres', en: 'Address' },
    city: { tr: 'Şehir', en: 'City' },
    country: { tr: 'Ülke', en: 'Country' },
    postal: { tr: 'Posta Kodu', en: 'Postal Code' },
    notes: { tr: 'Sipariş Notları (isteğe bağlı)', en: 'Order Notes (optional)' },
    notesPlaceholder: { tr: 'Teslimat için ek talimatlar...', en: 'Additional delivery instructions...' },
    orderSummary: { tr: 'Sipariş Özeti', en: 'Order Summary' },
    subtotal: { tr: 'Ara Toplam', en: 'Subtotal' },
    shippingCost: { tr: 'Kargo', en: 'Shipping' },
    free: { tr: 'Ücretsiz', en: 'Free' },
    total: { tr: 'Toplam', en: 'Total' },
    placeOrder: { tr: 'Siparişi Tamamla', en: 'Place Order' },
    placing: { tr: 'İşleniyor...', en: 'Processing...' },
    empty: { tr: 'Sepetiniz boş. Ödeme yapmadan önce ürün ekleyin.', en: 'Your cart is empty. Add items before checking out.' },
    success: { tr: 'Siparişiniz alındı!', en: 'Order placed!' },
    successBody: { tr: 'Sipariş numaranız:', en: 'Your order number:' },
    viewOrders: { tr: 'Siparişlerimi Gör', en: 'View My Orders' },
    mustLogin: { tr: 'Ödemeye geçmek için giriş yapmalısınız.', en: 'You must sign in to checkout.' },
    errorGeneric: { tr: 'Sipariş oluşturulurken bir hata oluştu.', en: 'An error occurred while placing your order.' },
  },

  // Orders page
  orders: {
    title: { tr: 'Siparişlerim', en: 'My Orders' },
    empty: { tr: 'Henüz siparişiniz yok.', en: 'No orders yet.' },
    emptyBody: { tr: 'Mağazadan ilk siparişinizi verin.', en: 'Place your first order from the shop.' },
    goShop: { tr: 'Mağazaya Git', en: 'Go to Shop' },
    orderNo: { tr: 'Sipariş', en: 'Order' },
    date: { tr: 'Tarih', en: 'Date' },
    status: { tr: 'Durum', en: 'Status' },
    total: { tr: 'Toplam', en: 'Total' },
    items: { tr: 'Ürünler', en: 'Items' },
    viewDetails: { tr: 'Detayları Gör', en: 'View Details' },
    hideDetails: { tr: 'Gizle', en: 'Hide' },
    statuses: {
      pending: { tr: 'Beklemede', en: 'Pending' },
      paid: { tr: 'Ödendi', en: 'Paid' },
      shipped: { tr: 'Gönderildi', en: 'Shipped' },
      delivered: { tr: 'Teslim Edildi', en: 'Delivered' },
      cancelled: { tr: 'İptal', en: 'Cancelled' },
    },
  },

  // FAQ page
  faq: {
    title: { tr: 'Sıkça Sorulan Sorular', en: 'Frequently Asked Questions' },
    subtitle: { tr: 'Aradığınızı bulamadıysanız bizimle iletişime geçin.', en: "Can't find what you're looking for? Contact us." },
    contactUs: { tr: 'Bize Ulaşın', en: 'Contact Us' },
    items: {
      q1: { tr: 'Ürünler ne kadar sürede teslim edilir?', en: 'How long does delivery take?' },
      a1: { tr: 'Stokta bulunan ürünler 5-7 iş günü içinde kargoya verilir. Siparişe özel üretimler 4-8 hafta sürebilir. Her sipariş için takip numarası gönderilir.', en: 'In-stock items ship within 5-7 business days. Made-to-order pieces take 4-8 weeks. A tracking number is provided for every order.' },
      q2: { tr: 'Uluslararası teslimat yapıyor musunuz?', en: 'Do you ship internationally?' },
      a2: { tr: 'Evet, dünya çapına kargo yapıyoruz. Tüm siparişlerde uluslararası kargo ücretsizdir. Gümrük ve vergiler alıcıya aittir.', en: 'Yes, we ship worldwide. International shipping is free on all orders. Customs duties and taxes are the recipient\'s responsibility.' },
      q3: { tr: 'Akıllı Lamba özelliği nasıl çalışır?', en: 'How does the Smart Lamp feature work?' },
      a3: { tr: 'Akıllı Lamba serisindeki ürünlerde entegre LED aydınlatma bulunur. Ürün detay sayfasındaki ışık düğmesine basarak parçanın aydınlatılmış halini önizleyebilirsiniz. Gerçek ürün, gömülü sıcak LED ile birlikte gelir.', en: 'Smart Lamp pieces feature integrated LED lighting. Toggle the light control on the product detail page to preview the illuminated state. The actual piece comes with an embedded warm LED.' },
      q4: { tr: 'Sınırlı edisyon ürünler numaralandırılmış mı?', en: 'Are limited edition pieces numbered?' },
      a4: { tr: 'Evet, tüm sınırlı edisyon ürünler numaralandırılır ve tasarımcı tarafından imzalanır. Her parçayla birlikte orijinallik sertifikası gönderilir.', en: 'Yes, all limited edition pieces are numbered and signed by the designer. A certificate of authenticity accompanies each piece.' },
      q5: { tr: 'Ticari programınıza nasıl katılabilirim?', en: 'How can I join your trade program?' },
      a5: { tr: 'Ticari programımız iç mimarlar, tasarımcılar ve galeriler içindir. İletişim sayfasından bizimle iletişime geçin; ekibimiz 48 saat içinde dönecektir.', en: 'Our trade program is for interior designers, architects, and galleries. Contact us through the contact page and our team will respond within 48 hours.' },
      q6: { tr: 'Ürünleri geri dönüştürebiliyor musunuz?', en: 'Can products be returned?' },
      a6: { tr: 'Stokta bulunan ürünler 14 gün içinde iade edilebilir. Siparişe özel üretimler iade edilmez. Detaylar için İadeler & Değişimler sayfasına bakın.', en: 'In-stock items can be returned within 14 days. Made-to-order pieces are non-returnable. See our Returns & Exchanges page for details.' },
    },
  },

  // Shipping page
  shippingPage: {
    title: { tr: 'Kargo & Teslimat', en: 'Shipping & Delivery' },
    subtitle: { tr: 'Siparişiniz dünyanın neresinde olursa olsun özenle hazırlanır ve gönderilir.', en: 'Your order is carefully prepared and shipped anywhere in the world.' },
    s1Title: { tr: 'Hazırlık Süresi', en: 'Processing Time' },
    s1Body: { tr: 'Stokta bulunan ürünler 5-7 iş günü içinde kargoya verilir. Siparişe özel üretimler 4-8 hafta sürebilir. Her ürün atölyemizde elle paketlenir.', en: 'In-stock items ship within 5-7 business days. Made-to-order pieces take 4-8 weeks. Each piece is hand-packaged in our atelier.' },
    s2Title: { tr: 'Kargo Ücretleri', en: 'Shipping Costs' },
    s2Body: { tr: 'Tüm siparişlerde dünya çapında ücretsiz kargo. Kargo, sigortalı ve takip edilebilir şekilde gönderilir.', en: 'Free worldwide shipping on all orders. Shipments are insured and trackable.' },
    s3Title: { tr: 'Gümrük ve Vergiler', en: 'Customs & Duties' },
    s3Body: { tr: 'Uluslararası siparişlerde gümrük vergileri ve ithalat vergileri alıcıya aittir. Bu ücretler teslimat anında tahsil edilir ve sipariş tutarına dahil değildir.', en: 'For international orders, customs duties and import taxes are the recipient\'s responsibility. These are collected at delivery and are not included in the order total.' },
    s4Title: { tr: 'Takip', en: 'Tracking' },
    s4Body: { tr: 'Siparişiniz kargoya verildiğinde e-posta ile takip numarası gönderilir. Siparişlerim sayfasından da takip edebilirsiniz.', en: 'A tracking number is emailed when your order ships. You can also track from the My Orders page.' },
  },

  // Returns page
  returnsPage: {
    title: { tr: 'İadeler & Değişimler', en: 'Returns & Exchanges' },
    subtitle: { tr: 'Memnuniyetiniz bizim için önemlidir. İşte iade ve değiim politikamız.', en: 'Your satisfaction matters. Here is our return and exchange policy.' },
    s1Title: { tr: '14 Gün İade Hakkı', en: '14-Day Return Policy' },
    s1Body: { tr: 'Stokta bulunan ürünleri teslim tarihinden itibaren 14 gün içinde orijinal durumda iade edebilirsiniz. Ürün kullanılmamış ve orijinal paketinde olmalıdır.', en: 'In-stock items can be returned within 14 days of delivery in original condition. Items must be unused and in original packaging.' },
    s2Title: { tr: 'Siparişe Özel Ürünler', en: 'Made-to-Order Items' },
    s2Body: { tr: 'Siparişe özel üretilen ürünler iade edilmez. Her parça sizin için özel olarak üretildiği için değişim veya iade yapılamaz.', en: 'Made-to-order items are non-returnable. Each piece is crafted specifically for you and cannot be exchanged or returned.' },
    s3Title: { tr: 'Hasarlı Ürünler', en: 'Damaged Items' },
    s3Body: { tr: 'Ürünüz hasarlı gelirse, teslimattan sonra 48 saat içinde bizimle iletişime geçin. Ücretsiz değiştirme veya iade sağlarız.', en: 'If your item arrives damaged, contact us within 48 hours of delivery. We provide a free replacement or refund.' },
    s4Title: { tr: 'İade Süreci', en: 'Return Process' },
    s4Body: { tr: 'İade için iletişim sayfasından bize ulaşın. İade onayı alındıktan sonra iade adresini ve talimatları göndeririz. İade kargo ücreti alıcıya aittir.', en: 'Contact us via the contact page to initiate a return. Once approved, we send the return address and instructions. Return shipping costs are the buyer\'s responsibility.' },
  },

  // Privacy page
  privacyPage: {
    title: { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
    subtitle: { tr: 'Son güncelleme: Ağustos 2026', en: 'Last updated: August 2026' },
    s1Title: { tr: 'Topladığımız Bilgiler', en: 'Information We Collect' },
    s1Body: { tr: 'Adınız, e-posta adresiniz, teslimat adresiniz ve sipariş bilgileriniz. Ödeme işlemleri güvenli ödeme sağlayıcılarımız tarafından işlenir; kart bilgileriniz bizde saklanmaz.', en: 'Your name, email, shipping address, and order information. Payments are processed by our secure payment providers; we do not store card details.' },
    s2Title: { tr: 'Bilgilerin Kullanımı', en: 'How We Use Information' },
    s2Body: { tr: 'Bilgileriniz siparişleri işlemek, teslimat yapmak, sipariş güncellemeleri göndermek ve müşteri hizmetleri sağlamak için kullanılır. Bülten aboneliği için açık onayınız alınır.', en: 'Your information is used to process orders, make deliveries, send order updates, and provide customer service. Newsletter subscription requires your explicit consent.' },
    s3Title: { tr: 'Bilgi Paylaşımı', en: 'Information Sharing' },
    s3Body: { tr: 'Bilgilerinizi üçüncü taraflara satmıyoruz. Siparişlerin teslimatı için kargo şirketleri ve ödeme işleme için ödeme sağlayıcıları ile gerekli bilgileri paylaşırız.', en: 'We do not sell your information to third parties. We share necessary information with shipping carriers for delivery and payment providers for processing.' },
    s4Title: { tr: 'Veri Güvenliği', en: 'Data Security' },
    s4Body: { tr: 'Verileriniz şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır. KVKK ve GDPR uyumludur.', en: 'Your data is transmitted over encrypted connections and stored on secure servers. We comply with KVKK and GDPR.' },
    s5Title: { tr: 'Haklarınız', en: 'Your Rights' },
    s5Body: { tr: 'Verilerinize erişme, düzeltme, silme ve işleme itiraz etme hakkına sahipsiniz. Bu hakları kullanmak için bizimle iletişime geçin.', en: 'You have the right to access, correct, delete, and object to the processing of your data. Contact us to exercise these rights.' },
  },

  // Terms (Mesafeli Satış) page
  termsPage: {
    title: { tr: 'Mesafeli Satış Sözleşmesi', en: 'Distance Sales Agreement' },
    subtitle: { tr: 'Son güncelleme: Ağustos 2026', en: 'Last updated: August 2026' },
    s1Title: { tr: '1. Taraflar', en: '1. Parties' },
    s1Body: { tr: 'Bu sözleşme Vey Concept (Satıcı) ile web sitemizden alışveriş yapan alıcı (Alıcı) arasında akdedilir. Satıcı, www.veyconcept.com domain adresi üzerinden e-ticaret hizmeti verir.', en: 'This agreement is made between Vey Concept (Seller) and the purchaser (Buyer) shopping on our website. The Seller provides e-commerce services via www.veyconcept.com.' },
    s2Title: { tr: '2. Sipariş ve Onay', en: '2. Order and Confirmation' },
    s2Body: { tr: 'Alıcı, web sitesi üzerinden seçtiği ürünleri sepete ekleyip ödeme adımını tamamladığında sipariş oluşturulur. Satıcı, siparişi e-posta ile onaylar. Onay e-postası gönderilene kadar sipariş kesinleşmez.', en: 'An order is created when the Buyer adds products to the cart and completes checkout. The Seller confirms the order by email. The order is not final until confirmation is sent.' },
    s3Title: { tr: '3. Ödeme', en: '3. Payment' },
    s3Body: { tr: 'Ödeme, sipariş onayı sırasında güvenli ödeme sağlayıcıları üzerinden alınır. Ödeme onaylanana kadar ürün hazırlanmaz.', en: 'Payment is collected through secure payment providers at checkout. Products are not prepared until payment is confirmed.' },
    s4Title: { tr: '4. Teslimat', en: '4. Delivery' },
    s4Body: { tr: 'Ürünler, belirtilen teslimat adresine kargo şirketi aracılığıyla gönderilir. Teslimat süresi ürünün stok durumuna göre değişir. Kargo takip numarası e-posta ile gönderilir.', en: 'Products are shipped to the specified delivery address via courier. Delivery time varies by stock status. A tracking number is sent by email.' },
    s5Title: { tr: '5. Cayma Hakkı', en: '5. Right of Withdrawal' },
    s5Body: { tr: 'Alıcı, stokta bulunan ürünler için teslimattan itibaren 14 gün içinde cayma hakkına sahiptir. Siparişe özel ürünlerde cayma hakkı yoktur. Cayma bildirimi iletişim sayfası üzerinden yapılmalıdır.', en: 'The Buyer has the right to withdraw within 14 days of delivery for in-stock items. Made-to-order items are not subject to withdrawal. Withdrawal notice must be given via the contact page.' },
    s6Title: { tr: '6. Garanti', en: '6. Warranty' },
    s6Body: { tr: 'Tüm ürünlerimiz imalat hatalarına karşı 2 yıl garanti kapsamındadır. Garanti, normal aşınma veya yanlış kullanımı kapsamaz.', en: 'All our products carry a 2-year warranty against manufacturing defects. The warranty does not cover normal wear or misuse.' },
  },

  // About page
  aboutPage: {
    title: { tr: 'Hakkımızda', en: 'About Us' },
    subtitle: { tr: 'Işığı tutan odalar tasarlıyoruz.', en: 'We design rooms that hold the light.' },
    p1: { tr: 'Vey Concept, 2015 yılında mimar Léa Orbe tarafından kuruldu. Atölye, mimari iç mekanlar ve özel mobilya tasarımı arasında köprü kurar — her parça, tek bir ışık jesti etrafında kurgulanır.', en: 'Vey Concept was founded in 2015 by architect Léa Orbe. The atelier bridges architectural interiors and bespoke furniture design — each piece composed around a single gesture of light.' },
    p2: { tr: 'Çalışmalarımız Paris, Milano, Marakeş ve Mykonos\'ta gerçekleşiyor. Her proje, mekanın doğasına ve ışığın hareketine duyarlıdır. Akıllı Lamba serimiz, mobilyanın ışığa dönüştiği anki deneyimi yakalar.', en: 'Our work spans Paris, Milan, Marrakech, and Mykonos. Each project is sensitive to the nature of the space and the movement of light. Our Smart Lamp series captures the moment furniture becomes light.' },
    valuesTitle: { tr: 'Değerlerimiz', en: 'Our Values' },
    v1Title: { tr: 'Zanaat', en: 'Craft' },
    v1Body: { tr: 'Her parça atölyemizde elle bitirilir. Numaralandırılır, imzalanır ve nesiller boyu kullanılmak üzere üretilir.', en: 'Every piece is hand-finished in our atelier. Numbered, signed, and built to last for generations.' },
    v2Title: { tr: 'Sürdürülebilirlik', en: 'Sustainability' },
    v2Body: { tr: 'Sorumlu kaynaklardan malzeme kullanıyoruz. Üretim süreçlerimiz atıkları en aza indirecek şekilde tasarlanmıştır.', en: 'We source materials responsibly. Our production processes are designed to minimize waste.' },
    v3Title: { tr: 'Yenilik', en: 'Innovation' },
    v3Body: { tr: 'Malzeme ve aydınlatma teknolojilerini araştırıyoruz. Akıllı Lamba serisi, mobilyaya gömülü LED ile yenilik getirir.', en: 'We explore materials and lighting technology. The Smart Lamp series innovates with embedded LED in furniture.' },
    teamTitle: { tr: 'Ekip', en: 'The Team' },
    l1Name: { tr: 'Léa Orbe', en: 'Léa Orbe' },
    l1Role: { tr: 'Kurucu & Baş Tasarımcı', en: 'Founder & Lead Designer' },
    l2Name: { tr: 'Marco Ferri', en: 'Marco Ferri' },
    l2Role: { tr: 'Atölye Direktörü', en: 'Atelier Director' },
    l3Name: { tr: 'Yuki Tanaka', en: 'Yuki Tanaka' },
    l3Role: { tr: 'Aydınlatma Tasarımcısı', en: 'Lighting Designer' },
  },

  // Contact page
  contactPage: {
    title: { tr: 'İletişim', en: 'Contact' },
    subtitle: { tr: 'Bir proje, bir parça veya ticari program hakkında konuşmak için bize ulaşın.', en: 'Reach out to discuss a project, a piece, or the trade program.' },
    name: { tr: 'Ad Soyad', en: 'Full Name' },
    email: { tr: 'E-posta', en: 'Email' },
    subject: { tr: 'Konu', en: 'Subject' },
    message: { tr: 'Mesaj', en: 'Message' },
    send: { tr: 'Gönder', en: 'Send Message' },
    sent: { tr: 'Mesajınız alındı. En kısa sürede dönüş yapacağız.', en: 'Your message has been received. We will respond shortly.' },
    studios: { tr: 'Atölyeler', en: 'Studios' },
    paris: { tr: 'Paris', en: 'Paris' },
    milan: { tr: 'Milano', en: 'Milan' },
    marrakech: { tr: 'Marakeş', en: 'Marrakech' },
    emailLabel: { tr: 'E-posta', en: 'Email' },
    phoneLabel: { tr: 'Telefon', en: 'Phone' },
  },

  // Common
  common: {
    backHome: { tr: 'Ana Sayfa', en: 'Home' },
    loading: { tr: 'Yükleniyor...', en: 'Loading...' },
  },
} as const;

export type Dictionary = typeof dictionary;

