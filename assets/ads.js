// Ad landing settings for turbo.html. Edit this block; nothing else needs to change.
//
//   turbo.html?v=hotel   → the hero headline matches an ad about the hotel stay
//   turbo.html?v=cert    → … about the certificate
//   turbo.html?v=beginner→ … about starting with no experience
//   turbo.html           → the default headline
//
// utm_source / utm_campaign / utm_content (and fbclid) from the ad link are added to
// the "notes" column of the sheet, so each signup shows which ad brought it.
const AD_CONFIG = {
  // Shown everywhere the page says "الدورة القادمة" (every element with data-session).
  nextSession: '7 نوفمبر 2026',

  // Meta Pixel ID from Events Manager, e.g. '123456789012345'. Empty = no pixel.
  // When set, the page sends PageView, and Lead after a signup is saved.
  metaPixelId: '',

  variants: {
    hotel: {
      h1: 'تعلّم التيربو في 10 أيام<br>والمبيت في الفندق',
      lead: 'تدريب عملي في باتنة، مع المبيت في الفندق للمتربصين.',
    },
    cert: {
      h1: 'احترف التيربو<br>واحصل على شهادة',
      lead: 'شهادة دولة معتمدة بشراكة مع المعهد العالي نيسي برو للتكوين.',
    },
    beginner: {
      h1: 'ابدأ في التيربو<br>من الصفر',
      lead: 'لا تشترط الدورة أي خبرة سابقة. 10 أيام تدريب عملي في باتنة.',
    },
  },
};

(function () {
  const params = new URLSearchParams(window.location.search);

  // Message match: swap the hero copy for the ad's variant (fixed texts only, never URL text).
  const variant = AD_CONFIG.variants[params.get('v')];
  if (variant) {
    document.querySelectorAll('[data-ad]').forEach((el) => {
      const text = variant[el.dataset.ad];
      if (text) el.innerHTML = text;
    });
  }

  document.querySelectorAll('[data-session]').forEach((el) => {
    el.textContent = AD_CONFIG.nextSession;
  });

  // Visitors from an ad: keep the header on the signup, not on other pages.
  const fromAd = params.has('utm_source') || params.has('fbclid');
  if (fromAd) document.documentElement.classList.add('from-ad');

  // Where this visitor came from, written into the notes column on submit (see script.js).
  const source = ['utm_source', 'utm_campaign', 'utm_content', 'v']
    .filter((k) => params.get(k))
    .map((k) => k + '=' + params.get(k));
  if (params.has('fbclid')) source.push('fbclid');
  window.SIGNUP_SOURCE = source.join(', ');

  if (AD_CONFIG.metaPixelId) {
    /* Meta Pixel base code */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', AD_CONFIG.metaPixelId);
    fbq('track', 'PageView');
  }

  // Called by script.js once the sheet has saved the signup.
  window.onSignupSuccess = function () {
    if (window.fbq) window.fbq('track', 'Lead', { content_name: 'turbo' });
  };

  // Every "احجز مقعدك" link lands on the form with the name field ready to type.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#signup"]');
    if (!link) return;
    const name = document.getElementById('name');
    if (!name) return;
    event.preventDefault();
    document.getElementById('signupForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => name.focus({ preventScroll: true }), 450);
  });

  // Mobile sticky bar: shown once the form has scrolled out of view.
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
