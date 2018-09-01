## === npm audit security report ===

## Run  npm install --save-dev mochawesome@3.0.3  to resolve 4 vulnerabilities

SEMVER WARNING: Recommended action is a potentially breaking change

  Low             Prototype Pollution
  Package         lodash
  Dependency of   mochawesome [dev]
  Path            mochawesome > lodash
  More info       https://nodesecurity.io/advisories/577

  High            Cross-Site Scripting
  Package         handlebars
  Dependency of   mochawesome [dev]
  Path            mochawesome > handlebars
  More info       https://nodesecurity.io/advisories/61

  Low             Incorrect Handling of Non-Boolean Comparisons During
                  Minification
  Package         uglify-js
  Dependency of   mochawesome [dev]
  Path            mochawesome > handlebars > uglify-js
  More info       https://nodesecurity.io/advisories/39

  Low             Regular Expression Denial of Service
  Package         uglify-js
  Dependency of   mochawesome [dev]
  Path            mochawesome > handlebars > uglify-js
  More info       https://nodesecurity.io/advisories/48

## Run  npm install --save-dev stylus@0.54.5  to resolve 1 vulnerability

  High            Regular Expression Denial of Service
  Package         minimatch
  Dependency of   stylus [dev]
  Path            stylus > glob > minimatch
  More info       https://nodesecurity.io/advisories/118

## Run  npm update request --depth 5  to resolve 12 vulnerabilities

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > hipchat-notifier > request > hawk > boom >
                  hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > hipchat-notifier > request > hawk >
                  cryptiles > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > hipchat-notifier > request > hawk > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > hipchat-notifier > request > hawk > sntp >
                  hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > slack-node > requestretry > request > hawk
                  > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > slack-node > requestretry > request > hawk
                  > cryptiles > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > slack-node > requestretry > request > hawk
                  > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   karma [dev]
  Path            karma > log4js > slack-node > requestretry > request > hawk
                  > sntp > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   less [dev]
  Path            less > request > hawk > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   less [dev]
  Path            less > request > hawk > cryptiles > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   less [dev]
  Path            less > request > hawk > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Dependency of   less [dev]
  Path            less > request > hawk > sntp > hoek
  More info       https://nodesecurity.io/advisories/566


                                 Manual Review
             Some vulnerabilities require your attention to resolve

          Visit https://go.npm.me/audit-guide for additional guidance

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > request > hawk > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > request > hawk > cryptiles > boom
                  > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > request > hawk > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > request > hawk > sntp > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   node-sass [dev]
  Path            node-sass > node-gyp > request > hawk > boom > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   node-sass [dev]
  Path            node-sass > node-gyp > request > hawk > cryptiles > boom >
                  hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   node-sass [dev]
  Path            node-sass > node-gyp > request > hawk > hoek
  More info       https://nodesecurity.io/advisories/566

  Moderate        Prototype pollution
  Package         hoek
  Patched in      > 4.2.0 < 5.0.0 || >= 5.0.3
  Dependency of   node-sass [dev]
  Path            node-sass > node-gyp > request > hawk > sntp > hoek
  More info       https://nodesecurity.io/advisories/566

  Critical        Command Injection
  Package         open
  Patched in      No patch available
  Dependency of   source-map-explorer [dev]
  Path            source-map-explorer > open
  More info       https://nodesecurity.io/advisories/663

  Low             Prototype Pollution
  Package         lodash
  Patched in      >=4.17.5
  Dependency of   lite-server [dev]
  Path            lite-server > browser-sync > easy-extender > lodash
  More info       https://nodesecurity.io/advisories/577

  Low             Regular Expression Denial of Service
  Package         debug
  Patched in      >= 2.6.9 < 3.0.0 || >= 3.1.0
  Dependency of   lite-server [dev]
  Path            lite-server > browser-sync > localtunnel > debug
  More info       https://nodesecurity.io/advisories/534

  Moderate        Memory Exposure
  Package         tunnel-agent
  Patched in      >=0.6.0
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > request > tunnel-agent
  More info       https://nodesecurity.io/advisories/598

  Low             Regular Expression Denial of Service
  Package         timespan
  Patched in      No patch available
  Dependency of   karma [dev]
  Path            karma > log4js > loggly > timespan
  More info       https://nodesecurity.io/advisories/533

found 30 vulnerabilities (6 low, 21 moderate, 2 high, 1 critical) in 16877 scanned packages
  run `npm audit fix` to fix 13 of them.
  4 vulnerabilities require semver-major dependency updates.
  13 vulnerabilities require manual review. See the full report for details.
