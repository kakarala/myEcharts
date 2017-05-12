/**
 * @author wuj
 */
(function(){
    'use strict';
    var fundCode = location.href.split('#')[0].split('?')[1];
    // 净值链接
    var jzLink = ['http://fund.10jqka.com.cn/api/Chart/fundCode/json/jsonljjz.json','http://fund.10jqka.com.cn/api/Chart/fundCode/json/jsondwjz.json'];
    // 收益走势
    var syLink = [];
    // 实时估值
    var ssLink = [];

    for(var i = 0; i < jzLink.length; i++){

        $.get(jzLink[i].replace('fundCode', fundCode), function(){
            // console.log(eval('ljjz_'+ fundCode));
        });
    }



})();
