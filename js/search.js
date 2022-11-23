import { dbService } from './firebase.js';
import {
  collection,
  orderBy,
  query,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

// 검색 
export async function getSearchList(event) {
  event.preventDefault();

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

  const searchList = document.querySelector('.post-container');
  searchList.innerHTML = '';
  const searchvalue = document.querySelector('#searchvalue');

  searchObjList.forEach((searchObj) => {
    const timestamp = searchObj.postDate + 9 * 60 * 60 * 1000;
    const date = new Date(timestamp);
    const time = date.toLocaleString('ko-KR', { timeZone: 'UTC' });

    const post = document.querySelector('.post-container');
    if (searchvalue.value.toLowerCase() === searchObj.artistTag.toLowerCase()) {
      const temp_html = `<article class="posts">
														<div class="post-header">
															<img
																src="./assets/imgs/8C60C9E7-0049-44F2-A97F-CDB5E868B1E9_1_105_c.jpeg"
																alt=""
																class="profile-img"
															/>
															<div class="post-title">
																<div class="post-title-top">
																	<div class="post-title-top-name">
																		<p>
																			<a class="user-nickname">${searchObj.userNickname}</a>님이
																			<span class="tags">장소</span>를 공유했습니다.
																		</p>
																	</div>
																</div>
																<p class="post-title-bottom">
																	${searchObj.artistTag}의 팬 @jeremy-kr • ${time}
																</p>
															</div>
														</div>
														<div class="post-main">
															<div class="post-main-title">
																<span
																	>${searchObj.postTitle}</span
																>
															</div>
															<img
																src="./assets/imgs/E7364DD7-EDFA-47A3-96D0-CFE41619146A_1_102_o.jpeg"
																alt=""
																class="post-main-img"
															/>
															<div class="post-main-text">
															${searchObj.postText}
															</div>
														</div>
													</article>`;
      const div = document.createElement('div');
      div.innerHTML = temp_html;
      post.appendChild(div);
    }
  });
}

// 자동완성 
export async function autocomp() {
  let artistNameList = [];

  const q = query(collection(dbService, 'posts'));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    artistNameList.push(doc.data()['artistTag']);
  });

  const setArtistNameList = [...new Set(artistNameList)]; // 위치 주의 (forEach로 artistNameList에 값을 넣어야 제대로 작동하기에, forEach보다 아래에 위치해야한다.)
  $(function () {
    //화면 다 뜨면 시작
    $('#searchvalue').autocomplete({
      //오토 컴플릿트 시작
      source: setArtistNameList, // source 는 자동 완성 대상
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
      console.log('불러오기 성공');
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

