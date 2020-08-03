define([], function() {
    return {
        init: function() {
            // 下拉菜单
            const $dropmenu = $('.dropmenu ul li');
            const $menulist = $('.dropmenu .menulist');
            const $dropitems = $('.dropmenu .menulist .items');
            $menulist.on('mouseover', function() {
                $menulist.show();
            })
            $menulist.on('mouseout', function() {
                $menulist.hide();
            })

            $dropmenu.on('mouseover', function() {
                $menulist.show();
                $(this).addClass('active').siblings('li').removeClass('active');
                $dropitems.eq($(this).index()).show().siblings('.items').hide();
            })
            $dropmenu.on('mouseout', function() {
                $menulist.hide();
            })
        }
    }
})