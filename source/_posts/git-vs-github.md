title: Git and GitHub, Git versus Subversion
thumbnailImage: git-github.png
tags:
  - Git
  - GitHub
date: 2014-03-29 17:24:17
---

How GitHub is connected to Git and basic difference Git and Svn.

<!--more-->

<!-- toc -->

*   [Git and GiHub](#Git and GiHub)

*   [The difference](#The difference)

<a href name="Git and GiHub"></a>
<div class="title-block">Git and GiHub</div>

So `Git` and `GitHub` are parts of one complex system, which complement each other:

*	Git is the name of `VCS` (version control system) wrote by [Linus Torvalds](http://en.wikipedia.org/wiki/Linus_Torvalds "Linus Torvalds"). There are always series of `commits`(snapshots). You see a path of this snapshots, in which order they were created. You create `branch` for new features and use snapshot for `revert` changes.
*   GitHub is website on which you can publish your Git repositories and collaborate with other people.

<a href name="The difference"></a>
<div class="title-block">The difference</div>

Git is not better than Subversion. But is also not worst. It's different:

*   The key difference is that `Git` is a `decentralized`. With `Git` you can do practically anything off-line, cause everyone has their own repository. For example: I have a server at home and a Laptop on the road. SVN simply doesn't work well here. With SVN, I can't have local source control if I'm not connected to the repository (Yes, I know about SVK or about ways to copy the repo). With Git, that's the default mode anyway. With command `git commit` you commit locally, whereas `git push origin master` - you push the master branch to the remote branch named `origin`.
*   Making `branches` and `merging` between branches is `Git` way. Everybody who likes your changes can pull them into their project, including the official maintainers. It's trivial to `fork` a project, modify it, and still keep merging in the bug-fixes from the `HEAD` branch.
*   Git is perfectly suited for Open Source projects: just fork it, commit your changes to your own Fork, and then ask the original project maintainer to pull your changes.
*   On the other hand Git adds `complexity`. Two modes of creating repositories, checkout vs. clone, commit vs. push... You have to know which commands work locally and which work with "the server".

Make my day:
[understanding-the-basics-of-git-and-github](http://stackoverflow.com/questions/11816424/understanding-the-basics-of-git-and-github "stackoverflow")
[Discussion on StackOverflow](http://stackoverflow.com/questions/871/why-is-git-better-than-subversion)