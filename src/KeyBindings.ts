import Player from "./Player";

export default class KeyBindings {

    constructor(private player: Player) {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            this.processKeyDown(e);
        });
        document.addEventListener("keyup", (e: KeyboardEvent) => {
            this.processKeyUp(e);
        });
    }

    private processKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            this.player.walkForBack = 1;
            break;
            case "KeyS":
            this.player.walkForBack = -1;
            break;
            case "KeyA":
            this.player.rotateLeftRight = -1;
            break;
            case "KeyD":
            this.player.rotateLeftRight = 1;
            break;
        }
    }

    private processKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            case "KeyS":
            this.player.walkForBack = 0;
            break;
            case "KeyA":
            case "KeyD":
            this.player.rotateLeftRight = 0;
            break;
        }
    }
}
