$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined && this.attr(name) !== false;
};

var skilltree = {
    buttons:'',
    hint:'',
    init:function(obj){

        var that = this;

        this.buttons = obj.find('.skill');
        this.hint = obj.find('.skillHint');

        if(typeof this.hint[0]=='undefined'){
            obj.append('<div class="skillHint"></div>');
            this.hint=obj.find('.skillHint');
        }

        this.buttons.click(function(e){
            if(e.button == 0){
                if($(this).hasClass('available')){

                    var current = parseInt($(this).attr('current'));
                    var max = parseInt($(this).attr('max'));

                    if(current<max){
                        current=current+1;
                        $(this).attr('current',current);
                        that.renderAll();
                    }

                    that.hint.find('[showlevel]').hide();
                    that.hint.find('[showlevel='+current+']').show();
                }
            }
            return false;

        });

        this.buttons.bind('contextmenu', function(e){
            //TODO: Add level decreasing
            console.log('Stop rightclicking me!\nJoking. Feel free to rightclick me.\nThis is a stub.');
            return false;
        });

        // Showing and hiding the tooltip

        this.buttons.hover(
            function(){
                var hintDiv = $(this).find('div');
                if(typeof hintDiv[0]!='undefined'){
                    that.hint.html(hintDiv.html());
                    var current = $(this).attr('current');

                    that.hint.find('[showlevel]').hide();
                    that.hint.find('[showlevel='+current+']').show();

                    that.hint.show();
                }
            },
            function(){
                that.hint.html('');
                that.hint.hide();

            }
        );

        // TODO: Check dimensions for tooltip
        // Moving the tooltip

        this.buttons.mousemove(function(e){
            that.hint.css({
                left:  e.pageX,
                top:   e.pageY
            });
        });
        return this;

    },

    // Getting and evauluating complex dependency for obj's level.

    getDependency:function(obj,level){
        if(!obj.hasAttr('dependency'))return false;
        try{
            eval('var evalResult = {'+obj.attr('dependency')+'}');
        }
        catch(e){
            return false;
        }

        if(typeof level != 'undefined'){
            if(typeof evalResult[level] != 'undefined')return evalResult[level];
            else return false;
        }
        else return evalResult;
    },

    // Checking, if upgrade of obj to level forLevel is possible

    isDependencyMet:function(obj,forLevel){
        var dep = this.getDependency(obj,forLevel);
        var mustHave = obj.attr('musthave');

        if(dep!=false){
            var dependencymet=true;
            for(var name in dep){
                var lvl = parseInt($('[skillid='+name+']').attr('current'));
                if(isNaN(lvl) || lvl<0 || lvl<parseInt(dep[name])){
                    dependencymet = false;
                }
            }
            return dependencymet;
        }
        else if(typeof mustHave=='undefined' || typeof $('[skillid='+mustHave+'].active')[0] !='undefined'){
            return true;
        }
        else return false;
    },

    // Checking things and updating single skill (obj)

    render:function(obj){

        // Getting current and max numbers

        var current =   parseInt(obj.attr('current'));
        if(isNaN(current) || current<0){current=0;obj.attr('current',0);}
        var max = parseInt(obj.attr('max'));
        if(isNaN(max) || current < 0){max=1;obj.attr('max',1);}

        // Adding status display div

        var status = obj.find('.status');
        if(typeof status[0]=='undefined'){
            obj.append('<span class="status"></span>');
            status = obj.find('.status');
        }
        status.html(current+'/'+max);

        // Making already upgraded active

        if(current>0)obj.addClass('active');

        // Checking if upgrade to next level is possible

        if(current<max){
            if(this.isDependencyMet(obj,current+1))obj.addClass('available');
            else obj.removeClass('available');
        }
        else if(current>=max)obj.removeClass('available');

        return this;

    },

    // Checking stuff and rendering all elements

    renderAll:function(){
        var that = this;
        this.buttons.each(
            function(){
                that.render($(this));
            }
        );
        return this;
    }
};

$(function(){

    skilltree.init($('.skilltree')).renderAll();

});