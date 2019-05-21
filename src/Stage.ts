import { ICanvasStack } from "./interfaces";

export default class Stage {

    private canvasStack: ICanvasStack;

    constructor(containerName: string) {
        const container = document.getElementById(containerName);

        if (container !== null && container.tagName === "DIV") {
            this.canvasStack = this.getNewCanvasStack();

            if (this.isCanvas(this.canvasStack.game)) {
                this.setCanvasStackProperties();
                this.addCanvasElementsToDom(container);
            } else {
                throw new Error('Your browser doesn\'t support the <canvas> element.');
            }

        } else {
            throw new Error(`${containerName} is not a <div> element.`);
        }
    }

    public getGameContext(): CanvasRenderingContext2D {
        return this.canvasStack.game.getContext("2d")!;
    }

    public getMiniMapContext(): CanvasRenderingContext2D {
        return this.canvasStack.miniMap.getContext("2d")!;
    }

    public getMiniPlayerContext(): CanvasRenderingContext2D {
        return this.canvasStack.miniPlayer.getContext("2d")!;
    }

    public setFocusOnGame() {
        this.setFocusToCanvas(this.canvasStack.game);
    }

    private getNewCanvasStack(): ICanvasStack {
        const game = document.createElement("canvas");
        const miniMap = document.createElement("canvas");
        const miniPlayer = document.createElement("canvas");

        if (this.isCanvas(game) && this.isCanvas(miniMap) && this.isCanvas(miniPlayer)) {
            game.id = "game";
            miniMap.id = "miniMap";
            miniPlayer.id = "miniPlayer";

            return {
                game,
                miniMap,
                miniPlayer,
            };
        }

        throw new Error("Couldn't create canvas elements.");
    }

    private setCanvasStackProperties() {
        for (const key in this.canvasStack) {
            if (this.canvasStack.hasOwnProperty(key)) {
                const canvas = this.canvasStack[key];
                this.setCanvasProperties(canvas);
            }
        }
        this.setCanvasStackZIndex();
    }

    private setCanvasProperties(canvas: HTMLCanvasElement) {
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.backgroundColor = "transparent";

        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
    }

    private setCanvasStackZIndex() {
        this.canvasStack.game.style.zIndex = "100";
        this.canvasStack.miniMap.style.zIndex = "110";
        this.canvasStack.miniPlayer.style.zIndex = "120";
    }

    private addCanvasElementsToDom(canvasContainer: HTMLElement) {
        canvasContainer.style.position = "relative"; // has to be relative to enable absolute positioning inside
        for (const key in this.canvasStack) {
            if (this.canvasStack.hasOwnProperty(key)) {
                const canvas = this.canvasStack[key];
                canvasContainer.appendChild(canvas);
            }
        }
    }

    private setFocusToCanvas(canvasElement: HTMLCanvasElement) {
        canvasElement.focus();
    }

    // type guard
    private isCanvas(el: HTMLElement): el is HTMLCanvasElement {
        return (el as HTMLCanvasElement).getContext !== undefined;
    }

}