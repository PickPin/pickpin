let lastMarker = null;
var map;
var postMarkers = [];

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
function createImageMarker(latlng, sImgSrc, sTitle, nWidth, nHeight, csName) {
  var nDefaultWidth = nWidth || 20;
  var nDefaultHeight = nHeight || 20;

  var markerOptions = {
    map: map,
    position: latlng,
    className: csName,
    optimized: false
  };

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
function createLabelMarker(latlng, sTitle, sCssClass, bVisible, imgsrc, nZIndex, nImgWidth, nImgHeight) {
  lastMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight, "post_marker");
  var tooltipOptions = {
    map: map,
    marker: lastMarker,
    content: sTitle,
    cssClass: sCssClass,
    visible: bVisible,
    zIndex: nZIndex
  };
  var label = new MyLabel(tooltipOptions);

  lastMarker.addListener('click', function () {
    var popupForm = document.getElementById('popupForm');
    if (popupForm) {
      popupForm.style.display = 'flex';
      document.getElementById('latitude-field').value = latlng.lat();
      document.getElementById('longitude-field').value = latlng.lng();
    } else {
      console.error('popupForm not found');
    }
  });

  return label;
}

// 投稿画像マーカーを作成する関数
function createPostMarker(latlng, sTitle, sCssClass, bVisible, imgsrc, nZIndex, nImgWidth, nImgHeight) {
  var postMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight, "post_image");
  var tooltipOptions = {
    map: map,
    marker: postMarker,
    content: sTitle,
    cssClass: sCssClass,
    visible: bVisible,
    zIndex: nZIndex
  };
  var label = new MyLabel(tooltipOptions);

  postMarker.addListener('click', function () {
    console.log("今後実装")
  });

  return label;
}

// MyLabel クラス定義
class MyLabel extends google.maps.OverlayView {
  constructor(options) {
    super();
    this.latlng = options.marker.getPosition();
    this.setMap(options.map);
    this.div_ = null;
    this.content = options.content;
    this.className = options.cssClass;
    this.marker_ = options.marker;
    this.MarkerImage = options.marker.getIcon();
    this.TopPosition = this.MarkerImage ? (options.top || -5) : (options.top || 35);
    this.ZIndex = options.zIndex || null;
    this.Visible = options.visible || null;
  }

  onAdd() {
    var bVisible = this.Visible;
    if (!this.div_) {
      /* 出力したい要素生成 */
      this.div_ = document.createElement("div");
      this.div_.innerHTML = "";
      this.div_.style.display = "none";
      this.div_.style.zIndex = 3;

      if (bVisible != undefined) {
        if (bVisible) {
          this.div_.style.display = "block";
          this.div_.style.zIndex = 1;
          if (this.ZIndex != undefined) {
            this.div_.style.zIndex = this.ZIndex;
          }
        }
      }
      var me = this;
      if (bVisible == false || bVisible == null) {
        /* ラベル初期設定が、非表示の場合は、マウスオーバー／マウスアウトイベントで表示／非表示するようにする */
        google.maps.event.addListener(this.marker_, 'mouseover', function () {
          me.show();
        });
        /* マウスアウトでラベル非表示.*/
        google.maps.event.addListener(this.marker_, 'mouseout', function () {
          me.hide();
        });
      }
    }
  }

  draw() {
    /* 何度も呼ばれる可能性があるので、div_が未設定の場合のみ要素生成 */
    if (this.div_) {
      /* 出力したい要素生成 */
      this.div_.style.position = "absolute";
      if (this.content != undefined) {
        this.div_.innerHTML = this.content;
        this.div_.className = this.className;
      }

      /* 要素を追加する子を取得 */
      var panes = this.getPanes();
      panes.floatPane.appendChild(this.div_);

      /* ラベルオブジェクト再配置 */
      this.resetPosition();
    }
  }
  /* setMap(null); とすると呼びされます */
  onRemove() {
    if (this.div_) {
      this.marker_.setMap(null);
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
      this.setMap(null);
    }
  }

