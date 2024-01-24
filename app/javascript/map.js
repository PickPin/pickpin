let lastMarker = null;
var map;

function createMarkerImage(sImageSrc,nWidth,nHeigth,nX,nY) {
   var oMarkerImg = null;
   if ( nX != undefined ) {
      oMarkerImg = new google.maps.MarkerImage
            (
              sImageSrc,
              new google.maps.Size(nWidth,nHeigth),
              new google.maps.Point(0,0),
              new google.maps.Point(nX,nY)
            );
   } else {
      oMarkerImg = new google.maps.MarkerImage
            (
              sImageSrc,         
              new google.maps.Size(nWidth,nHeigth)
            );
   }
   return oMarkerImg;
}

function createImageMarker(latlng,sImgSrc,sTitle,nWidth,nHeight) {
  var nDefaultWidth = 20;
  var nDefaultHeight= 20;
  if ( nWidth != undefined ) { 
     nDefaultWidth = nWidth;
  }
  if ( nHeight != undefined ) { 
     nDefaultHeight = nHeight;
  }
  var marker;
  if ( sImgSrc == "" ) { 
      marker = new google.maps.Marker(
        {
           
           map: map, 
           position: latlng
        }
     );
  } else {
     var oImg = createMarkerImage(sImgSrc,nDefaultWidth,nDefaultHeight);
      marker = new google.maps.Marker(
        {
           
           map: map, 
           position: latlng,
           icon:oImg
        }
     );
  }
  if ( sTitle != undefined ) {
     marker.setTitle(sTitle);
  }

  return marker;
}

function createLabelMarker(latlng,sTitle,sCssClass,bVisible,imgsrc,nZIndex,nImgWidth,nImgHeight) {
  lastMarker = createImageMarker(latlng,imgsrc,sTitle,nImgWidth,nImgHeight);
  var tooltipOptions= { map :map, marker:lastMarker, content:sTitle, cssClass:sCssClass,visible:bVisible,zIndex:nZIndex};
  var labe = new MyLabel(tooltipOptions);

  lastMarker.addListener('click', function() {
    var popupForm = document.getElementById('popupForm');
    if (popupForm) {
      popupForm.style.display = 'flex';
      document.getElementById('latitude-field').value = latlng.lat()
      document.getElementById('longitude-field').value = latlng.lng()
    } else {
      console.error('popupForm not found');
    }
  });

  return labe;
}

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
     if ( this.MarkerImage == undefined ) {
        /* 通常マーカーの場合*/
        this.TopPosition = options.top|| 35;
     } else {
        /* アイコン指定時 */
        this.TopPosition = options.top|| -5;
     }
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

function initMap() {
  const tsukuba = { lat: 36.109682, lng: 140.101583 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: tsukuba,
  });

  map.addListener('click', function(e) {
    if (lastMarker != null){
      lastMarker.setMap(null);
    }
    createLabelMarker(e.latLng,"ポスト","MapTooltip BorderColorRed",true,add_post_icon,1,100,100);
  });

}

document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'none';
});


window.addEventListener('load', initMap);


import { Controller } from "@hotwired/stimulus"

let data = null;

export default class extends Controller {
  static targets = [ "output", "input"];
  
  connect() {
    data = new DataTransfer();
  }

  readImage(e) {
    let input = this.inputTarget;
    let output = this.outputTarget;

    if (input.files) {
      let files = Array.from(input.files);
      
      files.forEach((f) => data.items.add(f));
      for (let i = 0; i < files.length; i++) {
        this.readOne(files[i], i, output);
      }
      input.files = data.files;
    }
  }

  readOne(f, index, output) {
    let reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      const html= `<li>
                  <div>
                    <image src="${reader.result}"/>
                  </div>
                </li>`;
      output.insertAdjacentHTML('beforeend', html);
    };
  }
}