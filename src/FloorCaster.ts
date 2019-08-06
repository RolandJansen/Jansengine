import {
    ICoords,
    ILookupTables,
    IMapData,
    IPixel,
    IProjectionPlane,
    IWallSlice,
} from "./interfaces";
import { getLookupTables } from "./lookupTables";
import Player from "./Player";
import Texture from "./Texture";

export default class FloorCaster {

    private readonly tables: ILookupTables;

    constructor(private readonly plane: IProjectionPlane,
                private readonly player: Player,
                private readonly mapData: IMapData,
                private readonly textures: Texture[]) {

        this.tables = getLookupTables();
    }

    public castFloorColumn(wallSlice: IWallSlice,
                           planeColumn: number,
                           columnAngle: number): IPixel[] {
        const pixels: IPixel[] = [];

        // cast one ray for every pixel in the column downwards
        for (let row = wallSlice.end + 1; row < this.plane.height; row++) {
            const pixel = this.castOneRow(row, planeColumn, columnAngle);
            pixels.push(pixel);
        }

        return pixels;
    }

    private castOneRow(row: number, planeColumn: number, columnAngle: number): IPixel {
        const collisionDistance = this.castRay(row, planeColumn);
        const collisionVector = this.getCollisionVector(collisionDistance, columnAngle);
        const tileVector = this.getTileVector(collisionVector);

        if (tileVector.y < this.mapData.length &&
            tileVector.x < this.mapData[tileVector.y].length &&
            tileVector.y > 0 &&
            tileVector.x > 0) {

                const tileOffsetVector = this.getTileOffsetVector(tileVector, collisionVector);
                const tileTexture = this.getTileTexture(tileVector);
                const pixel = this.getTexturedPixel(tileTexture, tileOffsetVector);
                return pixel;
        } else {
            return { r: 0, g: 0, b: 0, a: 0 };
        }
    }

    private castRay(planeRow: number, planeColumn: number): number {
        const ratio = this.player.playerHeight / (planeRow - this.plane.verticalCenter);
        const floorDistanceToPlayer = this.plane.distanceToPlayer * ratio;
        const normalizedDistance = floorDistanceToPlayer * this.tables.fishbowl[planeColumn];

        return normalizedDistance;
    }

    private getCollisionVector(collisionDistanceToPlayer: number, columnAngle: number): ICoords {
        return {
            x: (collisionDistanceToPlayer * this.tables.sin[columnAngle]) + this.player.playerPosition.x,
            y: (collisionDistanceToPlayer * this.tables.cos[columnAngle]) + this.player.playerPosition.y,
        };
    }

    private getTileVector(floorCollisionVector: ICoords): ICoords {
        return {
            x: Math.floor(floorCollisionVector.x),
            y: Math.floor(floorCollisionVector.y),
        };
    }

    private getTileOffsetVector(tile: ICoords, collision: ICoords): ICoords {
        return {
            x: collision.x - tile.x,
            y: collision.y - tile.y,
        };
    }

    private getTileTexture(tile: ICoords): Texture {
        const tileType = this.mapData[tile.y][tile.x];

        return this.textures[tileType - 1];
    }

    private getTexturedPixel(floorTexture: Texture, tileOffsetVector: ICoords): IPixel {
        const column = Math.floor(floorTexture.width * tileOffsetVector.x);
        const row = Math.floor(floorTexture.height * tileOffsetVector.y);
        const pixel: IPixel = floorTexture.getPixel(row, column);

        return pixel;
    }
}
