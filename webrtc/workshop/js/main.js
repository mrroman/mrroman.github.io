/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_js__ = __webpack_require__(1);


class App {

    constructor() {
        this.connection = new RTCPeerConnection();
        this.connection.addEventListener('connectionstatechange', () => {
            __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('event', 'Connection state change');
            __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('status', this.connection.connectionState);
        });
        this.connection.addEventListener('signalingstatechange', (e) => {
            __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('signaling-status', this.connection.signalingState);
        });
        this.connection.addEventListener('negotiationneeded', (e) => {
            __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('event', 'Negotiation Needed');
        });
        this.connection.addEventListener('datachannel', (e) => {
            __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('event', 'Data channel');
            this.setChannel(e.channel);
        });
        this.connection.addEventListener('icecandidate', (e) => {
            if (e.candidate) {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["a" /* appendText */]('candidates', JSON.stringify(e.candidate) + ',');
            }
        });
        this.connection.addEventListener('addstream', (e) => {
            if (e.stream) {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["d" /* setCamera */](e.stream);
            }
        });
    }

    createOffer() {
        this.connection.createOffer()
            .then((offer) => this.connection.setLocalDescription(offer))
            .then(() => {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('output', JSON.stringify(this.connection.localDescription.toJSON()));
            });
    }

    createAnswer() {
        __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('event', '');

        const offer = JSON.parse(__WEBPACK_IMPORTED_MODULE_0__view_js__["c" /* getText */]('input'));
        this.connection.setRemoteDescription(offer)
            .then(() => this.connection.createAnswer())
            .then((answer) => this.connection.setLocalDescription(answer))
            .then((answer) => {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('output', JSON.stringify(this.connection.localDescription.toJSON()));
            });
    }

    acceptAnswer() {
        const answer = JSON.parse(__WEBPACK_IMPORTED_MODULE_0__view_js__["c" /* getText */]('input'));

        this.connection.setRemoteDescription(answer)
            .then(() => {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["e" /* setText */]('output', '');
            });
    }

    acceptCandidates() {
        const text = __WEBPACK_IMPORTED_MODULE_0__view_js__["c" /* getText */]('input').replace(/,$/, '');
        console.log(text);
        const candidates = JSON.parse(`[${text}]`);

        candidates.forEach((candidate) => this.connection.addIceCandidate(candidate));
    }

    createDataChannel() {
        this.setChannel(this.connection.createDataChannel('chat'));
    }

    setChannel(channel) {
        this.channel = channel;
        channel.onopen = () => __WEBPACK_IMPORTED_MODULE_0__view_js__["b" /* channelLog */]("Channel opened");
        channel.onmessage = (e) => __WEBPACK_IMPORTED_MODULE_0__view_js__["b" /* channelLog */](`Message: ${e.data}`);
        channel.onclose = (e) => {
            __WEBPACK_IMPORTED_MODULE_0__view_js__["b" /* channelLog */]("Channel closed");
            this.channel = null;
        };
    }

    sendMessage(e) {
        e.preventDefault();
        if (this.channel) {
            const message = __WEBPACK_IMPORTED_MODULE_0__view_js__["c" /* getText */]('message');
            __WEBPACK_IMPORTED_MODULE_0__view_js__["b" /* channelLog */](`Me: ${message}`);
            this.channel.send(message);
        }
    }

    addCameraStream() {
        const constraints = {
            audio: false,
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                __WEBPACK_IMPORTED_MODULE_0__view_js__["d" /* setCamera */](stream);
                this.connection.addStream(stream);
            });
    }
}

window.app = new App();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = getText;
/* harmony export (immutable) */ __webpack_exports__["e"] = setText;
/* harmony export (immutable) */ __webpack_exports__["a"] = appendText;
/* harmony export (immutable) */ __webpack_exports__["b"] = channelLog;
/* harmony export (immutable) */ __webpack_exports__["d"] = setCamera;
function getText(where) {
    return document.getElementById(where).value;
}

function setText(where, text) {
    document.getElementById(where).textContent = text;
}

function appendText(where, text) {
    const el = document.getElementById(where);
    el.textContent = el.textContent + text;
}

function channelLog(text) {
    console.log("Channel log: ", text);
    const el = document.createElement('div');
    el.className = 'channel__item';
    el.textContent = text;

    document.getElementById('channel').appendChild(el);
}

function setCamera(stream) {
    const player = document.getElementById('camera');
    player.srcObject = stream;
    player.play();
}


/***/ })
/******/ ]);