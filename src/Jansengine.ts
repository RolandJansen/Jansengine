import CanvasBuilder from "./CanvasBuilder";
import { IEngineOptions } from "./interfaces";
import IProjectionPlane from "./IProjectionPlane";
import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import getProjectionPlaneInstance from "./ProjectionPlane";
import Raycaster from "./Raycaster";
import Renderer from "./Renderer";
import { getSettings } from "./settings";
import Texture from "./Texture";

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
    private screen!: CanvasBuilder;
    private map!: MiniMap;
    private player!: Player;
    private keyBindings!: KeyBindings;
    private rayCaster!: Raycaster;
    private projectionPlane: IProjectionPlane;
    private renderer: Renderer;

    constructor(containerName: string, engineOptions?: IEngineOptions) {
        this.settings = getSettings();

        if (engineOptions) {
            if (engineOptions.canvasSize) {
                this.screen = new CanvasBuilder(containerName, engineOptions.canvasSize);
            }
            if (engineOptions.map) {
                this.loadMap(engineOptions.map);
            }
        } else {
            this.screen = new CanvasBuilder(containerName);
        }
        this.projectionPlane = getProjectionPlaneInstance(this.settings);
        this.renderer = new Renderer(this.screen.getGameContext(), this.projectionPlane);
    }

    public gameCycle() {
        this.player.move();
        const rays = this.rayCaster.castRays(this.player.playerPosition, this.player.direction);
        // console.log(rays);
        // this.map.updateMiniPlayer(this.player.playerPosition, this.player.direction);
        // this.map.updateRays(this.player.playerPosition, rays);
        // this.map.updatePlayerDirection(this.player.playerPosition, this.player.direction);
        this.renderer.render(rays);

        setTimeout(() => {
            this.gameCycle();
        }, 1000 / 30);
    }

    public loadMap(mapData: number[][]) {
        this.map = new MiniMap(mapData, this.screen);
        this.player = new Player(mapData);
        this.keyBindings = new KeyBindings(this.player);
        this.rayCaster = new Raycaster(mapData, this.player.playerPosition, this.projectionPlane);
    }

    public addTexture(imageName: string, tileType?: number): this {
        const texture = new Texture(imageName);
        if (tileType) {
            this.renderer.addTexture(texture, tileType);
        } else {
            this.renderer.addTexture(texture);
        }
        return this;
    }

}
