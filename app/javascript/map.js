let lastMarker = null;
var map;
var postMarkers = [];
const popupForm = document.getElementById('popupForm');

// 現在位置を取得する関数
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    // Geolocation APIがブラウザで利用可能かを確認
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // 位置情報の取得に成功した場合
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          // 位置情報の取得に失敗した場合、デフォルトの座標を返す
          resolve({ lat: 36.109682, lng: 140.101583 });
        }
      );
    } else {
      // Geolocation APIが利用不可の場合、デフォルトの座標を返す
      resolve({ lat: 36.109682, lng: 140.101583 });
    }
  });
}

// マーカー画像を作成する関数
function createMarkerImage(sImageSrc, nWidth, nHeight, nX, nY) {
  if (nX !== undefined) {
    return new google.maps.MarkerImage(
      sImageSrc,
      new google.maps.Size(nWidth, nHeight),
      new google.maps.Point(0, 0),
      new google.maps.Point(nX, nY)
    );
  } else {
    return new google.maps.MarkerImage(
      sImageSrc,
      new google.maps.Size(nWidth, nHeight)
    );
  }
}

// 画像付きのマーカーを作成する関数
function createImageMarker(latlng, sImgSrc, sTitle, nWidth, nHeight, csName, isAnim) {
  var nDefaultWidth = nWidth || 20;
  var nDefaultHeight = nHeight || 20;

  var markerOptions = {
    map: map,
    position: latlng,
    className: csName,
    optimized: false
  };

  if (isAnim) {
    markerOptions.animation = google.maps.Animation.BOUNCE;
  }


  if (sImgSrc !== "") {
    markerOptions.icon = createMarkerImage(sImgSrc, nDefaultWidth, nDefaultHeight);
  }

  var marker = new google.maps.Marker(markerOptions);

  if (sTitle !== undefined) {
    marker.setTitle(sTitle);
  }

  return marker;
}

// ラベル付きのマーカーを作成する関数
function createLabelMarker(latlng, sTitle, sCssClass, bVisible, imgsrc, nZIndex, nImgWidth, nImgHeight, isAnim) {
  lastMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight, "post_marker", isAnim);

  lastMarker.addListener('click', function () {
    if (popupForm) {
      popupForm.style.display = 'flex';
      document.getElementById('latitude-field').value = latlng.lat();
      document.getElementById('longitude-field').value = latlng.lng();
    } else {
      console.error('popupForm not found');
    }
  });
}

function createPostTrigerMarker(latlng, sTitle, sCssClass, bVisible, imgsrc, nZIndex, nImgWidth, nImgHeight, isAnim, markerID) {
  var postTrigerMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight, "", isAnim);
}

class ImageOverlay extends google.maps.OverlayView {
  constructor(bounds, imageSrc, map, width, height, className, showLabel, labelContent) {
    super();
    this.bounds_ = bounds;
    this.imageSrc_ = imageSrc;
    this.map_ = map;
    this.width_ = width;
    this.height_ = height;
    this.className_ = className;
    this.showLabel_ = showLabel;
    this.labelContent_ = labelContent;
    this.div_ = null;
    this.bVisible = true;

    this.setMap(map);
  }

