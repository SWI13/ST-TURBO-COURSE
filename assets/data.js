// SM ACADEMY — site data. Edit this file to change dates, add a course, or set a Meta Pixel.
//
// Adding a course: copy one entry in `courses`, give it a new `id` and `href`, and create
// its page (start from an existing course page and set <html data-course="the-id">).
// The home page, the courses page and the sessions list are all drawn from this array.
const SM = {
  phone: '0563 53 10 42',
  tel: '+213563531042',
  whatsapp: '213563531042',

  // Google Apps Script web app that writes signups into the sheet (see README.md).
  formUrl: 'https://script.google.com/macros/s/AKfycbzyuo9VK1fRE39ZLQ9lBVMFir9dVbjgMe6gyQgf6ZEvR33sGUXY0L7_01Klrd5xQEH3/exec',

  courses: [
    {
      id: 'turbo',
      href: 'turbo.html',
      name: 'دورة تصليح التيربو',
      description: 'تفكيك وتركيب التيربو، تشخيص أعطاله، والتعامل مع الزبون. تدريب عملي 100% داخل ورشة SM TURBO.',
      tags: ['10 أيام', 'المبيت في الفندق', 'شهادة تأهيل'],
      image: 'assets/img/turbo/bench-640.webp',
      imageSrcset: 'assets/img/turbo/bench-640.webp 640w, assets/img/turbo/bench-1080.webp 1080w',
      imageAlt: 'متربص بمئزر SM TURBO يعمل على تيربو فوق طاولة الورشة',
      imagePosition: '50% 30%',
      specs: [
        ['المدة', '10 أيام'],
        ['المستوى', 'من الصفر، دون خبرة سابقة'],
        ['المبيت', 'في الفندق'],
        ['الشهادة', 'شهادة تأهيل من غرفة الصناعة بباتنة'],
        ['المكان', 'ورشة SM TURBO، باتنة'],
      ],
      // Next session. `iso` decides when the date stops being shown: the day after it,
      // the site goes back to "we call you with the next date" on its own.
      // No date yet? Use: session: null
      session: { iso: '2026-11-21', day: '21', month: 'نوفمبر 2026', note: 'المقاعد محدودة' },
      whatsappText: 'السلام عليكم، أريد التسجيل في دورة التيربو',
      // Meta Pixel ID from Events Manager. Empty = no pixel on this course page.
      metaPixelId: '',
      // Ad headlines: turbo.html?v=hotel shows the `hotel` headline, and so on.
      variants: {
        hotel: {
          h1: 'تعلّم التيربو في 10 أيام<br>والمبيت في الفندق',
          lead: 'تدريب عملي في باتنة، مع المبيت في الفندق للمتربصين.',
        },
        cert: {
          h1: 'احترف التيربو<br>واحصل على شهادة',
          lead: 'شهادة تأهيل من غرفة الصناعة بباتنة، بعد 10 أيام تدريب عملي.',
        },
        beginner: {
          h1: 'ابدأ في التيربو<br>من الصفر',
          lead: 'لا تشترط الدورة أي خبرة سابقة. 10 أيام تدريب عملي في باتنة.',
        },
      },
    },
    {
      id: 'electricity',
      href: 'electricity.html',
      name: 'سكانار وكهرباء السيارات',
      description: 'من قانون أوم والأفوميتر إلى المخططات، الكنترول والحساسات، الأسيلوسكوب والسكانار. شرح ثم تطبيق كل يوم.',
      tags: ['10 أيام', 'نظري وتطبيقي', 'من الصفر'],
      image: 'assets/img/elec/scope.svg',
      imageSrcset: '',
      imageAlt: 'شاشة أسيلوسكوب تعرض إشارتي حساس عمود المرفق وحساس عمود الكامة',
      imagePosition: '50% 50%',
      specs: [
        ['المدة', '10 أيام'],
        ['المستوى', 'من الصفر، دون خبرة سابقة'],
        ['الطريقة', 'شرح ثم تطبيق كل يوم'],
        ['الشهادة', 'شهادة عند إتمام الدورة'],
        ['المكان', 'باتنة'],
      ],
      session: null,
      whatsappText: 'السلام عليكم، أريد التسجيل في دورة سكانار وكهرباء السيارات',
      metaPixelId: '',
      variants: {
        beginner: {
          h1: 'ابدأ في كهرباء السيارات<br>من الصفر',
          lead: 'لا تشترط الدورة أي خبرة سابقة. 10 أيام من قانون أوم إلى السكانار.',
        },
        diag: {
          h1: 'اعرف العطل<br>قبل أن تبدّل القطعة',
          lead: 'منهجية تشخيص كهربائي كاملة: الأفوميتر، المخططات، الأسيلوسكوب والسكانار.',
        },
        ecu: {
          h1: 'افهم الكنترول<br>والحساسات',
          lead: 'كيف يقرأ الـ ECU الكابتورات ويتحكم في الرشاشات، وكيف تختبر كل حساس خطوة بخطوة.',
        },
      },
    },
    {
      id: 'detailing',
      href: 'detailing.html',
      name: 'ديتايلينغ',
      description: 'غسيل وتلميع وحماية السيارات بأحدث التقنيات، مع أساسيات إدارة مشروع ديتايلينغ ناجح. بالشراكة مع YR DETAILING.',
      tags: ['أسبوع واحد', '6 وحدات', 'ورشة YR DETAILING'],
      image: 'assets/img/detailing/team-640.webp',
      imageSrcset: 'assets/img/detailing/team-640.webp 640w, assets/img/detailing/team-1024.webp 1024w',
      imageAlt: 'فريق YR DETAILING أثناء تلميع وتنظيف سيارة داخل الورشة',
      imagePosition: '50% 42%',
      specs: [
        ['المدة', 'أسبوع واحد'],
        ['المستوى', 'من الصفر، دون خبرة سابقة'],
        ['المنهج', '6 وحدات تدريبية'],
        ['الشهادة', 'شهادة معتمدة'],
        ['المكان', 'ورشة YR DETAILING، باتنة'],
      ],
      session: null,
      whatsappText: 'السلام عليكم، أريد التسجيل في دورة الديتايلينغ',
      metaPixelId: '',
      variants: {},
    },
  ],
};
