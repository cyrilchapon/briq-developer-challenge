# briq-developer-challenge

A developer challenge on Briq's tech stack

## Setup

### Requirements

- `npm install`
- PostgreSQL running

### Config

Config is env-scoped. Prefix any config with the value in `NODE_ENV` (defaulting to `development`)

- `{NODE_ENV}.database`
- `{NODE_ENV}.username`
- `{NODE_ENV}.password`

NB: Database and credentials should be created before any test / run

## Guidelines

- solve this for Node.js 8 and Postgresql 9
- clone this repo (*do not fork it*)
- solve each question in its own branch on your clone
- create a PR on your own repo for each question
- ping the Briq team when you're done
- keep it simple. DTSTTCPW

Make sure you write a solution that is clean, simple, extensible and robust.

## Question 1

There is a first implementation of the `User.give` method. However, it's not tested.
Write test(s) for this method.

## Question 2

We add a requirement that the balance of a user cannot be negative, and a transaction that would make it go under 0 should fail. Please adapt the code to make it work this way.

## Question 3

Being able to save users in the database is nice, but not very useful without any interface.
Please add a user interface that allows the following:

- List users with their username and their balance
- Add a user
- Edit a user's username and balance
- Remove a user
- Let a user give Briqs to another user

Keep it simple ;-)

## Question 4

We now want to compute aggregated stats on user's behaviours. Run `npm run populate` to populate your database with random data.
Then write the following SQL queries:

- All non-deleted users with their id, username, balance, the date at which they received Briqs for the last time, the date at which they gave Briqs for the last time
- All users (including deleted ones) with their id, username, balance, the number of Briqs they received and the number of Briqs they gave.
- All users (id, username) that gave Briqs in the last 2 days
- All users (id, username) that gave more than 5 Briqs in one transaction, and the highest number of Briqs they gave

You can compare your results to the csv files generated when you run the script. Standard SQL is preferred, but you can use pg-specific syntax if there's a real benefit.

Hope you'll have fun. Don't hesitate to ping me for any question.
