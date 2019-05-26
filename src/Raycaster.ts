import { ICoords, IRayData } from "./interfaces"

export default class Raycaster {
    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private rayData!: IRayData;

    constructor(
        private readonly mapData: number[][],
        private readonly tileSize: number,
        private playerPosition: ICoords) {
        this.mapWidth = this.mapData[0].length;
        this.mapHeight = this.mapData.length;
        // this.rayData = { rayLengths: [], collisions: [] };
    }

    public castRays(playerPosition: ICoords, directionAngle: number): IRayData {

        this.rayData = {
            rayLengths: [],
            collisions: [],
        };
        const colums = 320;
        const columAngleDelta = 60 / 320;
        let rayAngle = directionAngle - 30;
        if (rayAngle < 0) {
            rayAngle += 360;
        }
        this.playerPosition = playerPosition;

        for (let i = 0; i < colums; i++) {
        // for (let i = 0; i < 10; i++) {
            // we commit the rayData object to the castRayAt method
            // so the arrays can be populated. Normally this is not a
            // good approach but we do it here for the sake of performance.
            this.castRayAt(rayAngle);

            rayAngle += columAngleDelta;
        }

        return this.rayData;
    }

    private castRayAt(rayAngle: number) {
        let rayDirection = 1; // ray is facing up

        if (rayAngle === 0 || rayAngle === 90 || rayAngle === 180 || rayAngle === 270 || rayAngle === 360) {
            // trigonometry is useless if it's not a triangle
            return;
        }

        if (rayAngle > 360) {
            rayAngle -= 360;
        }
        if (rayAngle > 0 && rayAngle < 180) {  // ray is facing down
            rayDirection = -1;
        }

        ////////////////////////////
        // horizontal intersections
        ////////////////////////////
        let collision = this.getHorizontalCollision(rayAngle, rayDirection);
        if (collision.x !== -1) {
            console.log(collision.x);
            const rayLength = this.getRayLength(collision);
            this.rayData.rayLengths.push(rayLength);
            this.rayData.collisions.push(collision);
            return;
        }

        ////////////////////////////
        // vertical intersections
        ////////////////////////////
        collision = this.getVerticalCollision(rayAngle, rayDirection);
        if (collision.x !== -1) {
            console.log(1);
            const rayLength = this.getRayLength(collision);
            this.rayData.rayLengths.push(rayLength);
            this.rayData.collisions.push(collision);
            return;
        }

        // if no collision was found, ray length is infinite
        this.rayData.rayLengths.push(Number.MAX_VALUE);
        // rayData.collisions.push()
    }

    private getHorizontalCollision(rayAngle: number, rayYDirection: number): ICoords {

        // space between two intersections
        const yDelta = rayYDirection;  // should be tileSize*radDir but tsize is 1 so we can simplify here
        let xDelta: number;

        // check for quadrant
        if (rayAngle > 0 && rayAngle < 90) {
            // tan positive, yDelta negative: must be inverted (+ xDelta)
            const rad = this.degToRad(rayAngle);  // should be removed when lookup tables are ready
            xDelta = -(yDelta / Math.tan(rad));
        } else if (rayAngle > 90 && rayAngle < 180) {
            // tan positive, yDelta negative: must NOT be inverted (- xDelta)
            const rad = this.degToRad(rayAngle);  // should be removed when lookup tables are ready
            xDelta = yDelta / Math.tan(rad);
        } else if (rayAngle > 180 && rayAngle < 270) {
            // tan negative, yDelta positive: must NOT be inverted (- xDelta)
            const rad = this.degToRad(rayAngle);  // should be removed when lookup tables are ready
            xDelta = yDelta / Math.tan(rad);
        } else {
            // tan negative, yDelta positive: must be inverted (+ xDelta)
            const rad = this.degToRad(rayAngle);  // should be removed when lookup tables are ready
            xDelta = -(yDelta / Math.tan(rad));
        }
        // console.log(xDelta);
        // console.log(yDelta / Math.tan(this.degToRad(330)));

        // find the 1st horizontal intersection
        let xIntersection: number;
        let yIntersection: number;
        let yFirstDelta: number;

        if (rayYDirection === 1) {
            yIntersection = Math.floor(this.playerPosition.y) + this.tileSize;
            yFirstDelta = yIntersection - this.playerPosition.y;
        } else {
            yIntersection = Math.floor(this.playerPosition.y);
            yFirstDelta = this.playerPosition.y - yIntersection;
        }


        if (rayAngle > 0 && rayAngle < 90) {
            // tan positive, yDelta negative: must be inverted (+ xDelta)
            const xFirstDelta = -(yFirstDelta / Math.tan(this.degToRad(rayAngle)));
            xIntersection = xFirstDelta + this.playerPosition.x;
        } else if (rayAngle > 90 && rayAngle < 180) {
            // tan positive, yDelta negative: must NOT be inverted (- xDelta)
            const xFirstDelta = yFirstDelta / Math.tan(this.degToRad(rayAngle));
            xIntersection = xFirstDelta + this.playerPosition.x;
        } else if (rayAngle > 180 && rayAngle < 270) {
            // tan negative, yDelta positive: must NOT be inverted (- xDelta)
            const xFirstDelta = yFirstDelta / Math.tan(this.degToRad(rayAngle));
            xIntersection = xFirstDelta + this.playerPosition.x;
        } else {
            // tan negative, yDelta positive: must be inverted (+ xDelta)
            const xFirstDelta = -(yFirstDelta / Math.tan(this.degToRad(rayAngle)));
            xIntersection = xFirstDelta + this.playerPosition.x;
        }


        // console.log(xIntersection + "  angle: " + rayAngle);
        // console.log(Math.tan(this.degToRad(357)));

        let intersection: ICoords = {
            x: xIntersection,
            y: yIntersection,
        };

        // console.log(xIntersection + "  " + yIntersection);
        // check if we have a collision and eventually return ray length
        if (this.getHorizontalCollisionTileType(intersection, rayYDirection) !== 0) {
            // console.log("Hello");
            return intersection;
        }

        // find all other horizontal intersections
        while (intersection.y < this.mapHeight) {

            // next point can be found by simply adding deltaX and deltaY
            intersection = {
                x: intersection.x + xDelta,
                y: intersection.y + yDelta,
            }

            // check if we have a collision and eventually return ray length
            if (this.getHorizontalCollisionTileType(intersection, rayYDirection) !== 0) {
                return intersection;
            }
        }

        // if no horizontal collision was found, return -1/-1
        return { x: -1, y: -1 };
    }

