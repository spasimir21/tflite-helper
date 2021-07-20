load("@org_tensorflow//tensorflow/lite:build_def.bzl", "tflite_linkopts")

cc_binary(
  name = "tflite-helper",
  srcs = ["main.cpp"],
  linkopts = tflite_linkopts() + [
    "-O3",
    "-s ENVIRONMENT='web'",
    "-s ALLOW_MEMORY_GROWTH=1",
    "-s USE_PTHREADS=0",
    "-s MODULARIZE=1",
    "-s EXPORT_ES6=1",
    "-s EXPORT_NAME=createTFLiteHelperModule"
  ],
  deps = [
    "@org_tensorflow//tensorflow/lite:framework",
    "@org_tensorflow//tensorflow/lite:tflite_with_xnnpack",
    "@org_tensorflow//tensorflow/lite/kernels:builtin_ops",
    "@org_mediapipe//mediapipe/util/tflite/operations:transpose_conv_bias"
  ]
)

cc_binary(
  name = "tflite-helper-simd",
  srcs = ["main.cpp"],
  linkopts = tflite_linkopts() + [
    "-O3",
    "-s ENVIRONMENT='web'",
    "-s ALLOW_MEMORY_GROWTH=1",
    "-s USE_PTHREADS=0",
    "-s MODULARIZE=1",
    "-s EXPORT_ES6=1",
    "-s EXPORT_NAME=createTFLiteHelperSIMDModule"
  ],
  deps = [
    "@org_tensorflow//tensorflow/lite:framework",
    "@org_tensorflow//tensorflow/lite:tflite_with_xnnpack",
    "@org_tensorflow//tensorflow/lite/kernels:builtin_ops",
    "@org_mediapipe//mediapipe/util/tflite/operations:transpose_conv_bias"
  ]
)
