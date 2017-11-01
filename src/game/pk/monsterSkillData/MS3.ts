class MS3 extends MSBase{
    constructor() {
        super();
    }
    private mvID = 29;

    public preload(){
        var AM = AniManager.getInstance();
        AM.preLoadMV(AM.getMVKey(this.mvID))
    }

    public atkMV(item:PKMonsterItem,videoData){
        PKVideoCon.getInstance().playAniBetween(videoData.user.id,videoData.target.id,this.mvID)
    }
}