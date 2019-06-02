import { IRayData } from "./interfaces";
import ProjectionScreen from "./ProjectionScreen";

export default class Renderer {

    private ctx: CanvasRenderingContext2D;
    private screenWidth = 320;
    private screenHeight = 200;
    private rayHSpace: number;
    private readonly planeDistance = 4.328125;

    constructor(screen: ProjectionScreen, fieldOfView: number) {
        this.ctx = screen.getGameContext();

        this.screenWidth = this.ctx.canvas.width;
        this.screenHeight = this.ctx.canvas.height;

        this.rayHSpace = Math.floor(this.screenWidth / fieldOfView);
        // console.log(this.rayHSpace);
    }

    public render(rays: IRayData[]) {
        this.ctx.lineWidth = 10;
        this.clearGameCanvas();
        this.drawLines(rays);
    }

    public drawLines(rays: IRayData[]) {
        this.ctx.strokeStyle = "darkgreen";

        let nextRayAt = 0;
        let ray: IRayData;
        for (ray of rays) {
            this.drawLine(ray.rayLength, nextRayAt);
            nextRayAt += this.rayHSpace;
        }
    }

    private drawLine(rayLength: number, horizontalPosition: number) {
        const verticalCenter = this.screenHeight / 2;
        const lineHeight = (this.planeDistance / rayLength) * this.screenHeight;
        const startingPoint = verticalCenter - (lineHeight / 2);
        const endPoint = verticalCenter + (lineHeight / 2);

        // console.log(lineHeight);
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

}
