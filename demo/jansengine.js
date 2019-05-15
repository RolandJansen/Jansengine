(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jansengine"] = factory();
	else
		root["jansengine"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "d:\\Users\\jansen\\git\\Jansengine\\src\\index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "d:\\Users\\jansen\\git\\Jansengine\\src\\Jansengine.ts":
/*!********************************************************!*\
  !*** d:/Users/jansen/git/Jansengine/src/Jansengine.ts ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Jansengine; });\n/* harmony import */ var _KeyBindings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KeyBindings */ \"d:\\\\Users\\\\jansen\\\\git\\\\Jansengine\\\\src\\\\KeyBindings.ts\");\n/* harmony import */ var _MiniMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MiniMap */ \"d:\\\\Users\\\\jansen\\\\git\\\\Jansengine\\\\src\\\\MiniMap.ts\");\n\r\n\r\nclass Jansengine {\r\n    constructor(canvasName) {\r\n        const canvas = document.getElementById(canvasName);\r\n        if (canvas !== null && this.isCanvas(canvas)) {\r\n            this.canvas = canvas;\r\n            this.ctx = canvas.getContext(\"2d\");\r\n        }\r\n        else {\r\n            throw new Error(`${canvasName} is not of type HTMLCanvasElement`);\r\n        }\r\n        this.setFocusToCanvas(this.canvas);\r\n        this.keyBindings = new _KeyBindings__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n    }\r\n    gameCycle() {\r\n        setTimeout(this.gameCycle, 1000 / 30);\r\n    }\r\n    loadMap(mapData) {\r\n        this.map = new _MiniMap__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.canvas, mapData);\r\n    }\r\n    // type guard\r\n    isCanvas(el) {\r\n        return el.getContext !== undefined;\r\n    }\r\n    setFocusToCanvas(canvasElement) {\r\n        canvasElement.focus();\r\n    }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qYW5zZW5naW5lL2Q6L1VzZXJzL2phbnNlbi9naXQvSmFuc2VuZ2luZS9zcmMvSmFuc2VuZ2luZS50cz85ZTRiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdDO0FBQ1I7QUFFakIsTUFBTSxVQUFVO0lBTzNCLFlBQVksVUFBa0I7UUFDMUIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVuRCxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7U0FDdkM7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxVQUFVLG1DQUFtQyxDQUFDLENBQUM7U0FDckU7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxvREFBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLFNBQVM7UUFDWixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxPQUFtQjtRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksZ0RBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxhQUFhO0lBQ0wsUUFBUSxDQUFDLEVBQWU7UUFDNUIsT0FBUSxFQUF3QixDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLGFBQWdDO1FBQ3JELGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0oiLCJmaWxlIjoiZDpcXFVzZXJzXFxqYW5zZW5cXGdpdFxcSmFuc2VuZ2luZVxcc3JjXFxKYW5zZW5naW5lLnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtleUJpbmRpbmdzIGZyb20gXCIuL0tleUJpbmRpbmdzXCI7XHJcbmltcG9ydCBNaW5pTWFwIGZyb20gXCIuL01pbmlNYXBcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEphbnNlbmdpbmUge1xyXG5cclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIG1hcCE6IE1pbmlNYXA7XHJcbiAgICBwcml2YXRlIGtleUJpbmRpbmdzOiBLZXlCaW5kaW5ncztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcyAhPT0gbnVsbCAmJiB0aGlzLmlzQ2FudmFzKGNhbnZhcykpIHtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NhbnZhc05hbWV9IGlzIG5vdCBvZiB0eXBlIEhUTUxDYW52YXNFbGVtZW50YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldEZvY3VzVG9DYW52YXModGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMua2V5QmluZGluZ3MgPSBuZXcgS2V5QmluZGluZ3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2FtZUN5Y2xlKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5nYW1lQ3ljbGUsIDEwMDAgLyAzMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWRNYXAobWFwRGF0YTogbnVtYmVyW11bXSkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1pbmlNYXAodGhpcy5jYW52YXMsIG1hcERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHR5cGUgZ3VhcmRcclxuICAgIHByaXZhdGUgaXNDYW52YXMoZWw6IEhUTUxFbGVtZW50KTogZWwgaXMgSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoZWwgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZvY3VzVG9DYW52YXMoY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICBjYW52YXNFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///d:\\Users\\jansen\\git\\Jansengine\\src\\Jansengine.ts\n");

/***/ }),

