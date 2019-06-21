import { IEngineOptions } from "./interfaces";
import IProjectionPlane from "./IProjectionPlane";

export default function getProjectionPlaneInstance(settings: IEngineOptions) {
    return new ProjectionPlane(settings);
}

class ProjectionPlane implements IProjectionPlane {

    public readonly width: number;
    public readonly height: number;
    public readonly verticalCenter: number;
    public readonly horizontalCenter: number;
    public readonly distanceToPlayer: number;

    constructor(settings: IEngineOptions) {
        this.width = settings.canvasSize.width;
        this.height = settings.canvasSize.height;

        this.verticalCenter = Math.floor(this.height * 0.5);
        this.horizontalCenter = Math.floor(this.width * 0.5);
        this.distanceToPlayer = 1.5; // why 1.5? (found this by surprise)
    }

}
