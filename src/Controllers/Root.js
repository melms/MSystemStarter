import {Controller, view} from "./../MSystem.js"
import {Header} from "./../Views/Text.js"

export class Root extends Controller {
	views = () => [
		view(Header, "Hello, World")
	]
}
