document.oncontextmenu = function(event){
	event.preventDefault()
}

if(document.all){
	document.onselectstart = function(){
		return false
	}
}else{
	document.onmousedown = function(){
		return false
	}
	document.onmouseup = function(){
		return true
	}
}

document.oncopy = function(event){
	if(window.event){
		event = window.event
	}
	try{
		var the = event.srcElement
		if(
			!((the.tagName == 'INPUT' && the.type.toLowerCase() == 'text') ||  the.tagName == 'TEXTAREA')
		){
			return false
		}
		return true
	}catch(e){
		return false
	}
}

window.onkeydown = window.onkeyup = window.onkeypress = function () {
	if(window.event.keyCode==123 || window.event.keyCode==73){window.event.returnValue = false};
	return true;
}

var ConsoleManager = {
	onOpen:function(){
		alert('Console is opened')
	},
	onClose:function(){
		alert('Console is closed')
	},
	init:function(){
		var self = this;
		var x = document.createElement('div');
		var isOpening = false,
			isOpened =false;
		Object.defineProperty(x, 'id', {
			get: function(){
				if(!isOpening){
					self.onOpen();
					isOpening = true;
				}
				isOpened = true;
			},
		}),
		
		setInterval(function(){
			isOpened = false;
			console.info(x);
			console.clear();
			if(!isOpened && isOpening){
				self.onClose()
				isOpening = false
			}
		}, 200)
	},
}

ConsoleManager.onOpen = function(){
	try{
		window.location.href = '/404'
	}catch(err){
		var a = document.createElement('button')
		a.onclick = function(){
			window.location.href = '/404'
		}
		a.click()
	}
}
ConsoleManager.onClose = function(){
	alert('Console is closed!!!!!')
}
ConsoleManager.init()

var h = window.innerHeight, w = window.innerWidth;
window.onresize = function () {
	if (h != window.innerHeight || w != window.innerWidth) {
		window.close();
		window.location = "about:blank";
	}
}
		
		