import CanvasStack from "./CanvasStack";
import FloorCaster from "./FloorCaster";
import {
    ICoords,
    IEngineOptions,
    ILookupTables,
    IMapData,
    IProjectionPlane,
    IRadiants,
    IRayData,
    IWallSliceData } from "./interfaces";
import { getLookupTables } from "./lookupTables";
import Player from "./Player";
import Raycaster from "./Raycaster";
import Renderer from "./Renderer";
import { getAngles, getSettings } from "./settings";
import Texture from "./Texture";

export default class Controller {
    private readonly settings: IEngineOptions;
    private readonly a: IRadiants;
    private readonly tables: ILookupTables;
    private readonly plane: IProjectionPlane;

    private textures: Texture[];
    private rayCaster: Raycaster;
    private floorCaster: FloorCaster;
    private renderer: Renderer;

    constructor(private readonly screen: CanvasStack,
                private readonly mapData: IMapData,
                private readonly player: Player) {
        this.settings = getSettings();
        this.a = getAngles();
        this.tables = getLookupTables();
        this.plane = screen.getProjectionPlane();

        this.textures = [];
        this.rayCaster = new Raycaster(this.mapData, this.plane);
        this.floorCaster = new FloorCaster(this.plane, this.player, this.mapData, this.textures);
        this.renderer = new Renderer(this.textures, this.screen);
    }

    public castAndRender() {
        let columnAngle = this.player.direction - this.a.angle30;
        console.log(this.player.playerPosition);

        this.renderer.clearBufferCanvas();
        this.renderer.clearGameCanvas();

        this.renderer.drawBackground();

        for (let screenColumn = 0; screenColumn < this.settings.canvasSize.width; screenColumn++) {
            // find wall collision and get ray data
            const ray: IRayData = this.rayCaster.castRay(columnAngle, this.player.playerPosition);

            // normalize fishbowl effect
            ray.rayLength = this.tables.fishbowl[screenColumn] * ray.rayLength;

            const wallSlice = this.getWallSlice(ray);

            // const floorPixels = this.floorCaster.castFloorColumn(wallSlice, screenColumn, columnAngle);

            // render the wall slice
            // const color = this.getRGBColor(ray);
            // this.renderer.drawWallSlice(wallSlice, screenColumn, color);
            this.renderer.drawTexturedWallSlice(ray, wallSlice, screenColumn);
            // this.renderer.drawTexturedFloorSlice(floorPixels, wallSlice, screenColumn);

            columnAngle += 1;
        }

        // this.renderer.blitBufferCanvas();

    }

    public addTexture(imageName: string, tileType?: number): this {
        const texture = new Texture(imageName);
        if (tileType) {
            this.textures[tileType - 1] = texture;
        } else {
            this.textures.push(texture);
        }
        return this;
    }

    private getWallSlice(ray: IRayData): IWallSliceData {
        const lineHeight = (this.plane.distanceToPlayer / ray.rayLength) * this.plane.height;
        const halfHeight = lineHeight * 0.5;
        const startingPoint = this.plane.verticalCenter - halfHeight;
        const endPoint = this.plane.verticalCenter + halfHeight;

        // console.log()

        return {
            start: Math.floor(startingPoint),
            end: Math.floor(endPoint),
            height: Math.floor(lineHeight),
        };
    }

    private getRGBColor(ray: IRayData): string {
        let green = 220;
        if (ray.collisionType === "h") {
            green -= 30;
        }

        return `rgb(0, ${green}, 0)`;
    }

}
