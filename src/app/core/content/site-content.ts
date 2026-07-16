import type { SiteContent } from './site-content.model';

/**
 * Single source of truth for all static site copy (Arabic).
 *
 * There is no Paramètres/settings API yet. When one lands, replace this constant
 * with a value provided from the API via {@link SITE_CONTENT} — no component changes needed.
 */
export const SITE_CONTENT: SiteContent = {
  nomEntreprise: 'ماي بانل برس',
  slogan: 'طباعة وتصنيع اللوحات الإعلانية بجودة احترافية',

  nav: [
    { path: '/', label: 'الرئيسية', exact: true },
    { path: '/services', label: 'خدماتنا', exact: false },
    { path: '/realisations', label: 'أعمالنا', exact: false },
    { path: '/a-propos', label: 'من نحن', exact: false },
    { path: '/contact', label: 'اتصل بنا', exact: false },
  ],

  hero: {
    titre: 'لوحات إعلانية ولافتات تصنع الفرق',
    slogan: 'من التصميم إلى التركيب، نرافقك في كل خطوة لإبراز علامتك التجارية بأعلى معايير الجودة.',
    // No hero photo yet → the section falls back to the brand gradient.
    // Set to '/images/hero.webp' once the asset is added under public/.
    image: null,
    ctaPrimary: { path: '/services', label: 'اكتشف خدماتنا', exact: false },
    ctaSecondary: { path: '/contact', label: 'اتصل بنا', exact: false },
  },

  presentation: {
    titre: 'من نحن',
    paragraphes: [
      'ماي بانل برس مؤسسة متخصصة في طباعة وتصنيع اللوحات الإعلانية واللافتات  .',
      'نجمع بين الخبرة الحرفية والتجهيزات الحديثة لتقديم منتجات متينة وأنيقة تلبّي احتياجات المؤسسات والتجار والحرفيين.',
    ],
    stats: [
      { valeur: '+13', libelle: 'سنة خبرة' },
      { valeur: '+500', libelle: 'مشروع منجز' },
      { valeur: '100%', libelle: 'رضا العملاء' },
    ],
  },

  accueil: {
    maxServices: 6,
    nbRealisations: 6,
  },

  contact: {
    adresse: 'مقابل مقابل الجامعة الاسلامية بعلبك',
    telephone: '76 803 075',
    email: 'mahdi.mcheik@hotmail.fr',
  },

  socials: [
    { reseau: 'facebook', label: 'فيسبوك', url: 'https://facebook.com/' },
    { reseau: 'instagram', label: 'إنستغرام', url: 'https://instagram.com/' },
    { reseau: 'linkedin', label: 'لينكدإن', url: 'https://linkedin.com/' },
  ],

  ogImage: '/images/og-image.jpg',

  servicesFallback: [
    {
      id: 'fallback-impression-numerique',
      nom: 'الطباعة الرقمية',
      description: 'طباعة عالية الدقة على مختلف الأسطح بألوان زاهية وثابتة.',
      avantages: ['دقة عالية', 'ألوان ثابتة', 'تنفيذ سريع'],
    },
    {
      id: 'fallback-grand-format',
      nom: 'الطباعة كبيرة الحجم',
      description: 'لافتات وواجهات بأحجام كبيرة تجذب الأنظار من بعيد.',
      avantages: ['أحجام كبيرة', 'مقاومة للعوامل الجوية', 'وضوح من مسافة بعيدة'],
    },
    {
      id: 'fallback-fabrication-panneaux',
      nom: 'تصنيع اللوحات',
      description: 'تصنيع لوحات صلبة بخامات متينة حسب المقاسات المطلوبة.',
      avantages: ['خامات متينة', 'مقاسات حسب الطلب', 'تشطيب احترافي'],
    },
    {
      id: 'fallback-relief',
      nom: 'لوحات بارزة',
      description: 'حروف ولوحات ثلاثية الأبعاد تمنح علامتك حضورًا مميزًا.',
      avantages: ['مظهر فاخر', 'تأثير ثلاثي الأبعاد', 'إضاءة اختيارية'],
    },
    {
      id: 'fallback-enseignes',
      nom: 'اللافتات',
      description: 'لافتات محلات وواجهات مضيئة وغير مضيئة بتصاميم عصرية.',
      avantages: ['تصاميم عصرية', 'خيارات إضاءة', 'تركيب متكامل'],
    },
  ],

  horairesFallback: [
    { jour: 'Monday', libelle: 'الاثنين', ferme: false, plage: '09:00 – 18:00' },
    { jour: 'Tuesday', libelle: 'الثلاثاء', ferme: false, plage: '09:00 – 18:00' },
    { jour: 'Wednesday', libelle: 'الأربعاء', ferme: false, plage: '09:00 – 18:00' },
    { jour: 'Thursday', libelle: 'الخميس', ferme: false, plage: '09:00 – 18:00' },
    { jour: 'Friday', libelle: 'الجمعة', ferme: false, plage: '09:00 – 13:00' },
    { jour: 'Saturday', libelle: 'السبت', ferme: false, plage: '09:00 – 13:00' },
    { jour: 'Sunday', libelle: 'الأحد', ferme: true, plage: null },
  ],
};
