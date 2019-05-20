import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";
import Player from "./Player";
import Stage from "./Stage";
import { ICanvasStack } from "./interfaces";

export default class Jansengine {

    private stage: Stage;
    private map!: MiniMap;
    private player: Player;
    private keyBindings: KeyBindings;

    constructor(containerName: string) {

        this.stage = new Stage(containerName);
        this.player = new Player();
        this.keyBindings = new KeyBindings(this.player);
    }

    public gameCycle() {
        this.player.moveOneStep();

        setTimeout(this.gameCycle, 1000 / 30);
    }

    public loadMap(mapData: number[][]) {
        this.map = new MiniMap(this.stage.getMiniMapContext(), mapData);
    }

}
