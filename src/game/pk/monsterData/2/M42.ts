class M42 extends MBase {
    constructor() {
        super();
    }

    public onDie(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByNoTeam(user.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        var hp = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            if(!targetX.beSkillAble())
                continue;
            var des = Math.abs(user.x - targetX.x);
            if(des<=atkrage + targetX.getVO().width/2)
            {
                targetX.beAtkAction({hp:hp})
            }
        }
    }
}