    private getVerticalCollision(rayAngle: number, rayYDirection: number): ICoords {

        // space between two intersections
        let xDelta: number;
        let yDelta: number;

        if (rayAngle > 0 && rayAngle < 90) {
            // tan positive, xDelta positive: must be inverted (- yDelta)
            xDelta = this.tileSize;
            yDelta = -(Math.tan(this.degToRad(rayAngle)) * xDelta);
        } else if (rayAngle > 90 && rayAngle < 180) {
            // tan positive, xDelta negative: must NOT be inverted (- yDelta)
            xDelta = -this.tileSize;
            yDelta = Math.tan(this.degToRad(rayAngle)) * xDelta;
        } else if (rayAngle > 180 && rayAngle < 270) {
            // tan negative, xDelta negative: must NOT be inverted (+ yDelta)
            xDelta = -this.tileSize;
            yDelta = Math.tan(this.degToRad(rayAngle)) * xDelta;
        } else {
            // tan negative, xDelta positive: must be inverted (+ yDelta)
            xDelta = this.tileSize;
            yDelta = -(Math.tan(this.degToRad(rayAngle)) * xDelta);
        }

        let xIntersection: number;
        let yIntersection: number;

        // find the 1st vertical intersection
        if (rayAngle > 0 && rayAngle < 90) {
            // tan positive, xDelta positive, rayDir neg: must NOT be inverted (- yDelta)
            xIntersection = Math.floor(this.playerPosition.x) + this.tileSize;
            const xIntersecDelta = xIntersection - this.playerPosition.x;
            const yIntersecDelta = xIntersecDelta * Math.tan(this.degToRad(rayAngle)) * rayYDirection;
            yIntersection = yIntersecDelta + this.playerPosition.y;
        } else if (rayAngle > 90 && rayAngle < 180) {
            // tan positive, xDelta negative, rayDir neg: must be inverted (- yDelta)
            xIntersection = Math.floor(this.playerPosition.x);
            const xIntersecDelta = this.playerPosition.x - xIntersection;
            const yIntersecDelta = -(xIntersecDelta * Math.tan(this.degToRad(rayAngle)) * rayYDirection);
            yIntersection = yIntersecDelta + this.playerPosition.y;
        } else if (rayAngle > 180 && rayAngle < 270) {
            // tan negative, xDelta negative, rayDir pos: must NOT be inverted (+ yDelta)
            xIntersection = Math.floor(this.playerPosition.x);
            const xIntersecDelta = this.playerPosition.x - xIntersection;
            const yIntersecDelta = xIntersecDelta * Math.tan(this.degToRad(rayAngle)) * rayYDirection;
            yIntersection = yIntersecDelta + this.playerPosition.y;
        } else {
            // tan negative, xDelta positive, rayDir pos: must be inverted (+ yDelta)
            xIntersection = Math.floor(this.playerPosition.x) + this.tileSize;
            const xIntersecDelta = xIntersection - this.playerPosition.x;
            const yIntersecDelta = -(xIntersecDelta * Math.tan(this.degToRad(rayAngle)) * rayYDirection);
            yIntersection = yIntersecDelta + this.playerPosition.y;
        }

        const intersection: ICoords = {
            x: xIntersection,
            y: yIntersection,
        };

        // check if we have a collision and eventually return ray length
        if (this.getVerticalCollisionTileType(intersection, rayYDirection) !== 0) {
            return intersection;
        }

        // find all other horizontal intersections
        while (intersection.x < this.mapWidth) {
            // next point can be found by simply adding deltaX and deltaY
            intersection.x += xDelta;
            intersection.y += yDelta;

            // console.log(intersection.x);
            // check if we have a collision and eventually return ray length
            if (this.getVerticalCollisionTileType(intersection, rayYDirection) !== 0) {
                return intersection;
            }
        }

        // if no vertical collision was found, return -1/-1
        return { x: -1, y: -1 };
    }

    private degToRad(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * Check which tile on the map was hit
     * by a horizontal intersection and return
     * its type (floor, wall, obstacle, etc).
     * @param intersection Coords of the intersection point
     * @param rayDir +1 if ray going up, -1 if ray going down
     * @return Type of tile
     */
    private getHorizontalCollisionTileType(intersection: ICoords, rayDir: number): number {
        if (rayDir === 1) {
            return this.mapData[intersection.y][Math.floor(intersection.x)];
        } else {
            return this.mapData[intersection.y - 1][Math.floor(intersection.x)];
        }
    }

    private getVerticalCollisionTileType(intersection: ICoords, rayDir: number): number {
        if (rayDir === 1) {
            // console.log(intersection.y);
            return this.mapData[Math.floor(intersection.y)][intersection.x];
        } else {
            return this.mapData[Math.floor(intersection.y)][intersection.x];
        }
    }

    private getRayLength(collision: ICoords): number {
        const deltaX = this.playerPosition.x + collision.x

        return 0;
    }

}
