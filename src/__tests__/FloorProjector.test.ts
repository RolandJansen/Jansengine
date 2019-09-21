// tslint:disable: no-string-literal
// We use string-literals to test private functions like:
// objectName["privateMethod"](parameters)
// Normally this could be considered as bad style ("test API only")
// but here we want to test the single parts of the calculation
// without exposing them to the public.
import CanvasStack from "../CanvasStack";
import FloorProjector from "../FloorProjector";
import { ICanvasSize, ICoords, IProjectionPlane, MapData } from "../interfaces";
import Player from "../Player";
import { getAngles } from "../settings";

// constructor properties
const canvasSize: ICanvasSize = { width: 640, height: 400 };
const playerPosition: ICoords = { x: 5, y: 5 };
const map: MapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// replace classes with mocks
jest.mock("../Player");
jest.mock("../CanvasStack");

// some mock data
const halfFoV = deg2rad(30);
const planePropertiesInPixels: IProjectionPlane = {
    width: canvasSize.width,
    height: canvasSize.height,
    horizontalCenter: Math.floor(canvasSize.width / 2),
    verticalCenter: Math.floor(canvasSize.height / 2),
    distanceToPlayer: Math.floor((canvasSize.width / 2) / Math.tan(halfFoV)),
};

const distanceToPlayer = 1.5;
const width = distanceToPlayer * Math.tan(halfFoV) * 2;
const height = (width * canvasSize.height) / canvasSize.width;
const planePropertiesAbstract: IProjectionPlane = {
    distanceToPlayer,
    width,
    height,
    horizontalCenter: width / 2,
    verticalCenter: height / 2,
};

// handy stuff
const a = getAngles();
const radPerPixel = 2 * Math.PI / a.angle360;
function deg2rad(degree: number): number {
    return degree * Math.PI / 180;
}

// instance variables
let projector: FloorProjector;
let screen: CanvasStack;
let player: Player;

beforeEach(() => {
    screen = new CanvasStack("test", canvasSize);
    player = new Player(map, playerPosition);
    player.direction = 0;
    player.playerHeight = 0.5;

    projector = new FloorProjector(screen, player);
    projector["pixelPlane"] = planePropertiesInPixels;
    projector["abstractPlane"] = planePropertiesAbstract;
});

test("getMapTileCorners returns 4 corner coords", () => {
    const tileCoords: ICoords = { x: 3, y: 7 };
    const corners: ICoords[] = projector["getMapTileCorners"](tileCoords);

    expect(corners[0]).toEqual({ x: 3, y: 7 });
    expect(corners[1]).toEqual({ x: 3, y: 8 });
    expect(corners[2]).toEqual({ x: 4, y: 8 });
    expect(corners[3]).toEqual({ x: 4, y: 7 });
});

test("getNormalizedVector", () => {
    const quadrant0: ICoords = { x: 8, y: 2 };
    const quadrant90: ICoords = { x: 2, y: 2 };
    const quadrant180: ICoords = { x: 2, y: 8 };
    const quadrant270: ICoords = { x: 8, y: 8 };

    const normalized0: ICoords = projector["getNormalizedVector"](playerPosition, quadrant0);
    const normalized90: ICoords = projector["getNormalizedVector"](playerPosition, quadrant90);
    const normalized180: ICoords = projector["getNormalizedVector"](playerPosition, quadrant180);
    const normalized270: ICoords = projector["getNormalizedVector"](playerPosition, quadrant270);

    expect(normalized0).toEqual({ x: 3, y: -3 });
    expect(normalized90).toEqual({ x: -3, y: -3 });
    expect(normalized180).toEqual({ x: -3, y: 3 });
    expect(normalized270).toEqual({ x: 3, y: 3 });
});

// here we test pseudoAngles:
// one pseudoAngle represents the radian of one pixel (640px ~ 3840pA)
test("getAbsoluteAngle", () => {
    const vector45: ICoords = { x: 5, y: -5 };      // 1st quadrant
    const vector135: ICoords = { x: -5, y: -5 };    // 2nd quadrant
    const vector225: ICoords = { x: -5, y: 5 };     // 3rd quadrant
    const vector315: ICoords = { x: 5, y: 5 };      // 4th quadrant

    const arc45 = projector["getAbsoluteAngle"](vector45);
    const arc135 = projector["getAbsoluteAngle"](vector135);
    const arc225 = projector["getAbsoluteAngle"](vector225);
    const arc315 = projector["getAbsoluteAngle"](vector315);

    const expected45 = Math.floor(canvasSize.width * 3 / 4); // 3/4 of 60°
    const expected135 = expected45 * 3;
    const expected225 = expected45 * 5;
    const expected315 = expected45 * 7;

    expect(arc45).toBe(expected45);
    expect(arc135).toBe(expected135);
    expect(arc225).toBe(expected225);
    expect(arc315).toBe(expected315);
});

