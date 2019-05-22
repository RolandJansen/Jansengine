export interface ICoords {
    x: number,
    y: number,
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement
}

export interface ILookupTables {
    [tableName: string]: number[]
}
