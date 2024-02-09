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
    if (popupForm ){
      popupForm.style.display = 'flex';
      if (user_signed_in){
        document.getElementById('latitude-field').value = latlng.lat();
        document.getElementById('longitude-field').value = latlng.lng();
      }
    } else {
      console.error('popupForm not found');
    }
  });
}

function createPostTrigerMarker(latlng, sTitle, sCssClass, bVisible, imgsrc, nZIndex, nImgWidth, nImgHeight, isAnim, markerID) {
  var postTrigerMarker = createImageMarker(latlng, imgsrc, sTitle, nImgWidth, nImgHeight, "", isAnim);
}

class ImageOverlay extends google.maps.OverlayView {
  constructor(bounds, imageSrc, map, width, height, className, showLabel, labelContent ,genres ,markerTriger) {
    super();
    this.bounds_ = bounds;
    this.imageSrc_ = imageSrc;
    this.genres = genres;
    this.map_ = map;
    this.width_ = width;
    this.height_ = height;
    this.className_ = className;
    this.showLabel_ = showLabel;
    this.labelContent_ = labelContent;
    this.div_ = null;
    this.bVisible = true;
    this.markerTriger = markerTriger;

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

  hideOverlay() {
    this.div_.style.display= "none";
    this.markerTriger.setMap(null);
  };

  showOverlay() {
    this.div_.style.display="block";
    this.markerTriger.setMap(this.map);
  };

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

function addImageOverlay(map, latlng, ImgUrl, lblContent, ImgWidth, ImgHeight, zoomLevel ,genres ,markerTriger) {
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
    labelContent,
    genres,
    markerTriger
  );

  return postMarker;
}

function extractHashtags(text) {
  const hashtagPattern = /#(\S+)/g;
  
  let hashtags = [];
  
  let matches = text.matchAll(hashtagPattern);

  for (let match of matches) {
    hashtags.push(match[1]);
  }

  return hashtags;
}

window.hideAndShowPostByGenre = function (genres) {
  genres = extractHashtags(genres);
  postMarkers.forEach(marker => {
    if ((marker.genres && Array.isArray(marker.genres) && marker.genres.some(genre => genres.includes(genre))) || (genres.length === 0)){
      marker.showOverlay();
    } else {
      marker.hideOverlay();
    }
    console.log(marker.genres)
  });
  console.log(genres)
};

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
    var postTrigerMarker = createImageMarker({ lat: image.latitude, lng: image.longitude }, post_triger_icon, image.user_name, 80, 80, "", false);
    var postMarker = addImageOverlay(map, { lat: image.latitude, lng: image.longitude }, image.url, image.created_at, 80, 80, zoomLevel ,image.genres ,postTrigerMarker);
    postMarkers.push(postMarker)
    postTrigerMarker.addListener('mouseover', function () {
      postMarker.setImageSize(90, 90);
    });
    postTrigerMarker.addListener('mouseout', function () {
      postMarker.setImageSize(80, 80);
    });

