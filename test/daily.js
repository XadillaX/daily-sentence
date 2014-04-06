/**
 * Created by XadillaX on 2014/4/6.
 */
var daily = require("../");

function output(err, sen) {
    if(err) {
        console.error(err);
    } else {
        console.log(sen);
    }
}

// daily.setUseCache(false);
daily.today(output);
daily.get("yesterday", output);
daily.get("today", output);
daily.get("tomorrow", output);
daily.get(output);
daily.get(1396790706, output);
daily.get(1396790706123, output);
daily.get("2013-12-19", output);
