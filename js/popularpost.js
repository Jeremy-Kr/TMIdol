import { dbService } from './firebase.js';
import { postList } from './postList.js';
import {
  collection,
  orderBy,
  query,
  getDocs,
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

// 인기 게시물 리스트
export async function getPopularList() {
  let searchObjList = [];

  const q = query(collection(dbService, 'posts'), orderBy('like', 'desc'));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const searchObj = {
      id: doc.id, // artistTag : doc.data().artistTag, -> doc의 data()속에 있는 artistTag지정
      ...doc.data(),
    };
    searchObjList.push(searchObj);
  });
  popularList(searchObjList);
}

// 인기 게시물 클릭 시 메인에
export async function sendMain(event) {
  const getPostsData = [];
  const q = query(doc(dbService, 'posts', event.target.id));
  const docs = await getDoc(q);
  const getPostData = {
    id: docs.id,
    ...docs.data(),
  };
  getPostsData.push(getPostData);

  postList(getPostsData);
}

setTimeout(getPopularList, 3000);
setInterval(getPopularList, 30000);

function popularList(searchObjList) {
  const popularList = document.querySelector('.populer-list');
  popularList.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const popularItem = searchObjList[i].postTitle;
    const popularId = searchObjList[i].id;
    const popularItemList = `<li id="${popularId}" class="populer-item" onclick="sendMain(event)"> ${popularItem}</li>`;

    $('.populer-list').append(popularItemList);
  }
}
