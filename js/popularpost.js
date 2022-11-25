import { authService, dbService } from './firebase.js';
import {
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { openLoginModal } from './sub.js';

// 인기 게시물 리스트
export async function getPopularList() {
  let searchObjList = [];

  const q = query(collection(dbService, 'posts'), orderBy('postDate', 'desc'));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const searchObj = {
      id: doc.id, // artistTag : doc.data().artistTag, -> doc의 data()속에 있는 artistTag지정
      ...doc.data(),
    };
    searchObjList.push(searchObj);
  });
  const popularList = document.querySelector('.populer-list');
  popularList.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const popularItem = searchObjList[i].postTitle;
    const popularId = searchObjList[i].id;
    const popularItemList = `<li id="${popularId}" class="populer-item" onclick="sendMain(event)"> ${popularItem}</li>`;

    $('.populer-list').append(popularItemList);
  }
}

// 인기 게시물 클릭 시 메인에
export async function sendMain(event) {
  let selectObjList = [];

  const q = query(collection(dbService, 'posts'), orderBy('postDate', 'desc'));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const searchObj = {
      id: doc.id, // artistTag : doc.data().artistTag, -> doc의 data()속에 있는 artistTag지정
      ...doc.data(),
    };
    selectObjList.push(searchObj);
  });
  try {
    selectObjList.forEach((searchObj) => {
      const {
        artistTag,
        postDate,
        id,
        postImage,
        postText,
        postTitle,
        userNickname,
        userUID,
        postUserEmailId,
        postPhotoName,
        userImage,
      } = searchObj;

      const dateFormat = new Date(postDate + 9 * 60 * 60 * 1000).toLocaleString(
        'ko-KR',
        { timeZone: 'UTC' }
      );

      let currentUserUID;
      if (authService.currentUser) {
        currentUserUID = authService.currentUser.uid;
      }

      const isMyPost = currentUserUID === userUID;

      const post = document.querySelector('.post-container');

      if (id == event.target.id) {
        post.innerHTML = '';
        const tempHTML = `<article class="posts">
        <div class="post-header">
            <img
                src="${
                  userImage ||
                  './assets/imgs/8C60C9E7-0049-44F2-A97F-CDB5E868B1E9_1_105_c.jpeg'
                }"
                alt=""
                class="profile-img"
            />
            <div class="post-title">
                <div class="post-title-top">
                    <div class="post-title-top-name">
                        <p>
                            <a class="user-nickname">${userNickname}</a>님이
                            <span class="tags">포스트</span>를 공유했습니다.
                        </p>
                    </div>
                </div>
                <p class="post-title-bottom">
                    ${artistTag}의 팬 ${
          postUserEmailId || '@익명사용자'
        } • ${dateFormat}
                </p>
            </div>
            ${
              isMyPost
                ? `<div class="post-button-container"><button class="post-button" id="${id}" onclick="updatePostPopup(event)">수정</button><button class="post-button" name="${postPhotoName}" id="${id}" onclick="deletePost(event)">삭제</button></div>`
                : ``
            }
        </div>
        <div class="post-main">
            <div class="post-main-title">
                <span
                    >${postTitle}</span
                >
            </div>
            <img
                src="${postImage}"
                alt=""
                class="post-main-img"
            />
            <div class="likes">
                <svg id="id" onclick="like(event)" class="like-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-balloon-heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/>
                </svg>
                <span class="like-count">+99</span>
                </div>
            <div class="post-main-text">
            <span>${postText}</span>
            </div>
        </div>
      </article>`;
        const div = document.createElement('div');
        div.innerHTML = tempHTML;
        post.appendChild(div);

        const info = document.querySelector('.artist-info');
        info.innerHTML = '';
      }
    });
  } catch (error) {
    console.log(error);
    // alert('인기 게시물을 보려면 로그인 하세요.');
    // openLoginModal();
  }
}
setTimeout(getPopularList, 3000);
setInterval(getPopularList, 30000);
