import Jansengine from "./Jansengine";
import Texture from "./Texture";
// the main file

// function createAPI() {
//     return {
//         getEngineInstance: (elementId: string) => {
//             // return new Jansengine(elementId);
//             return true;
//         },
//     };
// }

// export default createAPI();

export function getInstance(elementId: string) {
    return new Jansengine(elementId);
}
