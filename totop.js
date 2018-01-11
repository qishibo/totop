/**
 * Created on : 2018-01-11 18:31:19 星期四
 * Encoding   : UTF-8
 * Description: 冲顶小助手，哈哈哈哈哈哈
 *
 * @author    @qii404 <qii404.me>
 * @copyright qii404.me.
 */

var qii404 = {
    /**
     * 页面html
     */
    initHtml: '<h2 style="color:grey;">冲顶小助手，如果不需要，禁用该拓展即可</h2><h2 id="question">题目还未出现，稍等待...</h2><p id="items"></p><h4>相关性分析(根据搜索结果关键词，如果题目中含有‘不是’等否定词，一般选择频率最低的即可)<br></h4><div id="result"></div><p><button id="stop">稍等片刻，我看看结果</button>&nbsp;<button id="start">继续自动刷新题目</button></p><iframe id="iframe"></iframe>',

    /**
     * 题目url
     */
    questionUrl: 'http://htpmsg.jiecaojingxuan.com/msg/current',

    /**
     * 搜索链接
     */
    searchUrl: 'http://www.baidu.com/s?wd=',

    /**
     * 题干
     */
    question: '',

    /**
     * 答案选项
     */
    answers: [],

    /**
     * 分析结果
     */
    analysisResults: {},

    /**
     * 轮询时间
     */
    interval: 2000,

    /**
     * 定时器
     */
    timer: null,

    /**
     * 初始化
     */
    init: function() {

        $('body').html(this.initHtml);

        this.bindButton();
        this.runTimer();
    },

    /**
     * 启动计时器
     */
    runTimer: function() {
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
            if (this_.timer == null) return;
            clearInterval(this_.timer);
            this_.timer = null;
        });

        $('#start').on('click', function() {
            if (this_.timer != null) return;
            this_.runTimer();
        })
    },

    /**
     * 获取问题 && 后续流程
     */
    getQuestion: function() {
        var this_ = this;
        $.get(this.questionUrl, function(data) {

            // data = {
            //     "code": 0,
            //     "msg": "成功",
            //     "data": {
            //         "event": {
            //             "answerTime": 10,
            //             "correctOption": 0,
            //             "desc": "4.北京在哪一年申办奥运会成功的？",
            //             "displayOrder": 3,
            //             "liveId": 95,
            //             "options": "[\"2001\",\"2002\",\"2008\"]",
            //             "questionId": 1093,
            //             "showTime": 1515661495748,
            //             "stats": [
            //                 175971,
            //                 65928,
            //                 85861
            //             ],
            //             "status": 2,
            //             "type": "showAnswer"
            //         },
            //         "type": "showAnswer"
            //     }
            // };

            if(!(data && data.data && data.data.event && data.data.event.desc)){
               return;
            }

            this_.question = data.data.event.desc;
            this_.answers = eval(data.data.event.options);

            this_.renderOptions();

            this_.analysisQuestion(this_.question);
            this_.renderSearchPage(this_.question);
        });
    },

    /**
     * 渲染选项
     */
    renderOptions: function() {
        var html = '<ul>';
        var spell = ['A', 'B', 'C', 'D'];

        this.answers.forEach(function(item, i) {
            html += '<li>' + spell[i] + '、' + item + '</li>';
        });

        html += '</ul>';

        $('#items').html(html);
        $('#question').html(this.question);
    },

    /**
     * 渲染下部搜索页面
     */
    renderSearchPage: function() {
        var url = this.getSearchUrl(this.question);

        $('#iframe').remove();
        $("<iframe id='iframe' src='" + url + "'></iframe>").appendTo('body');
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

        for (var i in this.analysisResults) {
            options += i + ': ' + this.analysisResults[i] + '<br>';
        }

        $('#result').html(options);
    }
}

qii404.init();
