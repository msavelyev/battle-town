#!/bin/bash -eu

readonly FILE=$1

function scale() {
  local file=$1
  local scale=$2

  local extension=${file##*.}
  local filename=${file%.*}

  local out="${filename}-${scale}x.${extension}"


  convert \
    "${file}" \
    -scale "${scale}00%" \
    "${out}"

  echo "created file ${out}"
}

for SCALE in 2 4
do
  scale "${FILE}" "${SCALE}"
done
