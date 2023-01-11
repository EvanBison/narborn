let $user = {
	orientation: window.innerWidth>=window.innerHeight ? "landscape" : "portrait",
	onOrientationChange: (orientation)=>{}
};
let portrait = window.matchMedia("(orientation: portrait)");
portrait.addEventListener("change", function(e) {
  if(e.matches) {
		$user.orientation="portrait";
  } else {
		$user.orientation="landscape";
  };
	$user.onOrientationChange($user.orientation);
});
const $scrollTo = function(x,y) {
	window.scroll({
  	top: y,
  	left: x,
  	behavior: 'smooth'
	});
};


const $ = function(selector) {
	let self = document.querySelector(selector);
	if(self==null) {throw Error("'"+selector+"' is not a valid element.")}; // error

	// scroll to

	self.scrollTo=function() {
		self.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
	};

	// check for class

	self.hasClass=function(find) {
		return self.classList.contains(find);
	};
	
	// easy dom manipulation
	
	self.txt=function(text) {
		text? self.innerText = text:0;
		return self.innerText;
	};
	self.html=function(value) {
		value? self.innerHTML = value:0;
		return self.innerHTML;
	};
	self.identify=function() {
		return self["id"];
	};

	self.hide=function() {
		self.style.display="none";
	};
	self.show=function(type) {
		type?self.style.display=type:self.style.display="block";;
	};
	self.attr=function(set, value) {
		value?self.setAttribute(set, value):0;
		return self[set];
	};
	self.css=function(set, value) {
		value?self.style[set]=value:0;
		return self.style[set];
	};

	// text editing

	self.rip=function(typ, data) {
		let parent = self;
		let txt = parent.innerText.split("");
		parent.innerHTML="";
		for(let i=0; i<txt.length; i++) {
			let child = document.createElement(typ);
			child.setAttribute("id",parent.id+"-"+i);
			for(let j in data) {
				child.setAttribute(j, data[j]);
			};
			parent.appendChild(child);
			let e = document.getElementById(parent.id+"-"+i);
			e.innerText=txt[i];
		};
	};

	// grid layout creator

	self.makeGridContainer=function(columns, rules) {
		if(columns==null) {throw Error("Undefined columns for grid container.")}; // error
		self.style.display="grid";
		self.style.flexWrap="wrap";
		self.style.gridTemplateColumns="repeat("+columns+", 1fr)";
		rules.gapX?self.style.columnGap=rules.gapX+"%":0;
		rules.gapY?self.style.rowGap=rules.gapY+"%":0;
		rules.origin?self.style.justifyItems=rules.origin:0;
	};
	self.addGridBlock=function(name,coords,html,data) {
		if(name==null||name==""||name==" ") {throw Error("Invalid block name.")}; // error
		if(coords==null||coords.split("/").length!=4) {throw Error("Invalid block coordinates.")}; // error
		let parent = self;
		coords=coords.split("/");
		child = document.createElement('div');
		child.setAttribute("id", name);
		child.setAttribute("style",`
	 		grid-column:`+coords[0]+`/`+coords[1]+`;
			grid-row:`+coords[2]+`/`+coords[3]+`;
		`)
		for(let i in data) {
			child.setAttribute(i, data[i]);
		};
		parent.appendChild(child); 
		let e = document.getElementById(name);
		e.innerHTML=html;
	};

	// class selection

	self.editClassStyle=function(set, value){
		let elements = document.getElementsByClassName(selector.slice(1));
		for (var i=0; i<elements.length; i++) {
    	elements[i].style[set] = value;
		};
	};
	self.editClassProperties=function(set, value){
		let elements = document.getElementsByClassName(selector.slice(1));
		for (var i=0; i<elements.length; i++) {
    	elements[i][set] = value;
		};
	};

	// element creation

	self.createChild=function(type, data) {
		let parent = self;
		child = document.createElement(type);
		for(let i in data) {
			child.setAttribute(i, data[i]);
		};
		parent.appendChild(child);
	};

	// tooltips
	
	self.showToolTip=function() {
		let parent = self;
		let child=document.getElementById(parent.id+"-toolTip");
		child.style.visibility="visible";
		child.style.transition="opacity 0.7s";
		child.style.opacity="1";
	};

	self.hideToolTip=function() {
		let parent = self;
		let child=document.getElementById(parent.id+"-toolTip");
		child.style.visibility="hidden";
		child.style.transition="0.5s";
		child.style.opacity="0";
	};

	self.toolTip=function(text, position, data) {
		let parent = self;
		parent.style.position="relative";
		parent.style.display="inline-block";
		parent.setAttribute("onmouseenter", '$("#'+parent.id+'").showToolTip()');
		parent.setAttribute("onmouseleave", '$("#'+parent.id+'").hideToolTip()');

		let pos="bottom: 115%;left: 50%;margin-left: -60px;";
		switch(position) {
			case "top":
				pos="bottom: 115%;left: 50%;margin-left: -60px;";
			break;
			case "bottom":
				pos="top: 125%;left: 50%;margin-left: -60px;";
			break;
			case "right":
				pos="top: 5%;left: 105%;"
			break;
			case "left":
				pos="top: 5%;right: 105%;"
			break;
		};
		
		let child = document.createElement("span");
		child.setAttribute("id", parent.id+"-toolTip")
		child.setAttribute("style", `transition: 0.8s;visibility:hidden;width:120px;background-color: #555;color: #fff;textalign: center;`+pos+`position:absolute;opacity:0;border-radius:5px; padding: 5%;z-index:100;`);
		
		parent.appendChild(child);
		document.getElementById(parent.id+"-toolTip").innerText=text;
		for(let i in data) {
			document.getElementById(parent.id+"-toolTip").style[i]=data[i];
		};

	};	

	// overlay creator

	self.overlay=function(name, color, opacity) {
		if(name==null||name==""||name==" ") {throw Error("Invalid overlay name.")}; // error
		let parent = self;
		let child = document.createElement("div");
		child.setAttribute("id", name);
		child.setAttribute("style", `position:absolute;pointer-events: none;width:100%;height:100%;top:0;left:0;right:0;bottom:0;opacity:${opacity};background:${color};z-index:`+parent.style.zIndex+1);

		parent.appendChild(child);
	};

	// animation creator

	self.animate=function(repeat=0, data) {
		if(typeof repeat!="number") {throw Error("Invalid repeat amount.")}; // error
		let savedDuration = self.style.transition;
		let index = 0;
			function update() {
				element=self;
				index++;
		for(let i=0; i<data.length; i++) {
			setTimeout(()=>{
				data[i].duration?element.style.transition=data[i].duration+"s":element.style.transition="0s";
				data[i].animation?element.style.transform=data[i].animation:0;	
				data[i].property?element.style[property.key]=data[i].property.value:0;	
				if(data[i].revert) {
					// eventually make it revert to 0 on everything
				};
				if(data[i].repeat&&index<repeat) {
					update();
				};
			},1000*data[i].wait)
		};
			}update();
		self.style.transition=savedDuration;
	};

	// add event listeners

	self.onEvent=function(type, func) {
		self.addEventListener(type, func);
	};
	return self;
};

