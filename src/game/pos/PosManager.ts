class PosManager {
    private static _instance:PosManager;
    public static getInstance():PosManager {
        if (!this._instance)
            this._instance = new PosManager();
        return this._instance;
    }

    public defendList
    public atkList

    public init(data){
          this.defendList = data.defend
          this.atkList = data.atk
    }
}