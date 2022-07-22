const fractureEquiupments = [
    {
        EquipmentTitle: "T1",
        EffectDisplay : "test equipment please ignore",
        shapeArray: [0],
        Color:"#FF00FF",
        UpgradeTo:3,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(100),
    },
    {
        EquipmentTitle: "T2",
        EffectDisplay : "another test equipment please ignore",
        shapeArray: [0,1],
        Color:"#666666",
        UpgradeTo:4,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(100),
    },
    {
        EquipmentTitle: "T3",
        EffectDisplay : "third test equipment please ignore",
        shapeArray: [0,100],
        Color:"#FF0000",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(100),
    },
    {
        EquipmentTitle: "T1+",
        EffectDisplay : "Upgraded test equipment please ignore",
        shapeArray: [0],
        Color:"#FF00FF",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(100),
    },
    {
        EquipmentTitle: "T2+",
        EffectDisplay : "Upgraded another test equipment please ignore",
        shapeArray: [0],
        Color:"#666666",
        UpgradeTo:-1,
        defaultPosition:303,
        CanBuyProgress: 0,
        BasePrize: new Decimal(100),
    },
];

addLayer("fracture", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
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
        BuyProgress:0,                      //这个数值随着里程碑的增加而增加
        BuyCooldown:60,
        EquipmentsForSale:[{index:-1,prize:new Decimal(0)},{index:-1,prize:new Decimal(0)},{index:-1,prize:new Decimal(0)}],       //要是哪一天这玩意length<3了就说明后面编程出问题了
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

    requires: new Decimal(1e280),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    roundUpCost: true,

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

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
                Vue.set(player['fracture'].EquipmentsForSale,counter,{
                    index: Randomindex,
                    prize: fractureEquiupments[Randomindex].BasePrize //暂且如此，之后在这里加修正值
                })

                counter++;
            }

        }

        tmp['fracture'].EquipmentsForSale = player['fracture'].EquipmentsForSale;

    },

    update(diff){
        tmp[this.layer].fractureEquiupments = fractureEquiupments;
        if (player[this.layer].BuyCooldown > 0) player[this.layer].BuyCooldown-=diff;
    },

    tabFormat:{
        "Equipments":{
            content:[
                ["display-text","Currently nothing here"],
                "blank",
                ["display-text",() => {return "Now you are holding: " + ((player.fracture.TempEquipmentId <= -1)?"None":fractureEquiupments[player.fracture.TempEquipmentId].EquipmentTitle)},{}],
                "blank",
                ["row",[["clickable",11],["clickable",12]]],
                "blank",
                "grid",
            ],
        },
        "BlackSmith":{
            content:[
                ["display-text","Currently nothing here"],
                "blank",
                ["infobox","Upginfo",{}],
                ["row",[
                    ["clickable",13],
                    ["clickable",14],
                ]],
                "blank",
                ["display-text","<b style='color: #00ff00;'>Green</b> block will be wiped when upgrade, while <b style='color: #ff0000;'>Red</b> block will stay still."],
                "blank",
                ["layer-proxy",['ghostGE',["grid"]]]
            ]
        },
        "Inventory":{
            content:[
                ["display-text","Currently nothing here"],
                "blank",
                ["row",[
                    ["column",[["display-text",()=>{return ("Equipment Name:<br>"+((player['fracture'].CheckingEquipmentId >=0)?((player['fracture'].EquipmentsDiscovered[player['fracture'].CheckingEquipmentId])?fractureEquiupments[player['fracture'].CheckingEquipmentId].EquipmentTitle:"???"):"None"))}]]],
                    ["blank",["20px","17px"]],
                    ["column",[["display-text",()=>{return ("Equipment ID:<br>"+((player['fracture'].CheckingEquipmentId >=0)?player['fracture'].CheckingEquipmentId:"None"))}]]],
                    ["blank",["20px","17px"]],
                    ["column",[["display-text",()=>{return ("Amount You Have in Backpack:<br>"+((player['fracture'].CheckingEquipmentId >=0)?player['fracture'].EquipmentsHold[player['fracture'].CheckingEquipmentId]:"None"))}]]],
                ]],
                ["row",[
                    ["clickable",14],
                    ["clickable",15],
                    ["clickable",16],
                ]],
                "blank",
                ["row",[
                    ["clickable",21],
                    ["clickable",22],
                ]],
                ["layer-proxy",['ghostGE2',["grid"]]],
            ],
        },
        "Shop":{
            content:[
                ["display-text","Currently nothing here"],
                "blank",
                ["row",[
                    ["clickable",31],
                    "blank",
                    ["clickable",32],
                ]],
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
            display:"Put Holding Equipment Back to Backpack",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].TempEquipmentId>=0 },
            onClick() { 
                player[this.layer].EquipmentsHold[player[this.layer].TempEquipmentId] +=1;
                player[this.layer].TempEquipmentId = -1;
            },
        },
        13: {
            title: "Upgrade this Equipment",
            display:"",
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                //CheckingEquipmentId有效&&已发现装备&&装备能够升级&&装备存货数目>0 <--这个改起来不难
                return player[this.layer].CheckingEquipmentId>=0&&player[this.layer].EquipmentsDiscovered[player[this.layer].CheckingEquipmentId]&&fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo>=0&&player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0
             },
            onClick() { 
                player[this.layer].EquipmentsHold[fractureEquiupments[player[this.layer].CheckingEquipmentId].UpgradeTo] += 1;
                player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
            },
        },
        14: {
            title: "Chage Equipmrnt You Want To Check",
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
                    if (temp >=0&& temp<=fractureEquiupments.length) player[this.layer].CheckingEquipmentId = temp;
                    else player[this.layer].CheckingEquipmentId = -1;
                }
            },
        },
        15: {
            title: "Scrap One of This Equipment",
            display:"",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0 },
            onClick() { 
                //记得吐钱
                player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
            },
        },
        16: {
            title: "Put One of This Equipment in Your Hand",
            display:"",
            unlocked() { return player.fracture.unlocked },
            canClick() { return player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId]>0 && player[this.layer].TempEquipmentId<0 },
            onClick() { 
                player[this.layer].TempEquipmentId = player[this.layer].CheckingEquipmentId;
                player[this.layer].EquipmentsHold[player[this.layer].CheckingEquipmentId] -= 1;
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
            display(){return "Currently, no money needed."},
            unlocked() { return player.fracture.unlocked },
            canClick() { return true },
            onClick() {
                layers[this.layer].Refresh_Shop(player[this.layer].BuyProgress);
                //记得花钱!
            },
        },
        33: {//[0]
            title: "Buy",
            display(){return "Currently, no money needed."},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[0].index >=0;//我这里就不做上界检查了
             },
            onClick() {
                player[this.layer].EquipmentsHold[player[this.layer].EquipmentsForSale[0].index] +=1;
                player[this.layer].EquipmentsForSale[0].index = -1;
            },
        },
        34: {//[1]
            title: "Buy",
            display(){return "Currently, no money needed."},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[1].index >=0;//我这里就不做上界检查了
             },
            onClick() {
                player[this.layer].EquipmentsHold[player[this.layer].EquipmentsForSale[1].index] +=1;
                player[this.layer].EquipmentsForSale[1].index = -1;
            },
        },
        35: {//[2]
            title: "Buy",
            display(){return "Currently, no money needed."},
            unlocked() { return player.fracture.unlocked },
            canClick() { 
                return player[this.layer].EquipmentsForSale[2].index >=0;//我这里就不做上界检查了
             },
            onClick() {
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
            if ((Equipid<0 || Equipid == undefined)&&Equipid!='all') return 0;
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
                height: '100px',
	            width: '100px',
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

            if (tmp.fracture.clickables[13].canClick){
                let subset = []//差集
                let set1 = fractureEquiupments[player['fracture'].CheckingEquipmentId].shapeArray
                let set2 = fractureEquiupments[fractureEquiupments[player['fracture'].CheckingEquipmentId].UpgradeTo].shapeArray

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
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: layers[this.layer].color,
                borderColor: layers[this.layer].color,
                backgroundColor: `${layers[this.layer].color}40`,
                borderWidth: '2px',
                height: '100px',
	            width: '150px',
            };
            return jss;
        }
    }

})

addNode("ghostGEShop",{
    name: "ghostGEShop", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 5,
    displayRow:5,
    color: "#555555",
    layerShown() { return false; },

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