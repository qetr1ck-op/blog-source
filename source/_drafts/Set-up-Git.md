title: Set up Git
id: 212
categories:
  - Uncategorized
tags:
---

Download and install the latest version of Git.
set using window cmd.exe annd init PATH varrible

[shell]
git config --global user.name "Your Name Here"
#Sets the default name for Git to use when you commit
[/shell]

[shell]
git config --global user.email "your_email@example.com"
# Sets the default email for git to use when you commit
[/shell]

Step 1: Create the smt aka README file

[shell]
mkdir ~/Hello-World
# Creates a directory for your project called "Hello-World" in your user directory
[/shell]

[shell]
cd ~/Hello-World
# Changes the current working directory to your newly created directory
[/shell]

[shell]
git init
# Sets up the necessary Git files
# Initialized empty Git repository in /Users/you/Hello-World/.git/
[/shell]

[shell]
touch README
# Creates a file called "README" in your Hello-World directory
[/shell]

Step 2: Commit your README

[shell]
git add README
# Stages your README file, adding it to the list of files to be committed
[/shell]

[shell]
git commit -m 'first commit'
# Commits your files, adding the message "first commit"
[/shell]

Step 3: Create A Repo on GitHub

Every time you make a commit with Git, it is stored in a repository (a.k.a. "repo"). To put your project up on GitHub, you'll need to have a GitHub repository for it to live in.

#TODO 
need add image here

Step 4: Push your commit

[cmd]
git remote add origin https://github.com/username/Hello-World.git
# Creates a remote named "origin" pointing at your GitHub repository
[/cmd]

[shell]
git push origin master
# Sends your commits in the "master" branch to GitHub
[/shell]