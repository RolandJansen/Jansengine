export type IMapData = number[][];

export interface IEngineOptions {
    pov: number;
    fov: number;
    canvasSize: ICanvasSize;
    map?: IMapData;
}

export interface ICoords {
    x: number;
    y: number;
}

export interface ITile {
    tile: ICoords;          // base coord (vector) of a tile
    tileType: number;       // type of tile (wall, floor, etc)
}

export interface ICollision extends ITile {
    collision: ICoords;     // vector of the collision point
}

export interface IRayData extends ICollision {
    rayLength: number;      // scalar distance between player and wall
    collisionType: string;  // "v" for vertical-, "h" for horizontal-collision
}

export interface IWallProjection {
    height: number;
    halfHeight: number;
    startPixel: number;
    endPixel: number;
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

export interface IPixel {
    r: number;
    g: number;
    b: number;
    a: number;
}
