class PropManager {
    private static _instance:PropManager;
    public static getInstance():PropManager {
        if (!this._instance)
            this._instance = new PropManager();
        return this._instance;
    }

    public init(data){

    }
}