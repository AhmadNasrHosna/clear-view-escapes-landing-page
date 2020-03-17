import throttle from 'lodash/throttle';

class RevealOnScroll {
  constructor(items, thresholdPercent) {
    this.thresholdPercent = thresholdPercent / 100;
    this.itemsToReveal = items;
    this.hideInitially();
    this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
    this.events();
  }

  events() {
    window.addEventListener('scroll', this.scrollThrottle)
  }

  hideInitially() {
    this.itemsToReveal.forEach(el => {
      el.classList.add("o-reveal", "o-reveal--is-hidden");
      el.isRevealed = false;
    });
    this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
  }

  calcCaller() {
    console.log("Scroll function ran")
    this.itemsToReveal.forEach(el => {
      if (el.isRevealed) return;

      this.calculateIfScrolledTo(el);
    });
  }

  calculateIfScrolledTo(el) {
    let revealedItemCoords = this.getCoords(el);
    let revealStartingPoint = revealedItemCoords.top + (revealedItemCoords.height * this.thresholdPercent);
    let currentScroll = window.pageYOffset + document.documentElement.clientHeight;

    /*
     * When current scroll reaches the top of the revealed items,
     * start calculating its coords:
     */
    if (currentScroll >= revealedItemCoords.top) {
      console.log("Element was calculated");
      /*
       * Now, we already reach the top of the revealed item,
       * plz start revealing our hidden items when current
       * scroll reaches again this particular starting point:
       */
      if (currentScroll >= revealStartingPoint) {
        el.classList.add("o-reveal--is-visible");
        el.isRevealed = true;

        if (el.isLastItem) {
          window.removeEventListener('scroll', this.scrollThrottle);
          console.log("Event listener was removed")
        }
      }
    }
  }

  getCoords(el) {
    let box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      height: el.offsetHeight
    }
  }
}
export default RevealOnScroll;