# cd /var/app && npm install && npm start &
echo $(date -u) "Ran cronMin" 
cd /var/cronJobs/auto-approve && npm install && npm start