addLayer("mem", {
    name: "Memories", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        autohold: false,
        autoholdtimer:new Decimal(0),
    }},
    color: "#c939db",
    requires: new Decimal(15), // Can be a function that takes requirement increases into account
    resource: "Memories", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.45, // Prestige currency exponent
    softcap() {
        let sc = new Decimal("1e10");
        if (inChallenge('kou',12)) return sc;
        if (hasUpgrade('dark',21)) sc=sc.times(50);
        if (hasUpgrade('dark',32)) sc=sc.times(upgradeEffect('dark', 32));
        if (hasUpgrade('mem',34)&&hasAchievement('a',23))sc = sc.times((50-Math.sqrt(player.mem.resetTime)<5)?5:50-Math.sqrt(player.mem.resetTime));
        if (hasMilestone('dark',2))sc = sc.times(tmp.dark.effect);
        if (hasAchievement('a',25)) sc = sc.times(player.points.plus(1).log10().plus(1));
        if (hasUpgrade('lethe',22)) sc = sc.times(player.light.points.div(20).max(1));
        if (hasChallenge('kou',22)) sc = sc.times(100).times(tmp.kou.effect.max(1));
        if (hasAchievement('a',44)) sc = sc.times(Math.sqrt(player.mem.resetTime+1));

        return sc;
    },
    softcapPower() {
        let scp = 0.25;
        if (hasUpgrade('light',21)) scp = 0.33;
        if (hasUpgrade('light',32)) scp = 0.40;
        if (hasMilestone('light',2)) scp = scp + 0.02;
        if (hasUpgrade('lethe',33)) scp = scp + 0.08;
        return scp;
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('mem', 12)) mult = mult.times(upgradeEffect('mem', 12))
        if (hasUpgrade('mem', 24)) mult = mult.times(upgradeEffect('mem', 24))
        if (hasUpgrade('mem', 33)) mult = mult.pow(upgradeEffect('mem', 33))
        if (hasUpgrade('mem', 34)&&!hasAchievement('a',22)) mult = mult.times(!hasUpgrade('light', 11)?0.85:upgradeEffect('light', 11))
        if (player.dark.unlocked) mult = mult.times(tmp.dark.effect);
        if (hasUpgrade('light', 12)) mult=mult.times(tmp["light"].effect.div(2).max(1));
        if (hasUpgrade('lethe', 44)&&player.mem.points.lte( upgradeEffect('lethe',44) )) mult = mult.times(player.dark.points.div(20).max(1));
        if (hasUpgrade('lethe',32)||hasUpgrade('lethe',43)) mult = mult.times(tmp.lethe.effect);
        if (hasUpgrade('lethe',23)) mult = mult.times(upgradeEffect('lethe',23));
        if (hasUpgrade('lethe',34)) mult = mult.times(upgradeEffect('lethe',34));
        if (hasMilestone('lab',2)) mult = mult.times(player.lab.power.div(10).max(1));
	    if (hasUpgrade('storylayer',12)) mult = mult.times(upgradeEffect('storylayer',12));


        if (inChallenge("kou",11)) mult = mult.pow(0.75);
        if (inChallenge('rei',11)) mult = mult.pow(0.5);
        if (player.world.restrictChallenge&&!hasUpgrade('storylayer',14)) mult = mult.pow(0.9);

        return mult
    },
    directMult(){
        let eff=new Decimal(1);
        if (hasAchievement('a',15)) eff=eff.times(1.5);
        if (player.lethe.unlocked) eff=eff.times(tmp.lethe.effect);
        if (inChallenge('kou',12)||hasUpgrade('lab',91)) eff=eff.times(10);
        return eff;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('mem', 13)) exp = exp.times(upgradeEffect('mem', 13));
        if (hasUpgrade('lab',74)) exp = exp.plus(buyableEffect('lab',13));
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    hotkeys: [
        {key: "m", description: "M: Reset for Memories", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() { 
        let pg = 0;
        if (hasMilestone('light',3)) pg=pg+0.05;
        if (hasMilestone('dark',3)) pg=pg+0.05;
        if (hasUpgrade('lethe',33)) pg=pg+0.2;
        return pg;
     },

     tabFormat:
         ["main-display",
                "prestige-button",
                "resource-display",
                ["display-text",
				function() {if (hasChallenge('kou',12)) return "Currently, Memory softcap is:"+format(tmp["mem"].softcap)},
					{}],
                "blank",
                "upgrades",
                ["row",[["clickable", 11],["clickable", 12]]],
    ],

    doReset(resettingLayer){
        let keep=[];
        if (layers[resettingLayer].row > this.row) {layerDataReset("mem", keep);
        if (hasMilestone('light',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14,21,22,23,24]);
        if (hasMilestone('dark',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
        if (hasAchievement('a',32)) player[this.layer].upgrades.push(33);
        if ((hasUpgrade('dark', 23)) || (hasMilestone('lethe',4))) player[this.layer].upgrades.push(34);
        if (hasAchievement('a',21)) player[this.layer].upgrades.push(41);
        if (hasAchievement('a',55)) player[this.layer].upgrades.push(42);
        if (hasAchievement("a", 13)&&(resettingLayer!='mem')) player[this.layer].points=new Decimal(5);
        if (hasAchievement("a", 51)&&(resettingLayer!='mem')) player[this.layer].points=new Decimal(100);}
    },

    update(diff){
        if (!player.mem.autohold) player.mem.autoholdtimer=new Decimal(0);
        if (player.mem.autohold) player.mem.autoholdtimer=player.mem.autoholdtimer.plus(diff);
        if (player.mem.autoholdtimer.gte(1)&&canReset(this.layer)){doReset(this.layer);player.mem.autoholdtimer = new Decimal(0);};
        if (isNaN(player[this.layer].points.toNumber())) player[this.layer].points = new Decimal(0);
    },

    upgrades:{
        11:{ title: "Thought Collect",
        description: "Speed up collecting your Fragments.",
        cost() { return new Decimal(1).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        effect() {
            let eff=new Decimal(1.5);
            if (hasUpgrade('mem', 21)) eff=eff.pow(upgradeEffect('mem', 21));
            return eff;
        }
        },
        12:{ title: "Memory Extraction",
        description: "Memories gain is boosted by Memories.",
        cost() {return new Decimal(3).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 11)||hasMilestone('light',1) },
        effect() {
            let eff=player[this.layer].points.plus(1).pow(0.25);
            if (hasUpgrade('mem', 32)) eff=eff.pow(1.25);
            return eff;
        }
        },
        13:{ title: "Algorithm Managing",
        description: "Lower Fragments requirement for further Memories",
        cost() {return new Decimal(10).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 12)||hasMilestone('light',1) },
        effect() {
            let eff=new Decimal(1.25);
            if (hasUpgrade('mem', 23)) eff=eff.pow(upgradeEffect('mem', 23));
            return eff;
        },
        },
        14:{ title: "Fragments Duplication",
        description: "Fragments generation is boosted by Fragments",
        cost() {return new Decimal(20).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 13)||hasMilestone('light',1) },
        effect() {
            return player.points.plus(1).log10().pow(0.75).plus(1).max(1);
        }
        },
        21:{ title: "Thought Combination",
        description: "Thought Collect is much faster",
        cost() {return new Decimal(30).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 14)||hasMilestone('light',1)},
        effect() {
            let eff= new Decimal(2);
            if (hasUpgrade('mem', 31)) eff=eff.pow(upgradeEffect('mem', 31));
            return eff
        }
        },
        22:{ title: "Fragments Prediction",
        description: "Fragments generation is boosted by Memories",
        cost() {return new Decimal(50).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 21)||hasMilestone('light',1) },
        effect() {
            return player[this.layer].points.plus(1).pow(0.5)
        }
        },
        23:{ title: "Time Boosting",
        description: "Algorithm Managing is effected by Fragments.",
        cost() {return new Decimal(100).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 22)||hasMilestone('light',1) },
        effect() {
            return player.points.plus(1).times(1.5).log10().log10(2).pow(0.01).plus(1).max(1);
        }
        },
        24:{ title: "Directly Drown",
        description: "Memories gain is boosted by Fragments.",
        cost() {return new Decimal(1000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 23)||hasMilestone('light',1) },
        effect() {
            return player.points.plus(1).pow(0.05).plus(1).log10().plus(2).log10(5).plus(1).max(1);
        }
        },
        31:{ title: "Thought Growth",
        description: "Thought Combination is boosted by Memories",
        cost() {return new Decimal(20000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 24)||hasMilestone('dark',1) },
        effect() {
            return player[this.layer].points.plus(1).log10().pow(0.5).log10(2).max(1);
        },
        },
        32:{ title: "Memory Inflation",
        description: "Memory Extraction is much faster.",
        cost() {return new Decimal(50000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 31)||hasMilestone('dark',1) },
        },
        33:{ title: "Directly Transfer",
        description() {
            return  "Memories gain is massively boosted, but "+(hasMilestone('kou',2)?"":"with Fragments gain massively decreased and ")+"Fragments&Memories set to 1."},
        cost(){return new Decimal(1000000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return hasUpgrade("mem", 32)},
        effect() {//Mem, not Frag
            let eff = new Decimal(1.5);
            if (hasUpgrade("light", 33)) eff=eff.plus(upgradeEffect('light', 33))
            return eff;
        },
        onPurchase(){player.points=new Decimal(1);player[this.layer].points = new Decimal(1);},
        },
        34:{ title: "Conclusion",
        description() {
            if (hasAchievement('a',23)) return "Push Memory softcap starts later but with Fragments&Memories set to 1.";
            if (hasAchievement('a',22)) return "Useless and Fragments&Memories set to 1.";
            return "Unlock two new layers, but with Memories gain decreased and Fragments&Memories set to 1.";
        },
        cost() {return new Decimal(10000000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42)},
        unlocked() { return (hasUpgrade("mem", 33)||hasUpgrade("dark",23))},
        onPurchase(){player.points=new Decimal(1);player[this.layer].points = new Decimal(1);},
        },
        41:{ title: "Build Up The Core.",
        fullDisplay(){
            if(hasAchievement('a',21)) return "<b>Eternal Core</b></br>A core build up by massive Memories and a little Lights&Darks, which contains nearly endless energy.";
            return "<b>Build Up The Core.</b></br>Unlock two new layers, but sacrifice all your progresses.</br></br>Cost: 1e23 Memories</br>65 Light Tachyons</br>65 Dark Matters"
        },
        description: "Unlock two new layers, but sacrifice all your progresses.",
        canAfford(){return player[this.layer].points.gte(1e23)&&player.dark.points.gte(65)&&player.light.points.gte(65)},
        pay(){
            player[this.layer].points = player[this.layer].points.sub(1e23);
            player.dark.points = player.dark.points.sub(65);
            player.light.points = player.light.points.sub(65);
        },
        unlocked() { return ( (hasUpgrade("dark", 34)&&hasUpgrade("light",34))|| hasAchievement('a',21))},
        style(){return {'height':'200px', 'width':'200px'}},
        onPurchase(){doReset('kou',true);showTab('none');player[this.layer].upgrades=[41];},
        },
        42:{ title: "Set Up The Lab.",
        fullDisplay(){
            if(hasAchievement('a',55)) return "<b>The Lab</b></br>The Lab has been set up. Now go for more professional researches."
            return "<b>Set Up The Lab.</b></br>With the experiences and the resources you have, you are now going to set up a lab to research all these things.</br></br>Cost: 1e135 Fragments</br>75 Red Dolls</br>1e107 Forgotten Drops"
        },
        canAfford(){return player.points.gte(1e135)&&player.kou.points.gte(75)&&player.lethe.points.gte(1e107)},
        pay(){
            player.points = player.points.sub(1e135);
            player.kou.points = player.kou.points.sub(75);
            player.lethe.points = player.lethe.points.sub(1e107);
        },
        unlocked() { return (hasChallenge('kou',51))||hasAchievement('a',55)},
        style(){return {'height':'200px', 'width':'200px'}},
        onPurchase(){showTab('none');player.lab.unlocked = true;player.lab.points= new Decimal(1);},
        },
    },
    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "",
            display: "Remove all Memory upgrades",
            unlocked() { return player.light.unlocked||player.dark.unlocked },
            canClick() { return player.mem.upgrades.length>0&&!inChallenge('kou',42) },
            onClick() { 
                if (!confirm("This button is designed for where you think you are stucked, are you sure to remove all Memory upgrades?(Milestones will still active)")) return;
                player.mem.upgrades = [];
                if (hasMilestone('light',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14,21,22,23,24]);
                if (hasMilestone('dark',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
                 if (hasAchievement('a',32)) player[this.layer].upgrades.push(33);
                if ((hasUpgrade('dark', 23)) || (hasMilestone('lethe',4))) player[this.layer].upgrades.push(34);
                if (hasAchievement('a',21)) player[this.layer].upgrades.push(41);
                if (hasAchievement('a',55)) player[this.layer].upgrades.push(42);
            },
            style: {width: "100px", height: "50px"},
        },
        12: {
			title: "Auto hold M",
			display(){
				return (player.mem.autohold?"On":"Off")
			},
			unlocked() { return true },
			canClick() { return true },
			onClick() { player.mem.autohold = !player.mem.autohold },
			style: {"background-color"() { return player.mem.autohold?"#c939db":"#666666" }},
		    },
    },
})

