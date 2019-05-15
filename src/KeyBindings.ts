export default class KeyBindings {

    constructor() {
        document.addEventListener("keydown", this.processKeyDown);
        document.addEventListener("keyup", this.processKeyUp);
    }

    private processKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        console.log("Keydown: " + e.key + ", " + e.code);
    }

    private processKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        console.log("Keyup: " + e.key + ", " + e.code);
    }
}
