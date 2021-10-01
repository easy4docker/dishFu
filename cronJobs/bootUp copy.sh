echo $(date -u) "Ran cronOnboot" 
mkdir -p /var/dishfuPDF/input/
mkdir -p /var/dishfuPDF/output/
mkdir -p /var/dishfuPDF/done/
mkdir -p /var/dishfuPDF/failed/
cd /var/app 
# rm -fr /var/app/node_modules/
npm audit fix --force
#npm audit fix
npm install
# npm start &
#cron start &
#echo "==== boot up ==== $(date -u ==="
npm start
