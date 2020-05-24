import Main from './game/Main';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const main = new Main(canvas);

  main.onConnect(() => {
    document.getElementById('connected').classList.remove('inactive');
    document.getElementById('disconnected').classList.add('inactive');
  });
  main.onDisconnect(() => {
    document.getElementById('connected').classList.add('inactive');
    document.getElementById('disconnected').classList.remove('inactive');
  });

  document.addEventListener('keydown', event => {
    main.keydown(event);
  });

  main.start()
});
