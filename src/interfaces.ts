export interface ICoords {
    x: number;
    y: number;
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement;
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
}

export interface IRayDataHVCombined {
    hRayLength: number;
    vRayLength: number;
    hCollision: ICoords;
    vCollision: ICoords;
}
