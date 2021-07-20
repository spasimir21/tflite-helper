FROM ubuntu:20.04

# Install Deps
RUN apt-get update && apt-get install curl git gpg -y

# Install Bazel
RUN curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor > bazel.gpg && \
  mv bazel.gpg /etc/apt/trusted.gpg.d/ && \
  echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list && \
  apt-get update && apt-get install bazel -y

# Install Python 3 alongside PIP
RUN apt-get install python3-pip -y && \
  update-alternatives --install /usr/bin/python python /usr/bin/python3 10

# Install Numpy
RUN python3 -m pip install numpy

# Clone Tensorflow and Mediapipe
RUN git clone https://github.com/tensorflow/tensorflow.git /tensorflow
RUN git clone https://github.com/google/mediapipe.git /mediapipe

COPY ./src /tflite-helper
ENTRYPOINT [ "/tflite-helper/build.sh" ]
