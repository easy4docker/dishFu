echo $(date -u) "Ran cronOnboot" 
mkdir -p /var/dishfuPDF/input/
mkdir -p /var/dishfuPDF/output/
mkdir -p /var/dishfuPDF/done/
mkdir -p /var/dishfuPDF/failed/
cd /var/app && npm install
# npm start &
# cron start
npm start