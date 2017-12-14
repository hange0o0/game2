class M17 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        //{hp:hp,atker:user}
        data.atker.addHp(-user.getSkillValue(1,true));
    }
}