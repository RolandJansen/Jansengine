import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import Stage from "./Stage";

/**
 * Main class of the engine.
 *
 * This is heavily influenced by other projects:
 * https://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/
 * https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
 * https://developer.ibm.com/tutorials/wa-canvashtml5layering/
 */
export default class Jansengine {

    private stage: Stage;
    private map!: MiniMap;
    private player!: Player;
    private keyBindings!: KeyBindings;

    constructor(containerName: string) {

        this.stage = new Stage(containerName);
    }

    public gameCycle() {
        this.player.move();
        this.map.updateMiniPlayer(this.player.coords, this.player.directionAngle);

        setTimeout(() => {
            this.gameCycle();
        }, 1000 / 30);
    }

    public loadMap(mapData: number[][]) {
        this.map = new MiniMap(this.stage, mapData);
        this.player = new Player(mapData);
        this.keyBindings = new KeyBindings(this.player);
    }

}