addLayer("light", {
    name: "Light Tachyon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best:new Decimal(0),
        total:new Decimal(0),
        unlockOrder:0,
        auto: false,
    }},
    unlockOrder(){return (hasAchievement('a',14)?0:player[this.layer].unlockOrder);},
    color: "#ededed",
    requires(){return new Decimal(2e8).times((player.light.unlockOrder&&!player.light.unlocked)?100:1)}, // Can be a function that takes requirement increases into account
    resource: "Light Tachyons", // Name of prestige currency
    baseResource: "Memories", // Name of resource prestige is based on
    baseAmount() {return player.mem.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["mem"],
    exponent() {
        let ex = new Decimal(1.25);
        if (hasUpgrade('light', 22)) ex=ex.plus(-0.15);
        if (hasUpgrade('light', 34)) ex=ex.plus(-0.05);
        return ex;
    }, // Prestige currency exponent
    base:1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade("light", 13)) mult=mult.div(tmp.light.effect.pow(0.15));
        if (hasUpgrade("light", 14)) mult=mult.div(upgradeEffect('light', 14));
        if (hasUpgrade("dark", 24)) mult=mult.div(tmp.dark.effect);
        if (hasUpgrade('dark', 34)) mult=mult.div(upgradeEffect('dark', 34));
        if (hasUpgrade('lethe',32)) mult = mult.div(tmp.lethe.effect);
        if (hasUpgrade('lethe',23)) mult = mult.div(upgradeEffect('lethe',23));
        if (inChallenge("kou",21)) mult = mult.times(player.dark.points.plus(1).pow(5).max(1));
        if (inChallenge("kou",31)) mult = mult.div(player.dark.points.sub(player[this.layer].points).max(1));
        if (hasChallenge("kou",31)) mult = mult.div(player.dark.points.sub(player[this.layer].points).div(2).max(1));
        if (hasUpgrade('lethe',11)) mult = mult.div(upgradeEffect('lethe',11));
        if (hasUpgrade('lethe',41)) mult = mult.div(upgradeEffect('lethe',41));
        if (hasMilestone('lab',3)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab',83)) mult = mult.div(buyableEffect('lab',21));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1);
        return exp
    },
    directMult(){
        let dm=new Decimal(1);
        if (player.kou.unlocked) dm=dm.times(tmp.kou.effect);
        if (inChallenge("kou",11)) dm = dm.times(1.5);
        if (inChallenge('kou',12)||hasUpgrade('lab',91)) dm=dm.times(10);
        if (hasAchievement('a',43)) dm=dm.times(player.dark.points.div(player.light.points.max(1)).max(1).min(5));
        if (inChallenge("kou",31)&&player.dark.points.lt(player[this.layer].points)) dm = dm.times(0.1);
        if (inChallenge('kou',42)) dm = dm.times(2);
        return dm;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    hotkeys: [
        {key: "l", description: "L: Reset for Light Tachyons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('mem', 34)||hasMilestone("light", 0)},
    autoPrestige(){return (hasAchievement('a',34)&&player.light.auto)},
    increaseUnlockOrder: ["dark"],

    milestones: {
        0: {
            requirementDescription: "1 Light Tachyon",
            done() { return player.light.best.gte(1)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "This Layer no longer hidden & Light Upgrades give back its cost by Achievements.",
        },
        1: {
            requirementDescription: "5 Light Tachyons",
            done() { return player.light.best.gte(5)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Keep all your row1&row2 Memory upgrades when L or D reset.",
        },
        2: {
            requirementDescription: "15 Light Tachyons",
            done() { return player.light.best.gte(15)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Make Memories gain After softcap's exponent +0.02.",
        },
        3: {
            requirementDescription: "30 Light Tachyons",
            done() { return player.light.best.gte(30)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Gain 5% of Memories gain every second.",
        },
    },

    doReset(resettingLayer){
        let keep=[];
        if (hasAchievement('a',34)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {layerDataReset('light', keep);
        if (hasMilestone('kou',0)) {player[this.layer].upgrades.push(22);player[this.layer].milestones = player[this.layer].milestones.concat([0,1])};
        if (hasMilestone('kou',1))  player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
        if (hasMilestone('kou',3))  player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32,33,34]);
        if (hasMilestone('kou',4))  player[this.layer].upgrades = player[this.layer].upgrades.concat([21,23,24]);
        if (hasMilestone('kou',5))  player[this.layer].milestones = player[this.layer].milestones.concat([2,3]);
        }
        if (player.tab=='light'&&(!hasUpgrade('dark', 23)&&!hasMilestone('light',0))) showTab('none');
    },
    canBuyMax() { return hasUpgrade('light', 22) },
    resetsNothing(){return hasMilestone('kou',6)},

    effectBase(){
        let base = new Decimal(1.5);
        return base;
    },
    effect(){
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff=Decimal.times(tmp.light.effectBase,player.light.points.plus(1));
        if (hasUpgrade('light',31)) eff=eff.times(player[this.layer].points.sqrt());
        if (hasAchievement('a',33)) eff=eff.times(Decimal.log10(player[this.layer].resetTime+1).plus(1));
        if (hasChallenge("kou", 11)) eff=eff.times(player.points.plus(1).log10().plus(1).sqrt());
        if (inChallenge('kou',22)) eff=eff.times(Math.random());
        if (hasUpgrade('lethe',13)) eff=eff.times(tmp.kou.effect.pow(1.5));
        if (hasUpgrade('lethe',31)) eff=eff.times(tmp.lethe.effect);
        if (hasUpgrade('lethe',14)) eff=eff.times(upgradeEffect('lethe',14));

        //pow
        if (inChallenge('kou',32)) eff=eff.pow(Math.random());

        if (eff.lt(1)) return new Decimal(1);
        return eff;
    },
    effectDescription() {
        return "which are boosting Fragments generation by "+format(tmp.light.effect)+"x"
    },

    upgrades:{
        11:{ title: "Optimistic Thoughts",
        description: "Conclusion decreases Memories gain less.",
        unlocked() { return player.light.unlocked },
        effect() {
            return (hasUpgrade('light',21))?new Decimal(0.95):new Decimal(0.9);
        },
        onPurchase(){
            if (hasMilestone('light',0)&&!hasAchievement('a',22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
            if (hasAchievement('a',22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost);
        },
        cost() {return new Decimal(1).times(tmp["kou"].costMult42l)},
        },
        12:{ title: "Wandering For Beauty",
        description: "Light Tachyons also effects Memories gain at a reduced rate.",
        unlocked() { return hasUpgrade("light", 11) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(3).times(tmp["kou"].costMult42l)},
        },
        13:{ title: "Experiencing Happiness",
        description: "Light Tachyons also effects its own gain at a reduced rate.",
        unlocked() { return hasUpgrade("light", 12) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(5).times(tmp["kou"].costMult42l)},
        },
        14:{ title: "After That Butterfly",
        description: "Light Tachyons itself boosts its own gain.",
        unlocked() { return hasUpgrade("light", 13) },
        effect() {
            return player[this.layer].points.plus(1).log10().plus(1).pow(0.5);
        },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(8).times(tmp["kou"].costMult42l)},
        },
        21:{ title: "Seeking Delight.",
        description: "Conclusion decreases Memories gain more less, and gain ^0.33 instead of ^0.25 Memories after softcap.",
        unlocked() { return hasUpgrade("light", 14) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(10).times(tmp["kou"].costMult42l)},
        },
        22:{ title: "More Brightness",
        description: "You can buy max Light Tachyons And lower Memories requirement for further Light Tachyons",
        unlocked() { return hasUpgrade("light", 21)||hasMilestone('kou',0) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(15).times(tmp["kou"].costMult42l)},
        },
        23:{ title: "Fragment Sympathy",
        description: "Directly Transfer decreases Fragments gain less.",
        unlocked() { return hasUpgrade("light", 22) },
        onPurchase(){
            if (hasMilestone('light',0)&&!hasAchievement('a',32)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
            if (hasAchievement('a',32)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost);
        },
        cost() {return new Decimal(20).times(tmp["kou"].costMult42l)},
        },
        24:{ title: "Sadness Overjoy",
        description: "Light Tachyons also effects Dark Matters gain.",
        unlocked() { return hasUpgrade("light", 23) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(30).times(tmp["kou"].costMult42l)},
        },
        31:{ title: "Hardware BUS",
        description: "Light Tachyons effect formula now much better.",
        unlocked() { return hasUpgrade("light", 24)||hasMilestone('kou',3) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(35).times(tmp["kou"].costMult42l)},
        },
        32:{ title: "Moments of Lifes",
        description: "Gain ^0.40 instead of ^0.33 Memories after softcap.",
        unlocked() { return hasUpgrade("light", 31)||hasMilestone('kou',3) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(40).times(tmp["kou"].costMult42l)},
        },
        33:{ title: "Prepare To Travel",
        description: "Light Tachyons itself now makes Directly Transfer boosts more Memories gain.",
        unlocked() { return hasUpgrade("light", 32)||hasMilestone('kou',3) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            let eff = player[this.layer].points.div(500);
            if (eff.lte(0.1)) return new Decimal(0.1);
            if (eff.gt(0.3)) return new Decimal(0.3);
            return eff;
        },
        cost() {return new Decimal(44).times(tmp["kou"].costMult42l)},
        },
        34:{ title: "The Light",
        description: "Lower Memories requirement for further Light Tachyons, and Light Tachyons itself now boosts Dark Matters gain.",
        unlocked() { return hasUpgrade("light", 33)||hasMilestone('kou',3) },
        onPurchase(){
            if (hasMilestone('light',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            let eff = player[this.layer].points.div(3);
            if (eff.lt(1.25)) return new Decimal(1.25);
            return eff;
        },
        cost() {return new Decimal(48).times(tmp["kou"].costMult42l)},
        },
    }
})

addLayer("dark", {
    name: "Dark Matters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best:new Decimal(0),
        total:new Decimal(0),
        unlockOrder:0,
        auto: false,
    }},
    unlockOrder(){return (hasAchievement('a',14)?0:player[this.layer].unlockOrder);},
    color: "#383838",
    requires(){return new Decimal(9999).times((player.dark.unlockOrder&&!player.dark.unlocked)?5:1)}, // Can be a function that takes requirement increases into account
    resource: "Dark Matters", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["mem"],
    exponent() {
        let ex = new Decimal(1.25);
        if (hasUpgrade('dark', 22)) ex=ex.plus(-0.15);
        if (hasUpgrade('dark', 34)) ex=ex.plus(-0.05);
        return ex;
    },  // Prestige currency exponent
    base:1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("dark", 13)) mult=mult.div(tmp.dark.effect.pow(0.5));
        if (hasUpgrade("dark", 14)) mult=mult.div(upgradeEffect('dark', 14));
        if (hasUpgrade("light", 24)) mult=mult.div(tmp.light.effect);
        if (hasUpgrade("dark", 33)) mult=mult.div(upgradeEffect('dark', 33));
        if (hasUpgrade('light', 34)) mult=mult.div(upgradeEffect('light', 34));
        if (hasUpgrade('lethe',43)) mult = mult.div(tmp.lethe.effect);
        if (hasUpgrade('lethe',34)) mult = mult.div(upgradeEffect('lethe',34));
        if (inChallenge("kou",21)) mult = mult.times(player.light.points.plus(1).pow(5).max(1));
        if (inChallenge("kou",31)) mult = mult.div(player.light.points.sub(player[this.layer].points).max(1));
        if (hasChallenge("kou",31)) mult = mult.div(player.light.points.sub(player[this.layer].points).div(2).max(1));
        if (hasMilestone('lab',4)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab',84)) mult = mult.div(buyableEffect('lab',22));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1); 
        return exp;
    },

    directMult(){
        let dm=new Decimal(1);
        if (player.kou.unlocked) dm=dm.times(tmp.kou.effect);
        if (inChallenge("kou",11)) dm = dm.times(1.5);
        if (inChallenge('kou',12)||hasUpgrade('lab',91)) dm=dm.times(10);
        if (hasAchievement('a',43)) dm=dm.times(player.light.points.div(player.dark.points.max(1)).max(1).min(5));
        if (inChallenge("kou",31)&&player.light.points.lt(player[this.layer].points)) dm = dm.times(0.1);
        if (inChallenge('kou',42)) dm = dm.times(2);
        return dm;
    },

    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    hotkeys: [
        {key: "d", description: "D: Reset for Dark Matters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('mem', 34)||hasMilestone('dark',0)},
    autoPrestige(){return (hasAchievement('a',34)&&player.dark.auto)},
    increaseUnlockOrder: ["light"],

    milestones: {
        0: {
            requirementDescription: "1 Dark Matter",
            done() { return player.dark.best.gte(1)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "This Layer no longer hidden & Dark Upgrades give back its cost by Achievements.",
        },
        1: {
            requirementDescription: "5 Dark Matters",
            done() { return player.dark.best.gte(5)&&hasAchievement('a',21)},
            
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Keep your first two Memory upgrades on row 3 when L or D reset.",
        },
        2: {
            requirementDescription: "15 Dark Matters",
            done() { return player.dark.best.gte(15)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Dark Matters' affection now also makes Memory softcap starts later.",
        },
        3: {
            requirementDescription: "30 Dark Matters",
            done() { return player.dark.best.gte(30)&&hasAchievement('a',21)},
            unlocked(){return hasAchievement('a',21)},
            effectDescription: "Gain 5% of Memories gain every second.",
        },
    },

    doReset(resettingLayer){
        let keep=[];
        if (hasAchievement('a',34)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {layerDataReset('dark', keep);
        if (hasMilestone('lethe',0)) {player[this.layer].upgrades.push(22);player[this.layer].milestones = player[this.layer].milestones.concat([0,1])};
        if (hasMilestone('lethe',1))  player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
        if (hasMilestone('lethe',3))  player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32,33,34]);
        if (hasMilestone('lethe',4))  player[this.layer].upgrades = player[this.layer].upgrades.concat([21,23,24]);
        if (hasMilestone('lethe',5))  player[this.layer].milestones = player[this.layer].milestones.concat([2,3]);
        };
        if (player.tab=='dark'&&(!hasUpgrade('dark', 23)&&!hasMilestone('dark',0))) showTab('none');
    },
    canBuyMax() { return hasUpgrade('dark', 22) },
    resetsNothing(){return hasMilestone('lethe',6)},

    effectBase(){
        let base = new Decimal(1.5);
        return base;
    },
    effect(){
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff=Decimal.pow(player[this.layer].points.plus(1).log10().plus(1),tmp.dark.effectBase);
        if (hasUpgrade('dark', 31)) eff = Decimal.pow(player[this.layer].points.plus(1).times(2).sqrt().plus(1),tmp.dark.effectBase);
        if (hasAchievement('a',33)) eff=eff.times(Decimal.log10(player[this.layer].resetTime+1).plus(1));
        if (hasChallenge("kou", 11)) eff=eff.times(player.points.plus(1).log10().plus(1).sqrt());
        if (inChallenge('kou',22)) eff=eff.times(Math.random());
        if (hasUpgrade('lethe',35)) eff = eff.times(tmp.kou.effect.pow(1.5));
        if (hasUpgrade('lethe',53)) eff=eff.times(tmp.lethe.effect);
        if (hasUpgrade('lethe',52)) eff=eff.times(upgradeEffect('lethe',52));
        if (hasUpgrade('lethe',25)) eff=eff.times(upgradeEffect('lethe',25));
        if (hasUpgrade('lethe',55)) eff=eff.times(upgradeEffect('lethe',55));

        //pow
        if (inChallenge('kou',32)) eff=eff.pow(Math.random());

        if (eff.lt(1)) return new Decimal(1);
        return eff;
    },
    effectDescription() {
        return "which are boosting Memories gain by "+format(tmp.dark.effect)+"x"
    },
    upgrades:{
        11:{ title: "Overclock",
        description: "Your Fragments generation is doubled when under 9999",
        unlocked() { return player.dark.unlocked },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(1).times(tmp["kou"].costMult42d)},
        effect() {
            let eff = new Decimal(9999);
            if (hasUpgrade('dark',21)) eff=eff.times(upgradeEffect('dark',21));
            return eff;
        },
        },
        12:{ title: "Seeking For Other Sides",
        description: "Dark Matters also effects Fragments generation at a reduced rate.",     
        unlocked() { return hasUpgrade("dark", 11) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(3).times(tmp["kou"].costMult42d)},
        },
        13:{ title: "Crack Everything",
        description: "Dark Matters also effects its own gain at a reduced rate.",
        unlocked() { return hasUpgrade("dark", 12) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(5).times(tmp["kou"].costMult42d)},
        },
        14:{ title: "Wrath In Calm",
        description: "Dark Matters itself boosts its own gain.",
        unlocked() { return hasUpgrade("dark", 13) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            return player[this.layer].points.plus(1).log10().plus(1).pow(0.5);
        },
        cost() {return new Decimal(8).times(tmp["kou"].costMult42d)},
        },
        21:{ title: "Power Override",
        description: "Overclock ends at 19,998 and Memories softcap starts 50x later.",
        unlocked() { return hasUpgrade("dark", 14) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            return new Decimal(2);
        },
        cost(){return new Decimal(10).times(tmp["kou"].costMult42d)},
        },
        22:{ title: "More Darkness",
        description: "You can buy max Dark Matters And lower Fragments requirement for further Dark Matters",
        unlocked() { return hasUpgrade("dark", 21)||hasMilestone('lethe',0)},
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(15).times(tmp["kou"].costMult42d)},
        },
        23:{ title: "Force Operation",
        description: "Keep Conclusion upgrade when L or D reset.",
        unlocked() { return hasUpgrade("dark", 22)&&(hasUpgrade("light", 21)||hasMilestone('lethe',2)) },
        onPurchase(){
            if (hasMilestone('dark',0)&&!hasAchievement('a',22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
            if (hasAchievement('a',22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost);player.mem.upgrades.push(34)
        },
        cost() {return new Decimal(20).times(tmp["kou"].costMult42d)},
        },
        24:{ title: "Calm in Warth",
        description: "Dark Matters also effects Light Tachyons gain.",
        unlocked() { return hasUpgrade("dark", 23) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(30).times(tmp["kou"].costMult42d)},
        },
        31:{ title: "Memory Organizing",
        description: "Dark Matters effect formula now much better.",
        unlocked() { return hasUpgrade("dark", 24)||hasMilestone('lethe',3) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        cost() {return new Decimal(35).times(tmp["kou"].costMult42d)},
        },
        32:{ title: "Moments of Anger",
        description: "Dark Matters itself makes Memories softcap starts later.",
        unlocked() { return hasUpgrade("dark", 31)||hasMilestone('lethe',3) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            let eff = player[this.layer].points.div(2);
            if (eff.lt(1.5)) return new Decimal(1.5);
            return eff;
        },
        cost() {return new Decimal(40).times(tmp["kou"].costMult42d)},
        },
        33:{ title: "Prepare To Bleed",
        description: "Achievements now boost Dark Matters gain.",
        unlocked() { return hasUpgrade("dark", 32)||hasMilestone('lethe',3) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            let eff = player.a.achievements.length;
            if (eff<= 1) return 1;
            return eff;
        },
        cost() {return new Decimal(44).times(tmp["kou"].costMult42d)},
        },
        34:{ title: "The Dark",
        description: "Lower Fragments requirement for further Dark Matters, and Dark Matters itself now boosts Light Tachyons gain.",
        unlocked() { return hasUpgrade("dark", 33)||hasMilestone('lethe',3) },
        onPurchase(){
            if (hasMilestone('dark',0)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times( new Decimal( 0.5+(player.a.achievements.length-6)/10).min(1) ).floor() );
        },
        effect() {
            let eff = player[this.layer].points.div(3);
            if (eff.lt(1.25)) return new Decimal(1.25);
            return eff;
        },
        cost() {return new Decimal(48).times(tmp["kou"].costMult42d)},
        },
    }
})

addLayer("kou", {
    name: "Red Dolls", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best:new Decimal(0),
        total:new Decimal(0),
        unlockOrder:0,
    }},
    color: "#ffa0be",
    requires(){return new Decimal(1e30).times((player.kou.unlockOrder&&!player.kou.unlocked)?15:1)}, // Can be a function that takes requirement increases into account
    resource: "Red Dolls", // Name of prestige currency
    baseResource: "Memories", // Name of resource prestige is based on
    baseAmount() {return player.mem.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["light"],
    base:2,
    exponent() {
        let ex = new Decimal(1.5);
        return ex;
    },  // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);//不要忘了这里是static层
        if (hasMilestone('lethe',5)) mult=mult.div(tmp.lethe.effect);
        if (hasAchievement('a',35)) mult = mult.div(tmp.light.effect);
        if (hasUpgrade('lethe',24)) mult = mult.div(player.points.plus(1).log10().max(1).div(100).plus(1));
        if (hasUpgrade('lethe',23)) mult = mult.div(upgradeEffect('lethe',23));
        if (hasMilestone('lab',5)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab',93)) mult = mult.div(buyableEffect('lab',31));
        if (hasMilestone('rei',4)) mult = mult.div(player.rei.roses.plus(1).log10().times(2).max(1));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1); 
        return exp;
    },

    effectBase:1.5,

    effect(){
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff=new Decimal(player[this.layer].points.times(0.1).plus(1));
        if (inChallenge('kou',22)) eff=eff.times(1+Math.random()*0.5);
        if (hasUpgrade('lethe',15)) eff=eff.times(upgradeEffect('lethe',15));
        if (hasUpgrade('lethe',12)) eff=eff.times(upgradeEffect('lethe',12));
        if (hasUpgrade('lethe',45)) eff=eff.times(upgradeEffect('lethe',45));
        
        //pow
        if (inChallenge('kou',32)) eff=eff.pow(1+Math.random()*0.1);
        if (hasChallenge('kou',32)) eff=eff.pow(1+((!hasMilestone('rei',2))?(Math.random()*0.05):0.05));

        //↓这个永远放在最后
        if (hasChallenge('kou',22)) eff=eff.plus((!hasMilestone('rei',2))?(Math.random()*0.5):0.5);
        return eff;
    },
    effectDescription() {
        return "which are directly boosting Light Tachyons and Dark Matters gain by "+format(tmp.kou.effect)+"x"
    },
    canBuyMax() { return hasUpgrade('lab', 61) },
    autoPrestige(){return (hasUpgrade('lab',71)&&player.kou.auto)},
    resetsNothing(){return hasUpgrade('lab',81)},

    row: 2, // Row the layer is in on the tree (0 is the first row)
    displayRow: 1,
    hotkeys: [
        {key: "r", description: "R: Reset for Red dolls", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a',21)},
    increaseUnlockOrder: ["lethe"],

    doReset(resettingLayer){
        let keep=[];
        if (hasUpgrade('lab',71)) keep.push("auto");
        if (hasMilestone('rei',1)) keep.push("challenges");
        if (layers[resettingLayer].row > this.row) {layerDataReset("kou", keep);
        if(hasMilestone('rei',0)) player.kou.milestones = player.kou.milestones.concat([0,1,2,3,4,5,6]);
        if (hasMilestone('rei',1)) player.kou.milestones.push(7);
        if (hasAchievement('a',63)) player.kou.challenges[51] = 1;}
    },

    milestones: {
        0: {
            requirementDescription: "1 Red Doll",
            done() { return player.kou.best.gte(1)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Keep first two Milestones and More Brightness upgrades of Light Tachyon layer when R or F reset.",
        },
        1: {
            requirementDescription: "2 Red Dolls",
            done() { return player.kou.best.gte(2)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Keep first row upgrades of Light Tachyon layer when R or F reset.",
        },
        2: {
            requirementDescription: "3 Red Dolls",
            done() { return player.kou.best.gte(3)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Directly Transfer no longer decreases your Fragments generation.",
        },
        3: {
            requirementDescription: "10 Red Dolls",
            done() { return player.kou.best.gte(10)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Keep third row upgrades of Light Tachyon layer when R or F reset.",
        },
        4: {
            requirementDescription: "12 Red Dolls",
            done() { return player.kou.best.gte(12)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Keep second row upgrades of Light Tachyon layer when R or F reset.",
        },
        5: {
            requirementDescription: "13 Red Dolls",
            done() { return player.kou.best.gte(13)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Keep last two Milestones of Light Tachyon layer when R or F reset, and Red Dolls effect also boosts Forgotten Drops gain.",
        },
        6: {
            requirementDescription: "15 Red Dolls",
            done() { return player.kou.best.gte(15)},
            unlocked(){return player.kou.unlocked},
            effectDescription: "Light Tachyon layer resets nothing.",
        },
        7: {
            requirementDescription: "20 Red Dolls",
            done() { return player.kou.best.gte(20)},
            unlocked(){return hasMilestone('kou',6)},
            effectDescription: "Unlock Happiness Challenges.",
        },
    },

    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",]
        },
        "Happiness Challenges": {
            unlocked() { return hasMilestone('kou',7) },
            buttonStyle() { return {'background-color': '#bd003c'} },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function() {return 'You have ' + formatWhole(player.mem.points)+' Memories.'},
                        {}],
                "blank","challenges"]
        },
    },
    upgrades:{
    },

    //42
    costMult42(){
        let mult = new Decimal(1);
			if (inChallenge("kou", 42)) mult = mult.times(Decimal.pow(10, Decimal.pow(player.mem.upgrades.length, 2)))
			return mult;
    },
    costExp42() {
        let exp = new Decimal(1);
        if (inChallenge("kou", 42)) exp = exp.times(Math.pow(player.mem.upgrades.length, 2)*4+1)
        return exp;
    },
    costMult42l() {
        let mult = new Decimal(1);
        if (inChallenge("kou", 42)) mult = mult.times(player.light.upgrades.length*3+1)
        return mult;
    },
    costMult42d() {
        let mult = new Decimal(1);
        if (inChallenge("kou", 42)) mult = mult.times(player.dark.upgrades.length*3+1)
        return mult;
    },


    challenges:{
        cols:2,
        11:{
            name: "Broken Toyhouse",
            completionLimit: 1,
            challengeDescription: "Light Tachyons & Dark Matters gain x1.5, but with Fragments & Memories gain ^0.75.",
            unlocked() { return hasMilestone('kou',7)},
            goal() { return new Decimal(1e23) },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "Fragments will improve Light Tachyon & Dark Matter's effect.",
        },
        12:{
            name: "Cracking Softcap",
            completionLimit: 1,
            challengeDescription: "Nothing can make your Memory softcap starts later, but Directgains in L,D and M which are not affected by softcap now x10.",
            unlocked() { return hasChallenge('kou',11)},
            goal() { return new Decimal(1e63) },
            onExit(){
                if (tmp["kou"].resetsNothing) {player.light.points = new Decimal(0);player.dark.points = new Decimal(0)};
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
            rewardDescription: "Memory softcap starts x100 later and Red Dolls effect now also makes it starts later.",
        },
        21:{
            name: "Naughty Bugs",
            completionLimit: 1,
            challengeDescription: "Fragments gain^1.05, but L&D increases each other's requirement",
            unlocked() { return hasChallenge('kou',12)},
            goal() { return new Decimal(5e54) },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "Fragments gain^1.025",
        },
        22:{
            name: "Random Effect",
            completionLimit: 1,
            challengeDescription: "L&D's effects are randomized by ticks (x0~x1), but R&F's effects are also randomized by ticks (x1~x1.5)",
            unlocked() { return hasChallenge('kou',21)},
            goal() { return new Decimal(5e53) },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "Red Dolls effect adds a random num(0~0.5).This num will not participate in other boosting calculations.",
        },
        31:{
            name: "The Balance of Conflict",
            completionLimit: 1,
            challengeDescription: "When L or D is fallen behind by others, its own gain will be massively boosted, but another's gain x0.1.",
            unlocked() { return hasChallenge('kou',22)},
            canComplete(){return player.light.points.plus(player.dark.points).gte(2200)},
            goalDescription: "Have a total of 2200 Light Tachyons&Dark Matters.",
            rewardDescription: "When L or D is fall behind by others, its own gain will be boosted.",
        },
        32:{
            name: "Random^ Effect",
            completionLimit: 1,
            challengeDescription: "L&D's effects are randomized by ticks (^0~^1), but R&F's effects are also randomized by ticks (^1~^1.1)",
            unlocked() { return hasChallenge('kou',31)},
            goal() { return new Decimal(2e53) },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "R&D's effects are powered by a random num(1~1.05).",
        },
        41:{
            name: "Uprising Tower",
            completionLimit: 1,
            challengeDescription: "Forgotten Drops effect is boosted by Guiding Scythes Effect, but F layer will be hidden with all Guiding Beacons removed.",
            unlocked() { return hasChallenge('kou',32)},
            goal() { return new Decimal(2e48) },
            onEnter(){
                player.lethe.upgrades = [];
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "Guiding Scythes Effect fomula is better and it will effect Forgotten Drops gain.",
        },
        42:{
            name: "The Desert of clay",
            completionLimit: 1,
            challengeDescription: "Force L,D,M reset regardless of your milestones, and their upgrade costs rise over upgrades you bought.But you gain x2 Light Tachyons&Dark Matters",
            unlocked() { return (hasChallenge('kou',41)&&tmp.lethe.nodeSlots==17)||hasChallenge('kou',42)},
            //goal() { return new Decimal(1e308) },
            onEnter(){
                doReset('light',true);
                doReset('dark',true);
                doReset('mem',true);
                player.mem.upgrades = [];
                if (hasAchievement('a',21)) player.mem.upgrades.push(41);
                if (hasAchievement('a',55)) player.mem.upgrades.push(42);
                player.dark.upgrades = [];
                player.light.upgrades = [];
            },
            canComplete(){return player.points.gte(5e20)&&(player.light.upgrades.length+player.dark.upgrades.length>=24)},
            goalDescription: "5e20 Fragments with all L&D's upgrades purchased.",
            rewardDescription: "You can have more than 17 Guiding Beacons.",
        },
        51:{
            name: "Red Comet",
            completionLimit: 1,
            challengeDescription: "Enduring all Happiness Challenges above.",
            unlocked() { return hasChallenge('kou',42)},
            countsAs : [11,12,21,22,31,32,41,42],
            onEnter(){
                doReset('light',true);
                doReset('dark',true);
                doReset('mem',true);
                player.mem.upgrades = [];
                if (hasAchievement('a',21)) player.mem.upgrades.push(41);
                if (hasAchievement('a',55)) player.mem.upgrades.push(42);
                player.dark.upgrades = [];
                player.light.upgrades = [];
                player.lethe.upgrades = [];
            },
            goal() { return new Decimal(1e27) },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "You have no idea why you complete this challenge.",
        },
    },
})

addLayer("lethe", {
    name: "Forgotten Drops", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        unlockOrder:0,
        nodeSlots:0,//Yes, this can be reseted
    }},
    color: "#fee85d",
    requires(){return new Decimal(2e20).times((player.lethe.unlockOrder&&!player.lethe.unlocked)?5e4:1)}, // Can be a function that takes requirement increases into account
    resource: "Forgotten Drops", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["dark"],
    exponent() {
        let ex = new Decimal(0.6);
        return ex;
    },  // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasMilestone('kou',5)) mult=mult.times(tmp.kou.effect);
        if (hasAchievement('a',35)) mult = mult.times(tmp.dark.effect);
        if (hasUpgrade('lethe',42)) mult = mult.times(player.mem.points.plus(1).log10().max(1));
        if (hasChallenge('kou',41)) mult = mult.times(tmp.lethe.buyables[11].effect);
        if (hasMilestone('lab',6)) mult = mult.times(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab',94)) mult = mult.times(buyableEffect('lab',32));
        if (hasMilestone('rei',4)) mult = mult.times(player.rei.roses.plus(1).log10().times(2).max(1));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1); 
        return exp;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    displayRow: 1,
    increaseUnlockOrder: ["kou"],

    passiveGeneration() { 
        let pg = 0;
        if (hasUpgrade('lab',62)) pg=pg+0.1;
        return pg;
     },

     update(diff){
        if (layers.lethe.buyables[11].autoed()&&layers.lethe.buyables[11].canAfford())layers.lethe.buyables[11].buy();
        if (isNaN(player.lethe.points.toNumber())||player.lethe.points.lte(0)) player.lethe.points = new Decimal(0);
     },

    doReset(resettingLayer){
        let keep=[];
        if (layers[resettingLayer].row > this.row) {layerDataReset("lethe", keep);
        if(hasMilestone('yugamu',0)) player.lethe.milestones = player.lethe.milestones.concat([0,1,2,3,4,5,6]);
        if(hasMilestone('yugamu',1)) player.lethe.milestones.push(7);
        //keep upgrades
        if(hasUpgrade('lab',72)) {
            let auto = [11,15,51,55];
            if (hasUpgrade('lab',82)) auto = auto.concat([13,31,35,53]);
            if (hasUpgrade('lab',92)) auto = auto.concat([12,14,21,25,41,45,52,54]);
            if (hasMilestone('yugamu',2)) auto = auto.concat([22,23,24,32,33,34,42,43,44]);
            for(var i = 0; i < auto.length; i++)
            {
                if (!hasUpgrade('lethe',auto[i])) player.lethe.upgrades.push(auto[i]);
            }
        };}
    },

    milestones: {
        0: {
            requirementDescription: "1 Forgotten Drop",
            done() { return player.lethe.best.gte(1)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Keep first two Milestones and More Darkness upgrades of Dark Matter layer when R or F reset.",
        },
        1: {
            requirementDescription: "10 Forgotten Drops",
            done() { return player.lethe.best.gte(10)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Keep first row upgrades of Dark Matter layer when R or F reset.",
        },
        2: {
            requirementDescription: "35 Forgotten Drops",
            done() { return player.lethe.best.gte(35)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Force Operation no longer needs Seeking Delight to unlock.",
        },
        3: {
            requirementDescription: "5,000 Forgotten Drops",
            done() { return player.lethe.best.gte(5000)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Keep third row upgrades of Dark Matter layer when R or F reset.",
        },
        4: {
            requirementDescription: "1,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(1000000)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Keep second row upgrades of Dark Matter layer when R or F reset.",
        },
        5: {
            requirementDescription: "20,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(20000000)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Keep last two Milestones of Dark Matter layer when R or F reset, and Forgotten Drops effect also boosts Red Dolls gain.",
        },
        6: {
            requirementDescription: "50,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(50000000)},
            unlocked(){return player.lethe.unlocked},
            effectDescription: "Dark Matter layer resets nothing.",
        },
        7: {
            requirementDescription: "1e11 Forgotten Drops",
            done() { return player.lethe.best.gte(1e11)},
            unlocked(){return hasMilestone('lethe',6)},
            effectDescription: "Unlock Scythes.",
        },
    },

    
		buyables: {
			rows: 1,
			cols: 1,
			11: {
				title: "Guiding Scythes",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(1e11).times(Decimal.pow(1000,x)),
					};
				},
				effect() { let effbase = 2;
                    if (hasChallenge('kou',41)) effbase = 4;
                    return Decimal.pow(effbase,player[this.layer].buyables[this.id]) },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.lethe.points)+" / "+formatWhole(cost.fo)+" Forgotten Drops"+"<br><br>Level: "+formatWhole(amt)+"<br><br>Reward: Fragments generation"+((hasChallenge('kou',41))?"&Forgotten Drops gain":"")+" is boosted by "+formatWhole(data.effect)+"x<br>And you can have "+formatWhole(tmp.lethe.nodeSlots)+" Beacons at most.";
					return display;
                },
                unlocked() { return hasMilestone('lethe',7) }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.lethe.points.gt(cost.fo);
				},
                buy() { 
					let cost = layers[this.layer].buyables[this.id].cost();
					player.lethe.points = player.lethe.points.sub(cost.fo);
					player.lethe.buyables[this.id] = player.lethe.buyables[this.id].plus(1);
                },
                style: {'height':'200px', 'width':'200px'},
				autoed() { return hasMilestone('yugamu',1)},
			},
		},
    clickables: {
        rows: 1,
        cols: 1,
        11: {
            title: "Remove all Guiding Beacons",
            display: "",
            unlocked() { return player.lethe.unlocked },
            canClick() { return player.lethe.unlocked && player.lethe.upgrades.length>0 },
            onClick() { 
                if (!confirm("Are you sure you want to remove all Beacons? This will force an Forgotten reset!")) return;
                player.lethe.upgrades = [];
                doReset("lethe", true);
            },
            style: {width: "150px", height: "50px"},
        },
    },


    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",]
        },
        "Scythes": {
            unlocked() { return hasMilestone('lethe',7) },
            buttonStyle() { return {'background-color': '#d2ba46',color: "black"} },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["buyable", 11],
                "blank",
                ["clickable", 11],
                "blank",
                ["display-text", function() { return "Beacons: "+formatWhole(player.lethe.upgrades.length)+" / "+formatWhole(tmp.lethe.nodeSlots) }], "blank",
                "upgrades",]
        },
    },

    hotkeys: [
        {key: "f", description: "F: Reset for Forgotten Drops", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a',21)&&!inChallenge('kou',41)},

    effectBase(){
        let base = new Decimal(1.5);
        return base;
    },
    effect(){
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff = player[this.layer].points.plus(1).pow(2).log10().plus(1);
        if (inChallenge('kou',22)) eff=eff.times(1+Math.random()*0.5);
        if (hasUpgrade('lethe',51)) eff=eff.times(upgradeEffect('lethe',51));
        if (inChallenge('kou',41)) eff=eff.times(buyableEffect('lethe',11));
        if (hasAchievement('kou',45)) eff=eff.times(player[this.layer].buyables[11].div(2).max(1));
        if (hasUpgrade('lethe',54)) eff=eff.times(upgradeEffect('lethe',54));
        if (hasUpgrade('lethe',21)) eff=eff.times(upgradeEffect('lethe',21));

        //pow
        if (inChallenge('kou',32)) eff=eff.pow(1+Math.random()*0.1);
        if (hasChallenge('kou',32)) eff=eff.pow(1+((!hasMilestone('rei',2))?(Math.random()*0.05):0.05));

        return eff;
    },
    effectDescription() 
    {
        return "which are directly boosting Fragments generation and Memories gain by "+format(tmp.lethe.effect)+"x"
    },

    nodeSlots(){return player.lethe.buyables[11].floor().min(hasChallenge('kou',42)?25:17).toNumber()},
    upgrades:{
        rows: 5,
		cols: 5,
        11: {
            title() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22))?"L":"Unrevealed"},
            description() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22))?"Currently Nothing here.":""},
            pay(){
                let price = 1500;
                if (inChallenge('kou',12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22))?("<b>White Beacon</b><br>Light Tachyons gain is boosted by Achievements.<br><br>Cost: "+(inChallenge('kou',12)?"15,000 Light Tachyons":"1,500 Light Tachyons")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 1500;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22));
                let price = player.light.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            effect(){
                let eff = player.a.achievements.length/2;
                if (eff<1) return 1;
                return eff;
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        12: {
            title() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23))?"LLR":"Unrevealed"},
            description() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23))?"Currently Nothing here.":""},
            pay(){
                let price = 5500;
                if (inChallenge('kou',12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23))?("<b>Delightful-Red Synergy</b><br>Light Tachyons itself boosts Red Dolls effect.<br><br>Cost: "+(inChallenge('kou',12)?"55,000 Light Tachyons":"5,500 Light Tachyons")+"<br>Req: 12.50x Red Dolls effect"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 5500;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23));
                let price = player.light.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&tmp['kou'].effect.gte(12.5);
            },
            effect(){
                return player.light.points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        13: {
            title() {return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24))?"LR":"Unrevealed"},
            description() {return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24))?"Currently Nothing here.":""},
            pay(){
                let price = 3250;
                if (inChallenge('kou',12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
                player.kou.points = player.kou.points.sub(40);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24))?("<b>The Tower of Light</b><br>Red Dolls effects Light Tachyons effect at an increased rate.<br><br>Cost: 40 Red Dolls<br>"+(inChallenge('kou',12)?"32,500 Light Tachyons":"3,250 Light Tachyons")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 3250;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24));
                let price = player.light.points.gte(pricenum)&&player.kou.points.gte(40);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(40).times(achievementEffect('a',42))).floor();
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        14: {
            title() {return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25))?"LRR":"Unrevealed"},
            description() {return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25))?"Currently Nothing here.":""},
            pay(){
                player.kou.points = player.kou.points.sub(50);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25))?("<b>Joyful-White Synergy</b><br>Red Dolls itself boosts Light Tachyons effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 50 Red Dolls<br>Req: 2.5e11x Light Tachyons effect")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25));
                let price = player.kou.points.gte(50);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&!inChallenge('kou',12)&&tmp['light'].effect.gte(2.5e11);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(50).times(achievementEffect('a',42))).floor();
            },
            effect(){
                return player.kou.points.div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        15: {
            title() {return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',25)||hasUpgrade('lethe',24))?"R":"Unrevealed"},
            description() {return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',25)||hasUpgrade('lethe',24))?"Currently Nothing here.":""},
            pay(){
                player.kou.points = player.kou.points.sub(35);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',25)||hasUpgrade('lethe',24))?"<b>Red Beacon</b><br>Red Dolls effect increases based on its own reset time.<br><br>Cost: 35 Red Dolls":"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',25)||hasUpgrade('lethe',24));
                let price = player.kou.points.gte(35);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            effect(){
                return Decimal.log10(player.kou.resetTime+1).plus(1).sqrt();
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(35).times(achievementEffect('a',42))).floor();
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        21: {
            title() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32))?"FLL":"Unrevealed"},
            description() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32))?"Currently Nothing here.":""},
            pay(){
                let price = 5500;
                if (inChallenge('kou',12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32))?("<b>Delightful-Yellow Synergy</b><br>Light Tachyons itself boosts Forgotten Drops effect.<br><br>Cost: "+(inChallenge('kou',12)?"55,000 Light Tachyons":"5,500 Light Tachyons")+"<br>Req: 330x Forgotten Drops effect"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 5500;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32));
                let price = player.light.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&tmp['lethe'].effect.gte(330);
            },
            effect(){
                return player.light.points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        22: {
            title() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33))?"LM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33))?"Currently Nothing here.":""},
            pay(){
                let price = 700;
                if (inChallenge('kou',21)) price = price*10;
                player.light.points = player.light.points.sub(price);
                player.mem.points = player.mem.points.sub(2e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33))?"<b>Delightful Memories</b><br>Light Tachyons itself makes Memory softcap starts later.<br><br>Cost: 2e65 Memories<br>"+(inChallenge('kou',12)?"7,000 Light Tachyons":"700 Light Tachyons"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 700;
                if (inChallenge('kou',21)) pricenum = pricenum*10;
                let around = (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33));
                let price = player.light.points.gte(700)&&player.mem.points.gte(2e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            effect(){
                return player.light.points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        23: {
            title() {return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34))?"LRM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34))?"Currently Nothing here.":""},
            pay(){
                let price = 720;
                if (inChallenge('kou',12)) price = price * 10;
                player.kou.points = player.kou.points.sub(30);
                player.mem.points = player.mem.points.sub(5e65);
                player.light.points = player.light.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34))?("<b>Monument of Light</b><br>Red dolls itself boosts L,M&its own gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"7,200 Light Tachyons":"720 Light Tachyons")+"<br>30 Red Dolls"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 720;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34));
                let price = player.kou.points.gte(30)&&player.mem.points.gte(5e65)&&player.light.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(30).times(achievementEffect('a',42))).floor();
            },
            effect(){
                return player.kou.points.div(1.5).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        24: {
            title() {return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"RM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"Currently Nothing here.":""},
            pay(){
                player.kou.points = player.kou.points.sub(25);
                player.mem.points = player.mem.points.sub(2e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"<b>Joyful Memories</b><br>Memories boosts Red Dolls gain.<br><br>Cost: 2e65 Memories<br>25 Red Dolls":"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35));
                let price = player.kou.points.gte(25)&&player.mem.points.gte(2e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(25).times(achievementEffect('a',42))).floor();
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        25: {
            title() {return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"DRR":"Unrevealed"},
            description() {return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"Currently Nothing here.":""},
            pay(){
                player.kou.points = player.kou.points.sub(50);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"<b>Joyful-Black Synergy</b><br>Red Dolls itself boosts Dark Matters effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 50 Red Dolls<br>Req: 400,000,000x Dark Matters effect"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35));
                let price = player.kou.points.gte(50);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&!inChallenge('kou',12)&&tmp['dark'].effect.gte(400000000);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(50).times(achievementEffect('a',42))).floor();
            },
            effect(){
                return player.kou.points.div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        31: {
            title() {return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42))?"FL":"Unrevealed"},
            description() {return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42))?"Currently Nothing here.":""},
            pay(){
                let price = 3250;
                if (inChallenge('kou',12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
                player.lethe.points = player.lethe.points.sub(1e40);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42))?("<b>The Flashing Rift</b><br>Forgotten Drops effects Light Tachyons effect.<br><br>Cost: 1e40 Forgotten Drops<br>"+(inChallenge('kou',12)?"32,500 Light Tachyons":"3,250 Light Tachyons")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 3250;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42));
                let price = player.light.points.gte(pricenum)&&player.lethe.points.gte(1e40);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        32: {
            title() {return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43))?"FLM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43))?"Currently Nothing here.":""},
            pay(){
                let price = 720;
                if (inChallenge('kou',12)) price = price * 10;
                player.lethe.points = player.lethe.points.sub(5e20);
                player.mem.points = player.mem.points.sub(5e65);
                player.light.points = player.light.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43))?("<b>Remote Light Memories</b><br>Forgotten Drops effects Light Tachyons&Memories gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"7,200 Light Tachyons":"720 Light Tachyons")+"<br>5e20 Forgotten Drops"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 720;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43));
                let price = player.lethe.points.gte(5e20)&&player.mem.points.gte(5e65)&&player.light.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        33: { //Where we begin
            title() {return "Memorize"},
            description() {return "Currently Nothing here."},
            pay(){
                player.mem.points = player.mem.points.sub(5e43);
            },
            fullDisplay(){
                return "<b>Memorize</b><br>Make Memories gain After softcap's exponent +0.08.<br><br>Cost: 5e43 Memories";
            },
            canAfford() {
                let a = player.mem.points.gte(5e43);
				return a && (player.lethe.upgrades.length<tmp.lethe.nodeSlots)
            },
            
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        34: {
            title() {return (hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?"DRM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?"Currently Nothing here.":""},
            pay(){
                let price = 620;
                if (inChallenge('kou',12)) price = price * 10;
                player.kou.points = player.kou.points.sub(30);
                player.mem.points = player.mem.points.sub(5e65);
                player.dark.points = player.dark.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?("<b>Monument of Dark</b><br>When you have less D than L, Red doll effects M&D gain with an increased rate.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"6,200 Dark Matters":"620 Dark Matters")+"<br>30 Red Dolls"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 620;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45));
                let price = player.kou.points.gte(30)&&player.mem.points.gte(5e65)&&player.dark.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(30).times(achievementEffect('a',42))).floor();
            },
            effect(){
                if (player.light.points.lte(player.dark.points)) return new Decimal(1);
                return tmp.kou.effect.pow(2.5);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        35: {
            title() {return (hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?"DR":"Unrevealed"},
            description() {return (hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?"Currently Nothing here.":""},
            pay(){
                let price = 2950;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
                player.kou.points = player.kou.points.sub(40);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?("<b>The Tower of Darkness</b><br>Red Dolls effects Dark Matters effect at an increased rate.<br><br>Cost: 40 Red Dolls<br>"+(inChallenge('kou',12)?"29,500 Dark Matters":"2,950 Dark Matters")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 2950;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45));
                let price = player.dark.points.gte(pricenum)&&player.kou.points.gte(40);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            onPurchase(){
                if (hasAchievement('a',42)) player.kou.points = player.kou.points.plus(new Decimal(40).times(achievementEffect('a',42))).floor();
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        41: {
            title() {return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52))?"FFL":"Unrevealed"},
            description() {return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52))?"Currently Nothing here.":""},
            pay(){
                player[this.layer].points = player[this.layer].points.sub(1e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52))?("<b>Forgotten-White Synergy</b><br>Forgotten Drops itself boosts Light Tachyons effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 1e65 Forgotten Drops<br>Req: 2.5e11x Light Tachyons effect")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52));
                let price = player[this.layer].points.gte(1e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&!inChallenge('kou',12)&&tmp["light"].effect.gte(2.5e11);
            },
            effect(){
                return player[this.layer].points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        42: {
            title() {return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?"FM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?"Currently Nothing here.":""},
            pay(){
                player.lethe.points = player.lethe.points.sub(1e20);
                player.mem.points = player.mem.points.sub(2e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?"<b>Forgotten Memories</b><br>Memories boosts Forgotten Drops gain.<br><br>Cost: 2e65 Memories<br>1e20 Forgotten Drops":"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53));
                let price = player.lethe.points.gte(1e20)&&player.mem.points.gte(2e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        43: {
            title() {return (hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?"FDM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?"Currently Nothing here.":""},
            pay(){
                let price = 620;
                if (inChallenge('kou',12)) price = price * 10;
                player.lethe.points = player.lethe.points.sub(5e20);
                player.mem.points = player.mem.points.sub(5e65);
                player.dark.points = player.dark.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?("<b>Remote Dark Memories</b><br>Forgotten Drops effects Dark Matters&Memories gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"6,200 Dark Matters":"620 Dark Matters")+"<br>5e20 Forgotten Drops"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 620;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54));
                let price = player.lethe.points.gte(5e20)&&player.mem.points.gte(5e65)&&player.dark.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        44: {
            title() {return (hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"DM":"Unrevealed"},
            description() {return (hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"Currently Nothing here.":""},
            pay(){
                let price = 600;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
                player.mem.points = player.mem.points.sub(2e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark Memories</b><br>Memories gain is boosted when under e(DM/10).<br><br>Cost: 2e65 Memories<br>"+(inChallenge('kou',12)?"6,000 Dark Matters":"600 Dark Matters")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 600;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55));
                let price = player.dark.points.gte(pricenum)&&player.mem.points.gte(2e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = player.dark.points.div(10);
                eff = Decimal.pow(10,eff);
                return eff;
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        45: {
            title() {return (hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"DDR"/*Convinced*/:"Unrevealed"},
            description() {return (hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"Currently Nothing here.":""},
            pay(){
                let price = 5000;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark-Red Synergy</b><br>Dark Matters itself boosts Red Dolls effect.<br><br>Cost: "+(inChallenge('kou',12)?"5,0000 Dark Matters":"5,000 Dark Matters")+"<br>Req: 12.50x Red Dolls effect"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 5000;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55));
                let price = player.dark.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&tmp["kou"].effect.gte(12.5);
            },
            effect(){
                return player.dark.points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        51: {
            title() {return (hasUpgrade('lethe',41)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',42))?"F":"Unrevealed"},
            description() {return (hasUpgrade('lethe',41)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',42))?"Currently Nothing here.":""},
            pay(){
                player[this.layer].points = player[this.layer].points.sub(1e30);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',41)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',42))?"<b>Yellow Beacon</b><br>Forgotten Drops effect increases based on its own reset time.<br><br>Cost: 1e30 Forgotten Drops":"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',41)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',42));
                let price = player[this.layer].points.gte(1e30);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            effect(){
                return Decimal.log10(player[this.layer].resetTime+1).plus(1).sqrt();
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        52: {
            title() {return (hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?"FFD":"Unrevealed"},
            description() {return (hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?"Currently Nothing here.":""},
            pay(){
                player[this.layer].points = player[this.layer].points.sub(1e65);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?("<b>Forgotten-Black Synergy</b><br>Forgotten Drops itself boosts Dark Matters effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 1e65 Forgotten Drops<br>Req: 400,000,000x Dark Matters Effect")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let around = (hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53));
                let price = player[this.layer].points.gte(1e65);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&!inChallenge('kou',12)&&tmp['dark'].effect.gte(400000000);
            },
            effect(){
                return player[this.layer].points.plus(1).max(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        53: {
            title() {return (hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?"FD":"Unrevealed"},
            description() {return (hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?"Currently Nothing here.":""},
            pay(){
                let price = 2950;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
                player.lethe.points = player.lethe.points.sub(1e40);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?("<b>The Deep Rift</b><br>Forgotten Drops effects Dark Matters effect.<br><br>Cost: 1e40 Forgotten Drops<br>"+(inChallenge('kou',12)?"29,500 Dark Matters":"2,950 Dark Matters")):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 2950;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54));
                let price = player.dark.points.gte(pricenum)&&player.lethe.points.gte(1e40);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        54: {
            title() {return (hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"FDD":"Unrevealed"},
            description() {return (hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?"Currently Nothing here.":""},
            pay(){
                let price = 5000;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark-Yellow Synergy</b><br>Dark Matters itself boosts Forgotten Drops effect.<br><br>Cost: "+(inChallenge('kou',12)?"5,0000 Dark Matters":"5,000 Dark Matters")+"<br>Req: 330x Forgotten Drops effect"):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 5000;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55));
                let price = player.dark.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots)&&tmp["lethe"].effect.gte(330);
            },
            effect(){
                return player.dark.points.plus(1).log10().div(2).max(1);
            },
            unlocked() { return true },
            style: {height: '130px', width: '130px'},
        },
        55: {
            title() {return (hasUpgrade('lethe',54)||hasUpgrade('lethe',55)||hasUpgrade('lethe',45)||hasUpgrade('lethe',44))?"D":"Unrevealed"},
            description() {return (hasUpgrade('lethe',54)||hasUpgrade('lethe',55)||hasUpgrade('lethe',45)||hasUpgrade('lethe',44))?"Currently Nothing here.":""},
            pay(){
                let price = 1300;
                if (inChallenge('kou',12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
            },
            fullDisplay(){
                return (hasUpgrade('lethe',54)||hasUpgrade('lethe',55)||hasUpgrade('lethe',45)||hasUpgrade('lethe',44))?('<b>Black Beacon</b><br>Dark Matters effect is boosted by Achievements.<br><br>Cost: '+(inChallenge('kou',12)?'13,000 Dark Matters':'1,300 Dark Matters')):"<b>Unrevealed</b>";
            },
            canAfford() {
                let pricenum = 1300;
                if (inChallenge('kou',12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe',54)||hasUpgrade('lethe',55)||hasUpgrade('lethe',45)||hasUpgrade('lethe',44));
                let price = player.dark.points.gte(pricenum);
                return around&&price&&(player.lethe.upgrades.length<tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            effect(){
                return player.a.achievements.length/4;
            },
            style: {height: '130px', width: '130px'},
        },
    }
})

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
        return sc;
    },

    update(diff) {

        let auto=[11,12,13,21,22,31,32];
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
        fullDisplay(){return "<b>Darkness extract</b><br>Dark Transformer requirements ÷1.5.<br><br>Cost: 57,000 Light Tachyons<br>70,000 Research Power"},
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
        fullDisplay(){return "<b>Doll Adjustment</b><br>Red Dolls Resets Nothing.<br><br>Cost: 5e9 Research Power<br>85 Red Dolls"},
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
						fo: new Decimal(50000).plus(new Decimal(5000).times(x)).div(hasUpgrade('lab',34)?Decimal.log10(player.light.resetTime+1).div(1.5).max(1):1).div(hasUpgrade('lab',42)?1.5:1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.light.points)+" / "+formatWhole(cost.fo)+" Light Tachyons"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',83)?("<br>Also boosts Light Tachyons gain by x"+format(buyableEffect('lab',21))):"")+((inChallenge('kou',12)||inChallenge('kou',42))?"<br><b>Unpurchaseable due to Challenge you are taking.</b>":"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',31); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.light.points.gte(cost.fo)&&!inChallenge('kou',12);
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
				autoed() { return hasUpgrade('lab',44)  },
			},
            22: {
				title: "Dark Transformer",
				cost(x=player[this.layer].buyables[this.id]) {
					return {
						fo: new Decimal(45000).plus(new Decimal(5000).times(x)).div(hasUpgrade('lab',34)?Decimal.log10(player.dark.resetTime+1).div(1.5).max(1):1).div(hasUpgrade('lab',43)?1.5:1),
					};
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id];
					let cost = data.cost;
					let amt = player[this.layer].buyables[this.id];
                    let display = formatWhole(player.dark.points)+" / "+formatWhole(cost.fo)+" Dark Matters"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',84)?("<br>Also boosts Dark Matters gain by x"+format(buyableEffect('lab',22))):"")+((inChallenge('kou',12)||inChallenge('kou',42))?"<br><b>Unpurchaseable due to Challenge you are taking.</b>":"");
					return display;
                },
                unlocked() { return hasUpgrade('lab',31); }, 
                canAfford() {
					if (!tmp[this.layer].buyables[this.id].unlocked) return false;
					let cost = layers[this.layer].buyables[this.id].cost();
                    return player[this.layer].unlocked && player.dark.points.gte(cost.fo)&&!inChallenge('kou',12);
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
				autoed() { return hasUpgrade('lab',44)  },
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
                    let display = formatWhole(player.kou.points)+" / "+formatWhole(cost.fo)+" Red Dolls"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',93)?("<br>Also boosts Red Dolls gain by x"+format(buyableEffect('lab',31))):"");
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
                    let display = formatWhole(player.lethe.points)+" / "+formatWhole(cost.fo)+" Forgotten Drops"+"<br><br>You've Transfromed "+formatWhole(amt) + " times, which gives you "+formatWhole(amt)+ " Research Points."+(hasUpgrade('lab',94)?("<br>Also boosts Forgotten Drops gain by x"+format(buyableEffect('lab',32))):"");
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
    }
})

addLayer("rei", {
    startData() { return {                  
        unlocked: false,                     
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        roses:new Decimal(0),
        unlockOrder:0,
        auto: false,         
    }},
    name: "Luminous Churches", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LC",
    color: "#ffe6f6",
    nodeStyle() { return {
        background: (player.rei.unlocked||canReset("rei"))?("radial-gradient(circle, #ededed 0%, #ffc1de 100%)"):"#bf8f8f",
    }},
    resource: "Luminous Churches",
    row: 3,   
    displayRow: 3,
    hotkeys: [
        {key: "L", description: "Shift+L: Reset for Luminous Churches", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    position:0,
    branches: ["light"],

    baseResource: "Light Tachyons",
    baseAmount() { return player.light.points }, 

    requires: new Decimal(100000),

    type: "static",
    exponent: 1.5,

    update(diff){
        if (inChallenge('rei',11)){
            player.points = player.points.sub(player.points.div(10).times(diff)).max(1e-10);
            player.mem.points = player.mem.points.sub(player.mem.points.div(10).times(diff)).max(1e-10);
            player.light.points = player.light.points.sub(player.light.points.div(10).times(diff)).max(1e-10);
            player.dark.points = player.dark.points.sub(player.dark.points.div(10).times(diff)).max(1e-10);
            player.kou.points = player.kou.points.sub(player.kou.points.div(10).times(diff)).max(1e-10);
            player.lethe.points = player.lethe.points.sub(player.lethe.points.div(10).times(diff)).max(1e-10);
            player.rei.roses = player.rei.roses.plus(tmp["rei"].challenges[11].amt.times(diff));
        }
    },

    gainMult() {
        let mult = new Decimal(1);
        if (hasMilestone('yugamu',3)) mult = mult.div(buyableEffect('yugamu',11));
        if (hasUpgrade('world',23)) mult = mult.div(upgradeEffect('world',23));
        if (hasUpgrade('world',31)) mult = mult.div(layers.world.fixedReward());
        if (hasUpgrade('lab',143)) mult = mult.div(upgradeEffect('lab',143));
        return mult;
    },
    gainExp() {  
        return new Decimal(1)
    },

    layerShown() { return hasAchievement('lab',21)&&hasChallenge('kou',51)||player[this.layer].unlocked  }, 
    milestones:{
        0: {
            requirementDescription: "1 total Luminous Church",
            done() { return player.rei.total.gte(1)},
            unlocked(){return player.rei.unlocked},
            effectDescription: "Keep all except last milestones of Red Doll Layer when LC or FL reset.",
        },
        1: {
            requirementDescription: "2 total Luminous Churches",
            done() { return player.rei.total.gte(2)},
            unlocked(){return player.rei.unlocked},
            effectDescription: "Keep last milestones of Red Doll Layer when LC or FL reset, and keep all Happiness Challenges finished.",
        },
        2: {
            requirementDescription: "5 total Luminous Churches",
            done() { return player.rei.total.gte(5)},
            unlocked(){return player.rei.unlocked},
            effectDescription: "Luminous Churches boosts Research Points gain & All random num set to their maxnum.",
        },
        3: {
            requirementDescription: "10 total Luminous Churches",
            done() { return player.rei.total.gte(10)},
            unlocked(){return player.rei.unlocked},
            effectDescription: "Unlock Zero Sky.",
        },
        4: {
            requirementDescription: "5 best Luminous Churches",
            done() { return player.rei.best.gte(5)},
            unlocked(){return hasMilestone('rei',3)},
            effectDescription: "Glowing Roses also boosts Red Dolls and Forgotten Drops gain.",
        },
    },

    challenges:{
        11:{
            name: "Zero sky",
            unlocked() { return hasMilestone('rei',3)&&!(player.world.currentStepType>=99&&player.world.restrictChallenge&&!hasUpgrade('storylayer',14)) },
            canComplete(){return false},
            gainMult(){
                let mult = new Decimal(1);
                if (hasMilestone('yugamu',3)) mult = mult.times(buyableEffect('yugamu',21));
                if (hasUpgrade('lab',113)) mult = mult.times(upgradeEffect('lab',113));
                if (hasUpgrade('world',33)) mult = mult.times(upgradeEffect('world',33));
                if (hasUpgrade('lab',141)) mult = mult.times(upgradeEffect('lab',141));
                return mult;
            },
            amt(){//gain per sec
                let gain = player.points.plus(1).log10().div(50).max(0).sqrt();
                gain =gain.times(tmp["rei"].challenges[11].gainMult);
                return gain;
            },
            onEnter(){
                if (!hasAchievement('a',75)) player.rei.roses = new Decimal(0);
                else player.rei.roses = player.rei.roses.div(2);
                doReset("mem",true);
                doReset("light",true);
                doReset("dark",true);
                doReset("kou",true);
                doReset("lethe",true);
            },
            fullDisplay(){
                let show = "Fragments generation & Memories gain ^0.5, and losing 10% of your Fragments, Memories, Light Tachyons, Dark Matters, Red Dolls, Forgotten Drops per second.<br>" + "<br><h3>Glowing Roses</h3>: "+format(player.rei.roses) +" (" +(inChallenge('rei',11)?formatWhole(tmp["rei"].challenges[11].amt):0) +"/s)"+ (hasAchievement('a',65)?("<br>Which are boosting The Speed of World steps gain by "+format(achievementEffect('a',65))+"x"):"");
                if (hasMilestone('rei',4)) show = show + "<br>Red Dolls & Forgotten Drops gain by "+format(player.rei.roses.plus(1).log10().times(2).max(1)) +"x";
                if (hasUpgrade('storylayer',12)) show += "<br>Fragments generation & Memories gain by "+format(upgradeEffect('storylayer',12))+"x";
                return show;
            },
            style(){
                return {'background-color': "#ffe6f6",color: "#383838", 'border-radius': "25px", height: "400px", width: "400px"}
            }
        }
    },
})

addLayer("yugamu", {
    startData() { return {                  
        unlocked: false,                     
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        unlockOrder:0,
        canclickingclickables : [],
        movetimes : new Decimal(0),
        DirectioncanChoose : 1,
        actionpoint : 1,
        timesmoved : new Decimal(0),
        auto: false,         
    }},
    name: "Flourish Labyrinths", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FL",
    color: "#716f5e",
    nodeStyle() { return {
        background: (player.yugamu.unlocked||canReset("yugamu"))?("radial-gradient(circle, #383838 0%,#383838 50%, #5f5911 100%)"):"#bf8f8f",
    }},
    resource: "Flourish Labyrinths",
    row: 3,   
    displayRow: 3,
    hotkeys: [
        {key: "F", description: "Shift+F: Reset for Flourish Labyrinths", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    position:4,
    branches: ["dark"],

    baseResource: "Dark Matters",
    baseAmount() { return player.dark.points }, 

    requires: new Decimal(90000),

    type: "static",
    exponent: 1.5,

    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",]
        },
        "Maze": {
            unlocked() { return hasMilestone('yugamu',3) },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function() { return "You can move "+formatWhole(tmp.yugamu.movetimes)+" times at total." }],
                ["display-text", function() { return "You have moved "+formatWhole(player.yugamu.timesmoved)+" times." }],
                "blank",
                ["row",[["buyable",11]]],
                ["blank",["8px","8px"]],
                ["row",[["buyable",21],["blank",["8px","8px"]],["clickable",11],["blank",["8px","8px"]],["buyable",22]]],
                ["blank",["8px","8px"]],
                ["row",[["buyable",31]]],
                "blank",
                //effect display
                ["column",[["display-text",function(){return "You have moved <h3>North</h3> "+formatWhole(player.yugamu.buyables[11])+" times"}],"blank",["display-text",function(){return "Which boosts your Luminous Churches & Flourish Labyrinths gain by " + format(buyableEffect('yugamu',11))+"x"}]],{width: "100%"}],
                "blank",
                "blank",
                ["row",[
                    ["column",[["display-text",function(){return "You have moved <h3>West</h3> "+formatWhole(player.yugamu.buyables[21])+" times"}],"blank",["display-text",function(){return "Which boosts your Glowing Roses gain by " + format(buyableEffect('yugamu',21))+"x"}]],{width: "50%"}],
                    ["column",[["display-text",function(){return "You have moved <h3>East</h3> "+formatWhole(player.yugamu.buyables[22])+" times"}],"blank",["display-text",function(){return "Which boosts other directions' effect by "+ format(buyableEffect('yugamu',22))+"x"}]],{width: "50%"}],
                ]],
                "blank",
                "blank",
                ["column",[["display-text",function(){return "You have moved <h3>South</h3> "+formatWhole(player.yugamu.buyables[31])+" times"}],"blank",["display-text",function(){return "Which boosts The Speed of World Steps gain by "+ format(buyableEffect('yugamu',31))+"x"}]],{width: "100%"}],
                ]
        },
    },


    
    gainMult() {
        let mult = new Decimal(1);
        if (hasMilestone('yugamu',3)) mult = mult.div(buyableEffect('yugamu',11));
        if (hasUpgrade('world',24)) mult = mult.div(upgradeEffect('world',24));
        if (hasUpgrade('world',31)) mult = mult.div(layers.world.fixedReward());
        if (hasUpgrade('lab',144)) mult = mult.div(upgradeEffect('lab',144));
        return mult;
    },
    gainExp() {  
        return new Decimal(1)
    },

    layerShown() { return hasAchievement('lab',21)&&hasChallenge('kou',51)||player[this.layer].unlocked }, 
    milestones:{
        0: {
            requirementDescription: "1 total Flourish Labyrinth",
            done() { return player.yugamu.total.gte(1)},
            unlocked(){return player.yugamu.unlocked},
            effectDescription: "Keep all except last milestones of Forgotten Drop Layer when LC or FL reset.",
        },
        1: {
            requirementDescription: "2 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(2)},
            unlocked(){return player.yugamu.unlocked},
            effectDescription: "Keep last milestones of Forgotten Drop Layer when LC or FL reset, and now Guiding Scythes are auto bought.",
        },
        2: {
            requirementDescription: "5 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(5)},
            unlocked(){return player.yugamu.unlocked},
            effectDescription: "Flourish Labyrinth boosts Research Points gain & Keep central 9 Guiding Beacons when reset.",
        },
        3: {
            requirementDescription: "10 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(10)},
            unlocked(){return player.yugamu.unlocked},
            onComplete(){
                player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(1);
            },
            effectDescription: "Unlock Maze.",
        },
        4: {
            requirementDescription: "5 best Flourish Labyrinths",
            done() { return player.yugamu.best.gte(5)},
            unlocked(){return hasMilestone('yugamu',3)},
            effectDescription: "Your movetime limit now calculated based on total Flourish Labyrinths you gain instead of best Flourish Labyrinths you have.",
        },
    },

    shouldNotify(){
        let buyableid = [11,21,22,31];
        for(var i = 0; i < buyableid.length; i++){
            if (layers.yugamu.buyables[buyableid[i]].canAfford()){
                return true;
            };
    }
    },

    update(diff){
        if (player.yugamu.actionpoint == 0) {
            player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            player.yugamu.timesmoved = player.yugamu.timesmoved.plus(1);
            player.yugamu.actionpoint = layers.yugamu.actionpoint();
        };
    },


    //maze releated
    canclickingclickables(n){//use layers
    let buyableid = ['11','21','22','31'];//TMT原来的clickable返回的不是数组，得单独保存其编号。
    let shouldcanclick = [];

    for (var i = 1;i<=n;i++)
    {
	randindex = Math.floor(Math.random()*(buyableid.length));//0~数组长-1
	shouldcanclick.push(buyableid[randindex]);
	buyableid.splice(randindex,1);
    };

    return shouldcanclick
    },

    DirectioncanChoose(){
        let num = 1;
        if (hasAchievement('a',73)) num = 2;
        if (hasAchievement('a',82)) num = 3;
        if (hasAchievement('a',91)) num = 4;
        return num;
    },

    movetimes(){//use tmp
        let mt = player[this.layer].best.times(2);
        if (hasMilestone('yugamu',4)) mt = player[this.layer].total.times(2);
        if (hasUpgrade('world',22)) mt = mt.plus(upgradeEffect('world',22));
        if (hasAchievement('a',71)) mt = mt.plus(5);
        if (hasUpgrade('lab',114)) mt = mt.plus(upgradeEffect('lab',114));
        if (hasUpgrade('lab',142)) mt = mt.plus(upgradeEffect('lab',142));
        mt = mt.round();
        return mt;
    },

    actionpoint(){//use tmp && !use Decimal && use layers when call
        return 1;
    },

    buyables: {
        rows: 3,
        cols: 2,
        11: {
            title: "",
            display: "↑",
            unlocked() { return hasMilestone('yugamu',3) },
            canAfford() { 
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                            {
                               if (this.id == player.yugamu.canclickingclickables[i]) return true;
                            }
                return false; 
            },
            buy() { 
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                    {
                         if (this.id == player.yugamu.canclickingclickables[i]) {player.yugamu.canclickingclickables.splice(i,1);};
                     };
            },
            effect(){
                let eff = player.yugamu.buyables[this.id].div(2).plus(1);
                if (hasUpgrade('lab',131)) eff = player.yugamu.buyables[this.id].div(1.5).plus(1);
                eff = eff.times(buyableEffect('yugamu',22));
                return eff;
            },
            style: {width: "100px", height: "100px"},
        },
        21: {
            title: "",
            display: "←",
            unlocked() { return hasMilestone('yugamu',3) },
            canAfford() {
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                    {
                         if (this.id == player.yugamu.canclickingclickables[i]) return true;
                     }
                return false;
            },
            buy() { 
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                    {
                         if (this.id == player.yugamu.canclickingclickables[i]) {player.yugamu.canclickingclickables.splice(i,1);};
                     };
            },
            effect(){
                let eff = player.yugamu.buyables[this.id].div(20).plus(1);
                if (hasUpgrade('lab',133)) eff = player.yugamu.buyables[this.id].div(10).plus(1);
                eff = eff.times(buyableEffect('yugamu',22));
                return eff;
            },
            style: {width: "100px", height: "100px"},
        },
        22: {
            title: "",
            display: "→",
            unlocked() { return hasMilestone('yugamu',3) },
            canAfford() { 
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                            {
                               if (this.id == player.yugamu.canclickingclickables[i]) return true;
                            }
                return false; 
            },
            buy() { 
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                    {
                         if (this.id == player.yugamu.canclickingclickables[i]) {player.yugamu.canclickingclickables.splice(i,1);};
                     };
            },
            effect(){
                let eff = player.yugamu.buyables[this.id].div(50).plus(1);
                if (hasUpgrade('lab',132)) eff = player.yugamu.buyables[this.id].div(25).plus(1);
                return eff;
            },
            style: {width: "100px", height: "100px"},
        },
        31: {
            title: "",
            display: "↓",
            unlocked() { return hasMilestone('yugamu',3) },
            canAfford() { 
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                            {
                               if (this.id == player.yugamu.canclickingclickables[i]) return true;
                            }
                return false; 
            },
            buy() { 
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for(var i = 0; i < player.yugamu.canclickingclickables.length; i++)
                    {
                         if (this.id == player.yugamu.canclickingclickables[i]) {player.yugamu.canclickingclickables.splice(i,1);};
                     };
            },
            effect(){
                let eff = player.yugamu.buyables[this.id].div(5).plus(1);
                if (hasUpgrade('lab',134)) eff = player.yugamu.buyables[this.id].div(4).plus(1);
                eff = eff.times(buyableEffect('yugamu',22));
                return eff;
            },
            style: {width: "100px", height: "100px"},
        },
    },
    clickables:{
        11: {
            title: "Mental Breakdown",
            display: "",
            unlocked() { return hasMilestone('yugamu',3) },
            canClick() { return player.yugamu.timesmoved.gt(0) },
            onClick() { 
                if (!confirm("It's okay to be mad when you get lost in the Maze……But are you sure there is no other way out?")) return;
                player.yugamu.timesmoved = new Decimal(0);
                player.yugamu.actionpoint = layers.yugamu.actionpoint();
                player.yugamu.buyables[11] = new Decimal(0);
                player.yugamu.buyables[21] = new Decimal(0);
                player.yugamu.buyables[22] = new Decimal(0);
                player.yugamu.buyables[31] = new Decimal(0);
                player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            },
            style: {width: "150px", height: "150px"},
        },
    },
})

addLayer("world", {
    name: "World", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best:new Decimal(0),
        unlockOrder:0,
        WorldstepHeight: new Decimal(10),//Do not use player.world.WorldstepHeight
        Worldtimer: new Decimal(0),
        StepgrowthSpeed: new Decimal(1),//per second
        fixednum: new Decimal(0),
        restrictionnum: new Decimal(0),
        currentStepType: 0,//not Decimal
        Worldrandomnum : 0,//not Decimal
        restrictChallenge: false,
        }},
    resource: "World Steps",
    color: "#ddeee3",
    nodeStyle() { return {
        background: (player.world.unlocked||canReset("world"))?("linear-gradient(#ededed, #383838)"):"#bf8f8f",
        //"background-size":"120px 120px",
        height: "96px",
        width: "96px",
        "border" : "0px",
        "outline":"rgb(100,100,100) solid 4px",
    }},
    type: "none", // 怹也不通过重置获得点数,但是怹应该会被重置
    branches: ["mem"],

    row: 3, // Row the layer is in on the tree (0 is the first row)
    displayRow: 1,
    position:2,
    layerShown(){return hasAchievement('a',64)},
    unlocked(){return hasUpgrade('lab',101)},

    shouldNotify(){
        return (player.world.currentStepType>=99&&!player.world.restrictChallenge);
    },

    doReset(resettingLayer){
        let keep=[];
        if (layers[resettingLayer].row > this.row) {layerDataReset('world', keep);}
    },

    bars: {
        WorldProgressBar: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return player.world.Worldtimer.div(tmp["world"].WorldstepHeight) },
            barcolor() {
                if (player.world.currentStepType<75) return '#ddeee3';
                else if (player.world.currentStepType<87) return '#bc24cb';
                else if (player.world.currentStepType<99) return '#eec109';
                else return '#e8272a';
            },
            fillStyle(){return {'background-color':layers.world.bars.WorldProgressBar.barcolor()}},
        },
    },

    WorldstepHeight(){
        let base = new Decimal(10);
        let step = base.times(player.world.points.plus(1));
        return step;
    },

    StepgrowthSpeed(){
        let speed = new Decimal(1);
        if (player.world.currentStepType>=99&&player.world.restrictChallenge) {
            if (!hasUpgrade('storylayer',11)) return (player.points.plus(1).log10().div(2));
            else speed = player.points.plus(1).log10().div(1500);
        };
        if (hasUpgrade('world',12)) speed = speed.times(2);
        if (hasUpgrade('world',13)) speed = speed.times(upgradeEffect('world',13));
        if (hasUpgrade('world',14)) speed = speed.times(upgradeEffect('world',14));
        if (hasAchievement('a',65)) speed = speed.times(achievementEffect('a',65));
        if (hasMilestone('yugamu',3)) speed = speed.times(buyableEffect('yugamu',31));
        if (hasAchievement('a',72)) speed = speed.times(1.5);
        if (hasAchievement('a',74)) speed = speed.times(achievementEffect('a',74));
        if (hasUpgrade('lab',123)) speed = speed.times(upgradeEffect('lab',123));
        if (hasUpgrade('lab',124)) speed = speed.times(upgradeEffect('lab',124));
        if (player.world.currentStepType<87&&player.world.currentStepType>=75) {
            if (hasUpgrade('storylayer',13)) speed = speed.times(2);
            else speed = speed.times(1+player.world.Worldrandomnum);
        };
        if (player.world.currentStepType<99&&player.world.currentStepType>=87) {
            if (hasUpgrade('storylayer',13)) speed = speed.times(0.75);
            else speed = speed.times(Math.min(1-player.world.Worldrandomnum*0.99,0.75));
        }
        if (hasUpgrade('world',34)&&speed.lt(upgradeEffect('world',34))) speed = upgradeEffect('world',34);
        if (player.world.currentStepType>=99&&!player.world.restrictChallenge) speed = new Decimal(0);
        return speed;
    },

    fixedReward(){
        let softcap = new Decimal(500);
        let softcappower = 0.25;
        let reward = player.world.fixednum.div(2).plus(1);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap),softcappower));
        return reward;
    },

    restrictReward(){
        let softcap = new Decimal(20);
        if (hasAchievement('a',83)) softcap = new Decimal(25);
        let softcappower = 0.25;
        let reward = Decimal.pow(1.5,player.world.restrictionnum);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap),softcappower));
        return reward;
    },

    update(diff){//重头戏
        if (!player.world.unlocked) player.world.Worldtimer = new Decimal(0);
        player.world.Worldtimer = player.world.Worldtimer.plus(tmp["world"].StepgrowthSpeed.times(diff));
        if (player.world.Worldtimer.gte(tmp["world"].WorldstepHeight)) {

            if (player.world.currentStepType<99&&player.world.currentStepType>=87) player.world.fixednum = player.world.fixednum.plus(1);
            if (player.world.currentStepType>=99) {player.world.restrictionnum = player.world.restrictionnum.plus(1);player.world.restrictChallenge = false;};
            player[this.layer].points = player[this.layer].points.plus(1);
            player.world.Worldtimer = new Decimal(0);
            if (hasUpgrade('world',31)) player.world.currentStepType = Math.floor(Math.random()*(100));//0~99
            player.world.Worldrandomnum = Math.random();
        };
        if (hasUpgrade('storylayer',14)&&player.world.currentStepType>=99&&!player.world.restrictChallenge) player.world.restrictChallenge = !player.world.restrictChallenge;

        if (player[this.layer].points.gte(player[this.layer].best)) player[this.layer].best = player[this.layer].points;
    },
    
    tabFormat: {
        Upgrades:{
            content:[
        "blank", 
        "main-display", 
        "blank", 
        "resource-display",
        "blank",
        ["bar","WorldProgressBar"],
        ["display-text",function() {return formatWhole(player.world.Worldtimer)+" / "+formatWhole(tmp["world"].WorldstepHeight)+" Step Height"},{}],
        ["display-text",
        function(){
            if (player.world.currentStepType<75) return "";
            if (player.world.currentStepType<87&&player.world.currentStepType>=75) return ("You are going through random World Step. Current speed: " + format((hasUpgrade('storylayer',13))?2:(1+player.world.Worldrandomnum)) +"x");
            if (player.world.currentStepType<99&&player.world.currentStepType>=87) return ("You are going through fixed World Step. Current speed: " + format((hasUpgrade('storylayer',13))?0.75:(Math.min(1-player.world.Worldrandomnum*0.99,0.75))) +"x")
            if (player.world.currentStepType>=99){
                if (!player.world.restrictChallenge) return "You need to Enduring a small Challenge to go through restricted World Step."
                else return ("You are going through restricted World Step.<br>"+((hasUpgrade('storylayer',14))?"":"Your Fragments generation & Memories gain ^0.9 & ")+"The Speed of World Steps gain is "+((hasUpgrade('storylayer',11))?"based on":"determined by")+" your Fragments.")
            };
        }
        ,{}],
        "blank",
        "upgrades",
        "clickables",
        ]
        },
        Atlas:{
            unlocked(){return hasUpgrade("world",31)},
            content:[
                "blank", 
                "main-display", 
                "blank", 
                "resource-display",
                "blank",
                ["bar","WorldProgressBar"],
                ["display-text",function() {return formatWhole(player.world.Worldtimer)+" / "+formatWhole(tmp["world"].WorldstepHeight)+" Step Height"},{}],
                "blank",
                ["row",[
                ["column", [
                    ["display-text",function() {return "You have gone through <h3 style='color: #eec109;'>"+formatWhole(player.world.fixednum)+"</h3> fixed World Steps."},{}],
                    "blank",
                    ["display-text",function() {return "Which boosts Luminous Churches&Flourish Labyrinths gain by <h3 style='color: #eec109;'>"+format(layers.world.fixedReward())+"</h3>x"},{}],
                    "blank",
                ],{width:"50%"}],
                ["column", [
                    ["display-text",function() {return "You have gone through <h3 style='color: #e8272a;'>"+formatWhole(player.world.restrictionnum)+"</h3> restricted World Steps."},{}],
                    "blank",
                    ["display-text",function() {return "Which boosts Research Points gain by <h3 style='color: #e8272a;'>"+format(layers.world.restrictReward())+"</h3>x"},{}],
                    "blank",
                ],{width:"50%"}],]
                ,{}],
            ],
        },
    },

    upgrades:{
        11:{ title: "Researching World",
        description: "World Steps boosts Research Power gain",
        unlocked() { return player.world.unlocked },
        cost(){return new Decimal(5)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            let eff = player.world.points.div(10).plus(1);
            return eff;
        }
        },
        12:{ title: "Draft Map",
        description: "the speed of World Steps gain x2",
        unlocked() { return hasUpgrade('world',11) },
        cost(){return new Decimal(5)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        },
        13:{ title: "Visiting Churches",
        description: "Luminous Churches boosts the speed of World Steps gain.",
        fullDisplay: "<b>Visiting Churches</b><br>Luminous Churches boosts the speed of World Steps gain.<br>Cost: 10 World Steps<br>3 Luminous Churches",
        unlocked() { return hasUpgrade('world',12) },
        canAfford(){
            return player[this.layer].points.gte(10)&&player.rei.points.gte(3);
        },
        pay(){
            player[this.layer].points = player[this.layer].points.sub(10);
            player.rei.points = player.rei.points.sub(3)
        },
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            let eff = player.rei.points.div(10).plus(1);
            return eff;
        }
        },
        14:{ title: "Exploring Labyrinths",
        description: "Flourish Labyrinths boosts the speed of World Steps gain.",
        fullDisplay: "<b>Exploring Labyrinths</b><br>Flourish Labyrinths boosts the speed of World Steps gain.<br>Cost: 10 World Steps<br>3 Flourish Labyrinths",
        unlocked() { return hasUpgrade('world',12) },
        canAfford(){
            return player[this.layer].points.gte(10)&&player.yugamu.points.gte(3);
        },
        pay(){
            player[this.layer].points = player[this.layer].points.sub(10);
            player.yugamu.points = player.yugamu.points.sub(3)
        },
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            let eff = player.yugamu.points.div(10).plus(1);
            return eff;
        }
        },
        21:{ title: "Preliminary Report",
        description: "Unlock World Research in the lab.",
        unlocked() { return hasUpgrade('world',13)&&hasUpgrade('world',14) },
        cost(){return new Decimal(20)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        },
        22:{ title: "Upland",
        description: "World Steps gives you extra move in the Maze.",
        unlocked() { return hasUpgrade('world',21) },
        cost(){return new Decimal(30)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            let eff = player[this.layer].points.div(5).sqrt();
            if (hasUpgrade('world',32)) eff = player[this.layer].best.div(5).sqrt();
            return eff;
        },
        },
        23:{ title: "Sight From Godess",
        description: "World Steps boosts Luminous Churches gain.",
        unlocked() { return hasUpgrade('world',22) },
        cost(){return new Decimal(40)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            return player[this.layer].points.div(10).max(1);
        },
        },
        24:{ title: "Sight inside Chaoz",
        description: "World Steps boosts Flourish Labyrinths gain.",
        unlocked() { return hasUpgrade('world',22) },
        cost(){return new Decimal(40)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            return player[this.layer].points.div(10).max(1);
        },
        },
        31:{ title: "Restriction with Possibilities",
        description: "Unlock more types of World Steps.",
        unlocked() { return hasUpgrade('world',23)&&hasUpgrade('world',24) },
        cost(){return new Decimal(50)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        },
        32:{ title: "Everest",
        description: "Upland now gives extra move in maze based on your best World Steps you have.",
        unlocked() { return hasUpgrade('world',31)},
        cost(){return new Decimal(75)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        },
        33:{ title: "Babel Tower",
        description: "World Steps boost Glowing Roses gain.",
        unlocked() { return hasUpgrade('world',32)},
        cost(){return new Decimal(100)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            return player[this.layer].points.sqrt().div(50).plus(1);
        },
        },
        34:{ title: "Backtracking Method",
        description: "The minium Speed of World Steps gain now determined by times moved in Maze, regardless of magnification.",
        unlocked() { return hasUpgrade('world',32)},
        cost(){return new Decimal(100)},
        onPurchase(){
            player.world.Worldtimer = new Decimal(0);
        },
        effect(){
            return player.yugamu.timesmoved.sqrt().times(2).max(1);
        },
        },
    },
    clickables: {
        //rows: 1,
        //cols: 1,
        11: {
			title: "Enduring Restriction Challenge",
			display(){
                if (hasUpgrade('storylayer',14)) return "Automated";
				return ((player.world.currentStepType>=99&&!inChallenge('rei',11))?(player.world.restrictChallenge?"In":"Out"):((inChallenge('rei',11))?"Locked due to Zero Sky":"Locked"))
			},
			unlocked() { return hasUpgrade('world',31) },
			canClick() { return (player.world.currentStepType>=99&&!inChallenge('rei',11)&&!hasUpgrade('storylayer',14)) },
			onClick() { 
                if (player.world.restrictChallenge) player.world.Worldtimer = new Decimal(0);
                if (!player.world.restrictChallenge) {
                    player.points = new Decimal(0);
                    doReset('mem',true);
                    doReset('light',true);
                    doReset('dark',true);
                };
                player.world.restrictChallenge = !player.world.restrictChallenge;
            },
			style: {"background-color"() { return player.world.restrictChallenge?"#e8272a":"#666666" }},
		    },
        12: {
            title: "Fall Down",
            display: "Lose 20% of your World Steps.",
            unlocked() { return player.world.points.gte(10) },
            canClick() { return player.world.points.gte(10) },
            onClick() { 
                if (!confirm("This button is designed to go through restriction World Step quickly, but it can cost much! Are you sure?")) return;
                player.world.points = player.world.points.times(0.8).floor();
            },
            },
    },

})

addLayer("storylayer", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best:new Decimal(0),
        storyTimer: 0,
        currentRequirement:0,
        currentColor:"#98f898",
        storycounter: 0,//我寻思我也不会写 1.79e308篇故事//但是没准职能会被points取代//好吧还是有点作用的
    }},

    name: "Story", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S",
    color: "#98f898",                       // The color for this layer, which affects many elements.
    type: "none",//不被重置
    resource: "Stories",
    branches: ["world"],
    row: 0,
    displayRow:0,
    position:3,

    unlocked()  {return hasUpgrade('lab',151)},
    layerShown() { return hasUpgrade('lab',151) },

    infoboxes: {
        story: {
            title() {
                if (player.storylayer.storycounter==0) return "LA-1";
                if (player.storylayer.storycounter==1) return "LA-2";
                if (player.storylayer.storycounter==2) return "LC-1";
                if (player.storylayer.storycounter==3) return "LC-2";
                return "Stories";
            },
            body() { //insert stories here //这不利于维护
                if (player.storylayer.storycounter==0){
                    let story = "Christmas, a rare holiday. You were preparing for the celebration of your lab\'s first anniversary.<br>Just for the first time and just for only one time, you told yourself. There shouldn\'t be other businesses to bother your research.<br>Snowflakes slowly fell down at dusk, matching the christmas trees far away, just lighted out."
                    if (player[this.layer].storyTimer > 10) {
                        story += "<br><br>After placing the last batch of decoration, you suddenly felt cold. You made up your decision to buy a cup of coffee at the Starbucks nearby. You had been used to drinking coffee for the year just passed by. After all, you know, inspiration may come at any moment."
                        story += "<br>\"Director?\" A voice came to interrupt your thinking. You turned around and found out that was the college girl who were studying for a Ph.D. of Philosophy, who loved digging into occultism."
                        story += "<br>\"Oh, Joana, what\'s up?\" You were used to asking her like this, just as she was used to reporting directly to you just now."
                    };
                    if (player[this.layer].storyTimer > 15){
                        story +="<br>\"Well, the thing is...... Wait a second, I need to organize my words. This idea came to me last night......\" She was hesitating. It wasn't like her, always crisp academic style."
                        story +="<br>\"OK, take your time.\" You had to wait."
                        story +="<br>\"......well, almost ready. But what I want to say is little more. It's not convenient here.\" Another unexpected answer."
                        story +="<br>\"OK, I'm just going to Starbucks for a drink. Why don't you come too?\" You had a kind of premonition. This kind of curiousity may be the same important as the glass fragment you saw at the very beginning, but more fatal."
                    };
                    if (player[this.layer].storyTimer > 20){
                        story +="<br><br>The Starbucks were bustling. You were suprised that you could find two seats here during Christmas holidays."
                        story +="<br>After the waiter bringing coffee and snacks, you asked: \"What's in your mind?\""
                        story +="<br>\"Things are that we have been researching the world fragments pointing to, right?\" Joana began her speaking, speed of voice returning to her usual style, \"I know, you were very satisfied to discover the existence of somebody there two month ago, and so did I.\""
                        story +="<br>\"Yeah, an exciting moment. Unfortunately, we can't publish our findings tp the public yet. There're still lots of things unclear.\""
                        story +="<br>\"And then we begun sociological study of that world, studying cities, studying religions, from books and cultures, from architectural styles, from ordinary people's lifestyle...... One outcome after another, most are unimportant though, but it's a big sum in the results of our laboratory.\""
                        story +="<br>\"And that's why I am preparing for our lab's first anniversary. Isn't that a good thing?\" You became more and more confused."
                    };
                    if (player[this.layer].storyTimer > 30){
                        story +="<br>\"That's what I'm going to say. Good is good, but all those involved in the research were dazzled by the sudden results at the beginning. It suddenly occurred to me that the report of the world advance team did not mention the data of the life detector last night.\""
                        story +="<br>\"Huh? It doesn't matter? We have already seen a society made up by people here, functioning normally.\""
                        story +="<br>\"That's the point, Director. I retrieved the report of the world advance team this morning, and found out that the life detector had not detect life at all!\" Joana almost shouted out, but she obviously  didn't want to shout in public, \"That means...\""
                    };
                    if (player[this.layer].storyTimer > 40) story += "<br>\"Is that mean what we saw in that world is not 'people'?\""
                    if (player[this.layer].storyTimer >= 45)story += "<br><br>The cup of coffee in your hand was still hot, but you felt it was snowing more heavily outside."
                    return story;
                };

                if (player.storylayer.storycounter==1){
                    let story = "You never expected that you would not sleep for days. At least you slept for a while this day."
                    story += "<br>As she mentioned, the result of discovering life forms in that world got nowhere. The life detector had no response, as if dead."
                    story += "<br>By riskily and indirectly asking people there about the concept of life and death, you had to doubt that you found a new form of life---or a new definition of it...... Because they never thought they were dead."

                    if (player[this.layer].storyTimer > 10){
                        story += "<br><br>While to other researchers, it was just an episode caused by negligence. After all, <i>they</i> think, this was nothing more than another achievement of forgetting to consider, and would not affect the following and existing research."
                        story += "<br>Both Joana and you thought that was definitely not the case, however. \"Trust intuition.\" you said, \"Ignorance may be fatal.\""
                    };

                    if (player[this.layer].storyTimer > 15){
                        story += "<br>\"You don't seem to have a good rest recently, director......I'm here for the report on sociological research. We think we could publish this preliminary report after one month of hard work.\" The researcher in charge of sociological research said with concern---or he didn't listened to what you had said. "
                        story += "<br>\"So?\" You wondered what this has to do with the report."
                    };

                    if (player[this.layer].storyTimer > 20){
                        story += "<br>\"Some of the advance team went into the church not long ago. The Archbishop recognized them coming from another world at once, so our team members asked lots of questions about that world. I have to say that It have gained a lot......It's just a pity that we haven't won the chance to meet the High Priest in person.\" He spoke in cadence, as if he were telling a story. Sociologists like to tell stories, no matter they're true or false."
                    };

                    if (player[this.layer].storyTimer > 30){
                        story += "<br><br>\"But I heard from the team members that the High Priest will preside over sacrifices and ceremonies personally , and that are not very rare.\" You wondered still."
                    };
                    if (player[this.layer].storyTimer > 35){
                        story += "<br>\"How can you compare that with meeting her in person? It's once in a lifetime get an opportunity to ask questions directly to god! Just like the God allows you to phone him.\" The more he said, the face of him beamed with more joyful. You didn't know what he was aspiring for. He continued, \"Bad luck though, a ceremony had just ended when the team went into the city, which won't happen again for a while. So in fact we don't know the appearance of the High Priest.\""
                    };
                    if (player[this.layer].storyTimer > 40){
                        story += "<br>\"In other words, do you think your report is incomplete before you meet the 'High Priest' in person?\" Sociologists really like to tell stories, you muttered in your heart."
                        story += "<br>\"Yes, otherwise our report would always be 'preliminary'.\" He didn't seem to get what you really meant."
                    }
                    return story;
                };

                if (player.storylayer.storycounter==2){
                    let story = "She woke up again from the room at the top of the church. A new day began, one more time.";
                    story += "<br>But was there any difference between the new day and the old day? Except occasional few days, the Archbishop came to remind about the ceremony---But so what, it was just a part of the eternity. Time is the product of eternity, flowing like water, and herself is the eternity."
                    story += "<br>She simply managed herself in bed. She didn't know why she did it every day---Why needed to know? She didn't need to know the troubles of the world, she didn't need to know the feelings of mortals---She didn't even need to know yesterday and tomorrow."
                    
                    if (player[this.layer].storyTimer > 10){
                        story +="<br><br>There was a steady knock on the door. It was the Archbishop. \"Please come in.\" She said, as always."
                    }

                    if (player[this.layer].storyTimer > 12){
                        story += "<br>The Archbishop pushed the door, following him was a stranger."
                    }

                    if (player[this.layer].storyTimer > 15){
                        story += "<br>\"My High Priest, here's a non-native coming and requesting an interview in person. He is not resident from Pure White City, even......\" The Archbishop paused, \"even not from our world.\""
                    }

                    if (player[this.layer].storyTimer > 20){
                        story += "<br>\"Ah, that's not a big deal. He must be here, coming to see me to understand the world. No need to doubt, it doesn't surprise me.\" She replyed the Archbishop in her typical tone still---A solemn but not superior tone, \"You can do your own business first.\""
                        story += "<br>\"Yes. I'll back after your talk is over.\" And then, the Archbishop went out."
                        story += "<br><br>There were only her and the non-native in the room."
                    }

                    if (player[this.layer].storyTimer > 25){
                        story += "<br>A little surprise to her, the stranger spoke first before her:"
                        story += "<br>\"Sorry to bother you, High Priest, but we know few about this world.\" He was not deterred by majesty. Indeed, not a man in this world."
                    }

                    if (player[this.layer].storyTimer > 30){
                        story += "<br>\"I will answer what I could answer. Just ask.\""
                        story += "<br>The non-native took a board out of his clothes quickly. It looked like a clipboard. He must be prepared in advance."
                        story += "<br>He asked a lot about this world, of course including questions about the Pure White City. She answered, one by one---Naturally, she had known these things from the beginning of her existence. As for when she began to exist in this world, she didn't know."
                    }

                    if (player[this.layer].storyTimer > 40){
                        story +="<br><br>\"OK, I really benefit a lot from the conversation. Before I leave, I'd like to ask one last question.\" The stranger put back his clipboard, \"Is the position of the High Priest......eternal? If not, how does it designate a successor?\""
                        story +="<br>\"The position of the High Priest......\" She paused."
                    }
                    
                    if (player[this.layer].storyTimer > 50){
                        story +="<br>Was existence eternal? It was certain that she existed since the beginning of the world. The High Priest build the Pure White City, as the extension of her power. It was she who makd the people live and work in peace and contentment, and she who bathed the world in light and glory......"
                    }

                    if (player[this.layer].storyTimer > 55){
                        story += "<br>......?"
                    }

                    if (player[this.layer].storyTimer > 60){
                        story += "<br>\"High Priest?\" The non-native asked again."
                        story += "<br>\"Ah, yes. The position of the High Priest is eternal.\" At this moment did she recover from thinking."
                        story += "<br>\"Alright, express my thanks again. It's a honour to talk to you.\" The stranger got up and saluted to leave. The Archbishop went in, taking him out of the door."
                    }

                    if (player[this.layer].storyTimer > 65){
                        story += "<br><br>Now only herself alone, in her room high above. The sun had hung high in the gray sky."
                    }

                    if (player[this.layer].storyTimer > 70){
                        story += "<br>\"Is that......true?\""
                    }

                    return story;
                };

                if (player.storylayer.storycounter==3){
                    let story = "Nothing here, really.";
                    return story;
                };
                
            },
        unlocked(){return hasUpgrade('lab',151)},
        titleStyle(){return {'background-color':layers.storylayer.currentColor()} },
        bodyStyle: {'text-align':'left'},
        },
    },

    update(diff){
        if (!player[this.layer].unlocked) player[this.layer].storyTimer = 0;
        else if(player[this.layer].storyTimer<layers.storylayer.currentRequirement()&&player.tab=='storylayer') player[this.layer].storyTimer += diff;
    },

    doReset(resettingLayer){},

    currentRequirement(){//use layers
        let req = 0;
        //在这里插入每个故事走到头要多长时间
        if (player.storylayer.storycounter==0) req = 60;
        if (player.storylayer.storycounter==1) req = 60;
        if (player.storylayer.storycounter==2) req = 75;
        if (player.storylayer.storycounter==3) req = 90;
        return req;
    },

    currentColor(){
        let color = "#98f898";
        if (player.storylayer.storycounter==0) color = "#00bdf9";
        if (player.storylayer.storycounter==1) color = "#00bdf9";
        if (player.storylayer.storycounter==2) color = "#ffe6f6";
        if (player.storylayer.storycounter==3) color = "#ffe6f6";
        return color;
    },

    tabFormat: [
        "blank", 
        ["infobox","story",{'border-color':function(){return layers.storylayer.currentColor()}}],
        "clickables",
        ["bar","storybar"],
        "upgrades",
    ],

    bars: {
        storybar: {
            direction: RIGHT,
            width: 500,
            height: 10,
            progress() { return player.storylayer.storyTimer/(layers.storylayer.currentRequirement()) },
            barcolor() {
                return layers.storylayer.currentColor();
            },
            fillStyle(){return {'background-color':layers[this.layer].bars.storybar.barcolor()}},
        },
    },

    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "",
            display: "←",
            unlocked() { return player.storylayer.unlocked },
            canClick() { return player.storylayer.storycounter>0 },
            onClick() { 
                player.storylayer.storycounter -= 1;
                player.storylayer.storyTimer  = layers.storylayer.currentRequirement();
            },
            //style: {width: "50px", height: "50px"},
        },
        12: {
            title: "",
            display: "→",
            unlocked() { return player.storylayer.unlocked },
            canClick() { return player.storylayer.points.gt(player.storylayer.storycounter) },
            onClick() { 
                player.storylayer.storycounter += 1;
                if(player.storylayer.points.eq(player.storylayer.storycounter))  player.storylayer.storyTimer = 0;
                else player.storylayer.storyTimer  = layers.storylayer.currentRequirement();
            },
            //style: {width: "50px", height: "50px"},
        },
    },

    upgrades: {
        11:{ title: "Restart World Research",
        fullDisplay(){
            return "<b>Restart World Research</b><br>The speed of World Step gain in Restriction Challenge now <b>based on</b> your Fragments instead of <b>determinded by</b> your Fragments.<br><br>Cost:750 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==0&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(750)},
        pay(){
            player.world.points = player.world.points.sub(750);
        },
        unlocked() { return (player.storylayer.storycounter==0&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',11)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        12:{ title: "Bouquet",
        fullDisplay(){
            return "<b>Bouquet</b><br>Glowing Roses now boosts your Fragments generation and Memories gain.<br><br>Cost:2,500 Glowing Roses"
        },
        canAfford(){return player.storylayer.storycounter==1&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.rei.roses.gte(2500)},
        pay(){
            player.rei.roses = player.rei.roses.sub(2500);
        },
        unlocked() { return (player.storylayer.storycounter==1&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',12)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        effect(){
            let eff = new Decimal(1);
            if (hasUpgrade('storylayer',12)) eff = player.rei.roses.plus(1).log(8).times(2);
            return eff;
        },
        },
        13:{ title: "World-View Adjustment",
        fullDisplay(){
            return "<b>World-View Adjustment</b><br>The speed of Random&Fixed World Steps will be set to max.<br><br>Cost:900 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==2&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(900)},
        pay(){
            player.world.points = player.world.points.sub(900);
        },
        unlocked() { return (player.storylayer.storycounter==2&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',13)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
        14:{ title: "Spiral Steps",
        fullDisplay(){
            return "<b>Spiral Steps</b><br>You Endure Restriction Challenge automatically and you no longer endure its negative buff.<br><br>Cost:900 World Steps"
        },
        canAfford(){return player.storylayer.storycounter==3&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement()&&player.world.points.gte(900)},
        pay(){
            player.world.points = player.world.points.sub(900);
        },
        unlocked() { return (player.storylayer.storycounter==3&&player.storylayer.storyTimer>=layers.storylayer.currentRequirement())||hasUpgrade('storylayer',14)},
        onPurchase(){player.storylayer.storyTimer = 0;player.storylayer.storycounter+=1;player.storylayer.points = player.storylayer.points.plus(1);},
        },
    },
})

//GHOSTS

addNode("ghost1", {
    name: "ghost1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 1,
    color: "#000000",
    layerShown() {return "ghost";}
})
addNode("ghost2", {
    name: "ghost2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 1,
    color: "#000000",
    layerShown() {return (tmp["world"].layerShown)?false:"ghost";}
})
addNode("ghost3", {
    name: "ghost3", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 1,
    color: "#000000",
    layerShown() {return "ghost";}
})
addNode("ghost4", {
    name: "ghost4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G4", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 3,
    color: "#000000",
    layerShown() {return "ghost";}
})
addNode("ghost5", {
    name: "ghost5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 3,
    color: "#000000",
    layerShown() {return "ghost";}
})
addNode("ghostLC", {
    name: "ghostLC", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GLC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 3,
    color: "#000000",
    layerShown() {return (tmp["rei"].layerShown)?false:"ghost";}
})
addNode("ghostFL", {
    name: "ghostFL", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GFL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 3,
    color: "#000000",
    layerShown() {return (tmp["yugamu"].layerShown)?false:"ghost";}
})
addNode("ghostF", {
    name: "ghostF", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick(){return false},
    row: 1,
    color: "#000000",
    layerShown() {return (tmp["lethe"].layerShown)?false:"ghost";}
})



addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "An Essence of the Broken World",
            done() { return player.mem.points.gte(100) },
            tooltip: "Gain 100 Memories.<br>Rewards:Fragments generation is a little faster.",
        },
        12: {
            name: "A Stack",
            done() { return player.points.gte(9999) },
            tooltip: "Gain 9999 Fragments.",
        },
        13: {
            name: "Two Stacks for Sure",
            done() { return player.points.gte(19998)&&hasUpgrade("mem",33)},
            tooltip: "Gain 19998 Fragments With Directly Transfer.Rewards:You start at 5 Memories when reset.",
        },
        14: {
            name: "Define Aspects",
            done() { return player.light.unlocked&&player.dark.unlocked},
            tooltip: "Unlock Both Light And Dark Layers.<br>Rewards:They behave as they are unlocked first.",
        },
        15: {
            name: "Does Anybody Say sth About Softcap?",
            done() { return tmp['mem'].softcap.gte(1e13)},
            tooltip: "Push Memory Softcap starts x1,000 later.<br>Rewards:Memories gain x1.5, regardless of softcap.",
        },
        21: {
            name: "Eternal Core",
            done() { return hasUpgrade('mem',41)},
            tooltip: "Build up the Core.<br>Rewards:Unlock L&D milestones and you won't lose Eternal Core.",
        },
        22: {
            name: "Define Aspects™",
            done() { return hasMilestone('light',0)&&hasMilestone('dark',0)},
            tooltip: "Reach L&D's 1st milestone.<br>Rewards:Conclusion no longer decreases Memories gain.Optimistic Thoughts&Force Operation will always give back their cost.",
        },
        23: {
            name: "Now You Are Useless",
            done() { return hasAchievement('a',22)&&hasUpgrade('mem',34)},
            tooltip: "Buy Conclusion When it is useless.<br>Rewards:When you buy Conclusion, it makes your Memory softcap start later but effect decreases based on your Time since Memory Reset.",
        },
        24: {
            name: "Eternal Core^2",
            done() { return hasAchievement('a',21)&&(player.mem.points.gte(1e23)&&player.light.points.gte(65)&&player.dark.points.gte(65))},
            tooltip: "Make you can afford Eternal Core again after you have it.",
        },
        25: {
            name: "Stacks^Stacks",
            done() { return player.points.gte(9.99e18)},
            tooltip: "Gain 9.99e18 Fragments.<br>Rewards:Fragments now make Memory softcap starts later.",
        },
        31: {
            name: "Other Angles",
            done() { return player.kou.unlocked&&player.lethe.unlocked},
            tooltip: "Unlock Both Red And Forgotten Layers.<br>Rewards:They behave as they are unlocked first.",
        },
        32: {
            name: "Finally I Get Rid of You!",
            done() { return hasMilestone('kou',2)&&hasMilestone('lethe',2)},
            tooltip: "Reach R&F's 3rd milestone.<br>Rewards:Keep Directly Transfer when L or D reset, and Fragment Sympathy will always give back its cost.",
        },
        33: {
            name: "Plenty of them",
            done() { return player.light.points.gte(200)&&player.dark.points.gte(200)},
            tooltip: "Have more than 200 on both Light Tachyons&Dark Matters.<br>Rewards:Their effects increase based on their own reset time.",
        },
        34: {
            name: "Introducing: The AutoMate™",
            done() { return hasMilestone('kou',4)&&hasMilestone('lethe',4)},
            tooltip: "Reach R&F's 5th milestone.<br>Rewards:Unlock L&D's Autobuyer.",
        },
        35: {
            name: "Plenty*1.5 of them",
            done() { return player.light.points.gte(300)&&player.dark.points.gte(300)},
            tooltip: "Have more than 300 on both Light Tachyons&Dark Matters.<br>Rewards:L's effect boosts R's gain, D's effect boosts F's gain.",
        },
        41: {
            name: "Scepter of The Soul Guide",
            done() { return player.lethe.upgrades.length>=1},
            tooltip: "Buy your first Guiding Beacon.<br>Rewards: Always gain 20% of Memories gain every second.",
        },
        42: {
            name: "Toyhouse",
            done() { return hasChallenge('kou',11)},
            tooltip() {
                return "Finish Broken Toyhouse challenge.<br>Rewards:Guiding Beacons costing Red Dolls will give back Red Dolls cost by Achievement."+( (hasAchievement('a',42))?("<br>Currently:"+format(achievementEffect('a',42))+"x"):"" )
            },
            effect(){
                let eff = new Decimal(0.5);
                eff = eff.plus((player.a.achievements.length-17)/10);
                if (eff.gt(1)) eff = new Decimal(1);
                return eff;
            }
        },
        43: {
            name: "Force Balance",
            done() { return (player.light.points.gte(900)&&player.dark.points.gte(900)&&player.light.points.eq(player.dark.points))},
            tooltip: "Make you have same amounts of Light Tachyons&Dark Matters.(≥900)<br>Rewards:When one of L or D is fall behind by another, its gain will be boosted.",
        },
        44: {
            name: "I Can Idle (For) Now",
            done() { return hasUpgrade('lethe',15)&&hasUpgrade('lethe',51)&&hasAchievement('a',33)},
            tooltip: "Make L,D,R,M's effects increases over their own reset time.<br>Rewards:Memory softcap starts later based on its own reset time.",
        },
        45: {
            name: "9 isn't a lie!",
            done() { return player.lethe.upgrades.length>=9},
            tooltip: "Have 9 Guiding Beacons.<br>Rewards:Guiding Scythes level boosts Forgotten Drops effect.",
        },
        51: {
            name: "e(An Essence) of the Broken World",
            done() { return player.mem.points.gte(1e100) },
            tooltip: "Gain 1e100 Memories.<br>Rewards:Starts at 100 Memories when reset.",
        },
        52: {
            name: "Stacks e(Stacks)",
            done() { return player.points.gte(9.99e99) },
            tooltip: "Gain 9.99e99 Fragments.",
        },
        53: {
            name: "Beacons Beside Lethe",
            done() { return player.lethe.upgrades.length>=25 },
            tooltip: "Have 25 Guiding Beacons.",
        },
        54: {
            name: "Why I Watch This?",
            done() { return hasChallenge('kou',51) },
            tooltip: "Finish Red Comet challenge.<br>Rewards:You become more curious about what you are witnessing.",
        },
        55: {
            name: "The Lab.",
            done() { return hasUpgrade('mem',42) },
            tooltip: "Set up the Lab.<br>Rewards:Unlock Lab layer and gain 1 Research Point.",
        },
        61: {
            name: "\"A Professional lab in its……field.\"",
            done() { return hasMilestone('lab',7) },
            tooltip: "Build up your reputation among scientists.",
        },
        62: {
            name: "Working Lab",
            done() { return player.lab.points.gte(1000) },
            tooltip: "Gain 1000 Research Points.",
        },
        63: {
            name: "Head into Anonymous",
            done() { return player.rei.unlocked&&player.yugamu.unlocked },
            tooltip: "Unlock both Anonymous Layers.<br>Rewards:Keep Red Comet Challenge Finished when reset.",
            onComplete(){
                if (!hasChallenge('kou',51)) player.kou.challenges[51] = 1;
            },
        },
        64: {
            name: "Glance into The World",
            done() { return player.world.unlocked},
            tooltip: "Unlock World Layer.",
        },
        65: {
            name: "The True Presbyter in The World",
            done() { return player.rei.roses.gte(100)},
            tooltip: "Gain 100 Glowing Roses.<br>Rewards:Glowing Roses now boosts The Speed of World Steps gain.",
            effect(){
                let eff = player.rei.roses.plus(1).log10().plus(1);
                if (hasAchievement('a',85)) eff = player.rei.roses.plus(1).log(7.5).plus(1);
                return eff;
            },
        },
        71: {
            name: "Dire Straits",
            done() { return player.yugamu.timesmoved.gte(10)},
            tooltip: "Move more than 10 times in the Maze<br>Rewards:Gain more 5 moves in the Maze.",
        },
        72: {
            name: "Triangulation",
            done() { return hasMilestone('rei',4)&&hasMilestone('yugamu',4)},
            tooltip: "Reach LC&FL's 5th milestone.<br>Rewards:The speed of World Steps gain x1.5.",
        },
        73: {
            name: "Nothing Can Stop Us",
            done() { return player.world.restrictionnum.gte(1)&&player.world.fixednum.gte(1)},
            tooltip: "Gone through both difficult World Steps.<br>Rewards:You can choose among two directions in Maze.",
        },
        74: {
            name: "Doll House",
            done() { return player.kou.points.gte(100)},
            tooltip: "Have more than 100 Red Dolls.<br>Rewards:Red Dolls itself boosts The Speed of World Steps gain.",
            effect(){
                return player.kou.points.plus(1).log10().div(1.5).max(1);
            },
        },
        75: {
            name: "Anthemy",
            done() { return player.rei.roses.gte(1000)},
            tooltip: "Gain 1000 Glowing Roses.<br>Rewards:Entering Zero Sky no longer reset Glowing Roses, but ÷2 instead.",
        },
        81: {
            name: "Currently, nothing here",
            done() { return player.storylayer.unlocked},
            tooltip: "Begin your stories.",
        },
        82: {
            name: "Lossy Move",
            done() { return player.yugamu.timesmoved.gte(100)},
            tooltip: "Move more than 100 times in the Maze<br>Rewards:You can choose among three directions in Maze.",
        },
        83: {
            name: "Restrictions™",
            done() { return layers.world.restrictReward().gte(30)},
            tooltip: "Let Restriction Steps' reward ≥30.00x<br>Rewards:Restriction Steps' reward's softcap starts at 25.00x",
        },
        84: {
            name: "There is No Limit!",
            done() { return player.mem.points.gte("1.79e308")},
            tooltip: "Gain 1.79e308 Memories.",
        },
        85: {
            name: "Thats Not Intended",
            done() { return hasUpgrade('storylayer',14)&&inChallenge('rei',11)&&player.world.restrictChallenge},
            tooltip: "Endure Zero Sky & Restriction Challenge at the same time.<br>Rewards:Glowing Roses boost The Speed of World Steps gain better.",
        },
        91: {
            name: "Higher And Higher",
            done() { return player.world.points.gte(1000)},
            tooltip: "Gain 1000 World Steps.<br>Rewards:You can choose among all four directions in Maze.",
        },
    },
    tabFormat: [
        "blank", 
        ["display-text", function() { return "When boosts say sth about achievements, usually it relates to the num of achievements you have." }], 
        ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
        "blank", "blank",
        "achievements",
    ],
}, 
)

addLayer("ab", {
	startData() { return {unlocked: true}},
	color: "yellow",
	symbol: "AB",
	row: "side",
	layerShown() { return hasAchievement('a',21) },
	tooltip: "Autobuyers",
	clickables: {
		//rows: 6,
		//cols: 4,
		11: {
			title: "Light Tachyons",
			display(){
				return hasAchievement('a',34)?(player.light.auto?"On":"Off"):"Locked"
			},
			unlocked() { return tmp["light"].layerShown&&hasAchievement('a',34) },
			canClick() { return hasAchievement('a',34) },
			onClick() { player.light.auto = !player.light.auto },
			style: {"background-color"() { return player.light.auto?"#ededed":"#666666" }},
		    },
        12: {
			title: "Dark Matters",
			display(){
				return hasAchievement('a',34)?(player.dark.auto?"On":"Off"):"Locked"
			},
			unlocked() { return tmp["dark"].layerShown&&hasAchievement('a',34) },
			canClick() { return hasAchievement('a',34) },
			onClick() { player.dark.auto = !player.dark.auto },
			style: {"background-color"() { return player.dark.auto?"#383838":"#666666" }},
		    },
        13: {
			title: "Red Dolls",
			display(){
				return (hasUpgrade('lab',71))?(player.kou.auto?"On":"Off"):"Locked"
			},
			unlocked() { return tmp["kou"].layerShown&&hasUpgrade('lab',63)&&hasUpgrade('lab',64) },
			canClick() { return hasUpgrade('lab',71) },
			onClick() { player.kou.auto = !player.kou.auto },
			style: {"background-color"() { return player.kou.auto?"#ffa0be":"#666666" }},
		    },
        14: {
			title: "Research Generator & Tech Transformer",
			display(){
				return (hasUpgrade('lab',122))?(player.lab.generatorauto?"On":"Off"):"Locked"
			},
			unlocked() { return hasUpgrade('world',21) },
			canClick() { return hasUpgrade('lab',122) },
			onClick() { player.lab.generatorauto = !player.lab.generatorauto },
			style: {"background-color"() { return player.lab.generatorauto?"#00bdf9":"#666666" }},
		    }, 
	},
})
