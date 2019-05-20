import { ICoords } from "./interfaces"

export default class Player {

    public coords: ICoords = {
        x: 16,
        y: 10,
    };
    public directionAngle = 0;  // north = 0, south = 180 etc
    public movementSpeed = 0.18;
    public directionLeftRight = 0;  // left = -1, right = 1
    public directionForBack = 0; // backward = -1, forward = 1
    public rotationSpeedInRadians = 6 * Math.PI / 180;

    constructor(coords?: ICoords) {
        if (coords) {
            this.coords = coords;
        }
    }

    public moveOneStep() {
        const stepDistance = this.directionForBack * this.movementSpeed;
        this.directionAngle = this.directionLeftRight * this.rotationSpeedInRadians;

        this.coords.x = this.coords.x + Math.cos(this.directionAngle) * stepDistance;
        this.coords.y = this.coords.y + Math.sin(this.directionAngle) * stepDistance;
    }
}