/***/ "d:\\Users\\jansen\\git\\Jansengine\\src\\KeyBindings.ts":
/*!*********************************************************!*\
  !*** d:/Users/jansen/git/Jansengine/src/KeyBindings.ts ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return KeyBindings; });\nclass KeyBindings {\r\n    constructor() {\r\n        document.addEventListener(\"keydown\", this.processKeyDown);\r\n        document.addEventListener(\"keyup\", this.processKeyUp);\r\n    }\r\n    processKeyDown(e) {\r\n        e.preventDefault();\r\n        console.log(\"Keydown: \" + e.key + \", \" + e.code);\r\n    }\r\n    processKeyUp(e) {\r\n        e.preventDefault();\r\n        console.log(\"Keyup: \" + e.key + \", \" + e.code);\r\n    }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qYW5zZW5naW5lL2Q6L1VzZXJzL2phbnNlbi9naXQvSmFuc2VuZ2luZS9zcmMvS2V5QmluZGluZ3MudHM/YmJmZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQWUsTUFBTSxXQUFXO0lBRTVCO1FBQ0ksUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxDQUFnQjtRQUNuQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTyxZQUFZLENBQUMsQ0FBZ0I7UUFDakMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0oiLCJmaWxlIjoiZDpcXFVzZXJzXFxqYW5zZW5cXGdpdFxcSmFuc2VuZ2luZVxcc3JjXFxLZXlCaW5kaW5ncy50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleUJpbmRpbmdzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLnByb2Nlc3NLZXlEb3duKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5wcm9jZXNzS2V5VXApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc0tleURvd24oZTogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIktleWRvd246IFwiICsgZS5rZXkgKyBcIiwgXCIgKyBlLmNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc0tleVVwKGU6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJLZXl1cDogXCIgKyBlLmtleSArIFwiLCBcIiArIGUuY29kZSk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///d:\\Users\\jansen\\git\\Jansengine\\src\\KeyBindings.ts\n");

/***/ }),

/***/ "d:\\Users\\jansen\\git\\Jansengine\\src\\MiniMap.ts":
/*!*****************************************************!*\
  !*** d:/Users/jansen/git/Jansengine/src/MiniMap.ts ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MiniMap; });\nclass MiniMap {\r\n    constructor(canvas, mapData) {\r\n        this.canvas = canvas;\r\n        this.mapData = mapData;\r\n        this.miniMapBlockWidth = 8;\r\n        this.ctx = canvas.getContext(\"2d\");\r\n        this.widthInBlocks = mapData[0].length;\r\n        this.heightInBlocks = mapData.length;\r\n        this.setCanvasResolution();\r\n        this.resizeCanvas();\r\n        this.drawMap();\r\n    }\r\n    /**\r\n     * Set the internal canvas dimensions\r\n     */\r\n    setCanvasResolution() {\r\n        this.canvas.width = this.widthInBlocks * this.miniMapBlockWidth;\r\n        this.canvas.height = this.heightInBlocks * this.miniMapBlockWidth;\r\n    }\r\n    /**\r\n     * Set canvas dimensions via css\r\n     */\r\n    resizeCanvas() {\r\n        this.canvas.style.width = (this.widthInBlocks * this.miniMapBlockWidth) + \"px\";\r\n        this.canvas.style.height = (this.heightInBlocks * this.miniMapBlockWidth) + \"px\";\r\n    }\r\n    drawMap() {\r\n        this.ctx.fillStyle = \"rgb(200,200,200)\";\r\n        for (let y = 0; y < this.heightInBlocks; y++) {\r\n            for (let x = 0; x < this.widthInBlocks; x++) {\r\n                const block = this.mapData[y][x];\r\n                if (block > 0) {\r\n                    this.ctx.fillRect(x * this.miniMapBlockWidth, y * this.miniMapBlockWidth, this.miniMapBlockWidth, this.miniMapBlockWidth);\r\n                }\r\n            }\r\n        }\r\n    }\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qYW5zZW5naW5lL2Q6L1VzZXJzL2phbnNlbi9naXQvSmFuc2VuZ2luZS9zcmMvTWluaU1hcC50cz80NDQwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBZSxNQUFNLE9BQU87SUFPeEIsWUFBb0IsTUFBeUIsRUFBVSxPQUFtQjtRQUF0RCxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFGbEUsc0JBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBRzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUVwQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRXJDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssbUJBQW1CO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ3RFLENBQUM7SUFFRDs7T0FFRztJQUNLLFlBQVk7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDL0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDckYsQ0FBQztJQUVPLE9BQU87UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO29CQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUNiLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQzFCLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQzFCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDdkQ7YUFDSjtTQUNKO0lBQ0wsQ0FBQztDQUVKIiwiZmlsZSI6ImQ6XFxVc2Vyc1xcamFuc2VuXFxnaXRcXEphbnNlbmdpbmVcXHNyY1xcTWluaU1hcC50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmlNYXAge1xyXG5cclxuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIHdpZHRoSW5CbG9ja3M6IG51bWJlcjtcclxuICAgIHByaXZhdGUgaGVpZ2h0SW5CbG9ja3M6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbWluaU1hcEJsb2NrV2lkdGggPSA4O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgcHJpdmF0ZSBtYXBEYXRhOiBudW1iZXJbXVtdKSB7XHJcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aEluQmxvY2tzID0gbWFwRGF0YVswXS5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRJbkJsb2NrcyA9IG1hcERhdGEubGVuZ3RoO1xyXG5cclxuICAgICAgICB0aGlzLnNldENhbnZhc1Jlc29sdXRpb24oKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgIHRoaXMuZHJhd01hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBpbnRlcm5hbCBjYW52YXMgZGltZW5zaW9uc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldENhbnZhc1Jlc29sdXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoSW5CbG9ja3MgKiB0aGlzLm1pbmlNYXBCbG9ja1dpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0SW5CbG9ja3MgKiB0aGlzLm1pbmlNYXBCbG9ja1dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNhbnZhcyBkaW1lbnNpb25zIHZpYSBjc3NcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNpemVDYW52YXMoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSAodGhpcy53aWR0aEluQmxvY2tzICogdGhpcy5taW5pTWFwQmxvY2tXaWR0aCkgKyBcInB4XCI7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMuaGVpZ2h0SW5CbG9ja3MgKiB0aGlzLm1pbmlNYXBCbG9ja1dpZHRoKSArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdNYXAoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjAwLDIwMCwyMDApXCI7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodEluQmxvY2tzOyB5KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoSW5CbG9ja3M7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLm1hcERhdGFbeV1beF07XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2sgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHggKiB0aGlzLm1pbmlNYXBCbG9ja1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5ICogdGhpcy5taW5pTWFwQmxvY2tXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5pTWFwQmxvY2tXaWR0aCwgdGhpcy5taW5pTWFwQmxvY2tXaWR0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///d:\\Users\\jansen\\git\\Jansengine\\src\\MiniMap.ts\n");

