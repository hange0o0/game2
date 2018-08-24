class S242 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var addValue = user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var type = ''
            //[生命上限，攻击，移动，防御]
            switch(PD.rand(1,4))
            {
                case 1:
                    var v = Math.ceil(addValue/100* target.baseHp)
                    target.maxHp += v
                    target.addHp(v)
                    type = 'hp+'
                    break;
                case 2:
                    var v = Math.ceil(addValue/100* target.baseAtk)
                    target.atk += v
                    type = 'atk+'
                    break;
                case 3:
                    target.addSpeed += addValue
                    type = 'speed+'
                    break;
                case 4:
                    target.def += addValue
                    type = 'def+'
                    break;

            }
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:[type]
            })
        }
        return arr;
    }
}