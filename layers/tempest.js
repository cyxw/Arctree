addLayer("tempest", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        Postrion: new Decimal(0),           //<--HAHA
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

    baseResource: "Dark Matters",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.dark.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                         // Also the amount required to unlock the layer.

    type: "none",                         // 暂且如此
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat:{
        "Milestones":{
            content:[
                ["display-text","Currently nothing here"],
            ]
        },
        "Tempest Underthrough":{
            buttonStyle() { return { 'background-color': '#3f3e53' } },
            content:[
                ["display-text","Currently nothing here"],
                "grid",
            ]
        }
    },

    upgrades: {
        // 应该是没有upg了，记得删掉
    },

    challenges: {
        challenges: {
            11: {
                name: "Overwhelming Growth",
                challengeDescription: "Currently nothing changed.",
                canComplete: function() {return false},//暂且如此
                completionLimit:Infinity,
            },
        }
    },

    grid: {
        rows: 8, // 我先写这么多
        cols: 3,
        getStartData(id) {
            return false
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            let colNum = id%100;
            let rowNum = Math.floor(id/100);
            
            let Upper = (rowNum == 1)?true:getGridData(this.layer,id-100);
            let Beneath = (rowNum == this.rows)?false:getGridData(this.layer,id+100);

            return (Upper && !Beneath);

        },
        onClick(data, id) { 
            player[this.layer].grid[id] = !player[this.layer].grid[id];
        },
        getDisplay(data, id) {
            return data 
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
            };

            if (player[this.layer].grid[id]){
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
        }
    }
})