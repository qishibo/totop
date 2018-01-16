/**
 * Created on : 2018-01-11 18:31:19 星期四
 * Encoding   : UTF-8
 * Description: 答题小助手，哈哈哈哈哈哈
 *
 * @author    @qii404 <qii404.me>
 * @copyright qii404.me.
 */

var qii404 = {

    /**
     * 题目url
     */
    questionUrl: 'http://wd.sa.sogou.com/api/ans?key=',

    /**
     * 搜索链接
     */
    searchUrl: 'http://www.baidu.com/s?wd=',

    /**
     * 分析结果
     */
    analysisResults: {},

    /**
     * 轮询时间
     */
    interval: 500,


    /**
     * 定时器
     */
    timer: null,

    /**
     * 计数器
     */
    counter: 0,

    /**
     * 当前应用
     */
    preApp: 'cddh',

    /**
     * 初始化
     */
    init: function() {
        this.bindChangeApp();
        this.bindButton();
        this.runTimer();
    },

    /**
     * 绑定app切换
     */
    bindChangeApp: function() {
        var this_ = this;

        $('#app-type').change(function(e) {

            var val = $(this).children('option:selected').val();

            if (!val) {
                clearInterval(this_.timer)
                return;
            }

            this_.preApp = val;

            clearInterval(this_.timer);
            this_.runTimer();
        });
    },

    /**
     * 启动计时器
     */
    runTimer: function() {
        this.getQuestion();
        var this_ = this;

        this.timer = setInterval(function() {
            this_.getQuestion();
        }, this.interval);
    },

    /**
     * 按钮绑定
     */
    bindButton: function() {

        var this_ = this;

        $('#stop').on('click', function() {
            clearInterval(this_.timer);
            this_.renderCounter('stop');
        });

        $('#start').on('click', function() {
            clearInterval(this_.timer);
            this_.runTimer();
        });
    },

    /**
     * 获取问题 && 后续流程
     */
    getQuestion: function() {
        this.renderCounter();
        var this_ = this;

        $.get(this.getQuestionUrl(), function(data) {
            console.log(data);

            var data = JSON.parse(data.result[data.result.length - 1]);
            var template = $('#question-template').html();

            Mustache.parse(template);
            $('#question-container').html(Mustache.render(template, data));

            this_.renderSearchPage(data.title);
        });
    },

    /**
     * 获取题目url
     */
    getQuestionUrl: function() {
        return this.questionUrl + this.preApp;
    },

    /**
     * 渲染计数器
     */
    renderCounter: function(type) {
        $('#status').html(type == undefined ? '刷新中': '已停止');
        $('#counter').html(type == undefined ? ++this.counter : this.counter);
    },

    /**
     * 渲染下部搜索页面
     */
    renderSearchPage: function(question) {
        $('#iframe').attr('src', this.getSearchUrl(question));
    },

    /**
     * 分析题干
     */
    analysisQuestion: function(question) {
        this.search(question);
    },

    /**
     * 进行搜索
     */
    search: function(question) {
        var url = this.getSearchUrl(question);
        var this_ = this;

        $.get(url, function(html) {
            this_.analysisHtml(html);
            this_.renderAnalysis();
        });
    },

    /**
     * 获取搜索url
     *
     */
    getSearchUrl: function(question) {
        return this.searchUrl + question.substring(question.indexOf('.') + 1);
    },

    /**
     * 分析html
     *
     */
    analysisHtml: function(html) {
        var this_ = this;
        this.answers.forEach(function(item) {
            var re = eval('/' + item + '/ig');
            var matches = html.match(re);
            this_.analysisResults[item] = matches ? matches.length : 0;
        });

        console.log(this.analysisResults);
    },

    /**
     * 渲染分析结果
     */
    renderAnalysis: function() {
        var options = '';
        var index = 0;

        for (var i in this.analysisResults) {
            options += this.choice[index] + '、' + i + ': <span class="label label-default">' + this.analysisResults[i] + '</span><br>';
            index++;
        }

        $('#result').html(options);
    }
}

qii404.init();
