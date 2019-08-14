import {
    ICoords,
    ILookupTables,
    IMapData,
    IPixel,
    IProjectionPlane,
    IWallSliceData,
} from "./interfaces";
import { getLookupTables } from "./lookupTables";
import Player from "./Player";
import Texture from "./Texture";

export default class FloorCaster {

    private readonly tables: ILookupTables;
    private readonly playerPixelHeight: number;

    constructor(private readonly plane: IProjectionPlane,
                private readonly player: Player,
                private readonly mapData: IMapData,
                private readonly textures: Texture[]) {

        this.tables = getLookupTables();
        this.playerPixelHeight = Math.floor(player.playerHeight * plane.height);
    }

    public castFloorColumn(wallSlice: IWallSliceData,
                           planeColumn: number,
                           columnAngle: number): IPixel[] {
        const pixels: IPixel[] = [];

        // cast one ray for every pixel in the column downwards
        for (let row = wallSlice.end + 1; row < this.plane.height; row++) {
            const pixel = this.castOnePixel(row, planeColumn, columnAngle);
            pixels.push(pixel);
        }

        return pixels;
    }

    private castOnePixel(row: number, planeColumn: number, viewAngle: number): IPixel {
        const collisionDistance = this.castRay(row, planeColumn);
        const collision = this.getCollisionCoords(collisionDistance, viewAngle);
        const tile = this.getTileCoords(collision);
        let pixel: IPixel = { r: 0, g: 0, b: 0, a: 0 };

        if (tile.y < this.mapData.length &&
            tile.x < this.mapData[tile.y].length &&
            tile.y > 0 &&
            tile.x > 0) {

                const tileOffset = this.getTileOffset(tile, collision);
                // console.log("x: " + tileOffset.x + " y: " + tileOffset.y);
                const tileTexture = this.getTileTexture(tile);

                pixel = this.getTexturedPixel(tileTexture, tileOffset);
        }

        return pixel;
    }

    private castRay(planeRow: number, planeColumn: number): number {
        const ratio = this.playerPixelHeight / (planeRow - this.plane.verticalCenter);
        const floorDistanceToPlayer = this.plane.distanceToPlayer * ratio;
        const normalizedDistance = floorDistanceToPlayer * this.tables.fishbowl[planeColumn];

        return normalizedDistance;
    }

    private getCollisionCoords(collisionDistanceToPlayer: number, columnAngle: number): ICoords {
        return {
            x: (collisionDistanceToPlayer * this.tables.sin[columnAngle]) + this.player.playerPosition.x,
            y: (collisionDistanceToPlayer * this.tables.cos[columnAngle]) + this.player.playerPosition.y,
        };
    }

    private getTileCoords(floorCollision: ICoords): ICoords {
        return {
            x: Math.floor(floorCollision.x),
            y: Math.floor(floorCollision.y),
        };
    }

    private getTileOffset(tile: ICoords, collision: ICoords): ICoords {
        return {
            x: collision.x - tile.x,
            y: collision.y - tile.y,
        };
    }

    private getTileTexture(tile: ICoords): Texture {
        const tileType = this.mapData[tile.y][tile.x];

        return this.textures[tileType - 1];
    }

    private getTexturedPixel(floorTexture: Texture, tileOffset: ICoords): IPixel {
        // this works but promises would be more elegant (see renderer.drawTexturedWallSlice)
        if (floorTexture.width !== 0) {
            const column = Math.floor(floorTexture.width * tileOffset.x);
            const row = Math.floor(floorTexture.height * tileOffset.y);
            const pixel: IPixel = floorTexture.getPixel(row, column);

            return pixel;
        } else {
            return { r: 0, g: 0, b: 0, a: 0 };
        }
    }
}
