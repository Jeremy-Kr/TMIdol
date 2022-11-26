import { dbService, storageService, authService } from './firebase.js';
import { openLoginModal } from './sub.js';
import { postList } from './postList.js';

import {
  doc,
  collection,
  orderBy,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
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

export async function deletePost(event) {
  event.preventDefault();
  const postId = event.target.id;
  const postPhotoName = event.target.classList[0];
  const imgRef = ref(storageService, `postImgs/${postPhotoName}`);
  const imgDOM = event.target.closest('.posts').querySelector('.post-main-img');
  const deletePostConfirm = window.confirm('정말로 포스트를 삭제하시겠습니까?');
  if (deletePostConfirm) {
    try {
      if (!(imgDOM.src.split('/')[3] === '#')) {
        await deleteObject(imgRef).catch((error) => console.log(error));
      }
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
    event.target.parentNode.parentNode.parentNode.children[1].children[3];
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

export async function like(event) {
  if (authService.currentUser) {
    let likeUser = [];
    const targetPostRef = doc(dbService, 'posts', event.target.id);
    const q = query(targetPostRef);
    const likePostData = [];
    const docs = await getDoc(q);
    const { likeUsers } = docs.data();

    if (likeUsers) {
      likeUser = [...likeUsers];
    }
    if (likeUser.some((e) => e === authService.currentUser.uid)) {
      const userIndex = likeUser.findIndex(
        (e) => e === authService.currentUser.uid
      );
      likeUser.splice(userIndex, 1);
      await updateDoc(targetPostRef, {
        like: increment(-1),
      });
      await updateDoc(targetPostRef, {
        likeUsers: likeUser,
      });

      const afterDisLike = await getDoc(q);
      let { like } = afterDisLike.data();
      if (like > 99) {
        like = '+99';
      }
      event.target.closest('.likes').querySelector('.like-count').innerText =
        like;

      event.target
        .closest('.likes')
        .querySelector('.redHeart')
        .classList.add('hidden');
    } else {
      await updateDoc(targetPostRef, {
        like: increment(1),
      });
      likeUser.push(authService.currentUser.uid);
      await updateDoc(targetPostRef, {
        likeUsers: likeUser,
      });

      const afterLike = await getDoc(q);
      let { like } = afterLike.data();
      if (like > 99) {
        like = '+99';
      }
      event.target.closest('.likes').querySelector('.like-count').innerText =
        like;

      event.target
        .closest('.likes')
        .querySelector('.redHeart')
        .classList.remove('hidden');
    }
    getPopularList();
  } else {
    alert('좋아요 기능은 로그인 후 이용하실 수 있습니다!');
    openLoginModal();
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

  postList(getPostsData);
}
