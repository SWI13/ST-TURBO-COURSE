// ضع هنا رابط Google Apps Script Web App بعد نشره (اتبع خطوات README.md)
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupBackToTop();
  setupReveal();
  setupCounters();
  setupFaq();
  setupChoiceGroups();
  setupForm();
});

function setupNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
}

function setupFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      question.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

function setupChoiceGroups() {
  document.querySelectorAll('.choice-group').forEach((group) => {
    const hiddenInput = group.parentElement.querySelector('input[type="hidden"]');
    if (!hiddenInput) return;

    group.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.choice-btn').forEach((b) => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        hiddenInput.value = btn.dataset.value;
        group.classList.remove('invalid');
      });
    });
  });
}

// form.reset() restores inputs to their value attribute, and these hidden inputs
// are filled by JS (no attribute), so their values survive a reset. Clearing them
// explicitly prevents the next submission from carrying the previous answers.
function clearChoiceSelections(form) {
  form.querySelectorAll('.choice-btn').forEach((btn) => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });

  form.querySelectorAll('.choice-group').forEach((group) => {
    group.classList.remove('invalid');
    const hiddenInput = group.parentElement.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = '';
  });
}

function setupForm() {
  const form = document.getElementById('signupForm');
  const iframe = document.getElementById('hidden_iframe');
  const submitBtn = document.getElementById('submitBtn');
  const message = document.getElementById('formMessage');

  form.action = APPS_SCRIPT_URL;

  let submitted = false;
  let timeoutId = null;

  const resetButton = () => {
    submitBtn.disabled = false;
    submitBtn.textContent = "إرسال";
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFieldErrors(form);

    if (!validateForm(form)) {
      message.textContent = "الرجاء تصحيح الحقول المظللة.";
      message.className = "form-message error";
      focusFirstInvalid(form);
      return;
    }

    if (APPS_SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
      message.textContent = "الرجاء ضبط رابط Google Apps Script أولاً (راجع README.md).";
      message.className = "form-message error";
      return;
    }

    submitted = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "جارٍ الإرسال...";
    message.textContent = "";
    message.className = "form-message";
    form.submit();

    // إن لم يستجب الخادم، لا نترك الزر معطّلاً إلى الأبد
    timeoutId = window.setTimeout(() => {
      if (!submitted) return;
      submitted = false;
      resetButton();
      message.textContent = "تعذّر الإرسال. تحقّق من اتصالك وحاول مرة أخرى.";
      message.className = "form-message error";
    }, 20000);
  });

  iframe.addEventListener('load', () => {
    if (!submitted) return; // يتجاهل أول تحميل فارغ للـ iframe عند فتح الصفحة
    submitted = false;
    window.clearTimeout(timeoutId);
    resetButton();
    form.reset();
    clearChoiceSelections(form);
    message.textContent = "تم إرسال بياناتك بنجاح! سنتواصل معك قريباً.";
    message.className = "form-message success";
  });
}

function focusFirstInvalid(form) {
  // نقصر البحث على عناصر الإدخال: مجموعات الاختيار تحمل نفس الصنف وهي غير قابلة للتركيز
  const firstInvalid = form.querySelector('input.invalid, select.invalid, textarea.invalid');
  if (!firstInvalid) return;

  // الحقول المخفية لا تقبل التركيز — ننتقل إلى أول زر في مجموعة الاختيار
  const target = firstInvalid.type === 'hidden'
    ? firstInvalid.parentElement.querySelector('.choice-btn')
    : firstInvalid;

  if (target) target.focus();
}

function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    if (!field.value.trim()) {
      setFieldError(field, "هذا الحقل مطلوب.");
      valid = false;
    }
  });

  const email = form.querySelector('#email');
  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setFieldError(email, "البريد الإلكتروني غير صالح.");
    valid = false;
  }

  return valid;
}

function setFieldError(field, text) {
  field.classList.add('invalid');

  if (field.type === 'hidden') {
    const group = field.parentElement.querySelector('.choice-group');
    if (group) group.classList.add('invalid');
  }

  const errorEl = field.closest('.form-row').querySelector('.field-error');
  if (errorEl) errorEl.textContent = text;
}

function clearFieldErrors(form) {
  form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
}
