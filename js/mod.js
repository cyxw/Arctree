let modInfo = {
	name: "ArcTree",
	id: "arctree",
	author: "cyxw & sxy62146214",
	pointsName: "Fragments",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.3.0",
	name: "Glance into The World",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.3,0</h3><br>
		- Call row4 done.<br>
	<h3>v0.0.2.5</h3><br>
		- All row4 layers added with basic stuff.<br>
		- All row3 QoL added.<br>
	<h3>v0.0.2.0</h3><br>
		- Call row3 completed.<br>
	<h3>v0.0.1.1</h3><br>
		- Call row2 completed.(Convinced)<br>
	<h3>v0.0.1</h3><br>
		- Call row2 completed.(Part of)<br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.(Convinced)`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

		
	let gain = new Decimal(1)

	//ADD
	if (hasAchievement("a", 11)) gain=gain.add(0.5);


	//MULT
	if (hasUpgrade('mem', 11)) gain = gain.times(upgradeEffect('mem', 11))
	if (hasUpgrade('mem', 14)) gain = gain.times(upgradeEffect('mem', 14))
	if (hasUpgrade('mem', 22)) gain = gain.times(upgradeEffect('mem', 22))	
	if (player.light.unlocked) gain = gain.times(tmp.light.effect);
	if (player.lethe.unlocked) gain = gain.times(tmp.lethe.effect);
	if (player.lethe.buyables[11].unlocked) gain = gain.times(buyableEffect('lethe',11));
	if (hasMilestone('lab',0)) gain = gain.times(player.lab.power.div(10).max(1));
	if (hasMilestone('lab',1)) gain = gain.times(player.lab.points.max(1));
	if (hasUpgrade('storylayer',12)) gain = gain.times(upgradeEffect('storylayer',12));
	if (hasAchievement('a',92)) gain = gain.times(achievementEffect('a',92));
	
	//POW
	if (hasUpgrade('dark', 12))gain = gain.times(tmp.dark.effect.pow(0.5));
	if (hasUpgrade('mem', 33)&& !hasMilestone('kou',2)) gain = gain.pow(hasUpgrade('light', 23)?0.75:0.5);
	if (hasChallenge("kou",21)) gain = gain.pow(1.025);
	if (inChallenge("kou",11)) gain = gain.pow(0.75);
	if (inChallenge("kou",21)) gain = gain.pow(1.05);
	if (hasUpgrade('lab',73)) gain = gain.pow(buyableEffect('lab',12));
	if (inChallenge('rei',11)) gain = gain.pow(0.5);
	if (player.world.restrictChallenge&&!hasUpgrade('storylayer',14)) gain = gain.pow(0.9);

	if (hasUpgrade('dark', 11)&&player.points.lt(upgradeEffect('dark',11))) gain = gain.times(2);
	if (isNaN(gain.toNumber())) return new Decimal(1);
        return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
