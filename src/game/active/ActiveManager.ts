class ActiveManager {
    private static _instance:ActiveManager;
    public static getInstance():ActiveManager {
        if (!this._instance)
            this._instance = new ActiveManager();
        return this._instance;
    }

    public level;
    public time;

    public like_time
    public like_obj
    public init(data){
         this.like_time = data.like_time || 0
         this.like_obj = data.like_obj || {}
    }

    public resetLike(){
        if(!DateUtil.isSameDay(this.like_time))
        {
            this.like_obj = {};
        }
    }
    public getLikeChoose(id){
        this.resetLike();
        return this.like_obj[id];
    }
}