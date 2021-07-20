#!/bin/bash
printf "\x1b[1;34m(1/5) Updating Repositories...\x1b[0m\n"
# INCREMENTAL BUILDS: Comment out (both repos)
git -C /tensorflow pull --rebase
git -C /mediapipe pull --rebase

printf "\x1b[1;34m(2/5) Patching Tensorflow's BUILD File...\x1b[0m\n"
sed -i 's/"crosstool_top": "\/\/external:android\/emscripten"/"crosstool_top": "@emsdk\/\/emscripten_toolchain:everything"/' /tensorflow/tensorflow/BUILD

cd /tflite-helper

printf "\x1b[1;34m(3/5) Building TFLite-Helper...\x1b[0m\n"
# INCREMENTAL BUILDS: Add '--output_user_root=/bazel-cache' before build
bazel build --config=wasm -c opt --copt='-O3' :tflite-helper

printf "\x1b[1;34m(4/5) Building TFLite-Helper With SIMD Support...\x1b[0m\n"
# INCREMENTAL BUILDS: Add '--output_user_root=/bazel-cache' before build
bazel build --config=wasm -c opt --copt='-O3' --copt='-msimd128' :tflite-helper-simd

printf "\x1b[1;34m(5/5) Exporting TFLite-Helper Builds...\x1b[0m\n"
tar xvf ./bazel-bin/tflite-helper --overwrite -C /tflite-helper-build
tar xvf ./bazel-bin/tflite-helper-simd --overwrite -C /tflite-helper-build
