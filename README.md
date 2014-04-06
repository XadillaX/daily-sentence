Daily Sentence (Node.js)
=====================

A `daily-sentence` module for node.js. (data from http://xue.youdao.com/w?page=1&amp;type=all&amp;position=tinyEnglish)

It will offer you different an English sentence (translation included) and an image each day. Something like:

> ![不入虎穴，焉得虎子](http://oimagec1.ydstatic.com/image?product=dict-treasury&id=28592795125412817&w=280&h=170)
>
> He who would search for pearl must dive deep.
>
> 不入虎穴，焉得虎子。
>
> <p style="text-align: right;">—— [4/2/2014]</p>

Installation
---------------------

You just input that code under terminal:

```sh
$ npm install daily-sentence
```
And you just need require this module in your code file:

```javascript
var daily = require("daily-sentence");
```

Usage
---------------------

### Today

You can get today's sentence via

```javascript
daily.today(function(err, sentence) {
	// DO SOMETHING...
});
```

### One Day

You can get oneday's sentence via:

```javascript
daily.get(ONE_DAY, function(err, sentence) {
	// DO SOMETHING...
});
```

The `ONE_DAY` above is a variable. It can be:

  + Timestamp. (Eg. 1396793790)
  + Timestamp with millionsecond. (Eg. 1396793790762)
  + A time string. (Eg. "2012/1/2", "Apr 2, 2012", etc. Refer to [SugarJS](http://sugarjs.com/date_formats))
  + A date object. (Eg. `new Date()`)

### Sentence Format

The callback function will offer you an object that like:

```json
{
	"date"  : "yyyy-mm-dd",
	"image" : "THE_IMAGE_URL",
    "sen"   : "THE_ENGLISH_SENTENCE",
    "trans" : "THE_TRANSLATION"
}
```

### Disable Cache

The module will default enable local cache (to save the network traffic). It will create a `.daily-sen-db` directory at your **current work directory** (`process.cwd()`). And all the cache file will be put into it.

If you don't want to use the cache files, you can disable it before you `get`.

```javascript
daily.setUseCache(false);
```

And if you want to reopen it, just switch the `false` to `true`.

### To Do

Maybe I will create some `sync` functions. Just maybe.

### Contribute

Anyone can do contribution to this project. And I will glad to merge your commit.

Just contact me @:

  + Email: admin#xcoder.in
  + [Weibo](http://weibo.com/xadillax)
  + StackOverflow

### License

GPLv2