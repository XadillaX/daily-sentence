/**
 * Created by XadillaX on 2014/4/6.
 */
var spidex = require("spidex");
var util = require("util");
var fs = require("fs");
var path = require("path");
var header = {
    "user-agent"        : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36",
    accept              : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language"   : "zh-CN,en-US;q=0.8,en;q=0.6",
    "cache-control"     : "max-age=0",
    "connection"        : "keep-alive",
    "host"              : "xue.youdao.com"
};

var dbpath = "/.daily-sen-db/";

/**
 * Daily English class.
 * @param [useCache]
 * @constructor
 */
var Daily = function(useCache) {
    if(undefined === useCache) {
        useCache = true;
    }

    this.useCache = useCache;
    this.baseURI = "http://xue.youdao.com/w?method=tinyEngData&date=";
};

/**
 * Set whether daily uses cache.
 * @param useCache
 */
Daily.prototype.setUseCache = function(useCache) {
    if(undefined === useCache) {
        useCache = true;
    }

    this.useCache = useCache;
};

/**
 * crawl it from `YOUDAO`.
 * @param day
 * @param callback
 * @param [instead]
 * @private
 */
Daily.prototype._crawler = function(day, callback, instead) {
    if(!instead) instead = day;

    var self = this;
    spidex.get(this.baseURI + day, function(html, status, respHeader) {
        if(status !== 200) {
            callback(new Error("The server returns a wrong status."));
            return;
        }

        /**
         * Eg.
         *   <script>
         *       var loaded_data = {
         *           '2014-02-28':{type:"EXAMPLE",
         *               date:"2014-02-28",
         *                          image:"http://oimagec1.ydstatic.com/image?product=dict-treasury&id=626832945622866907&w=776&h=500",
         *                      sen:"The good seaman is known in bad weather.",
         *           trans:"惊涛骇浪，方显英雄本色。",
         *           rel:""}
         *       };
         *   </script>
         *
         * @type {RegExp}
         */
        var regex = /date:".*",[\s]+image:"(.*)",[\s]+sen:"(.*)",[\s]+trans:"(.*)",/;
        var result = regex.exec(html);

        //if(!result || result.length !== 4) {
        //    callback(null, { date: instead, image: "", sen: "", trans: "" });
        //    return;
        //}

        // if that day is empty, go back...
        if(!result || result.length !== 4) {
            var temp = Date.create(day).addDays(-1).format("{yyyy}-{MM}-{dd}");
            return self._crawler(temp, callback, instead);
        }

        var result = {
            date    : instead,
            image   : result[1],
            sen     : result[2],
            trans   : result[3]
        };
        fs.mkdir("." + dbpath, function() {
            fs.writeFile("." + dbpath + instead + ".json", JSON.stringify(result), { encoding: "utf8" }, function() {
                callback(null, result);
            });
        });
    }, header, "utf8").on("error", function(err) {
        callback(err);
    });
};

/**
 * Get today's data.
 * @param callback
 */
Daily.prototype.today = function(callback) {
    this.get(callback);
};

/**
 * Get daily English.
 * @param [day]
 * @param callback
 */
Daily.prototype.get = function(day, callback) {
    // today...
    if(typeof day === "function") {
        callback = day;
        day = Date.create().format("{yyyy}-{MM}-{dd}");
    } else {
        // Date
        if(util.isDate(day)) {
            day = day.format("{yyyy}-{MM}-{dd}");
        } else {
            // with timestamp...
            var tmp = parseInt(day);
            if(!isNaN(tmp) && tmp.toString().length === 10) {
                day = Date.create(tmp * 1000).format("{yyyy}-{MM}-{dd}");
            } else if(!isNaN(tmp) && tmp.toString().length === 13) {
                day = Date.create(tmp).format("{yyyy}-{MM}-{dd}");
            } else {
                // string...
                day = Date.create(day).format("{yyyy}-{MM}-{dd}");
            }
        }
    }

    if(this.useCache) {
        try {
            // try to read from local file.
            var absoluteDBPath = path.relative(__dirname, path.normalize(process.cwd() + dbpath));
            var result = require(absoluteDBPath + "/" + day);

            if (!result.image || !result.date || !result.sen || !result.trans) {
                this._crawler(day, callback);
            } else {
                callback(null, result);
            }
        } catch (e) {
            this._crawler(day, callback);
        }
    } else {
        this._crawler(day, callback);
    }
};

module.exports = Daily;
