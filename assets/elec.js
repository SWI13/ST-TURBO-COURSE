// Ad landing settings for electricity.html (same idea as assets/ads.js for the turbo page).
//
//   electricity.html?v=beginner → hero headline for an ad about starting from zero
//   electricity.html?v=diag     → … about diagnosis instead of swapping parts
//   electricity.html?v=ecu      → … about the ECU and sensors
//   electricity.html            → the default headline
//
// utm_source / utm_campaign / utm_content (and fbclid) are added to the "notes" column.
const ELEC_CONFIG = {
  // Date of the next session, e.g. '5 ديسمبر 2026'. Empty = the page says
  // "we call you with the next date" instead of showing a date.
  nextSession: '',

  // Meta Pixel ID. Empty = no pixel.
  metaPixelId: '',

  variants: {
    beginner: {
      h1: 'ابدأ في كهرباء السيارات<br>من الصفر',
      lead: 'لا تشترط الدورة أي خبرة سابقة. 10 أيام من قانون أوم إلى جهاز التشخيص.',
    },
    diag: {
      h1: 'اعرف العطل<br>قبل أن تبدّل القطعة',
      lead: 'منهجية تشخيص كهربائي كاملة: الأفوميتر، المخططات، الأسيلوسكوب و OBD.',
    },
    ecu: {
      h1: 'افهم الكنترول<br>والحساسات',
      lead: 'كيف يقرأ الـ ECU الكابتورات ويتحكم في الرشاشات، وكيف تختبر كل حساس خطوة بخطوة.',
    },
  },
};

(function () {
  const params = new URLSearchParams(window.location.search);

  const variant = ELEC_CONFIG.variants[params.get('v')];
  if (variant) {
    document.querySelectorAll('[data-ad]').forEach((el) => {
      const text = variant[el.dataset.ad];
      if (text) el.innerHTML = text;
    });
  }

  // Show the date rows only when a date is set; otherwise keep the "we call you" line.
  if (ELEC_CONFIG.nextSession) {
    document.querySelectorAll('[data-session]').forEach((el) => { el.textContent = ELEC_CONFIG.nextSession; });
    document.querySelectorAll('[data-session-row]').forEach((el) => { el.hidden = false; });
    document.querySelectorAll('[data-session-empty]').forEach((el) => { el.hidden = true; });
  }

  const fromAd = params.has('utm_source') || params.has('fbclid');
  if (fromAd) document.documentElement.classList.add('from-ad');

  const source = ['utm_source', 'utm_campaign', 'utm_content', 'v']
    .filter((k) => params.get(k))
    .map((k) => k + '=' + params.get(k));
  if (params.has('fbclid')) source.push('fbclid');
  window.SIGNUP_SOURCE = source.join(', ');

  if (ELEC_CONFIG.metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', ELEC_CONFIG.metaPixelId);
    fbq('track', 'PageView');
  }

  window.onSignupSuccess = function () {
    if (window.fbq) window.fbq('track', 'Lead', { content_name: 'electricity' });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#signup"]');
    if (!link) return;
    const name = document.getElementById('name');
    if (!name) return;
    event.preventDefault();
    document.getElementById('signupForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => name.focus({ preventScroll: true }), 450);
  });

  const bar = document.getElementById('stickyCta');
  const form = document.getElementById('signupForm');
  if (bar && form && 'IntersectionObserver' in window) {
    bar.hidden = false;
    new IntersectionObserver(([entry]) => {
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', show);
    }).observe(form);
  }
})();
