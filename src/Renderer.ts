import CanvasStack from "./CanvasStack";
import { IEngineOptions, IPixel, IProjectionPlane, IRayData, IWallSliceData } from "./interfaces";
import { getSettings } from "./settings";
import Texture from "./Texture";

export default class Renderer {

    private readonly settings: IEngineOptions;
    private readonly plane: IProjectionPlane;
    private bgCtx: CanvasRenderingContext2D;
    private gameCtx: CanvasRenderingContext2D;
    private bufferCtx: CanvasRenderingContext2D;
    private pixelBuffer: ImageData;

    constructor(private readonly textures: Texture[], canvases: CanvasStack) {
        this.settings = getSettings();
        this.plane = canvases.planePropertiesInPixels;
        this.bgCtx = canvases.getBackgroundContext();
        this.gameCtx = canvases.getGameContext();
        this.bufferCtx = canvases.getBufferContext();
        this.pixelBuffer = this.bufferCtx.getImageData(0, 0,
            this.plane.width, this.plane.height);
    }

    public clearBufferCanvas() {
        this.bufferCtx.clearRect(0, 0, this.plane.width, this.plane.height);
        this.pixelBuffer = this.bufferCtx.getImageData(0, 0,
            this.plane.width, this.plane.height);
    }

    public clearGameCanvas() {
        this.gameCtx.clearRect(0, 0, this.plane.width, this.plane.height);
    }

    public blitBufferCanvas() {
        this.gameCtx.putImageData(this.pixelBuffer, 0, 0);
    }

    public drawBackground() {
        let c = 255;
        let lineNum = 0;

        for (; lineNum < this.plane.height / 2; lineNum++) {
            const color = `rgb(120, 100, ${c})`;
            this.drawHorizontalLine(lineNum, color);
            c--;
        }

        let scanline = false;
        c = 0;
        for (; lineNum < this.plane.height; lineNum++) {
            const color = `rgb(${c}, ${c}, ${c})`;
            // const color = `rgb(${c}, 20, 20)`;
            this.drawHorizontalLine(lineNum, color);
            if (scanline) {
                c++;
                scanline = false;
            } else {
                scanline = true;
            }
        }
    }

    private drawHorizontalLine(height: number, color: string) {
        this.bgCtx.strokeStyle = color;
        this.bgCtx.beginPath();
        this.bgCtx.moveTo(0, height);
        this.bgCtx.lineTo(this.plane.width, height);
        this.bgCtx.closePath();
        this.bgCtx.stroke();
    }

    // private drawVerticalLines(rays: IRayData[]) {
    //     let nextRayAt = 1;
    //     let ray: IRayData;

    //     for (ray of rays) {
    //         // let green = this.addDistanceShadow(ray.rayLength);
    //         let green = 220;

    //         if (ray.collisionType === "h") {
    //             green -= 30;
    //         }
    //         this.ctx.strokeStyle = `rgb(0, ${green}, 0)`;

    //         this.drawVerticalLine(ray.rayLength, nextRayAt);
    //         // nextRayAt += this.rayHSpace;
    //         nextRayAt += 1;
    //     }
    // }

    public drawWallSlice(wallSlice: IWallSliceData, horizontalPosition: number, color: string) {

        this.gameCtx.strokeStyle = color;

        this.gameCtx.beginPath();
        this.gameCtx.moveTo(
            horizontalPosition,
            wallSlice.start,
        );
        this.gameCtx.lineTo(
            horizontalPosition,
            wallSlice.end,
        );
        this.gameCtx.closePath();
        this.gameCtx.stroke();
    }

    // private drawTexturedWalls(rays: IRayData[]) {
    //     let ray: IRayData;
    //     let screenColumn = 1;

    //     for (ray of rays) {
    //         this.drawTexturedVerticalLine(ray, screenColumn);
    //         screenColumn++;
    //     }
    // }

    /**
     * @param ray
     * @param column
     */
    public drawTexturedWallSlice(ray: IRayData, wall: IWallSliceData, column: number) {
        const texture = this.getTexture(ray.tileType);
        let image: HTMLImageElement;

        // this works but promises would be more elegant
        if (texture.width !== 0) {

            let tileOffset: number;

            if (ray.collisionType === "h") {
                tileOffset = ray.collision.x - ray.tile.x;
                // console.log("offset: " + tileOffset + " singleXOffset: " + texture.singleXOffset);
                image = texture.image;
            } else {
                tileOffset = ray.collision.y - ray.tile.y;
                image = texture.imageDark;
            }

            const srcColumn = Math.floor(tileOffset / texture.singleXOffset);

            this.gameCtx.drawImage(
                image,
                srcColumn, 0,
                1, texture.height,
                column, wall.start,
                1, wall.height,
            );
        }
    }

    private getTexture(tileType: number): Texture {
        return this.textures[tileType - 1];
    }

    private drawVerticalTexturedShadedLine(ray: IRayData, horizontalPosition: number) {
        const lineHeight = (this.plane.distanceToPlayer / ray.rayLength) * this.plane.height;
        const halfHeight = lineHeight * 0.5;
        const startingPoint = this.plane.verticalCenter - halfHeight;
        const endPoint = this.plane.verticalCenter + halfHeight;

        const texture = this.textures[ray.tileType];
        let tileOffset: number;

        if (ray.collisionType === "h") {
            tileOffset = ray.collision.x - ray.tile.x;
        } else {
            tileOffset = ray.collision.y - ray.tile.y;

        }
        const row = Math.floor(tileOffset / texture.singleXOffset);
        const line = 0;
        const pixel: IPixel = texture.getPixel(row, line);

    }

    // copied from F. Permadi tutorial
    private addDistanceShadow(distance: number): number {
        distance = Math.floor(distance);
        let color = 255 - (distance / 25) * 255.0;

        if (color < 20) {
            color = 20;
        }
        if (color > 255) {
            color = 255;
        }
        color = Math.floor(color);
        return color;
    }

}
