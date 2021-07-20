@echo off

REM Change this
set docker-username=tflite-helper

printf "\x1b[1;32m(1/2) Building Docker Image...\x1b[0m\n"
docker build . -t %docker-username%/tflite-helper

clear

printf "\x1b[1;32m(2/2) Running Docker Container...\x1b[0m\n"
REM INCREMENTAL BUILDS: Add '-v %cd%\\.bazel-cache:/bazel-cache'
docker run --rm -it -v %cd%\\dist:/tflite-helper-build %docker-username%/tflite-helper

REM Make a beep
printf '\x07'

pause
