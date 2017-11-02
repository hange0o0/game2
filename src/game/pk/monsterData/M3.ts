class M3 extends MBase{
    constructor() {
        super();
    }
    private mvID = 29;

    public preload(){
        var AM = AniManager.getInstance();
        AM.preLoadMV(this.mvID)
    }

    public atkMV(user,target,actionTime,endTime){
        PKVideoCon.getInstance().playAniBetween(user.id,target.id,this.mvID)
    }
}