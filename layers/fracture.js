const fractureEquiupments = [
    {
        EquipmentTitle: "Element Capacity",//不要拿数字打头
        EffectDisplay : "Each adds Element Essence Capacity by 0.5",//这个看不懂就砍死你丫的
        shapeArray: [0],//相对于中心点的grid id偏移量数组，表示这个装备的形状
        Color:"#FFE4B5",//颜色
        UpgradeTo:3,//升级到的目标装备的id,没有的话填负数
        defaultPosition:303,//在商店显示时默认中心点的grid id
        CanBuyProgress: 0,//解锁池
        BasePrize: new Decimal(9.5),//baseprice*, 基础价格
        UpgradeCost: new Decimal(30),//花费多少数目来升级
        UpgradeCurrency: 'player.fracture.ElementEssence',//与上一条配合使用, 花费的货币种类
        //UpgradeReq                //需求多少数目的货币来升级
        //UpgradeReqCurrency        //与上一条配合使用, 需求的货币种类
        //UpgradeEquipNum           //需求多少个装备来升级
                                    //上述升级相关字段如果不需要直接不用写, 轮子甚至不会读到undefined
        UpgradeType: ['cost'],      //升级种类, 目前可以传入 cost, require, equipnum, none
    },
    {
        EquipmentTitle: "Bottled Growth",
        EffectDisplay : "Each Boosts Glowing Roses gain by x2",
        shapeArray: [0,1],
        Color:"#ffe6f6",
        UpgradeTo:4,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(10),
        UpgradeCost: new Decimal(50),
        UpgradeCurrency: 'player.fracture.ElementEssence',
        UpgradeType: ['cost'],
    },
    {
        EquipmentTitle: "Enjoyment Puzzle",
        EffectDisplay : "Each boosts Fragment generation 750x",
        shapeArray: [0,100],
        Color:"#AAAAAA",
        UpgradeTo:5,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(10),
        UpgradeCost: new Decimal(50),
        UpgradeCurrency: 'player.fracture.ElementEssence',
        UpgradeType: ['cost'],
    },
    {
        EquipmentTitle: "Element Capacity+",
        EffectDisplay : "Each adds Element Essence Capacity by 1",
        shapeArray: [0],
        Color:"#FFE4B5",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(40),
        //UpgradeCost: new Decimal(0),
        //UpgradeCurrency: null,
        UpgradeType: ['none'],
    },
    {
        EquipmentTitle: "Bottled Growth+",
        EffectDisplay : "Each Boosts Glowing Roses gain by x2",
        shapeArray: [0],
        Color:"#ffe6f6",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(50),
        //UpgradeCost: new Decimal(0),
        //UpgradeCurrency: null,
        UpgradeType: ['none'],
    },
    {
        EquipmentTitle: "Enjoyment Puzzle+",
        EffectDisplay : "Each boosts Fragment generation 750x",
        shapeArray: [0],
        Color:"#AAAAAA",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(55),
        UpgradeType: ['none'],
    },
    {
        EquipmentTitle: "Compute Matrix",
        EffectDisplay : "Each Boosts Research Power gain by x200",
        shapeArray: [0,-100,1],
        Color:"#00bdf9",
        UpgradeTo:8,
        defaultPosition:303,
        CanBuyProgress: 1,
        BasePrize: new Decimal(15),
        UpgradeCost: new Decimal(1e150),
        UpgradeCurrency: 'player.lab.points',
        UpgradeType: ['cost'],
    },
    {
        EquipmentTitle: "Essence Collector",
        EffectDisplay : "Each Boosts Research Element Essence gain by x1.05",
        shapeArray: [0,-1,100],
        Color:"#9dfe6b",
        UpgradeTo:9,
        defaultPosition:303,
        CanBuyProgress: 1,
        BasePrize: new Decimal(15),
        UpgradeCost: new Decimal(50),
        UpgradeCurrency: 'player.fracture.ElementEssence',
        UpgradeType: ['cost'],
    },
    {
        EquipmentTitle: "Compute Matrix+",
        EffectDisplay : "Each Boosts Research Power gain by x250",
        shapeArray: [0,-100,1],
        Color:"#00bdf9",
        UpgradeTo:8,
        defaultPosition:303,
        CanBuyProgress: 1,
        BasePrize: new Decimal(50),
        UpgradeType: ['none'],
    },
    {
        EquipmentTitle: "Essence Collector+",
        EffectDisplay : "Each Boosts Research Element Essence gain by x1.1",
        shapeArray: [0,-1,100],
        Color:"#9dfe6b",
        UpgradeTo:9,
        defaultPosition:303,
        CanBuyProgress: 1,
        BasePrize: new Decimal(50),
        UpgradeType: ['none'],
    },
    {
        EquipmentTitle: "Genesis Overload",
        EffectDisplay : "Push Memory softcap by x1e100, but reduce Element Essence gain to x0.01",
        shapeArray: [0,1,100,101],
        Color:"#c939db",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 1,
        BasePrize: new Decimal(150),
        UpgradeType: ['none'],
    },
];