/***/ }),

/***/ "d:\\Users\\jansen\\git\\Jansengine\\src\\index.ts":
/*!***************************************************!*\
  !*** d:/Users/jansen/git/Jansengine/src/index.ts ***!
  \***************************************************/
/*! exports provided: getInstance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getInstance\", function() { return getInstance; });\n/* harmony import */ var _Jansengine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Jansengine */ \"d:\\\\Users\\\\jansen\\\\git\\\\Jansengine\\\\src\\\\Jansengine.ts\");\n\r\n// the main file\r\n// function createAPI() {\r\n//     return {\r\n//         getEngineInstance: (elementId: string) => {\r\n//             // return new Jansengine(elementId);\r\n//             return true;\r\n//         },\r\n//     };\r\n// }\r\nfunction getInstance(elementId) {\r\n    return new _Jansengine__WEBPACK_IMPORTED_MODULE_0__[\"default\"](elementId);\r\n}\r\n// export default createAPI();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qYW5zZW5naW5lL2Q6L1VzZXJzL2phbnNlbi9naXQvSmFuc2VuZ2luZS9zcmMvaW5kZXgudHM/YjQ1MSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBc0M7QUFDdEMsZ0JBQWdCO0FBRWhCLHlCQUF5QjtBQUN6QixlQUFlO0FBQ2Ysc0RBQXNEO0FBQ3RELG1EQUFtRDtBQUNuRCwyQkFBMkI7QUFDM0IsYUFBYTtBQUNiLFNBQVM7QUFDVCxJQUFJO0FBRUcsU0FBUyxXQUFXLENBQUMsU0FBaUI7SUFDekMsT0FBTyxJQUFJLG1EQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVELDhCQUE4QiIsImZpbGUiOiJkOlxcVXNlcnNcXGphbnNlblxcZ2l0XFxKYW5zZW5naW5lXFxzcmNcXGluZGV4LnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEphbnNlbmdpbmUgZnJvbSBcIi4vSmFuc2VuZ2luZVwiO1xyXG4vLyB0aGUgbWFpbiBmaWxlXHJcblxyXG4vLyBmdW5jdGlvbiBjcmVhdGVBUEkoKSB7XHJcbi8vICAgICByZXR1cm4ge1xyXG4vLyAgICAgICAgIGdldEVuZ2luZUluc3RhbmNlOiAoZWxlbWVudElkOiBzdHJpbmcpID0+IHtcclxuLy8gICAgICAgICAgICAgLy8gcmV0dXJuIG5ldyBKYW5zZW5naW5lKGVsZW1lbnRJZCk7XHJcbi8vICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgICAgIH0sXHJcbi8vICAgICB9O1xyXG4vLyB9XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5zdGFuY2UoZWxlbWVudElkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBuZXcgSmFuc2VuZ2luZShlbGVtZW50SWQpO1xyXG59XHJcblxyXG4vLyBleHBvcnQgZGVmYXVsdCBjcmVhdGVBUEkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///d:\\Users\\jansen\\git\\Jansengine\\src\\index.ts\n");

/***/ })

/******/ });
});