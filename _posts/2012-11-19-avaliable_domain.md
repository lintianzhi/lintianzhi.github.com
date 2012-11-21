---
layout: post
tags: [Python, 爬虫, domain]
title: 找出单词表中可用的域名
---

本来就想再多买一个域名玩玩的。然后不知道选什么，就想到把英文单词表的域名找出来看看。
找了一个网站，写了一个脚本把单词表里面的域名跑了一遍。 在找单词表的时候发现原来linux里面 /usr/share/dict/words 就是单词表，事情就方便很多了啊。

网站解析用了[who.is](who.is), 跑脚本的那两天辛苦它了，呵呵呵。
开始写的时候忘记多线程这种东西了（线程在爬虫里面不是很正常的嘛,白痴），跑得慢啊慢的。
后来换成多线程果断快很多，但是我没有把自己的带宽跑满（喂，你就爬了一个网站啊），忘记记录跑了多久了，反正实验室电脑就开那里。

我跑出来的的结果在[_这里_](/resource/available_domain.txt)。
我稍微排序了一下。
.com的域名太凶残了，我突然感觉爬单词表是一个很没意义的事情。
比如说我可以用两个单词，用中文拼音，这都比单个英文单词组合多、可选的范围大，而且一样有意义啊。

然后是代码， Python写得开始有点感觉了。
{% highlight python %}
#!/usr/bin/python
#coding=utf-8

import urllib
import urllib2
import re
import threading
import Queue

url = 'https://who.is/whois/name_search/'

headers = {'Host':'who.is',
           'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:15.0) Gecko/20100101 Firefox/15.0'}

pattern_str = '<header>Available</header>[\w\W^tl]*?tld[\W]+([\w]+)</div>'
pattern = re.compile(pattern_str)
missed_word = Queue.Queue()
def query_domain(name):
    try:
        op = urllib2.urlopen(url+name)
        result = op.read()
    except:
        missed_word.put(name)
        return None
    op.close()
    outlst = []
    for rst in pattern.finditer(result):
        outlst.append('{0}.{1}'.format(name,rst.group(1)))
    return outlst

def gen_words():
    wdlst = open('C:\\Users\\Clavier\\Documents\\Nutstore\\words', 'r').read().split()
    lst = [Queue.Queue() for i in range(25)]
    for wd in wdlst:
        if re.match('^[a-zA-Z]*$',wd):
            lst[len(wd)].put(wd)
    return lst


lock_print = threading.Lock()

def search_ava_domain(word_queue):
    while True:
        if word_queue.empty():
            break
        word = word_queue.get()
        rst = query_domain(word)
        if rst:
            with lock_print:
                print ' '.join(rst)
        word_queue.task_done()

def thread_search(word_queue, thread_num=35):
    for i in xrange(thread_num):
        threading.Thread(None, target=search_ava_domain, args=(word_queue,)).start()
    word_queue.join()
    if missed_word.qsize() > 0:
        thread_search(missed_word)

def main():
    word_lst = gen_words()
    for q in word_lst[5:]:
        thread_search(q)

if __name__ == '__main__':
    main()
{% endhighlight %}
P.S 我还是想吐槽json比xml简洁好用啊啊

P.SS Jekyll的日志命名格式有点恶心， 为毛是“年-月-日-标题”，这样子自动补全多讨厌的啊，“标题-年-月-日”就和谐多了。
