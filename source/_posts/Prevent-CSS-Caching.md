title: Prevent CSS Caching in Wordpress
categories:
  - CSS
date: 2014-06-02 19:50:42
---

If you update your WordPress theme’s style.css, you may have noticed that you have to “force-reload” your site in your browser to see the changes. This is because your browser keeps a copy of the CSS cached on your hard drive. 

<!--more-->

Depending on how your server is set up, it may not check for a new version of the stylesheet for a couple hours, or longer! And even if you force-reload to see the changes, visitors who have previously accessed your site may still get the old CSS. 



One way to solve this is to “version” your CSS file, by adding:

[html]
<link rel="stylesheet" 
href="<?php bloginfo('stylesheet_url'); echo '?' . filemtime( get_stylesheet_directory() . '/style.css'); ?>" type="text/css" media="screen, projection" />
[/html]

Save my day: 
[Mark post](http://markjaquith.wordpress.com/2009/05/04/force-css-changes-to-go-live-immediately)
[Css-tricks](http://css-tricks.com/can-we-prevent-css-caching/)