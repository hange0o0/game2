class InfoManager {
    private static _instance:InfoManager;
    public static getInstance():InfoManager {
        if (!this._instance)
            this._instance = new InfoManager();
        return this._instance;
    }

    public init(data){

    }
}