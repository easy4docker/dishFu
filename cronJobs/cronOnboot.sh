echo $(date -u) "Ran cronOnboot" 
cd /var/app && npm install
npm start &
