import { IEngineOptions, IPixel, IRayData } from "./interfaces";
import IProjectionPlane from "./IProjectionPlane";
import { getSettings } from "./settings";
import Texture from "./Texture";

export default class Renderer {

    // private rayHSpace: number;
    // private readonly planeDistance = 4.328125;
    private readonly planeDistance = 1.5;  // why 1.5? (found this out by surprise)
    private readonly settings: IEngineOptions;
    private textures: Texture[] = [];

    constructor(private ctx: CanvasRenderingContext2D, private plane: IProjectionPlane) {
        this.settings = getSettings();

        // this.rayHSpace = Math.floor(this.screenWidth / this.settings.fov);
    }

    public render(rays: IRayData[]) {
        // this.ctx.lineWidth = 10;
        this.clearGameCanvas();
        this.drawBackground();
        // this.drawVerticalLines(rays);
        this.drawTexturedWalls(rays);
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

    public addTexture(texture: Texture, tileType?: number) {
        if (tileType) {
            this.textures[tileType - 1] = texture;
        } else {
            this.textures.push(texture);
        }
    }

    public getTexture(tileType: number): Texture {
        return this.textures[tileType - 1];
    }

    private drawVerticalLines(rays: IRayData[]) {
        let nextRayAt = 1;
        let ray: IRayData;

        for (ray of rays) {
            // let green = this.addDistanceShadow(ray.rayLength);
            let green = 220;

            if (ray.collisionType === "h") {
                green -= 30;
            }
            this.ctx.strokeStyle = `rgb(0, ${green}, 0)`;

            this.drawVerticalLine(ray.rayLength, nextRayAt);
            // nextRayAt += this.rayHSpace;
            nextRayAt += 1;
        }
    }

    private drawVerticalLine(rayLength: number, horizontalPosition: number) {
        const lineHeight = (this.planeDistance / rayLength) * this.plane.height;
        const halfHeight = lineHeight * 0.5;
        const startingPoint = this.plane.verticalCenter - halfHeight;
        const endPoint = this.plane.verticalCenter + halfHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(
            horizontalPosition,
            startingPoint,
        );
        this.ctx.lineTo(
            horizontalPosition,
            endPoint,
        );
        this.ctx.closePath();
        this.ctx.stroke();
    }

    private drawTexturedWalls(rays: IRayData[]) {
        let ray: IRayData;
        let screenColumn = 1;

        for (ray of rays) {
            this.drawTexturedVerticalLine(ray, screenColumn);
            screenColumn++;
        }
    }

    private drawTexturedVerticalLine(ray: IRayData, column: number) {
        const texture = this.textures[ray.tileType - 1];
        let image: HTMLImageElement;

        // this works but promises would be more elegant
        if (texture.width !== 0) {

            const lineHeight = (this.planeDistance / ray.rayLength) * this.plane.height;
            const halfHeight = lineHeight * 0.5;
            const startingPoint = this.plane.verticalCenter - halfHeight;
            // const endPoint = this.verticalCenter + halfHeight;

            let tileOffset: number;

            if (ray.collisionType === "h") {
                tileOffset = ray.collision.x - ray.tile.x;
                image = texture.image;
            } else {
                tileOffset = ray.collision.y - ray.tile.y;
                image = texture.imageDark;
            }

            const row = Math.floor(tileOffset / texture.singleXOffset);

            this.ctx.drawImage(
                image,
                row, 0,
                1, texture.height,
                column, startingPoint,
                1, lineHeight,
            );
        }
    }

    private drawVerticalTexturedShadedLine(ray: IRayData, horizontalPosition: number) {
        const lineHeight = (this.planeDistance / ray.rayLength) * this.plane.height;
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

    private clearGameCanvas() {
        this.ctx.clearRect(0, 0, this.plane.width, this.plane.height);
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

    private drawHorizontalLine(height: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height);
        this.ctx.lineTo(this.plane.width, height);
        this.ctx.closePath();
        this.ctx.stroke();
    }

}
