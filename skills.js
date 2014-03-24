if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined && this.attr(name) !== false;
};

$.fn.attrInt = function(name,dflt) {
    var theAttr = parseInt(this.attr(name));
    if(isNaN(theAttr) && typeof dflt != 'undefined')return dflt;
    else return theAttr;

};

String.prototype.randomColor = function() {

    var hash;
    var colour;
    for (var i = 0, hash = 0; i < this.length; hash = this.charCodeAt(i++) + ((hash << 5) - hash));
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}

hexColorToGrayscale = function(str){str = str.substr(1,6);return (parseInt(str.substr(0,2),16) + parseInt(str.substr(2,2),16) + parseInt(str.substr(4,2),16)) / 3;}

var skilltree = {
    buttons: '',
    hint: '',
    size: 80,

    language:{
        reqTitle: 'Requirements for level {0}:',
        req: '<h4>{1}</h4><ul class="reqs">{0}</ul>',
        level : '<li class="{1}">{0}</li>',
        levelTitle: '{0} - Level {1}'
    },

    init: function(obj) {

        $(document).trigger('skillsInit',this);

        if(typeof obj == 'undefined')obj = $('body');

        var that = this;

        this.buttons = obj.find('.skill');
        this.hint = obj.find('.skillHint');

        if(typeof this.hint[0] == 'undefined') {
            obj.append('<div class="skillHint"></div>');
            this.hint = obj.find('.skillHint');
        }


        this.buttons.click(function(e) {
            if(e.button == 0) {
                if($(this).hasClass('available')) {
                    var current = $(this).attrInt('current');
                    var max = $(this).attrInt('max');

                    if(current < max) {
                        current = current + 1;
                        $(this).attr('current', current);
                        that.renderAll();
                        $(document).trigger('skillsAfterChange',that);
                    }

                    that.rebuildHint($(this),e);
                }
            }
            return false;

        });

        this.buttons.bind('contextmenu', function(e) {
            if(that.isDowngradePossible($(this))){
                var current = $(this).attrInt('current');
                if(current > 0) {
                    current = current - 1;
                    $(this).attr('current', current);
                    that.renderAll();

                    $(document).trigger('skillsAfterChange',that);
                }
            }
            return false;
        });




        // Showing and hiding the tooltip

        this.buttons.hover(
            function(e) {
                that.rebuildHint($(this),e);
            },
            function() {
                that.hint.html('');
                that.hint.hide();
            }
        );

        //TODO: Check dimensions for tooltip
        // Moving the tooltip

        this.buttons.mousemove(function(e) {
            that.hint.css({
                left: e.pageX,
                top: e.pageY
            });
        })

        this.generateAbbrs();
        this.renderAll();

        $(document).trigger('skillsAfterInit',this);

        return this;

    },

    rebuildHint: function(obj,e){
        var hintDiv = obj.find('div');
        var current = this.getSkillLevel(obj);

        if(typeof hintDiv[0] != 'undefined') {
            this.hint.html(hintDiv.html());

            this.hint.find('[showlevel]').hide().filter(function() {
                var showlevel = $(this).attr('showlevel');

                if(showlevel.indexOf('-') != -1) {
                    var levels = showlevel.split('-');
                    if(current >= parseInt(levels[0]) && current <= parseInt(levels[1]))return true;
                }
                else if(showlevel == current)return true;
                return false;
            })
            .show();
        }

        if(!obj.hasAttr('nohint') && obj.hasAttr('dependency') && !obj.hasClass('available') && current < obj.attrInt('max')){
            this.hint.append(this.buildDependencyHint(obj));
        }

        this.hint.css({left: e.pageX,top: e.pageY});
        this.hint.show();
    },

    generateAbbrs : function(){
        this.buttons.each(function(){

            if(!($(this).hasAttr('sprite')) && !($(this).hasAttr('sprites'))) {

                var abbr = '';
                if($(this).hasAttr('abbr'))abbr = $(this).attr('abbr');
                else {
                    if($(this).hasAttr('name'))abbr=$(this).attr('name').substr(0,2);
                    else if($(this).hasAttr('skillid'))abbr=$(this).attr('skillid').substr(0,2);
                    if(abbr!='')abbr = abbr.substr(0,1).toUpperCase() + abbr.substr(1,1).toLowerCase();
                }

                if(abbr!=''){

                    if(abbr.length>2)$(this).addClass('sm');

                    var color = '';
                    if($(this).hasAttr('abbr_color'))color = $(this).attr('abbr_color');else color = abbr.randomColor();

                    var textColor = hexColorToGrayscale(color)<128 ? 'color: #FFF;' : 'color: #444;';

                    if(color!='')color = ' style="background:'+color+';'+textColor+'"';

                    $(this).append('<span class="abbr"'+color+'>'+abbr+'</span>');
                }
                $(this).addClass('nosprite');
            }

        });
    },

    buildDependencyHint: function(obj){
        var nextLevel = this.getSkillLevel(obj)+1;
        var deps = this.getDependency(obj,nextLevel);
        var deptext = '';
        for(name in deps){
            level = deps[name];
            var metclass = this.getSkillLevel(name)>=level;
            deptext += this.language.level.format(this.language.levelTitle.format(this.getSkillName(name),level),metclass?'met':'unmet');
        }
        return this.language.req.format(deptext,this.language.reqTitle.format(nextLevel));

    },

    // Getting the level of skill

    getSkillLevel: function(skill){
        if(typeof skill == "object")return skill.attrInt('current',0);
        return $('[skillid='+skill+']').attrInt('current',0);
    },

    getSkillName : function(skill){
        var name;

        if(typeof skill == "object"){
            name = skill.attr('name');
            if(name=='undefined')name = skill.attr('skillid');
        }
        else{
            name = $('[skillid='+skill+']').attr('name');
            if(name == 'undefined')name = skill;
        }
        return name;
    },

    // Getting and evauluating complex dependency for obj's level.

    getDependency: function(obj, level) {
        if(!obj.hasAttr('dependency'))return false;
        try {
            eval('var evalResult = {' + obj.attr('dependency') + '}');
        }
        catch(e) {
            obj.removeAttr('dependency');
            return false;
        }

        if(typeof level != 'undefined') {
            if(typeof evalResult[level] != 'undefined')return evalResult[level];
            else return false;
        }
        else return evalResult;
    },

    // Getting and evauluating complex dependency for obj's level.

    getSprite: function(obj, level) {
        if(!obj.hasAttr('sprites'))return false;
        try {
            eval('var evalResult = {' + obj.attr('sprites') + '}');
        }
        catch(e) {
            console.log('Error in evaluating',obj.attr('sprites'));
            return false;
        }

        if(typeof level != 'undefined') {
            if(typeof evalResult[level] != 'undefined')return evalResult[level];
            else return false;
        }
        else return false;
    },

    // Checking, if upgrade of obj to level forLevel is possible

    isDependencyMet: function(obj, forLevel) {
        var dep = this.getDependency(obj, forLevel);
        var mustHave = obj.attr('musthave');

        if(dep != false) {
            var dependencymet = true;
            for(var name in dep) {
                var lvl = this.getSkillLevel(name);
                if(lvl < parseInt(dep[name])) {
                    dependencymet = false;
                }
                if(!dependencymet)break;
            }
            return dependencymet;
        }
        else if(typeof mustHave == 'undefined' || typeof $('[skillid=' + mustHave + '].active')[0] != 'undefined') {
            return true;
        }
        else return false;
    },

    // Checking if downgrade is possible

    isDowngradePossible: function(obj) {

        var id =  obj.attr('skillid');
        var levelFrom = obj.attrInt('current',0);
        if(levelFrom<=0)return false;

        if(typeof id == 'undefined')return true;   // Always possible for skills with no id

        if(levelFrom == 1 && typeof this.buttons.filter('.active[musthave='+id+']')[0] != 'undefined'){
            return false;
        }

        var isPossible = true;
        var that = this;
        this.buttons.filter('.active[dependency]').each(function(){
            var dep = that.getDependency($(this));
            var current = $(this).attrInt('current');
            if(dep != false){
                for(var lvl in dep){
                    if(parseInt(lvl)<=current){
                        if(typeof dep[lvl][id]!='undefined' && dep[lvl][id] >=levelFrom){
                            isPossible = false;
                            return false
                        }
                    }
                }
            }
        });
        return isPossible;
    },

    // Checking things and updating single skill (obj)

    render: function(obj) {

        // Getting current and max numbers

        var current = obj.attrInt('current');

        if(isNaN(current) || current < 0) {
            current = 0;
            obj.attr('current', 0);
        }
        var max = parseInt(obj.attr('max'));
        if(isNaN(max) || current < 0) {
            max = 1;
            obj.attr('max', 1);
        }

        // Adding status display div

        var status = obj.find('.status');
        if(typeof status[0] == 'undefined') {
            obj.append('<span class="status"></span>');
            status = obj.find('.status');
        }
        status.html(current + '/' + max);

        // Modifying the sprite if any

        var sprite = this.getSprite(obj, current);
        if(sprite != false)obj.css('background-position', '-' + (parseInt(sprite[0]) * this.size) + 'px -' + (parseInt(sprite[1]) * this.size) + 'px');

        // Making already upgraded active

        if(current > 0)obj.addClass('active');
        else obj.removeClass('active');

        // Checking if upgrade to next level is possible

        if(current < max) {
            if(this.isDependencyMet(obj, current + 1))obj.addClass('available');
            else obj.removeClass('available');
        }
        else if(current >= max)obj.removeClass('available');

        return this;

    },

    // Checking stuff and rendering all elements

    renderAll: function() {
        var that = this;
        this.buttons.each(
            function() {
                that.render($(this));
            }
        );
        $(document).trigger('skillsAfterRender',that);
    },


    // Export/import as JSON

    export: function(){

        var json='{';

        var attrs=[];

        this.buttons.filter('.active').each(function(){
            attrs.push('"'+$(this).attr('skillid')+'":'+$(this).attrInt('current'))
        });


        json+=attrs.join(',');
        json+='}';

        return json;
    },

    import: function(json){
        if(typeof json == 'string')json = JSON.parse(json);
        this.buttons.each(function(){
            var id = $(this).attr('skillid');
            if(typeof json[id] != 'undefined')$(this).attr('current',json[id]);
            else $(this).attr('current',0);
        });
        this.renderAll();
    }
};