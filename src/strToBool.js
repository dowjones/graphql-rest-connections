export default function strToBool(str) {
  if (typeof str === 'boolean') return str;
  return str === 'true';
}