describe("getRelativeAngle", () => {
    const absolute15 = Math.floor(a.angle30 / 2);   // 15° pseudo-angle
    const absolute30 = a.angle30;                   // 30° pseudo-angle
    const absolute45 = a.angle30 + absolute15;      // 45° pseudo-angle
    const absolute60 = a.angle30 * 2;               // 60° pseudo-angle
    const absolute345 = a.angle360 - absolute15;    // 345°

    test("normal operation", () => {
        player.direction = absolute45;

        const relative30 = projector["getRelativeAngle"](absolute30);
        const realtive60 = projector["getRelativeAngle"](absolute60);

        const expected30 = absolute30 - player.direction;
        const expected60 = absolute60 - player.direction;

        expect(relative30).toBe(expected30);
        expect(realtive60).toBe(expected60);
    });

    test("direction slightly below 0°", () => {
        player.direction = a.angle360 - 5; // pseudo-angle below 360° (3840 - 5)

        const relative15 = projector["getRelativeAngle"](absolute15);
        const relative345 = projector["getRelativeAngle"](absolute345);

        const expected15 = absolute15 - player.direction + a.angle360;
        const expected345 = absolute345 - player.direction;

        expect(relative15).toBe(expected15);
        expect(relative345).toBe(expected345);
    });

    test("direction slightly above 0°", () => {
        player.direction = 5;   // pseudo-angle above 0° (0 + 5)

        const relative15 = projector["getRelativeAngle"](absolute15);
        const relative345 = projector["getRelativeAngle"](absolute345);

        const expected15 = absolute15 - player.direction;
        const expected345 = absolute345 - player.direction - a.angle360;

        expect(relative15).toBe(expected15);
        expect(relative345).toBe(expected345);
    });

    test("angle>180° should be mapped to -0°", () => {
        player.direction = a.angle90;

        const relative345 = projector["getRelativeAngle"](absolute345);
        const expected345 = absolute345 - player.direction - a.angle360;

        expect(relative345).toBe(expected345);
    });

    test("angle<180° should be mapped to +0°", () => {
        player.direction = a.angle270;

        const relative15 = projector["getRelativeAngle"](absolute15);
        const expected15 = absolute15 - player.direction + a.angle360;

        expect(relative15).toBe(expected15);
    });

});

describe("getDirectDistanceToCorner", () => {
    test("1st quadrant", () => {
        const nVector: ICoords = { x: 6, y: -3 };   // 30°
        const absoluteAngle = a.angle30;            // pseudo-angle
        const radian = deg2rad(30);                 // real radian

        const result = projector["getDirectDistanceToCorner"](nVector, absoluteAngle);
        const expected = nVector.x / Math.cos(radian);

        expect(result).toBeCloseTo(expected);
    });

    test("2nd quadrant", () => {
        const nVector: ICoords = { x: -6, y: -3 };      // 150°
        const absoluteAngle = a.angle180 - a.angle30;   // pseudo-angle
        const radian = deg2rad(30);                     // real radian

        const result = projector["getDirectDistanceToCorner"](nVector, absoluteAngle);
        const expected = -(nVector.x / Math.cos(radian));

        expect(result).toBeCloseTo(expected);
    });

    test("3rd quadrant", () => {
        const nVector: ICoords = { x: -6, y: 3 };           // 210°
        const absoluteAngle = a.angle270 - a.angle30 * 2;   // pseudo-angle
        const radian = deg2rad(30);                         // real radian

        const result = projector["getDirectDistanceToCorner"](nVector, absoluteAngle);
        const expected = -(nVector.x / Math.cos(radian));

        expect(result).toBeCloseTo(expected);
    });

    test("4th quadrant", () => {
        const nVector: ICoords = { x: 6, y: 3 };        // 330°
        const absoluteAngle = a.angle360 - a.angle30;   // pseudo-angle
        const radian = deg2rad(30);                     // real radian

        const result = projector["getDirectDistanceToCorner"](nVector, absoluteAngle);
        const expected = nVector.x / Math.cos(radian);

        expect(result).toBeCloseTo(expected);
    });
});

describe("getPixelColumn", () => {

    test("positive angles are displayed left", () => {
        const relativePositiveAngle = 30;
        const result = projector["getPixelColumn"](relativePositiveAngle);
        const expected = 290;  // positive angles should be subtacted
        expect(result).toBe(expected);
    });

    test("negative angles are displayed right", () => {
        const relativeNegativeAngle = -30;
        const result = projector["getPixelColumn"](relativeNegativeAngle);
        const expected = 350;  // negative angles should be added
        expect(result).toBe(expected);
    });
});

test("getPixelRow tested with different collisions", () => {
    const planeHeight = projector["abstractPlane"].height;
    const playerPlaneDist = projector["abstractPlane"].distanceToPlayer;
    const playerHeight = 1;

    let distanceToPoint = 2.34;
    let relativeAngle = 5 * Math.PI / 180;
    let relativePseudoAngle = Math.floor(a.angle30 / 6);

    for (let i = 0; i < 10; i++) {
        const rightAngleDist = distanceToPoint * Math.cos(relativeAngle);
        const planeHitPointDelta = playerHeight * playerPlaneDist / rightAngleDist;
        const abstractExpected = planeHeight - playerHeight + planeHitPointDelta;
        const expected = Math.floor(abstractExpected * projector["pixelPlane"].height);
        const result = projector["getPixelRow"](relativePseudoAngle, distanceToPoint);
        // console.log(rightAngleDist);

        expect(result).toBe(expected);

        distanceToPoint += distanceToPoint;
        relativeAngle += relativeAngle;
        relativePseudoAngle += relativePseudoAngle;
    }

});
