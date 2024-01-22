
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
  }
  window.initMap = initMap;