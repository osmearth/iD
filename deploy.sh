VERSION=`node -p "require('./osm-earth-version.json').version"`
docker pull mhart/alpine-node:10
docker pull mhart/alpine-node:base-10
cd dist && docker build . --compress --rm -t quay.io/osmearth/id:v$VERSION
docker push quay.io/osmearth/id:v$VERSION