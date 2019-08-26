import CanvasStack from "./CanvasStack";
import {
    ICoords,
    ILookupTables,
    IProjectionPlane,
    IRadiants,
    ITile,
    ITileProjection,
    MapData,
} from "./interfaces";
import { getLookupTables } from "./lookupTables";
import Player from "./Player";
import { getAngles } from "./settings";

export default class FloorProjector {

    private readonly tables: ILookupTables;
    private readonly angles: IRadiants;
    // private readonly playerPixelHeight: number;
    private readonly pixelPlane: IProjectionPlane;
    private readonly abstractPlane: IProjectionPlane;

    constructor(private readonly screen: CanvasStack,
                private readonly player: Player) {

        this.tables = getLookupTables();
        this.angles = getAngles();
        this.pixelPlane = this.screen.planePropertiesInPixels;
        this.abstractPlane = this.screen.planePropiertiesAbstract;
    }

    public getTileProjection(tile: ITile): ITileProjection {
        const abstractCorners: ICoords[] = this.getMapTileEdges(tile.coords);
        const projectedCorners: ICoords[] = [];

        abstractCorners.forEach((corner: ICoords) => {
            const normalized = this.getNormalizedVector(this.player.playerPosition, corner);
            const absoluteAngle = this.getAbsoluteAngle(normalized);

            const relativeAngle = this.getRelativeAngle(absoluteAngle, normalized);
            const directDistance = this.getDirectDistanceToCorner(normalized, absoluteAngle);

            const pixelColumn = this.getPixelColumn(relativeAngle);
            const pixelRow = this.getPixelRow(relativeAngle, directDistance);

            projectedCorners.push({
                x: pixelColumn,
                y: pixelRow,
            });
        });

        return {
            edgeCoords: projectedCorners,
            tileType: tile.tileType,
        };
    }

    private getMapTileEdges(tile: ICoords): ICoords[] {
        return [
            tile,
            { x: tile.x,     y: tile.y + 1 },
            { x: tile.x + 1, y: tile.y + 1 },
            { x: tile.x + 1, y: tile.y },
        ];
    }

    private getNormalizedVector(playerPosition: ICoords, intersection: ICoords): ICoords {
        return {
            x: intersection.x - playerPosition.x,
            y: intersection.y - playerPosition.y,
        };
    }

    /**
     * This doesn't compute a value in degree or radian.
     * Instead it returns a pseudo value that meets
     * a range in radian that represents a specific pixel.
     * @param normalizedVector Vector with 0/0 start point
     */
    private getAbsoluteAngle(normalizedVector: ICoords): number {
        let tanValue: number;
        let arc = 0;

        // we can't divide by zero
        if (normalizedVector.x !== 0) {
            tanValue = -(normalizedVector.y) / normalizedVector.x;
        } else {
            return 0;
        }

        // console.log(tanValue);
        // check which quadrant in the unit circle we're in
        // to shorten the array walk
        if (normalizedVector.y <= 0) {
            if (tanValue < 0) {             // 2nd quadrant
                arc = this.angles.angle90;
            }
        } else {
            if (tanValue >= 0) {            // 3rd quadrant
                arc = this.angles.angle180;
            } else {                        // 4th quadrant
                arc = this.angles.angle270;
            }
        }

        // walk through pre-generated tangent values
        // and see if we have a match (cheaper than real cotangent)
        while (tanValue >= this.tables.tan[arc]) {
            arc++;
        }

        return arc;
    }

    private getRelativeAngle(absoluteAngle: number, normalizedVector: ICoords): number {
        // let arc = absoluteAngle - this.player.direction - this.angles.angle30;
        let arc = absoluteAngle - this.player.direction;

        // console.log("angle: " + arc + " dir: " + this.player.direction);
        // if (arc < -(this.angles.angle30)) {
        //     arc += this.angles.angle360;
        // }

        return arc;
    }

    /**
     * The direct abstract distance between player and a wall-tile edge.
     * @param normalizedVector Vector from player to edge
     * @param absoluteAngle Absolute pseudo-angle of the vector
     */
    private getDirectDistanceToCorner(normalizedVector: ICoords, absoluteAngle: number): number {
        const distance = normalizedVector.x * this.tables.icos[absoluteAngle];
        // console.log(distance);
        return distance;
    }

    private getPixelColumn(relativeAngle: number): number {
        const column = this.pixelPlane.horizontalCenter - relativeAngle;
        // console.log(column);
        return column;
    }

    private getPixelRow(relativeAngle: number, cornerDistance: number): number {
        const planePlayerDist = this.abstractPlane.distanceToPlayer;
        const verticalCenter = this.abstractPlane.verticalCenter;
        const planeHeightPx = this.pixelPlane.height;

        const straightDistance = cornerDistance * this.tables.cos[relativeAngle];
        const ratio = planePlayerDist / straightDistance;
        const abstractRow = (this.player.playerHeight * ratio) + verticalCenter;
        const pixelRow = Math.round(abstractRow * planeHeightPx);

        return pixelRow;
    }

}
