NodeList.prototype.forEachNode = Array.prototype.forEach;
var dverify=function(cb){
	this.about="";
	this.cb=cb;
	this.init();
	this.eventDverifyPool=[];
};
dverify.prototype={
	setValueMethods:function(parent,node){
		var obj=this;
		node.addEventListener("keydown", function(e){obj.nodeActive=e.which!=13;});
		node.addEventListener("keyup", function(e){/*node.dispatchEvent(obj.dverified);*/obj.eventDverifyPool.push(node);});
		node.addEventListener("click", function(){obj.nodeActive=true;});
		node.addEventListener("blur", function(){obj.nodeActive=false;});
		node.readData=function(){
			if(node.type=="radio"){
				var chek=parent.querySelectorAll("[type='radio'][field='"+this.getAttribute("field")+"']:checked");
				if(chek.length>0)return chek[0].value;
			}else if(node.type=="checkbox"){
				return node.checked?1:0;
			}
			return this.value==null?"":this.value;
		};
		node.setData=function(v){
			if(node.type=="radio"){
				var el=parent.querySelector("[type='radio'][field='"+this.getAttribute("field")+"'][value='"+v+"']");
				if(el!=null){					
					if(v!=node.readData()){/*el.dispatchEvent(obj.dverified);*/obj.eventDverifyPool.push(el);}
					el.checked=true;
				}
			}else if(node.type=="checkbox"){
				if(v!=node.readData()){/*node.dispatchEvent(obj.dverified);*/obj.eventDverifyPool.push(node);}
				node.checked=v==1?true:false;
			}else{
				if(v!=node.readData()){/*node.dispatchEvent(obj.dverified);*/obj.eventDverifyPool.push(node);}
				this.value=v;
			}			
			return;
		};
	},
	loadstage:function(){
		var obj=this;
		obj.elements={};
		document.querySelectorAll("[dverify-form]").forEachNode(function(node){obj.elements[node.getAttribute("dverify-form")]=node;});
		for(var i in obj.elements){
			var nodes=obj.elements[i].querySelectorAll("[field]");
			var parent=obj.elements[i];obj.elements[i]={};
			nodes.forEachNode(function(node){
				obj.setValueMethods(parent,node);
				obj.elements[i][node.getAttribute("field")]=node;
			});
		}
	},
	getData:function(){
		var data={};
		for(var i in this.elements){
			data[i]={};
			for(var x in this.elements[i]){
				data[i][x]=this.elements[i][x].readData();
			}
		}
		return data;
	},
	ciklus:function(){
		for(var x in this.eventDverifyPool){this.eventDverifyPool[x].dispatchEvent(this.dverified);}
		this.eventDverifyPool=[];
		if(JSON.stringify(this.data)!==JSON.stringify(this.getData())){
			if(this.nodeActive){
				for(var x in this.elements){
					for(var i in this.elements[x]){
						if(this.data[x]!=null){
							this.data[x][i]=this.elements[x][i].readData();
						}
					}
				}
			}else{
				if(this.dataInit){
					this.data=this.getData();
					this.dataInit=false;
				}else{
					for(var x in this.elements){
						for(var i in this.elements[x]){
							if(this.data[x]!=null){
								this.elements[x][i].setData(this.data[x][i]);
							}else{
								this.elements[x][i].setData("");
							}
						}
					}
				}				
			}		
		}
	},
	init:function(){
		var obj=this;
		this.nodeActive=false;
		this.dataInit=true;
		this.data={};
		this.dveriReady = new Event('dverifyReady');
		this.dverified = new Event('dverified');
		this.loadstage();
		this.timer=setInterval(function(){obj.ciklus();},145);	
		setTimeout(function(){if(obj.cb!=undefined)obj.cb(obj);document.dispatchEvent(obj.dveriReady);},80);	
	}
};



