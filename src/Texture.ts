export default class Texture {

    private texture: HTMLImageElement;
    private textureWidth: number = 0;
    private textureHeight: number = 0;
    private textureName = "";
    private pixels!: Uint8ClampedArray;

    constructor(imageName?: string) {
        this.texture = new Image();

        if (imageName) {
            this.textureName = imageName;
            this.loadTexture(imageName);
        }
    }

    public loadTexture(imageName: string) {
        this.textureName = imageName;
        this.texture.crossOrigin = "Anonymous"; // use cache if possible
        this.texture.onload = () => {
            this.onTextureLoaded();
        };
        this.texture.src = imageName;
    }

    /**
     * Creates a one-way canvas (offscreen) to render
     * and capture the image to get the pixel data.
     * @param image A texture bitmap
     */
    private onTextureLoaded() {
        const textureBuffer = document.createElement("canvas");

        this.textureWidth = this.texture.width;
        this.textureHeight = this.texture.height;
        textureBuffer.width = this.texture.width;
        textureBuffer.height = this.texture.height;

        const bufferCtx = textureBuffer.getContext("2d");

        if (bufferCtx) {
            bufferCtx.drawImage(this.texture, 0, 0);

            const imageData = bufferCtx.getImageData(
                0, 0,
                textureBuffer.width,
                textureBuffer.height,
            );
            this.pixels = imageData.data;
        } else {
            throw new Error("Couldn't create texture buffer.");
        }

    }
}
