import { authService, storageService, dbService } from './firebase.js';
import { getPostsAndDisplay } from './post.js';

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import {
  addDoc,
  collection,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

// DOM 노드 생성

const postTitleInput = document.createElement('input');
postTitleInput.type = 'text';
postTitleInput.id = 'postTitle';
postTitleInput.className = 'post-create-title';
postTitleInput.placeholder = '포스트의 제목을 입력해주세요.';
postTitleInput.maxLength = 57;

const postTextArea = document.createElement('textarea');
postTextArea.id = 'postText';
postTextArea.className = 'post-create-text';
postTextArea.placeholder = '포스트의 내용을 입력해주세요.';

const postSelectsContainer = document.createElement('div');
postSelectsContainer.className = 'post-selects-container';

const postImageLabel = document.createElement('label');
postImageLabel.innerText = '사진 업로드';

const postImageInput = document.createElement('input');
postImageInput.type = 'file';
postImageInput.className = 'post-image-input';
postImageInput.accept = 'images/*';

const postArtistTagSelectorLabel = document.createElement('label');
postArtistTagSelectorLabel.innerText = '아티스트 태그 선택';

const postArtistTagSelector = document.createElement('select');
postArtistTagSelector.id = 'artistTag';
postArtistTagSelector.className = 'post-selects-artist-tag';

const artists = [
  'BTS',
  '헬로비너스',
  '프로미스나인',
  'LESSERAFIM',
  '세븐틴',
  '몬스타엑스',
  '에스파',
  '소나무',
];

for (let i = 0; i < artists.length; i++) {
  const artistTagOption = document.createElement('option');
  artistTagOption.innerText = artists[i];
  postArtistTagSelector.appendChild(artistTagOption);
}

const postSubmitButton = document.createElement('button');
postSubmitButton.className = 'post-submit-button';
postSubmitButton.innerText = '포스트 발행하기';
postSubmitButton.addEventListener('click', postSubmit);

// 로그인 시 포스트 작성 버튼 생성
export const postCreateBtn = () => {
  onAuthStateChanged(authService, (user) => {
    if (user) {
      const userProfileImg = user.photoURL || '../assets/imgs/nullimage.png';
      const postCreateBtnHTML = `
                                <div class="post-create-profile-img-container">
                                  <img
                                    src=${userProfileImg}
                                    alt=""
                                    class="post-create-profile-img"
                                  />
                                  </div>
                                  <div id="post-input-container">
                                    <button onclick="postInput(event)" id="post-create-text-button">
                                      어떤 이야기를 공유하실건가요?
                                    </button>
                                  </div>`;

      const postCreateDiv = document.createElement('div');
      postCreateDiv.className = 'post-create';
      postCreateDiv.innerHTML = postCreateBtnHTML;

      const mainComp = document.querySelector('main');
      mainComp.prepend(postCreateDiv);
    }
  });
};

// post 작성 db통신

async function postSubmit(event) {
  const userNickname = authService.currentUser.displayName || '익명 사용자';
  const userImage = authService.currentUser.photoURL || null;
  const userUID = authService.currentUser.uid;
  const postTitle = postTitleInput.value;
  const postText = postTextArea.value;
  const artistTag = postArtistTagSelector.value;
  const postPhotoName = uuidv4();
  let postUserEmailId;
  if (authService.currentUser.email) {
    postUserEmailId = `@${authService.currentUser.email.split('@')[0]}`;
  } else {
    if (authService.currentUser.providerData[0].email) {
      postUserEmailId = `@${
        authService.currentUser.providerData[0].email.split('@')[0]
      }`;
    } else if (authService.currentUser.reloadUserInfo.screenName) {
      postUserEmailId = `@${authService.currentUser.reloadUserInfo.screenName}`;
    } else {
      postUserEmailId = '@익명사용자';
    }
  }
  let postImage;

  if (!postTitle) {
    alert('포스트 제목을 입력 해 주세요!');
    postTitleInput.focus();
    return;
  }
  if (!postText) {
    alert('포스트 내용을 입력 해 주세요!');
    postTextArea.focus();
    return;
  }

  // 이미지 스토리지 저장 후 url 가져오기
  const needUploadPostImage =
    event.target.previousElementSibling.childNodes[0].childNodes[1].files[0];
  const imgRef = ref(storageService, `postImgs/${postPhotoName}`);
  if (needUploadPostImage) {
    const res = await uploadBytes(imgRef, needUploadPostImage, 'data_url');
    postImage = await getDownloadURL(res.ref);
  }

  try {
    await addDoc(collection(dbService, 'posts'), {
      userUID: userUID,
      userNickname: userNickname,
      userImage: userImage,
      postTitle: postTitle,
      postText: postText,
      artistTag: artistTag,
      postImage: postImage || '#',
      postDate: Date.now(),
      postUserEmailId: postUserEmailId,
      postPhotoName: postPhotoName,
      likeUsers: [1],
    });

    // 작성 이후 빈칸처리
    postTitleInput.value = '';
    postTextArea.value = '';
    postArtistTagSelector.value = 'BTS';
    postImageInput.value = '';

    // 작성 창 비우고 버튼 팝업
    document.getElementById('post-input-container').replaceChildren();
    const postPopupBtn = `<button onclick="postInput(event)" id="post-create-text-button">어떤 이야기를 공유하실건가요?</button>`;
    document.getElementById('post-input-container').innerHTML = postPopupBtn;

    getPostsAndDisplay();
  } catch (error) {
    alert(error);
    console.log('error in addDoc:', error);
  }
}

// post 작성란 팝업

function postInput(event) {
  if (window.location.hash === '') {
    const postInputContainer = document.getElementById('post-input-container');
    const postInputButton = document.getElementById('post-create-text-button');

    postInputContainer.removeChild(postInputButton);
    postInputContainer.appendChild(postTitleInput);
    postInputContainer.appendChild(postTextArea);
    postInputContainer.appendChild(postSelectsContainer);
    postInputContainer.appendChild(postSubmitButton);

    postSelectsContainer.appendChild(postImageLabel);
    postSelectsContainer.appendChild(postArtistTagSelectorLabel);

    postArtistTagSelectorLabel.appendChild(postArtistTagSelector);
    postImageLabel.appendChild(postImageInput);

    postTitleInput.focus();
  }
}

export { postInput };
