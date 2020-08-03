//模块配置

require.config({
    paths: {
        'jquery': 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min',
        'jqcookie': 'https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie'
    }
})

//列表页
require(['jquery', 'jqcookie'], function() {
    let modename = $('#currentpage').attr('currentmod');
    if (modename) {
        require([modename], function(mod) {
            mod.init();
        })
    }

})