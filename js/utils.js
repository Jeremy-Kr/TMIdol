export const onFileChange = async (event) => {
  localStorage.removeItem('imgDataUrl');
  const theFile = event.target.files[0]; // file 객체

  if (theFile.size > 3900000) {
    alert('사진 용량이 너무 큽니다! 다른 사진을 첨부해주세요!');
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
    reader.onloadend = (finishedEvent) => {
      // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
      const imgDataUrl = finishedEvent.currentTarget.result;
      localStorage.setItem('imgDataUrl', imgDataUrl);
    };
  }
};

export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const pwRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
