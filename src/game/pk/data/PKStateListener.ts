class PKStateListener { //图腾类，会针对状态改变进行触发
    public owner:PKMonsterData|PKPosCardData;     //
    public endTime = 0;

    public type//监听类型

   // public id//唯一的ID，ID相同时，value值大的会生效
    //public value;


    constructor(obj?) {

    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

    }
    // 图腾移除时会调用的方法
    public onRemove(){

    }

}