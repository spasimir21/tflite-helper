DOCKER_USERNAME=tflite-helper # Change this

printf "\x1b[1;32m(1/2) Building Docker Image...\x1b[0m\n"
docker build . -t $DOCKER_USERNAME/tflite-helper

clear

printf "\x1b[1;32m(2/2) Running Docker Container...\x1b[0m\n"
# INCREMENTAL BUILDS: Add '-v $PWD/.bazel-cache:/bazel-cache'
docker run --rm -it -v $PWD/dist:/tflite-helper-build $DOCKER_USERNAME/tflite-helper

# Make a beep
printf '\x07'

read -p "Press any key to continue..."
