import { ILookupTables } from "./interfaces";

// This is basically the same as in the tutorial by F. Permadi:
// https://github.com/permadi-com/ray-cast
// The idea is to pre-compute as much data as possible and
// lookup the values in the game loop.
//
// We could do this more efficiently in one loop
// but

// pre-computed values for every degree from 0 to 360
// i prefix means inverted which means 1/x. This is
// especially useful to prevent expensive division
// in trigonometric functions
const tables: ILookupTables = {
    sin: [],
    isin: [],
    cos: [],
    icos: [],
    tan: [],
    itan: [],
    xdelta: [],
    ydelta: [],
    fishbowl: [],
};

function initLookupTables() {

    // 361 records because: 360deg + 0deg
    for (let i = 0; i <= 360; i++) {

        // Populate tables with their radian values.
        // (The addition of 0.0001 is a kludge to avoid divisions by 0.
        // Removing it will produce unwanted holes in the wall when a
        // ray is at 0, 90, 180, or 270 degree angles). See:
        // https://github.com/permadi-com/ray-cast/blob/master/demo/1/sample1.js
        const radian = arcToRad(i) + (0.0001);

        tables.sin[i] = Math.sin(radian);
        tables.isin[i] = 1.0 / (tables.sin[i]);
        tables.cos[i] = Math.cos(radian);
        tables.icos[i] = (1.0 / (tables.cos[i]));
        tables.tan[i] = Math.tan(radian);
        tables.itan[i] = (1.0 / tables.tan[i]);

        tables.xdelta[i] = getXIntersectionDelta(i);
        tables.ydelta[i] = getYIntersectionDelta(i);

        tables.fishbowl[i] = getFishbowlCorrection(i);
    }
}

/**
 * delta = tileSize/tan(deg)
 * If tileSize=1: delta = 1/tan(deg)
 *             => delta = itan(deg)
 * 3rd and 4th quadrant have to be inverted:
 * 3rd quadrant (180°-270°): tan is (+) but dX should be (-)
 * 4th quadrant (270°-360°): tan is (-) but dX should be (+)
 * @param degree Angle between 0° and 360°
 */
function getXIntersectionDelta(degree: number): number {
    let delta = tables.itan[degree];

    if ((degree >= 180 && degree < 270) || degree > 270) {
        delta = -delta;
    }
    return delta;
}

/**
 * delta = tileSize*tan(deg)
 * If tileSize=1: delta = tan(deg)
 * 1st and 4th quadrant have to be inverted:
 * 1st quadrant (0°-90°)   : tan is (+) but dY should be (-)
 * 4th quadrant (270°-360°): tan is (-) but dY should be (+)
 * @param degree Angle between 0° and 360°
 */
function getYIntersectionDelta(degree: number): number {
    let delta = tables.tan[degree];

    if ((degree >= 0 && degree < 90) || degree >= 270) {
        delta = -delta;
    }
    return delta;
}

function getFishbowlCorrection(degree: number): number {
    const radian = arcToRad(degree);
    return 1 / Math.cos(radian);
}

function arcToRad(arcAngle: number) {
    return ((arcAngle * Math.PI) / 180);
}

export function getLookupTables(): ILookupTables {
    if (tables.sin.length === 0) {
        initLookupTables();
    }

    return tables;
}
