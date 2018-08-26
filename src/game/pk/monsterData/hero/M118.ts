class M118 extends MBase{
    constructor() {
        super();
    }

    public onDie(user:PKMonsterData){
        if(!user.skillTemp[118])
        {
            var num = user.level + 1;
            for(var i=0;i<num;i++)
            {
                var PD = PKData.getInstance();
                var mid = 118;
                var owner = PD.getPlayer(user.owner);
                var atkRota = owner.teamData.atkRota;
                var mData = {
                    force:owner.force,
                    mid:mid,
                    owner:user.owner,
                    atkRota:atkRota,
                    x:user.x - 10 + PD.random()*20,
                    y:-30 + Math.random()*60,
                    level:user.level,
                    actionTime:PD.actionTime
                }
                var monster = PD.addMonster(mData);
                monster.skillTemp[118] = 1;
            }
        }
        else if(user.skillTemp[118] == 1 && user.level >= 5)
        {
            for(var i=0;i<2;i++)
            {
                var PD = PKData.getInstance();
                var mid = 118;
                var owner = PD.getPlayer(user.owner);
                var atkRota = owner.teamData.atkRota;
                var mData = {
                    force:<any>(owner.force/2),
                    mid:mid,
                    owner:user.owner,
                    atkRota:atkRota,
                    x:user.x - 10 + PD.random()*20,
                    y:-30 + Math.random()*60,
                    level:user.level,
                    actionTime:PD.actionTime
                }
                var monster = PD.addMonster(mData);
                monster.skillTemp[118] = 2;
            }
        }


    }
}