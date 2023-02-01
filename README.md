# ⌚ Harvest Time Tracking CLI

This is a [zx](https://github.com/google/zx)-based cli tool to manage the personal [Harvest](https://harvestapp.com) timer using its [API v2](https://help.getharvest.com/api-v2/).

Start this script with
```
npx zx index.js
```

**Note**: Exit the script with `ctrl+c` 

**Note**: You can install `zx` globally with `npm i -g zx` and start the script with `zx index.js`

**Tip**: Create an alias within your bash; e.g., `harvest=npx zx <path-to-script>/index.js`

## 🎨 Features

- ✅ shows today's entries (with breaks, conflicts, and missing notes)
- ✅ restart timer (choose an entry from today or 5 previous workdays)
- ✅ stop running timer
- 💡 _TODO_ start timer
- 💡 _TODO_ filter current projects via config
- 💡 _TODO_ start timer with custom rules via config
- 💡 _TODO_ edit entries (start-time, end-time, task, notes)
- 💡 _TODO_ restart timer with edit (start-time, task, notes)
- 💡 _TODO_ stop timer with edit (end-time)
- 💡 _TODO_ fix overlaps
- 💡 _TODO_ fix gaps (unwanted breaks)
- 💡 _TODO_ delete entries

## 💻 Prerequisite

* **Node** version >= 16.0.0
* `npm install` in this project
* Harvest **[developer API token](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/)** which is set as `HARVEST_ACCOUNT_ID` and `HARVEST_API_TOKEN` environment variables 
* This script is configured to the [Git-bash](https://gitforwindows.org/) (cf. `index.js`) to work on Windows without [WSL](https://learn.microsoft.com/en-us/windows/wsl/). To this end, it expects a `PATH_GIT` pointing to the Git root director.

## 💾 Cached Requests

Some _GET_-requests to Harvest, e.g., [user profile](https://help.getharvest.com/api-v2/users-api/users/users/#retrieve-the-currently-authenticated-user) and [assigned projects](https://help.getharvest.com/api-v2/users-api/users/project-assignments/#list-active-project-assignments), are cached in `.cache`. Thus, if you are missing some recent projects, it's time to delete that cache.

## 📚 Used Libraries

* [zx](https://github.com/google/zx) (Apache-2.0 license)
* [dayjs](https://github.com/iamkun/dayjs/) (MIT license)
* [got](https://github.com/sindresorhus/got) (MIT license)
* [inquirer](https://github.com/SBoudrias/Inquirer.js) (MIT license)
* [inquirer-search-list](https://github.com/robin-rpr/inquirer-search-list) (MIT license)