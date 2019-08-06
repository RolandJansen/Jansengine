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
    IWallSlice } from "./interfaces";
import { getLookupTables } from "./lookupTables";
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
    // private floorCaster: FloorCaster;
    private renderer: Renderer;

    constructor(private screen: CanvasStack, private mapData: IMapData) {
        this.settings = getSettings();
        this.a = getAngles();
        this.tables = getLookupTables();
        this.plane = screen.getProjectionPlane();

        this.textures = [];
        this.rayCaster = new Raycaster(this.mapData, this.plane);
        this.renderer = new Renderer(this.screen.getGameContext(),
                                     this.screen.getProjectionPlane(),
                                     this.textures);
    }

    public castAndRender(playerPosition: ICoords, direction: number) {
        let columnAngle = direction - this.a.angle30;

        this.renderer.buildFrame();

        for (let screenColumn = 0; screenColumn < this.settings.canvasSize.width; screenColumn++) {
            // find wall collision and get ray data
            const ray: IRayData = this.rayCaster.castRay(columnAngle, playerPosition);

            // normalize fishbowl effect
            ray.rayLength = this.tables.fishbowl[screenColumn] * ray.rayLength;

            const wallSlice = this.getWallSlice(ray);

            // render the wall slice
            // const color = this.getRGBColor(ray);
            // this.renderer.drawWallSlice(wallSlice, screenColumn, color);
            this.renderer.drawTexturedWallSlice(ray, screenColumn);

            columnAngle += 1;
        }

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

    private getWallSlice(ray: IRayData): IWallSlice {
        const lineHeight = (this.plane.distanceToPlayer / ray.rayLength) * this.plane.height;
        const halfHeight = lineHeight * 0.5;
        const startingPoint = this.plane.verticalCenter - halfHeight;
        const endPoint = this.plane.verticalCenter + halfHeight;

        return {
            start: startingPoint,
            end: endPoint,
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
