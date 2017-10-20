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

                var hp = Math.floor(user.atk * (1-target.def/100));
                if(hp < 1)
                    hp = 1;
                target.beAtkAction({hp:hp})
                user.atkAction({hp:hp})
            }
        }
    }

    public atk(user:PKMonsterData,target:PKMonsterData,actionTime){
        var time = actionTime + 300;
        this.atkList.push({
            user:user,
            target:target,
            actionTime:actionTime,
            time:time
        })
    }
}