let lastMarker = null;
var map;

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
function createImageMarker(latlng, sImgSrc, sTitle, nWidth, nHeight) {
  var nDefaultWidth = nWidth || 20;
  var nDefaultHeight = nHeight || 20;

  var markerOptions = {
    map: map, 
    position: latlng
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
  lastMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight);
  var tooltipOptions = { 
    map: map, 
    marker: lastMarker, 
    content: sTitle, 
    cssClass: sCssClass, 
    visible: bVisible, 
    zIndex: nZIndex
  };
  var label = new MyLabel(tooltipOptions);

  lastMarker.addListener('click', function() {
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
      // 新しいdiv要素を作成
      this.div_ = document.createElement("div");

       if ( bVisible != undefined ) {
          if ( bVisible ) {
             this.div_.style.display = "block";
             this.div_.style.zIndex = 1;
             if ( this.ZIndex != undefined ) {
                this.div_.style.zIndex = this.ZIndex;
             }
          }
       }
       var me = this;
       if ( bVisible == false || bVisible == null) {
          /* ラベル初期設定が、非表示の場合は、マウスオーバー／マウスアウトイベントで表示／非表示するようにする */
          google.maps.event.addListener(this.marker_, 'mouseover', function() {
             me.show();
          });
          /* マウスアウトでラベル非表示.*/
          google.maps.event.addListener(this.marker_, 'mouseout', function() {
             me.hide();
          });
       }
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

  map.addListener('click', function(e) {
    if (lastMarker !== null){
      lastMarker.setMap(null);
    }
    createLabelMarker(e.latLng, "ポスト", "MapTooltip BorderColorRed", true, add_post_icon, 1, 100, 100);
  });
}

// ポップアップフォームの閉じるボタンイベントリスナー
document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'none';
});

// 地図初期化
window.addEventListener('load', initMap);

// 画像アップロードイベントハンドラ
document.addEventListener('DOMContentLoaded', function() {
  const postForm = document.getElementById('imageForm');
  if (!postForm) return;

  const fileField = document.querySelector('input[type="file"]');
  fileField.addEventListener('change', function(e) {
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
