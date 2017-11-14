class SlaveManager {
    private static _instance:SlaveManager;
    public static getInstance():SlaveManager {
        if (!this._instance)
            this._instance = new SlaveManager();
        return this._instance;
    }
}