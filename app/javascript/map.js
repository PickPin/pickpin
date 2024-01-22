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

    map.panTo(lat_lng);
}

window.initMap = initMap;


document.getElementById('add-image-button').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'none';
});