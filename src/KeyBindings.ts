import Player from './Player'

export default class KeyBindings {

    constructor(private player: Player) {
        document.addEventListener("keydown", this.processKeyDown);
        document.addEventListener("keyup", this.processKeyUp);
    }

    private processKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            this.player.directionForBack = 1;
            break;
            case "KeyS":
            this.player.directionForBack = -1;
            break;
            case "KeyA":
            this.player.directionLeftRight = -1;
            break;
            case "KeyD":
            this.player.directionLeftRight = 1;
            break;
        }
        console.log("Keydown: " + e.key + ", " + e.keyCode);
    }

    private processKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            case "KeyS":
            this.player.directionForBack = 0;
            break;
            case "KeyA":
            case "KeyD":
            this.player.directionLeftRight = 0;
            break;
        }
        console.log("Keyup: " + e.key + ", " + e.code);
    }
}
