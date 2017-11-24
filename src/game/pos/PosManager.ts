class PosManager {
    private static _instance:PosManager;
    public static getInstance():PosManager {
        if (!this._instance)
            this._instance = new PosManager();
        return this._instance;
    }

    public maxNum = 5;
    public defendList
    public atkList

    public init(data){
          this.defendList = data.def_list.list
          this.atkList = data.atk_list.list
    }
}