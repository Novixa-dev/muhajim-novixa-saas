export interface TranslationKeys {
  appName: string;
  tagline: string;
  byNovixa: string;
  privacyBadge: string;
  privacySubtitle: string;
  dragDropTitle: string;
  dragDropSubtitle: string;
  pasteClipboardHint: string;
  selectFilesBtn: string;
  resizeTabPercentage: string;
  resizeTabCustom: string;
  resizeTabPresets: string;
  widthLabel: string;
  heightLabel: string;
  lockAspectRatio: string;
  scalePercentage: string;
  formatLabel: string;
  qualityLabel: string;
  fitModeLabel: string;
  fitModeCover: string;
  fitModeContain: string;
  fitModeStretch: string;
  presetInstagramPost: string;
  presetInstagramStory: string;
  presetYoutubeThumb: string;
  presetTwitterHeader: string;
  presetEcommerceSquare: string;
  presetGovDoc: string;
  processBtn: string;
  processingText: string;
  downloadBtn: string;
  resetBtn: string;
  originalSize: string;
  newSize: string;
  savingsLabel: string;
  seoTitle: string;
  seoParagraph1: string;
  seoParagraph2: string;
  seoParagraph3: string;
  footerRights: string;
  canvaAffiliate: string;
  novixaDevLink: string;
  // Optional keys (default to English via the fallback merge in getTranslation)
  passportTab?: string;
  passportTitle?: string;
  bgColorLabel?: string;
  bgWhite?: string;
  bgLightGray?: string;
  bgLightBlue?: string;
  presetEcommerce?: string;
  presetFacebookCover?: string;
  passportUS?: string;
  passportUSSub?: string;
  passportSchengen?: string;
  passportSchengenSub?: string;
  passportArab?: string;
  passportArabSub?: string;
  passportUnder100?: string;
  passportUnder200?: string;
  enhanceLabel?: string;
  enhanceHint?: string;
  enhanceStrengthLabel?: string;
  changeImagesBtn?: string;
  batchProcessingText?: string;
  selectedCountText?: string;
  totalLabel?: string;
  loadErrorText?: string;
  processBatchBtn?: string;
  // Result preview keys
  previewLabel?: string;
  compareSliderLabel?: string;
  livePreviewLabel?: string;
  chooseImagePreview?: string;
  batchZipBtn?: string;
  zippingText?: string;
  readyToDownload?: string;
  originalFilesLabel?: string;
  batchTotalLabel?: string;
  // Clarity & Enhancement Studio keys
  clarityStudioTitle?: string;
  claritySmart?: string;
  claritySmartDesc?: string;
  clarityDoc?: string;
  clarityDocDesc?: string;
  clarityPhoto?: string;
  clarityPhotoDesc?: string;
  clarityCustom?: string;
  clarityContrast?: string;
  clarityBrightness?: string;
  clarityDenoise?: string;
  formatSvgDesc?: string;
  formatAvifDesc?: string;
  formatIcoDesc?: string;
  formatPdfDesc?: string;
}


