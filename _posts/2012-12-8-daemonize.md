---
layout: post
tags: [system]
title: 把程序守护进程化
---

这几天在看[golang][golang], 越来越觉得那是个超级好用的东西。  
编程思路又换了一下，主要在[golang][golang]的interface，是个很奇葩的想法。  
怎么奇葩以后再说，等我弄的熟练一点再说。  
额，这个不是主题。我是想说[golang][golang]里面没有fork这个函数，
也就是说没有可以进行守护进程创建的方法。  
真的没有吗？假的。只是说没有直接的方法，至少我知道两个：  
1. 直接使用syscall调用原生的系统调用  
2. 调用c的fork  
话说我比较偏向第二种的，在go里面调用c的东西很简单喂

不不不，这里我只是想说我写了一小段代码可以把任何进程守护进程化。  
原理还是挺简单的， C里面fork一段程序， 然后在子程序里面用exec函数。  
然后就好了。很简单有没有！！ 所以代码也是很简单的。

编译后把执行程序mv到/bin里面就大功告成了。这样就可以当做命令运行了。   
写这个的目的是goagent哇， 每次翻那个什么墙都要运行程序，控制台还不能关。  
还有那个断网后使用的自制的sock5借实验室网的东西。
现在开心了。

我还是保留了程序的stdout的输出， 因为不喜欢的话把那个控制台窗口关掉就好了，
程序反正还在跑的。
{% highlight c %}
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char * argv[])
{
    int i;
    pid_t pid;
    if(argc < 2)
    {
        printf("At least 2 arguments\n");
        return 0;
    }

    pid = fork();
    if(pid == 0)
    {
//        freopen("/dev/null","w",stdout);
        i = execv(argv[1], &argv[1]);
        if(i < 0)
            printf("Error of: %s\n",argv[1]);
        return 0;
    }
    printf("daeman pid: %d\n", pid);

    return 0;
}
{% endhighlight %}
PS. 要期末考试了T.T

[golang]: http://golang.org
