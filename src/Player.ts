export default class Player {

    private x: number;
    private y: number;
    private direction: number;
    private rotationAngle: number;
    private rotationSpeedInRadians = 6 * Math.PI / 180;
    private movementDir: number; // forward: 1, backward: -1
    private movementSpeed: number;

    constructor() {
        // do something
    }

    private move() {
        return true;
    }
}
