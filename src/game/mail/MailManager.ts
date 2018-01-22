class MailManager {
    private static _instance:MailManager;

    public static getInstance():MailManager {
        if (!this._instance)
            this._instance = new MailManager();
        return this._instance;
    }

    //1:成为主人
    //2:抢奴隶
    public level;
    public time;

    public init(data) {
        this.level = data.level
        this.time = data.time
    }
}