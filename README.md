# ⌚ Harvest Time Tracking CLI

This is a [zx](https://github.com/google/zx)-based cli tool to manage the
personal [Harvest](https://harvestapp.com) timer using
its [API v2](https://help.getharvest.com/api-v2/).

**Start** this script with (cf. prerequisites):

```
npx zx index.js
```

**Exit** the script with `ctrl+c`.

**Tip**: Create an alias within your bash; e.g., `harvest=npx zx <path-to-script>/index.js`.

## 🎨 Features

### Days
- ✅ shows today's entries (with _breaks_, _conflicts_, and _missing notes_)
- ✅ show entries of preceding workdays (max. five workdays)

### Timer
- ✅ start timer (on a _project task_ with _notes_ and _start time_)
  - ✅ exclude irrelevant projects from prompts via config
  - ✅ input relative start time; e.g., `-15m` for _15 minutes ago_
- ✅ stop running timer (with _end time_)
- ✅ restart timer by choosing an entry from preceding workdays

### Entries
- ✅ edit an entry (_start time_, _end time_, _notes_, and _task_)
- ✅ delete an entry

### WIP
- 💡 _TODO_ start timer with custom rules via config
- 💡 _TODO_ fix overlaps
- 💡 _TODO_ fix gaps (unwanted breaks)
- 💡 _TODO_ create new entry with endet time
- 💡 _TODO_ configure workdays
- 💡 _TODO_ bundle to binary (e.g., with [pgk](https://github.com/vercel/pkg)?)

## 💻 Prerequisites

- **Node** version >= 16.0.0
- Install project dependencies with `npm install`
- Create a Harvest [**developer API token
  **](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/)
    - Set the environment variables `HARVEST_ACCOUNT_ID` and `HARVEST_API_TOKEN`;
      e.g., in the `.env` file

## ⚙ Config

The configuration for the script is saved in .json-files under the `.config` directory. 
If a configuration file is missing, a default one will be created. The files are read only once on startup.

## 🐛 Known Issues

- Stop action isn't shown when a timer is running but its start time is before the start time of the latest entry. 
- Unknown unknowns 🤷‍♂️

## 📚 Used Libraries

* [dayjs](https://github.com/iamkun/dayjs/) (MIT license)
* [fuzzy](https://github.com/mattyork/fuzzy) (MIT license)
* [got](https://github.com/sindresorhus/got) (MIT license)
* [inquirer](https://github.com/SBoudrias/Inquirer.js) (MIT license)
* [inquirer-autocomplete-prompt](https://github.com/mokkabonna/inquirer-autocomplete-prompt) (ISC
  license)
* [zx](https://github.com/google/zx) (Apache-2.0 license)
