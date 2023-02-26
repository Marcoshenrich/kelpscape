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

/***/ "./src/algae.js":
/*!**********************!*\
  !*** ./src/algae.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Algae; }\n/* harmony export */ });\n/* harmony import */ var _denizen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./denizen */ \"./src/denizen.js\");\n\n\n\nclass Algae extends _denizen__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n\n    constructor(id, ctx, canvas, view, posMatrix, logic) {\n        super(ctx, canvas, view, posMatrix, logic)\n        this.id = \"Algae\" + id\n        this.img = new Image()\n        this.img.src = './dist/art/algae.png'\n        this.height = 8\n        this.width = 8\n        this.pos = this.placer()\n    }\n\n    placer() {\n        let pos = []\n        pos[0] = Math.floor(Math.random() * this.canvas.width) - this.height\n        pos[1] = Math.floor(Math.random() * this.canvas.height / 2) + (this.canvas.height / 2) - this.width\n        return pos\n    }\n\n    draw() {\n        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)\n    }\n\n    \n\n}\n\n//# sourceURL=webpack://jsproj/./src/algae.js?");

/***/ }),

/***/ "./src/denizen.js":
/*!************************!*\
  !*** ./src/denizen.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Denizen; }\n/* harmony export */ });\nclass Denizen {\n\n    constructor(ctx, canvas, view, posMatrix, logic) {\n        this.ctx = ctx\n        this.canvas = canvas\n        this.view = view\n        this.posMatrix = posMatrix\n        this.logic = logic\n    }\n    \n\n    collisionDetector(pos1, pos2) {\n        let [[pos1x, pos1y], [dim1x, dim1y]] = pos1\n        let [[pos2x, pos2y], [dim2x, dim2y]] = pos2\n\n        if (\n            pos1x < pos2x + dim2x &&\n            pos1x + dim1x > pos2x &&\n            pos1y < pos2y + dim2y &&\n            dim1y + pos1y > pos2y\n        ) {\n            return true\n        }\n        return false\n    }\n\n}\n\n\n//# sourceURL=webpack://jsproj/./src/denizen.js?");

/***/ }),

