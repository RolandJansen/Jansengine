export interface ICoords {
    x: number,
    y: number,
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement
}

export interface ILookupTables {
    readonly [tableName: string]: number[]
}

export interface IEngineOptions {
    canvasSize?: ICanvasSize,
    map?: number[][],
}

export interface ICanvasSize {
    width: number,
    height: number,
}

export interface IRayData {
    rayLengths: number[],
    collisions: ICoords[],
}
