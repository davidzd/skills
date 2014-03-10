
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
                        $(this).each(function(){that.render($(this))});
                        $('.skill[musthave='+id+']').each(function(){that.render($(this))});
                    }

                    that.hint.find('p[showlevel]').hide();
                    that.hint.find('p[showlevel='+current+']').show();
                }

            }
        );
        this.buttons.hover(
            function(){
                that.hint.html($(this).find('div').html());
                var current = $(this).attr('current');
                that.hint.find('p[showlevel]').hide();
                that.hint.find('p[showlevel='+current+']').show();

                that.hint.show();
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


    },
    renderAll:function(){
        var that = this;
        this.buttons.each(
            function(){
                that.render($(this));
            }
        );
    },
    render:function(obj){
        // Rendering numbers

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

        obj.find('span').html(current+'/'+max);

        // Getting IDs

        var skillId = obj.attr('skillid');
        var mustHave = obj.attr('musthave');

        // Rendering states

        if(current>0)obj.addClass('active');    // Always for all that are more than 0

        if(current<max){
            if(typeof mustHave=='undefined' || typeof $('[skillid='+mustHave+'].active')[0] !='undefined'){
                    obj.addClass('available');
            }
            //obj.addClass('available');
        }


        if(current==max)obj.removeClass('available');

    }
};

$(function(){

    skilltree.init($('.skilltree'));
    skilltree.renderAll();



});