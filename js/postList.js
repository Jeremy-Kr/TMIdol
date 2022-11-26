import { authService } from './firebase.js';

// getPostsData
export function postList(getPostsData) {
  const postsContainer = document.querySelector('.post-container');
  postsContainer.innerText = '';
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
      userImage,
      likeUsers,
    } = post;
    let like = post.like;

    let noLiked = false;
    let likeUser = [];

    if (likeUsers !== undefined) {
      likeUser = [...likeUsers];
    }

    let currentUserUID;
    if (authService.currentUser) {
      currentUserUID = authService.currentUser.uid;
    }

    const dateFormat = new Date(postDate + 9 * 60 * 60 * 1000).toLocaleString(
      'ko-KR',
      { timeZone: 'UTC' }
    );

    const isMyPost = currentUserUID === userUID;

    if (!likeUser.some((e) => e === currentUserUID)) {
      noLiked = true;
    }

    if (like > 99) {
      like = '+99';
    }

    const editAndDeleteButton = ` <div class="post-button-container">
                                    <svg alt="포스트 수정하기" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" id="${id}" onclick="updatePostPopup(event)" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>
                                    <svg alt="포스트 삭제하기" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="${postPhotoName} bi bi-trash" id="${id}" onclick="deletePost(event)" viewBox="0 0 16 16">
                                        <path id="${id}" class="${postPhotoName}" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path id="${id}" class="${postPhotoName}" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                  </div>`;

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
                          ${isMyPost ? editAndDeleteButton : ``}
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
                          <svg id="${id}" onclick="like(event)" class="like-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-balloon-heart" viewBox="0 0 16 16">
                          <path id="${id}" class="redHeart ${
      noLiked ? 'hidden' : ''
    }" fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/>
                          <path id="${id}" class="blackHeart" fill-rule="evenodd" d="m8 2.42-.717-.737c-1.13-1.161-3.243-.777-4.01.72-.35.685-.451 1.707.236 3.062C4.16 6.753 5.52 8.32 8 10.042c2.479-1.723 3.839-3.29 4.491-4.577.687-1.355.587-2.377.236-3.061-.767-1.498-2.88-1.882-4.01-.721L8 2.42Zm-.49 8.5c-10.78-7.44-3-13.155.359-10.063.045.041.089.084.132.129.043-.045.087-.088.132-.129 3.36-3.092 11.137 2.624.357 10.063l.235.468a.25.25 0 1 1-.448.224l-.008-.017c.008.11.02.202.037.29.054.27.161.488.419 1.003.288.578.235 1.15.076 1.629-.157.469-.422.867-.588 1.115l-.004.007a.25.25 0 1 1-.416-.278c.168-.252.4-.6.533-1.003.133-.396.163-.824-.049-1.246l-.013-.028c-.24-.48-.38-.758-.448-1.102a3.177 3.177 0 0 1-.052-.45l-.04.08a.25.25 0 1 1-.447-.224l.235-.468ZM6.013 2.06c-.649-.18-1.483.083-1.85.798-.131.258-.245.689-.08 1.335.063.244.414.198.487-.043.21-.697.627-1.447 1.359-1.692.217-.073.304-.337.084-.398Z"/>
                          </svg>
                          <span class="like-count">${like ? like : '0'}</span>
                          </div>
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
