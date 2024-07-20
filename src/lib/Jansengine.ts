import CanvasStack from "./CanvasStack";
import Controller from "./Controller";
import { IEngineOptions, MapData } from "./interfaces";
import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import { getSettings } from "./settings";

/**
 * Main class of the engine.
 *
 * This is influenced by F. Permadi, Jacob Seidelin, Adam Ranfeld and Lode Vandevenne:
 * https://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/
 * https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
 * https://developer.ibm.com/tutorials/wa-canvashtml5layering/
 * https://lodev.org/cgtutor/raycasting.html
 */
export default class Jansengine {

    private settings: IEngineOptions;
    private screen!: CanvasStack;
    private map!: MiniMap;
    private player!: Player;
    private keyBindings!: KeyBindings;
    private controller!: Controller;

    constructor(containerName: string, engineOptions?: IEngineOptions) {
        this.settings = getSettings();

        if (engineOptions) {
            if (engineOptions.canvasSize) {
                this.screen = new CanvasStack(containerName, engineOptions.canvasSize);
            }
            if (engineOptions.map) {
                this.loadMap(engineOptions.map);
            }
        } else {
            this.screen = new CanvasStack(containerName);
        }
    }

    public loadMap(mapData: MapData) {
        this.player = new Player(mapData);
        this.keyBindings = new KeyBindings(this.player);
        this.controller = new Controller(this.screen, mapData, this.player);
    }

    public addTexture(imageName: string, tileType?: number): this {
        this.controller.addTexture(imageName, tileType);
        return this;
    }

    public startGame() {
        // if something then gameCycle()
    }

    public gameCycle() {
        this.player.move();
        this.controller.castAndRender();

        // this.map.updateMiniPlayer(this.player.playerPosition, this.player.direction);
        // this.map.updateRays(this.player.playerPosition, rays);
        // this.map.updatePlayerDirection(this.player.playerPosition, this.player.direction);

        setTimeout(() => {
            this.gameCycle();
        }, 1000 / 30);
    }
}
