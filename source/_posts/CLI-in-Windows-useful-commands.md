---
title: 'CLI in Windows, useful commands'
thumbnailImage: title.jpg
thumbnailImagePosition: right
categories:
  - CLI
date: 2014-06-14 10:22:15
---

The command line lets you communicate directly with your computer and instruct it to perform various tasks. For this you have to use specific commands

<!--more-->

```
#help
c:\>command /?

#Path working directory
c:\>pwd

#Computer name (hostname)
c:\>hostname

#dir
c:\>dir

#List files (size, time, reverse)
c:\>ls -lSr

#change to drive
c:\>f:

#change to folder
f:\>cd folder

#change to root drive
f:\>cd \

#make a directory
c:\>md

#remove a directory
c:\>rd

#remove a file/s
c:\>rm name
c:\>rm -rf dir_name
c:\>rm *

#copy a file/s
c:\>cp file.txt dir_name

#move
c:\>mv file.txt dir_name 

#open explorer window
c:\>start .
```

```
#create file
copy con myfile.txt
touch myfile.txt

#read file
c:\>more file_name

#find files
c:\>find . -name "*.txt"
```

```
#Pipes And Redirection

#The | takes the output from the command on the left, and "pipes" it to the command on the right.
c:\>cat file_name | less

#The > takes the output of the command on the left, then writes it
c:\>cat file_name > file_name2

The >> takes the output of the command on the left, then appends it
c:\>cat file_name >> file_name2
```

```
#Environment variable
c:\>env
c:\>env | grep subl
```

```
#How To Launch Git Bash from DOS Command Line?
#x64
start "" "%SYSTEMDRIVE%\Program Files (x86)\Git\bin\sh.exe" --login
#x86
start "" "%ProgramFiles%\Git\bin\sh.exe" --login

#alias
doskey subl="C:\Program Files\Sublime Text 3\sublime_text.exe" $*
```

Save my day:
*	[The Command Line Crash Course](http://cli.learncodethehardway.org/)