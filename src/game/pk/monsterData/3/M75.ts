class M75 extends MBase {
    constructor() {
        super();
    }

    public bulleteID = 1;

    public initMonster(user:PKMonsterData){
        user.atkX = 80
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
        var PD = PKData.getInstance();
        var rd = this.bulleteID
        this.bulleteID ++;
        var bullet = PKBulletManager.getInstance().createBulletLine(userItem,targetItem,actionTime,endTime,'pk_arrow_1_png',()=>{

            var arr = PD.getMonsterByNoTeam(user.getOwner().teamData);
            var atkrage = 0
            for(var i=0;i<arr.length;i++)
            {
                var targetX = arr[i];
                if(!targetX.skillTemp[75])
                    targetX.skillTemp[75] = {};
                if(!targetX.skillTemp[75][rd] && Math.abs(bullet.x - targetX.x)<=atkrage + targetX.getVO().width/2)
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

    protected sendAtkBefore(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'atk_before',
            model:this,
            stopTestDie:true,
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }
}