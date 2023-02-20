/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/algea.js":
/*!**********************!*\
  !*** ./src/algea.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Algea; }\n/* harmony export */ });\nclass Algea {\n\n    constructor(ctx) {\n        this.ctx = ctx\n        this.pos = this.placer()\n    }\n\n    placer() {\n        let pos = []\n        pos[0] = Math.floor(Math.random() * 290)\n        pos[1] = Math.floor(Math.random() * 70) + 70\n        return pos\n    }\n\n    draw() {\n        this.ctx.fillStyle = 'rgba(225,0,225,1)';\n        this.ctx.fillRect(this.pos[0], this.pos[1], 10, 5)\n    }\n\n    \n\n}\n\n//# sourceURL=webpack://jsproj/./src/algea.js?");

/***/ }),

/***/ "./src/fish.js":
/*!*********************!*\
  !*** ./src/fish.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Fish; }\n/* harmony export */ });\nclass Fish {\n\n    constructor(ctx) {\n        this.ctx = ctx\n        this.pos = this.placer()\n        this.up = [true, false][Math.floor(Math.random() * 2)]\n        this.right = [true, false][Math.floor(Math.random() * 2)]\n        this.leftImg = new Image()\n        this.leftImg.src = './dist/art/fishleft.png'\n        this.rightImg = new Image()\n        this.rightImg.src = './dist/art/fishright.png'\n        this.img = this.right ? this.rightImg : this.leftImg \n    }\n    \n    placer() {\n        let pos = []\n        pos[0] = Math.floor(Math.random() * 700)\n        pos[1] = Math.floor(Math.random() * 700)\n        return pos\n    }\n\n    draw() {\n        this.drift()\n        this.ctx.fillStyle = 'rgba(0,225,225,1)';\n        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], 25, 16)\n\n    }\n\n    drift() {\n        if (this.pos[0] > 700 - 25 || this.pos[0] < 0) this.right = !this.right\n        if (this.pos[1] > 700 - 16 || this.pos[1] < 0) this.up = !this.up\n\n\n        if (this.right) {\n            this.pos[0] += .3\n        } else {\n            this.pos[0] -= .3\n        }\n\n        if (this.up) {\n            this.pos[1] += .3\n        } else {\n            this.pos[1] -= .3\n        }\n    }\n\n}\n\n//# sourceURL=webpack://jsproj/./src/fish.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ \"./src/view.js\");\n\n\n\nconst canvas = document.getElementById('canvas1')\ncanvas.height = 700\ncanvas.width = 700\n\nconst view = new _view__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas)\n\n\n\n\n//# sourceURL=webpack://jsproj/./src/index.js?");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ View; }\n/* harmony export */ });\n/* harmony import */ var _fish__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fish */ \"./src/fish.js\");\n/* harmony import */ var _algea__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algea */ \"./src/algea.js\");\n\n\n\nclass View {\n\n    constructor(canvas) {\n        this.canvas = canvas\n        this.ctx = this.canvas.getContext('2d')\n        this.fishes = this.fishMaker(10)\n        this.algea = this.algeaMaker(10)\n        this.animate()\n    }\n\n    animate() {\n        this.ctx.clearRect(0, 0, 700, 700)\n\n        this.ctx.fillStyle = 'rgba(225,225,225,0.9)';\n        this.ctx.fillRect(0, 0, 1700, 1700)\n        this.drawfishes()\n\n        requestAnimationFrame(this.animate.bind(this))\n    }\n\n    fishMaker(fishNum) {\n        let fishArr = []\n\n        while (fishNum > 0) {\n            fishArr.push(new _fish__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.ctx))\n            fishNum--\n        }\n        return fishArr\n    }\n\n    algeaMaker(algeaNum) {\n        let algeaArr = []\n\n        while (algeaNum > 0) {\n            algeaArr.push(new _algea__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.ctx))\n            algeaNum--\n        }\n        return algeaArr\n    }\n\n    drawfishes() {\n        this.fishes.forEach((fish)=>{\n            fish.draw()\n        })\n        this.algea.forEach((algea) => {\n            algea.draw()\n        })\n    }\n}\n\n\n\n\n//# sourceURL=webpack://jsproj/./src/view.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;