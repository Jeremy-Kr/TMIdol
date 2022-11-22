import { authService } from './firebase.js';
import { handleLocation } from './router.js';
import { getSearchList, autocomp } from './search.js';

window.addEventListener('hashchange', handleLocation);

// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener('DOMContentLoaded', function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 화면 표시
    handleLocation();
    const hash = window.location.hash;
  });
});

window.getSearchList = getSearchList;
window.autocomp = autocomp;
