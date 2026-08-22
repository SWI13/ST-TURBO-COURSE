// انسخ هذا الكود إلى Google Apps Script المرتبط بجدول البيانات (Google Sheet)
// راجع README.md لخطوات الإنشاء والنشر الكاملة.
//
// لتنسيق الجدول: اختر الدالة setupSheet من القائمة في الأعلى ثم اضغط Run (تشغيل).
// تشغيلها آمن وقابل للتكرار — لا تحذف أي بيانات موجودة.

var HEADERS = [
  'التاريخ',
  'الاسم',
  'الهاتف',
  'البريد الإلكتروني',
  'الدورة',
  'مدة الخبرة',
  'عمل من قبل',
  'شهادة من مركز تكوين',
  'ملاحظات'
];

var COLUMN_WIDTHS = [150, 170, 130, 210, 250, 130, 110, 165, 280];

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
    sheet.appendRow(HEADERS);
  }
}

/**
 * تنسيق وتنظيم الجدول. شغّلها مرة واحدة من محرّر Apps Script.
 * لا تمسّ البيانات — تغيّر الشكل فقط.
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  ensureHeaderRow(sheet);

  // اتجاه الجدول من اليمين إلى اليسار
  sheet.setRightToLeft(true);

  // تسمية الورقة
  try {
    if (sheet.getName() !== 'التسجيلات') sheet.setName('التسجيلات');
  } catch (err) {
    // الاسم مستخدم مسبقًا — نتجاهل
  }

  var lastCol = HEADERS.length;

  // صف العناوين
  sheet.getRange(1, 1, 1, lastCol)
    .setValues([HEADERS])
    .setFontWeight('bold')
    .setFontSize(11)
    .setFontColor('#ffffff')
    .setBackground('#c1121f')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);

  // عرض الأعمدة
  for (var i = 0; i < COLUMN_WIDTHS.length; i++) {
    sheet.setColumnWidth(i + 1, COLUMN_WIDTHS[i]);
  }

  // حذف الأعمدة الزائدة — فقط إن كانت فارغة تمامًا
  var maxCols = sheet.getMaxColumns();
  if (maxCols < lastCol) {
    sheet.insertColumnsAfter(maxCols, lastCol - maxCols);
  } else if (maxCols > lastCol) {
    var extra = sheet.getRange(1, lastCol + 1, sheet.getMaxRows(), maxCols - lastCol);
    if (extra.isBlank()) {
      sheet.deleteColumns(lastCol + 1, maxCols - lastCol);
    }
  }

  var maxRows = sheet.getMaxRows();
  if (maxRows > 1) {
    var body = sheet.getRange(2, 1, maxRows - 1, lastCol);
    body.setVerticalAlignment('middle')
        .setHorizontalAlignment('right')
        .setFontSize(10);

    // تنسيق التاريخ
    sheet.getRange(2, 1, maxRows - 1, 1)
      .setNumberFormat('yyyy-mm-dd  hh:mm')
      .setHorizontalAlignment('center');

    // الهاتف كنص حتى لا يفقد الصفر الأول
    sheet.getRange(2, 3, maxRows - 1, 1)
      .setNumberFormat('@')
      .setHorizontalAlignment('center');

    // أعمدة نعم/لا في المنتصف
    sheet.getRange(2, 6, maxRows - 1, 3).setHorizontalAlignment('center');

    // التفاف النص في عمود الملاحظات
    sheet.getRange(2, lastCol, maxRows - 1, 1).setWrap(true);
  }

  applyBanding(sheet, lastCol);
  applyFilter(sheet, lastCol);
  highlightYesNo(sheet, lastCol);

  SpreadsheetApp.getActiveSpreadsheet().toast('تم تنسيق الجدول بنجاح', 'SM TURBO', 5);
}

function applyBanding(sheet, lastCol) {
  var range = sheet.getRange(1, 1, sheet.getMaxRows(), lastCol);

  // إزالة أي تلوين سابق حتى لا يتكرر
  var existing = sheet.getBandings();
  for (var i = 0; i < existing.length; i++) {
    existing[i].remove();
  }

  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  // مواءمة ألوان التلوين مع لون العنوان
  var bandings = sheet.getBandings();
  if (bandings.length > 0) {
    bandings[0]
      .setHeaderRowColor('#c1121f')
      .setFirstRowColor('#ffffff')
      .setSecondRowColor('#f7f7f8');
  }
}

function applyFilter(sheet, lastCol) {
  var existing = sheet.getFilter();
  if (existing) existing.remove();

  var lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(1, 1, lastRow, lastCol).createFilter();
}

/**
 * تلوين شرطي: "نعم" أخضر و"لا" رمادي في عمودَي
 * "عمل من قبل" و"شهادة من مركز تكوين".
 */
function highlightYesNo(sheet, lastCol) {
  var maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;

  var target = sheet.getRange(2, 7, maxRows - 1, 2); // العمودان 7 و 8

  var yes = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('نعم')
    .setBackground('#d9f2e3')
    .setFontColor('#0b6b3a')
    .setRanges([target])
    .build();

  var no = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('لا')
    .setBackground('#f1f1f3')
    .setFontColor('#5c5c66')
    .setRanges([target])
    .build();

  sheet.setConditionalFormatRules([yes, no]);
}
