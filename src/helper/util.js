const items = {
    MALE: "남성",
    FEMALE: "여성",
    Travel: "여행객 호스트",
    Local: "현지인 호스트",
    UPCOMING: "진행중",
    COMPLETED: "종료",
    CANCELED: '취소',
    OPEN: "공개",
    PRIVATE: "비공개",
    STAND_BY: "승인 대기",
    ACCEPTED: "승인 완료",
    DECLINED: "승인 불가",


};

export const EngToKor = (kewword) => {
    // @ts-ignore
    return Object.keys(items).includes(kewword) ? items[kewword] : kewword
}

export const checkImageURL = (nationality) => {
    const pngImages = ["Antarctica"];

    let url_image = `../img/flags/${nationality}.svg`;
    if (pngImages.includes(nationality)) {
        url_image = `../img/flags/${nationality}.png`;
    }
    return url_image
}

export const getCookie = (name) => {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        /* Removing whitespace at the beginning of the cookie name
            and compare it with the given string */
        if (name === cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    // Return null if not found
    return null;
};
