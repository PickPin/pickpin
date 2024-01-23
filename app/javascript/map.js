let lastMarker = null;
let buttonOverlay = null; // 画像投稿ボタンのOverlayViewを保持するための変数
var map;

function createMarkerImage(sImageSrc,nWidth,nHeigth,nX,nY) {
   var oMarkerImg = null;
   if ( nX != undefined ) {
      oMarkerImg = new google.maps.MarkerImage
            (
              sImageSrc,             /* url */
              new google.maps.Size(nWidth,nHeigth),    /* size */
              new google.maps.Point(0,0),       /* origin */
              new google.maps.Point(nX,nY)       /* anchor */
            );
   } else {
      oMarkerImg = new google.maps.MarkerImage
            (
              sImageSrc,             /* url */
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
  var marker = createImageMarker(latlng,imgsrc,sTitle,nImgWidth,nImgHeight);
  console.log(marker)
  var tooltipOptions= { map :map, marker:marker, content:sTitle, cssClass:sCssClass,visible:bVisible,zIndex:nZIndex};
  var labe = new MyLabel(tooltipOptions);

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
      
      // ボタン要素を作成
      const button = document.createElement("button");
      button.id = "add-image-button";
      button.className = "user-form";
      button.textContent = "画像追加";
      
      // ボタンをdivに追加
      this.div_.appendChild(button);

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

  var myLatlng1 = new google.maps.LatLng(36.109682, 140.101583);

  var marker1 = createLabelMarker(myLatlng1,"ポスト","MapTooltip BorderColorRed",true,add_post_icon,1,100,100);

}

document.getElementById('add-image-button').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popupForm').style.display = 'none';
});


window.addEventListener('load', initMap);