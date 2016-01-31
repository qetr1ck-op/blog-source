title: git pull vs git fetch
categories:
  - Git
date: 2014-11-24 23:46:41
---

What is the differences between "git pull" and "git fetch"?

<!--more-->

When you use `git pull`, Git tries to automaticaly do your work with for you. Git will do `git merge` any new pulled commits into to the branch you are currently working in. `git pull` is what you should to do to bring a local-branch up-to-date with its remore version, while also updating your other remote-tracking branches.

When you use `git fetch`, Git gather any commits from the target branch that do not exist in your current branch and stores them in your local repository. However, it does not merge them with your current branch.

You can do `git fetch` in any time to update your remote-tracking branches under `refs/remote/s/heads`. This operation never changes any of your own local branches under `refs/heads`