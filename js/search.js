import { authService, dbService } from './firebase.js';
import {
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
// 검색
export async function getSearchList(event) {
  event.preventDefault();

  const searchValue = document.querySelector('#search-value');

  // 데이터 담기
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

  // 아티스트 정보 노출 부분
  querySnapshot.forEach(async (searchObj) => {
    const info = document.querySelector('.artist-info');
    const artistText = await fetch(
      `/artistinfo/${searchObj.data()['artistTag']}.html`
    )
      .then((data) => data.text())
      .catch((error) => console.log(error));

    if (
      searchValue.value.toLowerCase() ===
      searchObj.data()['artistTag'].toLowerCase()
    ) {
      info.innerHTML = '';

      const artistTempHTML = `<div class="artist-info-container">
                                <div class="artist-info-text">
                                </div>
                                <div class="artist-info-img-container">
                                  <img
                                    src="./assets/imgs/${
                                      searchObj.data()['artistTag']
                                    }.png"
                                    alt=""
                                    class="artist-info-img"
                                    />
                                </div>
                              </div>`;
      const div = document.createElement('div');
      div.innerHTML = artistTempHTML;
      info.appendChild(div);

      document.querySelector('.artist-info-text').innerHTML = artistText;
    }
  });

  // 게시물 노출 부분
  const searchList = document.querySelector('.post-container');
  searchList.innerHTML = '';

  try {
    searchObjList.forEach((searchObj) => {
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
      // const currentUserUID = authService.currentUser.uid;

      const isMyPost = currentUserUID === userUID;

      if (
        searchValue.value.toLowerCase() === searchObj.artistTag.toLowerCase()
      ) {
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
                <svg onclick="like(event)" class="like-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-balloon-heart" viewBox="0 0 16 16">
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
        searchList.appendChild(div);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// 자동완성
export async function autoComp() {
  let artistNameList = [];

  const q = query(collection(dbService, 'posts'));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    artistNameList.push(doc.data()['artistTag']);
  });

  const setArtistNameList = [...new Set(artistNameList)]; // 위치 주의 (forEach로 artistNameList에 값을 넣어야 제대로 작동하기에, forEach보다 아래에 위치해야한다.)
  $(function () {
    //화면 다 뜨면 시작
    $('#search-value').autocomplete({
      //오토 컴플릿트 시작
      source: setArtistNameList, // source 는 자동 완성 대상
      select: function (event) {
        document.querySelector(
          '#search-value'
        ).value = `${event.currentTarget.outerText}`;
        getSearchList(event);
      },
      // focus: function (event, ui) {
      //   //포커스 가면
      //   return true; //한글 에러 잡기용도로 사용됨
      // },
      minLength: 1, // 최소 글자수
      // autoFocus: true, //첫번째 항목 자동 포커스 기본값 false
      delay: 100, //검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
      // disabled: true, //자동완성 기능 끄기
      position: { my: 'right top', at: 'right bottom' }, //자동완성창이 뜨는 위치
    });
  });
}

// 실시간 연예뉴스
function listData() {
  $.ajax({
    type: 'GET',
    url: 'https://entertain.daum.net/prx/mc2/v2/contents/1874537.json?pageSize=15&page=1&maxDate=&range=1&filterKey=cateInfo.cateId,factor.photo&filterVal=1033,false',
    dataType: 'jsonp',
    data: {},
    success: function (response) {
      $('.ent-news-item').remove();
      let titleLink = [];
      for (let i = 0; i < 5; i++) {
        const list = {
          title: response['data'][i].title,
          link: response['data'][i].cpInfo.outlink,
        };
        titleLink.push(list);
        const temp_html = `<li class="ent-news-item"><a href="${titleLink[i]['link']}" target="_blank">${titleLink[i]['title']}</a></li>`;
        $('.ent-news-list').append(temp_html);
      }
    },
    beforeSend: function () {
      // 데이터 불러올 때 로딩이미지 추가하기
      // 함수 실행에 시간차를 두는 걸로 대체
    },
    complete: function () {
      // 데이터 불러오기 완료시 로딩이미지 삭제하기
    },
  });
}

setTimeout(listData, 3000);
setInterval(listData, 30000);
