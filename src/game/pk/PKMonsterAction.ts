class PKMonsterAction {
    private static instance:PKMonsterAction;

    public static getInstance() {
        if (!this.instance) this.instance = new PKMonsterAction();
        return this.instance;
    }

    private atkList = [];

    public addAtkList(data){
        this.atkList.push(data)
    }


    public actionAtk(t){
        for(var i=0;i<this.atkList.length;i++)
        {
            var data = this.atkList[i];
            if(data.endTime <= t)
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
                    MSBase.getData(user.mid).atk(user,target)
                }
                else
                {

                }

            }
        }
    }

    public atk(user:PKMonsterData,actionTime){
        var time = actionTime + user.getVO().atkcd;
        user.stopTime = Math.max(user.stopTime,time)
        MSBase.getData(user.mid).atkBefore(user,actionTime)
    }

    public skill(user:PKMonsterData,targets,actionTime){
        var time = actionTime +  user.getVO().atkcd;
        user.stopTime = Math.max(user.stopTime,time)

        this.atkList.push({
            type:'skill',
            user:user,
            targets:targets,
            actionTime:actionTime,
            endTime:time
        })

        PKData.getInstance().addVideo({
            type:'monster_skill_before',
            user:user,
            targets:targets,
            actionTime:actionTime,
            endTime:time
        })
    }
}