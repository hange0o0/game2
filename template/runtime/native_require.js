
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"libs/modules/socket/socket.js",
	"polyfill/promise.js",
	"bin-debug/game/pk/monsterData/MBase.js",
	"bin-debug/commont/BaseUI.js",
	"bin-debug/game/pk/skillData/SBase.js",
	"bin-debug/game/pk/skillData/S103.js",
	"bin-debug/commont/MyTool.js",
	"bin-debug/commont/MyWindow.js",
	"bin-debug/commont/Net.js",
	"bin-debug/commont/skin/BasePanel.js",
	"bin-debug/commont/skin/BookBG.js",
	"bin-debug/commont/ui/AlertUI.js",
	"bin-debug/commont/ui/CommonNumInput.js",
	"bin-debug/commont/ui/ConfirmUI.js",
	"bin-debug/commont/ui/TipsUI.js",
	"bin-debug/commont/ui/TopUI.js",
	"bin-debug/commont/ui/TouchTipsUI.js",
	"bin-debug/commont/VScrollerGroup.js",
	"bin-debug/db/MonsterVO.js",
	"bin-debug/db/PropVO.js",
	"bin-debug/db/SkillVO.js",
	"bin-debug/debug/DebugInput.js",
	"bin-debug/debug/DebugSkillItem.js",
	"bin-debug/debug/DebugSkillList.js",
	"bin-debug/debug/DebugUI.js",
	"bin-debug/debug/ScrollTest.js",
	"bin-debug/game/MonsterMV.js",
	"bin-debug/game/MonsterTestUI.js",
	"bin-debug/game/pk/data/PKData.js",
	"bin-debug/game/pk/data/PKMonsterData.js",
	"bin-debug/game/pk/data/PKPlayerData.js",
	"bin-debug/game/pk/data/PKPosCardData.js",
	"bin-debug/game/pk/data/PKTeamData.js",
	"bin-debug/game/pk/monsterData/M1.js",
	"bin-debug/game/pk/monsterData/M2.js",
	"bin-debug/game/pk/monsterData/M3.js",
	"bin-debug/game/pk/monsterData/M4.js",
	"bin-debug/game/pk/monsterData/M99.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/game/pk/PKBulletManager.js",
	"bin-debug/game/pk/PKCode.js",
	"bin-debug/game/pk/PKConfig.js",
	"bin-debug/game/pk/PKManager.js",
	"bin-debug/game/pk/PKMonsterAction.js",
	"bin-debug/game/pk/PKTool.js",
	"bin-debug/game/pk/result/PKFailUI.js",
	"bin-debug/game/pk/result/PKWinUI.js",
	"bin-debug/game/pk/skillData/S101.js",
	"bin-debug/game/pk/skillData/S102.js",
	"bin-debug/commont/Config.js",
	"bin-debug/commont/GameEvent.js",
	"bin-debug/game/pk/ui/PKCardItem.js",
	"bin-debug/game/pk/ui/PKCtrlCon.js",
	"bin-debug/game/pk/ui/PKingUI.js",
	"bin-debug/game/pk/ui/PKMonsterInfoItem.js",
	"bin-debug/game/pk/ui/PKMonsterInfoUI.js",
	"bin-debug/game/pk/ui/PKMonsterItem.js",
	"bin-debug/game/pk/ui/PKPosItem.js",
	"bin-debug/game/pk/ui/PKTopItem.js",
	"bin-debug/game/pk/ui/PKTopUI.js",
	"bin-debug/game/pk/ui/PKVideoCon.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/MainLoadingUI.js",
	"bin-debug/manager/AniManager.js",
	"bin-debug/manager/AppManager.js",
	"bin-debug/manager/CacheManager.js",
	"bin-debug/manager/DebugManager.js",
	"bin-debug/manager/DragManager.js",
	"bin-debug/manager/EgretManager.js",
	"bin-debug/manager/EventManager.js",
	"bin-debug/manager/GameManager.js",
	"bin-debug/manager/HelpManager.js",
	"bin-debug/manager/RedPointManager.js",
	"bin-debug/manager/SharedObjectManager.js",
	"bin-debug/manager/SoundManager.js",
	"bin-debug/manager/SyncManager.js",
	"bin-debug/manager/TickerManager.js",
	"bin-debug/manager/TimeManager.js",
	"bin-debug/manager/UserManager.js",
	"bin-debug/MsgingUI.js",
	"bin-debug/platform/FromManager.js",
	"bin-debug/platform/QunHeiManager.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/util/ArrayUtil.js",
	"bin-debug/util/BadWords.js",
	"bin-debug/util/BadWordsFilter.js",
	"bin-debug/util/Base64.js",
	"bin-debug/util/DateUtil.js",
	"bin-debug/util/LoadingFile.js",
	"bin-debug/util/LoadingQueue.js",
	"bin-debug/util/md5.js",
	"bin-debug/util/NumberUtil.js",
	"bin-debug/util/ObjectUtil.js",
	"bin-debug/util/PopUpManager.js",
	"bin-debug/util/ShapeObject.js",
	"bin-debug/util/StringUtil.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "fixedWidth",
		contentWidth: 640,
		contentHeight: 960,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};