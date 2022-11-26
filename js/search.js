import { dbService } from './firebase.js';
import { postList } from './postList.js';

import {
  collection,
  query,
  getDocs,
  where,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
// 검색
export async function getSearchList(event) {
  event.preventDefault();

  const searchValue = document.querySelector('#search-value');

  // 데이터 담기
  let searchObjList = [];

  const q = query(
    collection(dbService, 'posts'),
    // orderBy('postDate', 'desc'),
    where('artistTag', '==', searchValue.value.toUpperCase())
  );

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
  postList(searchObjList);
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
      select: function (event, ui) {
        // item 선택 시 이벤트
        document.querySelector('#search-value').value = ui.item.value;
        getSearchList(event);
      },
      minLength: 1, // 최소 글자수
      // autoFocus: true, //첫번째 항목 자동 포커스 기본값 false
      delay: 100, //검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
      // disabled: true, //자동완성 기능 끄기
      position: { my: 'right top', at: 'right bottom' }, //자동완성창이 뜨는 위치
    });
  });
}

// 실시간 연예뉴스
export function listData() {
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
