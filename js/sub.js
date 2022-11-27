import { emailRegex } from './utils.js';
import { storageService, dbService, authService } from './firebase.js';
import { postList } from './postList.js';
import { postCreateBtn } from './postcreat.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import {
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export function singUpAndLoginComp() {
  const leftComp = document.querySelector('.left-comp');
  leftComp.innerHTML = '';
  const temp = `<p class="login-notice">TMIDOL을 통해 전세계에 있는 <br>아이돌 팬들과 소통해보세요!</p>
                <div class="buttons">
                  <button href="#" onclick="openLoginModal()">LOGIN</button>
                  <button href="#" onclick="openSignUpModal()">SIGN UP</button>
                </div>`;
  const signPanel = document.createElement('div');
  signPanel.className = 'sign-panel';
  signPanel.innerHTML = temp;

  leftComp.append(signPanel);
}

export function currentUserProfileComp() {
  const leftComp = document.querySelector('.left-comp');
  leftComp.innerHTML = '';
  const userProfileImg =
    authService.currentUser.photoURL || '../assets/imgs/nullimage.png';
  const userNickname = authService.currentUser.displayName || '익명사용자';
  let userEmailId;
  if (authService.currentUser.email) {
    userEmailId = `@${authService.currentUser.email.split('@')[0]}`;
  } else {
    if (authService.currentUser.providerData[0].email) {
      userEmailId = `@${
        authService.currentUser.providerData[0].email.split('@')[0]
      }`;
    } else if (authService.currentUser.reloadUserInfo.screenName) {
      userEmailId = `@${authService.currentUser.reloadUserInfo.screenName}`;
    } else {
      userEmailId = '@익명사용자';
    }
  }

  const temp = `<div class="user-profile">
  <label>
  <img
    src="${userProfileImg}"
    class="user-profile-image"
    alt="유져 프로필 사진"
  />
  <input style="display:none" type="file" accept='images/*' onchange="profileImageUpload(event)"/>
  </label>
  <div class="user-names">
      <p>
      ${userNickname}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            class="bi bi-pencil"
            viewBox="0 0 16 16"
            onclick="profileNicknameEdit(event)"
          >
            <path
              d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
            />
          </svg>
    </p>
    <p>${userEmailId}</p>
  </div>
</div>
<div class="profile-elements">
  <button class="profile-elements-button" onclick="myPosts(event)">My Posts</button>
  <button class="profile-elements-button" onclick="logout(event)">Logout</button>
</div>`;

  leftComp.innerHTML = temp;
}

export async function myPosts(event) {
  const postsContainer = document.querySelector('.post-container');
  postsContainer.innerText = '';
  const getPostsData = [];
  const q = query(
    collection(dbService, 'posts'),
    where('userUID', '==', authService.currentUser.uid),
    orderBy('postDate', 'desc')
  );
  const docs = await getDocs(q);
  docs.forEach((doc) => {
    const postData = {
      id: doc.id,
      ...doc.data(),
    };
    getPostsData.push(postData);
  });
  let currentUserUID;
  if (authService.currentUser) {
    currentUserUID = authService.currentUser.uid;
  }
  postList(getPostsData);

  const myPostTitle = document.createElement('div');
  myPostTitle.innerText = '📂  My Posts  📂';
  myPostTitle.className = 'my-post-title';

  if (getPostsData.length === 0) {
    myPostTitle.innerText =
      '작성하신 게시글이 없습니다🥲 \n새로운 게시글을 작성 해 팬들과 소통해보세요!';
  }

  const info = document.querySelector('.artist-info');
  info.innerHTML = '';
  info.append(myPostTitle);
}

