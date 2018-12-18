class ActiveManager {
    private static _instance:ActiveManager;
    public static getInstance():ActiveManager {
        if (!this._instance)
            this._instance = new ActiveManager();
        return this._instance;
    }

    public level;
    public time;

    public task;
    public first_pay;
    public rmb_award;

    public like_time
    public like_obj

    public constructor() {
        this.like_obj = SharedObjectManager.getInstance().getMyValue('like_obj') || {}
        this.like_time = this.like_obj.time || 0
    }


    public init(data){
        this.task = data.task
        this.first_pay = data.first_pay
        this.rmb_award = data.rmb_award || 0
    }

    public setLike(id,like)
    {
        this.resetLike();
        this.like_obj[id] = like;
        this.like_time = this.like_obj.time = TM.now();
        SharedObjectManager.getInstance().setMyValue('like_obj',this.like_obj);
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