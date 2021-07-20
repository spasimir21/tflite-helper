#include "mediapipe/util/tflite/operations/transpose_conv_bias.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"
#include <emscripten.h>
#include <memory>
#include <cstdio>

struct TFLiteModel {
  char *buffer;
  int size;
  std::unique_ptr<tflite::Interpreter> interpreter;
};

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  int allocateModel(int size) {
    TFLiteModel *model = new TFLiteModel;
    model->buffer = new char[size];
    model->size = size;
    return (int) model;
  }

  EMSCRIPTEN_KEEPALIVE
  int getModelBufferOffset(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return (int) model->buffer;
  }

  EMSCRIPTEN_KEEPALIVE
  int loadModel(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;

    tflite::ops::builtin::BuiltinOpResolver op_resolver;
    op_resolver.AddCustom("Convolution2DTransposeBias", mediapipe::tflite_operations::RegisterConvolution2DTransposeBias());
    // Register other custom operations here

    std::unique_ptr<tflite::FlatBufferModel> flat_model = tflite::FlatBufferModel::BuildFromBuffer(model->buffer, model->size);
    if (flat_model == nullptr) return -1;

    tflite::InterpreterBuilder builder(*flat_model, op_resolver);
    builder(&(model->interpreter));
    if (model->interpreter == nullptr) return -1;

    return model->interpreter->AllocateTensors() == 0 ? 0 : -1;
  }

  EMSCRIPTEN_KEEPALIVE
  int getInputTensorCount(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return model->interpreter->inputs().size();
  }

  EMSCRIPTEN_KEEPALIVE
  int getInputTensorId(int modelOffset, int index) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return model->interpreter->inputs().at(index);
  }

  EMSCRIPTEN_KEEPALIVE
  int getOutputTensorCount(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return model->interpreter->outputs().size();
  }

  EMSCRIPTEN_KEEPALIVE
  int getOutputTensorId(int modelOffset, int index) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return model->interpreter->outputs().at(index);
  }

  EMSCRIPTEN_KEEPALIVE
  int getTensorType(int modelOffset, int tensorId) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return (int) model->interpreter->tensor(tensorId)->type;
  }

  EMSCRIPTEN_KEEPALIVE
  int getTensorOffset(int modelOffset, int tensorId) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return (int) model->interpreter->tensor(tensorId)->data.data;
  }

  EMSCRIPTEN_KEEPALIVE
  int getTensorDimensionCount(int modelOffset, int tensorId) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return (int) model->interpreter->tensor(tensorId)->dims->size;
  }

  EMSCRIPTEN_KEEPALIVE
  int getTensorDimension(int modelOffset, int tensorId, int index) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return (int) model->interpreter->tensor(tensorId)->dims->data[index];
  }

  EMSCRIPTEN_KEEPALIVE
  int invokeModel(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    return model->interpreter->Invoke();
  }

  EMSCRIPTEN_KEEPALIVE
  void freeModel(int modelOffset) {
    TFLiteModel *model = (TFLiteModel*) modelOffset;
    delete model->buffer;
    delete model;
  }
}
