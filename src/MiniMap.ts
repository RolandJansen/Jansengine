export default class MiniMap {

    private ctx: CanvasRenderingContext2D;
    private widthInBlocks: number;
    private heightInBlocks: number;
    private miniMapBlockWidth = 8;

    constructor(private canvas: HTMLCanvasElement, private mapData: number[][]) {
        this.ctx = canvas.getContext("2d")!;

        this.widthInBlocks = mapData[0].length;
        this.heightInBlocks = mapData.length;

        this.setCanvasResolution();
        this.resizeCanvas();
        this.drawMap();
    }

    /**
     * Set the internal canvas dimensions
     */
    private setCanvasResolution() {
        this.canvas.width = this.widthInBlocks * this.miniMapBlockWidth;
        this.canvas.height = this.heightInBlocks * this.miniMapBlockWidth;
    }

    /**
     * Set canvas dimensions via css
     */
    private resizeCanvas() {
        this.canvas.style.width = (this.widthInBlocks * this.miniMapBlockWidth) + "px";
        this.canvas.style.height = (this.heightInBlocks * this.miniMapBlockWidth) + "px";
    }

    private drawMap() {
        this.ctx.fillStyle = "rgb(200,200,200)";
        for (let y = 0; y < this.heightInBlocks; y++) {
            for (let x = 0; x < this.widthInBlocks; x++) {
                const block = this.mapData[y][x];
                if (block > 0) {
                    this.ctx.fillRect(
                        x * this.miniMapBlockWidth,
                        y * this.miniMapBlockWidth,
                        this.miniMapBlockWidth, this.miniMapBlockWidth);
                }
            }
        }
    }

}
