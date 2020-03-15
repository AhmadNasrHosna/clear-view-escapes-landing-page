import '../styles/styles.css';
import HeaderDrawerMenu from './modules/header-drawer-menu';
import StickyHeader from './modules/sticky-header';
import RevealOnScroll from './modules/reveal-on-scroll';

if (module.hot) {
  module.hot.accept();
}

new HeaderDrawerMenu();
new StickyHeader();
new RevealOnScroll(document.querySelectorAll('.c-feature'), 15);
new RevealOnScroll(document.querySelectorAll('.c-testimonial'), 15);