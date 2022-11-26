import { authService } from './firebase.js';
import { handleLocation } from './router.js';
import { getSearchList, autoComp, listData } from './search.js';
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
  socialLogin,
  myPosts,
} from './sub.js';
import {
  getPostsAndDisplay,
  deletePost,
  updatePostPopup,
  like,
} from './post.js';

window.addEventListener('hashchange', handleLocation);
// document.addEventListener('DOMContentLoaded', listData);
// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener('DOMContentLoaded', function () {
  // Firebase 연결상태를 감시
  authService.onAuthStateChanged(async (user) => {
    // Firebase 연결되면 화면 표시
    await handleLocation();
    if (user) {
      postCreateBtn();
      await getPostsAndDisplay();
      currentUserProfileComp();
      listData();
      getPopularList();
    } else {
      singUpAndLoginComp();
      getPostsAndDisplay();
      listData();
      getPopularList();
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
window.like = like;

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
window.socialLogin = socialLogin;

// 로그아웃
window.logout = logout;

// 내글 모아보기
window.myPosts = myPosts;
