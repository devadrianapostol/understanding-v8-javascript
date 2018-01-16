# Understanding V8 for Javascript Developers

Written by [@jotadeveloper](https://twitter.com/jotadeveloper)

**Note**: **This book is in constant development, the content may change and unfilled chapters will appear periodically.**

The V8 JavaScript Engine is an open source JavaScript engine developed by The Chromium Project for the Google Chrome web browser.  It is used in other projects, such as Node.js on the server side.

I deeply believe the understanding behind the scenes of a Javascript engine helps a lot to code much better and performant code and it will help you to analyze and profile bottlenecks.

In this book we will go through all elements that compose the V8 Javascript engine. V8 differs in some steps if we compare it to SpiderMonkey, Javascript Core and Chakra.

As a Javascript developer you will discover a set of tools to analyze your code and improve it. 

This book is targeted at an audience that wants to get a high level overview of the V8 engine.
Knowledge of a low level programing language is not needed. 

All the content described in the following pages is based on my own research and from the point of view of a Javascript Developer.


### Disclaimer

I'm not a V8 contributor and also I'm not a C++ developer. I'm just a **javascript developer enthusiast** that is trying to explain some things behind the scenes and the correct usage of V8 from a Web Developers point of view.

***

###### Contributions, bugfixing, report issues, suggestions:

* https://github.com/juanpicado/understanding-v8-javascript

***

![](/assets/88x31.png)

This work is licensed under a [Creative Commons Attribution-NonCommercial-NoDerivs 3.0](https://creativecommons.org/licenses/by-nc-nd/3.0/) Unported License.
