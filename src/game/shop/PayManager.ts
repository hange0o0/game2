class PayManager {
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }
}