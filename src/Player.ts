import { ICoords, ILookupTables, IRadiants } from "./interfaces";
import { getLookupTables } from "./lookupTables";
import { getAngles } from "./settings";

export default class Player {

    public playerPosition: ICoords = {
        x: 16,
        y: 10,
    };
    public playerHeight = 0.3;  // 1=screenheight (if 1~400px -> 0.2~120px)
    public direction = 0;  // north=90°, south=270°, etc
    public movementSpeed = 0.18;
    public rotateLeftRight = 0;  // left = 1, right = -1 (degree)
    public walkForBack = 0; // backward = -1, forward = 1
    public rotationSpeed = 34;  // degrees per game cycle

    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private readonly tables: ILookupTables;
    private readonly a: IRadiants;

    constructor(private mapData: number[][], initialPlayerPos?: ICoords) {
        if (initialPlayerPos) {
            this.playerPosition = initialPlayerPos;
        }

        this.mapWidth = mapData[0].length;
        this.mapHeight = mapData.length;
        this.tables = getLookupTables();
        this.a = getAngles();
    }

    public move() {
        const stepDistance = this.walkForBack * this.movementSpeed;
        this.direction += this.rotateLeftRight * this.rotationSpeed;

        if (this.direction < 0) {
            this.direction += this.a.angle360;
        }
        if (this.direction >= this.a.angle360) {
            // maybe modulo is cheaper (?)
            this.direction -= this.a.angle360;
        }

        const x = this.playerPosition.x + this.tables.cos[this.direction] * stepDistance;
        const y = this.playerPosition.y - this.tables.sin[this.direction] * stepDistance;

        if (!this.isBlocking(x, y)) {
            this.playerPosition.x = x;
            this.playerPosition.y = y;
        }

    }

    /**
     * Basic collision detection.
     * To optimize performance we first
     * check for any obstacles. If there is none
     * we additionally check for map borders.
     * @param x X-Coordinate of the players next step
     * @param y Y-Coordinate of the players next step
     */
    private isBlocking(x: number, y: number): boolean {
        if (this.isObstacle(x, y)) {
            return true;
        }
        if (this.isBorder(x, y)) {
            return true;
        }
        return false;
    }

    private isBorder(x: number, y: number): boolean {
        if (x < 0 ||
            x > this.mapWidth ||
            y < 0 ||
            y > this.mapHeight) {
                return true;
        }
        return false;
    }

    private isObstacle(x: number, y: number): boolean {
        const mapField = this.mapData[Math.trunc(y)][Math.trunc(x)];

        if (mapField > 0) {
            return true;
        }
        return false;
    }
}
