class HangManager {
    private static _instance:HangManager;
    public static getInstance():HangManager {
        if (!this._instance)
            this._instance = new HangManager();
        return this._instance;
    }
}