/***/ "./src/fish.js":
/*!*********************!*\
  !*** ./src/fish.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Fish; }\n/* harmony export */ });\n/* harmony import */ var _denizen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./denizen */ \"./src/denizen.js\");\n/* harmony import */ var _fishegg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fishegg */ \"./src/fishegg.js\");\n\n\n\nclass Fish extends _denizen__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n\n    constructor(id, ctx, canvas, view, posMatrix, logic, pos, spawn) {\n        super(ctx, canvas, view, posMatrix, logic)\n\n        this.id = \"Fish\" + id\n        this.up = [true, false][Math.floor(Math.random() * 2)]\n        this.right = [true, false][Math.floor(Math.random() * 2)]\n        this.leftImg = new Image()\n        this.leftImg.src = './dist/art/fishleft.png'\n        this.rightImg = new Image()\n        this.rightImg.src = './dist/art/fishright.png'\n        this.mateHeart = new Image()\n        this.mateHeart.src = './dist/art/red-heart.png'\n        this.img = this.imgSelector()\n        this.speed = (Math.floor(Math.random() * 5) +1 )/10\n        this.width = spawn ? 12 : 25\n        this.height = spawn ? 8 : 16\n        this.pos = pos || this.placer()\n        this.mouthSize = spawn ? 4 : 8\n        this.mouthPos = this.mouthPlacer()\n        this.movement1 = this.moveSelector()\n        this.movement2 = this.moveSelector()\n        this.moveChangerOne()\n        this.moveChangerTwo()\n\n        this.energy = 15\n        this.dead = false\n        this.maxSpeed = spawn ? .3 : .6\n\n        this.mating = false\n        this.spawn = spawn ? true : false\n\n        \n    }\n\n    mouthPlacer() {\n        let mouthPos = []\n        if (!this.right) {\n            mouthPos = [this.pos[0], this.pos[1] + (this.height / 2)]\n        } else {\n            mouthPos = [this.pos[0] + (this.width - this.mouthSize), this.pos[1] + (this.height / 2)]\n        }\n        return mouthPos\n    }\n\n    imgSelector() {\n       return this.right ? this.rightImg : this.leftImg \n    }\n    \n    placer() {\n        let pos = []\n        pos[0] = Math.floor(Math.random() * (this.canvas.width - this.width))\n        pos[1] = Math.floor(Math.random() * (this.canvas.height - this.height)) \n        return pos\n    }\n\n    draw() {\n        this.move()\n        this.consumeEnergy()\n        this.ctx.fillStyle = 'rgba(0,225,225,1)';\n        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy +3) /10\n        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)\n        if (this.mating) this.ctx.drawImage(this.mateHeart, this.mouthPos[0], this.mouthPos[1] - 25, 15, 15)\n        if (this.view.debugging) this.drawMouths()\n        this.ctx.globalAlpha = 1\n \n    }\n\n    drawMouths() {\n        //debugging function in draw()\n        this.ctx.fillRect(this.mouthPos[0], this.mouthPos[1], this.mouthSize, this.mouthSize)\n  \n    }\n\n    move() {\n        if (this.pos[0] > this.canvas.width - this.width || this.pos[0] < 0) {\n            this.right = !this.right;\n            this.img = this.imgSelector();\n        }\n        if (this.pos[1] > this.canvas.height - this.height || this.pos[1] < 0) this.up = !this.up\n        this.mouthPos = this.mouthPlacer();\n\n        if (!this.mating) {\n            let movementSwitch = Math.floor(Math.random()*1000)\n            if (movementSwitch === 1) Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()\n\n            this.movement1();\n            this.movement2();\n        }\n\n    }\n\n\n    movementPatterns = {\n        scan: ()=>{\n            if (this.right) {\n                this.pos[0] += (this.speed / 2)\n            } else {\n                this.pos[0] -= (this.speed / 2)\n            }\n        },\n\n        crissCross: ()=>{\n                this.movementPatterns.scan()\n                this.movementPatterns.bob()\n            },\n\n        bob: () => {\n                if (this.up) {\n                    this.pos[1] += (this.speed / 2)\n                } else {\n                    this.pos[1] -= (this.speed / 2)\n                }\n            }\n    }\n\n    movementSwitches = {\n        reverseUp:() => {\n            this.up = !this.up\n        },\n\n        reverseSide:() => {\n            this.right = !this.right;\n            this.img = this.imgSelector();\n        },\n\n        speedUp:() =>{\n            if (this.speed < this.maxSpeed) this.speed += .1\n        },\n\n        slowDown:() => {\n            if (this.speed > .3)this.speed -= .1\n        },\n\n        dash: () => {\n            this.speed += .5\n            setTimeout(() => this.speed -= .5 ,500)\n        }\n    }\n\n    moveSelector = () => {\n        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]\n    }\n\n    moveChangerOne() {\n        this.movement1 = this.moveSelector()\n        setTimeout(()=>{\n            this.moveChangerOne()\n        }, Math.floor(Math.random() * 5000))\n    }\n\n    moveChangerTwo() {\n        this.movement2 = this.moveSelector()\n        setTimeout(() => {\n            this.moveChangerTwo()\n        }, Math.floor(Math.random() * 5000))\n    }\n    \n    consumeEnergy(){\n        this.energy -= .01 * this.speed\n        if (this.energy < .05) this.dead = true\n    }\n\n    mate() {\n        this.mating = true\n        this.speed = 0\n        this.energy -= 5\n        setTimeout(()=>{\n            this.speed += .5\n            this.mating = false\n            let i = Math.floor(Math.random() * 3)\n            while (i > 0) {\n                i--\n                this.logic.eggCount += 1\n                this.logic.eggs[this.logic.eggCount] = new _fishegg__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.logic.eggCount, [this.pos[0], this.pos[1]], this.ctx, this.canvas, this.view, this.posMatrix, this.logic)\n            }\n            console.log(this.logic.eggs)\n        }, 1500)\n    }\n}\n\n//# sourceURL=webpack://jsproj/./src/fish.js?");

