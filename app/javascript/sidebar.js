var userSearchSideBarOpenButton = document.getElementById('userSearchSideBarOpenButton');
var userSearchSideBar = document.getElementById('userSearchSideBar');
var closeUserSearchSidebar = document.getElementById('closeUserSearchSidebar');
var selectedSideBar;


function showAndHideSidebar(sideBarId) {
  console.log(sideBarId)
  switch (sideBarId) {
    case '0':
      console.log('profile用サイドバー');
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

