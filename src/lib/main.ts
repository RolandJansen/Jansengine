import Jansengine from "./Jansengine";
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
