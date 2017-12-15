class M14 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        //{hp:hp,atker:user}
        if(data.atker.getVO().atkrage < 30)
            data.atker.addHp(-Math.ceil(data.hp*user.getSkillValue(1)/100*user.getAtkRate(data.atker)));
    }
}