  onAdd() {
    this.div_ = document.createElement('div');
    this.div_.style.borderStyle = 'none';
    this.div_.style.borderWidth = '0px';
    this.div_.style.position = 'absolute';

    if (this.className_) {
      this.div_.className = this.className_;
    }

    const img = document.createElement('img');
    img.src = this.imageSrc_;
    img.style.width = this.width_ + 'px';
    img.style.height = this.height_ + 'px';
    this.div_.appendChild(img);

    if (this.showLabel_ && this.labelContent_) {
      const label = document.createElement('div');
      label.textContent = this.labelContent_;
      label.className = "post_label";
      this.div_.appendChild(label);
    }

    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.div_);

  }

  draw() {
    const overlayProjection = this.getProjection();

    // 指定された座標（LatLngBoundsの南西角）をピクセル座標に変換
    const sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());

    // オーバーレイの左上隅の座標を計算
    // 指定された座標が画像の下端中心になるように調整
    const divX = sw.x - this.width_ / 2;
    const divY = sw.y - this.height_;

    // オーバーレイのスタイルを設定
    this.div_.style.left = divX + 'px';
    this.div_.style.top = divY + 'px';
    this.div_.style.width = this.width_ + 'px';
    this.div_.style.height = this.height_ + 'px';
  }

  onRemove() {
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  }

  hideLabel() {
    const label = this.div_.getElementsByClassName('post_label')[0];

    if (label) {
      label.style.display = 'none';
    }

    this.bVisible = false;
  }

  showLabel() {
    const label = this.div_.getElementsByClassName('post_label')[0];

    if (label) {
      label.style.display = 'flex';
    }
    this.bVisible = true;
  }

  setImageSize(newWidth, newHeight) {
    this.width_ = newWidth;
    this.height_ = newHeight;

    const img = this.div_.getElementsByTagName('img')[0];
    if (img) {
      img.style.width = this.width_ + 'px';
      img.style.height = this.height_ + 'px';
    }

    this.draw();
  }
}

function addImageOverlay(map, latlng, ImgUrl, lblContent, ImgWidth, ImgHeight, zoomLevel) {
  const latLng = latlng;
  const imageUrl = ImgUrl;
  const width = ImgWidth;
  const height = ImgHeight;
  const className = 'post_elt';
  const showLabel = zoomLevel >= 15;
  const labelContent = lblContent;

  var postMarker = new ImageOverlay(
    new google.maps.LatLngBounds(latLng, latLng),
    imageUrl,
    map,
    width,
    height,
    className,
    showLabel,
    labelContent
  );

  return postMarker;
}

// 地図初期化関数
function initMap(position) {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: position,
    gestureHandling: 'greedy',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  });

  const zoomLevel = map.getZoom();
  imagesData.forEach(function (image) {
    var postMarker = addImageOverlay(map, { lat: image.latitude, lng: image.longitude }, image.url, image.created_at, 80, 80, zoomLevel);
    var postTrigerMarker = createImageMarker({ lat: image.latitude, lng: image.longitude }, post_triger_icon, image.user_name, 80, 80, "", false);
    postMarkers.push(postMarker)
    postTrigerMarker.addListener('mouseover', function () {
      postMarker.setImageSize(90, 90);
    });
    postTrigerMarker.addListener('mouseout', function () {
      postMarker.setImageSize(80, 80);
    });

    postTrigerMarker.addListener('click', function () {
      showViewPopup(image.url)
    });
  });

  // 地図のズームレベルが変更されたときのイベントリスナー
  map.addListener('zoom_changed', function () {
    const newZoomLevel = map.getZoom();
    if (newZoomLevel >= 15) {
      for (let i = 0; i < postMarkers.length; i++) {
        if (postMarkers[i].bVisible == false) {
          postMarkers[i].showLabel();
        }
      }
    } else {
      for (let i = 0; i < postMarkers.length; i++) {
        if (postMarkers[i].bVisible == true) {
          postMarkers[i].hideLabel();
        }
      }
    }

  });

  map.addListener('click', function (e) {
    if (lastMarker !== null) {
      lastMarker.setMap(null);
    }
    createLabelMarker(e.latLng, "", "add_post", false, add_post_icon, 1, 80, 80, false);
  });
}

// 地図初期化
getCurrentLocation().then(coords => {
  initMap({ lat: coords.lat, lng: coords.lng })
});

// 画像アップロードイベントハンドラ
document.addEventListener('DOMContentLoaded', function () {
  const postForm = document.getElementById('imageForm');
  if (!postForm) return;

  const fileField = document.querySelector('input[type="file"]');
  fileField.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const blob = window.URL.createObjectURL(file);
    const cancel_upload_button = document.getElementById("cancel-upload");

    // 'image-upload'クラスを持つ要素の背景画像を設定
    const imageUploadElement = document.querySelector('.image-upload');
    if (imageUploadElement && cancel_upload_button) {
      imageUploadElement.style.backgroundImage = `url(${blob})`;
      imageUploadElement.style.backgroundSize = 'cover'; // 背景画像のサイズ調整
      imageUploadElement.style.backgroundPosition = 'center'; // 背景画像を中央に配置
      cancel_upload_button.style.display = "block";
    }
  });
});

