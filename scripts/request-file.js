export default async function requestFile(accept) {
  const element = document.createElement('input');
  element.type = 'file';
  element.accept = accept;
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  
  setTimeout(() => document.body.removeChild(element), 60000);

  return new Promise(resolve => {
    element.addEventListener('input', () => {
      element.files[0].text()
      .then(text => resolve(text));
      document.body.removeChild(element);
    });
  });
}