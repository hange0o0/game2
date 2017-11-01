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
            if(data.endTime <= t)  //事件生效
            {

                this.atkList.splice(i,1);
                i--;

                var user:PKMonsterData = data.user;
                var target:PKMonsterData = data.target;

                //判断攻击是否生效
                if(target && target.die)
                    continue;
                if(data.targets)
                {
                    for(var i=0;i<data.targets.length;i++)
                    {
                         if(data.targets[i] && data.targets[i].die)
                         {
                             data.targets.splice(i,1);
                             i--
                         }
                    }
                    if(data.targets.length == 0)
                        continue;
                }


                if(data.type == 'atk_before')   //攻击产生
                {
                    if(user.die)
                        continue;
                    data.model.atkAction(user,target,t)
                }
                else if(data.type == 'skill_before')   //攻击产生
                {
                    if(user.die)
                        continue;
                    data.model.skillAction(user,data.targets,t)
                }
                else if(data.type == 'atk')  //攻击生效
                {
                    MSBase.getData(user.mid).atk(user,target)
                }
                else if(data.type == 'skill')  //攻击生效
                {
                    MSBase.getData(user.mid).skill(user,data.targets)
                    user.lastSkill = data.endTime;
                }
            }
        }
    }

    public atk(user:PKMonsterData,actionTime){
        var time = actionTime + user.getVO().atkcd;
        user.stopTime = Math.max(user.stopTime,time)

        PKData.getInstance().addVideo({   //攻击动画开始
            type:PKConfig.VIDEO_MONSTER_ATK_BEFORE,
            user:user
        })

        MSBase.getData(user.mid).atkBefore(user,actionTime)
    }

    public skill(user:PKMonsterData,actionTime){
        var time = actionTime + user.getVO().atkcd;
        user.stopTime = Math.max(user.stopTime,time)

        PKData.getInstance().addVideo({   //攻击动画开始
            type:PKConfig.VIDEO_MONSTER_ATK_BEFORE,
            user:user
        })

        MSBase.getData(user.mid).skillBefore(user,actionTime)

        console.log('skill')
    }
}