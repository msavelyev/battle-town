const Hello = require('../../lib/src/Hello');

const hello = new Hello('World!');

window.addEventListener('load', () => {
  const header = document.getElementById('header');
  header.innerText = hello.hello();
});
