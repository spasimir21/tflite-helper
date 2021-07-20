# TFLite-Helper v0.9.0

A Simple Library That Helps You Run TFLite Models in the Browser.

_Base code was taken from https://github.com/Volcomix/virtual-background_

# Installation

```
$ npm install tflite-helper
```

# Preparation

To use this library you'll need to staticlly host all the files from the **wasm/dist** folder in the same path.  
ex. /tflite-helper  
$~~~~~$\> tflite-helper.js  
$~~~~~$\> tflite-helper.wasm  
$~~~~~$\> tflite-helper-simd.js  
$~~~~~$\> tflite-helper-simd.wasm  
You'll also need to statically host your model's **.tflite** file.

# Usage

```javascript
import createModel from 'tflite-helper';

// model_path - The URL from which to load the .tflite model file - ex. /model.tflite
// module_path - The URL from which to load the emscipten module and wasm files - ex. /tflite-helper/
const model = await createModel(model_path, module_path);

// Model Input/Ouput:
//   id: number
//   type: number
//   offset: number
//   size: number
//   dimensions: number[]
//   data: TypedArray - raw data of input / output (readable/writeable)
// Note: data is a getter so make sure to cache it in loops

model.inputs; // Array of model inputs
model.outputs; // Array of model outputs

const input_data = model.inputs[0].data;
// Apply changes to input data

model.invoke(); // Commonly known as predict

const output_data = model.outputs[0].data;
// Read output data

model.free(); // Free the model \w all it's memory
```

# Adding Custom Operations

You'll need at least some very basic **Bazel** experience to do this.  
Sometimes **TFLite** models use **Custom Operations**. You'll need to find where that Custom Operation comes from, add it to the **Docker Container** using the **Dockerfile** or the **WORKSPACE** file, add it as a dependency to both binaries in the **BUILD** file and finally import it and register it in the **loadModel** function in the **main.cpp** file. You can see how to register it from the way this library registers the **Convolution2DTransposeBias** from **MediaPipe**.  
You'll will also need to build the WASM files from scratch (see below).

# Building The WASM Files From Scratch

If you don't want to use the files from **wasm/dist**, then you'll have to build them yourself.  
You'll need to install **Docker** if you haven't done that already.  
Change the **docker-username** in the **build\.sh** or **build.bat** file in the **wasm** folder and run the script.

# TODO

- Switch from ES6 to ES5 with Emscripten, and load the module files with fetch to support more browsers.
