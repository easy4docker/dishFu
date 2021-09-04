#! /bin/sh
BASEDIR=$(dirname "$0")
ROOTDIR="$(PWD)"
FULLDIR="$(PWD)/${BASEDIR}"

cd ${FULLDIR}

docker stop dishfu-container && docker rm dishfu-container  && docker image rm dishfu-image && docker image prune -f
docker image build --file ${FULLDIR}/Dockerfile -t dishfu-image .

MAIN_NET="33.33.33"
MAIN_IP="33.33.33.254"
docker network create \
    --driver=bridge \
    --subnet=${MAIN_NET}.0/16 \
    --ip-range=${MAIN_NET}.0/24 \
    --gateway=${MAIN_IP} \
    network_dishfu &> /dev/null

docker run -v "${FULLDIR}/cronJobs":/var/cronJobs -v "${FULLDIR}/app":/var/app -v "${FULLDIR}/log":/var/log \
    -v ${ROOTDIR}/_services/dishfuPDF/_cronPDFData:/var/dishfuPDF  -p 3001:3000  \
    --network network_dishfu --restart on-failure \
    --name dishfu-container -d dishfu-image