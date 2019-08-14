import {
    ICollision,
    ICoords,
    IEngineOptions,
    ILookupTables,
    IMapData,
    IProjectionPlane,
    IRadiants,
    IRayData,
    ITile} from "./interfaces";
import { getLookupTables } from "./lookupTables";
import { getAngles, getSettings } from "./settings";

export default class Raycaster {
    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private readonly settings: IEngineOptions;
    private readonly a: IRadiants;
    private readonly tables: ILookupTables;
    private playerPosition: ICoords = {
        x: 0,
        y: 0,
    } ;

    constructor(
        private readonly mapData: IMapData,
        private plane: IProjectionPlane) {

            this.settings = getSettings();
            this.a = getAngles();
            this.tables = getLookupTables();
            this.mapWidth = this.mapData[0].length;
            this.mapHeight = this.mapData.length;
            // this.rayData = { rayLengths: [], collisions: [] };
    }

    // public castRays(playerPosition: ICoords, direction: number): IRayData[] {

    //     const rays: IRayData[] = [];
    //     let rayAngle = direction - this.a.angle30;

    //     this.playerPosition = playerPosition;

    //     for (let i = 0; i < this.settings.canvasSize.width; i++) {
    //         const ray = this.castRayAt(rayAngle);

    //         ray.rayLength = this.tables.fishbowl[i] * ray.rayLength;

    //         rays[i] = ray;
    //         rayAngle += 1;
    //     }

    //     return rays;
    // }

    public castRay(rayAngle: number, playerPosition: ICoords): IRayData {
        this.playerPosition = playerPosition;

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
        const hRayLength = this.getRayLength(hCollision.collision, rayAngle);
        const hRayData: IRayData = Object.assign(hCollision, {
            rayLength: hRayLength,
            collisionType: "h",
        });

        ////////////////////////////
        // vertical intersections
        ////////////////////////////
        const vCollision = this.getVerticalCollision(rayAngle, rayXDirection);
        const vRayLength = this.getRayLength(vCollision.collision, rayAngle);
        const vRayData: IRayData = Object.assign(vCollision, {
            rayLength: vRayLength,
            collisionType: "v",
        });

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
            const tile = this.getHorizontalCollisionTile(intersection, rayYDirection);
            if (tile.tileType < 200) {
                return Object.assign(tile, { collision: intersection });
            }

            // next point can be found by simply adding delta
            intersection = {
                x: intersection.x + this.tables.xdelta[rayAngle],
                y: intersection.y + rayYDirection,
            };
        }

        // if no horizontal collision was found, ray travels forever (in y)
        return {
            tile: { x: -1, y: -1 },
            tileType: -1,
            collision: { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
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

        // check for collision and do the same for all other horizontal intersections
        while (intersection.y > 0 &&
            intersection.y < this.mapHeight &&
            intersection.x > 0 &&
            intersection.x < this.mapWidth) {

            // check if we have a collision and eventually return ray length
            const tile = this.getVerticalCollisionTile(intersection, rayXDirection);
            if ( tile.tileType < 200) {
                return Object.assign(tile, { collision: intersection });
            }

            // next point can be found by simply adding delta
            intersection.x += rayXDirection;
            intersection.y += this.tables.ydelta[rayAngle];
        }

        // if no vertical collision was found, ray travels forever (in x)
        return {
            tile: { x: -1, y: -1 },
            tileType: -1,
            collision: { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
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
    private getHorizontalCollisionTile(intersection: ICoords, rayDir: number): ITile {
        let tile: ICoords;

        if (rayDir === 1) {
            tile = {
                x: Math.floor(intersection.x),
                y: intersection.y,
            };
        } else {
            tile = {
                x: Math.floor(intersection.x),
                y: intersection.y - 1,
            };
        }

        const tileType = this.mapData[tile.y][tile.x];
        return { tile, tileType };
    }

    // private getHorizontalFloorTile(collisionTile: ICoords, rayYDir: number): ICoords {
    //     let tile: ICoords;

    //     if (rayYDir === 1) {
    //         tile = {
    //             x: collisionTile.x,
    //             y: collisionTile.y - 1,
    //         };
    //     } else {
    //         tile = {
    //             x: collisionTile.x,
    //             y: collisionTile.y + 1,
    //         };
    //     }
    //     return tile;
    // }

    private getVerticalCollisionTile(intersection: ICoords, rayXDir: number): ITile {
        let tile: ICoords;

        if (rayXDir === 1) {
            tile = {
                x: intersection.x,
                y: Math.floor(intersection.y),
            };
        } else {
            tile = {
                x: intersection.x - 1,
                y: Math.floor(intersection.y),
            };
        }

        const tileType = this.mapData[tile.y][tile.x];
        return { tile, tileType };
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

    // private getWallProjectionData(rayData: IRayData): IWallProjection {
    //     const height = (this.plane.distanceToPlayer / rayData.rayLength) * this.plane.height;
    //     const halfHeight = Math.floor(height * 0.5);
    //     const startPixel = this.plane.verticalCenter - halfHeight;
    //     const endPixel = this.plane.verticalCenter + halfHeight;

    //     return {
    //         height,
    //         halfHeight,
    //         startPixel,
    //         endPixel,
    //     };
    // }

}
