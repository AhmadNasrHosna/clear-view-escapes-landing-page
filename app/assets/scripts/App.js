import '../styles/styles.css';
import HeaderDrawerMenu from './modules/HeaderDrawerMenu';
import RevealOnScroll from './modules/RevealOnScroll';

if (module.hot) {
  module.hot.accept();
}

new HeaderDrawerMenu();
new RevealOnScroll(document.querySelectorAll('.c-feature'), 25);
new RevealOnScroll(document.querySelectorAll('.c-testimonial'), 25);