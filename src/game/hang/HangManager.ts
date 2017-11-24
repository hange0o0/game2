class HangManager {
    private static _instance:HangManager;
    public static getInstance():HangManager {
        if (!this._instance)
            this._instance = new HangManager();
        return this._instance;
    }

    public level;
    public time;
    public init(data){
        this.level = data.level
        this.time = data.time
    }
}