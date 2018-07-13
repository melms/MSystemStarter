import React, { Component } from "react"
import ReactDOM from "react-dom"

class MComponent extends Component {
	// OVERRIDE METHODS
	init() { }
	views(props) { return props._views }
	additionalClasses() { return [] }
	additionalProps() { return {} }

	// GETTERS
	get name() { return this.constructor.name }
	get dom() { return ReactDOM.findDOMNode(this) }
	get parent() { return this._reactInternalFiber._debugOwner ? this._reactInternalFiber._debugOwner.stateNode : null  }
	get controller() {
		let current = this.parent
		while (current) {
			if (current instanceof Controller) return current
			current = current.parent
		}
		return null
	}

	// METHODS
	listen(name, handler) {
		if (MEvents.events[name] === undefined) MEvents.events[name] = []
		this._events.push([name, handler])
		MEvents.events[name].push(handler)
	}

	removeAllListeners() {
		this._events.forEach(e => {
			const ind = MEvents.events[e[0]].indexOf(e[1])
			if (ind >= 0) MEvents.events[e[0]].splice(ind, 1)
		})
		this._events = []
	}

	notify(name) {
		if (MEvents.events[name] === null) return
		let args = Array.prototype.slice.call(arguments)
		args.shift()
		for (let i in MEvents.events[name]) MEvents.events[name][i].apply(this, args)
	}

	constructor() {
		super()
		this._events = []
		this.init()
	}

	componentWillUnmount() {
		this.removeAllListeners()
	}

	render() {
		const className = this.additionalClasses().concat([this.name]).join(" ").trim()
		return view(className, this.views(this.props), Object.assign({}, this.additionalProps(), {onClick: this._onClick}))
	}

	// TODO
	// onFocus = e => .....
	// onBlur = e => .....
	// for all events ....
	_onClick = e => {
		if (this.onClick()) e.stopPropagation()
	}
	onClick =()=> {
		if (this.props.onClick) {
			this.props.onClick(this)
			return true
		}
		return false
	}

	// FIXES THE KEY ERROR YOU WILL SEE IN THE CONSOLE, WILL ADD IN NEXT COMMIT

	// processViews = views => {
	// 	const r = []
	// 	views.forEach(function(v, i) {
	// 		if (Array.isArray(v.content)) v.content = this.processViews(v.content)
	// 		if (!("key" in v.props)) v.props.key = i
	// 		const el = React.createElement("div", v.props, v.content)
	// 		// if (v.props.onClick) el.onClick = el.props.onClick.bind(null, this)
	// 		r.push(el)
	// 	}.bind(this))
	// 	return r
	// }

	// render() {
	// 	const views = this.views()
	// 	if (!Array.isArray(views)) return this.processViews([views])
	// 	return this.processViews(views)
	// }
}

export class Controller extends MComponent {}
export class View extends MComponent {}

export class Table extends View {
	additionalClasses() { return ["Table"] }
}

export class Cell extends View {
	additionalClasses() { return ["Cell"] }
}

export class Image extends View {
	additionalClasses() { return ["Image"] }
	additionalProps() { return {style: {backgroundImage: `url( ${this.url()} )` }}}
	url() { return "" }
}

export class Button extends View {
	isSelected() { return false }
	isDisabled() { return false }
	title() { return "Title" }
	selectedTitle() { return "Selected Title" }
	additionalClasses() {
		const classes = ["Button"]
		if (this.isSelected()) classes.push("Selected")
		if (this.isDisabled()) classes.push("Disabled")
		return classes
	}
	views(props) {
		return this.isSelected() ? this.selectedTitle() : this.title()
	}
}

export const view = function(className, views, props={}) {
	if (typeof(className) === "function") {
		props._views = views
		return React.createElement(className, props)
	}
	props.className = className
	return React.createElement("div", props, views)
}

class MEvents {
	static events = {}
}
