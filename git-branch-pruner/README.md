# Git Branch Pruner

First argument is number of repo folders you want to prune. The second argument is either `windows` or `linux` to create this script for your os. The third argument is your project main branch. Local branches that are merged to this one would be pruned. The forth argument is name of branches you don't want to delete, separated with comma, like `master,develop`. (Don't forget to add master or main to this list.) Then you should have a path for each repos. (Number of them was added in first argument.)

Example:

```node script.js 2 "windows" "master" "master,develop" "<path to first repo>" "<path to second repo>"```

In this example the result file will prune both folders. First it removes all extra remote branches then it removes all local branches that are merged to master. It will not delete master or develop branches.

The result would be a `.ps1` or `.sh` file.