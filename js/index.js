import { authService } from './firebase.js';
import { handleLocation } from './router.js';
import { getSearchList, autocomp } from './search.js';
import { postInput } from './postcreat.js';

window.addEventListener('hashchange', handleLocation);
// document.addEventListener('DOMContentLoaded', listData);
// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener('DOMContentLoaded', function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 화면 표시
    handleLocation();
    const hash = window.location.hash;
  });
});

// onclick, onchange, onsubmit 이벤트 핸들러 리스트

// 자동 완성 기능
window.getSearchList = getSearchList;
window.autocomp = autocomp;

// POST 작성 기능
window.postInput = postInput;

// window.onToggle = onToggle;
// window.handleAuth = handleAuth;
// window.goToProfile = goToProfile;
// window.socialLogin = socialLogin;
// window.logout = logout;
// window.onFileChange = onFileChange;
// window.changeProfile = changeProfile;
// window.save_comment = save_comment;
// window.update_comment = update_comment;
// window.onEditing = onEditing;
// window.delete_comment = delete_comment;