// create gradient

const $gradient = function(pattern, data) {
	gradient="";
	type=data.type?data.type:"linear";
	if(type=="linear") {
		gradient+="linear-gradient(";
		direction=data.direction?data.direction:"bottom";
		if(direction.toLowerCase().includes("deg")) {
		 	gradient+=direction+",";
		} else {
			gradient+="to "+direction+",";
		};
	} else {
		gradient+="radial-gradient(";
	};
	
	for(let i=0; i<pattern.length; i++) {
		extra=",";
		if(i+1>=pattern.length) {
			extra="";
		};
		gradient+=pattern[i]+extra;
	};
	gradient+=")";
	return gradient;
};

// create template

const $template = function(name) {
	if(name==null||name==""||name==" ") {throw Error("Invalid name for template.")}; // error
	this.name=name;
	this.html=[];
	this.attributes={};
	this.css={};
	this.values={};
	this.create=function(selector, values) {
		// create container div
		let parent = document.querySelector(selector);
		child = document.createElement('div');
		child.setAttribute("id", parent.id+"-"+this.name);
		// assign properties
		for(let i in this.attributes) {
			child.setAttribute(i, this.attributes[i]);
		};
		parent.appendChild(child); 
		let e = document.getElementById(parent.id+"-"+this.name);
		// assign css
		for(let i in this.css) {
			e.style[i]=this.css[i];
		};
		let newHTML = "";
		
		for(let i=0; i<this.html.length; i++) {
			if(typeof this.html[i]=="object") {
				for(let j in values) {
					if(j==this.html[i].key) {
						newHTML+=values[j];
					};
				};
			} else {
				newHTML+=this.html[i];
			};
		};
		
		e.innerHTML=newHTML;	
	};
};

// format numbers

const $format_types = {
  england: 'en-US',    // United States
  germany: 'de-DE',    // Germany
  russia: 'ru-RU',    // Russia
  india: 'hi-IN',    // India
  switzerland: 'de-CH'   // Switzerland
};
const $currency_types = {
	usd: {symbol:"$"},
	canadiandollar: {symbol:"C$"},
	australiandollar: {symbol:"A$"},
	pound: {symbol:"£"},
	euro: {symbol:"€"},
	yen: {symbol:"¥"},
	swissfranc: {symbol:"CHF"},
	rupee: {symbol:"₹"},
	won: {symbol:"₩"}
}
const $format = function(num, decimals, type, currency) {
	if(typeof num!="number") {throw Error("Invalid variable type to format.")}; // error
	opts = { minimumFractionDigits: decimals };
	type?0:type="england";
	let first="";
	let last="";
	if(currency) {
		first=$currency_types[currency].symbol;
	};
	
	return first+num.toLocaleString($format_types[type.toLowerCase()], opts)+last;
};

// random string

const $randomString = function(length, include_lowercase, include_numbers, include_caps, include_symbols) {
  let result='';
  let chars='';
	include_lowercase?chars+="abcdefghijklmnopqrstuvwxyz":0;
	include_numbers?chars+="0123456789":0;
	include_caps?chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ":0;
	include_symbols?chars+="!@#$%&*=-+~_":0;
  let charactersLength=chars.length;
  for (let i = 0; i<length; i++ ) {
    result+=chars.charAt(Math.floor(Math.random() * charactersLength));
  };
  return result;
};

// random number between 2 numbers

const $range = function(min=1, max=1) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const $setFavicon = function(img){
	if(img==null) {throw Error("Invalid favicon.")}; // error
  let headTitle = document.querySelector('head');
  let setFavicon = document.createElement('link');
  setFavicon.setAttribute('rel','shortcut icon');
  setFavicon.setAttribute('href',img);
  headTitle.appendChild(setFavicon);
}

// invert hex code

const $padZero = function(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
const $invertHex = function(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + $padZero(r) + $padZero(g) + $padZero(b);
}
