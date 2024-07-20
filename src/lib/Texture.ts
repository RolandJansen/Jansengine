export default class Texture {

    public name = "";
    public image: HTMLImageElement;
    public imageDark: HTMLImageElement;
    public width = 0;
    public height = 0;
    private tileSingleXOffset = 0;
    private tileSingleYOffset = 0;
    private bytesPerPixel = 4;
    private pixels!: Uint8ClampedArray;
    private dimmedPixels!: Uint8ClampedArray;

    constructor(imageName: string) {
        this.image = new Image();
        this.imageDark = new Image();

        this.name = imageName;
        this.loadTexture(imageName);
    }

    public get singleXOffset() {
        if (this.tileSingleXOffset !== 0) {
            return this.tileSingleXOffset;
        }
        throw new Error("Texture not initialized. Couldn't read xOffset.");
    }

    public get singleYOffset() {
        if (this.tileSingleYOffset !== 0) {
            return this.tileSingleYOffset;
        }
        throw new Error ("Texture not initialized. Couldn't read yOffset.");
    }

    // public getPixel(row: number, line: number): IPixel {
    //     const rowOffset = row * this.bytesPerPixel;
    //     const lineOffset = line * this.width * this.bytesPerPixel;
    //     const offset = rowOffset + lineOffset;

    //     return {
    //         r: this.pixels[offset],
    //         g: this.pixels[offset + 1],
    //         b: this.pixels[offset + 2],
    //         a: this.pixels[offset + 3],
    //     };
    // }

    public loadTexture(imageName: string) {
        this.name = imageName;
        this.image.crossOrigin = "Anonymous"; // use cache if possible
        this.image.onload = () => {
            this.onTextureLoaded();
        };
        this.image.src = imageName;
    }

    /**
     * Sets texture properties and creates a
     * one-way canvas (offscreen) to render
     * and capture the image to get the pixel data.
     */
    private onTextureLoaded() {
        this.tileSingleXOffset = 1 / this.image.width;
        this.tileSingleYOffset = 1 / this.image.height;
        this.width = this.image.width;
        this.height = this.image.height;

        // this.pixels = this.getPixelsFromImage(this.image);
        this.pixels = this.getPixelsFromImage();

        const dimmedPixels = this.getDimmedPixels(25);
        this.imageDark = this.getImageFromPixels(dimmedPixels);
    }

    // refactor to img
    // private getPixelsFromImage(img: HTMLImageElement): Uint8ClampedArray {
    private getPixelsFromImage(): Uint8ClampedArray {
        const textureBuffer = document.createElement("canvas");
        const ctx = textureBuffer.getContext("2d");

        textureBuffer.width = this.image.width;
        textureBuffer.height = this.image.height;

        if (ctx) {
            ctx.drawImage(this.image, 0, 0);

            const imageData = ctx.getImageData(
                0, 0,
                textureBuffer.width,
                textureBuffer.height,
                );
            return imageData.data;
        } else {
            throw new Error("Couldn't create texture buffer.");
        }
    }

    private getDimmedPixels(dimFactor: number): Uint8ClampedArray {
        const dimmedPixels = new Uint8ClampedArray(this.pixels);

        for (let i = 0; i < this.pixels.length; i++) {
            if ((i + 1) % 4 !== 0) {
                dimmedPixels[i] -= dimFactor;
            }
        }

        return dimmedPixels;
    }

    private getImageFromPixels(pixels: Uint8ClampedArray): HTMLImageElement {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        const imgData = new ImageData(this.width, this.height);

        imgData.data.set(pixels);
        canvas.width = this.width;
        canvas.height = this.height;

        if (ctx) {
            ctx.putImageData(imgData, 0, 0);
            img.src = canvas.toDataURL();  // canvas screenshot
        } else {
            throw new Error("Couldn't create texture buffer.");
        }

        return img;
    }
}
