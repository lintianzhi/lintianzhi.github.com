---
layout: post
tags: [Python, 爬虫]
title: 一个解析Google翻译的脚本
---

反正Linux下面的翻译工具还是Google最好用。 然后每次都要开网页，嫌麻烦。就当是练习Python的网页抓取， 写一了一个抓取Google翻译的脚本。 

稍微设置了一下输入英文自动得出中文， 输入中文自动得出英文结果。
实际上的做法只是判断输入的第一个字符是不是英语字符。
本来还可以显示单词的例句的，但是最后发现有点碍眼啊。就是parse_ex那个函数
{% highlight python%}
#!/usr/bin/python
#coding=utf-8

import urllib
import urllib2
import sys
import simplejson

values_t = {'client':'t',
             'hl':'zh_CN',
             'ie':'UTF-8',
             'multries':2,
             'oe':'UTF-8',
             'otf':2,
             'sc':1,
             'sl':'en',
             'ssel':0,
             'text':'hello',
             'tl':'zh-CN',
             'tsel':0}
headers = {'Host':'translate.google.cn',
           'Referer':'http://translate.google.cn/',
           'User-Agent':'  Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:15.0) Gecko/20100101 Firefox/15.0'}
url_t = 'http://translate.google.cn/translate_a/t'
url_ex = 'http://translate.google.cn/translate_a/ex'

def parse(data):
    lst = data.split(',')
    for i,v in enumerate(lst):
        if not v:
            lst[i] = '0'
    data = ','.join(lst)
    vl = simplejson.loads(data)
    return vl

def query(arg):
# query for your input
    if 96<ord(arg[0])<123 or 64<ord(arg[0])<91:
        values_t['sl'],values_t['tl'] = ('en','zh-CN')
    else:
        values_t['sl'],values_t['tl'] = ('zh-CN','en')
    values_t['text'] = arg
    para = urllib.urlencode(values_t)
    req = urllib2.Request(url_t,para,headers)
    f = urllib2.urlopen(req)
    result = parse(f.read())
    trans_rst = result[0][0][0].encode('utf-8')
    print 'Translate Result:'
    print trans_rst
    #query_ex(arg, trans_rst)
    print

def query_ex(arg, trans_rst):
# query for example
    values_ex = {'q':arg,
                 'sl':values_t['sl'],
                 'tl':values_t['tl'],
                 'utrans':trans_rst}
    para = urllib.urlencode(values_ex)
    req = urllib2.Request(url_ex,para,headers)
    f = urllib2.urlopen(req)
    try:
        usage_ex = simplejson.loads(f.read())[1][0]
        print '\nUsage Example:'
        for j,ex in enumerate(usage_ex):
            for i in [0,3]:
                ex[i] = ex[i].replace('<b>','|')
                ex[i] = ex[i].replace('</b>','|"')
                ex[i] = ex[i].encode('utf-8')
            print '{0}:\n{1}\n{2}'.format(j,ex[0],ex[3])
    except IndexError:
        pass

def main():
    arg = ' '.join(sys.argv[1:])
    if arg:
        query(arg)
        return
    while True:
        arg = sys.stdin.readline()
        query(arg)

if __name__ == '__main__':
    main()

{% endhighlight %}

PS. Google翻译没有音标太讨厌了