addLayer("fracture", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        gridcol:2,
        gridrow:2,
        CheckingEquipmentId:-1,
        CheckPage:0,
        TempEquipmentId:-1,
        EquipmentsHold:Array(fractureEquiupments.length).fill(0),
        EquipmentsDiscovered:Array(fractureEquiupments.length).fill(false),//这玩意从一开始就得keep
        EquipmentsEquiped:[],               //EquipNum 和 PositionId
        DeEquipt:false,                     //是否是卸载/装载模式
        BuyProgress:0,                      //这个数值随着里程碑的增加而增加<--可能还有升级
        BuyCooldown:60,
        EquipmentsForSale:[{index:-1,prize:new Decimal(0)},{index:-1,prize:new Decimal(0)},{index:-1,prize:new Decimal(0)}], //price*      //要是哪一天这玩意length<3了就说明后面编程出问题了
        demile:[],
        ElementEssence: new Decimal(0),
    }},

    name:"Genesis",
    symbol: "GE",
    color: "#FFE4B5",                       // The color for this layer, which affects many elements.
    resource: "Genesis Vortexs",            // The name of this layer's main prestige resource.
    row: 5,                                 // The row this layer is on (0 is the first row).
    displayRow: 5,
    position:1,
    branches: ["rei"],

    baseResource: "Glowing Roses",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.rei.roses },  // A function to return the current amount of baseResource.

    requires: new Decimal("5e630"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 2.5,                          // "normal" prestige gain is (currency^exponent).
    //roundUpCost: true,
    hotkeys: [
        { key: "G", description: "Shift+G: Reset for Genesis Vortexs", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player['awaken'].awakened.includes('rei')},          // Returns a bool for if this layer's node should be visible in the tree.

    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    //装备与商店相关
    Check_Discoverd(){//每刻叫
        for (index in player[this.layer].EquipmentsHold)
            if (player[this.layer].EquipmentsHold[index]>0) player[this.layer].EquipmentsDiscovered[index] = true;
    },

    Refresh_Shop(ProgressNum){//不能每刻叫, 这里用layers调用
        let counter = 0;

        while (counter<3){
            let Randomindex = Math.floor(Math.random()*fractureEquiupments.length)

            if (fractureEquiupments[Randomindex].CanBuyProgress > ProgressNum) continue;
            else{
                let price = fractureEquiupments[Randomindex].BasePrize.times(0.9+Math.random()*0.2).max(0);
                Vue.set(player['fracture'].EquipmentsForSale,counter,{
                    index: Randomindex,
                    prize: price,
                })

                counter++;
            }

        }

        tmp['fracture'].EquipmentsForSale = player['fracture'].EquipmentsForSale;

    },

    ElementCap(){//K
        let K = new Decimal(10).plus(player.fracture.points.sub(1).max(0))
        K = K.plus(layers['fracture'].grid.return_Equiped_Equipment_Num(0)*0.5+layers['fracture'].grid.return_Equiped_Equipment_Num(3));
        if (hasAchievement('a',133)) K = K.plus(player.fracture.ElementEssence.sqrt().max(1).log10());
        return K;
    },

    Element_Gain(){//logestic, 返回每秒增加数目，用的时候记得乘diff
        if (!player['fracture'].unlocked) return new Decimal(0);
        let r = new Decimal(1);

        //sth changes r
        r = r.times(Decimal.pow(1.05,layers['fracture'].grid.return_Equiped_Equipment_Num(7))).times(Decimal.pow(1.1,layers['fracture'].grid.return_Equiped_Equipment_Num(9)));
        r = r.times(Decimal.pow(0.01,layers['fracture'].grid.return_Equiped_Equipment_Num(10)))

        let K = layers.fracture.ElementCap();

        let gain = (K.sub(player['fracture'].ElementEssence)).div(K).times(player['fracture'].ElementEssence.max(K.div(1e10))).times(r);
        return gain.max(0);
    },

    return_ALL_Equipments_Have(){//返回已装备+背包里的装备总数
        return eval(player[this.layer].EquipmentsHold.join("+"))+layers['fracture'].grid.return_Equiped_Equipment_Num('all');
    },

    Refresh_Cost(){
        return new Decimal(100).times(Decimal.sqrt(layers['fracture'].return_ALL_Equipments_Have()).max(1));
    },

    update(diff){
        tmp[this.layer].fractureEquiupments = fractureEquiupments;//?
        if (player[this.layer].BuyCooldown > 0) player[this.layer].BuyCooldown-=diff;
        player['fracture'].ElementEssence = player['fracture'].ElementEssence.plus(layers['fracture'].Element_Gain().times(diff));
    },

    tabFormat:{
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text",()=>{return (player['fracture'].unlocked)?"Each Milestone will unlock more Equipments.":""}],
                "milestones",
            ]
        },
        "Equipments":{
            unlocked(){return player['fracture'].unlocked},
            content:[
                "main-display",
                "blank",
                ["display-text",() => {return "Now you are holding: " + ((player.fracture.TempEquipmentId <= -1)?"None":fractureEquiupments[player.fracture.TempEquipmentId].EquipmentTitle)},{}],
                "blank",
                ["row",[["clickable",11],["clickable",12]]],
                "blank",
                "grid",
            ],
        },
        "BlackSmith":{
            unlocked(){return player['fracture'].unlocked},
            content:[
                "main-display",
                "blank",
                ["infobox","Upginfo",{}],
                ["row",[
                    ["clickable",13],
                    ["clickable",14],
                ]],
                "blank",
                ["display-text",()=>{return "You have " + format(player.fracture.ElementEssence) + " Element Essences."}],
                "blank",
                ["display-text","<b style='color: #00ff00;'>Green</b> block will be wiped when upgrade, while <b style='color: #ff0000;'>Red</b> block will stay still."],
                "blank",
                ["layer-proxy",['ghostGE',["grid"]]]
            ]
        },
        "Inventory":{
            unlocked(){return player['fracture'].unlocked},
            content:[
                "main-display",
                "blank",
                ["row",[
                    ["column",[["display-text",()=>{return ("Equipment Name:<br>"+((player['fracture'].CheckingEquipmentId >=0)?((player['fracture'].EquipmentsDiscovered[player['fracture'].CheckingEquipmentId])?fractureEquiupments[player['fracture'].CheckingEquipmentId].EquipmentTitle:"???"):"None"))}]]],
                    ["blank",["20px","17px"]],
                    ["column",[["display-text",()=>{return ("Equipment ID:<br>"+((player['fracture'].CheckingEquipmentId >=0)?player['fracture'].CheckingEquipmentId:"None"))}]]],
                    ["blank",["20px","17px"]],
                    ["column",[["display-text",()=>{return ("Amount You Have in Inventory:<br>"+((player['fracture'].CheckingEquipmentId >=0)?player['fracture'].EquipmentsHold[player['fracture'].CheckingEquipmentId]:"None"))}]]],
                ]],
                ["row",[
                    ["clickable",14],
                    ["clickable",15],
                    ["clickable",16],
                    ["clickable",17],
                ]],
                "blank",
                ["display-text",()=>{return "You have " + format(player.fracture.ElementEssence) + " Element Essences."}],
                "blank",
                ["row",[
                    ["clickable",21],
                    ["clickable",22],
                ]],
                ["layer-proxy",['ghostGE2',["grid"]]],
            ],
        },
        "Shop":{
            unlocked(){return player['fracture'].unlocked},
            content:[
                "main-display",
                "blank",
                ["row",[
                    ["clickable",31],
                    "blank",
                    ["clickable",32],
                ]],
                "blank",
                ["display-text",()=>{return "You have " + format(player.fracture.ElementEssence) + " Element Essences."}],
                ["display-text",()=>{return "Your Element Essence cap is "+format(layers.fracture.ElementCap())}],
                "blank",
                ["row",[
                    ["column",[
                        ["display-text",()=>{return "<b>Equipment Name</b>:<br>"+((player['fracture'].EquipmentsForSale[0].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[0].index].EquipmentTitle:"<a style='color: #ff0000;'>Sold out!</a>")}],
                        "blank",
                        ["display-text",()=>{return "<b>Equipment Effect</b>:<br>"+((player['fracture'].EquipmentsForSale[0].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[0].index].EffectDisplay:"<a style='color: #ff0000;'>Sold out!</a>")}],
                    ],{'width':'150px'}],
                    "blank",
                    ["column",[
                        ["display-text",()=>{return "<b>Equipment Name</b>:<br>"+((player['fracture'].EquipmentsForSale[1].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[1].index].EquipmentTitle:"<a style='color: #ff0000;'>Sold out!</a>")}],
                        "blank",
                        ["display-text",()=>{return "<b>Equipment Effect</b>:<br>"+((player['fracture'].EquipmentsForSale[1].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[1].index].EffectDisplay:"<a style='color: #ff0000;'>Sold out!</a>")}],
                    ],{'width':'150px'}],
                    "blank",
                    ["column",[
                        ["display-text",()=>{return "<b>Equipment Name</b>:<br>"+((player['fracture'].EquipmentsForSale[2].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[2].index].EquipmentTitle:"<a style='color: #ff0000;'>Sold out!</a>")}],
                        "blank",
                        ["display-text",()=>{return "<b>Equipment Effect</b>:<br>"+((player['fracture'].EquipmentsForSale[2].index>=0)?fractureEquiupments[player['fracture'].EquipmentsForSale[2].index].EffectDisplay:"<a style='color: #ff0000;'>Sold out!</a>")}],
                    ],{'width':'150px'}],
                ]],
                "blank",
                ["layer-proxy",['ghostGEShop',["grid"]]],
                ["row",[
                    ["clickable",33],
                    ["blank",["30px","17px"]],
                    ["clickable",34],
                    ["blank",["30px","17px"]],
                    ["clickable",35],
                ]],
            ]
        }


    },

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },

    milestones: {
        0: {
            requirementDescription: "1 Genesis Vortex",
            done() { return player.fracture.best.gte(1) },
            unlocked() { return player.fracture.unlocked },
            effectDescription() {
                return "Keep Celebration Ends challenges when reset."
            },
        },
        1: {
            requirementDescription: "4 Genesis Vortexs",
            done() { return player.fracture.best.gte(4) },
            unlocked() { return player.fracture.unlocked },
            effectDescription() {
                return "Institution resets nothing."
            },
            onComplete(){
                player[this.layer].BuyProgress+=1;
            },
        },
    },

    clickables:{
        11: {
            title: "Equipment Adjustment Mode",
            display() {return player[this.layer].DeEquipt?"ON":"OFF"},
            unlocked() { return player.fracture.unlocked },
            canClick() { return true },
            onClick() { 
                player[this.layer].DeEquipt = !player[this.layer].DeEquipt
            },
        },
        12: {
            title: "",
            display:"Put Holding Equipment Back to Inventory",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].TempEquipmentId>=0 },
            onClick() { 
                player[this.layer].EquipmentsHold[player[this.layer].TempEquipmentId] +=1;
                player[this.layer].TempEquipmentId = -1;
            },
        },
        13: {
            title: "Upgrade this Equipment",
            display(){

                const CurrencyList ={
                    'player.points':'Fragments',
                    'player.mem.points':'Memories',
                    'player.light.points':'Light Tachyons',
                    'player.dark.points':'Dark Matters',
                    'player.red.points':'Red Dolls',
                    'player.lethe.points':'Forgotten Drops',
                    'player.lab.points':'Research Points',
                    'player.lab.power':'Research Power',
                    'player.rei.points':'Luminous Churches',
                    'player.rei.roses':'Glowing Roses',
                    'player.yugamu.points':'Flourish Labyrinths',
                    'player.yugamu.timesmoved':'Times moved in Maze',
                    'player.world.points':'World Steps',
                    'player.storylayer.points':'Stories',//我怀疑是不是真的有这个需求
                    'player.etoluna.points':'Gemini Bounds',
                    'player.etoluna.starPoint':'Star Points',
                    'player.etoluna.moonPoint':'Moon Points',
                    'player.saya.points':'Everflashing Knives',
                    'player.ins.points':'Institution Funds',
                    'player.awaken.points':'Awaken Cores',
                    'player.fracture.points':'Genesis Vortexs',
                    'player.fracture.ElementEssence':'Element Essences',
                    'player.tempest.points':'Forbearance Endurances',
                    'player.tempest.milestonePoints.point':'Eyes of Storm',
                }

                if(!(player[this.layer].CheckingEquipmentId>=0&&player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId]))return "";
                let disp = "";
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('cost')) disp += ("Cost: "+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCost + " " + CurrencyList[fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCurrency])
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('require')) disp += ("<br>Req: "+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeReq+" "+CurrencyList[fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeReqCurrency])
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('equipnum')) disp +=("<br>Need "+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeEquipNum+" of this Equipment to Upgrade")
                return disp;
            },
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                if (player[this.layer].CheckingEquipmentId<0) return false;//之前卡短路，现在需要这样防止undefined
                let ValidCheck = player[this.layer].CheckingEquipmentId>=0&&player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId];//装备索引号合法且已发现装备
                let CanUpgradeCheck = fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo>=0&&(fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType!=undefined&&!fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('none'));//是否能够升级
                let EquipNumCheck = player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0;//不论是否需求多个装备，至少得有一个吧

                let UpgradeCostCheck = true;//之后主要是拿false来与
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('none')) UpgradeCostCheck = false;
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('cost')) UpgradeCostCheck = UpgradeCostCheck&&(eval(fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCurrency+".gte("+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCost+")"))
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('require')) UpgradeCostCheck = UpgradeCostCheck&&(eval(fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeReqCurrency+".gte("+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeReq+")"))
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('equipnum'))UpgradeCostCheck = UpgradeCostCheck&&(player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>=fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeEquipNum)
                return ValidCheck&&CanUpgradeCheck&&EquipNumCheck&&UpgradeCostCheck;
             },
            onClick() { 
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('cost')) eval(fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCurrency + "=" + fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCurrency+".sub("+fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeCost+")");
                player[this.layer].EquipmentsHold[fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo] += 1;
                if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeType.includes('equipnum')) player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeEquipNum;
                else player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
            },
        },
        14: {
            title: "Chage Equipment You Want To Check",
            display(){
                let disp = "Currently checking: "
                if (player[this.layer].CheckingEquipmentId <0) disp +="None"
                else disp += ((player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId])?fractureEquiupments[player[this.layer].CheckingEquipmentId].EquipmentTitle:"???");
                return disp;
            },
            unlocked() { return player.fracture.unlocked },
            canClick() { return true },
            onClick() { 
                let input  = prompt('Input Equipmrnt ID or Name here:');
                if (isNaN(parseInt(input)))//输入的是名称
                {
                    for (index in fractureEquiupments)
                    if (fractureEquiupments[index].EquipmentTitle == input) {player[this.layer].CheckingEquipmentId = index;return;}
                    player[this.layer].CheckingEquipmentId = -1;
                }
                else//输入的是数字
                {
                    let temp = parseInt(input);
                    //debugger
                    temp = Math.min(Math.max(temp,-1),fractureEquiupments.length-1);
                    Vue.set( player['fracture'],'CheckingEquipmentId',temp)
                    //player['fracture'].CheckingEquipmentId = temp;
                }
            },
        },
        15: {
            title: "Scrap One of This Equipment",
            display(){
                if (player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId]==true) return ("Return " + format(fractureEquiupments[player[this.layer].CheckingEquipmentId].BasePrize.times(0.75)) + " Element Essences")
                else return ""
            },
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0 },
            onClick() { 
                //记得吐钱
                player[this.layer].ElementEssence = player[this.layer].ElementEssence.plus(fractureEquiupments[player[this.layer].CheckingEquipmentId].BasePrize.times(0.75))
                //player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
                Vue.set(player[this.layer].EquipmentsHold,player[this.layer].CheckingEquipmentId,player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]-1)
            },
        },
        16: {
            title: "Put One of This Equipment in Your Hand",
            display:"",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0 && player[this.layer].TempEquipmentId<0 },
            onClick() { 
                player[this.layer].TempEquipmentId = player[this.layer].CheckingEquipmentId;
                //player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
                Vue.set(player[this.layer].EquipmentsHold,player[this.layer].CheckingEquipmentId,player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]-1)
            },
        },
        17: {
            title: "Scrap All Items in Inventory",
            display(){return "Return "+format(this.Return_All_Prices())+" Element Essences"},
            unlocked() { return player.fracture.unlocked },
            Return_All_Prices(){
                
                let prices = new Decimal(0) 
                for (index in player[this.layer].EquipmentsHold)
                    prices = prices.plus(fractureEquiupments[index].BasePrize.times(player[this.layer].EquipmentsHold[index]));

                let mult = new Decimal(0.75);//<--修正值

                return prices.times(mult);
            },
            canClick() { return this.Return_All_Prices().gt(0)},
            onClick() { 
                if (!confirm("Are you sure to Scrap All Items in Inventory?")) return;
                player[this.layer].ElementEssence = player[this.layer].ElementEssence.plus(this.Return_All_Prices())
                for (index in player[this.layer].EquipmentsHold)
                Vue.set(player[this.layer].EquipmentsHold,index,0);
            },
        },
        21: {
            title: "",
            display:"←",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].CheckPage>0 },
            onClick() {
                player[this.layer].CheckPage -=1;
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        22: {
            title: "",
            display:"→",
            unlocked() { return player.fracture.unlocked },
            canClick() { return (player[this.layer].CheckPage*10 + 10 < fractureEquiupments.length) },
            onClick() { 
                player[this.layer].CheckPage +=1;
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        31: {
            title: "Refresh Shop by Time",
            display(){return "CD: "+format(Math.max(player[this.layer].BuyCooldown,0))+"s"},
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].BuyCooldown<=0 },
            onClick() {
                layers[this.layer].Refresh_Shop(player[this.layer].BuyProgress);
                player[this.layer].BuyCooldown = 60;
            },
        },
        32: {
            title: "Refresh Shop by Money",
            display(){
                return "Cost: " + format(layers[this.layer].Refresh_Cost()) + " Element Essence"
            },
            unlocked() { return player.fracture.unlocked },
            canClick() { return player.fracture.ElementEssence.gte(layers['fracture'].Refresh_Cost()) },
            onClick() {
                
                player.fracture.ElementEssence = player.fracture.ElementEssence.sub(layers['fracture'].Refresh_Cost());

                layers[this.layer].Refresh_Shop(player[this.layer].BuyProgress);
            },
        },
        33: {//[0]
            title: "Buy",
            display(){return "Cost: " + format(player[this.layer].EquipmentsForSale[0].prize)+ " Elemet Essences"},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[0].index >=0 && player[this.layer].ElementEssence.gte(player[this.layer].EquipmentsForSale[0].prize);//我这里就不做上界检查了
             },
            onClick() {
                player[this.layer].ElementEssence = player[this.layer].ElementEssence.sub(player[this.layer].EquipmentsForSale[0].prize)
                player[this.layer].EquipmentsHold[player[this.layer].EquipmentsForSale[0].index] +=1;
                player[this.layer].EquipmentsForSale[0].index = -1;
            },
        },
        34: {//[1]
            title: "Buy",
            display(){return "Cost: " + format(player[this.layer].EquipmentsForSale[1].prize)+ " Elemet Essences"},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[1].index >=0 && player[this.layer].ElementEssence.gte(player[this.layer].EquipmentsForSale[1].prize);//我这里就不做上界检查了
             },
            onClick() {
                player[this.layer].ElementEssence = player[this.layer].ElementEssence.sub(player[this.layer].EquipmentsForSale[1].prize)
                player[this.layer].EquipmentsHold[player[this.layer].EquipmentsForSale[1].index] +=1;
                player[this.layer].EquipmentsForSale[1].index = -1;
            },
        },
        35: {//[2]
            title: "Buy",
            display(){return "Cost: " + format(player[this.layer].EquipmentsForSale[2].prize)+ " Elemet Essences"},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[2].index >=0 && player[this.layer].ElementEssence.gte(player[this.layer].EquipmentsForSale[2].prize);//我这里就不做上界检查了
             },
            onClick() {
                player[this.layer].ElementEssence = player[this.layer].ElementEssence.sub(player[this.layer].EquipmentsForSale[2].prize)
                player[this.layer].EquipmentsHold[player[this.layer].EquipmentsForSale[2].index] +=1;
                player[this.layer].EquipmentsForSale[2].index = -1;
            },
        },
    },
    grid: {
        rows() {return player[this.layer].gridrow}, // If these are dynamic make sure to have a max value as well!
        cols() {return player[this.layer].gridcol},
        maxRows: 5,
        maxCols: 5,
        Equip_Check_And_Set(offset,id){//offset 是一个数组
            for (idoffset in offset)//offset是数组, idoffset返回的是index
            {
                checkid = offset[idoffset] + id;
                if (((checkid%100<1)||(checkid%100>tmp[this.layer].grid.cols)||(Math.floor(checkid/100)<1)||(Math.floor(checkid/100)>tmp[this.layer].grid.rows))||player[this.layer].grid[checkid].BelongTo>=0)
                {alert('You can\'t put your Equipment here!'); return;}
            }
            player[this.layer].EquipmentsEquiped.push(player[this.layer].TempEquipmentId);
            player[this.layer].TempEquipmentId = -1;
            for (idoffset in offset)
            {
                safeid = offset[idoffset] + id;       
                player[this.layer].grid[safeid].BelongTo = player[this.layer].EquipmentsEquiped.length-1;   
                if (idoffset == 0)  player[this.layer].grid[safeid].Central = true;                   
            }
        },
        return_Equiped_Equipment_Num(Equipid){
            if ((Equipid<0 || Equipid == undefined)&&Equipid!='all'||player['fracture'].deactivated) return 0;
            let TempEquipArray = [];
            for (Gid in player[this.layer].grid)
                if (player[this.layer].grid[Gid].BelongTo >= 0 && player[this.layer].grid[Gid].Central)
                    TempEquipArray.push(player[this.layer].EquipmentsEquiped[player[this.layer].grid[Gid].BelongTo]);
            if (Equipid=='all') return TempEquipArray.length;
            TempEquipArray = TempEquipArray.filter(function(item){return item==Equipid});
            return TempEquipArray.length;
        },
        getStartData(id) {
            return {
                BelongTo : -1,
                Central: false
            }
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player[this.layer].DeEquipt;
        },
        onClick(data, id) { 
            if (player[this.layer].DeEquipt) {
                if (player[this.layer].TempEquipmentId >= 0)//装载
                    this.Equip_Check_And_Set(fractureEquiupments[player[this.layer].TempEquipmentId].shapeArray, id);
                else {//卸载
                    //先找到这个装备的中心，然后就别再调用id了
                    let CentralID;
                    for (Gid in player[this.layer].grid)//这里Gid返回的真的是id
                    if (player[this.layer].grid[Gid].BelongTo == player[this.layer].grid[id].BelongTo && player[this.layer].grid[Gid].Central)
                    {CentralID = parseInt(Gid);break;}

                    tempBelongTo = player[this.layer].grid[CentralID].BelongTo;
                    tempShapeArray = fractureEquiupments[player[this.layer].EquipmentsEquiped[player[this.layer].grid[CentralID].BelongTo]].shapeArray;
                    player[this.layer].TempEquipmentId = player[this.layer].EquipmentsEquiped[player[this.layer].grid[CentralID].BelongTo];//先放到Temp里
                    for (idoffset in tempShapeArray){//挨个抹除数据
                        let eraseid = tempShapeArray[idoffset]+CentralID;
                        //eraseid = parseInt(eraseid);//我不知道为什么eraseid出来是字符串<--现在我知道了
                        player[this.layer].grid[eraseid].BelongTo = -1;
                        player[this.layer].grid[eraseid].Central = false;
                    };
                    player[this.layer].EquipmentsEquiped.splice(tempBelongTo,1,-1);//最后弹出，拿-1来顶
                    //空网格检测
                    for (Gid in player[this.layer].grid)
                    if (player[this.layer].grid[Gid].BelongTo != -1) return;
                    player[this.layer].EquipmentsEquiped = [];
                }
            }
        },
        getDisplay(data, id) {
            if (data.BelongTo <=-1) return "Empty";
            let disp = "<h2>"+fractureEquiupments[player[this.layer].EquipmentsEquiped[data.BelongTo]].EquipmentTitle+"</h2>"
            if (data.Central) disp += "<br>"+fractureEquiupments[player[this.layer].EquipmentsEquiped[data.BelongTo]].EffectDisplay
            return disp;
        },
        getStyle(data,id){
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: "#555555",
                borderColor: "#555555",
                backgroundColor: "#55555540",
                borderWidth: '2px',
                height: '120px',
	            width: '120px',
            };

            if (id%100 ==1 && Math.floor(id/100)==1) jss.borderRadius = '10px 0px 0px 0px';
            if (id%100 ==player[this.layer].gridcol && Math.floor(id/100)==1) jss.borderRadius = '0px 10px 0px 0px';
            if (id%100 ==1 && Math.floor(id/100)==player[this.layer].gridrow) jss.borderRadius = '0px 0px 0px 10px';
            if (id%100 ==player[this.layer].gridcol && Math.floor(id/100)==player[this.layer].gridrow) jss.borderRadius = '0px 0px 10px 0px';

            if (data.BelongTo >= 0){
                tempcolor = fractureEquiupments[player[this.layer].EquipmentsEquiped[data.BelongTo]].Color;
                jss.color = tempcolor;
                jss.borderColor = tempcolor;
                jss.backgroundColor = `${tempcolor}40`;
            }

            /*if(player.fracture.selectedGridId == id) {
                jss.transform = 'scale(120%)';
                jss.zIndex = 100;
            }*/

            return jss;
        },
    
        //etc
    },
    infoboxes:{
        Upginfo:{
            title:"Upgrade info",
            body(){
                let disp = "";
                if (player[this.layer].CheckingEquipmentId <0) disp = "You are not choosing any Equipment to upgrade!";
                else if (!player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId]) disp = "You haven't discover this Equipment yet!"
                else if (fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo<0) disp = "This Equipment can't Upgrade!"
                    else {
                        if (!tmp.fracture.clickables[13].hovered)
                        {disp = "<h2 align=\"center\">Current Effect: </h2><br>"
                        disp += "<p align=\"center\">" + fractureEquiupments[player[this.layer].CheckingEquipmentId].EffectDisplay +"</p>"}
                        else
                        {disp = "<h2 align=\"center\">Upgrade Effect: </h2><br>"
                        disp += "<p align=\"center\">" + fractureEquiupments[fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo].EffectDisplay +"</p>"}

                        if (player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]<=0) disp += "<br><br> <h2>You don't have Any of this Equipment!</h2>"
                    }
                return disp;
            },
        }
    },
})

