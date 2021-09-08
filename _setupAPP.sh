#! /bin/sh
FULLDIR=$(pwd)
ROOTDIR=$(dirname $(dirname $(pwd)))

cd ${FULLDIR}
mkdir -p ${FULLDIR}/app/config
cp ${ROOTDIR}/config/app/mysql.json ${FULLDIR}/app/config/mysql.json

docker stop dishfu-app-container && docker rm dishfu-app-container  && docker image rm dishfu-app-image
# ---  && docker image prune -f
docker image build --file ${FULLDIR}/Dockerfile -t dishfu-app-image .

MAIN_NET="33.33.33"
MAIN_IP="33.33.33.254"
docker network create \
    --driver=bridge \
    --subnet=${MAIN_NET}.0/16 \
    --ip-range=${MAIN_NET}.0/24 \
    --gateway=${MAIN_IP} \
    network_dishfu &> /dev/null

mkdir -p ${ROOTDIR}/_shared/PDF/input
mkdir -p ${ROOTDIR}/_shared/PDF/output
mkdir -p ${ROOTDIR}/_shared/PDF/done
mkdir -p ${ROOTDIR}/_shared/PDF/failed

docker run -v "${FULLDIR}/cronJobs":/var/cronJobs -v "${FULLDIR}/app":/var/app -v "${FULLDIR}/logApp":/var/log \
    -v "${ROOTDIR}/_shared/PDF":/var/_shared/PDF  -p 3001:3000  \
    --network network_dishfu --restart on-failure \
    --name dishfu-app-container -d dishfu-app-image