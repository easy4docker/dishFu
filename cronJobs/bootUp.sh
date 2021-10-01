echo $(date -u) "Ran Start CMD" 
cd /var/app 
# rm -fr /var/app/node_modules/
npm audit fix --force
#npm audit fix
npm install
# npm start &
#cron start &
#echo "==== boot up ==== $(date -u ==="
cron start
npm start ./bin/www
