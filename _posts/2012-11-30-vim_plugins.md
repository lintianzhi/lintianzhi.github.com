---
layout: post
tags: [vim, plugin]
title: vim的插件使用
---

（vi读起来比较爽一点，所有我用vi代替vim了）  
是我以前打开vi的方式错了啊，自从前两天装了vi的插件，真的是帅到爆了啊。  
在网上看到别人分享的插件就去试了一下。然后才发现自己以前多么无知T.T 。

废话不说，我只是想讲讲那个是怎么做的。 
原本吧，看着网上那些个配置vi插件的教程，头都大了（这就是为什么以前我只是弄了一下.vimrc文件）。  
自从知道了[Vundle][0]，爬五楼腰不酸腿不疼了。  
1. 这是一个vi的插件管理工具，你所需要做的就是把[Vundle][0] clone到`~/.vim/bundle/vundle/`目录下面。  
然后编辑.vimrc文件, 加入`Bundle jnwhiteh/vim-golang`之类的，那个的意思就是`jnwhiteh写的vim-golang`。  
2. 在vi里面执行 `:BundleInstall`， [Vundle][0]就会自动在github上面找对应的插件下载到`~/.vim/bundle/`目录里面。  
然后就完成了！！！

- 如果不想用了只要把对应的插件那一行注释掉。
- 如果有插件文件想直接放进去的话，可以把文件拷到`~/.vim/bundle/`
下面在`.vimrc`加上对应的行就可以了。  

很简单有木有！！
当然。。 我省略了一些基本的东西。  
比如[Vundle][0]的基本配置，但是这个有什么关系的。直接用现成的就好了。
[戳这里](https://github.com/lintianzhi/dot-vimrc.git)  
这个vi插件配置很强大的，目测能秒杀目前一切的IDE哇。说vi不好的人只是不会用。
今天只是加了一下golang的高亮。想起来以前一直只是敲敲vi的基本命令就心疼。

PS. 这才是vim正确的打开方式，也是Linux的。用简单的东西拼装成超级好用的复杂的东西（看起来复杂  

[0]: https://github.com/gmarik/vundle
