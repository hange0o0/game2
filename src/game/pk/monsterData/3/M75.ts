class M75 extends MBase {
    constructor() {
        super();
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 1000;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = {
            x: user.x + user.atkRota * user.getSkillValue(1),
            y:user.y
        }
        var rd = Math.floor(Math.random()*1000000)
        var bullet = PKBulletManager.getInstance().createBulletLine(userItem,targetItem,actionTime,endTime,9,()=>{

            var PD = PKData.getInstance();
            var arr = PD.getMonsterByNoTeam(user.getOwner().teamData.enemy);
            var atkrage = 0
            for(var i=0;i<arr.length;i++)
            {
                var targetX = arr[i];
                if(!targetX.skillTemp[75])
                    targetX.skillTemp[75] = {};
                var des = Math.abs(bullet.x - targetX.x);
                if(!targetX.skillTemp[75][rd] && des<=atkrage + targetX.getVO().width/2)
                {
                    targetX.skillTemp[75][rd] = true;
                    var hp = this.getAtkHp(user,targetX);
                    targetX.beAtkAction({hp:hp,atker:user})
                }
            }
        })
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        return false;
    }
}