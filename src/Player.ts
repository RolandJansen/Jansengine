import { ICoords } from "./interfaces"

export default class Player {

    public coords: ICoords = {
        x: 16,
        y: 10,
    };
    public directionAngle = 0;  // north = 0, south = 180 etc
    public movementSpeed = 0.18;
    public rotate = 0;  // left = -1, right = 1
    public walk = 0; // backward = -1, forward = 1
    public rotationSpeedInRadians = 6 * Math.PI / 180;

    private mapWidth: number;
    private mapHeight: number;

    constructor(private mapData: number[][], coords?: ICoords) {
        if (coords) {
            this.coords = coords;
        }

        this.mapWidth = mapData[0].length;
        this.mapHeight = mapData.length;
    }

    public move() {
        const stepDistance = this.walk * this.movementSpeed;
        this.directionAngle += this.rotate * this.rotationSpeedInRadians;

        const x = this.coords.x + Math.cos(this.directionAngle) * stepDistance;
        const y = this.coords.y + Math.sin(this.directionAngle) * stepDistance;

        if (!this.isBlocking(x, y)) {
            this.coords.x = x;
            this.coords.y = y;
        }

        // console.log(this.coords.x + " : " + this.coords.y);
        // console.log(this.directionAngle);
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

        if (mapField !== 0) {
            return true;
        }
        return false;
    }

    private castRays() {
        const colums = 320;
        const columAngleDelta = 60 / 320;
        const rayLengths: number[] = [];
        let rayDirection = this.directionAngle - 30;

        for (let i = 0; i < colums; i++) {
            this.castRayAt(rayDirection);
            const rayLength = this.getRayLength();
            rayLengths.push(rayLength);
            rayDirection += columAngleDelta;
        }
    }

    private castRayAt(direction: number) {

    }

    private getRayLength(): number {

        return 1;
    }
}
