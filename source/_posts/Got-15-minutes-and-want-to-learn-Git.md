title: Got 15 minutes and want to learn Git?
tags:
  - Git
id: 198
categories:
  - Git
date: 2014-07-19 09:56:12
---

<!--more-->

#  Initialize a Git

Git allows groups of people to work on the same documents (often code) at the same time, and without stepping on each other's toes. It's a distributed version control system.

Our terminal prompt below is currently in directory we decided to name "octobox". To initialize a Git repository here, type the following command: 

```
git init
```
  
#  Checking the Status

Good job! As Git just told us, our "octobox" directory now has an empty repository in /.git/. The repository is a hidden directory where Git operates.
Next up, let's type the git status command to see what the current state of our project is:

```
git status
```

Tip:
It's healthy to run `git status` often. Sometimes things change and you don't notice it.

#  Adding Changes

Good, it looks like our Git repository is working properly. Notice how Git says octocat.txt is "untracked"? That means Git sees that octocat.txt is a new file.

To tell Git to start tracking changes made to octocat.txt, we first need to add it to the staging area by using git add.

```
git add octocat.txt
git add *.txt
git add --all
git add docs/*.txt
git add docs/
git add .
```
<dl>
  <dt>staged:</dt>
  <dd>Files are ready to be committed.</dd>
  <dt>unstaged:</dt>
  <dd>Files with changes that have not been prepared to be commited.</dd>
  <dt>untracked:</dt>
  <dd>Files aren't tracked by Git yet. This usually indicates a newly created file.</dd>
  <dt>deleted:</dt>
  <dd>File has been deleted and is waiting to be removed from Git.</dd>
</dl>

#  Checking for Changes

Good job! Git is now tracking our octocat.txt file. Let's run git status again to see where we stand:

```
git status
```

You can use `git reset filename` to remove a file or files from the staging area.

#  Committing

Notice how Git says changes to be committed? The files listed here are in the Staging Area, and they are not in our repository yet. We could add or remove files from the stage before we store them in the repository.

To store our staged changes we run the `commit` command with a message describing what we've changed. Let's do that now by typing:

```
git commit -m "Add new file"
```

Staging Area:
A place where we can group files together before we `commit` them to Git.

Commit
A `commit` is a snapshot of our repository. This way if we ever need to look back at the changes we've made (or if someone else does), we will see a nice timeline of all changes.

#  History

So we've made a few commits. Now let's browse them to see what we changed.

Fortunately for us, there's `git log`. Think of Git's log as a journal that remembers all the changes we've committed so far, in the order we committed them. Try running it now:

```
git log
```

Use `git log --summary` to see more information for each commit.

#  Remote Repositories

To push our local repo to the GitHub server we'll need to add a remote repository.

This command takes a remote name and a repository URL, which in your case is https://github.com/try-git/try_git.git.

```
git remote add origin url
```

Git doesn't care what you name your remotes, but it's typical to name your main one `origin`.

#  Pushing Remotely

The `push command` tells Git where to put our commits when we're ready, and boy we're ready. So let's push our local changes to our origin repo (on GitHub).

The name of our remote is origin and the default local branch name is `master`. The -u tells Git to remember the parameters, so that next time we can simply run git push and Git will know what to do. Go ahead and push it!

```
git push -u origin master
```

#  Pulling Remotely

Let's pretend some time has passed. We've invited other people to our github project who have pulled your changes, made their own commits, and pushed them.

We can check for changes on our GitHub repository and pull down any new changes by running:

```
git pull origin master
```

#  Differences

Uh oh, looks like there has been some additions and changes to the octocat family. Let's take a look at what is different from our last commit by using the `git diff` command.

In this case we want the diff of our most recent commit, which we can refer to using the HEAD pointer.

```
git diff HEAD
```

The HEAD is a pointer that holds your position within all your different commits. By default HEAD points to your most recent commit.

#  Staged Differences

Another great use for diff is looking at changes within files that have already been staged. Remember, staged files are files we have told git that are ready to be committed.

Good, now go ahead and run git diff with the --staged option to see the changes you just staged. You should see that octodog.txt was created.

```
git diff --staged
```

Using 'git diff' gives you a good overview of changes you have made and lets you add files or directories one at a time and commit them separately.

#  Resetting the Stage

So now that octodog is part of the family, octocat is all depressed. Since we love octocat more than octodog, we'll turn his frown around by removing octodog.txt.

You can unstage files by using the git reset command. Go ahead and remove octofamily/octodog.txt.

```
git reset octofamily/octodog.txt
```

#  Undo

Files can be changed back to how they were at the last commit by using the command: `git checkout -- <target>`. Go ahead and get rid of all the changes since the last commit for octocat.txt

```
git checkout -- octocat.txt
```

So you may be wondering, why do I have to use this '--' thing?  This way if you happen to have a branch named octocat.txt, it will still revert the file, instead of switching to the branch of the same name.

#  Branching Out

When developers are working on a feature or bug they'll often create a copy (aka. branch) of their code they can make separate commits to. Then when they're done they can merge this branch back into their main master branch.

We want to remove all these pesky octocats, so let's create a branch called clean_up, where we'll do all the work:

```
git branch clean_up
```

#  Switching Branches

Great! Now if you type git branch you'll see two local branches: a main branch named master and your new branch named clean_up.

You can switch branches using the `git checkout <branch> `command. Try it now to switch to the clean_up branch:

```
git checkout clean_up
```

Branches are what naturally happens when you want to work on multiple features at the same time. You wouldn't want to end up with a master branch which has Feature A half done and Feature B half done.

#  Removing All The Things

Ok, so you're in the clean_up branch. You can finally remove all those pesky octocats by using the git rm command which will not only remove the actual files from disk, but will also stage the removal of the files for us:

```
git rm '*.txt'
```

This will recursively remove all folders and files from the given directory:

#  Commiting Branch Changes

Now that you've removed all the cats you'll need to commit your changes.

Feel free to run git status to check the changes you're about to commit.

```
git commit -m 'Remove all cats'
```

#  Switching Back to master

Great, you're almost finished with the cat... er the bug fix, you just need to switch back to the master branch so you can copy (or merge) your changes from the clean_up branch back into the master branch.

Go ahead and checkout the master branch:

```
git checkout master
```

#  Preparing to Merge

Alrighty, the moment has come when you have to merge your changes from the clean_up branch into the master branch. Take a deep breath, it's not that scary.

We're already on the master branch, so we just need to tell Git to merge the clean_up branch into it:

```
git merge clean_up
```

Merge Conflicts can occur when changes are made to a file at the same time. A lot of people get really scared when a conflict happens, but fear not! They aren't that scary, you just need to decide which code to keep [how conflicts are presented](http://git-scm.com/docs/git-merge#_how_conflicts_are_presented).

#  Keeping Things Clean

Congratulations! You just accomplished your first successful bugfix and merge. All that's left to do is clean up after yourself. Since you're done with the clean_up branch you don't need it anymore.

You can use `git branch -d branch name` to delete a branch. Go ahead and delete the clean_up branch now:

```
git branch -d clean_up
```

What if you have been working on a feature branch and you decide you really don't want this feature anymore? You might decide to delete the branch since you're scrapping the idea. You'll notice that `git branch -d bad_feature` doesn't work. This is because -d won't let you delete something that hasn't been merged.
You can either add the `--force (-f)`

#  The Final Push

Here we are, at the last step. I'm proud that you've made it this far, and it's been great learning Git with you. All that's left for you to do now is to push everything you've been working on to your remote repository, and you're done!


Save My Day:
*	[Try Git](https://www.codeschool.com)