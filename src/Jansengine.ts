import { IEngineOptions } from "./interfaces";
import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import ProjectionScreen from "./ProjectionScreen";
import Raycaster from "./Raycaster";

/**
 * Main class of the engine.
 *
 * This is influenced by F. Permadi, Jacob Seidelin and Adam Ranfeld:
 * https://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/
 * https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
 * https://developer.ibm.com/tutorials/wa-canvashtml5layering/
 */
export default class Jansengine {

    private screen!: ProjectionScreen;
    private map!: MiniMap;
    private player!: Player;
    private keyBindings!: KeyBindings;
    private rayCaster!: Raycaster;

    constructor(containerName: string, engineOptions?: IEngineOptions) {

        if (engineOptions) {
            if (engineOptions.canvasSize) {
                this.screen = new ProjectionScreen(containerName, engineOptions.canvasSize);
            }
            if (engineOptions.map) {
                this.loadMap(engineOptions.map);
            }
        } else {
            this.screen = new ProjectionScreen(containerName);
        }
    }

    public gameCycle() {
        this.player.move();
        const rays = this.rayCaster.castRays(this.player.playerPosition, this.player.directionAngle);
        // console.log(rays);
        this.map.updateMiniPlayer(this.player.playerPosition, this.player.directionAngle);
        this.map.updateRays(this.player.playerPosition, rays);

        // setTimeout(() => {
        //     this.gameCycle();
        // }, 1000 / 30);
    }

    public loadMap(mapData: number[][]) {
        this.map = new MiniMap(mapData, this.screen);
        this.player = new Player(mapData);
        this.keyBindings = new KeyBindings(this.player);
        this.rayCaster = new Raycaster(mapData, 1, this.player.playerPosition);
    }

}