    postTrigerMarker.addListener('click', function () {
      showViewPopup(image)
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


  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
 ////"SearchBoxクラス"はPlacesライブラリのメソッド。引数はinput(ドキュメント上ではinputFieldとある)。
 ////[https://developers.google.com/maps/documentation/javascript/reference/places-widget#SearchBox]

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  let markers = [];
  searchBox.addListener("places_changed", () => {
  ////"place_chaged"イベントはAutoCompleteクラスのイベント.
  ////https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed

    const places = searchBox.getPlaces();
    ////"getPlaces"メソッドはクエリ(検索キーワード)を配列(PlaceResult)で返す。
    ////https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      //"forEach"メソッドは引数にある関数へ、Mapオブジェクトのキー/値を順に代入･関数の実行をする。
        //Mapオブジェクト:
          //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
      marker.setMap(null);
      ////setMapメソッドはMarker(Polyline,Circleなど)クラスのメソッド。Markerを指定した位置に配置する。引数nullにすると地図から取り除く。
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    ////"LatLngBounds"クラスは境界を作るインスンタンスを作成。引数は左下、右上の座標。
    ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/#:~:text=LatLngBounds%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AF%E5%A2%83%E7%95%8C(Bounding,%E4%BD%9C%E3%82%8B%E3%81%93%E3%81%A8%E3%82%82%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82
    places.forEach((place) => {
      if (!place.geometry) {
        ////"geometry"はplaceライブラリのメソッド。

        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        ////"icon"はアイコンを表すオブジェクト。マーカーをオリジナル画像にしたいときなど。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Icon/
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        ////"Point"クラスはマーカーのラベルなどの位置を決めるインスタンスメソッド。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Point/

        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        ////viewport"メソッド
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
        ////"union"メソッドはLatLngBoundsクラスのメソッド。自身の境界に指定した境界を取り込んで合成する。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/union/
      } else {
        bounds.extend(place.geometry.location);
        ////"extend"メソッドはLatLngBoundsクラスのメソッド。自身の境界に新しく位置座標を追加する。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/extend/
      }
    });
    map.fitBounds(bounds);
    ////"fitBounds"メソッドはmapクラスのメソッド。指定した境界を見えやすい位置にビューポートを変更する。
    ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Map/fitBounds/#:~:text=Map.fitBounds()%E3%81%AFMap,%E5%A4%89%E6%9B%B4%E3%81%97%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82

  });
}

// 地図初期化
getCurrentLocation().then(coords => {
  initMap({ lat: coords.lat, lng: coords.lng })
});

document.addEventListener('DOMContentLoaded', function () {
  var postIcons = document.querySelectorAll('.postIcon');
  postIcons.forEach(function (postIcon) {
    var imageCoords = JSON.parse(postIcon.dataset.imageCoords);
    postIcon.addEventListener('click', function () {
      var postCountElement = postIcon.querySelector('.post_count');
      var currentCount = parseInt(postCountElement.textContent);

      if (currentCount > 1) {
        postCountElement.textContent = currentCount - 1;
      } else if (currentCount === 1) {
        postCountElement.style.display = "none";
      }

      var nextCoord = imageCoords.shift();
      imageCoords.push(nextCoord);

      if (nextCoord) {
        map.panTo({ lat: nextCoord[0], lng: nextCoord[1] });
      }
    });
  });
});


const popupViewBackground = document.getElementById('popup-view-background');
const popupViewContent = document.getElementById('popup-view-content');
const popupViewImage = document.getElementById('popup-view-image');
const closeViewPopup = document.getElementById('close-view-popup');
const closePopupForm = document.getElementById('close-btn');
const addPostHereButton = document.getElementById('postGreenButton');
const popupViewLike = document.getElementById('popup-view-like')
const popupViewComment = document.getElementById('popup-view-comment-p')


// 画像を表示する関数
function showViewPopup(image) {
  if (popupViewLike.firstChild) {
    popupViewLike.removeChild(popupViewLike.firstChild);
  }
  const url = `/images/show/${image.id}`; // サーバーからコンテンツを取得するURL
  
  fetch(url, {
    headers: {
      'Accept': 'text/vnd.turbo-stream.html', // Turbo Streamのレスポンスを要求
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(html => {
    popupViewBackground.style.display = 'flex';
    Turbo.renderStreamMessage(html); // TurboでHTMLをレンダリング
  })
  .catch(error => console.error('Error:', error));
}

// 画像を閉じる関数
window.closeViewPopupFunc = function() {
  popupViewBackground.style.display = 'none'; // ポップアップを非表示
}

// ポップアップフォームの閉じるボタンイベントリスナー
function closePopupFormFunc() {
  popupForm.style.display = 'none';
}

popupViewContent.onclick = closeViewPopupFunc;
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

const panToMyPlaceIcon = document.getElementById('panToMyPlace');

panToMyPlaceIcon.addEventListener('click', function () {
  getCurrentLocation().then(coords => {
    map.panTo({ lat: coords.lat, lng: coords.lng });

  });
});

window.panToByImage = function (latlng) {
  map.panTo(latlng);
}

window.redirectToUrl = function (url) {
  window.location.href = url;
}