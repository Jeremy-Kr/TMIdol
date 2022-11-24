import { authService } from './firebase.js';
import {
  doc,
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { dbService } from './firebase.js';
import { handleLocation } from './router.js';

const deleteBtn = document.createElement('button');
deleteBtn.className = 'delete-button';
deleteBtn.addEventListener('click', deletePost);
deleteBtn.innerText = 'Button';

const updateBtn = document.createElement('button');
updateBtn.className = 'update-button';
updateBtn.addEventListener('click', updatePost);

const postButtons = document.createElement('div');
postButtons.append(deleteBtn);
postButtons.append(updateBtn);

// const postMenu = document.createElement('div');
// postMenu.className = 'post-menu';
// updateBtn.addEventListener('mouseover', postMenuPopup);

// function postMenuPopup() {}

function deletePost() {}
function updatePost() {}

export async function getPostsAndDisplay() {
  const postsContainer = document.querySelector('.post-container');
  postsContainer.innerText = '';
  const getPostsData = [];
  const q = query(collection(dbService, 'posts'), orderBy('postDate', 'desc'));
  const docs = await getDocs(q);
  docs.forEach((doc) => {
    const postData = {
      ...doc.data(),
    };
    getPostsData.push(postData);
  });
  let currentUserUID;
  if (authService.currentUser) {
    currentUserUID = authService.currentUser.uid;
  }
  //   else {
  //     currentUserUID = '';
  //   }

  getPostsData.map((post) => {
    const {
      artistTag,
      postDate,
      postId,
      postImage,
      postText,
      postTitle,
      userNickname,
      userUID,
      postUserEmailId,
    } = post;

    const dateFormat = new Date(postDate + 9 * 60 * 60 * 1000).toLocaleString(
      'ko-KR',
      { timeZone: 'UTC' }
    );
    const isMyPost = currentUserUID === userUID;

    const tempHTML = `<article class="posts" id="${postId}">
        <div class="post-header">
            <img
                src="${
                  post.userImage ||
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
                ? `<div class="post-button-container"><button class="post-button">수정</button><button class="post-button">삭제</button></div>`
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
            <div class="post-main-text">
            ${postText}
            </div>
        </div>
      </article>`;

    const postContainer = document.createElement('div');
    postContainer.className = 'single-post-container';
    postContainer.innerHTML = tempHTML;
    postsContainer.append(postContainer);
  });
}
