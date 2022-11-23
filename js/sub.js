import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
const authService = getAuth();

export function openLoginModal() {
  let modal = document.getElementById("modal-notice-login");
  modal.classList.add("active");
}
export function closeLoginModal() {
  let modal = document.getElementById("modal-notice-login");
  modal.classList.remove("active");
}
export function openSignUpModal() {
  let modal = document.getElementById("modal-notice-signup");
  modal.classList.add("active");
}
export function closeSignUpModal() {
  let modal = document.getElementById("modal-notice-signup");
  modal.classList.remove("active");
}

// home.html에 있는 회원가입 form에서 받아온 정보들 넣음 (영주)
export function submitsignup() {
  // const id = document.getElementById("form-signup").id.value;
  // const nickname = document.getElementById("form-signup").nickname.value;
  const email = document.getElementById("form-signup").email.value;
  const password = document.getElementById("form-signup").password.value;
  // const confirmPassword =
  //   document.getElementById("form-signup").confirmPassword.value;

  createUserWithEmailAndPassword(authService, email, password)
    .then((userCredential) => {
      // 회원가입 성공 및 로그인 성공한 경우
      console.log(userCredential);
    })
    .catch((error) => {
      const errorMessage = error.message;
      // 회원가입 실패 시
    });
}

// home.html에 있는 로그인 form에서 받아온 정보들 넣음 (영주)
export function loginform() {
  const email = document.getElementById("form-login").email.value;
  const password = document.getElementById("form-login").password.value;

  signInWithEmailAndPassword(authService, email, password)
    .then((userCredential) => {
      // 로그인 성공 시
      const user = userCredential.user;
      console.log(user);
      // 로그인 모달 창 닫힘 (영주)
      closeLoginModal();
    })
    .catch((error) => {
      // 로그인 실패 시
      const errorMessage = error.message;
      console.log(errorMessage);
      closeLoginModal();
    });
}
