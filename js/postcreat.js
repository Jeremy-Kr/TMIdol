const postSubmit = () => {
  // todo: postSubmit 함수로 post db에 저장하기.
  console.log("postSubmit 작성하기");
};

function postInput(event) {
  if (window.location.hash === "") {
    const postInputContainer = document.getElementById("post-input-container");
    const postInputButton = document.getElementById("post-create-text-button");

    const postInput = document.createElement("input");
    postInput.type = "text";
    postInput.id = "postTitle";
    postInput.className = "post-create-title";
    postInput.placeholder = "포스트의 제목을 입력해주세요.";
    postInput.maxLength = 57;

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

    const postArtistTagSelectorLabel = document.createElement("label");
    postArtistTagSelectorLabel.innerText = "아티스트 태그 선택";

    const postArtistTagSelector = document.createElement("select");
    postArtistTagSelector.id = "artistTag";
    postArtistTagSelector.className = "post-selects-artist-tag";

    const artists = ["BTS", "헬로비너스", "프로미스나인", "LESSERAFIM"];

    for (let i = 0; i < artists.length; i++) {
      const artistTagOption = document.createElement("option");
      artistTagOption.innerText = artists[i];
      postArtistTagSelector.appendChild(artistTagOption);
    }

    const postSubmitButton = document.createElement("button");
    postSubmitButton.className = "post-submit-button";
    postSubmitButton.innerText = "포스트 발행하기";
    // postSubmitButton.onclick = postSubmit;
    postSubmitButton.addEventListener("click", postSubmit);

    postInputContainer.removeChild(postInputButton);
    postInputContainer.appendChild(postInput);
    postInputContainer.appendChild(postTextArea);
    postInputContainer.appendChild(postSelectsContainer);
    postInputContainer.appendChild(postSubmitButton);

    postSelectsContainer.appendChild(postImageLabel);
    postSelectsContainer.appendChild(postArtistTagSelectorLabel);

    postArtistTagSelectorLabel.appendChild(postArtistTagSelector);
    postImageLabel.appendChild(postImageInput);

    postInput.focus();
  }
}

export { postInput };
