// Adding a new course = adding an entry here. The hub page (index.html)
// renders #coursesGrid from this array — no other markup changes needed.
const COURSES = [
  {
    id: 'turbo',
    name: 'دورة تصليح التيربو',
    description: 'احترف تفكيك وتركيب وتشخيص أعطال التيربو، والتعامل مع الزبائن، في 10 أيام تدريب عملي 100% على سيارات حقيقية، مع المبيت في الفندق.',
    href: 'turbo.html',
    meta: ['10 أيام', 'المبيت في الفندق', 'باتنة'],
    image: 'assets/img/turbo/bench-640.webp',
    imageSrcset: 'assets/img/turbo/bench-640.webp 640w, assets/img/turbo/bench-1080.webp 1080w',
    imageAlt: 'متربص بمئزر SM TURBO يعمل على تيربو فوق طاولة الورشة',
    imagePosition: '50% 50%',
  },
  {
    id: 'detailing',
    name: 'ديتايلينغ',
    description: 'أتقن غسيل وتلميع وحماية السيارات بأحدث التقنيات، واكتسب أساسيات إدارة مشروع ديتايلينغ ناجح.',
    href: 'detailing.html',
    meta: ['أسبوع واحد', 'باتنة'],
    image: 'assets/img/hub/detailing-640.webp',
    imageSrcset: 'assets/img/hub/detailing-640.webp 640w, assets/img/hub/detailing-1024.webp 1024w',
    imageAlt: 'فريق YR DETAILING أثناء تلميع وتنظيف سيارة داخل الورشة',
    imagePosition: '50% 42%',
  },
  {
    id: 'electricity',
    name: 'سكانار وكهرباء السيارات',
    description: 'من قانون أوم والأفوميتر إلى قراءة المخططات، الكنترول والحساسات، الأسيلوسكوب والسكانار (OBD). 10 أيام، شرح ثم تطبيق كل يوم.',
    href: 'electricity.html',
    meta: ['10 أيام', 'باتنة'],
    image: 'assets/img/elec/card.svg',
    imageSrcset: 'assets/img/elec/card.svg 640w',
    imageAlt: 'شاشة أسيلوسكوب تعرض إشارة حساس عمود المرفق',
    imagePosition: '50% 50%',
  },
];

function renderCourseCards() {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  grid.innerHTML = COURSES.map((course) => `
    <article class="course-card reveal">
      <figure class="course-card-media">
        <img src="${course.image}" srcset="${course.imageSrcset}" sizes="(min-width: 768px) 580px, 100vw" alt="${course.imageAlt}" loading="lazy" decoding="async" width="640" height="800" style="object-position:${course.imagePosition}">
      </figure>
      <div class="course-card-body">
        <p class="course-card-meta">${course.meta.join(' · ')}</p>
        <h3 class="h3">${course.name}</h3>
        <p class="course-card-desc">${course.description}</p>
        <a href="${course.href}" class="btn btn-primary">اكتشف الدورة</a>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderCourseCards);
