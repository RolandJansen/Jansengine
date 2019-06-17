import { IEngineOptions } from "./interfaces";
import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import ProjectionScreen from "./ProjectionScreen";
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
    private screen!: ProjectionScreen;
    private map!: MiniMap;
    private player!: Player;
    private keyBindings!: KeyBindings;
    private rayCaster!: Raycaster;
    private renderer: Renderer;

    constructor(containerName: string, engineOptions?: IEngineOptions) {
        this.settings = getSettings();

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

        this.renderer = new Renderer(this.screen);
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
        this.rayCaster = new Raycaster(mapData, 1, this.player.playerPosition);
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
