class LoginUI extends game.BaseWindow {
    private static instance:LoginUI;
    public static getInstance() {
        if (!this.instance) this.instance = new LoginUI();
        return this.instance;
    }

    private logGroup: eui.Group;
    private nameText: eui.TextInput;
    private passwordText: eui.TextInput;
    private btnGroup: eui.Group;
    private registerBtn: eui.Button;
    private loginBtn: eui.Button;


    public debugStep = 0;
    public noMV: boolean = true;
    public constructor() {
        super();
        this.skinName = "LoginUISkin";
        this.canBGClose = false;
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.loginBtn, this.onLogin);
        this.addBtnEvent(this.registerBtn, this.onRegister);


        this.nameText.text = ''

    }

    public show(){
        MainLoadingUI.getInstance().hide();
        super.show();
    }


    public onChangeUser(){
        var LM = LoginManager.getInstance();
        if(!this.stage)
        {
            this.show();
            return;
        }
        LoginManager.getInstance().quickPassword = null;
        this.logGroup.visible = true
    }

    public onShow(){
        var LM = LoginManager.getInstance();
        this.passwordText.text = '';
        if(LM.lastUser) {
            this.nameText.text = LM.lastUser;
        }
    }

    private onLogin(){
        var LM = LoginManager.getInstance();
        var name = this.nameText.text;

        var psw = this.passwordText.text;
        if(!Config.isDebug && !LM.testName(name))
        {
            return;
        }
        if(!Config.isDebug && !LM.testPassword(psw))
        {
            return;
        }
        LM.login(name,psw || '666');
    }

    private onRegister(){
        if(this.nameText.text == 'debug')
        {
            if(this.passwordText.text == 'debug')
            {
                this.debugStep ++;
                this.passwordText.text = 'debug' + this.debugStep
            }
            if(this.debugStep == 1 && !this.passwordText.text)
            {
                SharedObjectManager.getInstance().setValue('debug_open',true)
                this.nameText.text = ''
                this.passwordText.text = ''
                Config.isDebug = true;
            }
            if(this.debugStep)
                return
        }
        RegisterUI.getInstance().show();
    }
}