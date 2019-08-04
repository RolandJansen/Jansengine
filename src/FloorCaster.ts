import { ICoords, IMapData, IProjectionPlane, IRayData, IWallProjection } from "./interfaces";

export default class FloorCaster {

    // what we need here:
    // * the tile coords
    // * bottom of wall (on projection plane)
    // * projectionplanehight
    // * projectionplanecenterY
    // * player height
    // * player distance to projectionplane
    // * player real distance to wall (raylength)
    // * playerX, playerY (coords)
    // * fishbowl effect correction table


    // we cast from (bottom of wall + 1) to projectionplanehight
    //

    constructor(private plane: IProjectionPlane,
        private mapData: IMapData,
        private playerPosition: ICoords,
        private rayData: IRayData,
        private wallProjection: IWallProjection) {



    }



}
