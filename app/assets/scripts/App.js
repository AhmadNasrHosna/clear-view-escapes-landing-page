import '../styles/styles.css';

if (module.hot) {
  module.hot.accept();
}

alert()

// Show & hide header drawer

const headerDrawerTrigger = document.querySelector('.js-headerDrawerTrigger');
const header = document.querySelector('.js-header');

function handleHeaderDrawerToggle() {
  header.classList.toggle('drawer-is-visible');
}

headerDrawerTrigger.addEventListener('click', handleHeaderDrawerToggle);