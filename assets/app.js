// SM ACADEMY — behaviour shared by every page. Data lives in assets/data.js.
(function () {
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const course = SM.courses.find((c) => c.id === root.dataset.course) || null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const waUrl = (text) => 'https://wa.me/' + SM.whatsapp + '?text=' + encodeURIComponent(text);
  const pad = (n) => String(n).padStart(2, '0');

  // A session is shown until the end of its day; after that the page stops promising a date.
  function sessionOf(c) {
    if (!c || !c.session) return null;
    return new Date(c.session.iso + 'T23:59:59') >= new Date() ? c.session : null;
  }

  /* ----- Rendered blocks ----- */
  function cardImage(c, sizes) {
    const srcset = c.imageSrcset ? ` srcset="${c.imageSrcset}" sizes="${sizes}"` : '';
    return `<img src="${c.image}"${srcset} alt="${c.imageAlt}" width="640" height="800" loading="lazy" decoding="async" style="object-position:${c.imagePosition}">`;
  }

  function renderCards() {
    document.querySelectorAll('[data-cards]').forEach((grid) => {
      const skip = grid.dataset.cards; // a course page leaves itself out
      grid.innerHTML = SM.courses.filter((c) => c.id !== skip).map((c) => `
        <a class="cc rv" href="${c.href}" data-course="${c.id}" style="--n:${SM.courses.indexOf(c)}">
          <figure class="cc__media">${cardImage(c, '(min-width: 1100px) 420px, (min-width: 760px) 50vw, 100vw')}</figure>
          <span class="cc__n latin">${pad(SM.courses.indexOf(c) + 1)}</span>
          <h3 class="cc__t">${c.name}</h3>
          <p class="cc__d">${c.description}</p>
          <ul class="tags">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          <span class="cc__go">اكتشف الدورة <i class="i i-arrow" aria-hidden="true"></i></span>
        </a>`).join('');
    });
  }

  function renderCourseRows() {
    const list = document.querySelector('[data-course-rows]');
    if (!list) return;
    list.innerHTML = SM.courses.map((c, i) => {
      const session = sessionOf(c);
      const specs = c.specs.concat([['الدورة القادمة', session ? session.day + ' ' + session.month : 'سجّل ونتصل بك بالموعد']]);
      return `
        <article class="course-row" id="${c.id}" data-course="${c.id}">
          <div class="ticks rv"><figure class="fig fig--45 rv-mask">${cardImage(c, '(min-width: 900px) 40vw, 100vw')}</figure></div>
          <div class="course-row__body">
            <p class="course-row__n latin rv">${pad(i + 1)} / ${pad(SM.courses.length)}</p>
            <h2 class="h2 rv">${c.name}</h2>
            <p class="lead rv">${c.description}</p>
            <dl class="spec rv">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
            <div class="actions rv">
              <a class="btn" href="${c.href}">اكتشف الدورة <i class="i i-arrow" aria-hidden="true"></i></a>
              <a class="btn btn--ghost" href="${waUrl(c.whatsappText)}" target="_blank" rel="noopener"><i class="i i-wa" aria-hidden="true"></i> اسأل عن هذه الدورة</a>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function renderSessions() {
    const list = document.querySelector('[data-sessions]');
    if (!list) return;
    // Dated sessions first, soonest at the top.
    const sorted = SM.courses.slice().sort((a, b) => {
      const sa = sessionOf(a), sb = sessionOf(b);
      if (sa && sb) return sa.iso < sb.iso ? -1 : 1;
      return sa ? -1 : sb ? 1 : 0;
    });
    list.innerHTML = sorted.map((c) => {
      const session = sessionOf(c);
      const date = session
        ? `<p class="ses__date"><span class="ses__d">${session.day}</span><span class="ses__m">${session.month}</span></p>`
        : '<p class="ses__date ses__date--open">سجّل الآن ونتصل بك بموعد الدورة القادمة.</p>';
      const note = [c.tags[0], session && session.note].filter(Boolean).join(' · ');
      return `
        <li class="ses rv" data-course="${c.id}">
          ${date}
          <div class="ses__b"><h3>${c.name}</h3><p>${note}</p></div>
          <a class="btn ${session ? '' : 'btn--ghost'}" href="${c.href}#signup">${session ? 'احجز مقعدك' : 'سجّل اهتمامك'} <i class="i i-arrow" aria-hidden="true"></i></a>
        </li>`;
    }).join('');
  }

  /* ----- Header, menu, scroll ----- */
  function setupHeader() {
    const header = document.getElementById('hdr');
    const media = document.querySelector('[data-parallax]');
    const bar = document.getElementById('bar');
    const form = document.getElementById('signupForm');
    const wide = window.matchMedia('(min-width: 960px)');
    let formVisible = false;
    let ticking = false;

    if (bar && form) {
      bar.hidden = false;
      root.classList.add('has-bar');
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => { formVisible = entry.isIntersecting; update(); }).observe(form);
      }
    }

    function update() {
      ticking = false;
      const y = window.scrollY;
      if (header) header.classList.toggle('is-solid', y > 8);
      // The booking bar shows on phones once the form is out of sight.
      if (bar) bar.classList.toggle('is-visible', !formVisible && y > 320);
      // The hero photo drifts slower than the page (wide screens only).
      if (media && !reduceMotion && wide.matches && y < window.innerHeight * 1.2) {
        media.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0)';
      }
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function setupMenu() {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    if (!btn || !menu) return;
    const set = (open) => {
      root.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
      menu.inert = !open;
    };
    set(false);
    btn.addEventListener('click', () => set(!root.classList.contains('menu-open')));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) set(false); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.classList.contains('menu-open')) { set(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 1000px)').addEventListener('change', () => set(false));
  }

  function setupReveal() {
    const items = document.querySelectorAll('.rv, .rv-mask');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => observer.observe(el));
  }

  function setupFaq() {
    document.querySelectorAll('.faq__q').forEach((question) => {
      question.addEventListener('click', () => {
        const open = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
  }

  /* ----- Course page: ad variant, session date, tracking ----- */
  function setupCoursePage() {
    if (!course) return;

    // Message match: the hero copy follows the ad (fixed texts only, never text from the URL).
    const variant = course.variants[params.get('v')];
    if (variant) {
      document.querySelectorAll('[data-ad]').forEach((el) => {
        const text = variant[el.dataset.ad];
        if (text) el.innerHTML = text;
      });
    }

    const session = sessionOf(course);
    if (session) {
      document.querySelectorAll('[data-session]').forEach((el) => { el.textContent = session.day + ' ' + session.month; });
      document.querySelectorAll('[data-session-on]').forEach((el) => { el.hidden = false; });
      document.querySelectorAll('[data-session-off]').forEach((el) => { el.hidden = true; });
    }

    if (params.has('utm_source') || params.has('fbclid')) root.classList.add('from-ad');

    // Where this visitor came from, written into the notes column on submit.
    const source = ['utm_source', 'utm_campaign', 'utm_content', 'v']
      .filter((k) => params.get(k))
      .map((k) => k + '=' + params.get(k));
    if (params.has('fbclid')) source.push('fbclid');
    window.SIGNUP_SOURCE = source.join(', ');

    if (course.metaPixelId) {
      /* Meta Pixel base code */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', course.metaPixelId);
      window.fbq('track', 'PageView');
    }
    window.onSignupSuccess = function () {
      if (window.fbq) window.fbq('track', 'Lead', { content_name: course.id });
    };

    // Every "book your seat" link lands on the form with the name field ready to type.
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href="#signup"]');
      const form = document.getElementById('signupForm');
      const name = document.getElementById('name');
      if (!link || !form || !name) return;
      event.preventDefault();
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      window.setTimeout(() => name.focus({ preventScroll: true }), 450);
    });
  }

  /* ----- Signup form (posts to the Google Sheet through a hidden iframe) ----- */
  function setupChoiceGroups() {
    document.querySelectorAll('.choices').forEach((group) => {
      const hidden = group.parentElement.querySelector('input[type="hidden"]');
      if (!hidden) return;
      group.querySelectorAll('.choice-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('.choice-btn').forEach((b) => {
            b.classList.remove('selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('selected');
          btn.setAttribute('aria-pressed', 'true');
          hidden.value = btn.dataset.value;
        });
      });
    });
  }

  // form.reset() does not clear hidden inputs filled by script, so the next
  // submission would carry the previous answers. Clear them explicitly.
  function clearChoices(form) {
    form.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    });
    form.querySelectorAll('.choices').forEach((group) => {
      const hidden = group.parentElement.querySelector('input[type="hidden"]');
      if (hidden) hidden.value = '';
    });
  }

  function setFieldError(field, text) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    const error = field.closest('.field').querySelector('.field-error');
    if (error) error.textContent = text;
  }

  function validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      if (!field.value.trim()) { setFieldError(field, 'هذا الحقل مطلوب.'); valid = false; }
    });

    // Algerian numbers: 0XXXXXXXXX or +213XXXXXXXXX, with or without spaces.
    const phone = form.querySelector('#phone');
    if (phone && phone.value.trim()) {
      let digits = phone.value.replace(/\D/g, '');
      if (digits.startsWith('213')) digits = '0' + digits.slice(3);
      if (!/^0\d{8,9}$/.test(digits)) { setFieldError(phone, 'رقم الهاتف غير صحيح. مثال: 0563 53 10 42'); valid = false; }
    }

    const email = form.querySelector('#email');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setFieldError(email, 'البريد الإلكتروني غير صالح.');
      valid = false;
    }
    return valid;
  }

  function setupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    const iframe = document.getElementById('hidden_iframe');
    const submit = document.getElementById('submitBtn');
    const message = document.getElementById('formMessage');
    const label = submit.textContent;
    let submitted = false;
    let timeoutId = null;

    form.action = SM.formUrl;
    const say = (text, type) => { message.textContent = text; message.className = 'form-message' + (type ? ' ' + type : ''); };
    const release = () => { submit.disabled = false; submit.textContent = label; };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelectorAll('.invalid').forEach((el) => { el.classList.remove('invalid'); el.removeAttribute('aria-invalid'); });
      form.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });

      if (!validate(form)) {
        say('الرجاء تصحيح الحقول المظللة.', 'error');
        const first = form.querySelector('input.invalid, textarea.invalid');
        if (first) {
          const details = first.closest('details');
          if (details) details.open = true;
          first.focus();
        }
        return;
      }

      submitted = true;
      submit.disabled = true;
      submit.textContent = 'جارٍ الإرسال...';
      say('');

      // The ad source goes into the notes column; the field then shows what the visitor typed.
      const notes = form.querySelector('#notes');
      const typed = notes ? notes.value : '';
      if (notes && window.SIGNUP_SOURCE) notes.value = (typed ? typed + ' ' : '') + '[المصدر: ' + window.SIGNUP_SOURCE + ']';
      form.submit();
      if (notes) notes.value = typed;

      // If the server never answers, do not leave the button disabled forever.
      timeoutId = window.setTimeout(() => {
        if (!submitted) return;
        submitted = false;
        release();
        say('تعذّر الإرسال. تحقّق من اتصالك وحاول مرة أخرى.', 'error');
      }, 20000);
    });

    iframe.addEventListener('load', () => {
      if (!submitted) return; // ignores the first empty load of the iframe
      submitted = false;
      window.clearTimeout(timeoutId);
      release();
      form.reset();
      clearChoices(form);
      say('تم إرسال بياناتك بنجاح! سنتواصل معك قريباً.', 'success');
      if (typeof window.onSignupSuccess === 'function') window.onSignupSuccess();
    });
  }

  renderCards();
  renderCourseRows();
  renderSessions();
  setupHeader();
  setupMenu();
  setupFaq();
  setupCoursePage();
  setupChoiceGroups();
  setupForm();
  setupReveal();
})();
