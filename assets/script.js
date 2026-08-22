// ضع هنا رابط Google Apps Script Web App بعد نشره (اتبع خطوات README.md)
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const iframe = document.getElementById('hidden_iframe');
  const submitBtn = document.getElementById('submitBtn');
  const message = document.getElementById('formMessage');

  form.action = APPS_SCRIPT_URL;

  let submitted = false;

  form.addEventListener('submit', (event) => {
    if (APPS_SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
      message.textContent = "الرجاء ضبط رابط Google Apps Script أولاً (راجع README.md).";
      message.className = "form-message error";
      event.preventDefault();
      return;
    }
    submitted = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "جارٍ الإرسال...";
    message.textContent = "";
    message.className = "form-message";
  });

  iframe.addEventListener('load', () => {
    if (!submitted) return; // يتجاهل أول تحميل فارغ للـ iframe عند فتح الصفحة
    submitted = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "إرسال";
    form.reset();
    message.textContent = "تم إرسال بياناتك بنجاح! سنتواصل معك قريباً.";
    message.className = "form-message success";
  });
});
