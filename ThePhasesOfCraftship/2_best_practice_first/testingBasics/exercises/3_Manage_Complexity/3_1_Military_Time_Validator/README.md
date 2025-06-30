# Military Time Validator (#militaryTimeValidator)

> Write a class (or a function) capable of validating whether a string time range is a valid military time range or not.

> Here are some string examples.

- "01:12 - 14:32" (yes)
- "25:00 - 12:23" (no)
- "22:00 - 23:12" (yes)

## Getting started

To set up the project, run the following command:

```bash
npm run install
```

## To run the tests in development mode

To run the tests and have them reload when you save, run the following command:

```bash
npm run test:dev
```

doings
- parse start and end time from  string input
- parse time

knowings
- start time hr must be lower than end time hr
- start time has a max hr of 23 and max min of 59
- "01:12 - 14:32" is a valid time
- "25:00 - 12:23" is an invalid time
- "22:00 - 23:12" is a valid time
