class HeaderDrawerMenu {
  constructor() {
    this.trigger = document.querySelector('.js-headerDrawerTrigger');
    this.header = document.querySelector('.js-header');
    this.events();
  }

  toggleTheDrawer() {
    this.header.classList.toggle('drawer-is-visible');
  }

  events() {
    this.trigger.addEventListener('click', () => this.toggleTheDrawer());
  }
}

export default HeaderDrawerMenu;