
var skill = function(id){

    this.params={};

    if(this instanceof skill) {
        if(typeof id != 'undefined'){
            this.params['skillid'] = id;
            this.params['id'] = id;
        }
    }
    else return new skill(id);


    this.hintText = "";
    this.styles={};
    this.classes="skill";
    this.theName="";

    this.hint = function(text,level){
        if(typeof level=='undefined')this.hintText+="<p>"+text+"</p>";
        else this.hintText+='<p class="level-specific" showlevel="'+level+'">'+text+"</p>";
        return this;
    }

    this.name = function(newName){
        this.theName=newName;
        this.params['name'] = newName;
        return this;
    }

    this.hintBody = function(text){
        this.hintText +=text;
        return this;
    }

    this.max = function(level){
        this.params['max'] = level;
        return this;
    }

    this._ = function(){
        setHint();
        setStyles();
        this.param('class',this.classes);
        return '<div'+getParams()+'><div>'+this.hintText+'</div></div>';
    }

    this.$ = function(element){
        if(typeof element=='undefined')element='body';
        $(element).append(this._());
    }

    this.sprite = function(x,y){
        x*=80;
        y*=80;
        this.styles['background-position'] = '-'+x+'px -'+y+'px';
        return this;
    }

    this.current = function(level){
        this.param('current',level);
        return this;
    }

    this.sprites = function(obj){
        obj = JSON.stringify(obj).replace(/"/g, '\'');
        this.params['sprites'] = obj.substr(1,obj.length - 2);
        return this;
    }

    this.id = function(id){
        this.params['id'] = id;
        this.params['skillid'] = id;
        return this;
    }

    this.mustHave = function(musthave){
        this.params['musthave'] = musthave;
        return this;
    }

    this.dependency = function(dep){
        dep = JSON.stringify(dep).replace(/"/g, '\'');
        this.params['dependency'] = dep.substr(1,dep.length - 2);
        return this;
    }

    this.param = function(name,value){
        this.params[name]=value;
        return this;
    }

    this.className = function(name){
        this.classes+=" "+name;
        return this;
    }

    this.pos = function(x,y){
        this.styles['position'] = "absolute";
        this.styles['left'] = x+"px";
        this.styles['top'] = y+"px";
        return this;
    }

    // Private

    function getParams(){
        var params="";
        for(var name in that.params){params+=(" "+name+'="'+that.params[name]+'"')}
        return params;
    }

    function setHint(){
        if(that.theName!="")that.hintText="<h3>"+that.theName+"</h3>"+that.hintText;
    }

    function setStyles(){
        if(Object.keys(that.styles).length>0){
            that.params['style']='';
            for(var paramname in that.styles){
                that.params['style']+=paramname+":"+that.styles[paramname]+";";
            }
        }
    }

    var that = this;
}