addNode("ghostGE",{
    name: "ghostGE", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 5,
    displayRow:5,
    color: "#555555",
    layerShown() { return "ghost"; },

    update(diff){
        updateGridTemp("ghostGE");
    },

    grid: {
        rows: 5, 
        cols: 5,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return false
        },
        onClick(data, id) { 
        },
        getDisplay(data, id) {
            return ;
        },

        getStyle(data,id){
            //debugger;
            const jss = {
                margin: '0px',
                borderRadius: 0,
                color: layers[this.layer].color,
                borderColor: layers[this.layer].color,
                backgroundColor: `${layers[this.layer].color}40`,
                borderWidth: '2px',
                height: '50px',
	            width: '50px',
            };

            if (player['fracture'].CheckingEquipmentId>=0&&player['fracture'].EquipmentsDiscovered[player['fracture'].CheckingEquipmentId]){
                //debugger;
                let subset = []//差集
                let set1 = fractureEquiupments[player['fracture'].CheckingEquipmentId].shapeArray
                let set2 = [];
                if (tmp.fracture.clickables[13].canClick)
                set2 = fractureEquiupments[fractureEquiupments[player['fracture'].CheckingEquipmentId].UpgradeTo].shapeArray

                    set1.forEach(function(val, index) {
                        if (!set2.includes(val)) {
                            subset.push(val);
                        }
                    });

                const ColorGreen = "#00ff00";
                const ColorRed = "#ff0000";

                for (index in set1)
                if (id == fractureEquiupments[player['fracture'].CheckingEquipmentId].defaultPosition + fractureEquiupments[player['fracture'].CheckingEquipmentId].shapeArray[index]){
                    jss.color = ColorRed;
                    jss.borderColor = ColorRed;
                    jss.backgroundColor = `${ColorRed}40`
                    if (fractureEquiupments[player['fracture'].CheckingEquipmentId].shapeArray[index] == 0)
                    {
                        jss.borderRadius = 10;
                        jss.borderWidth = '5px';
                    }
                }

                if (tmp.fracture.clickables[13].hovered)
                for (index in subset)
                if (id == fractureEquiupments[player['fracture'].CheckingEquipmentId].defaultPosition + subset[index]){//跟着升级前的中心点走
                    jss.color = ColorGreen;
                    jss.borderColor = ColorGreen;
                    jss.backgroundColor = `${ColorGreen}40`
                }

            }

            return jss;
        },
    }

})

