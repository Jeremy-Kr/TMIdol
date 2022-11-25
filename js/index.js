import { authService } from './firebase.js';
import { handleLocation } from './router.js';
import { getSearchList, autoComp } from './search.js';
import { getPopularList, sendMain } from './popularpost.js';
import { postInput, postCreateBtn } from './postcreat.js';
import { onFileChange } from './utils.js';
import {
  openLoginModal,
  closeLoginModal,
  openSignUpModal,
  closeSignUpModal,
  submitSignUp,
  loginForm,
  singUpAndLoginComp,
  currentUserProfileComp,
  profileImageUpload,
  profileNicknameEdit,
  logout,
} from './sub.js';
import { getPostsAndDisplay, deletePost, updatePostPopup } from './post.js';


window.addEventListener('hashchange', handleLocation);
// document.addEventListener('DOMContentLoaded', listData);
// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener('DOMContentLoaded', function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged(async (user) => {
    // Firebase 연결되면 화면 표시
    await handleLocation();
    const hash = window.location.hash;
    if (user) {
      postCreateBtn();
      await getPostsAndDisplay();
      currentUserProfileComp();
    } else {
      singUpAndLoginComp();
      getPostsAndDisplay();
    }
  });
});

// onclick, onchange, onsubmit 이벤트 핸들러 리스트

// profile 수정 기능
window.profileImageUpload = profileImageUpload;
window.profileNicknameEdit = profileNicknameEdit;

// 자동 완성 기능
window.getSearchList = getSearchList;
window.autoComp = autoComp;

// 인기 게시물 기능
window.getPopularList = getPopularList;
window.sendMain = sendMain;

// POST CRUD 기능
window.postInput = postInput;
window.deletePost = deletePost;
window.updatePostPopup = updatePostPopup;

// 사진 업로드 기능
window.onFileChange = onFileChange;

// modal
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openSignUpModal = openSignUpModal;
window.closeSignUpModal = closeSignUpModal;
window.submitSignUp = submitSignUp;
window.loginForm = loginForm;

// 로그아웃
window.logout = logout;

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
