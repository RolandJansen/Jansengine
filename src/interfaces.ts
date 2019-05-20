export interface ICoords {
    x: number,
    y: number,
}

export interface ICanvasStack {
    [canvasName: string]: HTMLCanvasElement
}
