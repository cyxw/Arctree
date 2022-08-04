//所有函数都是输入三个数字，返回一个数组


// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,l为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsl(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;

	let min=Math.min(r,g,b);
	let max=Math.max(r,g,b);
	let l=(min+max)/2;
	let difference = max-min;
	let h,s;
	if(max==min){
		h=0;
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	s=Math.round(s*100);//转换成百分比的形式
	l=Math.round(l*100);
	return [h,s,l];
}

// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,v为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsv(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;
	let h,s,v;
	let min=Math.min(r,g,b);
	let max=v=Math.max(r,g,b);
	let l=(min+max)/2;
	let difference = max-min;
	
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	if(max==0){
		s=0;
	}else{
		s=1-min/max;
	}
	s=Math.round(s*100);
	v=Math.round(v*100);
	return [h,s,v];
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsltorgb(h,s,l){
	h=h/360;
	s=s/100;
	l=l/100;
	let rgb=[];

	if(s==0){
		rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
	}else{
		let q=l>=0.5?(l+s-l*s):(l*(1+s));
		let p=2*l-q;
		let tr=rgb[0]=h+1/3;
		let tg=rgb[1]=h;
		let tb=rgb[2]=h-1/3;
		for(let i=0; i<rgb.length;i++){
			let tc=rgb[i];
			//console.log(tc);
			if(tc<0){
				tc=tc+1;
			}else if(tc>1){
				tc=tc-1;
			}
			switch(true){
				case (tc<(1/6)):
					tc=p+(q-p)*6*tc;
					break;
				case ((1/6)<=tc && tc<0.5):
					tc=q;
					break;
				case (0.5<=tc && tc<(2/3)):
					tc=p+(q-p)*(4-6*tc);
					break;
				default:
					tc=p;
					break;
			}
			rgb[i]=Math.round(tc*255);
		}
	}
	
	return rgb;
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsvtorgb(h,s,v){
	s=s/100;
	v=v/100;
	let h1=Math.floor(h/60) % 6;
	let f=h/60-h1;
	let p=v*(1-s);
	let q=v*(1-f*s);
	let t=v*(1-(1-f)*s);
	let r,g,b;
	switch(h1){
		case 0:
			r=v;
			g=t;
			b=p;
			break;
		case 1:
			r=q;
			g=v;
			b=p;
			break;
		case 2:
			r=p;
			g=v;
			b=t;
			break;
		case 3:
			r=p;
			g=q;
			b=v;
			break;
		case 4:
			r=t;
			g=p;
			b=v;
			break;
		case 5:
			r=v;
			g=p;
			b=q;
			break;
	}
	return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function RGBToHexString(RGBinput){
    // RGB颜色值的正则
  let reg = /^(rgb|RGB)/;
  if (reg.test(RGBinput)) {
    let strHex = "#";
    // 把RGB的3个数值变成数组
    let colorArr = RGBinput.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16);
      if (hex === "0") {
        hex += hex;
      }
	  else if (colorArr[i]<16){
		hex = "0"+hex;
	  }
      strHex += hex;
    }
    return strHex;
  } else {
    return String(RGBinput);
  }
}

function HexToRGBString(Hexinput){
    // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  Hexinput = Hexinput.toLowerCase();
  if (reg.test(Hexinput)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (Hexinput.length === 4) {
      let colorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        colorNew += Hexinput.slice(i, i + 1).concat(Hexinput.slice(i, i + 1));
      }
      Hexinput = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    let colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + Hexinput.slice(i, i + 2)));
    }
    return "RGB(" + colorChange.join(",") + ")";
  } else {
    return Hexinput;
  }
}

function RGBStringToArray(RGBinput){
    let reg = /^(rgb|RGB)/;
    if (reg.test(RGBinput)){
        // 把RGB的3个数值变成数组
        let colorArr = RGBinput.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        for (index in colorArr)
            colorArr[index] = Number(colorArr[index]);
        return colorArr;
    }
    else return [NaN,NaN,NaN];
}

function RGBArrayToString(Arrayinput){
    if (Arrayinput.length!=3) return "RGB(0,0,0)";
    else return ("RGB("+Arrayinput[0]+","+Arrayinput[1]+","+Arrayinput[2]+")");
}

function HexMinLight(Hexinput,minLight){
    //目标：输入16进制颜色，如果颜色亮度低于hsl的数值则增亮至对应数值，输出16进制颜色

    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    Hexinput = Hexinput.toLowerCase();
    if(reg.test(Hexinput)&&minLight<=100){
        let RGBString = HexToRGBString(Hexinput);
        let RGBArray = RGBStringToArray(RGBString);
        let hslArray = rgbtohsl(RGBArray[0],RGBArray[1],RGBArray[2]);

        if (hslArray[2]<minLight) hslArray[2]=minLight;

        RGBArray = hsltorgb(hslArray[0],hslArray[1],hslArray[2]);
        RGBString = RGBArrayToString(RGBArray);

        return RGBToHexString(RGBString);

    }
    else return Hexinput;
}

function GlowingColor(input, timefactor = 1){
	//目标：通过正弦函数实现颜色的浮动, 输出16进制, 输入既可以是16进制，也可以是rgb
	let RGBArray = [0,0,0];
	if (typeof(input)==='object') RGBArray = input;
	if (typeof(input)==='string') {
		if (input != HexToRGBString(input)) input = HexToRGBString(input);
		RGBArray = RGBStringToArray(input);
	};

	let outputArray = [0,0,0];
	for (index in RGBArray)
	{
		outputArray[index] = Math.min(Math.round(RGBArray[index]/2+RGBArray[index]/2*Math.sin(player.timePlayed*timefactor)),255);
	}

	return RGBToHexString(RGBArrayToString(outputArray))
}