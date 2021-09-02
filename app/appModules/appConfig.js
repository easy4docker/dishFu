module.exports = class AppConfig {
    constructor(app, server) {
        
        this.server = server;
        this.app = app; 
        this.setupConfig();
        this.setupCors();  
        this.loadSocketIoServer();

    }
    setupConfig() {
        const fs = require('fs'), path = require('path');
        this.app.set('config', {
            root: path.join(__dirname, '..'),
            dataFolder: path.join(__dirname, '../../userData')
          });

        fs.mkdir(this.app.get('config').dataFolder, (err) => {});
    }
    setupCors() {
        this.app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        }); 
    }
    loadSocketIoServer() {
        const io = require('socket.io')(this.server, { cors: { origin: '*', methods: ["GET", "POST"] } });
        // io.on('connection', () => {  /* … */ });
        const chat = io.of("/dishFu");
        chat.on("connection", (socket) => {
            socket.on('transfer', (target_socket, from_socket, data) => {
                chat.to('/dishFu#' + target_socket).emit('afterTransfer', from_socket, data);
            });
            socket.on('forceDisconnect', (target_socket, from_socket, data) => {
                socket.disconnect();
            });
            socket.on("disconnect", () => {
            });
        });
    }
}