// 画像アップロードキャンセルボタンイベントリスナー
const cancelUploadButton = document.getElementById('cancel-upload');
cancelUploadButton.addEventListener('click', (e) => {
  const fileField = document.querySelector('input[type="file"]');
  const imageUploadElement = document.querySelector('.image-upload');
  const cancel_upload_button = document.getElementById("cancel-upload");
  e.preventDefault();
  if (fileField) {
    fileField.value = '';
    if (imageUploadElement) {
      cancel_upload_button.style.display = "none";
      imageUploadElement.style.backgroundImage = "none";
    }
  }
});

function getImageByUserIdAndImageId(groupedImages, userId, userSpecificImageId) {
  const userImages = groupedImages[userId];

  if (!userImages) {
    return null;
  }

  const image = userImages.find(img => img.user_specific_id === userSpecificImageId);

  return image || null;
}

function userViewedImage(imageViewInfo, userId, groupedImages) {
  const totalImageCount = groupedImages[userId].length;

  imageViewInfo[userId].viewedImagesCount++;

  if (imageViewInfo[userId].viewedImagesCount >= totalImageCount) {
    imageViewInfo[userId].viewedImagesCount = 0;
    imageViewInfo[userId].hasViewedAllImages = true;
  } else {
    imageViewInfo[userId].hasViewedAllImages = false;
  }

  return imageViewInfo[userId].viewedImagesCount
}
function createUserImageViewInfo(groupedImages) {
  const imageViewInfo = {};

  Object.keys(groupedImages).forEach(userId => {
    const imageCount = groupedImages[userId].length;

    imageViewInfo[userId] = {
      viewedImagesCount: 0,
      hasViewedAllImages: false,
    };
  });

  return imageViewInfo;
}



var container = document.getElementById('current-post-container');

