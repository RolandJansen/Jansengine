import { IEngineOptions, ILookupTables, IRadiants } from "./interfaces";

// All options that are used throughout the engine
const settings: IEngineOptions = {
    pov: 0,   // Angle the player is looking at when the rendering starts
    fov: 60,  // Field of View: 60° feels good for most players
    canvasSize: {           // this should be set to canvas dimensions
        width: 640,     // for best results (which will be done
        height: 400,    // automatically at startup).
    },                  // Use half the canvas size if performance counts.
};

const angles: IRadiants = {};
const numberOfAngles = getNumberOfAngles();

/**
 * We need to devide the circle in arcs, one for every
 * pixel for a 360° turn. Which is:
 *
 *               360 * canvas-width
 * arcs-total = --------------------
 *                 field-of-view
 *
 * With this number we can fill our lookup tables with
 * precise radians for the raycasting.
 */
function getNumberOfAngles(): number {
    return Math.floor(360 * settings.canvasSize.width / settings.fov);
}

function setAllAngles() {
    angles.angle360 = numberOfAngles;
    angles.angle30 = Math.floor(angles.angle360 / 12);
    angles.angle90 = Math.floor(angles.angle30 * 3);
    angles.angle180 = Math.floor(angles.angle30 * 6);
    angles.angle270 = Math.floor(angles.angle90 * 3);
}

function isEmpty(obj: object): boolean {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

export function getSettings(): IEngineOptions {
    return settings;
}

export function getAngles(): IRadiants {
    if (!angles.hasOwnProperty("numberOfAngles")) {
        setAllAngles();
    }
    return angles;
}