export function profileNicknameEdit(event) {
  const profileNameContainer = document.querySelector('.user-names');
  profileNameContainer.innerHTML = '';

  const newNicknameInputContainer = document.createElement('div');
  newNicknameInputContainer.className = 'new-nickname-input-container';

  const newNicknameInput = document.createElement('input');
  newNicknameInput.className = 'new-nickname-input';
  newNicknameInput.value = authService.currentUser.displayName || '익명사용자';
  newNicknameInput.maxLength = 7;

  const editNickname = document.createElement('button');
  editNickname.addEventListener('click', updateNickname);
  editNickname.className = 'nickname-edit-button';
  editNickname.innerText = '수정';

  newNicknameInputContainer.append(newNicknameInput);
  newNicknameInputContainer.append(editNickname);
  profileNameContainer.append(newNicknameInputContainer);
}

export async function updateNickname() {
  const userNewNickname = document.querySelector('.new-nickname-input').value;
  await updateProfile(authService.currentUser, {
    displayName: userNewNickname ? userNewNickname : null,
  })
    .then(() => {
      currentUserProfileComp();
    })
    .catch((e) => {
      console.log(e);
    });
}

export async function profileImageUpload(event) {
  const imgRef = ref(
    storageService,
    `userProfileImgs/${authService.currentUser.uid}`
  );
  let userProfileImgURL;
  const isImgOnStorage = await getMetadata(imgRef).catch((e) => console.log(e));
  if (isImgOnStorage) {
    await deleteObject(imgRef).catch((error) => console.log(error));
    const res = await uploadBytes(imgRef, event.target.files[0], 'data_url');
    userProfileImgURL = await getDownloadURL(res.ref);
  } else {
    const res = await uploadBytes(imgRef, event.target.files[0], 'data_url');
    userProfileImgURL = await getDownloadURL(res.ref);
  }
  await updateProfile(authService.currentUser, {
    photoURL: userProfileImgURL ? userProfileImgURL : null,
  })
    .then(() => {
      currentUserProfileComp();
      document.querySelector('.main-comp').childNodes[0].remove();
      postCreateBtn();
    })
    .catch((e) => {
      console.log(e);
    });
}

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
    if (!email) return alert('이메일은 반드시 입력되어야 합니다.');
    if (matchedEmail === null) return alert('이메일 형식에 맞게 입력해 주세요');
    if (!nickname) return alert('닉네임은 반드시 입력되어야 합니다.');
    if (password.length < 6) return alert('비밀번호는 6자 이상이여야 합니다.');
    if (!password) return alert('비밀번호는 반드시 입력되어야 합니다.');
    createUserWithEmailAndPassword(authService, email, password, nickname)
      .then((userCredential) => {
        // 회원가입 성공 및 로그인 성공한 경우
        const user = userCredential.user;
        const userUID = user.uid;
        localStorage.setItem('userUID', userUID);
        alert('회원가입 성공!');
      })
      .catch((error) => {
        alert('다시 시도해주세요');
        const errorMessage = error.message;
        // 회원가입 실패 시
      });
  } else {
    alert('비밀번호를 다시 확인 해 주세요!');
  }
}

// home.html에 있는 로그인 form에서 받아온 정보들 넣음 (영주)
export function loginForm() {
  const email = document.getElementById('form-login').email.value;
  const matchedEmail = email.match(emailRegex);
  const password = document.getElementById('form-login').password.value;
  if (!email) return alert('이메일은 반드시 입력되어야 합니다.');
  if (matchedEmail === null) return alert('이메일 형식에 맞게 입력해 주세요');
  if (!password) return alert('비밀번호는 반드시 입력되어야 합니다.');
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
      alert('이메일 또는 비밀번호를 다시 입력 해 주세요.');
      document.getElementById('form-login').email.value = '';
      document.getElementById('form-login').password.value = '';
      closeLoginModal();
    });
}

export const socialLogin = (event) => {
  const { name } = event.target;
  let provider;
  if (name === 'google') {
    provider = new GoogleAuthProvider();
    provider.addScope('email');
  } else if (name === 'github') {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      console.log('error:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export const logout = () => {
  signOut(authService)
    .then(() => {
      // Sign-out successful.
      localStorage.clear();
    })
    .catch((error) => {
      // An error happened.
      console.log('error:', error);
    });
};
