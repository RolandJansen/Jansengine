import CanvasStack from "./CanvasStack";
import FloorProjector from "./FloorProjector";
import {
    ICoords,
    IEngineOptions,
    ILookupTables,
    IProjectionPlane,
    IRadiants,
    IRayData,
    ITile,
    ITileProjection,
    IWallSliceData,
    MapData} from "./interfaces";
import { getLookupTables } from "./lookupTables";
import MiniMap from "./MiniMap";
import Player from "./Player";
import Raycaster from "./Raycaster";
import Renderer from "./Renderer";
import { getAngles, getSettings } from "./settings";
import Texture from "./Texture";

export default class Controller {
    private readonly settings: IEngineOptions;
    private readonly a: IRadiants;
    private readonly tables: ILookupTables;

    private textures: Texture[];
    private rayCaster: Raycaster;
    private floorProjector: FloorProjector;
    private renderer: Renderer;
    private miniMap: MiniMap;

    constructor(private readonly screen: CanvasStack,
                private readonly mapData: MapData,
                private readonly player: Player) {
        this.settings = getSettings();
        this.a = getAngles();
        this.tables = getLookupTables();

        this.textures = [];
        this.rayCaster = new Raycaster(this.mapData);
        this.floorProjector = new FloorProjector(
            this.screen,
            this.player);
        this.renderer = new Renderer(this.textures, this.screen);
        this.miniMap = new MiniMap(this.mapData, this.screen);
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

    public castAndRender() {
        // cast ...
        const rays: IRayData[] = this.rayCaster.castRays(
            this.player.playerPosition,
            this.player.direction);
        const floorTiles: ITile[] = this.rayCaster.visibleFloorTiles;

        // ... compute projections ...
        const wallSlices: IWallSliceData[] = this.getWallSlices(rays);
        const floorProjections: ITileProjection[] = this.getFloorProjections(floorTiles);

        // ... and render
        this.miniMap.updateMiniPlayer(this.player.playerPosition, this.player.direction);
        // this.miniMap.updateRays(this.player.playerPosition, rays);
        this.miniMap.updatePlayerDirection(this.player.playerPosition, this.player.direction);
        this.renderer.clearBufferCanvas();
        this.renderer.clearGameCanvas();
        this.renderer.drawBackground();

        rays.forEach((ray, screenColumn) => {
            const wallSlice = wallSlices[screenColumn];
            this.renderer.drawTexturedWallSlice(ray, wallSlice, screenColumn);
        });

        this.renderer.drawFloorTiles(floorProjections);

        // for (let screenColumn = 0; screenColumn < this.settings.canvasSize.width; screenColumn++) {
            // find wall collision and get ray data

            // const wallSlice = this.getWallSlice(ray);

            // render the wall slice
            // this.renderer.drawTexturedWallSlice(ray, wallSlice, screenColumn);
            // this.renderer.drawFloorTiles(floorProjections);

            // columnAngle -= 1;
        // }

    }

    private getWallSlices(rays: IRayData[]): IWallSliceData[] {
        const slices: IWallSliceData[] = [];

        rays.forEach((ray) => {
            const slice = this.getWallSlice(ray);
            slices.push(slice);
        });
        return slices;
    }

    private getWallSlice(ray: IRayData): IWallSliceData {
        const pixelPlane = this.screen.planePropertiesInPixels;
        const abstractPlane = this.screen.planePropiertiesAbstract;

        const lineHeight = (abstractPlane.distanceToPlayer / ray.rayLength) * pixelPlane.height;
        const halfHeight = lineHeight * 0.5;
        const startingPoint = pixelPlane.verticalCenter - halfHeight;
        const endPoint = pixelPlane.verticalCenter + halfHeight;

        return {
            start: Math.floor(startingPoint),
            end: Math.floor(endPoint),
            height: Math.floor(lineHeight),
        };
    }

    private getFloorProjections(tiles: ITile[]): ITileProjection[] {
        const projections: ITileProjection[] = [];

        tiles.forEach((tile) => {
            const projection = this.floorProjector.getTileProjection(tile);
            projections.push(projection);
        });

        return projections;
    }

    private getRGBColor(ray: IRayData): string {
        let green = 220;
        if (ray.collisionType === "h") {
            green -= 30;
        }

        return `rgb(0, ${green}, 0)`;
    }

}
