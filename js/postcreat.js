import { onFileChange } from "./utils.js";

// DOM 노드 생성

const postTitleInput = document.createElement("input");
postTitleInput.type = "text";
postTitleInput.id = "postTitle";
postTitleInput.className = "post-create-title";
postTitleInput.placeholder = "포스트의 제목을 입력해주세요.";
postTitleInput.maxLength = 57;

const postTextArea = document.createElement("textarea");
postTextArea.id = "postText";
postTextArea.className = "post-create-text";
postTextArea.placeholder = "포스트의 내용을 입력해주세요.";

const postSelectsContainer = document.createElement("div");
postSelectsContainer.className = "post-selects-container";

const postImageLabel = document.createElement("label");
postImageLabel.innerText = "사진 업로드";

const postImageInput = document.createElement("input");
postImageInput.type = "file";
postImageInput.className = "post-image-input";
postImageInput.accept = "images/*";
postImageInput.addEventListener("change", onFileChange);

const postArtistTagSelectorLabel = document.createElement("label");
postArtistTagSelectorLabel.innerText = "아티스트 태그 선택";

const postArtistTagSelector = document.createElement("select");
postArtistTagSelector.id = "artistTag";
postArtistTagSelector.className = "post-selects-artist-tag";

const artists = [
  "BTS",
  "헬로비너스",
  "프로미스나인",
  "LESSERAFIM",
  "세븐틴",
  "몬스타엑스",
  "에스파",
  "소나무",
];

for (let i = 0; i < artists.length; i++) {
  const artistTagOption = document.createElement("option");
  artistTagOption.innerText = artists[i];
  postArtistTagSelector.appendChild(artistTagOption);
}

const postSubmitButton = document.createElement("button");
postSubmitButton.className = "post-submit-button";
postSubmitButton.innerText = "포스트 발행하기";
postSubmitButton.addEventListener("click", postSubmit);

// post 작성 db통신

function postSubmit() {
  // todo: Auth 구축 후 유져 닉네임과 이미지 가져오기
  const userNickname = "todo";
  const userImage = "todo";
  const postTitle = postTitleInput.value;
  const postText = postTextArea.value;
  const artistTag = postArtistTagSelector.value;
  const postImage = "todo";
  const postDate = Date.now();

  // todo: 이미지 로컬스토리지 -> 파이어베이스 스토리지로 업로드 후 URL 추출
  const localPostImage = localStorage.getItem("imgDataUrl");

  if (!postTitle) {
    return alert("포스트 제목을 입력 해 주세요!");
  }
  if (!postText) {
    return alert("포스트 내용을 입력 해 주세요!");
  }
}

// post 작성란 팝업

function postInput(event) {
  if (window.location.hash === "") {
    const postInputContainer = document.getElementById("post-input-container");
    const postInputButton = document.getElementById("post-create-text-button");

    postInputContainer.removeChild(postInputButton);
    postInputContainer.appendChild(postTitleInput);
    postInputContainer.appendChild(postTextArea);
    postInputContainer.appendChild(postSelectsContainer);
    postInputContainer.appendChild(postSubmitButton);

    postSelectsContainer.appendChild(postImageLabel);
    postSelectsContainer.appendChild(postArtistTagSelectorLabel);

    postArtistTagSelectorLabel.appendChild(postArtistTagSelector);
    postImageLabel.appendChild(postImageInput);

    postTitleInput.focus();
  }
}

export { postInput };
