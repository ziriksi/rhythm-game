export default async function loadJSON(src) {
  return await fetch(src).then(res => res.json());
}