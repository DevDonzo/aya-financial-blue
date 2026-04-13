const crypto = require('crypto');

function coerceString(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

function stripHtml(html) {
  return coerceString(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
}

function normalizeText(value) {
  return coerceString(value)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const textInput = coerceString(inputData.text);
const htmlInput = coerceString(inputData.html);

const sourceText = textInput || stripHtml(htmlInput);
const normalizedText = normalizeText(sourceText);
const hash = crypto.createHash('sha256').update(normalizedText, 'utf8').digest('hex');

return {
  normalized_text: normalizedText,
  sha256: hash,
};
