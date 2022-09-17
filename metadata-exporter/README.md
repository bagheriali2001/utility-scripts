# Metadata Exporter

This script is made to export metadata of a folder and all it's sub-folders.

When running this script you should have a `--folder-path` variable, which would be the path of the folder you want to export metadata. The default output file is the name of the folder, in cases like `D:\` in windows, it would be `result`. In case you want to name it your self, you can add `--output-file` variable. For the output, if you want it in json format, you can add `--json` or `-j`, and if you want it in text form (only the names and size is shown), you can add `--text` or `-t`.

In default case, this script print errors like permission denied and a progress log every 1000 file or folder check, but if you want to ignore them, you can add `--no-log` variable. In cases that you don't need files metadata you can add `--no-files` variable, and if you don't want to go more that few sub-folder, you can add `--depth` variable.
Note that the last two variables, are only for showing metadata in output files. The script will still check all files and folders (for size).

Example:

```node script.js --no-log --output-file="exported_meta_data" -jt --depth=1 --no-files --folder-path="<path to folder>"```

In this example there will be 2 output file named `exported_meta_data.json` and `exported_meta_data.txt`. The script will ignore errors and will not print any log. It will only output the first sub-folder of the given folder. It will not output files metadata.