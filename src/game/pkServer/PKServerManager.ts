class PKServerManager extends egret.EventDispatcher{
    private static _instance:PKServerManager;

    public static getInstance():PKServerManager {
        if (!this._instance)
            this._instance = new PKServerManager();
        return this._instance;
    }

    private webSocket:egret.WebSocket;

    private callBackFun = {};
    private callBackIndex = 1;


    public ctrler

    public connect(ctrler?){
        this.close();
        this.ctrler = ctrler || PVPCtrl.getInstance();
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

        var oo:any = JSON.parse(msg);
        if(oo.callbackid && oo.from == UM.gameid)//回调
        {
            this.callBackFun[oo.callbackid] && this.callBackFun[oo.callbackid](oo.msg);
            delete this.callBackFun[oo.callbackid];
        }

        //通用的处理
        switch(oo.head)
        {
            case GameEvent.pkserver.pair_success:
                this.ctrler.onPairSuccess(oo.msg);
                PairingUI.getInstance().hide();
                break;
            case GameEvent.pkserver.pk_info:
                this.onPKInfo(oo.msg);
                break;
            case GameEvent.pkserver.face:
                this.onFace(oo.msg);
                break;
        }



        this.dispatchEventWith(oo.head,false,oo.msg);
    }

    public onSocketOpen(){
        console.log('socket_open');
        this.ctrler.onConnect();

    }

    private onSocketClose(event:egret.Event):void {
        this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        console.log('socket_desconnect');
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
        MyWindow.Alert('无法连接对战服务器！')
        //this.isConnected = false;
        //if(this.reConnectTimes == 0){
        //    this.reConnect();
        //    return;
        //}
        //this.dispatchEventWith(Net.ON_ERROR);
    }


    public close(){
        this.ctrler = null;
        if(this.webSocket){
            this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.webSocket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.webSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
            this.webSocket.close();
            this.webSocket = null;
        }
    }

    public sendData(event,data,fun?){
        var oo:any = {
            head:event,
            gameid:UM.gameid,
            msg:data
        }
        if(fun)
        {
            var carrBackID = this.callBackIndex;
            this.callBackFun[carrBackID] = fun;
            oo.callbackid = carrBackID;
            this.callBackIndex ++;
        }
        var cmd = JSON.stringify(oo);
        this.webSocket.writeUTF(cmd);
        console.log('socketSend:'+cmd);
    }



    public onPKInfo(msg){
        PKData.getInstance().onPKInfo(msg)
    }

    public onFace(msg){

    }
}