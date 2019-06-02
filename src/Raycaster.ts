import { ICoords, ILookupTables, IRayData, IRayDataHVCombined } from "./interfaces";
import { getLookupTables } from "./lookupTables";

export default class Raycaster {
    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private tables: ILookupTables;

    constructor(
        private readonly mapData: number[][],
        private readonly tileSize: number,
        private playerPosition: ICoords) {

            this.tables = getLookupTables();
            this.mapWidth = this.mapData[0].length;
            this.mapHeight = this.mapData.length;
            // this.rayData = { rayLengths: [], collisions: [] };
    }

    public castRays(playerPosition: ICoords, direction: number): IRayData[] {

        // console.log(directionAngle);
        const rays: IRayData[] = [];
        const colums = 320;
        const columAngleDelta = 60 / 320;
        let rayAngleDeg = direction - 30;

        this.playerPosition = playerPosition;

        for (let i = 0; i < 60; i++) {
        // for (let i = 0; i < 10; i++) {
            // we commit the rayData object to the castRayAt method
            // so the arrays can be populated. Normally this is not a
            // good approach but we do it here for the sake of performance.
            rays[i] = this.castRayAt(rayAngleDeg);
            rayAngleDeg += 1;
        }

        return rays;
    }

    private castRayAt(rayAngle: number): IRayData {

        // make shure we're between 0° and 359°
        if (rayAngle < 0) {
            rayAngle += 360;
        }
        if (rayAngle >= 360) {
            rayAngle -= 360;
        }

        let rayYDirection = 1; // ray is facing up
        if (rayAngle >= 0 && rayAngle < 180) {  // ray is facing down
            rayYDirection = -1;
        }

        let rayXDirection = 1; // ray is facing left
        if (rayAngle >= 90 && rayAngle < 270) {  // ray is facing right
            rayXDirection = -1;
        }

        ////////////////////////////
        // horizontal intersections
        ////////////////////////////
        const hCollisionCoords = this.getHorizontalCollision(rayAngle, rayYDirection);
        const hRayLength = this.getRayLength(hCollisionCoords, rayAngle);
        const hCollision: IRayData = {
            rayLength: hRayLength,
            collision: hCollisionCoords,
        };

        ////////////////////////////
        // vertical intersections
        ////////////////////////////
        const vCollisionCoords = this.getVerticalCollision(rayAngle, rayXDirection);
        const vRayLength = this.getRayLength(vCollisionCoords, rayAngle);
        const vCollision: IRayData = {
            rayLength: vRayLength,
            collision: vCollisionCoords,
        };

        return this.getClosestCollision(hCollision, vCollision);
    }

    private getHorizontalCollision(rayAngle: number, rayYDirection: number): ICoords {

        // find the 1st horizontal intersection
        let yIntersection: number;
        if (rayYDirection === 1) {
            yIntersection = Math.floor(this.playerPosition.y) + rayYDirection;
        } else {
            yIntersection = Math.floor(this.playerPosition.y);
        }
        const yFirstDelta = yIntersection - this.playerPosition.y;
        const xFirstDelta = -(yFirstDelta * this.tables.itan[rayAngle]);
        const xIntersection = xFirstDelta + this.playerPosition.x;

        let intersection: ICoords = {
            x: xIntersection,
            y: yIntersection,
        };

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
                x: intersection.x + this.tables.xdelta[rayAngle],
                y: intersection.y + rayYDirection,
            };
        }

        // if no horizontal collision was found, ray travels forever (in y)
        return { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
    }

    private getVerticalCollision(rayAngle: number, rayXDirection: number): ICoords {

        // find the 1st vertical intersection
        let xIntersection: number;
        if (rayXDirection === 1) {
            xIntersection = Math.floor(this.playerPosition.x) + rayXDirection;
        } else {
            xIntersection = Math.floor(this.playerPosition.x);
        }
        const xFirstDelta = xIntersection - this.playerPosition.x;
        const yFirstDelta = -(xFirstDelta * this.tables.tan[rayAngle]);
        const yIntersection = yFirstDelta + this.playerPosition.y;
        const intersection: ICoords = {
            x: xIntersection,
            y: yIntersection,
        };


        // check for collision and do the same fora ll other horizontal intersections
        while (intersection.y > 0 &&
            intersection.y < this.mapHeight &&
            intersection.x > 0 &&
            intersection.x < this.mapWidth) {

            // check if we have a collision and eventually return ray length
            if (this.getVerticalCollisionTileType(intersection, rayXDirection) !== 0) {
                // console.log(intersection.x);
                return intersection;
            }

            // next point can be found by simply adding deltaX and deltaY
            intersection.x += rayXDirection;
            intersection.y += this.tables.ydelta[rayAngle];
        }

        // if no vertical collision was found, ray travels forever (in x)
        return { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
    }

    private getClosestCollision(collisionData1: IRayData, collisionData2: IRayData): IRayData {
        if (collisionData1.rayLength < collisionData2.rayLength) {
            return collisionData1;
        } else {
            return collisionData2;
        }
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

    private getVerticalCollisionTileType(intersection: ICoords, rayXDir: number): number {
        if (rayXDir === 1) {
            return this.mapData[Math.floor(intersection.y)][intersection.x];
        } else {
            return this.mapData[Math.floor(intersection.y)][intersection.x - 1];
        }
    }

    private getRayLength(collision: ICoords, rayAngle: number): number {
        let rayLength = 0;

        // infinity in, infinity out (trigonometry doesn't work with inf)
        if (collision.x === Number.MAX_VALUE) {
            return Number.MAX_VALUE;
        }

        if (rayAngle > 0 && rayAngle < 180) {
            rayLength = (this.playerPosition.y - collision.y) / this.tables.sin[rayAngle];
        } else {
            rayLength = -((collision.y - this.playerPosition.y) / this.tables.sin[rayAngle]);
        }

        return rayLength;
    }

    private compensateFishbowl(rayLength: number, degree: number) {
        return rayLength * this.tables.cos[degree];
    }

}
