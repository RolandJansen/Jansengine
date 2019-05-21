import Player from './Player'

export default class KeyBindings {

    constructor(private player: Player) {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            this.processKeyDown(e);
        });
        document.addEventListener("keyup", (e:KeyboardEvent) => {
            this.processKeyUp(e);
        });
    }

    private processKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            this.player.walk = 1;
            break;
            case "KeyS":
            this.player.walk = -1;
            break;
            case "KeyA":
            this.player.rotate = -1;
            break;
            case "KeyD":
            this.player.rotate = 1;
            break;
        }
        // console.log("Keydown: " + e.key + ", " + e.keyCode);
    }

    private processKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
            case "KeyW":
            case "KeyS":
            this.player.walk = 0;
            break;
            case "KeyA":
            case "KeyD":
            this.player.rotate = 0;
            break;
        }
        // console.log("Keyup: " + e.key + ", " + e.code);
    }
}
