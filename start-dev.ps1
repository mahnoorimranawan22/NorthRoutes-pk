$log = "C:\Users\noora\Downloads\north-routes-pk\.freebuff\preview-50590972-2195-440c-9961-0149aa43553e.log"
$logErr = "C:\Users\noora\Downloads\north-routes-pk\.freebuff\preview-50590972-2195-440c-9961-0149aa43553e.log.err"
$viteCmd = "C:\Users\noora\Downloads\north-routes-pk\free-react-tailwind-admin-dashboard-main\node_modules\.bin\vite.cmd"
$workDir = "C:\Users\noora\Downloads\north-routes-pk\free-react-tailwind-admin-dashboard-main"

$proc = Start-Process -FilePath $viteCmd -ArgumentList 'dev','--host','127.0.0.1','--port','5173' -WorkingDirectory $workDir -RedirectStandardOutput $log -RedirectStandardError $logErr -WindowStyle Hidden -PassThru
Write-Output $proc.Id
