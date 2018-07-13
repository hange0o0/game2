class PKServerManager {
    private static _instance:PKServerManager;

    public static getInstance():PKServerManager {
        if (!this._instance)
            this._instance = new PKServerManager();
        return this._instance;
    }

    private webSocket:egret.WebSocket;

    public connect(){
        this.close();
        var sock = this.webSocket = new egret.WebSocket();
        sock.addEventListener( egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this );
        sock.addEventListener( egret.Event.CONNECT, this.onSocketOpen, this );
        sock.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        sock.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
        sock.connect(Config.pkServerHost, Config.pkServerPose);
    }

    public onReceiveMessage(){
        var msg = this.webSocket.readUTF();
        console.log('socketReceive:'+msg);
    }

    public onSocketOpen(){
        console.log('socket_open');
        this.sendData('hello',Math.random())
    }

    private onSocketClose(event:egret.Event):void {
        this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);

        //if(DEBUG) console.log(event.type);
        //this.isConnected = false;
        //if(this.reConnectTimes == 0){
        //    this.reConnect();
        //    return;
        //}
        //this.dispatchEventWith(Net.ON_ERROR);
    }

    private onIOError(event:egret.IOErrorEvent):void {
        if(DEBUG) console.log(event.type);
        //this.isConnected = false;
        //if(this.reConnectTimes == 0){
        //    this.reConnect();
        //    return;
        //}
        //this.dispatchEventWith(Net.ON_ERROR);
    }


    public close(){
        if(this.webSocket){
            this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.webSocket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.webSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
            this.webSocket.close();
            this.webSocket = null;
        }
    }

    public sendData(event,data){
        var cmd = JSON.stringify({
            head:event,
            data:data
        })
        this.webSocket.writeUTF(cmd);
        console.log('socketSend:'+cmd);
    }
}