import { ICoords, ILookupTables, IRayData } from "./interfaces";
import { getLookupTables } from "./lookupTables";
import ProjectionScreen from "./ProjectionScreen";

export default class MiniMap {

    public miniMapBlockWidth = 8;

    private mapCtx: CanvasRenderingContext2D;
    private playerCtx: CanvasRenderingContext2D;
    private playerEdgeLength = this.miniMapBlockWidth / 2;
    private widthInBlocks: number;
    private heightInBlocks: number;
    private mapWidth: number;
    private mapHeight: number;
    private tables: ILookupTables;

    constructor(private mapData: number[][], screen: ProjectionScreen) {
        this.tables = getLookupTables();
        this.mapCtx = screen.getMiniMapContext();
        this.playerCtx = screen.getMiniPlayerContext();

        this.widthInBlocks = mapData[0].length;
        this.heightInBlocks = mapData.length;
        this.mapWidth = this.widthInBlocks * this.miniMapBlockWidth;
        this.mapHeight = this.heightInBlocks * this.miniMapBlockWidth;

        this.setCanvasResolution();
        // this.resizeCanvas();
        // this.drawMap();
    }

    public updateMiniPlayer(playerPosition: ICoords, playerDirection: number) {
        this.clearPlayerCanvas();
        this.drawPlayer(playerPosition);
    }

    public updatePlayerDirection(playerPosition: ICoords, playerDirection: number) {
        this.drawPlayerDirection(playerPosition, playerDirection);
    }

    public updateRays(playerPosition: ICoords, rays: IRayData[]) {
        this.playerCtx.strokeStyle = "#090779";
        for (const ray of rays) {
            this.playerCtx.beginPath();
            this.playerCtx.moveTo(
                playerPosition.x * this.miniMapBlockWidth,
                playerPosition.y * this.miniMapBlockWidth,
            );
            this.playerCtx.lineTo(
                ray.collision.x * this.miniMapBlockWidth,
                ray.collision.y * this.miniMapBlockWidth,
            );
            this.playerCtx.closePath();
            this.playerCtx.stroke();
        }
    }

    private clearPlayerCanvas() {
        this.playerCtx.clearRect(0, 0, this.mapWidth, this.mapHeight);
    }

    /**
     * Draw a dot at the current player position
     * @param playerPosition Coordinates
     */
    private drawPlayer(playerPosition: ICoords) {
        this.playerCtx.fillRect(
            playerPosition.x * this.miniMapBlockWidth - 2,
            playerPosition.y * this.miniMapBlockWidth - 2,
            this.playerEdgeLength,
            this.playerEdgeLength,
        );
    }

    /**
     * Draws a line on the minimap in the direction where the player is looking at
     * @param playerPosition position of the player on the map
     * @param playerDirection angle where the player is looking at
     */
    private drawPlayerDirection(playerPosition: ICoords, playerDirection: number) {
        this.playerCtx.strokeStyle = "#ad0000";
        this.playerCtx.beginPath();
        this.playerCtx.moveTo(
            playerPosition.x * this.miniMapBlockWidth,
            playerPosition.y * this.miniMapBlockWidth,
        );
        this.playerCtx.lineTo(
            (playerPosition.x + this.tables.cos[playerDirection] * this.playerEdgeLength) * this.miniMapBlockWidth,
            (playerPosition.y - this.tables.sin[playerDirection] * this.playerEdgeLength) * this.miniMapBlockWidth,
        )
        this.playerCtx.closePath();
        this.playerCtx.stroke();
    }

    /**
     * Set the internal canvas dimensions
     */
    private setCanvasResolution() {
        this.mapCtx.canvas.width = this.playerCtx.canvas.width = this.mapWidth;
        this.mapCtx.canvas.height = this.playerCtx.canvas.height = this.mapHeight;
    }

    /**
     * Set canvas dimensions via css
     */
    // private resizeCanvas() {
    //     this.canvas.style.width = (this.widthInBlocks * this.miniMapBlockWidth) + "px";
    //     this.canvas.style.height = (this.heightInBlocks * this.miniMapBlockWidth) + "px";
    // }

    private drawMap() {
        this.mapCtx.fillStyle = "rgb(200,200,200)";
        for (let y = 0; y < this.heightInBlocks; y++) {
            for (let x = 0; x < this.widthInBlocks; x++) {
                const block = this.mapData[y][x];
                if (block > 0) {
                    this.mapCtx.fillRect(
                        x * this.miniMapBlockWidth,
                        y * this.miniMapBlockWidth,
                        this.miniMapBlockWidth, this.miniMapBlockWidth);
                }
            }
        }
    }

}
