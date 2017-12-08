class M6 extends MBase {
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        //溅射 30%
        var isToRight = user.x<target.x
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage = user.getVO().atkrage + 100;
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(newTarget == target)
                continue;
            if(isToRight)
            {
                if(user.x > newTarget.x)
                    continue
            }
            else if(user.x < newTarget.x)
                continue
            if(!newTarget.canBeAtk(user))
                continue;
            var tDes = Math.abs(user.x - newTarget.x);
            if(tDes > atkRage + newTarget.getVO().width/2)
                continue;

            var hp = this.getAtkHp(user,newTarget);
            newTarget.beAtkAction({hp:Math.ceil(hp*0.8)})
        }
        return true;
    }
}