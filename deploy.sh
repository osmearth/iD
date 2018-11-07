#docker build
docker pull mhart/alpine-node:10
docker pull mhart/alpine-node:base-10
cd dist && docker build . --compress --rm -t quay.io/osmearth/id
docker push quay.io/osmearth/id
