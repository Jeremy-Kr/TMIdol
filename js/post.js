import { authService } from './firebase.js';
import {
  doc,
  collection,
  orderBy,
  query,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { dbService, storageService } from './firebase.js';
import { handleLocation } from './router.js';
import {
  ref,
  deleteObject,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

const deleteBtn = document.createElement('button');
deleteBtn.className = 'delete-button';
deleteBtn.addEventListener('click', deletePost);
deleteBtn.innerText = 'Button';

const updateBtn = document.createElement('button');
updateBtn.className = 'update-button';
updateBtn.addEventListener('click', updatePostPopup);

const postButtons = document.createElement('div');
postButtons.append(deleteBtn);
postButtons.append(updateBtn);

// const postMenu = document.createElement('div');
// postMenu.className = 'post-menu';
// updateBtn.addEventListener('mouseover', postMenuPopup);

// function postMenuPopup() {}

export async function deletePost(event) {
  event.preventDefault();
  const postId = event.target.id;
  const postPhotoName = event.target.name;
  const imgRef = ref(storageService, `postImgs/${postPhotoName}`);
  const deletePostConfirm = window.confirm('정말로 포스트를 삭제하시겠습니까?');

  if (deletePostConfirm) {
    try {
      await deleteObject(imgRef).catch((error) => console.log(error));
      await deleteDoc(doc(dbService, 'posts', postId));
      getPostsAndDisplay();
    } catch (error) {
      console.log(error);
    }
  }
}

export function updatePostPopup(event) {
  const postTitleContainer =
    event.target.parentNode.parentNode.parentNode.children[1].children[0];
  const postTextContainer =
    event.target.parentNode.parentNode.parentNode.children[1].children[2];
  const postTitleValue = postTitleContainer.children[0].innerText;
  const postTextValue = postTextContainer.children[0].innerText;

  const postTitleUpdateInput = document.createElement('input');
  postTitleUpdateInput.type = 'text';
  postTitleUpdateInput.maxLength = 57;
  postTitleUpdateInput.id = 'postTitleUpdate';
  postTitleUpdateInput.className = 'post-update-title';
  postTitleUpdateInput.value = postTitleValue;

  postTitleContainer.innerHTML = '';
  postTitleContainer.append(postTitleUpdateInput);

  const postTextUpdateInput = document.createElement('textarea');
  postTextUpdateInput.id = 'postTextUpdate';
  postTextUpdateInput.className = 'post-update-text';
  postTextUpdateInput.value = postTextValue;

  postTextContainer.innerHTML = '';
  postTextContainer.append(postTextUpdateInput);

  const postUpdateSubmitButton = document.createElement('button');
  postUpdateSubmitButton.className = 'post-update-button';
  postUpdateSubmitButton.id = event.target.id;
  postUpdateSubmitButton.innerText = '수정';
  postUpdateSubmitButton.addEventListener('click', updatePost);

  postTextContainer.append(postUpdateSubmitButton);
}

export async function updatePost() {
  const postId = this.id;
  const postTitleUpdateValue = document.getElementById('postTitleUpdate').value;
  const postTextUpdateValue = document.getElementById('postTextUpdate').value;

  const postRef = doc(dbService, 'posts', postId);
  try {
    await updateDoc(postRef, {
      postTitle: postTitleUpdateValue,
      postText: postTextUpdateValue,
    });
    getPostsAndDisplay();
  } catch (error) {
    console.log(error);
  }
}

export async function getPostsAndDisplay() {
  const postsContainer = document.querySelector('.post-container');
  postsContainer.innerText = '';
  const getPostsData = [];
  const q = query(collection(dbService, 'posts'), orderBy('postDate', 'desc'));
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
  //   else {
  //     currentUserUID = '';
  //   }
  getPostsData.map((post) => {
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
    } = post;

    const dateFormat = new Date(postDate + 9 * 60 * 60 * 1000).toLocaleString(
      'ko-KR',
      { timeZone: 'UTC' }
    );
    const isMyPost = currentUserUID === userUID;

    const tempHTML = `<article class="posts">
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
            <div class="post-main-text">
            <span>${postText}</span>
            </div>
        </div>
      </article>`;

    const postContainer = document.createElement('div');
    postContainer.className = 'single-post-container';
    postContainer.innerHTML = tempHTML;
    postsContainer.append(postContainer);
  });
}
