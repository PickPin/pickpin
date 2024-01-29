var userSearchSideBarOpenButton = document.getElementById('userSearchSideBarOpenButton');
var myProfileSideBarOpenButton = document.getElementById('myProfileSideBarOpenButton');
var myProfileSideBar = document.getElementById('myProfileSideBar');
var userSearchSideBar = document.getElementById('userSearchSideBar');
var closeUserSearchSidebar = document.getElementById('closeUserSearchSidebar');
var closeMyProfileSidebar = document.getElementById('closeMyProfileSidebar')
var selectedSideBar;


function showAndHideSidebar(sideBarId) {
  console.log(sideBarId)
  switch (sideBarId) {
    case 0:
      selectedSideBar = myProfileSideBar
      break;
    case 1:
      selectedSideBar = userSearchSideBar;
      break;
    case 'orange':
      console.log('The fruit is an orange.');
      break;
    default:
      console.log('The fruit is not in the list.');
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
