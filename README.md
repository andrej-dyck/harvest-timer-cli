# ⌚ Harvest Time Tracking CLI

This is a [zx](https://github.com/google/zx)-based cli tool to manage the
personal [Harvest](https://harvestapp.com) timer using
its [API v2](https://help.getharvest.com/api-v2/).

**Start** this script with
```
npx zx index.js
```

**Exit** the script with `ctrl+c`

**Note**: You can install `zx` globally with `npm i -g zx` and start the script with `zx index.js`

**Tip**: Create an alias within your bash; e.g., `harvest=npx zx <path-to-script>/index.js`

## 🎨 Features

- ✅ shows today's entries (with breaks, conflicts, and missing notes)
- ✅ restart timer (choose an entry from today or 5 previous workdays)
- ✅ stop running timer
- ✅ start timer (for a project task with notes)
- 💡 _TODO_ filter current projects via config
- 💡 _TODO_ start timer with custom rules via config
- 💡 _TODO_ edit entries (start-time, end-time, task, notes)
- 💡 _TODO_ restart timer with edit (start-time, task, notes)
- 💡 _TODO_ stop timer with edit (end-time)
- 💡 _TODO_ fix overlaps
- 💡 _TODO_ fix gaps (unwanted breaks)
- 💡 _TODO_ delete entries

## 💻 Prerequisite

- **Node** version >= 16.0.0
- Install project dependencies with `npm install`
- Create a Harvest [**developer API token**](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/) 
  - Set the environment variables `HARVEST_ACCOUNT_ID` and `HARVEST_API_TOKEN`;
    e.g., in the `.env` file

## 🐛 Known Issues

- After starting the timer, when the main loop ask for the action, no keyboard input doesn't work; none but `Enter`
- Order of entries is wrong, when two entries have the same start-time (hh:mm) (e.g., quick restart of an entry)

## 📚 Used Libraries

* [zx](https://github.com/google/zx) (Apache-2.0 license)
* [dayjs](https://github.com/iamkun/dayjs/) (MIT license)
* [got](https://github.com/sindresorhus/got) (MIT license)
* [inquirer](https://github.com/SBoudrias/Inquirer.js) (MIT license)
* [inquirer-search-list](https://github.com/robin-rpr/inquirer-search-list) (MIT license)