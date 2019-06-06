import { IRayData, ISettings } from "./interfaces";
import ProjectionScreen from "./ProjectionScreen";
import { getSettings } from "./settings";

export default class Renderer {

    private ctx: CanvasRenderingContext2D;
    private screenWidth = 320;
    private screenHeight = 200;
    private rayHSpace: number;
    private readonly planeDistance = 4.328125;
    private readonly settings: ISettings;

    constructor(screen: ProjectionScreen) {
        this.ctx = screen.getGameContext();
        this.settings = getSettings();

        this.screenWidth = this.ctx.canvas.width;
        this.screenHeight = this.ctx.canvas.height;

        this.rayHSpace = Math.floor(this.screenWidth / this.settings.fov);
    }

    public render(rays: IRayData[]) {
        // this.ctx.lineWidth = 10;
        this.clearGameCanvas();
        this.drawBackground();
        this.drawLines(rays);
    }

    public drawBackground() {
        let c = 255;
        let lineNum = 0;

        for (; lineNum < this.screenHeight / 2; lineNum++) {
            const color = `rgb(140, 140, ${c})`;
            this.drawHorizontalLine(lineNum, color);
            c--;
        }

        let scanline = false;
        c = 0;
        for (; lineNum < this.screenHeight; lineNum++) {
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

    public drawLines(rays: IRayData[]) {
        let nextRayAt = 1;
        let ray: IRayData;

        for (ray of rays) {
            const green = this.addDistanceShadow(ray.rayLength);
            this.ctx.strokeStyle = `rgb(0, ${green}, 0)`;

            this.drawLine(ray.rayLength, nextRayAt);
            // nextRayAt += this.rayHSpace;
            nextRayAt += 1;
        }
    }

    private drawLine(rayLength: number, horizontalPosition: number) {
        const verticalCenter = this.screenHeight / 2;
        const lineHeight = (this.planeDistance / rayLength) * this.screenHeight;
        const startingPoint = verticalCenter - (lineHeight / 2);
        const endPoint = verticalCenter + (lineHeight / 2);

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

    private clearGameCanvas() {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
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
        this.ctx.lineTo(this.screenWidth, height);
        this.ctx.closePath();
        this.ctx.stroke();
    }

}
