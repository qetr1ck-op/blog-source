title: "git pull" versus "git pull --rebase"
tags:
  - Git
date: 2014-10-16 22:05:58
---


<!--toc-->
<!--more-->

# Short answer

`git pull` = `git fetch` + `git merge`

`git pull --rebase` = `git fetch` + `git rebase`
For more detail info how `git pull` and `git rabase` differs continue reading.

#  Long answer: `git merge` and `git rebase`

Suppose originally there were a 3 commits, `A`, `B`, `C`:

![](http://i.stack.imgur.com/lJRq7.png)

Then developer Dan create commit `D`, and developer Ed created commit `E`:

![](http://i.stack.imgur.com/pK7Zb.png)

Obviously, this conflict should be resolve somehow. For this are 2 ways:

##	`git merge`

![](http://i.stack.imgur.com/9Ul5w.png)

Both commits `D` and `E` are still here, but git create merge commit `M` that inherits changes from both `D` and `E`. However, this create `diamond` shape, which many people find confusing.

##	`git rebase`

![](http://i.stack.imgur.com/TvXuJ.png)

Git create commit `R` which is identical to merge commit `M`. But, we get rid of commit `E`, like it have never existed (shown by dots). Because of this, `E` should be local to developer Ed and should have never pushed to any repository.

Advantage of `rebase` is that it's avoided, and history stays nice straight line - most developers love that!

Make my day:
*	[Discussion on StackOverflow](http://stackoverflow.com/questions/871/why-is-git-better-than-subversion)