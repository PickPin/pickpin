let lastMarker = null; //ユーザーがクリックした位置に作成されるmarker

function initMap() {
    const tsukuba = { lat: 36.109682, lng: 140.101583 }; // 石の広場を指定
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: tsukuba,
    });
    const marker = new google.maps.Marker({
      position: tsukuba,
      map: map,
    });
    
    map.addListener('click', function(e) {
      getClickLatLng(e.latLng, map, lastMarker);
    });
}

window.initMap = initMap;


document.getElementById('add-image-button').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'none';
});

function getClickLatLng(lat_lng, map) {
  console.log(lat_lng.lat(), lat_lng.lng())

  // 前のマーカーがあれば削除
  if (lastMarker) {
      lastMarker.setMap(null);
  }

  // 新しいマーカーを作成
  lastMarker = new google.maps.Marker({
      position: lat_lng,
      map: map
  });

  // クリックした位置のピクセル座標を取得
  const scale = Math.pow(2, map.getZoom());
  const nw = new google.maps.LatLng(
      map.getBounds().getNorthEast().lat(),
      map.getBounds().getSouthWest().lng()
  );
  const worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
  const worldCoordinate = map.getProjection().fromLatLngToPoint(lat_lng);
  const pixelOffset = new google.maps.Point(
      Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
      Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
  );

  // ボタンの位置を更新
  const button = document.getElementById('add-image-button');
  button.style.position = 'absolute';
  button.style.left = `${pixelOffset.x + 20}px`; // 20ピクセルの余白を追加
  button.style.top = `${pixelOffset.y - 20}px`; // 20ピクセル上に配置

  map.panTo(lat_lng);
}
