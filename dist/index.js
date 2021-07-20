"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModel = void 0;
var TypeIDToTypedArrayMap = {
    1: Float32Array,
    2: Int32Array,
    3: Uint8Array,
    7: Int16Array,
    9: Int8Array,
    11: Float64Array,
    16: Uint32Array
};
var $emscipten_modules = {};
function loadModule(path) {
    return __awaiter(this, void 0, void 0, function () {
        var createTFLiteHelperSIMDModule, err_1, createTFLiteHelperModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path + "/tflite-helper-simd.js")); })];
                case 1:
                    createTFLiteHelperSIMDModule = (_a.sent()).default;
                    return [4 /*yield*/, createTFLiteHelperSIMDModule()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_1 = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path + "/tflite-helper.js")); })];
                case 4:
                    createTFLiteHelperModule = (_a.sent()).default;
                    return [4 /*yield*/, createTFLiteHelperModule()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getModule(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = path.replace(/\/+$/, ''); // Remove trailing slash
                    if ($emscipten_modules[path] != null)
                        return [2 /*return*/, $emscipten_modules[path]];
                    return [4 /*yield*/, loadModule(path)];
                case 1:
                    _module = _a.sent();
                    $emscipten_modules[path] = _module;
                    return [2 /*return*/, _module];
            }
        });
    });
}
function getTensorDimensions(_module, model_offset, tensor_id) {
    return new Array(_module._getTensorDimensionCount(model_offset, tensor_id))
        .fill(0)
        .map(function (_, i) { return _module._getTensorDimension(model_offset, tensor_id, i); });
}
function getTensor(_module, model_offset, tensor_id) {
    var type = _module._getTensorType(model_offset, tensor_id);
    var offset = _module._getTensorOffset(model_offset, tensor_id);
    var dimensions = getTensorDimensions(_module, model_offset, tensor_id);
    var size = dimensions.reduce(function (a, b) { return a * b; }, 1);
    return {
        id: tensor_id,
        type: type,
        offset: offset,
        size: size,
        dimensions: dimensions,
        get data() {
            // @ts-ignore (dumb typescript stuff)
            return new TypeIDToTypedArrayMap[type](_module.HEAP8.buffer, offset, size);
        }
    };
}
function getInputTensors(_module, model_offset) {
    return new Array(_module._getInputTensorCount(model_offset))
        .fill(0)
        .map(function (_, i) { return _module._getInputTensorId(model_offset, i); })
        .map(function (tensor_id) { return getTensor(_module, model_offset, tensor_id); });
}
function getOutputTensors(_module, model_offset) {
    return new Array(_module._getOutputTensorCount(model_offset))
        .fill(0)
        .map(function (_, i) { return _module._getOutputTensorId(model_offset, i); })
        .map(function (tensor_id) { return getTensor(_module, model_offset, tensor_id); });
}
function createModel(model_path, module_path) {
    return __awaiter(this, void 0, void 0, function () {
        var _module, model_buffer_req, model_buffer, model_offset, model_buffer_offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getModule(module_path)];
                case 1:
                    _module = _a.sent();
                    return [4 /*yield*/, fetch(model_path)];
                case 2:
                    model_buffer_req = _a.sent();
                    return [4 /*yield*/, model_buffer_req.arrayBuffer()];
                case 3:
                    model_buffer = _a.sent();
                    model_offset = _module._allocateModel(model_buffer.byteLength);
                    model_buffer_offset = _module._getModelBufferOffset(model_offset);
                    _module.HEAPU8.set(new Uint8Array(model_buffer), model_buffer_offset);
                    if (_module._loadModel(model_offset) == -1) {
                        _module._freeModel(model_offset);
                        throw new Error('Model Failed To Load!');
                    }
                    return [2 /*return*/, {
                            inputs: getInputTensors(_module, model_offset),
                            outputs: getOutputTensors(_module, model_offset),
                            invoke: function () { return _module._invokeModel(model_offset); },
                            free: function () { return _module._freeModel(model_offset); },
                            _module: _module
                        }];
            }
        });
    });
}
exports.createModel = createModel;
exports.default = createModel;
