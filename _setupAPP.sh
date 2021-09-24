#! /bin/sh
FULLDIR=$(pwd)
ROOTDIR=$(dirname $(dirname $(pwd)))

cd ${FULLDIR}
#mkdir -p ${FULLDIR}/app/config
mkdir -p ${FULLDIR}/logApp

# cp -R ${ROOTDIR}/config/app/mysql.json ${FULLDIR}/app/config/mysql.json
# cp -R ${ROOTDIR}/config/app/* ${FULLDIR}/app/config/

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


docker run -v "${FULLDIR}/cronJobs":/var/cronJobs -v "${FULLDIR}/app":/var/app \
    -v "${FULLDIR}/logApp":/var/log \
    -v ${ROOTDIR}/config/app:/var/_config \
    -v ${ROOTDIR}/_ROOTENV:/var/_ROOTENV \
    -v ${ROOTDIR}/_appData:/var/_appData \
    -p 3001:3000  \
    --network network_dishfu --restart on-failure \
    --name dishfu-app-container -d dishfu-app-image