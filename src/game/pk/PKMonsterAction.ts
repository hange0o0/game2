class PKMonsterAction {
    private static instance:PKMonsterAction;

    public static getInstance() {
        if (!this.instance) this.instance = new PKMonsterAction();
        return this.instance;
    }

    private atkList = [];
    public actionAtk(t){
        for(var i=0;i<this.atkList.length;i++)
        {
            var data = this.atkList[i];
            if(data.time <= t)
            {

                this.atkList.splice(i,1);
                i--;

                var user:PKMonsterData = data.user;
                var target:PKMonsterData = data.target;

                //判断攻击是否生效
                if(user.die)
                    continue;

                if(target.die)
                    continue;

                if(data.type == 'atk')
                {
                    var hp = Math.floor(user.atk * (1-target.def/100));
                    if(hp < 1)
                        hp = 1;
                    target.beAtkAction({hp:hp})
                    user.atkAction({hp:hp})
                    console.log('atk')
                }
                else
                {

                }

            }
        }
    }

    public atk(user:PKMonsterData,target:PKMonsterData,actionTime){
        var time = actionTime + 300;
        user.stopTime = Math.max(user.stopTime,time + 100)

        this.atkList.push({
            type:'atk',
            user:user,
            target:target,
            actionTime:actionTime,
            time:time
        })

        PKData.getInstance().addVideo({
            type:'monster_atk_before',
            data:user,
            target:target,
            time:time
        })
    }

    public skill(user:PKMonsterData,targets,actionTime){
        var time = actionTime + 300;
        user.stopTime = Math.max(user.stopTime,time + 100)

        this.atkList.push({
            type:'skill',
            user:user,
            targets:targets,
            actionTime:actionTime,
            time:time
        })

        PKData.getInstance().addVideo({
            type:'monster_skill_before',
            data:user,
            targets:targets,
            time:time
        })
    }
}