addLayer("tempest", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        Postrion: new Decimal(0),           //<--HAHA
        ChallengeTimer: 60,
        total:new Decimal(0),
        best:new Decimal(0),
        milestonePoints:{point:new Decimal(0),total:new Decimal(0)},
        demile:[],
        decha:[],
    }},

    name:"Forbearance",
    symbol:"FO",
    color: "#1f1e33",                       // The color for this layer, which affects many elements.
    resource: "Forbearance Endurances",            // The name of this layer's main prestige resource.
    row: 5,                                 // The row this layer is on (0 is the first row).
    displayRow: 5,
    position:5,                                // The row this layer is on (0 is the first row).
    branches: ["yugamu"],

    nodeStyle:{
        'color':'white',
        'borderColor':'#3f3e53',
    },
    PrestigeButtonStyle:{
        'color':'white',
        'borderColor':'#3f3e53',
        'background-color': "#1f1e33",//这一行还不能缺
    },
    PopupStyle:{
        'color':'white',
        'borderColor':'#3f3e53',
        'background-color': "#1f1e33",
    },

    baseResource: "Times Moved in Maze",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.yugamu.timesmoved },  // 这一步真™冒险<--是啊是很冒险

    requires: new Decimal(3e100),              // The amount of the base needed to  gain 1 of the prestige currency.
                                         // Also the amount required to unlock the layer.

    type: "static",                         
    exponent: 2, 
    canBuyMax:false, 
    roundUpCost:true,    
    hotkeys: [
        { key: "F", description: "Shift+F: Forbearance Endurances", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],                    

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.

        if (player['awaken'].awakened.includes('saya')) mult = mult.div(tmp.saya.grid.ChallengeEffect.toGEFO);

        return mult;
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player['awaken'].awakened.includes('yugamu') },          // Returns a bool for if this layer's node should be visible in the tree.
    canReset(){
        if (player.kou.activeChallenge) return false;
        else return player.yugamu.timesmoved.gte(getNextAt(this.layer, canMax=this.canBuyMax))
    },

    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].decha.length == 0) player[this.layer].decha = player[this.layer].challenges;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].decha.length != 0) { player[this.layer].challenges = player[this.layer].decha; player[this.layer].decha = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    update(diff){
        if (player[this.layer].activeChallenge != null) player[this.layer].ChallengeTimer-=diff;
        if (player[this.layer].ChallengeTimer <=0) {
            player[this.layer].ChallengeTimer = 60;
            player.points = new Decimal(1);
            player.mem.points = new Decimal(1);
        };
    },

    doReset(resettingLayer){
        let keep = [];
        if (layers[resettingLayer].row > this.row){
            layerDataReset("tempest", keep);
        }
    },

    shouldNotify(){
        //debugger;
        for (id in player['tempest'].grid)
        {
            if (!player['tempest'].grid[id].activated && player['tempest'].milestonePoints.point.gte(player['tempest'].grid[id].prize))
                return true;}
        return false;
    },

    //挑战相关
    nerf_in_challenges(){//都不是Decimal
        return {
            'toFrag':()=>{return 0.75},
            'toMem':()=>{return 0.75},
            'toLEff':()=>{return 0.5},
            'toDEff':()=>{return 0.5},
            'toREff':()=>{return 0.5},
            'toFEff':()=>{return 0.5},
            'toRoseGain':()=>{return 0.5},
            'toMazeEff':()=>{return 0.5},
        }
    },

    tabFormat:{
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",]
        },
        "Tempest Underthrough":{
            buttonStyle() { return { 'background-color': '#3f3e53' } },
            unlocked(){return player['tempest'].unlocked},
            content:[
                "main-display",
                "blank",
                "challenges",
                "blank",
                ["display-text",()=>{return "You have <h3 style='color:#3f3e53;text-shadow:0px 0px 10px #3f3e53;'>"+formatWhole(player['tempest'].milestonePoints.point)+"</h3> Eyes of Storm."}],
                "blank",
                ["display-text",()=>{return "You have gained <h3 style='color:#3f3e53;text-shadow:0px 0px 10px #3f3e53;'>"+formatWhole(player['tempest'].milestonePoints.total)+"</h3> Eyes of Storm in total."}],
                "blank",
                ["display-text","You can gain Eye of Storm by gaining Forbearance Milestone or complete Overwhelming Growth Challenge."],
                ["display-text","Enable Effects below will cost Eyes of Storm, and Cost Price is related to its row."],
                "blank",
                "grid",
            ]
        }
    },

    upgrades: {
        // 应该是没有upg了，记得删掉
    },

    milestones: {
        0: {
            requirementDescription: "1 Forbearance Endurance",
            done() { return player.tempest.best.gte(1) },
            unlocked() { return player.tempest.unlocked },
            effectDescription() {
                return "Keep Hyper Beacons when reset."
            },
            onComplete(){
                player[this.layer].milestonePoints.total = player[this.layer].milestonePoints.total.add(1);
                player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.add(1);
            },
            //style:{'borderColor':'#3f3e53','color':'white','backgroundColor':'#1f1e33'},
        },
        1: {
            requirementDescription: "2 Forbearance Endurances",
            done() { return player.tempest.best.gte(2) },
            unlocked() { return player.tempest.unlocked },
            effectDescription() {
                return "Autobuy Hyper Scythes."
            },
            onComplete(){
                player[this.layer].milestonePoints.total = player[this.layer].milestonePoints.total.add(1);
                player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.add(1);
            },
        },
        2: {
            requirementDescription: "4 Forbearance Endurances",
            done() { return player.tempest.best.gte(4) },
            unlocked() { return player.tempest.unlocked },
            effectDescription() {
                return "Fragment and Memories nerf in Merge Attachment ^0.95 & Keep Merge Attachment when reset"//想不出来该补什么QoL了←你个智障
            },
            onComplete(){
                player[this.layer].milestonePoints.total = player[this.layer].milestonePoints.total.add(1);
                player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.add(1);
            },
        },
    },

        challenges: {
            11: {
                name: "Overwhelming Growth",
                challengeDescription: "Nerf Generation and effects on almost everything, and lose all your Fragments & Memories every 60 seconds.",
                goalDescription(){return format(this.goal()) + " Fragments"},
                rewardDisplay:"Convert Challenge Completion into Milestone Point",
                fullDisplay(){
                    let disp = "Nerf Generation and effects on almost everything, and lose all your Fragments & Memories every 60 seconds."
                    disp += "<br>Goal: "+ format(this.goal()) + " Fragments";
                    disp += "<br>Reward: Convert Challenge Completion into Milestone Point & Challenge Completion Contributes to Effects below."
                    disp += "<br>You have Completed " + challengeCompletions(this.layer,this.id) + " times, and you can Complete " + formatWhole(this.completionLimit()) + " times at most.";
                    return disp;
                },
                onEnter(){
                    player[this.layer].ChallengeTimer = 60;
                },
                onComplete(){
                    player[this.layer].milestonePoints.total = player[this.layer].milestonePoints.total.add(1);
                    player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.add(1);
                },
                goal(){
                    let goal = Decimal.pow(10,challengeCompletions(this.layer,this.id)*50).times("1e1650");
                    if (player[this.layer].grid[201].activated) goal = goal.pow(gridEffect(this.layer,201));
                    return goal
                },
                canComplete: function() {return player.points.gte(this.goal())},
                completionLimit(){return player[this.layer].total.round().toNumber()},
                style:{'borderColor':'#3f3e53','color':'white','backgroundColor':'#1f1e33','border-radius': "25px", 'height': "400px", 'width': "400px"},
                buttonStyle:{'borderColor':'#3f3e53','color':'white','backgroundColor':'#1f1e33'},
                marked(){
                    return challengeCompletions(this.layer,this.id)&&this.completionLimit>0;
                },
            },
        },

    grid: {
        rows: 8, // 我先写这么多
        cols: 3,
        getStartData(id) {
            return {
                prize: new Decimal(Math.floor(id/100)),//price typo
                activated: false,
            };
        },
        getUnlocked(id) { // Default
            if (Math.floor(id/100)>3) return false;//目前
            else return true;
        },
        getCanClick(data, id) {
            let colNum = id%100;
            let rowNum = Math.floor(id/100);

            //特例区
            if (id == 301 && !player.awaken.awakened.includes('saya')) return false
            if (id == 302 && !player.awaken.awakened.includes('etoluna')) return false
            //特例区结束
            
            let Upper = (rowNum == 1)?true:player['tempest'].grid[id-100].activated;
            let Beneath = (rowNum == this.rows)?false:player['tempest'].grid[id+100].activated;

            if (data.activated) return (Upper && !Beneath);
            else return (Upper && !Beneath && player[this.layer].milestonePoints.point.gte(data.prize));

        },
        onClick(data, id) { 
            let rowNum = Math.floor(id/100);
            if (!player[this.layer].grid[id].activated) player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.sub(rowNum);
            else player[this.layer].milestonePoints.point = player[this.layer].milestonePoints.point.plus(rowNum);
            player[this.layer].grid[id].activated = !player[this.layer].grid[id].activated;
        },
        getDisplay(data, id) {
            switch(id){
                case 101:{
                    let disp = "Boost Fragment generation by " + format(gridEffect(this.layer,id)) + "x";
                    disp +="<br><h5>(won't be affected by Overwhelming Growth Challenge)</h5>"
                    return disp;
                }
                case 102:{
                    return "Push Times you can move in Maze by " + format(gridEffect(this.layer,id))+"x";
                }
                case 103:{
                    return "Push Memory softcap by " + format(gridEffect(this.layer,id)) + "x";
                }
                case 201:{
                    return "Overwhelming Growth's goal ^"+format(gridEffect(this.layer,id));
                }
                case 202:{
                    return "Give " + formatWhole(gridEffect(this.layer,id)) + " Free Hyper Guilding Scythes."
                }
                case 203:{
                    return "Fixed World Step Effect's softcap starts x"+format(gridEffect(this.layer,id))+" later"
                }
                case 301:{
                    if (!player.awaken.awakened.includes('saya')) return "Awake Knife layer to unlock this."
                    return "Genesis Vortexs lower Memory goal of Merge Attachment by ^"+format(gridEffect(this.layer,id))
                }
                case 302:{
                    if (!player.awaken.awakened.includes('etoluna')) return "Awake Gemini layer to unlock this."
                    return "Star/Moon power decrease rate x"+format(gridEffect(this.layer,id))
                }
                case 303:{
                    return "Forbearance Endurances boost Institution Funds gain by x"+format(gridEffect(this.layer,id))
                }
                default : return data.activated;
            }
        },
        getStyle(data,id){
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: "#3f3e53",
                borderColor: "#3f3e53",
                backgroundColor: "#1f1e3340",
                borderWidth: '2px',
                height: '100px',
	            width: '200px',
                'font-size':'15px',
            };

            if (player[this.layer].grid[id].activated){
                jss.color = 'green';
                jss.borderColor = 'green';
                jss.backgroundColor = '#00FF0040';
            }
            else if (this.getCanClick(player[this.layer].grid[id],id)){
                jss.color = 'red';
                jss.borderColor = 'red';
                jss.backgroundColor = '#FF000040';
            }

            return jss;
        },
        getEffect(data,id){//eff写在这里好了
            switch(id){
                case 101:{//嗯乘产量
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let exp = 5+challengeCompletions(this.layer,11);
                    let eff = Decimal.pow(player[this.layer].total.max(1).log(10).plus(10),exp);
                    return eff;
                }
                case 102:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let eff = Decimal.pow(player[this.layer].milestonePoints.total.times(2).max(1),player[this.layer].total.times(0.8).max(1))
                    return eff;
                }
                case 103:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let eff = Decimal.pow(25000,challengeCompletions(this.layer,11));
                    return softcap(eff,Decimal.pow(10,player[this.layer].total.times(2).plus(4)),0.75);
                }
                case 201:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let eff = new Decimal(1).div(player[this.layer].points.plus(challengeCompletions(this.layer,11)).div(100).pow(0.2).plus(1)).pow(0.5)
                    return eff.min(1);
                }
                case 202:{
                    if (layers[this.layer].deactivated()) return new Decimal(0);
                    let eff = challengeCompletions(this.layer,11)*(player[this.layer].total.sub(1).max(0).toNumber());
                    return Math.round(eff);
                }
                case 203:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let eff = Decimal.pow(challengeCompletions(this.layer,11)+1,player[this.layer].total.div(100).plus(1).sqrt()).max(1);
                    return eff;
                }
                case 301:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    let basepower = player.fracture.points.div(50).plus(1).pow(new Decimal(1).plus(challengeCompletions(this.layer,11)/50))
                    return Decimal.pow(0.8,basepower);
                }
                case 302:{
                    if (layers[this.layer].deactivated()) return 1;
                    return Math.pow(0.99,challengeCompletions(this.layer,11))//此处返回的是普通数字
                }
                case 303:{
                    if (layers[this.layer].deactivated()) return new Decimal(1);
                    return Decimal.pow(7.5,player[this.layer].points.times(1.5));
                }
                default: return new Decimal(1);
            };

        },
    }
})

addLayer("ghostFO", {
    name: "ghostFO", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GFO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 5,
    color: "#000000",
    layerShown() { return (tmp["tempest"].layerShown) ? false : "ghost"; }
})