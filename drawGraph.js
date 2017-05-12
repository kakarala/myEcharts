/**
 * @author wuj
 */
(function(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 显示加载项
    myChart.showLoading();
    // 画图
    var drawGraph = function(){
        var now = new Date();
        var today = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
            day: now.getUTCDate()
        };
        // 缓存图表的数据
        var sharsOrNotData = {
            jzzs: '', // 净值走势
            syzh: '', // 收益走势
            ssgz: '', // 实时估值
            wfsy: '', // 万份收益
            qrnh: '' // 七日年化
        };
        // 获取数据
        var getNewData = function(){
            $.get('./net.json', function(data1){
                var data1 = JSON.parse(data1.split('=')[1]); // 单位净值
                $.get('./lljz.json', function(data2){
                    var data2 = JSON.parse(data2.split('=')[1]); // 累计净值
                    myChart.hideLoading();
                    sharsOrNotData.jzzs = [data1, data2];
                    eventBind([data1, data2]);
                });
            });
        }
        function init(){
            if(sharsOrNotData['jzzs']){
                myChart.hideLoading();
                eventBind(sharsOrNotData.jzzs);
            }else{
                getNewData();
            }
        }
        function eventBind(arr){
            // 月份的选择绘制不同的图表
            $('#btns a').click(function(){
                var minus = parseInt($(this).attr('minus')) ? parseInt($(this).attr('minus')) : $(this).attr('minus');
                var selectedDay = getSelectedDate(minus);
                selectedDates(selectedDay, arr);
            });
            // 默认显示三个月的数据
            $('#btns a:eq(2)').trigger('click');
        }
        // 返回1个月，3个月，6个月，1年，3年，今年以来，最大的新的日期数据
        function getSelectedDate(minus){
            if(minus === 'nowyear'){
                return today.year + '0101';
            }else if(minus === 'max'){
                return '00000000';
            }else{
                var nowYear = today.year;
                var nowMonth = today.month - minus;
                var nowDay = today.day;
                var selectedday = new Date(nowYear, nowMonth, nowDay);
                var selectedDay = {
                    year: selectedday.getUTCFullYear(),
                    month: (selectedday.getUTCMonth() + 1 < 10) ? '0' + (selectedday.getUTCMonth() + 1) : (selectedday.getUTCMonth() + 1),
                    day: selectedday.getUTCDate() < 10 ? '0' + selectedday.getUTCDate() : selectedday.getUTCDate()
                };
                return '' + selectedDay.year + selectedDay.month + selectedDay.day;
            }
        }
        // 初始化参数，绘制图表
        function selectedDates(boundary, arr){ // 边界日期
            var data1 = arr[0], data2 = arr[1];
            var dates = (function(){
                var dateValue = {
                    dates: [],
                    dwjz: [],
                    ljjz: []
                };
                $.each(data1,function(i,item){
                    if(parseInt(item[0]) > parseInt(boundary)){
                        dateValue.dates.push(item[0]);
                        dateValue.dwjz.push(item);
                        dateValue.ljjz.push(data2[i]);
                    }
                });
                return dateValue; // 返回时间和数据
            })();
            var jzzs = {
                title: {
                    // text: 'ECharts 入门示例'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: { // 图例组件
                    left: '50px',
                    data:['单位净值','累计净值'],
                    icon: 'rect'
                },
                xAxis: {
                    type: 'category',
                    data: dates.dates,
                    show: true,
                    scale: false
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    show: true,
                    position: 'left',
                    min: '0.0000',
                    max: '5.0000',
                    splitLine: {
                        show: true
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(value, index){
                            return value.toFixed(4);
                        }
                    }
                },
                series: [{
                    name: '单位净值',
                    type: 'line',
                    data: dates.dwjz
                },
                {
                    name: '累计净值',
                    type: 'line',
                    data: dates.ljjz
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(jzzs);
        }
        init();
    }
    drawGraph();
})();
