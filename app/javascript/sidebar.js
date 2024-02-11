document.addEventListener('turbo:load', function () {
var userSearchSideBarOpenButton = document.getElementById('userSearchSideBarOpenButton');
var myProfileSideBarOpenButton = document.getElementById('myProfileSideBarOpenButton');
var notificationSideBarOpenButton = document.getElementById('notificationSideBarOpenButton');
var myProfileSideBar = document.getElementById('myProfileSideBar');
var userSearchSideBar = document.getElementById('userSearchSideBar');
var notificationSideBar = document.getElementById('notificationSideBar');
var closeUserSearchSidebar = document.getElementById('closeUserSearchSidebar');
var closeMyProfileSidebar = document.getElementById('closeMyProfileSidebar')
var closeNotificationSidebar = document.getElementById('closeNotificationSidebar')
var selectedSideBar;


function showAndHideSidebar(sideBarId) {
  console.log(sideBarId)
  switch (sideBarId) {
    case 0:
      selectedSideBar = myProfileSideBar;
      break;
    case 1:
      selectedSideBar = userSearchSideBar;
      break;
    case 2:
      selectedSideBar = notificationSideBar;
      break;
  }
  if (selectedSideBar.classList.contains('menu-active')) {
    selectedSideBar.classList.remove('menu-active');
  } else {
    console.log(selectedSideBar)
    selectedSideBar.classList.add('menu-active');
  }
}

userSearchSideBarOpenButton.addEventListener("click", function() {
  showAndHideSidebar(1); 
});

closeUserSearchSidebar.addEventListener("click", function() {
  showAndHideSidebar(1); 
});


myProfileSideBarOpenButton.addEventListener("click", function() {
  showAndHideSidebar(0); 
});

closeMyProfileSidebar.addEventListener("click", function() {
  showAndHideSidebar(0); 
});

notificationSideBarOpenButton.addEventListener("click", function() {
  showAndHideSidebar(2); 
});

closeNotificationSidebar.addEventListener("click", function() {
  showAndHideSidebar(2); 
});

const notificationButton = document.getElementById("notificationButton").querySelector('img');

window.notificationChecked = function () {
  notificationButton.src = notificationButtonIcon;
}

});
