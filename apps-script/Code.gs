// انسخ هذا الكود إلى Google Apps Script المرتبط بجدول البيانات (Google Sheet)
// راجع README.md لخطوات الإنشاء والنشر الكاملة.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;

    ensureHeaderRow(sheet);

    sheet.appendRow([
      new Date(),
      params.name || '',
      params.phone || '',
      params.email || '',
      params.course || '',
      params.experience || '',
      params.workedBefore || '',
      params.hasCertificate || '',
      params.notes || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// زيارة رابط الـ Web App في المتصفح تستدعي هذه الدالة — للتأكد أن النشر يعمل.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'SM TURBO endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['التاريخ', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'الدورة', 'مدة الخبرة', 'عمل من قبل', 'شهادة من مركز تكوين', 'ملاحظات']);
  }
}
