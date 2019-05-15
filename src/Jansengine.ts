import KeyBindings from "./KeyBindings";
import MiniMap from "./MiniMap";

export default class Jansengine {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map!: MiniMap;
    private keyBindings: KeyBindings;

    constructor(canvasName: string) {
        const canvas = document.getElementById(canvasName);

        if (canvas !== null && this.isCanvas(canvas)) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d")!;
        } else {
            throw new Error(`${canvasName} is not of type HTMLCanvasElement`);
        }

        this.setFocusToCanvas(this.canvas);
        this.keyBindings = new KeyBindings();
    }

    public gameCycle() {
        setTimeout(this.gameCycle, 1000 / 30);
    }

    public loadMap(mapData: number[][]) {
        this.map = new MiniMap(this.canvas, mapData);
    }

    // type guard
    private isCanvas(el: HTMLElement): el is HTMLCanvasElement {
        return (el as HTMLCanvasElement).getContext !== undefined;
    }

    private setFocusToCanvas(canvasElement: HTMLCanvasElement) {
        canvasElement.focus();
    }
}