export const TRANSLATIONS: Record<string, TranslationKeys> = {
  ar: {
    appName: 'مُحجِّم',
    tagline: 'تغيير مقاسات وتصغير الصور بلمح البصر — 100% داخل متصفحك',
    byNovixa: 'إحدى مبادرات Novixa التقنية',
    privacyBadge: 'خصوصية وأمان 100%',
    privacySubtitle: 'ملفاتك لا تغادر جهازك إطلاقاً — المعالجة تتم محلياً',
    dragDropTitle: 'اسحب وأفلت الصور هنا لضبط الأبعاد فورياً',
    dragDropSubtitle: 'أو اضغط للتصفح واختيار الملفات من جهازك',
    pasteClipboardHint: 'تلميح: يمكنك لصق الصورة مباشرة عبر Ctrl + V',
    selectFilesBtn: 'اختر صورة من جهازك',
    resizeTabPercentage: 'نسبة مئوية (%)',
    resizeTabCustom: 'أبعاد مخصصة (px)',
    resizeTabPresets: 'قوالب جاهزة',
    widthLabel: 'العرض (بكسل)',
    heightLabel: 'الارتفاع (بكسل)',
    lockAspectRatio: 'الحفاظ على نسبة الأبعاد (التناسب)',
    scalePercentage: 'نسبة التصغير/التكبير',
    formatLabel: 'الصيغة الناتجة',
    qualityLabel: 'جودة الضغط',
    fitModeLabel: 'طريقة الملاءمة والقص',
    fitModeCover: 'قص في المنتصف (Cover)',
    fitModeContain: 'احتواء كامل مع حواف (Contain)',
    fitModeStretch: 'تمدد مباشر (Stretch)',
    presetInstagramPost: 'منشور إنستغرام (1:1)',
    presetInstagramStory: 'قصة إنستغرام / تيك توك (9:16)',
    presetYoutubeThumb: 'مصغرة يوتيوب (1280x720)',
    presetTwitterHeader: 'غلاف إكس / تويتر (1500x500)',
    presetEcommerceSquare: 'صور المنتجات للمتاجر (1000x1000)',
    presetGovDoc: 'الوثائق الرسمية والهوية (أقل من 100KB)',
    processBtn: 'معالجة وتجهيز الصورة',
    processingText: 'جاري المعالجة محلياً داخل المتصفح...',
    downloadBtn: 'تحميل الصورة الناتجة',
    resetBtn: 'صورة جديدة',
    originalSize: 'الحجم الأصلي',
    newSize: 'الحجم الجديد',
    savingsLabel: 'وفرت من المساحة',
    seoTitle: 'لماذا مُحجِّم هو الخيار الأول لتغيير مقاسات الصور في العالم العربي؟',
    seoParagraph1: 'يعتمد موقع مُحجِّم (Muhajim) على تقنيات HTML5 Canvas و Web Workers الحديثة لتقديم تجربة تحجيم وتصغير صور فائقة السرعة بدون الاستعانة بأي خوادم خارجية. هذا يعني أن كل عملية تتم بالكامل على معالج جهازك.',
    seoParagraph2: 'سواء كنت بحاجة إلى ضبط أبعاد صور المنتجات لمتجرك على سلة أو زد أو شوبيفاي، أو تحضير منشورات انستغرام وتيك توك، أو تقليل حجم صورة الوثائق الرسمية، يوفر لك مُحجِّم جميع القوالب الجاهزة بضغطة زر واحدة.',
    seoParagraph3: 'نحن نلتزم بأعلى معايير الخصوصية والأمان الرقمي. لا توجد قاعدة بيانات تخزن صورك، ولا يتم استخدام النطاق الترددي للإنترنت لرفع الملفات، مما يوفر لك أقصى درجات السرعة والسرية.',
    footerRights: 'جميع الحقوق محفوظة © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'هل تحتاج إلى تصميم هويات وشعارات احترافية؟ جرب Canva Pro',
    novixaDevLink: 'تريد حلول برمجة ومواقع مخصصة لشركتك؟ تواصل مع فريق Novixa',
    passportTab: 'الهوية والجوازات (Gov)',
    passportTitle: 'مقاسات الهوية الرسمية وجوازات السفر والفيزا (DPI 300)',
    bgColorLabel: 'لون خلفية الهوية:',
    bgWhite: 'أبيض',
    bgLightGray: 'رمادي فاتح',
    bgLightBlue: 'أزرق فاتح',
    presetEcommerce: 'متاجر سلة وزد وشوبيفاي',
    presetFacebookCover: 'غلاف فيسبوك / لينكدإن',
    passportUS: 'جواز سفر أمريكي / دولي',
    passportUSSub: '2×2 إنش (600×600 px)',
    passportSchengen: 'فيزا الشنغن / أوروبا والخليج',
    passportSchengenSub: '35×45 ملم (413×531 px)',
    passportArab: 'الهوية والوثائق العربية',
    passportArabSub: '4×6 سم (472×709 px)',
    passportUnder100: 'مضمونة أقل من 100KB',
    passportUnder200: 'أقل من 200KB تلقائياً',
    enhanceLabel: 'تحسين وضوح الصورة (Enhance)',
    enhanceHint: 'يُبرز التفاصيل ويجعل الصور غير الواضحة أكثر حدّة وقراءة',
    enhanceStrengthLabel: 'مستوى التحسين',
    changeImagesBtn: 'تغيير الصور',
    batchProcessingText: 'جاري معالجة الصور محلياً داخل المتصفح...',
    selectedCountText: 'تم اختيار {count} صور للمعالجة الجماعية',
    totalLabel: 'إجمالي',
    loadErrorText: 'تعذّر قراءة ملف الصورة. تأكد من أن الصيغة مدعومة.',
    processBatchBtn: 'معالجة وتجهيز جميع الصور ({count}) الآن ➔',
    previewLabel: 'معاينة',
    compareSliderLabel: 'مقارنة تفاعلية (Slider)',
    livePreviewLabel: 'المعاينة المباشرة',
    chooseImagePreview: 'اختر صورة لمعاينتها وتدقيق جودتها:',
    batchZipBtn: 'تحميل الكل كملف ZIP ({count})',
    zippingText: 'جاري ضغط الملفات...',
    readyToDownload: 'جاهزة للتحميل بنقرة واحدة',
    originalFilesLabel: 'ملفات أصلية',
    batchTotalLabel: 'إجمالي',
    clarityStudioTitle: 'استوديو توضيح وتحسين جودة الصورة (AI/HD Clarity)',
    claritySmart: 'توضيح تلقائي ذكي',
    claritySmartDesc: 'يضبط التباين والحدة وإبراز التفاصيل تلقائياً',
    clarityDoc: 'توضيح المستندات والخطوط',
    clarityDocDesc: 'تغميق النصوص وتبييض الخلفية للأوراق والوثائق غير الواضحة',
    clarityPhoto: 'توضيح الوجوه والبورتريه',
    clarityPhotoDesc: 'تنقية الشوائب وتوضيح ملامح الوجه والتفاصيل بدقة',
    clarityCustom: 'تحكم يدوي مخصص',
    clarityContrast: 'زيادة التباين (Contrast)',
    clarityBrightness: 'تعديل الإضاءة (Brightness)',
    clarityDenoise: 'تنقية الحبيبات والشوائب (Denoise)',
    formatSvgDesc: 'صيغة متجهية قابلة للتكبير لأي حجم دون بكسلة',
    formatAvifDesc: 'ضغط الجيل القادم فائق الصغر بجودة استثنائية',
    formatIcoDesc: 'أيقونة مواقع وبرمجيات مفضلة (Favicon)',
    formatPdfDesc: 'مستند PDF رسمي عالي الدقة جاهز للطباعة والجهات الرسمية',
  },
  en: {
    appName: 'Muhajim',
    tagline: 'Instant In-Browser Image Resizer & Compressor — 100% Private',
    byNovixa: 'A Novixa Digital Initiative',
    privacyBadge: '100% Secure & Private',
    privacySubtitle: 'Your files never leave your device — Local In-Browser Processing',
    dragDropTitle: 'Drag & Drop your images here for instant resizing',
    dragDropSubtitle: 'or click to browse files from your computer',
    pasteClipboardHint: 'Pro tip: You can paste images directly with Ctrl + V',
    selectFilesBtn: 'Select Image File',
    resizeTabPercentage: 'Percentage (%)',
    resizeTabCustom: 'Custom Pixels (px)',
    resizeTabPresets: 'Presets',
    widthLabel: 'Width (px)',
    heightLabel: 'Height (px)',
    lockAspectRatio: 'Lock aspect ratio',
    scalePercentage: 'Scaling percentage',
    formatLabel: 'Output Format',
    qualityLabel: 'Compression Quality',
    fitModeLabel: 'Fit & Crop Mode',
    fitModeCover: 'Smart Center Crop (Cover)',
    fitModeContain: 'Fit with Padding (Contain)',
    fitModeStretch: 'Direct Stretch',
    presetInstagramPost: 'Instagram Post (1:1)',
    presetInstagramStory: 'Instagram Story / TikTok (9:16)',
    presetYoutubeThumb: 'YouTube Thumbnail (1280x720)',
    presetTwitterHeader: 'X / Twitter Header (1500x500)',
    presetEcommerceSquare: 'E-Commerce Product (1000x1000)',
    presetGovDoc: 'Official ID & Govt Doc (< 100KB)',
    processBtn: 'Process & Save Image Now',
    processingText: 'Processing locally in browser...',
    downloadBtn: 'Download Resized Image',
    resetBtn: 'New Image',
    originalSize: 'Original Size',
    newSize: 'New Size',
    savingsLabel: 'Size Reduced By',
    seoTitle: 'Why Muhajim is the Ultimate In-Browser Image Resizing Tool',
    seoParagraph1: 'Muhajim leverages HTML5 Canvas and Web Workers to process images locally on your CPU/GPU without uploading files to external cloud servers.',
    seoParagraph2: 'Perfect for e-commerce store owners (Shopify, WooCommerce, Amazon), social media managers, and privacy-conscious users needing quick passport/ID photo formatting.',
    seoParagraph3: 'Zero bandwidth waste, instant batch capability, and strict privacy guarantees. Your files never touch a remote server.',
    footerRights: 'All rights reserved © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'Need complete brand graphics and banners? Try Canva Pro',
    novixaDevLink: 'Need custom software engineering or enterprise web platforms? Contact Novixa',
    passportTab: 'ID & Passport (Gov)',
    passportTitle: 'Official ID, Passport & Visa Sizes (300 DPI)',
    bgColorLabel: 'ID background color:',
    bgWhite: 'White',
    bgLightGray: 'Light gray',
    bgLightBlue: 'Light blue',
    presetEcommerce: 'Salla, Zid & Shopify stores',
    presetFacebookCover: 'Facebook / LinkedIn cover',
    passportUS: 'US / International passport',
    passportUSSub: '2×2 inch (600×600 px)',
    passportSchengen: 'Schengen / Europe & Gulf visa',
    passportSchengenSub: '35×45 mm (413×531 px)',
    passportArab: 'Arab ID & documents',
    passportArabSub: '4×6 cm (472×709 px)',
    passportUnder100: 'Guaranteed under 100KB',
    passportUnder200: 'Automatically under 200KB',
    enhanceLabel: 'Enhance clarity',
    enhanceHint: 'Sharpens details so blurry images look clearer and more readable',
    enhanceStrengthLabel: 'Enhancement strength',
    changeImagesBtn: 'Change images',
    batchProcessingText: 'Processing images locally in your browser...',
    selectedCountText: '{count} images selected for batch processing',
    totalLabel: 'Total',
    loadErrorText: 'Could not read the image file. Please make sure the format is supported.',
    processBatchBtn: 'Process & Prepare all images ({count}) now ➔',
    previewLabel: 'Preview',
    compareSliderLabel: 'Interactive compare (Slider)',
    livePreviewLabel: 'Live preview',
    chooseImagePreview: 'Pick an image to preview and check its quality:',
    batchZipBtn: 'Download all as ZIP ({count})',
    zippingText: 'Zipping files...',
    readyToDownload: 'Ready to download in one click',
    originalFilesLabel: 'original files',
    batchTotalLabel: 'Total',
    clarityStudioTitle: 'Image Clarity & Enhancement Studio',
    claritySmart: 'Smart Auto Clarity',
    claritySmartDesc: 'Auto-adjusts contrast, sharpness & hidden details',
    clarityDoc: 'Documents & Text Booster',
    clarityDocDesc: 'Darkens text & whitens background for scans & IDs',
    clarityPhoto: 'Portrait & Photo Clarity',
    clarityPhotoDesc: 'Cleans grain while boosting natural facial contours',
    clarityCustom: 'Custom Pro Adjust',
    clarityContrast: 'Contrast Boost',
    clarityBrightness: 'Brightness Adjust',
    clarityDenoise: 'Clean digital noise & grain (Denoise)',
    formatSvgDesc: 'Scalable vector container with exact viewBox',
    formatAvifDesc: 'Next-gen ultra compression with pristine quality',
    formatIcoDesc: 'Standard favicon icon for web and desktop apps',
    formatPdfDesc: 'Official print-ready PDF document for submission',
  },
  es: {
    appName: 'Muhajim',
    tagline: 'Redimensionador de imágenes ultrarrápido en el navegador — 100% privado',
    byNovixa: 'Una iniciativa digital de Novixa',
    privacyBadge: '100% Privado y Seguro',
    privacySubtitle: 'Tus archivos nunca salen de tu dispositivo — Procesamiento local',
    dragDropTitle: 'Arrastra y suelta imágenes aquí para redimensionar al instante',
    dragDropSubtitle: 'o haz clic para explorar archivos desde tu dispositivo',
    pasteClipboardHint: 'Consejo: Puedes pegar imágenes directamente con Ctrl + V',
    selectFilesBtn: 'Seleccionar imagen',
    resizeTabPercentage: 'Porcentaje (%)',
    resizeTabCustom: 'Píxeles personalizados (px)',
    resizeTabPresets: 'Plantillas',
    widthLabel: 'Ancho (px)',
    heightLabel: 'Alto (px)',
    lockAspectRatio: 'Bloquear proporción de aspecto',
    scalePercentage: 'Porcentaje de escala',
    formatLabel: 'Formato de salida',
    qualityLabel: 'Calidad de compresión',
    fitModeLabel: 'Ajuste y recorte',
    fitModeCover: 'Recorte centrado (Cover)',
    fitModeContain: 'Ajustar con márgenes (Contain)',
    fitModeStretch: 'Estirar directamente (Stretch)',
    presetInstagramPost: 'Post de Instagram (1:1)',
    presetInstagramStory: 'Historia de Instagram / TikTok (9:16)',
    presetYoutubeThumb: 'Miniatura de YouTube (1280x720)',
    presetTwitterHeader: 'Encabezado de X / Twitter (1500x500)',
    presetEcommerceSquare: 'Producto E-Commerce (1000x1000)',
    presetGovDoc: 'Documento oficial / DNI (< 100KB)',
    processBtn: 'Procesar y guardar imagen',
    processingText: 'Procesando localmente en el navegador...',
    downloadBtn: 'Descargar imagen redimensionada',
    resetBtn: 'Nueva imagen',
    originalSize: 'Tamaño original',
    newSize: 'Nuevo tamaño',
    savingsLabel: 'Ahorro de espacio',
    seoTitle: 'Por qué Muhajim es la mejor herramienta para redimensionar imágenes',
    seoParagraph1: 'Muhajim utiliza HTML5 Canvas y Web Workers para procesar imágenes localmente sin subir archivos a la nube.',
    seoParagraph2: 'Ideal para tiendas online, creadores de contenido y usuarios que buscan máxima privacidad y velocidad.',
    seoParagraph3: 'Sin consumo de datos al subir, sin registros y con privacidad total asegurada.',
    footerRights: 'Todos los derechos reservados © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: '¿Diseños y logotipos profesionales? Prueba Canva Pro',
    novixaDevLink: '¿Soluciones de software personalizadas? Contacta con Novixa',
  },
  fr: {
    appName: 'Muhajim',
    tagline: 'Redimensionneur et compresseur d’images instantané — 100% privé',
    byNovixa: 'Une initiative de Novixa Digital',
    privacyBadge: '100% Sécurisé & Privé',
    privacySubtitle: 'Vos fichiers ne quittent jamais votre appareil — Traitement local',
    dragDropTitle: 'Glissez et déposez vos images ici pour un redimensionnement immédiat',
    dragDropSubtitle: 'ou cliquez pour parcourir les fichiers de votre ordinateur',
    pasteClipboardHint: 'Astuce : Collez directement vos images avec Ctrl + V',
    selectFilesBtn: 'Choisir une image',
    resizeTabPercentage: 'Pourcentage (%)',
    resizeTabCustom: 'Pixels personnalisés (px)',
    resizeTabPresets: 'Préréglages',
    widthLabel: 'Largeur (px)',
    heightLabel: 'Hauteur (px)',
    lockAspectRatio: 'Conserver le ratio d’aspect',
    scalePercentage: 'Pourcentage de mise à l’échelle',
    formatLabel: 'Format de sortie',
    qualityLabel: 'Qualité de compression',
    fitModeLabel: 'Mode d’ajustement',
    fitModeCover: 'Recadrage centré (Cover)',
    fitModeContain: 'Ajuster avec marges (Contain)',
    fitModeStretch: 'Étirer (Stretch)',
    presetInstagramPost: 'Post Instagram (1:1)',
    presetInstagramStory: 'Story Instagram / TikTok (9:16)',
    presetYoutubeThumb: 'Miniature YouTube (1280x720)',
    presetTwitterHeader: 'Bannière X / Twitter (1500x500)',
    presetEcommerceSquare: 'Produit E-Commerce (1000x1000)',
    presetGovDoc: 'Pièce d’identité officielle (< 100Ko)',
    processBtn: 'Traiter et enregistrer l’image',
    processingText: 'Traitement local dans le navigateur...',
    downloadBtn: 'Télécharger l’image',
    resetBtn: 'Nouvelle image',
    originalSize: 'Taille originale',
    newSize: 'Nouvelle taille',
    savingsLabel: 'Espace économisé',
    seoTitle: 'Pourquoi Muhajim est le meilleur outil de redimensionnement',
    seoParagraph1: 'Muhajim tire parti de HTML5 Canvas et des Web Workers pour traiter les images directement sur votre processeur sans transfert de données.',
    seoParagraph2: 'Conçu pour les e-commerçants, graphistes et utilisateurs soucieux de la confidentialité de leurs photos.',
    seoParagraph3: 'Zéro bande passante gaspillée, zéro serveur cloud, confidentialité totale garantie.',
    footerRights: 'Tous droits réservés © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'Besoin de visuels pros ? Essayez Canva Pro',
    novixaDevLink: 'Développement web sur mesure ? Contactez Novixa',
  },
  tr: {
    appName: 'Muhajim',
    tagline: 'Tarayıcı İçinde Anında Resim Boyutlandırma & Sıkıştırma — %100 Gizli',
    byNovixa: 'Bir Novixa Dijital Girişimi',
    privacyBadge: '%100 Güvenli ve Gizli',
    privacySubtitle: 'Dosyalarınız asla cihazınızdan çıkmaz — Yerel İşleme',
    dragDropTitle: 'Anında boyutlandırmak için görsellerinizi buraya sürükleyip bırakın',
    dragDropSubtitle: 'veya cihazınızdan dosya seçmek için tıklayın',
    pasteClipboardHint: 'İpucu: Ctrl + V ile doğrudan görsel yapıştırabilirsiniz',
    selectFilesBtn: 'Görsel Seç',
    resizeTabPercentage: 'Yüzde (%)',
    resizeTabCustom: 'Özel Piksel (px)',
    resizeTabPresets: 'Hazır Şablonlar',
    widthLabel: 'Genişlik (px)',
    heightLabel: 'Yükseklik (px)',
    lockAspectRatio: 'En-boy oranını koru',
    scalePercentage: 'Ölçekleme yüzdesi',
    formatLabel: 'Çıktı Formatı',
    qualityLabel: 'Sıkıştırma Kalitesi',
    fitModeLabel: 'Sığdırma Modu',
    fitModeCover: 'Merkezi Kırp (Cover)',
    fitModeContain: 'Sığdır ve Kenarlık Bırak (Contain)',
    fitModeStretch: 'Doğrudan Uzat (Stretch)',
    presetInstagramPost: 'Instagram Gönderisi (1:1)',
    presetInstagramStory: 'Instagram Hikaye / TikTok (9:16)',
    presetYoutubeThumb: 'YouTube Küçük Resmi (1280x720)',
    presetTwitterHeader: 'X / Twitter Başlığı (1500x500)',
    presetEcommerceSquare: 'E-Ticaret Ürün Görseli (1000x1000)',
    presetGovDoc: 'Resmi Kimlik / Belge (< 100KB)',
    processBtn: 'Görseli İşle ve Kaydet',
    processingText: 'Tarayıcıda yerel olarak işleniyor...',
    downloadBtn: 'Boyutlandırılmış Resmi İndir',
    resetBtn: 'Yeni Görsel',
    originalSize: 'Orijinal Boyut',
    newSize: 'Yeni Boyut',
    savingsLabel: 'Kazanılan Alan',
    seoTitle: 'Muhajim Neden En İyi Çevrimiçi Resim Boyutlandırma Aracıdır?',
    seoParagraph1: 'Muhajim, görsellerinizi herhangi bir sunucuya yüklemeden tarayıcınızda doğrudan işler.',
    seoParagraph2: 'E-ticaret satıcıları, sosyal medya yöneticileri ve gizliliğine önem verenler için ideal çözümdür.',
    seoParagraph3: 'Sıfır sunucu maliyeti, anlık performans ve mutlak veri gizliliği garantisi.',
    footerRights: 'Tüm hakları saklıdır © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'Profesyonel tasarımlar için Canva Pro’yu deneyin',
    novixaDevLink: 'Özel yazılım çözümleri için Novixa ile iletişime geçin',
  },
  ur: {
    appName: 'مُحجِّم',
    tagline: 'براؤزر میں فوری تصاویر کا سائز تبدیل اور کمپریس کریں — 100% محفوظ',
    byNovixa: 'نوویکسا ڈیجیٹل کا ایک پروجیکٹ',
    privacyBadge: '100% محفوظ اور نجی',
    privacySubtitle: 'آپ کی فائلیں آپ کے ڈیوائس سے باہر نہیں جاتیں — مقامی پروسیسنگ',
    dragDropTitle: 'تصویر کو فوراً ری سائز کرنے کے لیے یہاں ڈریگ اور ڈراپ کریں',
    dragDropSubtitle: 'یا فائل منتخب کرنے کے لیے کلک کریں',
    pasteClipboardHint: 'اشارہ: آپ Ctrl + V سے تصویر براہ راست پیسٹ کر سکتے ہیں',
    selectFilesBtn: 'تصویر منتخب کریں',
    resizeTabPercentage: 'فیصد (%)',
    resizeTabCustom: 'اپنی مرضی کے پکسلز (px)',
    resizeTabPresets: 'تیار سانچے',
    widthLabel: 'چوڑائی (px)',
    heightLabel: 'اونچائی (px)',
    lockAspectRatio: 'تناسب برقرار رکھیں',
    scalePercentage: 'سائز کا فیصد',
    formatLabel: 'آؤٹ پٹ فارمیٹ',
    qualityLabel: 'معیار کا تناسب',
    fitModeLabel: 'فٹنگ کا انداز',
    fitModeCover: 'درمیان سے کاٹیں (Cover)',
    fitModeContain: 'مکمل دکھائیں (Contain)',
    fitModeStretch: 'براہ راست کھینچیں (Stretch)',
    presetInstagramPost: 'انسٹاگرام پوسٹ (1:1)',
    presetInstagramStory: 'انسٹاگرام اسٹوری / ٹک ٹاک (9:16)',
    presetYoutubeThumb: 'یوٹیوب تھمب نیل (1280x720)',
    presetTwitterHeader: 'ٹوئٹر / ایکس ہیڈر (1500x500)',
    presetEcommerceSquare: 'آن لائن اسٹور پروڈکٹ (1000x1000)',
    presetGovDoc: 'سرکاری دستاویز اور شناختی کارڈ (< 100KB)',
    processBtn: 'تصویر پروسیس اور محفوظ کریں',
    processingText: 'براؤزر میں مقامی طور پر تیار کیا جا رہا ہے...',
    downloadBtn: 'تبدیل شدہ تصویر ڈاؤنلوڈ کریں',
    resetBtn: 'نئی تصویر',
    originalSize: 'اصل سائز',
    newSize: 'نیا سائز',
    savingsLabel: 'بچائی گئی جگہ',
    seoTitle: 'محجم تصاویر کا سائز تبدیل کرنے کا بہترین ٹول کیوں ہے؟',
    seoParagraph1: 'محجم بغیر کسی سرور پر تصویر اپ لوڈ کیے براؤزر کے اندر ہی تمام کام مکمل کرتا ہے۔',
    seoParagraph2: 'ای کامرس، سوشل میڈیا اور سرکاری دستاویزات کی تصاویر کے لیے مثالی۔',
    seoParagraph3: 'مکمل رازداری، تیز رفتار اور صفر ڈیٹا کا ضیاع۔',
    footerRights: 'جملہ حقوق محفوظ ہیں © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'پیشہ ورانہ گرافکس کے لیے Canva Pro آزمائیں',
    novixaDevLink: 'کسٹم سافٹ ویئر کے لیے Novixa سے رابطہ کریں',
  },
  fa: {
    appName: 'مُحجِّم',
    tagline: 'تغییر سایز و کاهش حجم عکس به سرعت برق — 100% در مرورگر شما',
    byNovixa: 'محصولی از نوویکسا دیجیتال',
    privacyBadge: '100% امن و خصوصی',
    privacySubtitle: 'تصاویر شما هرگز از دستگاهتان خارج نمی‌شوند — پردازش کاملاً محلی',
    dragDropTitle: 'تصاویر را اینجا بکشید و رها کنید',
    dragDropSubtitle: 'یا برای انتخاب فایل کلیک کنید',
    pasteClipboardHint: 'نکته: می‌توانید عکس را مستقیماً با Ctrl + V الصاق کنید',
    selectFilesBtn: 'انتخاب فایل تصویر',
    resizeTabPercentage: 'درصد (%)',
    resizeTabCustom: 'ابعاد دلخواه (px)',
    resizeTabPresets: 'قالب‌های آماده',
    widthLabel: 'عرض (پیکسل)',
    heightLabel: 'ارتفاع (پیکسل)',
    lockAspectRatio: 'حفظ تناسب تصویر',
    scalePercentage: 'درصد مقیاس',
    formatLabel: 'فرمت خروجی',
    qualityLabel: 'کیفیت فشرده‌سازی',
    fitModeLabel: 'حالت برش و تناسب',
    fitModeCover: 'برش از مرکز (Cover)',
    fitModeContain: 'نمایش کامل با حاشیه (Contain)',
    fitModeStretch: 'کشش مستقیم (Stretch)',
    presetInstagramPost: 'پست اینستاگرام (1:1)',
    presetInstagramStory: 'استوری اینستاگرام / تیک‌تاک (9:16)',
    presetYoutubeThumb: 'کاور ویدیو یوتیوب (1280x720)',
    presetTwitterHeader: 'هدر توییتر / ایکس (1500x500)',
    presetEcommerceSquare: 'عکس محصول فروشگاه (1000x1000)',
    presetGovDoc: 'مدارک هویتی و اداری (< 100KB)',
    processBtn: 'پردازش و ذخیره تصویر',
    processingText: 'در حال پردازش محلی در مرورگر...',
    downloadBtn: 'دانلود تصویر تغییر یافته',
    resetBtn: 'عکس جدید',
    originalSize: 'اندازه اصلی',
    newSize: 'اندازه جدید',
    savingsLabel: 'صرفه‌جویی در حجم',
    seoTitle: 'چرا محجم سریع‌ترین و امن‌ترین ابزار تغییر سایز تصاویر است؟',
    seoParagraph1: 'محجم تصاویر شما را بدون ارسال به سرورهای ابری، مستقیماً توسط پردازنده دستگاه شما تغییر اندازه می‌دهد.',
    seoParagraph2: 'مناسب برای فروشگاه‌های اینترنتی، شبکه‌های اجتماعی و اسناد اداری.',
    seoParagraph3: 'حفظ کامل حریم خصوصی و امنیت اطلاعات شما بدون آپلود فایل.',
    footerRights: 'تمامی حقوق محفوظ است © 2026 Novixa Digital Impact Initiative.',
    canvaAffiliate: 'طراحی حرفه‌ای با Canva Pro',
    novixaDevLink: 'توسعه نرم‌افزارهای اختصاصی با Novixa',
  }
};

// Fallback generator for other languages to ensure full 20-language support
export function getTranslation(langCode: string): TranslationKeys {
  const normalized = (langCode || 'en').split('-')[0].toLowerCase();

  // Merge English defaults so any optional/new key is always present,
  // then overlay the selected language's translations when available.
  return {
    ...TRANSLATIONS.en,
    ...(TRANSLATIONS[normalized] || {}),
    appName:
      normalized === 'ur' || normalized === 'fa' || normalized === 'ar'
        ? 'مُحجِّم'
        : TRANSLATIONS[normalized]?.appName || 'Muhajim',
  };
}
