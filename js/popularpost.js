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
      const timeStamp = searchObj.postDate + 9 * 60 * 60 * 1000;
      const date = new Date(timeStamp);
      const time = date.toLocaleString('ko-KR', { timeZone: 'UTC' });

      const userUID = searchObj.userUID;
      let currentUserUID = authService.currentUser.uid;

      const isMyPost = currentUserUID === userUID;

      let fillImage = searchObj.userImage;
      const post = document.querySelector('.post-container');

      if (searchObj.id == event.target.id) {
        post.innerHTML = '';
        const tempHTML = `<article class="posts">
														<div class="post-header">
															<img
																src=${fillImage ?? './assets/imgs/nullimage.png'}
																alt=""
																class="profile-img"
															/>
															<div class="post-title">
																<div class="post-title-top">
																	<div class="post-title-top-name">
																		<p>
																			<a class="user-nickname">${searchObj.userNickname}</a>님이
																			<span class="tags">포스트</span>를 공유했습니다.
																		</p>
																	</div>
																</div>
																<p class="post-title-bottom">
																	${searchObj.artistTag}의 팬 @jeremy-kr • ${time}
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
																	>${searchObj.postTitle}</span
																>
															</div>
															<img
																src="${searchObj.postImage}"
																alt=""
																class="post-main-img"
															/>
															<div class="post-main-text">
															${searchObj.postText}
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
  } catch {
    alert('인기 게시물을 보려면 로그인 하세요.');
    openLoginModal();
  }
}
setTimeout(getPopularList, 1000);
setInterval(getPopularList, 30000);