/***/ }),

/***/ "./src/fishegg.js":
/*!************************!*\
  !*** ./src/fishegg.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Fishegg; }\n/* harmony export */ });\n/* harmony import */ var _denizen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./denizen */ \"./src/denizen.js\");\n/* harmony import */ var _fish__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fish */ \"./src/fish.js\");\n\n\n\nclass Fishegg extends _denizen__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n\n    constructor(id, pos, ctx, canvas, view, posMatrix, logic) {\n        super(ctx, canvas, view, posMatrix, logic)\n        this.id = \"Fishegg\" + id\n        this.pos = pos\n        this.img = new Image()\n        this.img.src = './dist/art/fishEggs.png'\n        this.spawn()\n        this.destroy = false\n    }\n\n    draw() {\n        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], 25, 25)\n    }\n\n    spawn() {\n        setTimeout(()=>{\n            this.destroy = true\n            this.logic.fishCount += 1\n            this.logic.fishes[this.logic.fishCount] = new _fish__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.logic.fishCount, this.ctx, this.canvas, this.view, this.posMatrix, this.logic, [this.pos[0], this.pos[1]], \"spawn\")\n        },10000)\n    }\n}\n\n//# sourceURL=webpack://jsproj/./src/fishegg.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ \"./src/view.js\");\n\n\n\nconst canvas = document.getElementById('canvas1')\ncanvas.height = 700\ncanvas.width = 700\n\nconst view = new _view__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas)\n\n\n\n\n//# sourceURL=webpack://jsproj/./src/index.js?");

/***/ }),

