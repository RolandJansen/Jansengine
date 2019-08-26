export type MapData = number[][];
export type FlaggedMap = boolean[][];
export type FloorTileEdges = ICoords[];

export interface IEngineOptions {
    pov: number;
    fov: number;
    canvasSize: ICanvasSize;
    map?: MapData;
}

export interface ICoords {
    x: number;
    y: number;
}

export interface ITile {
    coords: ICoords;          // base coord (vector) of a tile
    tileType: number;       // type of tile (wall, floor, etc)
}

export interface ITileProjection {
    edgeCoords: ICoords[];  // 4 pixel-coords representing each corner
    tileType: number;
}

export interface ICollision {
    collision: ICoords;     // vector of the collision point
    collisionType: string;  // "v" for vertical-, "h" for horizontal-collision
    wallTile: ITile;        // the wall that was hit
}

export interface IRayData extends ICollision {
    rayLength: number;      // scalar distance between player and wall
    rayDirection: number;   // ray facing left/right or up/down (depending on col. type)
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement;
}

export interface ICanvasSize {
    width: number;
    height: number;
}

export interface IProjectionPlane {
    width: number;
    height: number;
    verticalCenter: number;
    horizontalCenter: number;
    distanceToPlayer: number;
}

export interface ILookupTables {
    [tableName: string]: number[];
}

export interface IRadiants {
    [radian: string]: number;
}

// export interface IPixel {
//     r: number;
//     g: number;
//     b: number;
//     a: number;
// }

export interface IWallSliceData {
    start: number;
    end: number;
    height: number;
}
