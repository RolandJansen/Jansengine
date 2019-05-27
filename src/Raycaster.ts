import { ICoords, IRayData, IRayDataXYCombined } from "./interfaces"

export default class Raycaster {
    private readonly mapWidth: number;
    private readonly mapHeight: number;

    constructor(
        private readonly mapData: number[][],
        private readonly tileSize: number,
        private playerPosition: ICoords) {
        this.mapWidth = this.mapData[0].length;
        this.mapHeight = this.mapData.length;
        // this.rayData = { rayLengths: [], collisions: [] };
    }

    public castRays(playerPosition: ICoords, directionAngle: number): IRayData[] {

        const rays: IRayData[] = [];
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
            rays[i] = this.castRayAt(rayAngle);

            rayAngle += columAngleDelta;
        }

        return rays;
    }

    private castRayAt(rayAngle: number): IRayData {
        const rayDataCombined: IRayDataXYCombined = {
            hRayLength: 0,
            vRayLength: 0,
            hCollision: { x: 0, y: 0 },
            vCollision: { x: 0, y: 0 },
        };

        let rayDirection = 1; // ray is facing up

        if (rayAngle === 0 || rayAngle === 90 || rayAngle === 180 || rayAngle === 270 || rayAngle === 360) {
            // trigonometry is useless if it's not a triangle
            // TODO: What should we do here?
            // return ;
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
        const hCollision = this.getHorizontalCollision(rayAngle, rayDirection);
        rayDataCombined.hRayLength = this.getRayLength(hCollision, rayAngle);
        rayDataCombined.hCollision = hCollision;

        ////////////////////////////
        // vertical intersections
        ////////////////////////////
        const vCollision = this.getVerticalCollision(rayAngle, rayDirection);
        rayDataCombined.vRayLength = this.getRayLength(vCollision, rayAngle);
        rayDataCombined.vCollision = vCollision;

        const rayData = this.getClosestCollision(rayDataCombined);
        // if no collision was found, ray length is infinite
        // rayData.xRayLength = rayData.yRayLength = Number.MAX_VALUE;

        return rayData;
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
        // if (intersection.x > 0 &&
        //     intersection.y > 0 &&
        //     intersection.x < this.mapWidth &&
        //     intersection.y < this.mapHeight) {

        //         if (this.getHorizontalCollisionTileType(intersection, rayYDirection) !== 0) {
        //             // console.log("Hello");
        //             return intersection;
        //         }
        //     }

        // find all other horizontal intersections
        while (intersection.y > 0 &&
            intersection.y < this.mapHeight &&
            intersection.x > 0 &&
            intersection.x < this.mapWidth) {

            // check if we have a collision and eventually return ray length
            if (this.getHorizontalCollisionTileType(intersection, rayYDirection) !== 0) {
                return intersection;
            }

            // next point can be found by simply adding deltaX and deltaY
            intersection = {
                x: intersection.x + xDelta,
                y: intersection.y + yDelta,
            };

        }

        // if no horizontal collision was found, return inf/inf
        return { x: 0, y: 0 };
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
        // if (this.getVerticalCollisionTileType(intersection, rayYDirection) !== 0) {
        //     return intersection;
        // }

        // find all other horizontal intersections
        while (intersection.y > 0 &&
            intersection.y < this.mapHeight &&
            intersection.x > 0 &&
            intersection.x < this.mapWidth) {

            // check if we have a collision and eventually return ray length
            if (this.getVerticalCollisionTileType(intersection, rayYDirection) !== 0) {
                return intersection;
            }

            // next point can be found by simply adding deltaX and deltaY
            intersection.x += xDelta;
            intersection.y += yDelta;
        }

        // if no vertical collision was found, return ray travels forever
        return { x: 0, y: 0 };
    }

    private getClosestCollision(xyData: IRayDataXYCombined): IRayData {
        console.log("x-length: " + xyData.hRayLength);
        console.log("y-length: " + xyData.vRayLength);
        if (xyData.hRayLength > 0 && xyData.hRayLength < xyData.vRayLength) {
            return {
                rayLength: xyData.hRayLength,
                collision: xyData.hCollision,
            };
        } else {
            return {
                rayLength: xyData.vRayLength,
                collision: xyData.vCollision,
            };
        }
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

    private getRayLength(collision: ICoords, rayAngle: number): number {
        let rayLength = 0;

        if (rayAngle > 0 && rayAngle < 180) {
            rayLength = (this.playerPosition.y - collision.y) / Math.sin(this.degToRad(rayAngle));
        } else {
            rayLength = -((collision.y - this.playerPosition.y) / Math.sin(this.degToRad(rayAngle)));
        }

        return rayLength;
    }

}