addNode("ghostGE2",{
    name: "ghostGE2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 5,
    displayRow:5,
    color: "#555555",
    layerShown() { return "ghost"; },

    grid: {
        rows() {return 11}, 
        maxRows: 11,
        cols: 4,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;

            if (rowNum == 1) return true;//标题栏

            let indexNum = player.fracture.CheckPage*10 + rowNum - 2;//从0开始

            if (indexNum<0 || indexNum > fractureEquiupments.length - 1) return false;
            return true;

        },
        getCanClick(data, id) {
            return false
        },
        onClick(data, id) { 
        },
        getDisplay(data, id) {
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;
            if (rowNum==1)
             switch(colNum){
                case 1: return "<h2>Name</h2>";
                case 2: return "<h2>ID</h2>";
                case 3: return "<h2>Effect</h2>";
                case 4: return "<h2>Amount</h2>";
                default : return "default";
             }
             else{
                let indexNum = player.fracture.CheckPage*10 + rowNum - 2;//从0开始 
                switch(colNum){
                    case 1: {return (player.fracture.EquipmentsDiscovered[indexNum])?fractureEquiupments[indexNum].EquipmentTitle:"<h2>???</h2>";}
                    case 2: return indexNum;
                    case 3: {return (player.fracture.EquipmentsDiscovered[indexNum])?fractureEquiupments[indexNum].EffectDisplay:"<h2>???</h2>";}
                    case 4: return player['fracture'].EquipmentsHold[indexNum];
                    default : return "default";
                 }
             };
             return "data";//default
        },

        getStyle(data,id){
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: 'white',
                borderColor: layers[this.layer].color,
                backgroundColor: `${layers[this.layer].color}40`,
                borderWidth: '2px',
                height: '100px',
	            width: '150px',
            };

            if (rowNum == 1) jss.height = '50px';
            else {
                let indexNum = player.fracture.CheckPage*10 + rowNum - 2;//从0开始 
                if (player.fracture.EquipmentsDiscovered[indexNum] && colNum == 1) jss.color = fractureEquiupments[indexNum].Color;
            }

            return jss;
        }
    }

})