  resetPosition() {
    if (this.div_) {
      var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      var nImageHeight = 0;
      try {
        nImageHeight = this.MarkerImage.size.height;
      } catch (e) { }

      if (this.TopPosition != undefined) {
        nImageHeight = nImageHeight + this.TopPosition;
      }
      if (this.content != undefined) {
        if (this.content != "") {
          /* 取得したPixel情報の座標に、要素の位置を設定 */
          this.div_.style.left = (String(point.x) - 60) + 'px';
          this.div_.style.top = (String(point.y) - 20) + 'px';
        }
      }
    }
  }

  show() {
    if (this.div_) {
      this.div_.style.display = "block";
      this.resetPosition();
    }
  }

  hide() {
    if (this.div_) {
      this.div_.style.display = "none";
    }
  }

}

// 地図初期化関数
function initMap() {
  const tsukuba = { lat: 36.109682, lng: 140.101583 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: tsukuba,
  });

  if (map.getZoom() < 15) {
    imagesData.forEach(function (image) {
      var postMarker_ = createPostMarker({ lat: image.latitude, lng: image.longitude }, image.created_at, "post_image", false, image.url, 1, 80, 80);
      postMarkers.push(postMarker_);
    });
  } else {
    imagesData.forEach(function (image) {
      var postMarker_ = createPostMarker({ lat: image.latitude, lng: image.longitude }, image.created_at, "post_image", true, image.url, 1, 80, 80);
      postMarkers.push(postMarker_);
    });
  }

  map.addListener("zoom_changed", () => {
    if (map.getZoom() < 15) {
      hideMarkers();
    } else {
      showMarkers();
    }

  })

  map.addListener('click', function (e) {
    if (lastMarker !== null) {
      lastMarker.setMap(null);
    }
    createLabelMarker(e.latLng, "", "add_post", false, add_post_icon, 1, 80, 80);
  });
}

//マーカーのラベルを隠す
function hideMarkers() {
  for (let i = 0; i < postMarkers.length; i++) {
    postMarkers[i].hide();
  }
}

//マーカーのラベルを隠す
function showMarkers() {
  for (let i = 0; i < postMarkers.length; i++) {
    postMarkers[i].show();
  }
}

// ポップアップフォームの閉じるボタンイベントリスナー
document.getElementById('closePopup').addEventListener('click', function () {
  document.getElementById('popupForm').style.display = 'none';
});

// 地図初期化
window.addEventListener('load', initMap);

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
// メニューパネルの開閉
document.addEventListener('DOMContentLoaded', function() {
  var menuButton = document.getElementById('menuButton');
  var closeButton = document.getElementById('closeButton');
  var menu = document.getElementById('menuPanel');

  menuButton.addEventListener('click', function() {
      menuPanel.classList.add('menu-shown');
      menuPanel.classList.remove('menu-hidden');
  });

  closeButton.addEventListener('click', function() {
      menuPanel.classList.add('menu-hidden');
      menuPanel.classList.remove('menu-shown');
  });
});
// 通知パネルの開閉
document.addEventListener('DOMContentLoaded', function() {
  var menuButton = document.getElementById('noticeButton');
  var closeButton = document.getElementById('notice-closeButton');
  var menu = document.getElementById('noticePanel');

  menuButton.addEventListener('click', function() {
      noticePanel.classList.add('menu-shown');
      noticePanel.classList.remove('menu-hidden');
  });

  closeButton.addEventListener('click', function() {
      noticePanel.classList.add('menu-hidden');
      noticePanel.classList.remove('menu-shown');
  });
});
// 検索パネルの開閉
document.addEventListener('DOMContentLoaded', function() {
  var menuButton = document.getElementById('searchButton');
  var closeButton = document.getElementById('search-closeButton');
  var menu = document.getElementById('searchPanel');

  menuButton.addEventListener('click', function() {
      searchPanel.classList.add('menu-shown');
      searchPanel.classList.remove('menu-hidden');
  });

  closeButton.addEventListener('click', function() {
      searchPanel.classList.add('menu-hidden');
      searchPanel.classList.remove('menu-shown');
  });
});


// プロフィール編集ポップアップフォームの閉じるボタンイベントリスナー
document.getElementById('close-edit-Popup').addEventListener('click', function () {
  document.getElementById('edit-popupform').style.display = 'none';
});
