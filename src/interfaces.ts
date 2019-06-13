export interface ICoords {
    x: number;
    y: number;
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement;
}

export interface ISettings {
    [settingName: string]: any;
}

export interface ILookupTables {
    [tableName: string]: number[];
}

export interface IEngineOptions {
    canvasSize?: ICanvasSize,
    map?: number[][];
}

export interface ICanvasSize {
    width: number;
    height: number;
}

export interface IRayData {
    rayLength: number;
    collision: ICoords;
    type: string;        // "v" for vertical, "h" for horizontal
    tile: number;
    tileOffset: number;
}

export interface ICollision {
    intersection: ICoords;
    tileType: number;
}
