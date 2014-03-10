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

        this.buttons.click(function(){

                if($(this).hasClass('available')){
                    var current = $(this).attr('current');
                    var id=$(this).attr('skillid');

                    var max = $(this).attr('max');
                    if(current<max){
                        current=parseInt(current)+1;
                        $(this).attr('current',current);
                        //$(this).each(function(){that.render($(this))});
                        //$('.skill[musthave='+id+']').each(function(){that.render($(this))});
                        // TODO: Add dependency cache maybe?
                        that.renderAll();
                    }

                    that.hint.find('[showlevel]').hide();
                    that.hint.find('[showlevel='+current+']').show();
                }

            }
        );
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
        this.buttons.mousemove(function(e){
            that.hint.css({
                left:  e.pageX,
                top:   e.pageY
            });
        });
        return this;

    },
    renderAll:function(){
        var that = this;
        this.buttons.each(
            function(){
                that.render($(this));
            }
        );
        return this;
    },
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
    render:function(obj){

        // Getting current and max numbers

        var current =   parseInt(obj.attr('current'));
        var max =       parseInt(obj.attr('max'));

        if(isNaN(current) || current<0){
            current=0;
            obj.attr('current',0);
        }
        if(isNaN(max) || current < 0){
            max=1;
            obj.attr('max',1);
        }

        // Adding status display div

        var status = obj.find('.status');
        if(typeof status[0]=='undefined'){
            obj.append('<span class="status"></span>');
            status = obj.find('.status');
        }
        status.html(current+'/'+max);

        // Getting IDs

        var mustHave = obj.attr('musthave');

        if(current>0)obj.addClass('active');    // Always for all that are more than 0

        if(current<max){

            var dep = this.getDependency(obj,current+1);
            if(dep!=false){
                var dependencymet=true;
                for(var name in dep){
                    var lvl = parseInt($('[classid='+name+']').attr('current'));
                    if(isNaN(lvl) || lvl<0 || lvl<parseInt(dep[name]))dependencymet = false;
                }
                if(dependencymet)obj.addClass('available');
                else obj.removeClass('available');
            }
            else if(typeof mustHave=='undefined' || typeof $('[skillid='+mustHave+'].active')[0] !='undefined'){
                obj.addClass('available');
            }
        }
        if(current>=max)obj.removeClass('available');

        return this;

    }
};

$(function(){

    skilltree.init($('.skilltree')).renderAll();

});