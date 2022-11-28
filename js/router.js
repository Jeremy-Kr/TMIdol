import { authService } from './firebase.js';

const routes = {
  404: '/pages/404.html',
  '/': '/pages/home.html',
};

export const handleLocation = async () => {
  let path = window.location.hash.replace('#', '');
  const pathName = window.location.pathname;

  // Live Server를 index.html에서 오픈할 경우
  //   if (pathName === "/index.html") {
  //     window.history.pushState({}, "", "/");
  //   }
  if (path.length == 0) {
    path = '/';
  }
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('root').innerHTML = html;
};