addLayer("ghostGEShop",{
    name: "ghostGEShop", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 5,
    displayRow:5,
    color: "#555555",
    layerShown() { return (tmp["fracture"].layerShown) ? false : "ghost"; },

    grid: {
        rows: 5, 
        cols: 15, //蛤蛤
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return false
        },
        onClick(data, id) { 
        },
        getDisplay(data, id) {
            return ;
        },

        getStyle(data,id){
            let colNum = id % 100;
            let rowNum = Math.floor(id/100);
            const jss = {
                margin: '0px',
                borderRadius: 0,
                color: layers[this.layer].color,
                borderColor: layers[this.layer].color,
                backgroundColor: `${layers[this.layer].color}40`,
                borderWidth: '2px',
                height: '20px',
	            width: '20px',
            };

            if (colNum%5 == 0 && colNum <15)
            jss['margin-right'] = '40px';


            for (Arrayindex in player['fracture'].EquipmentsForSale) {
                if (player['fracture'].EquipmentsForSale[Arrayindex].index < 0) continue;//default
                else {
                    for (ShapeArrayindex in fractureEquiupments[player['fracture'].EquipmentsForSale[Arrayindex].index].shapeArray)
                        if (id == fractureEquiupments[player['fracture'].EquipmentsForSale[Arrayindex].index].defaultPosition + fractureEquiupments[player['fracture'].EquipmentsForSale[Arrayindex].index].shapeArray[ShapeArrayindex] + Arrayindex * 5) {
                            let tempColor = fractureEquiupments[player['fracture'].EquipmentsForSale[Arrayindex].index].Color;
                            jss.color = tempColor;
                            jss.borderColor = tempColor;
                            jss.backgroundColor = `${tempColor}40`
                            if (fractureEquiupments[player['fracture'].EquipmentsForSale[Arrayindex].index].shapeArray[ShapeArrayindex] == 0) {
                                jss.borderRadius = 10;
                                jss.borderWidth = '4px';
                            }
                        }
                }

            }


            return jss;
        },
    }

})