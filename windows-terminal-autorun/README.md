# Windows Terminal Auto-run

First argument is number of extra tabs to open beside the last one. For things like databases of ssh tunnels. The second argument is number of panes in last tab. The third argument is your preferred terminal. If you put `d`, `D`, `default` or `Default` it will run in PowerShell.

Then you should have the two argument for each tab or pane, first is location you want your terminal to be opened in then the command you want to run. You should put aguments for tab first then arguments for panes.

Example:

```node script.js 1 2 "<path to db folder>" "<command to run db>" "<path to back-end repo folder>" "npm run dev" "<path to front-end repo folder>" "npm run dev"```

In this example the result file will first open a tab and runs your db then it will open another tab and in it's first pane runs your back-end server then in the second pane runs your front-end server.

The result would be a `.cmd` file and you can run it by simply double clicking it.