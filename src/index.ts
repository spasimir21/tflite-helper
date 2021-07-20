type TFLiteHelperModule = {
  _allocateModel(model_buffer_size: number): number;
  _getModelBufferOffset(model_offset: number): number;
  _loadModel(model_offset: number): number;
  _getInputTensorCount(model_offset: number): number;
  _getInputTensorId(model_offset: number, index: number): number;
  _getOutputTensorCount(model_offset: number): number;
  _getOutputTensorId(model_offset: number, index: number): number;
  _getTensorType(model_offset: number, tensor_id: number): number;
  _getTensorOffset(model_offset: number, tensor_id: number): number;
  _getTensorDimensionCount(model_offset: number, tensor_id: number): number;
  _getTensorDimension(model_offset: number, tensor_id: number, index: number): number;
  _invokeModel(model_offset: number): number;
  _freeModel(model_offset: number): void;
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
};

type Tensor = {
  id: number;
  type: number;
  offset: number;
  size: number;
  dimensions: number[];
  data: Float64Array | Float32Array | Int32Array | Int16Array | Int8Array | Uint32Array | Uint8Array;
};

type TFLiteModel = {
  inputs: Tensor[];
  outputs: Tensor[];
  invoke(): number;
  free(): void;
  _module: TFLiteHelperModule;
};

const TypeIDToTypedArrayMap = {
  1: Float32Array,
  2: Int32Array,
  3: Uint8Array,
  7: Int16Array,
  9: Int8Array,
  11: Float64Array,
  16: Uint32Array
};

const $emscipten_modules: { [key: string]: TFLiteHelperModule } = {};

async function loadModule(path: string): Promise<TFLiteHelperModule> {
  try {
    const createTFLiteHelperSIMDModule = (await import(`${path}/tflite-helper-simd.js`)).default;
    return await createTFLiteHelperSIMDModule();
  } catch (err) {
    const createTFLiteHelperModule = (await import(`${path}/tflite-helper.js`)).default;
    return await createTFLiteHelperModule();
  }
}

async function getModule(path: string): Promise<TFLiteHelperModule> {
  path = path.replace(/\/+$/, ''); // Remove trailing slash
  if ($emscipten_modules[path] != null) return $emscipten_modules[path];
  const _module = await loadModule(path);
  $emscipten_modules[path] = _module;
  return _module;
}

function getTensorDimensions(_module: TFLiteHelperModule, model_offset: number, tensor_id: number): number[] {
  return new Array(_module._getTensorDimensionCount(model_offset, tensor_id))
    .fill(0)
    .map((_, i) => _module._getTensorDimension(model_offset, tensor_id, i));
}

function getTensor(_module: TFLiteHelperModule, model_offset: number, tensor_id: number): Tensor {
  const type = _module._getTensorType(model_offset, tensor_id);
  const offset = _module._getTensorOffset(model_offset, tensor_id);
  const dimensions = getTensorDimensions(_module, model_offset, tensor_id);
  const size = dimensions.reduce((a, b) => a * b, 1);

  return {
    id: tensor_id,
    type,
    offset,
    size,
    dimensions,
    get data() {
      // @ts-ignore (dumb typescript stuff)
      return new TypeIDToTypedArrayMap[type](_module.HEAP8.buffer, offset, size);
    }
  };
}

function getInputTensors(_module: TFLiteHelperModule, model_offset: number): Tensor[] {
  return new Array(_module._getInputTensorCount(model_offset))
    .fill(0)
    .map((_, i) => _module._getInputTensorId(model_offset, i))
    .map(tensor_id => getTensor(_module, model_offset, tensor_id));
}

function getOutputTensors(_module: TFLiteHelperModule, model_offset: number): Tensor[] {
  return new Array(_module._getOutputTensorCount(model_offset))
    .fill(0)
    .map((_, i) => _module._getOutputTensorId(model_offset, i))
    .map(tensor_id => getTensor(_module, model_offset, tensor_id));
}

async function createModel(model_path: string, module_path: string): Promise<TFLiteModel> {
  const _module = await getModule(module_path);

  const model_buffer_req = await fetch(model_path);
  const model_buffer = await model_buffer_req.arrayBuffer();

  const model_offset = _module._allocateModel(model_buffer.byteLength);
  const model_buffer_offset = _module._getModelBufferOffset(model_offset);

  _module.HEAPU8.set(new Uint8Array(model_buffer), model_buffer_offset);

  if (_module._loadModel(model_offset) == -1) {
    _module._freeModel(model_offset);
    throw new Error('Model Failed To Load!');
  }

  return {
    inputs: getInputTensors(_module, model_offset),
    outputs: getOutputTensors(_module, model_offset),
    invoke: () => _module._invokeModel(model_offset),
    free: () => _module._freeModel(model_offset),
    _module
  };
}

export { createModel, TFLiteModel };
export default createModel;
