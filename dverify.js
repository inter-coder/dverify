NodeList.prototype.forEachNode = Array.prototype.forEach;
var dverify=function(cb){
	this.about="";
	this.cb=cb;
	this.init();
};
dverify.prototype={
	setValueMethods:function(parent,node){
		var obj=this;
		node.addEventListener("keydown", function(e){obj.nodeActive=e.which!=13;});
		node.addEventListener("click", function(){obj.nodeActive=true;});
		node.readData=function(){
			if(node.type=="radio"){
				var chek=parent.querySelectorAll("[type='radio'][field='"+this.getAttribute("field")+"']:checked");
				if(chek.length>0)return chek[0].value;
			}else if(node.type=="checkbox"){
				return node.checked?1:0;
			}
			return this.value;
		};
		node.setData=function(v){
			if(node.type=="radio"){
				var el=parent.querySelector("[type='radio'][field='"+this.getAttribute("field")+"'][value='"+v+"']");
				if(el!=null){					
					if(v!=node.readData()){el.dispatchEvent(obj.dverified);}
					el.checked=true;
				}
			}else if(node.type=="checkbox"){
				if(v!=node.readData()){node.dispatchEvent(obj.dverified);}
				node.checked=v==1?true:false;;
			}else{
				if(v!=node.readData()){node.dispatchEvent(obj.dverified);}
				this.value=v;
			}			
			return ;
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
	init:function(){
		var obj=this;
		this.nodeActive=false;
		this.data={};
		this.dveriReady = new Event('dverifyReady');
		this.dverified = new Event('dverified');
		Object.defineProperty(this,'_data', {
			get: function(){
				var data={};
				for(var i in this.elements){
					data[i]={};
					for(var x in this.elements[i]){
						data[i][x]=this.elements[i][x].readData();
					}
				}
				if(JSON.stringify(this.data)=="{}"){
					this.data=JSON.parse(JSON.stringify(data));
					return data;
				}else if(JSON.stringify(this.data)===JSON.stringify(data)){					
					return data;
				}else{					
					if(!obj.nodeActive){
						for(var i in this.data){
							if(this.data[i]==null){
								for(var x in this.elements[i]){		
									this.elements[i][x].setData("");							
								}
							}else{
								for(var x in this.data[i]){		
									if(this.elements[i][x]!=undefined){
										if(this.elements[i][x].readData()!=this.data[i][x]){
											this.elements[i][x].setData(this.data[i][x]);
										}
									}							
								}
							}							
						}
						obj.nodeActive=true;						
					}else{
						obj.nodeActive=false;
						this.data=JSON.parse(JSON.stringify(data));						
					}
				}
			}
		});
		this.loadstage();
		this.timer=setInterval(function(){obj._data;},45);	
		setTimeout(function(){if(obj.cb!=undefined)obj.cb(obj);document.dispatchEvent(obj.dveriReady);},80);		
	}
};


