import ReactDOM from "react-dom"
import {view} from "./MSystem.js"
import {Root} from "./Controllers/Root.js"
import "./Style/App.css"

ReactDOM.render(view(Root, null), document.getElementById("App"))
