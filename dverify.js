var dverify=function(cb){
	this.about="";this.cb=cb;
	this.elements=function(parent){this.parent=parent;};
	this.init();
};
dverify.prototype={
	addSetGet:function(form,dom){
		var obj=this;
		dom.addEventListener("keydown", function(){obj.domactive=true;});
		dom.addEventListener("click", function(){obj.domactive=true;});
		dom.readData=function(){
			if(dom.type=="radio"){
				var chek=form.querySelectorAll("[type='radio'][field='"+this.getAttribute("field")+"']:checked");
				if(chek.length>0)return chek[0].value;
			}else if(dom.type=="checkbox"){
				return dom.checked?1:0;
			}
			return this.value;
		};
		dom.setData=function(v){			
			if(dom.type=="radio"){
				var el=form.querySelector("[type='radio'][field='"+this.getAttribute("field")+"'][value='"+v+"']");
				if(el!=null){					
					if(v!=dom.readData()){el.dispatchEvent(obj.dverified);}
					el.checked=true;
				}
			}else if(dom.type=="checkbox"){
				if(v!=dom.readData()){dom.dispatchEvent(obj.dverified);}
				dom.checked=v==1?true:false;;
			}else{
				if(v!=dom.readData()){dom.dispatchEvent(obj.dverified);}
				this.value=v;
			}			
			return false;
		};
	},
	loadstage:function(){
		var forms=document.querySelectorAll("form[dverify-form]");
		for(var i=0;i<forms.length;i++){
			var elem={};	
			var elements=forms[i].querySelectorAll("[field]");
			for(var x=0;x<elements.length;x++){
				if(elements[x].tagName!=null){
					var field=elements[x].getAttribute("field");
					if(field!=null){
						elem[field]=elements[x];this.addSetGet(forms[i],elem[field]);
					}					
				}				
			}
			this.elements[forms[i].getAttribute("dverify-form")]=elem;
		}
	},
	init:function(){
		this.dverified = new Event('dverified');
		this.elements=new this.elements(this);
		this.loadstage();
		this.cb(this);
	}
};

dverify=new dverify(function(obj){
	obj.data={};
	obj.domactive=false;
	obj.timer=setInterval(function(){
		obj.stop=true;		
		if(!(JSON.stringify(obj.data) === JSON.stringify(obj._data))){
			if(!obj.domactive)obj._data=obj.data;
			setTimeout(function(){
				obj.stop=false;
				obj.domactive=false;
				obj._data;
			},10);
		};
	},20);
	Object.defineProperty(obj,'_data', {
	  get: function(){
	  	var data={};
	  	for(var i in this.elements){
	  		if(i!="parent"){
	  			data[i]={};
		  		for(var x in this.elements[i]){
		  			data[i][x]=this.elements[i][x].readData();
		  		}
	  		}
	  	}
	  	if(!obj.stop){
	  		obj.data=JSON.parse(JSON.stringify(data));
	  	}
	  	return data;
	  },
	  set: function(v){
	  	for(var i in v){
	  		for(var x in v[i]){
	  			obj.elements[i][x].setData(v[i][x]);
	  		}	  		
	  	}
	  	return;
	  }
	});
	var dverifyReady = new CustomEvent("dverifyReady",{ "detail": this});
	//we need to wait of creating object dverify
	setTimeout(function(){document.dispatchEvent(dverifyReady);},100);	
});