/***/ "./src/logic.js":
/*!**********************!*\
  !*** ./src/logic.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Logic; }\n/* harmony export */ });\n/* harmony import */ var _fish__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fish */ \"./src/fish.js\");\n/* harmony import */ var _algae__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algae */ \"./src/algae.js\");\n\n\n\nclass Logic {\n\n    constructor(ctx, canvas, view) {\n        this.ctx = ctx\n        this.canvas = canvas\n        this.view = view\n        this.posMatrix = this.matrixMaker()\n        this.fishCount = 10\n        this.fishes = this.tankPopulator(this.fishCount, _fish__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n        this.algaeCount = 50\n        this.algae = this.tankPopulator(this.algaeCount, _algae__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\n        this.eggCount = 0\n        this.eggs = {}\n    }\n\n    coreLoop(){\n        this.fishEatAlgae()\n        this.fishDieFromNoFood()\n        this.fishMeetOtherFish()\n        this.eggsDespawnWhenHatched()\n    }\n\n    eggsDespawnWhenHatched() {\n        for (const [id, egg] of Object.entries(this.eggs)) {\n            if (egg.destroy) delete this.eggs[id]\n        }\n    }\n\n    fishMeetOtherFish() {\n\n        for (let i = 0; i < Object.values(this.fishes).length; i++) {\n            let fish1 = Object.values(this.fishes)[i]\n            if (fish1.energy < 10) continue\n            if (fish1.spawn || fish1.mating) continue\n\n            for (let j = 0; j < Object.values(this.fishes).length; j++) {\n                if (i === j) continue\n                let fish2 = Object.values(this.fishes)[j]\n                if (fish2.energy < 10) continue\n                if (fish2.spawn || fish2.mating) continue\n\n                let bump = fish1.collisionDetector([[fish1.pos[0], fish1.pos[1]], [fish1.width, fish1.height]], [[fish2.pos[0], fish2.pos[1]], [fish2.width, fish2.height]])\n                if (bump) {\n                    fish1.mate()\n                    fish2.mate()\n                }\n            }\n        }\n\n    }\n\n\n    fishDieFromNoFood() {\n        for (const [id, fish] of Object.entries(this.fishes)) {\n            if (fish.dead) delete this.fishes[id]\n        }\n    }\n\n\n    fishEatAlgae() {\n\n        for (let i = 0; i < Object.values(this.fishes).length; i++) {\n            let fish = Object.values(this.fishes)[i]\n            if (fish.energy > 12) continue\n            if (fish.mating) continue\n\n            for (const [id, algae] of Object.entries(this.algae)) {\n                let eat = fish.collisionDetector([fish.mouthPos, [fish.mouthSize, fish.mouthSize]], [algae.pos, [algae.height, algae.width]])\n                if (eat) {\n                    delete this.algae[id]\n                    fish.energy = 15\n                }\n\n            }\n        }\n\n        \n        \n    }\n\n    tankPopulator(objnum, className) {\n        let denizenObj = {}\n\n        while (objnum > 0) {\n            denizenObj[objnum] = new className(objnum, this.ctx, this.canvas, this.view, this.posMatrix, this)\n            objnum--\n        }\n        return denizenObj\n    }\n\n    matrixMaker() {\n        let matrix = {}\n        let i = 100\n        while (i > 0) {\n            matrix[i] = new Set()\n            i--\n        }\n        return matrix\n    }\n\n}\n\n//# sourceURL=webpack://jsproj/./src/logic.js?");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ View; }\n/* harmony export */ });\n/* harmony import */ var _fish__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fish */ \"./src/fish.js\");\n/* harmony import */ var _algae__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algae */ \"./src/algae.js\");\n/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logic */ \"./src/logic.js\");\n\n\n\n\nclass View {\n\n    constructor(canvas) {\n        this.canvas = canvas\n        this.ctx = this.canvas.getContext('2d')\n        this.logic = new _logic__WEBPACK_IMPORTED_MODULE_2__[\"default\"](this.ctx, this.canvas, this)\n        this.fishes = this.logic.fishes\n        this.algae = this.logic.algae\n        this.eggs = this.logic.eggs\n        this.animate()\n        this.debugging = false\n    }\n\n    animate() {\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)\n\n        this.ctx.fillStyle = 'rgba(200,225,255,1)';\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)\n\n        this.ctx.fillStyle = 'rgba(0,0,0,.3)';\n        this.ctx.fillRect(10, 10, 200, 120)\n\n        this.ctx.fillStyle = 'rgba(250,110,0,1)';\n        this.ctx.font = \"36px serif\";\n        this.ctx.fillText(`Fishes: ${Object.values(this.logic.fishes).length}`, 25, 50)\n        this.ctx.fillText(`Algae: ${ Object.values(this.logic.algae).length }`, 25, 100)\n\n        this.drawDenizens()\n        this.logic.coreLoop()\n        if (this.debugging) this.drawMatrix()\n        requestAnimationFrame(this.animate.bind(this))\n    }\n\n    drawDenizens() {\n        Object.values(this.fishes).forEach((fish)=>{\n            fish.draw()\n        })\n        Object.values(this.algae).forEach((algae) => {\n            algae.draw()\n        })\n        Object.values(this.eggs).forEach((egg) => {\n            egg.draw()\n        })\n    }\n\n    drawMatrix() {\n        // debugging function \n        this.ctx.fillStyle = 'rgba(0,0,0,1)';\n\n        let i = 9\n        let steppedHeight = this.canvas.height/10\n        let step = steppedHeight\n        while (i > 0) {\n            this.ctx.fillRect(0, step, this.canvas.width, 1)\n            step += steppedHeight\n            i--\n        }\n\n        i = 9\n        let steppedWidth = this.canvas.width / 10\n        console.log(steppedWidth)\n        step = steppedWidth\n        while (i > 0) {\n            this.ctx.fillRect(step, 0, 1, this.canvas.height)\n            step += steppedHeight\n            i--\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://jsproj/./src/view.js?");

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