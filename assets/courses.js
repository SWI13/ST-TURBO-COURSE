// Adding a new course = adding an entry here. The hub page (index.html)
// renders #coursesGrid from this array — no other markup changes needed.
const COURSES = [
  {
    id: 'turbo',
    name: 'التربو',
    tagline: 'دورة تكوين شاملة في التربو والتجميل',
    description: 'احترف تفكيك وتركيب وتشخيص أعطال التربو، والتعامل مع الزبائن، في أسبوع تدريبي عملي 100% على سيارات حقيقية.',
    href: 'turbo.html',
    icon: 'icon-turbine',
    accentRgb: '255, 0, 0',
    meta: ['أسبوع واحد', 'باتنة'],
    image: 'assets/img/turbo.jpg',
    imageAlt: 'شاحن توربيني (تربو) داخل ورشة صيانة السيارات',
    imagePosition: '50% 62%',
    badge: null,
  },
  {
    id: 'detailing',
    name: 'ديتايلينغ',
    tagline: 'دورة التلميع والعناية الاحترافية بالسيارات',
    description: 'أتقن غسيل وتلميع وحماية السيارات بأحدث التقنيات، واكتسب أساسيات إدارة مشروع ديتايلينغ ناجح.',
    href: 'detailing.html',
    icon: 'icon-spray',
    accentRgb: '34, 229, 255',
    meta: ['أسبوع واحد', 'باتنة'],
    image: 'assets/img/detailing-card.jpg',
    imageAlt: 'فني ديتايلينغ يستخدم آلة تلميع احترافية على سيارة',
    imagePosition: '50% 45%',
    badge: null,
  },
];

function renderCourseCards() {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  grid.innerHTML = COURSES.map((course) => `
    <article class="course-card tech-corners reveal" style="--accent-rgb:${course.accentRgb}">
      <span class="card-shine" aria-hidden="true"></span>
      ${course.badge ? `<span class="course-card-badge">${course.badge}</span>` : ''}
      <div class="course-card-media">
        <img src="${course.image}" alt="${course.imageAlt}" loading="lazy" width="640" height="400" style="object-position:${course.imagePosition}">
        <span class="course-card-media-icon"><svg class="icon"><use href="#${course.icon}"/></svg></span>
      </div>
      <div class="course-card-body">
        <h3 class="course-card-name">${course.name}</h3>
        <p class="course-card-desc">${course.description}</p>
        <div class="course-card-meta">
          ${course.meta.map((m) => `<span class="course-meta-pill">${m}</span>`).join('')}
        </div>
        <a href="${course.href}" class="btn-primary course-card-cta">عرض الدورة / التسجيل</a>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderCourseCards);
