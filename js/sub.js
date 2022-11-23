import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { emailRegex } from './utils.js';

const authService = getAuth();

export function openLoginModal() {
  let modal = document.getElementById('modal-notice-login');
  modal.classList.add('active');
}
export function closeLoginModal() {
  let modal = document.getElementById('modal-notice-login');
  modal.classList.remove('active');
}
export function openSignUpModal() {
  let modal = document.getElementById('modal-notice-signup');
  modal.classList.add('active');
}
export function closeSignUpModal() {
  let modal = document.getElementById('modal-notice-signup');
  modal.classList.remove('active');
}

// home.html에 있는 회원가입 form에서 받아온 정보들 넣음 (영주)
export function submitSignUp() {
  const email = document.getElementById('form-signup').email.value;
  const matchedEmail = email.match(emailRegex);
  const nickname = document.getElementById('form-signup').nickname.value;
  const password = document.getElementById('form-signup').password.value;
  const confirmPassword =
    document.getElementById('form-signup').confirmPassword.value;
  if (password === confirmPassword) {
    if (password.length < 6) return alert('비밀번호는 6자 이상이여야 합니다.');
    if (!email) return alert('이메일은 반드시 입력되어야 합니다.');
    if (matchedEmail === null) return alert('이메일 형식에 맞게 입력해 주세요');
    if (!nickname) return alert('닉네임은 반드시 입력되어야 합니다.');
    if (!password) return alert('비밀번호는 반드시 입력되어야 합니다.');
    createUserWithEmailAndPassword(authService, email, password, nickname)
      .then((userCredential) => {
        // 회원가입 성공 및 로그인 성공한 경우
        const user = userCredential.user;
        const userUID = user.uid;
        localStorage.setItem('userUID', userUID);
        console.log(userCredential);
      })
      .then(userInfo())
      .catch((error) => {
        alert('다시 시도해주세요');
        const errorMessage = error.message;
        console.log(errorMessage);
        // 회원가입 실패 시
      });
  } else {
    alert('비밀번호를 다시 확인 해 주세요!');
  }
}

// home.html에 있는 로그인 form에서 받아온 정보들 넣음 (영주)
export function loginForm() {
  const email = document.getElementById('form-login').email.value;
  const password = document.getElementById('form-login').password.value;

  signInWithEmailAndPassword(authService, email, password)
    .then((userCredential) => {
      // 로그인 성공 시
      const user = userCredential.user;
      // 로그인 유져 정보 로컬스토리지에 저장
      const userUID = user.uid;
      localStorage.setItem('userUID', userUID);
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

function userInfo() {
  // 로그인/회원가입 버튼 및 안내문구 비워주기
  // 로컬스토리지 userUID를 활용해서 정보 가져오기
  // 회원 정보 띄워주기
}
