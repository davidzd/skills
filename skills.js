
var skilltree = {
    buttons:'',
    init:function(obj){
        var that = this;
        this.buttons = obj.find('.skill');
        this.buttons.click(function(){

                if($(this).hasClass('available')){
                    var current = $(this).attr('current');
                    var id=$(this).attr('skillid');

                    var max = $(this).attr('max');
                    if(current<max){

                        $(this).attr('current',parseInt(current)+1);
                        $(this).each(function(){that.render($(this))});
                        $('.skill[musthave='+id+']').each(function(){that.render($(this))});
                    }
                }

            }
        );


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

        var current =   obj.attr('current');
        var max =       obj.attr('max');

        if(typeof current=='undefined'){
            current=0;
            obj.attr('current',0);
        }
        if(typeof max=='undefined'){
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