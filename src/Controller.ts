import CanvasStack from "./CanvasStack";
import FloorCaster from "./FloorCaster";
import { ICoords, IEngineOptions, ILookupTables, IMapData, IProjectionPlane, IRadiants, IRayData } from "./interfaces";
import { getLookupTables } from "./lookupTables";
import Raycaster from "./Raycaster";
import Renderer from "./Renderer";
import { getAngles, getSettings } from "./settings";
import Texture from "./Texture";

export default class Controller {
    private readonly settings: IEngineOptions;
    private readonly a: IRadiants;
    private readonly tables: ILookupTables;
    private readonly projectionPlane: IProjectionPlane;

    private rayCaster: Raycaster;
    // private floorCaster: FloorCaster;
    private renderer: Renderer;

    constructor(private screen: CanvasStack, private mapData: IMapData) {
        this.settings = getSettings();
        this.a = getAngles();
        this.tables = getLookupTables();
        this.projectionPlane = screen.getProjectionPlane();

        this.rayCaster = new Raycaster(this.mapData, this.projectionPlane);
        this.renderer = new Renderer(this.screen.getGameContext(), this.screen.getProjectionPlane());
    }

    public castAndRender(playerPosition: ICoords, direction: number) {
        let rayAngle = direction - this.a.angle30;

        this.renderer.buildFrame();

        for (let screenColumn = 0; screenColumn < this.settings.canvasSize.width; screenColumn++) {
            // find wall collision and get ray data
            const ray: IRayData = this.rayCaster.castRay(rayAngle, playerPosition);

            // normalize fishbowl effect
            ray.rayLength = this.tables.fishbowl[screenColumn] * ray.rayLength;

            // render the wall piece
            // this.renderer.drawVerticalLine(ray, screenColumn);
            this.renderer.drawTexturedVerticalLine(ray, screenColumn);

            rayAngle += 1;
        }

    }

    public addTexture(imageName: string, tileType?: number): this {
        const texture = new Texture(imageName);
        if (tileType) {
            this.renderer.addTexture(texture, tileType);
        } else {
            this.renderer.addTexture(texture);
        }
        return this;
    }

}