if (imagesData.length > 0) {
  var groupedImages = imagesData.reduce((acc, image) => {
    if (!acc[image.user_id]) {
      acc[image.user_id] = [];
    }
    acc[image.user_id].push(image);
    return acc;
  }, {});

  Object.keys(groupedImages).forEach(userId => {
    groupedImages[userId].forEach((image, index) => {
      image.user_specific_id = index + 1; // ユーザー固有のIDを割り振る
    });
  });

  const imageViewInfo = createUserImageViewInfo(groupedImages);

  var displayedUserIds = new Set();
  imagesData.forEach(function (image) {
    if (!displayedUserIds.has(image.user_id)) {
      displayedUserIds.add(image.user_id);
      var postCount = imagesData.filter(img => img.user_id === image.user_id).length;

      var postWrapper = document.createElement('div');
      postWrapper.className = 'post_wrapper';

      var postIcon = document.createElement('div');
      postIcon.className = 'postIcon';
      postIcon.innerHTML = '<div class="post_count" >' + postCount + '</div>'
        + '<img src="' + image.url + '" class="post">';

      if (image.user_id == login_user_id) {
        var postGreenIcon = document.createElement('div')
        postGreenIcon.className = 'postGreenButton'
        postGreenIcon.id = 'postGreenButton'
        postGreenIcon.innerHTML = '<img src="' + postGreenButton + '" class="postGreeniImage">';
      }

      var postUsername = document.createElement('p')
      postUsername.className = 'post_username';
      postUsername.innerHTML = image.user_name;


      container.appendChild(postWrapper);
      postWrapper.appendChild(postIcon);
      postWrapper.appendChild(postUsername);
      if (postGreenIcon) {
        postWrapper.appendChild(postGreenIcon);
        var sline = document.createElement('div')
        sline.className = 'sline';
        container.appendChild(sline);
      }

      postIcon.addEventListener('click', function () {
        var postCountElement = postWrapper.querySelector('.post_count');
        var currentCount = parseInt(postCountElement.textContent);
        var view_count = userViewedImage(imageViewInfo, image.user_id, groupedImages);
        console.log(imageViewInfo)
        var selected_image = getImageByUserIdAndImageId(groupedImages, image.user_id, view_count + 1);
        if (selected_image) {
          map.panTo({ lat: selected_image.latitude, lng: selected_image.longitude });
        }
        if (currentCount > 1) {
          postCountElement.textContent = currentCount - 1;
        } else if (currentCount == 1) {
          postCountElement.style.display = "none"
        }
      });
    }
  });

  if (!displayedUserIds.has(parseInt(login_user_id))) {
    var postWrapper = document.createElement('div');
    postWrapper.className = 'post_wrapper';

    var postIcon = document.createElement('div');
    postIcon.className = 'postIcon';
    postIcon.innerHTML = '<div class="post_count" style="display: none;"></div>'
      + '<img src="' + login_user_icon + '" class="post">';

    var postUsername = document.createElement('p')
    postUsername.className = 'post_username';
    postUsername.innerHTML = login_user_name;

    var postGreenIcon = document.createElement('div')
    postGreenIcon.className = 'postGreenButton'
    postGreenIcon.id = 'postGreenButton'
    postGreenIcon.innerHTML = '<img src="' + postGreenButton + '" class="postGreeniImage">';

    var sline = document.createElement('div')
    sline.className = 'sline'
    container.appendChild(postWrapper);
    postWrapper.appendChild(postIcon);
    postWrapper.appendChild(postUsername);
    container.appendChild(sline);
    postWrapper.appendChild(postGreenIcon);
  }
} else {
  var postWrapper = document.createElement('div');
  postWrapper.className = 'post_wrapper';

  var postIcon = document.createElement('div');
  postIcon.className = 'postIcon';
  postIcon.innerHTML = '<div class="post_count" style="display: none;"></div>'
    + '<img src="' + login_user_icon + '" class="post">';

  var postUsername = document.createElement('p')
  postUsername.className = 'post_username';
  postUsername.innerHTML = login_user_name;

  var postGreenIcon = document.createElement('div')
  postGreenIcon.className = 'postGreenButton'
  postGreenIcon.id = 'postGreenButton'
  postGreenIcon.innerHTML = '<img src="' + postGreenButton + '" class="postGreeniImage">';

  var sline = document.createElement('div')
  sline.className = 'sline'
  container.appendChild(postWrapper);
  postWrapper.appendChild(postIcon);
  postWrapper.appendChild(postUsername);
  container.appendChild(sline);
  postWrapper.appendChild(postGreenIcon);
}


const popupViewBackground = document.getElementById('popup-view-background');
const popupViewImage = document.getElementById('popup-view-image');
const closeViewPopup = document.getElementById('close-view-popup');
const closePopupForm = document.getElementById('close-btn');
const addPostHereButton = document.getElementById('postGreenButton');

// 画像を表示する関数
function showViewPopup(imageSrc) {
  popupViewImage.src = imageSrc; // 画像ソースを設定
  popupViewBackground.style.display = 'block'; // ポップアップを表示
}

// 画像を閉じる関数
function closeViewPopupFunc() {
  popupViewBackground.style.display = 'none'; // ポップアップを非表示
}

// ポップアップフォームの閉じるボタンイベントリスナー
function closePopupFormFunc() {
  popupForm.style.display = 'none';
}

// クリックイベントリスナーを追加 
closeViewPopup.onclick = closeViewPopupFunc;
popupViewBackground.onclick = closeViewPopupFunc;
closePopupForm.onclick = closePopupFormFunc;

addPostHereButton.addEventListener('click', function () {
  if (popupForm) {
    getCurrentLocation().then(coords => {
      popupForm.style.display = 'flex';
      document.getElementById('latitude-field').value = coords.lat;
      document.getElementById('longitude-field').value = coords.lng;
    });
  } else {
    console.error('popupForm not found');
  }
});
