#! /bin/sh
FULLDIR=$(PWD)
ROOTDIR=$(dirname $(dirname $(PWD)))

cd ${FULLDIR}
mkdir -p ${FULLDIR}/app/config
cp ${ROOTDIR}/config/app/mysql.json ${FULLDIR}/app/config/mysql.json

docker stop dishfu-container && docker rm dishfu-container  && docker image rm dishfu-image
# ---  && docker image prune -f
docker image build --file ${FULLDIR}/Dockerfile -t dishfu-image .

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

docker run -v "${FULLDIR}/cronJobs":/var/cronJobs -v "${FULLDIR}/app":/var/app -v "${FULLDIR}/log":/var/log \
    -v "${ROOTDIR}/_shared/PDF":/var/_shared/PDF  -p 3001:3000  \
    --network network_dishfu --restart on-failure \
    --name dishfu-container -d dishfu-image