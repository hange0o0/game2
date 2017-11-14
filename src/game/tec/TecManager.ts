class TecManager {
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }
}