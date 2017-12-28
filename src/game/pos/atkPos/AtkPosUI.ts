class AtkPosUI extends BasePosUI {

    private static _instance: AtkPosUI;
    public static getInstance(): AtkPosUI {
        if(!this._instance)
            this._instance = new AtkPosUI();
        return this._instance;
    }


    public type = 'atk'
    public constructor() {
        super();
    }


}