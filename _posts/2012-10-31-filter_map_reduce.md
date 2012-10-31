---
layout: post
tags: [Python, Tool]
title: filter_map_reduce
---

------------------------------------------
<br/>
###filter(function, sequence) 
像它的名字一样，就是过滤用的， 把seq里面的元素作为参数一个个放到func里面返回值是True就选择它，False就抛弃

{% highlight python%}
    def fit(x): return x%2
    filter(fit,xrange(10))
{% endhighlight %}
如果不用filter, 貌似还简单一点啊
{% highlight python%}
    [x for x in xrange(10) if x%2]
{% endhighlight %}
<br/>

###map(func,seq) 
就是一一对应，取seq中的元素作为func的参数返回对应的值
{% highlight python%}
    def cube(x): return x*x*x
    seq = xrange(5)
    map(cube, seq)
    Out[12]: [0, 1, 8, 27, 64]

    def add3(x,y,z): return x+y+z
    map(add3, seq, seq, seq)
    Out[14]: [0, 3, 6, 9, 12]
{% endhighlight %}
对的， map支持多个list作为参数， 只要map的第一个参数的函数符合就可以的
<br/>
###reduce(func,seq)
理解为归纳的意思靠谱一点，就是把一队数据利用func归纳为一个结果，每次运行func，用上一次的结果和下一个数作为参数一次次叠加叠加叠加。。。
可以加第三个参数， 作为第一次迭代的一个参数。
{% highlight python%}
    def add(x,y): return x+y
    reduce(add,xrange(5))
    Out[17]: 10
{% endhighlight %}

这几个函数本来也就是从函数式编程里面借鉴过来的， Google的MapReduce的思想和这个也是一样的。

python的list是个很神奇的东西啊。像pythoner一样写代码。
