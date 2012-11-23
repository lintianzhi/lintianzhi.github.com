---
layout: post
tags: [C/C++]
title: C++内存错误：拷贝构造函数
---

暑假实习的时候写C++， 当时遇到一个C++内存的错误， 程序跑啊跑，然后跑飞了。  
首先看下面的代码：
意思是建一个Sheet的实例，Sheet里面包含了SubSheet，SubSheet里面又存了Sheet的地址。
{% highlight c++ %}
#include <iostream>
#include <cstdio>
#include <vector>

using namespace std;
class SubSheet;
class Sheet;

class SubSheet
{
public:
    SubSheet(Sheet *sheet):pSheet(sheet){}
    void PrintSheetAddr()
    {
        printf("Sheet Address from sub  : %p\n", pSheet);
    }

//private:
    Sheet *pSheet;
};
class Sheet
{
public:
    Sheet():iSubSheet(SubSheet(this)){}

//    Sheet(const Sheet &st):iSubSheet(SubSheet(this))
//    {
//        iSubSheet.pSheet = this;
//    }

    void PrintAddress()
    {
        printf("Sheet Address from sheet: %p\n", this);
    }
    void PrintAddrFromSub()
    {
        iSubSheet.PrintSheetAddr();
    }

//private:
    SubSheet iSubSheet;
};

int main()
{
    const int N = 2;
    vector<Sheet> sheets;
    for(int i=0; i<N; i++)
    {
        sheets.push_back(Sheet());
    }
    for(int i=0; i<N; i++)
    {
        sheets[i].PrintAddress();
        sheets[i].PrintAddrFromSub();
    }
}
{% endhighlight %}
这样子在Sheet类和SubSheet的类中分别输出Sheet得到这样的结果：
    Sheet Address from sheet: 0x9d5d018
    Sheet Address from sub  : 0xbf9bdc00
    Sheet Address from sheet: 0x9d5d01c
    Sheet Address from sub  : 0xbf9bdc00

为什么会这样呢？  
首先是Sheet类是在函数栈上面开辟的、
（为什么不直接在堆上面构造实例而要先构造再复制，后面解释）。  
然后复制到STL申请的空间里面。在构造Sheet实例的时候已经用自己的指针创建了iSubSheet这个东西，即iSubSheet里面保存着当前Sheet的地址（栈地址）。
接下来STL要把你创建的实例复制到堆内存里面去， 因为没有提供拷贝构造函数，
所以系统自己提供了一个， 功能就是把原来的实例里面的东西原原本本地复制到新的实例里面。

这里的问题是：新的Sheet实例里面iSubSheet的pSheet应该指向新的地址，即堆的地址。
但是因为使用了系统提供的拷贝构造函数， 所以pSheet还是原来旧的地址， 即栈的地址。

这里的解决方法就是自己提供拷贝构造函数， 把旧的地址换成新的地址。（把Sheet类构造函数下面4行注释去掉就好了）
新的结果：
    Sheet Address from sheet: 0x8119018
    Sheet Address from sub  : 0x8119018
    Sheet Address from sheet: 0x811901c
    Sheet Address from sub  : 0x811901c
这样子就完全没有问题了。  
这里的话就算Sheet类是直接在堆上面开辟的话，如果没有拷贝构造函数。最开始应该是没有问题的。  
但是如果把N变大，那么vector在变大的过程中还是会有拷贝的操作，依然会有问题。
这种内存错误一旦出现是很难找到问题的啊！！！程序飞到哪里停下都不知道。

至于为什么要先创建实例再复制。  
这关系到STL的memory pool，这东西简单地说就是在程序开始地时候开辟一个很大的空间，
在你使用到STL然后需要开辟空间的时候直接拿来用而不是去跟系统申请。
具体的细节可以看侯捷的[《池内春秋》](/resource/memory_pool.pdf)  
PS. 总感觉我有把GitHub当作网盘的倾向
