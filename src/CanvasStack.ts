import { ICanvasSize, ICanvasStack, IEngineOptions, IProjectionPlane } from "./interfaces";
import { getSettings } from "./settings";

export default class CanvasStack {

    public readonly planePropertiesInPixels: IProjectionPlane;
    public readonly planePropiertiesAbstract: IProjectionPlane;
    private container: HTMLElement;
    private canvasStack: ICanvasStack;
    private settings: IEngineOptions;

    constructor(containerName: string, canvasSize?: ICanvasSize) {

        const container = document.getElementById(containerName);
        this.settings = getSettings();

        if (canvasSize) {
            this.settings.canvasSize.width = canvasSize.width;
            this.settings.canvasSize.height = canvasSize.height;
        }

        if (container !== null && container.tagName === "DIV") {
            this.container = container;
            this.canvasStack = this.getNewCanvasStack();

            if (this.isCanvas(this.canvasStack.game)) {
                this.setContainerProperties();
                this.setCanvasStackProperties();
                this.addCanvasElementsToDom(this.container);
            } else {
                throw new Error("Your browser doesn\'t support the <canvas> element.");
            }

        } else {
            throw new Error(`${containerName} is not a <div> element.`);
        }

        this.planePropertiesInPixels = this.getProjectionPlaneInPixels();
        this.planePropiertiesAbstract = this.getProjectionPlaneAbstract();
    }

    public setBackgroundColor(color: string) {
        // there should be a check if color is syntactically a color
        this.container.style.backgroundColor = color;
    }

    public getBufferContext(): CanvasRenderingContext2D {
        return this.canvasStack.buffer.getContext("2d")!;
    }

    public getBackgroundContext(): CanvasRenderingContext2D {
        return this.canvasStack.background.getContext("2d")!;
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

    private getProjectionPlaneInPixels(): IProjectionPlane {
        const halfFoV = this.settings.fov / 2;

        return {
            width: this.settings.canvasSize.width,
            height: this.settings.canvasSize.height,
            horizontalCenter: Math.floor(this.settings.canvasSize.width * 0.5),
            verticalCenter: Math.floor(this.settings.canvasSize.height * 0.5),
            distanceToPlayer: (this.settings.canvasSize.width / 2) / Math.tan(halfFoV),
        };
    }

    private getProjectionPlaneAbstract(): IProjectionPlane {
        const distanceToPlayer = 1.5;
        const halfFoV = this.settings.fov / 2;
        const width = distanceToPlayer * Math.tan(halfFoV * Math.PI / 180) * 2;
        const height = (width * this.settings.canvasSize.height) / this.settings.canvasSize.width;
        const horizontalCenter = width / 2;
        const verticalCenter = height / 2;

        return {
            width,
            height,
            horizontalCenter,
            verticalCenter,
            distanceToPlayer,
        };
    }

    private setContainerProperties() {
        this.container.style.width = this.settings.canvasSize.width + "px";
        this.container.style.height = this.settings.canvasSize.height + "px";
        this.container.style.border = "2px solid black";
        this.setBackgroundColor("lightgray");
    }

    private getNewCanvasStack(): ICanvasStack {
        const buffer = document.createElement("canvas");
        const background = document.createElement("canvas");
        const game = document.createElement("canvas");
        const miniMap = document.createElement("canvas");
        const miniPlayer = document.createElement("canvas");

        if (this.isCanvas(buffer) &&
            this.isCanvas(background) &&
            this.isCanvas(game) &&
            this.isCanvas(miniMap) &&
            this.isCanvas(miniPlayer)) {

            buffer.id = "offscreen";
            background.id = "background";
            game.id = "game";
            miniMap.id = "miniMap";
            miniPlayer.id = "miniPlayer";

            return {
                buffer,
                background,
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
        canvas.width = this.settings.canvasSize.width;
        canvas.height = this.settings.canvasSize.height;
        canvas.style.backgroundColor = "transparent";

        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
    }

    private setCanvasStackZIndex() {
        this.canvasStack.background.style.zIndex = "200";
        this.canvasStack.game.style.zIndex = "300";
        this.canvasStack.miniMap.style.zIndex = "400";
        this.canvasStack.miniPlayer.style.zIndex = "500";
    }

    private addCanvasElementsToDom(canvasContainer: HTMLElement) {
        canvasContainer.style.position = "relative"; // has to be relative to enable absolute positioning inside
        for (const key in this.canvasStack) {
            if (this.canvasStack.hasOwnProperty(key) &&
                key !== "buffer") {  // we don't want the buffer canvas in the dom
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
