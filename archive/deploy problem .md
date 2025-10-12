Run pnpm/action-setup@v2
Running self-installer...
  Progress: resolved 1, reused 0, downloaded 0, added 0
  Packages: +1
  +
  Packages are hard linked from the content-addressable store to the virtual store.
    Content-addressable store is at: /home/runner/.local/share/pnpm/store/v3
    Virtual store is at:             node_modules/.pnpm
  dependencies:
  + pnpm 10.11.0 (10.18.2 is available)
  Done in 1.4s
  Progress: resolved 1, reused 0, downloaded 1, added 1, done
Installation Completed!
1s
Run pnpm install --frozen-lockfile
  
 WARN  Ignoring not compatible lockfile at /home/runner/work/avanta-sink/avanta-sink/pnpm-lock.yaml
 ERR_PNPM_NO_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
Error: Process completed with exit code 1.
0s
0s
0s
0s
Post job cleanup.
Pruning is unnecessary.
0s
0s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/5cba7ded-d6fb-4919-9191-1922769e7c1e' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/avanta-sink/avanta-sink
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
