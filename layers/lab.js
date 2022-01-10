addLayer("lab", {
    name: "Lab", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best:new Decimal(0),
        unlockOrder:0,
        power:new Decimal(0),
        generatorauto:false,
        //powermult:new Decimal(0),
        //powerexp:new Decimal(0),
        }},
    resource: "Research Points",
    color: "#00bdf9",
    nodeStyle() { return {
        background: (player.lab.unlocked||canReset("lab"))?("radial-gradient(circle, #00bdf9 0%, #006eb9 100%)"):"#bf8f8f",
    }},
    type: "none", // 怹不通过重置获得点数
    branches: ["mem"],

    row: 3, // Row the layer is in on the tree (0 is the first row)
    displayRow: 3,
    position:2,
    layerShown(){return hasAchievement('a',55)},

    doReset(resettingLayer){},

    //gain research power
    powermult(){
        let mult = new Decimal(0);
        if (hasUpgrade('lab',11)) mult =new Decimal(1);
        if (hasUpgrade('lab',12)) mult = mult.plus(player[this.layer].points.div(2));
        if (hasUpgrade('lab',41)) mult = mult.times(player[this.layer].points.max(1));
        if (hasAchievement('lab',13)) mult = mult.plus(achievementEffect('lab',13));
        if (hasUpgrade('lab',63)) mult = mult.times(upgradeEffect('lab',63));
        if (hasUpgrade('lab',64)) mult = mult.times(upgradeEffect('lab',64));
        if (hasUpgrade('world',11)) mult = mult.times(upgradeEffect('world',11));
        mult = mult.pow(tmp["lab"].powerexp)
        return mult;
    },
    powerexp(){
        let exp = new Decimal(1);
        return exp;
    },

    //gain research points
    pointgain(){
        let gain = new Decimal(0);
        //add
        if (hasMilestone('lab',7)) gain = gain.plus(buyableEffect('lab', 41));
        if (hasMilestone('lab',8)) gain = gain.plus(buyableEffect('lab', 42));

        //mult
        if (hasMilestone('rei',2)) gain = gain.times(player.rei.points.div(100).plus(1));
        if (hasMilestone('yugamu',2)) gain = gain.times(player.yugamu.points.div(100).plus(1));
        if (hasUpgrade('lab',111)) gain = gain.times(buyableEffect('lab',11));
        if (hasUpgrade('world',31)) gain = gain.times(layers.world.restrictReward());
        if (hasUpgrade('lab',121)) gain = gain.times(1.5);

        return gain;
    },
    pointsoftcap(){
        let sc = new Decimal(100000);
        if (hasUpgrade('lab',121)) sc = sc.times(2);
        if (hasUpgrade('lab',161)) sc = sc.times(upgradeEffect('lab',161));
        return sc;
    },

    update(diff) {

        let auto=[11,12,13,21,22,23,31,32,33,43];
        if (hasUpgrade('lab',122)) auto =auto.concat([41,42]);
        for(var i = 0; i < auto.length; i++){
            if (layers.lab.buyables[auto[i]].canAfford()&&layers.lab.buyables[auto[i]].autoed()){
                layers.lab.buyables[auto[i]].buy()
            };
        }


        player.lab.points = player.lab.points.plus(tmp["lab"].pointgain.times(diff));
        if (player.lab.points.gt(tmp["lab"].pointsoftcap)) player.lab.points = player.lab.points.sub(player.lab.points.sub(tmp["lab"].pointsoftcap).times(0.01).times(diff));

        if (player.lab.points.gte(player.lab.best)) player.lab.best = player.lab.points;
        if (player.lab.unlocked) player.lab.power = player.lab.power.plus(tmp["lab"].powermult.times(diff));
        player.lab.power = player.lab.power.sub(player.lab.power.times(0.01).times(diff));
        if (player.lab.power.lt(0)) player.lab.power = new Decimal(0);
        if (player.lab.points.lt(0)) player.lab.points = new Decimal(0);
    },

    shouldNotify(){
        let buyableid = [11,12,13,21,22,31,32,41,42];
        for(var i = 0; i < buyableid.length; i++){
            if (layers.lab.buyables[buyableid[i]].canAfford()){
                return true;
            };
    }
    },

    microtabs:{
        /*style: {'border-width':'0px'},*/
        Researchstuff:{
            "Setup":{
                content:[
                "blank",
                ["row",[["upgrade","11"], ["upgrade","12"], ["upgrade","13"], ["upgrade","14"]]],
                ["row",[["upgrade","21"], ["upgrade","22"], ["upgrade","23"], ["upgrade","24"]]],
                ["row",[["upgrade","31"], ["upgrade","32"], ["upgrade","33"], ["upgrade","34"]]],
                ["row",[["upgrade","41"], ["upgrade","42"], ["upgrade","43"], ["upgrade","44"]]],
                ["row",[["upgrade","51"] ]]
            ]
        },
        "Anonymous Researches":{
                unlocked(){return hasUpgrade('lab',51)},
                content:[
                "blank",
                ["row",[["upgrade","61"] ,["upgrade","62"] ,["upgrade","63"] ,["upgrade","64"]]],
                ["row",[["upgrade","71"] ,["upgrade","72"] ,["upgrade","73"] ,["upgrade","74"]]],
                ["row",[["upgrade","81"] ,["upgrade","82"] ,["upgrade","83"] ,["upgrade","84"]]],
                ["row",[["upgrade","91"] ,["upgrade","92"] ,["upgrade","93"] ,["upgrade","94"]]],
                ["row",[["upgrade","101"] ]]
            ]
        },
        "World Researches":{
            unlocked(){return hasUpgrade('world',21)},
            content:[
            "blank",
            ["row",[["upgrade","111"],["upgrade","112"],["upgrade","113"],["upgrade","114"]]],
            ["row",[["upgrade","121"],["upgrade","122"],["upgrade","123"],["upgrade","124"]]],
            ["row",[["upgrade","131"],["upgrade","132"],["upgrade","133"],["upgrade","134"]]],
            ["row",[["upgrade","141"],["upgrade","142"],["upgrade","143"],["upgrade","144"]]],
            ["row",[["upgrade","151"] ]]
        ]
    },
        "Fragment Researches":{
        unlocked(){return hasUpgrade('storylayer',33)},
        content:[
        "blank",
        ["row",[["upgrade","161"],["upgrade","162"],["upgrade","163"],["upgrade","164"]]],
    ]
},
        }

    },

    tabFormat: {
        "Researches": {
            content: [
                "main-display",
                ["display-text",
                    function() {return (hasMilestone('lab',7))?("You gain "+format(tmp["lab"].pointgain)+" Research Points per second"):""},
                        {}],
                ["display-text",
                function() {return (player.lab.points.gt(tmp["lab"].pointsoftcap))?("You reached Research Point softcap and you are now losing 1% of your overflowing Research Points per second."):""},
                    {}],
                "blank",
                ["display-text",
                    function() {return "You have "+format(player.lab.power)+" Research Power."},
                        {}],
                ["display-text",
                function() {return "You lose 1% Research Power every second."},
                    {}],
                "blank",
                ["microtabs","Researchstuff",{'border-width':'0px'}],
            ]
        },
        "Research Progresses": {
            unlocked(){return hasUpgrade('lab',13)},
            content: [
                "main-display",
                "blank",
                ["display-text",
                function() {return "Progresses: "+player.lab.achievements.length+"/"+(Object.keys(tmp.lab.achievements).length-2)},
                    {}],
                "blank",
                "achievements",
            ]
        },
        "Research Transformers": {
            unlocked(){return hasUpgrade('lab',14)},
            content: [
                "main-display",
                "blank",
                ["display-text",
                    function() {return "You have "+format(player.lab.power)+" Research Power."},
                        {}],
                "blank",
                "buyables",
            ]
        },
        "Milestones": {
            unlocked(){return hasUpgrade('lab',24)},
            content: [
                "main-display",
                "blank",
                ["display-text",
                    function() {return "You have "+format(player.lab.power)+" Research Power."},
                        {}],
                "resource-display",
                "blank",
                "milestones",
            ]
        },
    },

    milestones: {
        0: {
            requirementDescription: "1000 Research Power",
            done() { return player.lab.power.gte(1000)&&hasUpgrade('lab',24)},
            unlocked(){return hasUpgrade('lab',24)},
            effectDescription: "Research Power boosts Fragment generation.",
        },
        1: {
            requirementDescription: "5 Fragment Transformers",
            done() { return player.lab.buyables[12].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Points boosts Fragment generation.",
        },
        2: {
            requirementDescription: "5 Memory Transformers",
            done() { return player.lab.buyables[13].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Power boosts Memories gain.",
        },
        3: {
            requirementDescription: "5 Light Transformers",
            done() { return player.lab.buyables[21].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Power boosts Light Tachyons gain.",
        },
        4: {
            requirementDescription: "5 Dark Transformers",
            done() { return player.lab.buyables[22].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Power boosts Dark Matters gain.",
        },
        5: {
            requirementDescription: "5 Doll Transformers",
            done() { return player.lab.buyables[31].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Power boosts Red Dolls gain.",
        },
        6: {
            requirementDescription: "5 Forgotten Transformers",
            done() { return player.lab.buyables[32].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Research Power boosts Forgotten Drops gain.",
        },
        7: {
            requirementDescription: "5 Research Power Transformers",
            done() { return player.lab.buyables[11].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',0)},
            effectDescription: "Unlock Research Generator (in Research Transformer Tab).",
        },
        8: {
            requirementDescription: "5 Research Generators",
            done() { return player.lab.buyables[41].gte(5)&&hasMilestone('lab',0)},
            unlocked(){return hasMilestone('lab',7)},
            effectDescription: "Unlock Tech Transformer.",
        },
    },

    upgrades:{//Researches
        11:{ title: "Start Research",
        description: "Start generating Research Power.",
        cost() { return new Decimal(1)},
        },
        12:{ title: "Directions Setting",
        description: "Gain another Research Point, and your Research Power gain is boosted by your Research Points.",
        cost() { return new Decimal(50)},
        unlocked(){return hasUpgrade('lab',11)},
        currencyDisplayName:"Research Power",
        currencyInternalName:"power",
        currencyLayer:"lab",
        onPurchase(){player[this.layer].points=player[this.layer].points.plus(1);}
        },
        13:{ title: "Plan Set",
        description: "Unlock Research Progress.",
        cost() { return new Decimal(100)},
        unlocked(){return hasUpgrade('lab',11)},
        currencyDisplayName:"Research Power",
        currencyInternalName:"power",
        currencyLayer:"lab",
        },
        14:{ title: "Research Transform",
        description: "Unlock Research Transformers, but you need to research to unlock them.",
        cost() { return new Decimal(100)},
        unlocked(){return hasUpgrade('lab',11)},
        currencyDisplayName:"Research Power",
        currencyInternalName:"power",
        currencyLayer:"lab",
        },
        21:{ title: "Unrelated Researches",
        description: "Unlock Research Power Transformer.",
        cost() { return new Decimal(1)},
        unlocked(){return hasAchievement('lab',11)},
        },
        22:{ title: "Fragment Researches",
        description: "Unlock Fragment Transformer.",
        fullDisplay(){return "<b>Fragment Researches</b><br>Unlock Fragment Transformer.<br><br>Cost: 1e100 Fragments<br>200 Research Power"},
        canAfford(){
            return player.points.gte(1e100)&&player.lab.power.gte(200);
        },
        pay(){
            player.points = player.points.sub(1e100);
            player.lab.power = player.lab.power.sub(200);
        },
        unlocked(){return hasUpgrade('lab',21)},
        },
        23:{ title: "Memory Researches",
        description: "Unlock Memory Transformer.",
        fullDisplay(){return "<b>Memory Researches</b><br>Unlock Memory Transformer.<br><br>Cost: 1e180 Memories<br>500 Research Power"},
        canAfford(){
            return player.mem.points.gte(1e180)&&player.lab.power.gte(500);
        },
        pay(){
            player.mem.points = player.mem.points.sub(1e180);
            player.lab.power = player.lab.power.sub(500);
        },
        unlocked(){return hasUpgrade('lab',22)},
        },
        24:{ title: "Set Goals",
        description: "Unlock Research Milestones.",
        cost() { return new Decimal(600)},
        unlocked(){return hasUpgrade('lab',23)},
        currencyDisplayName:"Research Power",
        currencyInternalName:"power",
        currencyLayer:"lab",
        },
        31:{ title: "Truely Aspect Definition.",
        description: "Unlock Light Transformer & Dark Transformer.",
        fullDisplay(){return "<b>Truely Aspect Definition</b><br>Unlock Light Transformer & Dark Transformer.<br><br>Cost: 50,000 Light Tachyons<br>45,000 Dark Matters<br>750 Research Power"},
        unlocked(){return hasUpgrade('lab',24)},
        canAfford(){
            return player.light.points.gte(50000)&&player.dark.points.gte(45000)&&player.lab.power.gte(750);
        },
        pay(){
            player.light.points = player.light.points.sub(50000);
            player.dark.points = player.dark.points.sub(45000);
            player.lab.power = player.lab.power.sub(750);
            },
        },
        32:{ title: "Doll Researches",
        description: "Unlock Doll Transformer.",
        fullDisplay(){return "<b>Doll Researches</b><br>Unlock Doll Transformer.<br><br>Cost: 50 Red Dolls<br>1,000 Research Power"},
        canAfford(){
            return player.kou.points.gte(50)&&player.lab.power.gte(1000);
        },
        pay(){
            player.kou.points = player.kou.points.sub(50);
            player.lab.power = player.lab.power.sub(1000);
            },
        unlocked(){return hasUpgrade('lab',31)},
        },
        33:{ title: "Drop Researches",
        description: "Unlock Forgotten Transformer.",
        fullDisplay(){return "<b>Drop Researches</b><br>Unlock Forgotten Transformer.<br><br>Cost: 1e95 Forgotten Drops<br>1,000 Research Power"},
        canAfford(){
            return player.lethe.points.gte(1e95)&&player.lab.power.gte(1000);
        },
        pay(){
            player.lethe.points = player.lethe.points.sub(1e95);
            player.lab.power = player.lab.power.sub(1000);
            },
        unlocked(){return hasUpgrade('lab',31)},
        },
        34:{ title: "Attempts of Automation",
        description: "All Transformers requirements reduce based on their layers' reset time.",
        fullDisplay(){return "<b>Attempts of Automation</b><br>All Transformers requirements reduce based on their layers' reset time.<br><br>Cost: 1,500 Research Power"},
        canAfford(){
            return player.lab.power.gte(1500);
        },
        pay(){
            player.lab.power = player.lab.power.sub(1500);
            },
        unlocked(){return hasUpgrade('lab',32)&&hasUpgrade('lab',33)},
        },
        41:{ title: "Management",
        description: "Research Points boosts Research Power gain much more.",
        cost() { return new Decimal(10)},
        unlocked(){return hasUpgrade('lab',34)}
        },
        42:{ title: "Light extract",
        description: "Light Transformer requirements /1.5.",
        fullDisplay(){return "<b>Light extract</b><br>Light Transformer requirements ÷1.5.<br><br>Cost: 60,000 Light Tachyons<br>70,000 Research Power"},
        unlocked(){return hasUpgrade('lab',41)},
        canAfford(){
            return player.light.points.gte(60000)&&player.lab.power.gte(70000);
        },
        pay(){
            player.light.points = player.light.points.sub(60000);
            player.lab.power = player.lab.power.sub(70000);
            },
        },
        43:{ title: "Darkness extract",
        description: "Dark Transformer requirements /1.5.",
        fullDisplay(){return "<b>Darkness extract</b><br>Dark Transformer requirements ÷1.5.<br><br>Cost: 57,000 Dark Matters<br>70,000 Research Power"},
        unlocked(){return hasUpgrade('lab',41)},
        canAfford(){
            return player.dark.points.gte(57000)&&player.lab.power.gte(70000);
        },
        pay(){
            player.dark.points = player.dark.points.sub(57000);
            player.lab.power = player.lab.power.sub(70000);
            },
        },
        44:{ title: "Automation",
        description: "Auto all Research Transformers (Research Generator not included).",
        fullDisplay(){return "<b>Automation</b><br>Auto all Research Transformers (Research Generator&Tech Transformer not included).<br><br>Cost: 100 Research Points<br>350,000 Research Power"},
        unlocked(){return hasUpgrade('lab',42)&&hasUpgrade('lab',43)},
        canAfford(){
            return player.lab.points.gte(100)&&player.lab.power.gte(350000);
        },
        pay(){
            player.lab.points = player.lab.points.sub(100);
            player.lab.power = player.lab.power.sub(350000);
            },
        },
        51:{ title: "Anonymous Effect",
        description: "Unlock two new layers of phenomenon you think isn't normal.",
        fullDisplay(){return "<b>Anonymous Effect</b><br>Unlock two new layers of phenomenon which you think aren't normal.<br><br>Cost: 2,000 Research Points.<br>250,000,000 Research Power"},
        unlocked(){return (hasUpgrade('lab',44))||hasAchievement('lab',21)},
        canAfford(){
            return player.lab.points.gte(2000)&&player.lab.power.gte(250000000);
        },
        pay(){
            player.lab.points = player.lab.points.sub(2000);
            player.lab.power = player.lab.power.sub(250000000);
            },
            style: {height: '200px', width: '200px'},
        },
        61:{ title: "Doll Maxmizer",
        description: "You can buy max Red Dolls.",
        fullDisplay(){return "<b>Doll Maxmizer</b><br>You can buy max Red Dolls.<br><br>Cost: 5,000 Research Points<br>80 Red Dolls"},
        unlocked(){return hasUpgrade('lab',51)},
        canAfford(){
            return player.lab.points.gte(5000)&&player.kou.points.gte(80);
        },
        pay(){
            player.lab.points = player.lab.points.sub(5000);
            player.kou.points = player.kou.points.sub(80);
            },
        },
        62:{ title: "Drop Generator",
        description: "Gain 10% of Forgotten Drops gain every second.",
        fullDisplay(){return "<b>Drop Generator</b><br>Gain 10% of Forgotten Drops gain every second.<br><br>Cost: 5,000 Research Points<br>1e130 Forgotten Drops"},
        unlocked(){return hasUpgrade('lab',51)},
        canAfford(){
            return player.lab.points.gte(5000)&&player.lethe.points.gte(1e130);
        },
        pay(){
            player.lab.points = player.lab.points.sub(5000);
            player.lethe.points = player.lethe.points.sub(1e130);
            },
        },
        63:{ title: "Archaeologists",
        description: "Luminous Church itself boosts Research Power gain.",
        fullDisplay(){return "<b>Archaeologists</b><br>Luminous Church itself boosts Research Power gain.<br><br>Cost: 7,500 Research Points<br>1 Luminous Church"},
        unlocked(){return hasUpgrade('lab',61)&&hasUpgrade('lab',62)},
        canAfford(){
            return player.lab.points.gte(7500)&&player.rei.points.gte(1);
        },
        pay(){
            player.lab.points = player.lab.points.sub(7500);
            player.rei.points = player.rei.points.sub(1);
            },
        effect(){
            return player.rei.points.div(10).plus(1);
        },
        },
        64:{ title: "Cartographers",
        description: "Flourish Labyrinth itself boosts Research Power gain.",
        fullDisplay(){return "<b>Cartographers</b><br>Flourish Labyrinth itself boosts Research Power gain.<br><br>Cost: 7,500 Research Points<br>1 Flourish Labyrinth"},
        unlocked(){return hasUpgrade('lab',61)&&hasUpgrade('lab',62)},
        canAfford(){
            return player.lab.points.gte(7500)&&player.yugamu.points.gte(1);
        },
        pay(){
            player.lab.points = player.lab.points.sub(7500);
            player.yugamu.points = player.yugamu.points.sub(1);
            },
        effect(){
            return player.yugamu.points.div(10).plus(1);
        },
        },
        71:{ title: "Doll Factory",
        description: "Unlock Red Dolls Autobuyer",
        fullDisplay(){return "<b>Doll Factory</b><br>Unlock Red Dolls Autobuyer.<br><br>Cost: 2e9 Research Power<br>Req: 125x Red Dolls effect"},
        unlocked(){return hasUpgrade('lab',63)&&hasUpgrade('lab',64)},
        canAfford(){
            return player.lab.power.gte(2e9)&&tmp["kou"].effect.gte(125);
        },
        pay(){
            player.lab.power = player.lab.power.sub(2e9);
            },
        },
        72:{ title: "Ever-Burning Lights",
        description: "Keep 4 color (corner) Beacons among Guiding Beacons when reset.",
        fullDisplay(){return "<b>Ever-Burning Lights</b><br>Keep 4 color (corner) Beacons among Guiding Beacons when reset.<br><br>Cost: 2e9 Research Power<br>Req: 4,000x Forgotten Drops effect"},
        unlocked(){return hasUpgrade('lab',63)&&hasUpgrade('lab',64)},
        canAfford(){
            return player.lab.power.gte(2e9)&&tmp["lethe"].effect.gte(4000);
        },
        pay(){
            player.lab.power = player.lab.power.sub(2e9);
            },
        },
        73:{ title: "Fragment Improvement",
        description: "Fragment Transformer now boosts Fragment generation.",
        fullDisplay(){return "<b>Fragment Improvement</b><br>Fragment Transformer now boosts Fragment generation.<br><br>Cost: 10,000 Research Points<br>1e165 Fragments"},
        unlocked(){return hasUpgrade('lab',71)&&hasUpgrade('lab',72)},
        canAfford(){
            return player.lab.points.gte(10000)&&player.points.gte(1e165);
        },
        pay(){
            player.lab.points = player.lab.points.sub(10000);
            player.points = player.points.sub(1e165);
            },
        },
        74:{ title: "Memory Improvement",
        description: "Memory Transformer now boosts Fragment generation.",
        fullDisplay(){return "<b>Memory Improvement</b><br>Memory Transformer now boosts Memories gain.<br><br>Cost: 10,000 Research Points<br>1e230 Memories"},
        unlocked(){return hasUpgrade('lab',71)&&hasUpgrade('lab',72)},
        canAfford(){
            return player.lab.points.gte(10000)&&player.mem.points.gte(1e130);
        },
        pay(){
            player.lab.points = player.lab.points.sub(10000);
            player.mem.points = player.mem.points.sub(1e130);
            },
        },
        81:{ title: "Doll Adjustment",
        description: "Red Dolls Resets Nothing.",
        fullDisplay(){return "<b>Doll Adjustment</b><br>Red Dolls resets nothing.<br><br>Cost: 5e9 Research Power<br>85 Red Dolls"},
        unlocked(){return hasUpgrade('lab',73)&&hasUpgrade('lab',74)},
        canAfford(){
            return player.lab.power.gte(5e9)&&player.kou.points.gte(85);
        },
        pay(){
            player.lab.power = player.lab.power.sub(5e9);
            player.kou.points = player.kou.points.sub(85);
            },
        },
        82:{ title: "Landmarks",
        description: "Keep 4 landmark (middle of edge) Beacons among Guiding Beacons when reset.",
        fullDisplay(){return "<b>Landmarks</b><br>Keep 4 landmark (middle of edge) Beacons among Guiding Beacons when reset.<br><br>Cost: 5e9 Research Power<br>1e148 Forgotten Drops"},
        unlocked(){return hasUpgrade('lab',73)&&hasUpgrade('lab',74)},
        canAfford(){
            return player.lab.power.gte(5e9)&&player.lethe.points.gte(1e148);
        },
        pay(){
            player.lab.power = player.lab.power.sub(5e9);
            player.lethe.points = player.lethe.points.sub(1e148);
            },
        },
        83:{ title: "Light Improvement",
        description: "Light Transformer now boosts Light Tachyons gain.",
        fullDisplay(){return "<b>Light Improvement</b><br>Light Transformer now boosts Light Tachyons gain.<br><br>Cost: 15,000 Research Points<br>100,000 Light Tachyons"},
        unlocked(){return hasUpgrade('lab',81)&&hasUpgrade('lab',82)},
        canAfford(){
            return player.lab.points.gte(15000)&&player.light.points.gte(100000);
        },
        pay(){
            player.lab.points = player.lab.points.sub(15000);
            player.light.points = player.light.points.sub(100000);
            },
        },
        84:{ title: "Dark Improvement",
        description: "Dark Transformer now boosts Dark Matters gain.",
        fullDisplay(){return "<b>Dark Improvement</b><br>Dark Transformer now boosts Dark Matters gain.<br><br>Cost: 15,000 Research Points<br>97,000 Dark Matters"},
        unlocked(){return hasUpgrade('lab',81)&&hasUpgrade('lab',82)},
        canAfford(){
            return player.lab.points.gte(15000)&&player.dark.points.gte(97000);
        },
        pay(){
            player.lab.points = player.lab.points.sub(15000);
            player.dark.points = player.dark.points.sub(97000);
            },
        },
        91:{ title: "Happiness Extract",
        description: "Challenge Cracking Softcap's positive buff will act as if you are in it, but this challenge no longer experience that buff for more.",
        fullDisplay(){return "<b>Happiness Extract</b><br>Challenge Cracking Softcap's positive buff will act as if you are in it, but this challenge no longer experience that buff for more.<br><br>Cost: 1.5e10 Research Power<br>90 Red Dolls"},
        unlocked(){return hasUpgrade('lab',83)&&hasUpgrade('lab',84)},
        canAfford(){
            return player.lab.power.gte(1.5e10)&&player.kou.points.gte(90);
        }, 
        pay(){
            player.lab.power = player.lab.power.sub(1.5e10);
            player.kou.points = player.kou.points.sub(90);
            },
        },
        92:{ title: "Synergy Connection",
        description: "Keep 8 Synergy Beacons among Guiding Beacons when reset.",
        fullDisplay(){return "<b>Synergy Connection</b><br>Keep 8 Synergy Beacons among Guiding Beacons when reset.<br><br>Cost: 1.5e10 Research Power<br>1e160 Forgotten Drops"},
        unlocked(){return hasUpgrade('lab',83)&&hasUpgrade('lab',84)},
        canAfford(){
            return player.lab.power.gte(1.5e10)&&player.lethe.points.gte(1e160);
        },
        pay(){
            player.lab.power = player.lab.power.sub(1.5e10);
            player.lethe.points = player.lethe.points.sub(1e160);
            },
        },
        93:{ title: "Doll Improvement",
        description: "Doll Transformer now boosts Red Dolls gain.",
        fullDisplay(){return "<b>Doll Improvement</b><br>Doll Transformer now boosts Red Dolls gain.<br><br>Cost: 20,000 Research Points<br>90 Red Dolls"},
        unlocked(){return hasUpgrade('lab',91)&&hasUpgrade('lab',92)},
        canAfford(){
            return player.lab.points.gte(20000)&&player.kou.points.gte(90);
        },
        pay(){
            player.lab.points = player.lab.points.sub(20000);
            player.kou.points = player.kou.points.sub(90);
            },
        },
        94:{ title: "Drop Improvement",
        description: "Forgotten Transformer now boosts Red Dolls gain.",
        fullDisplay(){return "<b>Drop Improvement</b><br>Forgotten Transformer now boosts Forgotten Drops gain.<br><br>Cost: 20,000 Research Points<br>1e170 Forgotten Drops"},
        unlocked(){return hasUpgrade('lab',91)&&hasUpgrade('lab',92)},
        canAfford(){
            return player.lab.points.gte(20000)&&player.lethe.points.gte(1e170);
        },
        pay(){
            player.lab.points = player.lab.points.sub(20000);
            player.lethe.points = player.lethe.points.sub(1e170);
            },
        },
        101:{ title: "The World",
        description: "With so many works done, now it is time to take a glance to that mysterious World.",
        fullDisplay(){return "<b>The World</b><br>With so many works done. Now it is time to take a glance to that mysterious World.<br><br>Cost: 3 Luminous Churches<br>3 Flourish Labyrinths"},
        unlocked(){return (hasUpgrade('lab',93)&&hasUpgrade('lab',94))||hasAchievement('a',64)},
        canAfford(){
            return player.rei.points.gte(3)&&player.yugamu.points.gte(3);
        },
        pay(){
            player.rei.points = player.rei.points.sub(3);
            player.yugamu.points = player.yugamu.points.sub(3);
            },
        onPurchase(){
            player.world.unlocked = true;showTab('none');
        },
            style: {height: '200px', width: '200px'},
        },
        111:{ title: "Outsource Management",
        description: "Research Transformer now boosts Research Points gain.",
        unlocked(){return hasUpgrade('world',21)},
        cost:new Decimal(25000),
        },
        112:{ title: "Priests",
        description: "Luminous Churches boosts Glowing Roses gain.",
        fullDisplay(){return "<b>Priests</b><br>Luminous Churches boosts Glowing Roses gain.<br><br>Cost: 30,000 Research Points<br>4 Luminous Churches"},
        unlocked(){return hasUpgrade('lab',111)},
        canAfford(){
            return player.lab.points.gte(30000)&&player.rei.points.gte(4);
        },
        pay(){
            player.lab.points = player.lab.points.sub(30000);
            player.rei.points = player.rei.points.sub(4);
            },
        effect(){
            return player.rei.points.div(20).plus(1);
        },
        },
        113:{ title: "Tissue Decomposition",
        description: "Research Power boosts Glowing Roses gain.",
        fullDisplay(){return "<b>Tissue Decomposition</b><br>Research Power boosts Glowing Roses gain.<br><br>Cost: 40,000 Research Points<br>150 Glowing Roses"},
        unlocked(){return hasUpgrade('lab',112)},
        canAfford(){
            return player.lab.points.gte(40000)&&player.rei.roses.gte(150);
        },
        pay(){
            player.lab.points = player.lab.points.sub(40000);
            player.rei.roses = player.rei.roses.sub(150);
            },
        effect(){
            return player.lab.power.plus(1).log10().div(10).max(1);
        },
        },
        114:{ title: "Gyroscope",
        description: "Research Power gives you more move times in the Maze.",
        fullDisplay(){return "<b>Gyroscope</b><br>Research Power gives you more move times in the Maze.<br><br>Cost: 40,000 Research Points<br>Req: 30 moved times in the Maze"},
        unlocked(){return hasUpgrade('lab',112)},
        canAfford(){
            return player.lab.points.gte(40000)&&player.yugamu.timesmoved.gte(30);
        },
        pay(){
            player.lab.points = player.lab.points.sub(40000);
            },
        effect(){
            return player.lab.power.plus(1).log10().sqrt().max(0);
        },
        },
        121:{ title: "Storage Battery",
        description: "Research Points gain x1.5, and its softcap x2",
        unlocked(){return hasUpgrade('lab',113)&&hasUpgrade('lab',114)},
        cost:new Decimal(75000),
        },
        122:{ title: "Productivity Transformer",
        description: "Unlock Research Generator & Tech Transformer autobuyer",
        unlocked(){return hasUpgrade('lab',121)},
        cost:new Decimal(90000),
        },
        123:{ title: "Fluorescent Steps",
        description: "Light Tachyons itself boosts The Speed of World Steps gain.",
        fullDisplay(){return "<b>Fluorescent Steps</b><br>Light Tachyons itself boosts The Speed of World Steps gain.<br><br>Cost: 150,000 Research Points<br>7 Luminous Churches"},
        unlocked(){return hasUpgrade('lab',122)},
        canAfford(){
            return player.lab.points.gte(150000)&&player.rei.points.gte(7);
        },
        pay(){
            player.lab.points = player.lab.points.sub(150000);
            player.rei.points = player.rei.points.sub(7);
            },
        effect(){
            return player.light.points.plus(1).log10().div(2.5);
        },
        },
        124:{ title: "Unstable Steps",
        description: "Dark Matters itself boosts The Speed of World Steps gain.",
        fullDisplay(){return "<b>Unstable Steps</b><br>Dark Matters itself boosts The Speed of World Steps gain.<br><br>Cost: 150,000 Research Points<br>7 Flourish Labyrinths"},
        unlocked(){return hasUpgrade('lab',122)},
        canAfford(){
            return player.lab.points.gte(150000)&&player.yugamu.points.gte(7);
        },
        pay(){
            player.lab.points = player.lab.points.sub(150000);
            player.yugamu.points = player.yugamu.points.sub(7);
            },
        effect(){
            return player.dark.points.plus(1).log10().div(2.5);
        },
        },
        131:{ title: "Compass",
        description: "Fomula of the effect you moved North is better",
        fullDisplay(){return "<b>Compass</b><br>Fomula of the effect you moved North is better.<br><br>Cost: 250,000 Research Points<br>Req: Moved North 20 times"},
        unlocked(){return hasUpgrade('lab',123)&&hasUpgrade('lab',124)},
        canAfford(){
            return player.lab.points.gte(250000)&&player.yugamu.buyables[11].gte(20);
        },
        pay(){
            player.lab.points = player.lab.points.sub(250000);
            },
        },
        132:{ title: "Noticeboard",
        description: "Fomula of the effect you moved East is better",
        fullDisplay(){return "<b>Noticeboard</b><br>Fomula of the effect you moved East is better.<br><br>Cost: 250,000 Research Points<br>Req: Moved East 20 times"},
        unlocked(){return hasUpgrade('lab',123)&&hasUpgrade('lab',124)},
        canAfford(){
            return player.lab.points.gte(250000)&&player.yugamu.buyables[22].gte(20);
        },
        pay(){
            player.lab.points = player.lab.points.sub(250000);
            },
        },
        133:{ title: "Garden",
        description: "Fomula of the effect you moved West is better",
        fullDisplay(){return "<b>Garden</b><br>Fomula of the effect you moved West is better.<br><br>Cost: 250,000 Research Points<br>Req: Moved West 20 times"},
        unlocked(){return hasUpgrade('lab',123)&&hasUpgrade('lab',124)},
        canAfford(){
            return player.lab.points.gte(250000)&&player.yugamu.buyables[21].gte(20);
        },
        pay(){
            player.lab.points = player.lab.points.sub(250000);
            },
        },
        134:{ title: "Sky Mark",
        description: "Fomula of the effect you moved South is better",
        fullDisplay(){return "<b>Sky Mark</b><br>Fomula of the effect you moved South is better.<br><br>Cost: 250,000 Research Points<br>Req: Moved South 20 times"},
        unlocked(){return hasUpgrade('lab',123)&&hasUpgrade('lab',124)},
        canAfford(){
            return player.lab.points.gte(250000)&&player.yugamu.buyables[31].gte(20);
        },
        pay(){
            player.lab.points = player.lab.points.sub(250000);
            },
        },
        141:{ title: "Gardenhouse",
        description: "Research Points boosts Glowing Roses gain.",
        unlocked(){return hasUpgrade('lab',131)&&hasUpgrade('lab',132)&&hasUpgrade('lab',133)&&hasUpgrade('lab',134)},
        cost:new Decimal(750000),
        effect(){
            return player[this.layer].points.plus(1).log10().div(15).plus(1);
        },
        },
        142:{ title: "DFS Method",
        description: "Research Points gives you more move times in the Maze.",
        unlocked(){return hasUpgrade('lab',131)&&hasUpgrade('lab',132)&&hasUpgrade('lab',133)&&hasUpgrade('lab',134)},
        cost:new Decimal(750000),
        effect(){
            return player[this.layer].points.plus(1).log10().max(1);
        },
        },
        143:{ title: "The Blueprint of Theology",
        description: "Research Points boosts Luminous Churches gain.",
        fullDisplay(){return "<b>The Blueprint of Theology</b><br>Research Points boosts Luminous Churches gain.<br><br>Cost: 1,000,000 Research Points<br>8 Luminous Churches"},
        unlocked(){return hasUpgrade('lab',141)&&hasUpgrade('lab',142)},
        canAfford(){
            return player.lab.points.gte(1000000)&&player.rei.points.gte(8);
        },
        pay(){
            player.lab.points = player.lab.points.sub(1000000);
            player.rei.points = player.rei.points.sub(8);
            },
            effect(){
                return player[this.layer].points.plus(1).log10().div(10).plus(1);
            },
        },
        144:{ title: "The Blueprint of Anxiety",
        description: "Research Points boosts Flourish Labyrinths gain.",
        fullDisplay(){return "<b>The Blueprint of Anxiety</b><br>Research Points boosts Flourish Labyrinths gain.<br><br>Cost: 1,000,000 Research Points<br>8 Flourish Labyrinths"},
        unlocked(){return hasUpgrade('lab',141)&&hasUpgrade('lab',142)},
        canAfford(){
            return player.lab.points.gte(1000000)&&player.yugamu.points.gte(8);
        },
        pay(){
            player.lab.points = player.lab.points.sub(1000000);
            player.yugamu.points = player.yugamu.points.sub(8);
            },
            effect(){
                return player[this.layer].points.plus(1).log10().div(10).plus(1);
            },
        },
        151:{ title: "Celebrate Anniversary",
        description: "Celebrate first anniversary of setting up your lab.",
        fullDisplay(){return "<b>Celebrate Anniversary</b><br>Celebrate first anniversary of setting up your lab.<br><br>Cost: 9 Luminous Churches<br>9 Flourish Labyrinths<br>900 World Steps"},
        unlocked(){return (hasUpgrade('lab',143)&&hasUpgrade('lab',144))},
        canAfford(){
            return player.rei.points.gte(9)&&player.yugamu.points.gte(9)&&player.world.points.gte(900);
        },
        pay(){
            player.rei.points = player.rei.points.sub(9);
            player.yugamu.points = player.yugamu.points.sub(9);
            player.world.points = player.world.points.sub(900);
            },
        onPurchase(){
            player.storylayer.unlocked = true;showTab('none');
        },
            style: {height: '200px', width: '200px'},
        },
        161:{ title: "Frag Database",
        description: "Fragments enlarge Research Points softcap.",
        unlocked(){return hasUpgrade('storylayer',33)},
        cost:new Decimal(100000000),
        effect(){
            return player.points.plus(1).log10().div(150).max(1);
        },
        },
        162:{ title: "Faster And Higher",
        description: "Research Points lowers World Step Height softcap exponent.",
        unlocked(){return hasUpgrade('lab',161)},
        cost:new Decimal(150000000),
        effect(){
            return player[this.layer].points.plus(1).log10().div(100);
        },
        },
        163:{ title: "Imitate",
        description: "Unlock three new Research Transformers and they are automated without any other conditions.",
        unlocked(){return hasUpgrade('lab',162)},
        cost:new Decimal(200000000),
        },
        164:{ title: "Total Automation",
        description: "Research Transformers below row4 also boost layer effect if have, but all autobuyer related will be force opened ever since.",
        unlocked(){return hasUpgrade('lab',162)},
        cost:new Decimal(200000000),
        onPurchase(){
            if (!player.light.auto) player.light.auto = true;
            if (!player.dark.auto) player.dark.auto = true;
            if (!player.kou.auto) player.kou.auto = true;
        },
        },
    },
    achievements:{//Research Progress
        11: {
            name: "\"All set, Doctor!\" ",
            done() { return hasUpgrade('lab',11)&&hasUpgrade('lab',12)&&hasUpgrade('lab',13)&&hasUpgrade('lab',14) },
            tooltip: "Set your lab be able to work.<br>Rewards:You can now research Research Transformers.",
        },
        12: {
            name: "Nobody Dares Us",
            done() { return player.lab.buyables[11].gte(1) },
            tooltip: "Do researches that you don't like for the first time.<br>Rewards:Earn one Research Point.",
            onComplete(){
                player[this.layer].points=player[this.layer].points.plus(1);
            },
        },
        13: {
            name: "Finally, sth Related",
            done() { return player.lab.buyables[12].gte(1) },
            tooltip: "Do researches relate to what you want to know.<br>Rewards:Research Power gain is now boosted by Research Progresses.",
            effect(){
                let eff = player.lab.achievements.length/3;
                if (eff<1) return 1;
                return eff;
            },
        },
        14: {
            name: "Goals!",
            done() { return hasUpgrade('lab',24) },
            tooltip: "Unlock Research Milestones.",
        },
        15: {
            name: "All Goes On",
            done() { return hasUpgrade('lab',32)&&hasUpgrade('lab',33) },
            tooltip: "Unlock All Research Transformers (For now).",
        },
        16: {
            name: "Social Friendly",
            done() { return player.lab.buyables[42].gte(1) },
            tooltip: "Gain 1 Tech Transformer.",
        },
        21: {
            name: "∀NoNyM0us",
            unlocked(){return hasUpgrade('lab',51)||hasAchievement('lab',21)},
            done() { return hasUpgrade('lab',51) },
            tooltip: "Start Anonymous Research.",
        },
        22: {
            name: "Something More Useful",
            unlocked(){return hasAchievement('lab',21)},
            done() { return hasUpgrade('lab',73)||hasUpgrade('lab',74) },
            tooltip: "Begin to turn your Research Transformers into more useful things.<br>Rewards:Tech Transformer's formula now better.",
        },
        23: {
            name: "Things Become More Intresting~",
            unlocked(){return hasAchievement('lab',21)},
            done() { return hasUpgrade('world',21) },
            tooltip: "Unlock World Researches.",
        },
        24: {
            name: "\"I thought it was a lab about science……\"",
            unlocked(){return hasAchievement('lab',21)},
            done() { return hasUpgrade('lab',112) },
            tooltip: "Hire some priests to your lab.",
        },
        25: {
            name: "Does Anybody Say sth About Softcap™?",
            unlocked(){return hasAchievement('lab',21)},
            done() { return hasUpgrade('lab',121) },
            tooltip: "Enlarge your Research Points capacity.",
        },
        26: {
            name: "\"Let's back to work\"",
            unlocked(){return hasAchievement('lab',21)},
            done() { return hasUpgrade('storylayer',33) },
            tooltip: "Unlock Fragment Researches after you are about to forget the Lab.",
        },
    },
    buyables:{//Research Transformers
			//rows: 1,
			//cols: 1,
			11: {
				title: "Research Power Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(10).times(Decimal.pow(10,x)).div(hasUpgrade('lab',34)?Decimal.log10(player.lab.resetTime+1).div(1.5).max(1):1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.lab.power)+" / "+formatWhole(cost.fo)+" Research Power"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',111)?("<br>Also boosts Research Points gain by x"+format(buyableEffect('lab',11))):"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',21); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.lab.power.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					player.lab.power = player.lab.power.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff = new Decimal(1);
                    if (hasUpgrade('lab',111)) eff = eff.plus(player[this.layer].buyables[this.id].div(100))
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)  },
			},
            12: {
				title: "Fragment Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(1e100).times(Decimal.pow(1e10,x)),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.points)+" / "+formatWhole(cost.fo)+" Fragments"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',73)?("<br>Also boosts Fragment generation by ^"+format(buyableEffect('lab',12))):"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',22); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					player.points = player.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff = new Decimal(1);
                    if (hasUpgrade('lab',73)) eff = eff.plus(player[this.layer].buyables[this.id].div(1000));
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44) },
			},
            13: {
				title: "Memory Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(1e180).times(Decimal.pow(1e5,x)).div(hasUpgrade('lab',34)?Decimal.log10(player.mem.resetTime+1).div(1.5).max(1):1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.mem.points)+" / "+formatWhole(cost.fo)+" Memories"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',74)?("<br>Also boosts Memories gain by ^+"+format(buyableEffect('lab',13))):"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',23); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.mem.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					player.mem.points = player.mem.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff = new Decimal(0);
                    if (hasUpgrade('lab',73)) eff = eff.plus(player[this.layer].buyables[this.id].div(1000));
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)  },
			},
            21: {
				title: "Light Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(50000).plus(new Decimal(5000).times(x)).div(hasUpgrade('lab',34)?Decimal.log10(player.light.resetTime+1).div(1.5).max(1):1).div(hasUpgrade('lab',42)?1.5:1).pow((x.gte(40000))?1.5:1)
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.light.points)+" / "+formatWhole(cost.fo)+" Light Tachyons"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',83)?("<br>Also boosts Light Tachyons gain"+((hasUpgrade('lab',164))?"&effect(÷10)":"")+" by x"+format(buyableEffect('lab',21))):"")+((inChallenge('kou',12)||inChallenge('kou',42)||inChallenge('saya',41))?"<br><b>Unpurchaseable due to Challenge you are taking.</b>":"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',31); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.light.points.gte(cost.fo)&&!inChallenge('kou',12)&&!inChallenge('kou',42)&&!inChallenge('saya',41);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					//player.light.points = player.light.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff = new Decimal(1);
                    if (hasUpgrade('lab',83)) eff = player[this.layer].buyables[this.id].div(50);
                    if (eff.lt(1)) eff = new Decimal(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)&&!inChallenge('kou',12)&&!inChallenge('kou',42)&&!inChallenge('saya',41)},
			},
            22: {
				title: "Dark Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(45000).plus(new Decimal(5000).times(x)).div(hasUpgrade('lab',34)?Decimal.log10(player.dark.resetTime+1).div(1.5).max(1):1).div(hasUpgrade('lab',43)?1.5:1).pow((x.gt(40000))?1.5:1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.dark.points)+" / "+formatWhole(cost.fo)+" Dark Matters"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',84)?("<br>Also boosts Dark Matters gain"+((hasUpgrade('lab',164))?"&effect(÷10)":"")+" by x"+format(buyableEffect('lab',22))):"")+((inChallenge('kou',12)||inChallenge('kou',42)||inChallenge('saya',41))?"<br><b>Unpurchaseable due to Challenge you are taking.</b>":"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',31); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.dark.points.gte(cost.fo)&&!inChallenge('kou',12)&&!inChallenge('kou',42)&&!inChallenge('saya',41);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					//player.dark.points = player.dark.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff = new Decimal(1);
                    if (hasUpgrade('lab',84)) eff = player[this.layer].buyables[this.id].div(50);
                    if (eff.lt(1)) eff = new Decimal(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)&&!inChallenge('kou',12)&&!inChallenge('kou',42)&&!inChallenge('saya',41)   },
			},
            23: {
				title: "Church Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(10).plus(new Decimal(2).times(x)),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.rei.points)+" / "+formatWhole(cost.fo)+" Luminous Churches"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+"<br>Also boosts Luminous Church gain by x"+format(buyableEffect('lab',23));
					return display;
                },
                unlocked() { return hasUpgrade('lab',163); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.rei.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					//player.kou.points = player.rei.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff= player.lab.buyables[this.id].pow(3).max(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',163)},
			},
            31: {
				title: "Doll Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(50).plus(new Decimal(5).times(x)).div(hasUpgrade('lab',34)?Decimal.log10(player.kou.resetTime+1).div(1.5).max(1):1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.kou.points)+" / "+formatWhole(cost.fo)+" Red Dolls"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',93)?("<br>Also boosts Red Dolls gain"+((hasUpgrade('lab',164))?"&effect(÷10)":"")+" by x"+format(buyableEffect('lab',31))):"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',32); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.kou.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					//player.kou.points = player.kou.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff= new Decimal(1);
                    if (hasUpgrade('lab',93)) eff = player.lab.buyables[this.id].div(5);
                    if (eff.lt(1)) eff = new Decimal(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)  },
			},
            32: {
				title: "Forgotten Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(1e95).times(Decimal.pow(1e5,x)).div(hasUpgrade('lab',34)?(Decimal.log10(player.lethe.resetTime+1).div(1.5).max(1)):1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.lethe.points)+" / "+formatWhole(cost.fo)+" Forgotten Drops"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',94)?("<br>Also boosts Forgotten Drops gain"+((hasUpgrade('lab',164))?"&effect(÷10)":"")+" by x"+format(buyableEffect('lab',32))):"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',33); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.lethe.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					player.lethe.points = player.lethe.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff= new Decimal(1);
                    if (hasUpgrade('lab',94)) eff = player.lab.buyables[this.id].div(2.5);
                    if (eff.lt(1)) eff = new Decimal(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',44)  },
			},
            33: {
				title: "Labyrinth Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(10).plus(new Decimal(2).times(x)),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.yugamu.points)+" / "+formatWhole(cost.fo)+" Flourish Labyrinths"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+"<br>Also boosts Flourish Labyrinth gain by x"+format(buyableEffect('lab',23));
					return display;
                },
                unlocked() { return hasUpgrade('lab',163); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.yugamu.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					//player.kou.points = player.yugamu.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff= player.lab.buyables[this.id].pow(3).max(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',163)},
			},
            41: {
				title: "Research Generator",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal.pow(2,x).times(10),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.lab.points)+" / "+formatWhole(cost.fo)+" Research Points"+"<br><br>Level: "+formatWhole(amt) + "<br>You gain "+formatWhole(buyableEffect('lab', 41))+ " Research Points per second.";
					return display;
                },
                unlocked() { return hasMilestone('lab',7); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.lab.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();;
					player.lab.points = player.lab.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                },
                effect(){
                    let eff = player.lab.points.sqrt().div(100).times(player.lab.buyables[this.id]);
                    if (eff.lt(0)) eff = new Decimal(0);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return player.lab.generatorauto },
			},
            42: {
				title: "Tech Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(1000000).times(Decimal.pow(10,x)),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.lab.power)+" / "+formatWhole(cost.fo)+" Research Power"+"<br><br>Level: "+formatWhole(amt) + "<br>You gain "+formatWhole(buyableEffect('lab', 42))+ " Research Points per second.";
					return display;
                },
                unlocked() { return hasMilestone('lab',8); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.lab.power.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();;
					player.lab.power = player.lab.power.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                },
                effect(){
                    let eff = player.lab.power.plus(1).log10().div(10).times(player.lab.buyables[this.id]);
                    if (hasAchievement('lab',22)) eff = player.lab.power.plus(1).ln().div(10).times(player.lab.buyables[this.id])
                    if (eff.lt(0)) eff = new Decimal(0);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return player.lab.generatorauto },
			},
            43: {
				title: "Step Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(10000).plus(new Decimal(1000).times(x)),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.world.points)+" / "+formatWhole(cost.fo)+" World Steps"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+"<br>Also divedes World Steps height by ÷"+format(buyableEffect('lab',43));
					return display;
                },
                unlocked() { return hasUpgrade('lab',163); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.world.points.gte(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
                    player.world.Worldtimer = new Decimal(0);
					player.world.points = player.world.points.sub(cost.fo);
					player.lab.buyables[this.id] = player.lab.buyables[this.id].plus(1);
                    player.lab.points = player.lab.points.plus(1);
                },
                effect(){
                    let eff= player.lab.buyables[this.id].div(50).plus(1);
                    return eff;
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasUpgrade('lab',163)},
			},
    }
})