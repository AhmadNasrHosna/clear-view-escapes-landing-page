import throttle from 'lodash/throttle';

class StickyHeader {
  constructor() {
    this.header = document.querySelector(".js-header");
    this.headerNavLinks = document.querySelectorAll(".js-headerNav ul li a");
    this.pageSections = document.querySelectorAll(".o-section");
    this.events();
  }

  events() {
    window.addEventListener("scroll", throttle(() => this.runOnScroll(), 200));
  }

  runOnScroll() {
    this.handleHeaderStyles("p-header--is-dark", 150, this.currentScrollFrom("top"));
    this.handleScrollspyNavbar(this.currentScrollFrom("top"));
  }

  handleHeaderStyles(stylesClass, startingThreshold, scrollFromEdge) {
    let currentScroll = scrollFromEdge;

    if (currentScroll >= startingThreshold) {
      this.header.classList.add(stylesClass);
    } else {
      this.header.classList.remove(stylesClass);
    }
  }

  handleScrollspyNavbar(scrollFromEdge) {
    this.headerNavLinks.forEach(link => {
      let currentSection = document.querySelector(link.hash);
      let currentSectionCoords = this.getCoords(currentSection, scrollFromEdge);
      let currentSectionTopEdge = currentSectionCoords.top;
      let currentSectionBottomEdge = currentSectionCoords.bottom;
      let currentScroll = scrollFromEdge + 5; // 5 for adding 5px more to the pageYOffset to match the new scrolled section when clicking on one of navbar links.

      if (currentScroll >= currentSectionTopEdge && currentScroll < currentSectionBottomEdge) {
        // section is touching top of the viewport.
        link.classList.add("is-current-section");
      } else {
        // Now, has gone far away from top of the viewport.
        link.classList.remove("is-current-section");
      }
    });
  }

  getCoords(el, scrollFromEdge) {
    let box = el.getBoundingClientRect();
    let elemHeight = el.offsetHeight;

    return {
      top: box.top + scrollFromEdge,
      bottom: box.top + elemHeight + scrollFromEdge,
      height: elemHeight
    }
  }

  currentScrollFrom(edge) {
    let currentScroll = window.pageYOffset;
    let viewportTopEdge = currentScroll;
    let viewportBottomEdge = currentScroll + document.documentElement.clientHeight;

    if (edge == "top") {
      return viewportTopEdge;
    } else if (edge == "bottom") {
      return viewportBottomEdge
    }
  }
}

export default StickyHeader;