import { ICollision, ICoords, ILookupTables, IRayData, ISettings } from "./interfaces";
import { getLookupTables } from "./lookupTables";
import { getAngles, getSettings } from "./settings";

export default class Raycaster {
    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private readonly settings: ISettings;
    private readonly a: ISettings;
    private readonly tables: ILookupTables;

    constructor(
        private readonly mapData: number[][],
        private readonly tileSize: number,
        private playerPosition: ICoords) {

            this.settings = getSettings();
            this.a = getAngles();
            this.tables = getLookupTables();
            this.mapWidth = this.mapData[0].length;
            this.mapHeight = this.mapData.length;
            // this.rayData = { rayLengths: [], collisions: [] };
    }

    public castRays(playerPosition: ICoords, direction: number): IRayData[] {

        const rays: IRayData[] = [];
        let rayAngle = direction - this.a.angle30;

        this.playerPosition = playerPosition;

        for (let i = 0; i < this.settings.screen.width; i++) {
            // we commit the rayData object to the castRayAt method
            // so the arrays can be populated. Normally this is not a
            // good approach but we do it here for the sake of performance.
            const ray = this.castRayAt(rayAngle);

            ray.rayLength = this.tables.fishbowl[i] * ray.rayLength;

            rays[i] = ray;
            rayAngle += 1;
        }

        return rays;
    }

    private castRayAt(rayAngle: number): IRayData {

        // make shure we're between 0° and 359°
        if (rayAngle < 0) {
            rayAngle += this.a.angle360;
        }
        if (rayAngle >= this.a.angle360) {
            rayAngle -= this.a.angle360;
        }

        let rayYDirection = 1; // ray is facing up
        if (rayAngle >= 0 && rayAngle < this.a.angle180) {  // ray is facing down
            rayYDirection = -1;
        }

        let rayXDirection = 1; // ray is facing left
        if (rayAngle >= this.a.angle90 && rayAngle < this.a.angle270) {  // ray is facing right
            rayXDirection = -1;
        }

        ////////////////////////////
        // horizontal intersections
        ////////////////////////////
        const hCollision = this.getHorizontalCollision(rayAngle, rayYDirection);
        const hRayLength = this.getRayLength(hCollision.intersection, rayAngle);
        const hRayData: IRayData = {
            rayLength: hRayLength,
            collision: hCollision.intersection,
            type: "h",
            tile: hCollision.tileType,
            tileOffset: hCollision.intersection.x % 1,
        };

        ////////////////////////////
        // vertical intersections
        ////////////////////////////
        const vCollision = this.getVerticalCollision(rayAngle, rayXDirection);
        const vRayLength = this.getRayLength(vCollision.intersection, rayAngle);
        const vRayData: IRayData = {
            rayLength: vRayLength,
            collision: vCollision.intersection,
            type: "v",
            tile: vCollision.tileType,
            tileOffset: vCollision.intersection.y % 1,
        };

        return this.getClosestCollision(hRayData, vRayData);
    }

    private getHorizontalCollision(rayAngle: number, rayYDirection: number): ICollision {

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
            const tileType = this.getHorizontalCollisionTileType(intersection, rayYDirection);
            if (tileType !== 0) {
                return { intersection, tileType };
            }

            // next point can be found by simply adding delta
            intersection = {
                x: intersection.x + this.tables.xdelta[rayAngle],
                y: intersection.y + rayYDirection,
            };
        }

        // if no horizontal collision was found, ray travels forever (in y)
        return {
            intersection: { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
            tileType: 0,
        };
    }

    private getVerticalCollision(rayAngle: number, rayXDirection: number): ICollision {

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
            const tileType = this.getVerticalCollisionTileType(intersection, rayXDirection);
            if ( tileType !== 0) {
                return { intersection, tileType };
            }

            // next point can be found by simply adding delta
            intersection.x += rayXDirection;
            intersection.y += this.tables.ydelta[rayAngle];
        }

        // if no vertical collision was found, ray travels forever (in x)
        return {
            intersection: { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
            tileType: 0,
        };
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

        if (rayAngle > 0 && rayAngle < this.a.angle180) {
            rayLength = (this.playerPosition.y - collision.y) / this.tables.sin[rayAngle];
        } else {
            rayLength = -((collision.y - this.playerPosition.y) / this.tables.sin[rayAngle]);
        }

        return rayLength;
    }

}
