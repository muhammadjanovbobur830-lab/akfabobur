import type {
  ColorId,
  GlassType,
  HandleType,
  Language,
  ModelPresetId,
  ProfileSeriesId,
  RoomType,
  SashOpeningType,
} from '../types/window';

export interface TranslationDict {
  currency: string;
  nav: {
    catalog: string;
    configurator: string;
    cart: string;
    orders: string;
    changePhone: string;
  };
  gate: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    phoneHint: string;
    phoneError: string;
    enterButton: string;
    benefits: [string, string, string];
  };
  catalog: {
    heroTitle: string;
    heroSubtitle: string;
    startConfiguring: string;
    modelsTitle: string;
    modelsSubtitle: string;
    seriesTitle: string;
    chambers: string;
    depth: string;
    thermal: string;
    sound: string;
    fromPrice: string;
    perM2: string;
    configureBtn: string;
    sashesLabel: string;
    models: Record<ModelPresetId, { name: string; desc: string }>;
  };
  seriesNames: Record<ProfileSeriesId, { name: string; tag: string; desc: string }>;
  rooms: Record<RoomType, { name: string; tip: string }>;
  sashTypes: Record<SashOpeningType, { name: string; short: string }>;
  colors: Record<ColorId, string>;
  glass: Record<GlassType, { name: string; desc: string }>;
  handles: Record<HandleType, string>;
  configurator: {
    title: string;
    editingBanner: string;
    cancelEdit: string;
    roomSection: string;
    autoAppliedNote: string;
    modelAndSashes: string;
    sashCount: string;
    balconyDoorMode: string;
    dimensionsSection: string;
    widthLabel: string;
    heightLabel: string;
    rangeError: string;
    areaLabel: string;
    sashConfigSection: string;
    sashNumber: string;
    seriesSection: string;
    colorsSection: string;
    outerColor: string;
    innerColor: string;
    sameAsOuter: string;
    dualColorBadge: string;
    glassSection: string;
    extrasSection: string;
    sillLabel: string;
    sillRate: string;
    netLabel: string;
    netRate: string;
    drainLabel: string;
    drainDesc: string;
    installLabel: string;
    installRate: string;
    handleLabel: string;
    quantityLabel: string;
    addToOrder: string;
    updateCartItem: string;
    addedToast: string;
    goToCart: string;
  };
  viewer: {
    view3D: string;
    view2D: string;
    roomBgOn: string;
    roomBgOff: string;
    openAll: string;
    closeAll: string;
    openSash: string;
    closeSash: string;
    sashShort: string;
    fixedLabel: string;
    tiltMode: string;
    turnMode: string;
    dragHint: string;
    webglFallback: string;
    exteriorTag: string;
    interiorTag: string;
  };
  pricing: {
    title: string;
    baseProfile: string;
    glassOption: string;
    openingMechanisms: string;
    colorLamination: string;
    dualColorFee: string;
    sill: string;
    mosquitoNet: string;
    installation: string;
    minPriceApplied: string;
    unitPrice: string;
    quantity: string;
    grandTotal: string;
    included: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    browseCatalog: string;
    edit: string;
    duplicate: string;
    remove: string;
    orderFormTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    addressLabel: string;
    addressPlaceholder: string;
    roomNotesLabel: string;
    roomNotesPlaceholder: string;
    measurementDateLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    summaryTitle: string;
    itemsCount: string;
    submitOrder: string;
    printQuote: string;
    nameError: string;
    phoneError: string;
    addressError: string;
    outerShort: string;
    innerShort: string;
  };
  success: {
    title: string;
    orderNumberLabel: string;
    subtitle: string;
    printQuote: string;
    viewOrders: string;
    configureAnother: string;
  };
  orders: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    orderLabel: string;
    dateLabel: string;
    itemsLabel: string;
    totalLabel: string;
    printQuote: string;
    customerLabel: string;
    addressLabel: string;
    measurementLabel: string;
  };
  print: {
    docTitle: string;
    generatedAt: string;
    orderNo: string;
    customer: string;
    phone: string;
    address: string;
    specs: string;
    dimensions: string;
    qty: string;
    unitPrice: string;
    total: string;
    grandTotal: string;
    note: string;
  };
  wallScanner: {
    openButton: string;
    title: string;
    subtitle: string;
    startCamera: string;
    takePhoto: string;
    retakePhoto: string;
    uploadPhoto: string;
    demoWall: string;
    cameraError: string;
    wallWidthLabel: string;
    wallHeightLabel: string;
    windowSizeLabel: string;
    zoomLabel: string;
    fitYes: string;
    fitNo: string;
    fitReasonTooWide: string;
    fitReasonTooTall: string;
    fitReasonOutside: string;
    autoFitBtn: string;
    applyAndClose: string;
    closeBtn: string;
    bottomHeight: string;
    topSpace: string;
    leftSpace: string;
    rightSpace: string;
    dragHint: string;
    wallInfo: string;
    meterUnit: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  uz: {
    currency: "so'm",
    nav: {
      catalog: 'Katalog',
      configurator: 'Konfigurator',
      cart: 'Savat',
      orders: 'Buyurtmalar',
      changePhone: "Raqamni o'zgartirish",
    },
    gate: {
      title: 'AKFI Deraza — Deraza va Eshiklar Konfiguratori',
      subtitle:
        "O'lcham, profil seriyasi va ranglarni 3D formatda tanlang hamda aniq narxni darhol hisoblang.",
      phoneLabel: 'Telefon raqamingiz',
      phoneHint: 'Buyurtma va bepul o‘lchov xizmati uchun raqamingizni kiriting',
      phoneError: "To'g'ri O'zbekiston raqamini kiriting: +998 XX XXX XX XX",
      enterButton: 'Davom etish',
      benefits: [
        'Haqiqiy vaqtdagi 3D ko‘rinish',
        "Aniq narx kalkulyatori (so'mda)",
        'Bepul o‘lchovchi chaqirish',
      ],
    },
    catalog: {
      heroTitle: 'AKFI Deraza Profillaridan Mukammal Deraza Yarating',
      heroSubtitle:
        '3, 5 va 7 kamerali original AKFI Deraza tizimlari. Har bir qanot ochilish turi, ikki tomonlama laminatsiya va jonli 3D tekshiruv.',
      startConfiguring: 'Konfiguratorga o‘tish',
      modelsTitle: 'Deraza va Eshik Modellari',
      modelsSubtitle: 'Kerakli konstruksiyani tanlang — barcha o‘lchamlar moslashtiriladi',
      seriesTitle: 'AKFI Deraza Profil Seriyalari',
      chambers: 'kamera',
      depth: 'qalinlik',
      thermal: 'Issiqlik himoyasi',
      sound: 'Shovqin izolyatsiyasi',
      fromPrice: 'Boshlang‘ich narx',
      perM2: '/ m²',
      configureBtn: 'Sozlash',
      sashesLabel: 'qanot',
      models: {
        single: {
          name: 'Bir qanotli deraza',
          desc: 'Oshxona, hammom va kichik xonalar uchun ixcham yechim',
        },
        double: {
          name: 'Ikki qanotli deraza',
          desc: 'Yotoqxona va standart kvartira xonalari uchun eng ommabop model',
        },
        triple: {
          name: 'Uch qanotli deraza',
          desc: 'Keng mehmonxona va zallar uchun maksimal yorug‘lik',
        },
        quad: {
          name: "To'rt qanotli panorama",
          desc: 'Katta fasad va ofis oynalari uchun keng konstruksiya',
        },
        balcony_door: {
          name: 'Balkon eshigi va blok',
          desc: 'Balkonga chiqish uchun mustahkam eshik va yon oyna tizimi',
        },
        fixed_window: {
          name: 'Ochilmaydigan (Gluxoy)',
          desc: 'Maksimal germetiklik va eng tejamkor narxdagi vitraj oyna',
        },
      },
    },
    seriesNames: {
      standard: {
        name: 'AKFI Standard',
        tag: '3 kamera · 60 mm',
        desc: 'Qulay narx va ishonchli asosiy himoya. Balkon va yordamchi xonalar uchun ideal.',
      },
      comfort: {
        name: 'AKFI Comfort',
        tag: '5 kamera · 70 mm',
        desc: 'Yuqori issiqlik va shovqin izolyatsiyasi. Kvartira va xususiy uylar uchun tavsiya etiladi.',
      },
      premium: {
        name: 'AKFI Premium',
        tag: '7 kamera · 80 mm',
        desc: 'Maksimal energiya tejamkorlik, qalin devorli profil va premium furnitura.',
      },
    },
    rooms: {
      living_room: {
        name: 'Mehmonxona',
        tip: '3 qanotli keng deraza · Low-E shisha · Comfort 5 kamera',
      },
      bedroom: {
        name: 'Yotoqxona',
        tip: '2 qanotli · Burama-qaytarma (Tilt-and-Turn) · Bolalar qulfi',
      },
      kitchen: {
        name: 'Oshxona',
        tip: '2 qanotli · Shamollatish rejimi · Chivin to‘ri bilan',
      },
      bathroom: {
        name: 'Hammom',
        tip: 'Ixcham 600×750 mm · Yuqoridan ochiluvchi · Muzlatilgan (mat) shisha',
      },
      balcony: {
        name: 'Balkon',
        tip: 'Balkon eshigi + deraza bloki · 2 kamerali shisha paket',
      },
      office: {
        name: 'Ofis',
        tip: 'Premium 7 kamera · Qoraytirilgan (Tinted) quyoshdan himoya shishasi',
      },
    },
    sashTypes: {
      fixed: { name: 'Ochilmaydigan (Gluxoy)', short: 'Gluxoy' },
      open_left: { name: 'Chapga ochiluvchi', short: 'Chapga' },
      open_right: { name: "O'ngga ochiluvchi", short: "O'ngga" },
      tilt: { name: 'Yuqoridan ochiluvchi (Fortochka)', short: 'Yuqoriga' },
      tilt_turn_left: { name: 'Burama-qaytarma (Chap)', short: 'Chap+Yuqori' },
      tilt_turn_right: { name: "Burama-qaytarma (O'ng)", short: "O'ng+Yuqori" },
      open_bottom: { name: 'Pastdan ochiluvchi', short: 'Pastdan' },
    },
    colors: {
      white: 'Oq',
      brown: 'Jigarrang',
      golden_oak: 'Oltin dub',
      anthracite: 'Antratsit',
      black: 'Qora',
      walnut: "Yong'oq",
      silver: 'Kumush',
    },
    glass: {
      single_chamber: { name: '1 kamerali (2 oyna)', desc: '24 mm standart paket' },
      double_chamber: { name: '2 kamerali (3 oyna)', desc: '32 mm yuqori izolyatsiya' },
      low_e: { name: 'Energiya tejovchi (Low-E)', desc: 'Issiqlikni saqlovchi qoplama' },
      frosted: { name: 'Muzlatilgan (Mat)', desc: 'Shaffof bo‘lmagan maxfiy oyna' },
      tinted: { name: 'Qoraytirilgan (Tinted)', desc: 'Quyosh nurini kamaytiruvchi' },
    },
    handles: {
      standard: 'Standart tutqich',
      key_lock: 'Kalitli himoya (Bolalar uchun)',
      premium_metal: 'Premium metall tutqich',
    },
    configurator: {
      title: 'Deraza Konfiguratori',
      editingBanner: 'Savatdagi mahsulotni tahrirlash',
      cancelEdit: 'Bekor qilish',
      roomSection: 'Xona turi (avtomatik tavsiya)',
      autoAppliedNote: 'Xona uchun eng optimal konfiguratsiya qo‘llandi:',
      modelAndSashes: 'Konstruksiya va qanotlar soni',
      sashCount: 'Qanotlar soni',
      balconyDoorMode: 'Balkon eshigi rejimi (pastki sendvich panel bilan)',
      dimensionsSection: "O'lchamlar — Eni va Bo'yi (400 – 3000 mm)",
      widthLabel: 'Eni (mm)',
      heightLabel: "Bo'yi (mm)",
      rangeError: "O'lcham 400 mm dan 3000 mm gacha bo'lishi kerak",
      areaLabel: 'Umumiy yuza',
      sashConfigSection: 'Har bir qanot ochilish turi',
      sashNumber: 'Qanot',
      seriesSection: 'AKFI Deraza Profil seriyasi',
      colorsSection: 'Rang va laminatsiya',
      outerColor: 'Tashqi tomon rangi',
      innerColor: 'Ichki tomon rangi',
      sameAsOuter: 'Tashqi bilan bir xil',
      dualColorBadge: "Ikki xil rang (+8% qo'shimcha)",
      glassSection: 'Shisha paket turi',
      extrasSection: "Qo'shimcha jihozlar va xizmatlar",
      sillLabel: 'Deraza tokchasi (Podokonnik)',
      sillRate: "60 000 so'm / metr",
      netLabel: "Chivin to'ri (Moskit setka)",
      netRate: "90 000 so'm / m²",
      drainLabel: 'Suv oqizgich (Otliv)',
      drainDesc: 'Tashqi alyuminiy himoya qoplamasi',
      installLabel: "O'rnatish xizmati (Montaj)",
      installRate: "150 000 so'm / m²",
      handleLabel: 'Tutqich turi',
      quantityLabel: 'Soni (dona)',
      addToOrder: "Buyurtmaga qo'shish",
      updateCartItem: 'O‘zgarishlarni saqlash',
      addedToast: "Deraza savatga qo'shildi",
      goToCart: "Savatga o'tish",
    },
    viewer: {
      view3D: '3D Ko‘rinish',
      view2D: '2D Chizma',
      roomBgOn: 'Xona devori: Yoqilgan',
      roomBgOff: 'Xona devori: O‘chirilgan',
      openAll: 'Hammasini ochish',
      closeAll: 'Hammasini yopish',
      openSash: 'Ochish',
      closeSash: 'Yopish',
      sashShort: 'Q',
      fixedLabel: 'Gluxoy',
      tiltMode: 'Yuqoriga',
      turnMode: 'Yoniga',
      dragHint: "Aylantirish uchun suring · Yaqinlashtirish uchun chimchilang",
      webglFallback: '3D rejim mavjud emas — 2D texnik chizma ko‘rsatilmoqda',
      exteriorTag: 'Tashqi',
      interiorTag: 'Ichki',
    },
    pricing: {
      title: 'Narx tafsiloti',
      baseProfile: 'Asosiy profil narxi',
      glassOption: 'Shisha paket',
      openingMechanisms: 'Ochilish mexanizmlari',
      colorLamination: 'Rangli laminatsiya (+12%)',
      dualColorFee: 'Ikki xil rang (+8%)',
      sill: 'Deraza tokchasi',
      mosquitoNet: "Chivin to'ri",
      installation: "O'rnatish xizmati",
      minPriceApplied: "Minimal deraza narxi qo'llandi (600 000 so'm)",
      unitPrice: '1 dona narxi',
      quantity: 'Soni',
      grandTotal: 'Jami summa',
      included: 'Kiritilgan',
    },
    cart: {
      title: 'Buyurtma savati',
      emptyTitle: "Savatingiz hozircha bo'sh",
      emptyDesc: "Katalogdan model tanlang yoki konfigurator orqali yangi deraza yarating.",
      browseCatalog: "Katalogga o'tish",
      edit: 'Tahrirlash',
      duplicate: 'Nusxalash',
      remove: "O'chirish",
      orderFormTitle: 'Buyurtma ma’lumotlari',
      nameLabel: 'Ismingiz *',
      namePlaceholder: 'Masalan: Sardor Karimov',
      phoneLabel: 'Telefon raqami *',
      addressLabel: 'Manzil *',
      addressPlaceholder: 'Shahar, tuman, ko‘cha, uy raqami',
      roomNotesLabel: 'Xona / qavat haqida eslatma',
      roomNotesPlaceholder: 'Masalan: 4-qavat, lift bor',
      measurementDateLabel: "O'lchov uchun qulay sana",
      commentLabel: 'Qo‘shimcha izoh',
      commentPlaceholder: 'Maxsus talablar bo‘lsa yozib qoldiring',
      summaryTitle: 'Buyurtma xulosasi',
      itemsCount: 'Jami mahsulotlar',
      submitOrder: 'Buyurtmani tasdiqlash',
      printQuote: 'PDF / Chop etish',
      nameError: 'Iltimos, ismingizni kiriting',
      phoneError: "To'g'ri +998 raqamini kiriting",
      addressError: 'Iltimos, manzilni kiriting',
      outerShort: 'Tashqi',
      innerShort: 'Ichki',
    },
    success: {
      title: 'Buyurtmangiz qabul qilindi!',
      orderNumberLabel: 'Buyurtma raqami',
      subtitle:
        "Mutaxassisimiz tez orada ko'rsatilgan telefon raqami orqali siz bilan bog'lanadi.",
      printQuote: 'Smeta (PDF) yuklash / Chop etish',
      viewOrders: 'Buyurtmalar tarixi',
      configureAnother: 'Yana deraza qo‘shish',
    },
    orders: {
      title: 'Buyurtmalar tarixi',
      emptyTitle: 'Hali buyurtmalar mavjud emas',
      emptyDesc: 'Tasdiqlangan barcha buyurtmalaringiz shu yerda saqlanadi.',
      orderLabel: 'Buyurtma',
      dateLabel: 'Sana',
      itemsLabel: 'Mahsulotlar',
      totalLabel: 'Jami summa',
      printQuote: 'PDF / Chop etish',
      customerLabel: 'Mijoz',
      addressLabel: 'Manzil',
      measurementLabel: "O'lchov sanasi",
    },
    print: {
      docTitle: 'AKFI DERAZA TIJORAT TAKLIFI / BUYURTMA SMETASI',
      generatedAt: 'Sana',
      orderNo: 'Buyurtma №',
      customer: 'Mijoz',
      phone: 'Telefon',
      address: 'Manzil',
      specs: 'Texnik tavsif',
      dimensions: "O'lcham (mm)",
      qty: 'Soni',
      unitPrice: 'Birlik narxi',
      total: 'Summa',
      grandTotal: 'JAMI TO‘LOV',
      note: 'Ushbu hisob-kitob AKFI Deraza tizimi orqali shakllantirildi. Yakuniy o‘lchov ustalar tomonidan tasdiqlanadi.',
    },
    wallScanner: {
      openButton: 'Rasmga olish / Devorga moslash',
      title: 'Devorga Kamera Orqali Moslash',
      subtitle: 'Telefon kamerasini devorga qarating yoki rasm yuklang — deraza mos kelishi va har tomoni necha metr ekani darhol chiqadi.',
      startCamera: 'Kamerani yoqish',
      takePhoto: 'Rasmga olish',
      retakePhoto: 'Qayta olish',
      uploadPhoto: 'Rasm yuklash',
      demoWall: 'Namuna devor',
      cameraError: 'Kameraga ruxsat berilmadi yoki topilmadi. Pastdagi "Rasm yuklash" tugmasidan foydalaning.',
      wallWidthLabel: 'Devor eni (m)',
      wallHeightLabel: "Devor bo'yi (m)",
      windowSizeLabel: 'Deraza',
      zoomLabel: 'Kattalashtirish',
      fitYes: 'MOS KELADI — deraza ushbu devorga bemalol sig‘adi',
      fitNo: 'MOS KELMAYDI — deraza devor chegarasiga sig‘mayapti',
      fitReasonTooWide: 'Deraza eni devor enidan katta',
      fitReasonTooTall: "Deraza bo'yi devor bo'yidan katta",
      fitReasonOutside: 'Deraza devor chetidan chiqib ketgan (joyini suring)',
      autoFitBtn: "Devorga sig'dirish",
      applyAndClose: "O'lchamni saqlash",
      closeBtn: 'Yopish',
      bottomHeight: 'Pasti (poldan)',
      topSpace: 'Tepasi (shift)',
      leftSpace: 'Chap tomoni',
      rightSpace: "O'ng tomoni",
      dragHint: 'Derazani barmoq bilan suring · + / − bilan kattalashtiring',
      wallInfo: 'Devor',
      meterUnit: 'm',
    },
  },
  ru: {
    currency: 'сум',
    nav: {
      catalog: 'Каталог',
      configurator: 'Конфигуратор',
      cart: 'Корзина',
      orders: 'Заказы',
      changePhone: 'Изменить номер',
    },
    gate: {
      title: 'Конфигуратор окон и дверей AKFI Deraza',
      subtitle:
        'Подберите размеры, серию профиля и цвет ламинации в 3D и получите точный расчёт стоимости.',
      phoneLabel: 'Ваш номер телефона',
      phoneHint: 'Введите номер для оформления заказа и бесплатного замера',
      phoneError: 'Введите корректный номер Узбекистана: +998 XX XXX XX XX',
      enterButton: 'Войти в конфигуратор',
      benefits: [
        'Интерактивная 3D-модель',
        'Мгновенный расчёт в сумах',
        'Бесплатный выезд замерщика',
      ],
    },
    catalog: {
      heroTitle: 'Создайте идеальные окна из профиля AKFI Deraza',
      heroSubtitle:
        'Оригинальные 3, 5 и 7-камерные системы AKFI Deraza. Независимая настройка створок, двухсторонняя ламинация и проверка открывания в 3D.',
      startConfiguring: 'Открыть конфигуратор',
      modelsTitle: 'Модели окон и дверей',
      modelsSubtitle: 'Выберите базовую конструкцию — любые размеры настраиваются',
      seriesTitle: 'Серии профилей AKFI Deraza',
      chambers: 'камер',
      depth: 'глубина',
      thermal: 'Теплоизоляция',
      sound: 'Шумоизоляция',
      fromPrice: 'Базовая ставка',
      perM2: '/ м²',
      configureBtn: 'Настроить',
      sashesLabel: 'ств.',
      models: {
        single: {
          name: 'Одностворчатое окно',
          desc: 'Компактное решение для кухни, ванной или небольших комнат',
        },
        double: {
          name: 'Двухстворчатое окно',
          desc: 'Самая популярная модель для спален и жилых комнат',
        },
        triple: {
          name: 'Трёхстворчатое окно',
          desc: 'Максимум дневного света для гостиной и просторных залов',
        },
        quad: {
          name: 'Четырёхстворчатое окно',
          desc: 'Широкая панорамная конструкция для фасадов и офисов',
        },
        balcony_door: {
          name: 'Балконная дверь и блок',
          desc: 'Усиленная дверь выхода на балкон с боковым окном',
        },
        fixed_window: {
          name: 'Глухое окно',
          desc: 'Максимальная герметичность и доступная цена без створок',
        },
      },
    },
    seriesNames: {
      standard: {
        name: 'AKFI Standard',
        tag: '3 камеры · 60 мм',
        desc: 'Доступная классика с надёжной базовой защитой. Отлично для балконов и подсобных помещений.',
      },
      comfort: {
        name: 'AKFI Comfort',
        tag: '5 камер · 70 мм',
        desc: 'Повышенная тепло- и шумоизоляция. Рекомендуется для квартир и частных домов.',
      },
      premium: {
        name: 'AKFI Premium',
        tag: '7 камер · 80 мм',
        desc: 'Максимальное энергосбережение, усиленный профиль и премиальная фурнитура.',
      },
    },
    rooms: {
      living_room: {
        name: 'Гостиная',
        tip: '3 створки · Энергосберегающий стеклопакет Low-E · Comfort 5 камер',
      },
      bedroom: {
        name: 'Спальня',
        tip: '2 створки · Поворотно-откидная створка · Детский замок',
      },
      kitchen: {
        name: 'Кухня',
        tip: '2 створки · Режим проветривания · С москитной сеткой',
      },
      bathroom: {
        name: 'Ванная',
        tip: 'Компакт 600×750 мм · Откидное вверх · Матовое стекло',
      },
      balcony: {
        name: 'Балкон',
        tip: 'Балконная дверь + окно · 2-камерный стеклопакет',
      },
      office: {
        name: 'Офис',
        tip: 'Premium 7 камер · Тонированное солнцезащитное стекло',
      },
    },
    sashTypes: {
      fixed: { name: 'Глухая (не открывается)', short: 'Глухая' },
      open_left: { name: 'Поворотная влево', short: 'Влево' },
      open_right: { name: 'Поворотная вправо', short: 'Вправо' },
      tilt: { name: 'Откидная (сверху)', short: 'Откидная' },
      tilt_turn_left: { name: 'Поворотно-откидная (левая)', short: 'Лев+Отк' },
      tilt_turn_right: { name: 'Поворотно-откидная (правая)', short: 'Прав+Отк' },
      open_bottom: { name: 'Нижнеподвесная (снизу)', short: 'Снизу' },
    },
    colors: {
      white: 'Белый',
      brown: 'Коричневый',
      golden_oak: 'Золотой дуб',
      anthracite: 'Антрацит',
      black: 'Чёрный',
      walnut: 'Орех',
      silver: 'Серебро',
    },
    glass: {
      single_chamber: { name: '1-камерный (2 стекла)', desc: '24 мм стандартный пакет' },
      double_chamber: { name: '2-камерный (3 стекла)', desc: '32 мм тишина и тепло' },
      low_e: { name: 'Энергосберегающий (Low-E)', desc: 'С теплоотражающим напылением' },
      frosted: { name: 'Матовый', desc: 'Непрозрачное сатиновое стекло' },
      tinted: { name: 'Тонированный', desc: 'Защита от яркого солнца' },
    },
    handles: {
      standard: 'Стандартная ручка',
      key_lock: 'С ключом (защита детей)',
      premium_metal: 'Премиум металлическая',
    },
    configurator: {
      title: 'Конфигуратор окна',
      editingBanner: 'Редактирование позиции из корзины',
      cancelEdit: 'Отмена',
      roomSection: 'Назначение комнаты (автоподбор)',
      autoAppliedNote: 'Применена оптимальная конфигурация для комнаты:',
      modelAndSashes: 'Конструкция и число створок',
      sashCount: 'Количество створок',
      balconyDoorMode: 'Режим балконной двери (с нижней сэндвич-панелью)',
      dimensionsSection: 'Размеры (400 – 3000 мм)',
      widthLabel: 'Ширина (мм)',
      heightLabel: 'Высота (мм)',
      rangeError: 'Допустимый размер от 400 мм до 3000 мм',
      areaLabel: 'Площадь изделия',
      sashConfigSection: 'Тип открывания каждой створки',
      sashNumber: 'Створка',
      seriesSection: 'Серия профиля AKFI Deraza',
      colorsSection: 'Цвет и ламинация',
      outerColor: 'Наружный цвет',
      innerColor: 'Внутренний цвет',
      sameAsOuter: 'Как снаружи',
      dualColorBadge: 'Разные цвета (+8% к профилю)',
      glassSection: 'Выбор стеклопакета',
      extrasSection: 'Дополнительные опции и сервис',
      sillLabel: 'Подоконник',
      sillRate: '60 000 сум / пог. м',
      netLabel: 'Москитная сетка',
      netRate: '90 000 сум / м²',
      drainLabel: 'Отлив (водоотлив)',
      drainDesc: 'Наружный защитный профиль',
      installLabel: 'Профессиональный монтаж',
      installRate: '150 000 сум / м²',
      handleLabel: 'Тип ручки',
      quantityLabel: 'Количество (шт.)',
      addToOrder: 'Добавить в заказ',
      updateCartItem: 'Сохранить изменения',
      addedToast: 'Окно добавлено в корзину',
      goToCart: 'Перейти в корзину',
    },
    viewer: {
      view3D: '3D Вид',
      view2D: '2D Чертёж',
      roomBgOn: 'Стена комнаты: Вкл',
      roomBgOff: 'Стена комнаты: Выкл',
      openAll: 'Открыть все',
      closeAll: 'Закрыть все',
      openSash: 'Открыть',
      closeSash: 'Закрыть',
      sashShort: 'С',
      fixedLabel: 'Глух.',
      tiltMode: 'Откид',
      turnMode: 'Поворот',
      dragHint: 'Вращайте мышью или пальцем · Колёсико для масштаба',
      webglFallback: 'WebGL недоступен — показан 2D технический чертёж',
      exteriorTag: 'Снаружи',
      interiorTag: 'Внутри',
    },
    pricing: {
      title: 'Расчёт стоимости',
      baseProfile: 'Базовый профиль',
      glassOption: 'Стеклопакет',
      openingMechanisms: 'Механизмы открывания',
      colorLamination: 'Цветная ламинация (+12%)',
      dualColorFee: 'Двухцветная (+8%)',
      sill: 'Подоконник',
      mosquitoNet: 'Москитная сетка',
      installation: 'Монтаж',
      minPriceApplied: 'Применена минимальная цена (600 000 сум)',
      unitPrice: 'Цена за 1 шт.',
      quantity: 'Количество',
      grandTotal: 'Итого к оплате',
      included: 'Включено',
    },
    cart: {
      title: 'Корзина заказа',
      emptyTitle: 'Ваша корзина пуста',
      emptyDesc: 'Выберите готовую модель в каталоге или настройте окно в конфигураторе.',
      browseCatalog: 'Перейти в каталог',
      edit: 'Изменить',
      duplicate: 'Дублировать',
      remove: 'Удалить',
      orderFormTitle: 'Оформление заказа',
      nameLabel: 'Ваше имя *',
      namePlaceholder: 'Например: Сардор Каримов',
      phoneLabel: 'Телефон *',
      addressLabel: 'Адрес доставки и замера *',
      addressPlaceholder: 'Город, район, улица, дом, квартира',
      roomNotesLabel: 'Примечания по помещению / этажу',
      roomNotesPlaceholder: 'Например: 4 этаж, есть грузовой лифт',
      measurementDateLabel: 'Желаемая дата замера',
      commentLabel: 'Комментарий к заказу',
      commentPlaceholder: 'Дополнительные пожелания',
      summaryTitle: 'Итог заказа',
      itemsCount: 'Всего позиций',
      submitOrder: 'Оформить заказ',
      printQuote: 'Скачать PDF / Печать',
      nameError: 'Пожалуйста, укажите ваше имя',
      phoneError: 'Введите корректный номер +998',
      addressError: 'Пожалуйста, укажите адрес',
      outerShort: 'Снаружи',
      innerShort: 'Внутри',
    },
    success: {
      title: 'Заказ успешно оформлен!',
      orderNumberLabel: 'Номер заказа',
      subtitle: 'Наш менеджер свяжется с вами в ближайшее время для подтверждения замера.',
      printQuote: 'Скачать PDF / Печать сметы',
      viewOrders: 'История заказов',
      configureAnother: 'Добавить ещё окно',
    },
    orders: {
      title: 'История заказов',
      emptyTitle: 'У вас пока нет заказов',
      emptyDesc: 'Все оформленные вами заказы будут сохранены здесь.',
      orderLabel: 'Заказ',
      dateLabel: 'Дата',
      itemsLabel: 'Позиции',
      totalLabel: 'Сумма',
      printQuote: 'PDF / Печать',
      customerLabel: 'Клиент',
      addressLabel: 'Адрес',
      measurementLabel: 'Дата замера',
    },
    print: {
      docTitle: 'КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ / СМЕТА AKFI DERAZA',
      generatedAt: 'Дата',
      orderNo: 'Заказ №',
      customer: 'Заказчик',
      phone: 'Телефон',
      address: 'Адрес',
      specs: 'Техническая спецификация',
      dimensions: 'Размеры (мм)',
      qty: 'Кол-во',
      unitPrice: 'Цена за ед.',
      total: 'Сумма',
      grandTotal: 'ИТОГО',
      note: 'Расчёт выполнен в AKFI Deraza. Окончательные размеры уточняются при замере.',
    },
    wallScanner: {
      openButton: 'Снять фото / Примерка на стену',
      title: 'Примерка окна на стену через камеру',
      subtitle: 'Наведите камеру на стену или загрузите фото — сразу видны отступы в метрах со всех сторон и совместимость.',
      startCamera: 'Включить камеру',
      takePhoto: 'Сделать фото',
      retakePhoto: 'Переснять',
      uploadPhoto: 'Загрузить фото',
      demoWall: 'Пример стены',
      cameraError: 'Камера недоступна или нет разрешения. Используйте кнопку «Загрузить фото».',
      wallWidthLabel: 'Ширина стены (м)',
      wallHeightLabel: 'Высота стены (м)',
      windowSizeLabel: 'Окно',
      zoomLabel: 'Масштаб',
      fitYes: 'ПОДХОДИТ — окно помещается на эту стену',
      fitNo: 'НЕ ПОДХОДИТ — окно не помещается в границы стены',
      fitReasonTooWide: 'Ширина окна больше ширины стены',
      fitReasonTooTall: 'Высота окна больше высоты стены',
      fitReasonOutside: 'Окно выходит за край стены (передвиньте)',
      autoFitBtn: 'Вписать в стену',
      applyAndClose: 'Применить размер',
      closeBtn: 'Закрыть',
      bottomHeight: 'Снизу (от пола)',
      topSpace: 'Сверху (до потолка)',
      leftSpace: 'Слева',
      rightSpace: 'Справа',
      dragHint: 'Перетаскивайте окно пальцем · Кнопки + / − для масштаба',
      wallInfo: 'Стена',
      meterUnit: 'м',
    },
  },
  en: {
    currency: "so'm",
    nav: {
      catalog: 'Catalog',
      configurator: 'Configurator',
      cart: 'Cart',
      orders: 'Orders',
      changePhone: 'Change phone',
    },
    gate: {
      title: 'AKFI Deraza — Windows & Doors Configurator',
      subtitle:
        'Design custom windows in interactive 3D, select profile chambers and dual lamination, and get instant UZS pricing.',
      phoneLabel: 'Phone number',
      phoneHint: 'Required for order tracking and free on-site measurement',
      phoneError: 'Enter a valid Uzbekistan number: +998 XX XXX XX XX',
      enterButton: 'Enter Configurator',
      benefits: [
        'Real-time 3D interactive model',
        'Live itemized UZS pricing',
        'Free measurement scheduling',
      ],
    },
    catalog: {
      heroTitle: 'Precision AKFI Deraza Windows Built to Measure',
      heroSubtitle:
        'Original 3, 5, and 7-chamber AKFI Deraza profile systems. Independent sash mechanisms, dual-sided lamination, and live 3D inspection.',
      startConfiguring: 'Open Configurator',
      modelsTitle: 'Window & Door Models',
      modelsSubtitle: 'Select a structural template — every dimension and sash is customizable',
      seriesTitle: 'AKFI Deraza Profile Series',
      chambers: 'chambers',
      depth: 'depth',
      thermal: 'Thermal efficiency',
      sound: 'Sound insulation',
      fromPrice: 'Base rate',
      perM2: '/ m²',
      configureBtn: 'Configure',
      sashesLabel: 'sashes',
      models: {
        single: {
          name: '1-Sash Window',
          desc: 'Compact operable unit ideal for kitchens, bathrooms, and studies',
        },
        double: {
          name: '2-Sash Window',
          desc: 'Balanced twin-panel layout for bedrooms and apartment living spaces',
        },
        triple: {
          name: '3-Sash Window',
          desc: 'Wide three-bay daylight span for living rooms and dining areas',
        },
        quad: {
          name: '4-Sash Panorama',
          desc: 'Expansive architectural elevation for large facades and offices',
        },
        balcony_door: {
          name: 'Balcony Door & Block',
          desc: 'Full-height balcony access door paired with an adjacent window sash',
        },
        fixed_window: {
          name: 'Fixed Picture Window',
          desc: 'Non-opening sealed glazing for maximum airtightness and value',
        },
      },
    },
    seriesNames: {
      standard: {
        name: 'AKFI Standard',
        tag: '3 chambers · 60 mm',
        desc: 'Dependable everyday insulation at an economical rate. Ideal for balconies and utility rooms.',
      },
      comfort: {
        name: 'AKFI Comfort',
        tag: '5 chambers · 70 mm',
        desc: 'Enhanced thermal and acoustic barrier. Recommended for residential apartments and homes.',
      },
      premium: {
        name: 'AKFI Premium',
        tag: '7 chambers · 80 mm',
        desc: 'Flagship multi-chamber rigidity, superior energy retention, and heavy-duty hardware.',
      },
    },
    rooms: {
      living_room: {
        name: 'Living Room',
        tip: '3 sashes · Low-E energy glass · Comfort 5-chamber profile',
      },
      bedroom: {
        name: 'Bedroom',
        tip: '2 sashes · Tilt-and-Turn ventilation · Child safety key lock',
      },
      kitchen: {
        name: 'Kitchen',
        tip: '2 sashes · Easy ventilation · Mosquito net included',
      },
      bathroom: {
        name: 'Bathroom',
        tip: 'Compact 600×750 mm · Top-opening tilt · Frosted privacy glass',
      },
      balcony: {
        name: 'Balcony',
        tip: 'Balcony door + window combination · Double-chamber glazing',
      },
      office: {
        name: 'Office',
        tip: 'Premium 7-chamber · Solar-control tinted glass',
      },
    },
    sashTypes: {
      fixed: { name: 'Fixed (Non-opening)', short: 'Fixed' },
      open_left: { name: 'Open Left', short: 'Left' },
      open_right: { name: 'Open Right', short: 'Right' },
      tilt: { name: 'Tilt (Opens from top)', short: 'Tilt' },
      tilt_turn_left: { name: 'Tilt & Turn (Left)', short: 'L + Tilt' },
      tilt_turn_right: { name: 'Tilt & Turn (Right)', short: 'R + Tilt' },
      open_bottom: { name: 'Open Bottom', short: 'Bottom' },
    },
    colors: {
      white: 'White',
      brown: 'Brown',
      golden_oak: 'Golden Oak',
      anthracite: 'Anthracite',
      black: 'Black',
      walnut: 'Walnut',
      silver: 'Silver',
    },
    glass: {
      single_chamber: { name: '1-Chamber (Double Pane)', desc: '24 mm standard unit' },
      double_chamber: { name: '2-Chamber (Triple Pane)', desc: '32 mm acoustic & thermal' },
      low_e: { name: 'Energy-Saving (Low-E)', desc: 'Low-emissivity thermal coating' },
      frosted: { name: 'Frosted Glass', desc: 'Translucent privacy finish' },
      tinted: { name: 'Tinted Glass', desc: 'Solar glare reduction' },
    },
    handles: {
      standard: 'Standard Handle',
      key_lock: 'Key-Lock Handle (Child Safe)',
      premium_metal: 'Premium Metal Handle',
    },
    configurator: {
      title: 'Window Configurator',
      editingBanner: 'Editing item from cart',
      cancelEdit: 'Cancel',
      roomSection: 'Room Type (Auto-Suggest)',
      autoAppliedNote: 'Recommended preset applied for',
      modelAndSashes: 'Structure & Sashes',
      sashCount: 'Number of sashes',
      balconyDoorMode: 'Balcony door profile (with insulated lower panel)',
      dimensionsSection: 'Dimensions (400 – 3000 mm)',
      widthLabel: 'Width (mm)',
      heightLabel: 'Height (mm)',
      rangeError: 'Dimensions must be between 400 mm and 3000 mm',
      areaLabel: 'Total Area',
      sashConfigSection: 'Opening Type per Sash',
      sashNumber: 'Sash',
      seriesSection: 'AKFI Deraza Profile Series',
      colorsSection: 'Lamination Colors',
      outerColor: 'Outer Side Color',
      innerColor: 'Inner Side Color',
      sameAsOuter: 'Match outer',
      dualColorBadge: 'Dual-tone lamination (+8% on profile)',
      glassSection: 'Glass Unit',
      extrasSection: 'Extras & Installation',
      sillLabel: 'Window Sill',
      sillRate: "60 000 so'm / m",
      netLabel: 'Mosquito Net',
      netRate: "90 000 so'm / m²",
      drainLabel: 'Exterior Drain / Ebb',
      drainDesc: 'Protective exterior rainwater sill',
      installLabel: 'Installation Service',
      installRate: "150 000 so'm / m²",
      handleLabel: 'Handle Type',
      quantityLabel: 'Quantity',
      addToOrder: 'Add to Order',
      updateCartItem: 'Update Item',
      addedToast: 'Added to your order cart',
      goToCart: 'View Cart',
    },
    viewer: {
      view3D: '3D View',
      view2D: '2D Blueprint',
      roomBgOn: 'Room Wall: On',
      roomBgOff: 'Room Wall: Off',
      openAll: 'Open all',
      closeAll: 'Close all',
      openSash: 'Open',
      closeSash: 'Close',
      sashShort: 'S',
      fixedLabel: 'Fixed',
      tiltMode: 'Tilt',
      turnMode: 'Turn',
      dragHint: 'Drag to orbit · Scroll or pinch to zoom · Two-finger pan',
      webglFallback: 'WebGL unavailable — showing 2D architectural schematic',
      exteriorTag: 'Exterior',
      interiorTag: 'Interior',
    },
    pricing: {
      title: 'Price Breakdown',
      baseProfile: 'Base Profile',
      glassOption: 'Glass Unit',
      openingMechanisms: 'Opening Mechanisms',
      colorLamination: 'Color Lamination (+12%)',
      dualColorFee: 'Dual Outer/Inner Color (+8%)',
      sill: 'Window Sill',
      mosquitoNet: 'Mosquito Net',
      installation: 'Installation Service',
      minPriceApplied: "Minimum window price applied (600 000 so'm)",
      unitPrice: 'Unit Price',
      quantity: 'Quantity',
      grandTotal: 'Grand Total',
      included: 'Included',
    },
    cart: {
      title: 'Order Cart',
      emptyTitle: 'Your order cart is empty',
      emptyDesc: 'Pick a model from the catalog or build a custom window in the configurator.',
      browseCatalog: 'Browse Catalog',
      edit: 'Edit',
      duplicate: 'Duplicate',
      remove: 'Delete',
      orderFormTitle: 'Customer & Measurement Details',
      nameLabel: 'Full Name *',
      namePlaceholder: 'e.g. Sardor Karimov',
      phoneLabel: 'Phone Number *',
      addressLabel: 'Delivery & Installation Address *',
      addressPlaceholder: 'City, district, street, building / apt',
      roomNotesLabel: 'Room / Floor Notes',
      roomNotesPlaceholder: 'e.g. 4th floor, elevator available',
      measurementDateLabel: 'Preferred Measurement Date',
      commentLabel: 'Additional Comment',
      commentPlaceholder: 'Any special requests or access instructions',
      summaryTitle: 'Order Summary',
      itemsCount: 'Total items',
      submitOrder: 'Place Order',
      printQuote: 'Download PDF / Print Quote',
      nameError: 'Please enter your name',
      phoneError: 'Enter a valid +998 phone number',
      addressError: 'Please enter the installation address',
      outerShort: 'Outer',
      innerShort: 'Inner',
    },
    success: {
      title: 'Order Confirmed!',
      orderNumberLabel: 'Order Number',
      subtitle: 'Our measurement specialist will contact you shortly on your saved phone number.',
      printQuote: 'Download PDF / Print Quote',
      viewOrders: 'View Order History',
      configureAnother: 'Configure Another Window',
    },
    orders: {
      title: 'Order History',
      emptyTitle: 'No orders placed yet',
      emptyDesc: 'Submitted window orders are saved locally here with full technical specifications.',
      orderLabel: 'Order',
      dateLabel: 'Date',
      itemsLabel: 'Items',
      totalLabel: 'Total',
      printQuote: 'PDF / Print Quote',
      customerLabel: 'Customer',
      addressLabel: 'Address',
      measurementLabel: 'Measurement Date',
    },
    print: {
      docTitle: 'AKFI DERAZA COMMERCIAL QUOTE / SPECIFICATION',
      generatedAt: 'Date',
      orderNo: 'Order No.',
      customer: 'Customer',
      phone: 'Phone',
      address: 'Address',
      specs: 'Technical Specification',
      dimensions: 'Dimensions (mm)',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      total: 'Line Total',
      grandTotal: 'GRAND TOTAL',
      note: 'Generated by AKFI Deraza Configurator. Final dimensions are verified during on-site measurement.',
    },
    wallScanner: {
      openButton: 'Camera / Fit to Wall',
      title: 'Wall Camera Fit & Measurement',
      subtitle: 'Point your phone camera at any wall or upload a photo to check fit and live meter distances on every side.',
      startCamera: 'Open Camera',
      takePhoto: 'Take Photo',
      retakePhoto: 'Retake',
      uploadPhoto: 'Upload Photo',
      demoWall: 'Sample Wall',
      cameraError: 'Camera unavailable or permission denied. Use "Upload Photo" instead.',
      wallWidthLabel: 'Wall Width (m)',
      wallHeightLabel: 'Wall Height (m)',
      windowSizeLabel: 'Window',
      zoomLabel: 'Zoom',
      fitYes: 'FITS — Window fits comfortably on this wall',
      fitNo: 'DOES NOT FIT — Exceeds wall boundaries',
      fitReasonTooWide: 'Window width exceeds wall width',
      fitReasonTooTall: 'Window height exceeds wall height',
      fitReasonOutside: 'Window extends past wall edge (drag inward)',
      autoFitBtn: 'Auto-fit to wall',
      applyAndClose: 'Apply & Close',
      closeBtn: 'Close',
      bottomHeight: 'Bottom (from floor)',
      topSpace: 'Top (to ceiling)',
      leftSpace: 'Left side',
      rightSpace: 'Right side',
      dragHint: 'Drag window to position · Use + / − to zoom',
      wallInfo: 'Wall',
      meterUnit: 'm',
    },
  },
};
