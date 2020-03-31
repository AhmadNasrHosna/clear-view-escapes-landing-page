import "../styles/styles.css";
import "lazysizes";
import HeaderDrawerMenu from "./modules/header-drawer-menu";
import StickyHeader from "./modules/sticky-header";
import RevealOnScroll from "./modules/reveal-on-scroll";
import React from "react";
import ReactDOM from "react-dom";

if (module.hot) {
	module.hot.accept();
}

new HeaderDrawerMenu();
new StickyHeader();
new RevealOnScroll(document.querySelectorAll(".c-feature"), 15);
new RevealOnScroll(document.querySelectorAll(".c-testimonial"), 15);

// Splitting Modal code
let modal;
let openModalTriggers = document.querySelectorAll(".js-openModalTrigger");

openModalTriggers.forEach((trigger) =>
	trigger.addEventListener("click", () => {
		if (typeof modal == "undefined") {
			import(/* webpackChunkName: "modal" */ "./modules/modal")
				.then((x) => {
					modal = new x.default();
					setTimeout(() => modal.openTheModal(), 20);
				})
				.catch(() => console.log("There was a problem."));
		} else {
			modal.openTheModal();
		}
	})
);
