class Modal {
  constructor() {
    this.injectHTML();
    this.modal = document.querySelector('.js-modal');
    this.closeModalTrigger = document.querySelector('.js-closeModalTrigger');
    this.events();
  }

  events() {
    // Listen for close click:
    this.closeModalTrigger.addEventListener('click', () => this.closeTheModal());

    // Listen for pushing any key:
    document.addEventListener('keydown', e => this.closeTheModalOnESC(e));
  }

  openTheModal() {
    this.modal.classList.add('is-visible');
    this.modal.isOpen = true;
  }

  closeTheModal() {
    this.modal.classList.remove('is-visible');
    this.modal.isOpen = false;
  }

  closeTheModalOnESC(e) {
    if (e.key == "Escape" && this.modal.isOpen) {
      this.closeTheModal();
    }
  }

  injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="c-modal js-modal">
        <div class="o-container">
          <div class="c-modal__inner l-flow l-flow--md u-align-center">
            <div class="o-section__head l-section__head">
              <img src="assets/images/icons/mail.svg" class="c-icon--inline section-title__icon">
              <h2 class="o-section__title">Get in <strong>Touch</strong></h2>
            </div>
            <p class="c-modal__description u-m-auto--horizontal">We will have an online order system in place soon. Until then, connect with us on any of the platforms below!</p>
            <ul class="c-social o-list-bare l-flow__all-s3">
              <li class="c-social__item">
                <a href="#0" class="c-social__icon"><img src="assets/images/icons/facebook.svg" alt="Facebook"></a>
              </li>
              <li class="c-social__item">
                <a href="#0" class="c-social__icon"><img src="assets/images/icons/twitter.svg" alt="Twitter"></a>
              </li>
              <li class="c-social__item">
                <a href="#0" class="c-social__icon"><img src="assets/images/icons/instagram.svg" alt="Instagram"></a>
              </li>
              <li class="c-social__item">
                <a href="#0" class="c-social__icon"><img src="assets/images/icons/youtube.svg" alt="YouTube"></a>
              </li>
          </div>
        </div>
        <button class="c-modal__close js-closeModalTrigger">
            <span class="u-sr-only">Close the modal</span>
        </button>
      </div>
    `);
  }
}

export default Modal;