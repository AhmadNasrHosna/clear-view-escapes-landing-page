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

class Counter extends React.Component {
	render() {
		var textStyle = {
			fontSize: 72,
			color: "#333",
			fontWeight: "700"
		};

		return <p style={textStyle}>{this.props.display}</p>;
	}
}

class CounterParent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			count: 0
		};
	}

	render() {
		var backgroundStyle = {
			padding: 50,
			backgroundColor: "#FFC53A",
			width: 250,
			borderRadius: 10,
			textAlign: "center"
		};

		var buttonStyle = {
			fontSize: "1.3rem",
			width: 30,
			height: 30,
			color: "#333",
			fontWeight: "700"
		};

		return (
			<div style={backgroundStyle}>
				<Counter display={this.state.count} />
				<button style={buttonStyle}>+</button>
			</div>
		);
	}
}

ReactDOM.render(<CounterParent />, document.querySelector("#container"));
