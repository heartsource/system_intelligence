const mobileScreen = window.matchMedia('(max-width: 990px)');
//const laptopOrDesktopScreen = window.matchMedia('(min-width: 991px)');

const handleDropdownToggle = () => {
  const dropdownToggles = document.querySelectorAll(
    '.dashboard-nav-dropdown-toggle'
  );
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const dropdown = this.closest('.dashboard-nav-dropdown');
      dropdown.classList.toggle('show');
      const siblings = dropdown.parentNode.children;
      for (let sibling of siblings) {
        if (
          sibling !== dropdown &&
          sibling.classList.contains('dashboard-nav-dropdown')
        ) {
          sibling.classList.remove('show');
        }
      }
    });
  });
};

const handleMenuToggle = () => {
  const dashboardNav = document.querySelector('.dashboard-nav');
  const dashboard = document.querySelector('.dashboard');
  if (mobileScreen.matches) {
    dashboardNav.classList.toggle('mobile-show');
    dashboard.classList.remove('dashboard-compact');
  } else {
    dashboard.classList.toggle('dashboard-compact');
    dashboardNav.classList.remove('mobile-show');
  }
};

export { handleDropdownToggle, handleMenuToggle };
