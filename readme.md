# Schedule Planner

## Solution

It seemed like to be a Constraint satisfaction problem or interval scheduling, but since this problem has very less constraints so I was able to solve it using a tree data structure and then applying DFS.

So I created a weighted binary tree with root node (50 or 30 as these are the duration of talks) and left child as 30 and right child as 50, with an edge of weight 15 (the duration for break for cleaning).
Then I divided each day in two halves before lunch and after lunch as 1 hour lunch is common for every day and is constant.
After this I took one half time period in minutes and then created a weighted binary tree with that time interval. after that I did DFS to find the optimal paths and in the end I used optimal paths to map to the given input.
I transformed the given input in array of integers like for example [50, 30, 30, 50, 50].
So using this algorithm I can always find all the permutations of durations for any given time period and then I can apply that permutation to the given input to generate a schedule and in the end I returned the schedule in the form of JSON

## How to use :

- npm install (for dependencies)
- npm run test (to run tests)
- npm start (to start the server)

## APIs :

- POST /schedules ( for ex. http://localhost:3000/schedules )

```
Sample Request

{
  "talks": [
    {
      "talkTitle": "awesome coding challenge",
      "duration": 50,
      "speakers": "speaker1"
    },
    {
      "talkTitle": "nodejs talk",
      "duration": 30,
      "speakers": "speaker2"
    },
    {
      "talkTitle": "reactjs talk",
      "duration": 50,
      "speakers": "speaker3"
    },
    {
      "talkTitle": "why Yunar rocks",
      "duration": 30,
      "speakers": "speaker4"
    },
    {
      "talkTitle": "something",
      "duration": 50,
      "speakers": "speaker5"
    },
    {
      "talkTitle": "new tech companies",
      "duration": 50,
      "speakers": "speaker6"
    },
    {
      "talkTitle": "Time management",
      "duration": 30,
      "speakers": "speaker7"
    }
  ]
}
```

```
Response -

{
    "schedule": [
        [
            {
                "startTime": 540,
                "endTime": 590,
                "title": "reactjs talk",
                "by": "speaker3",
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "title": "break for cleaning",
                "startTime": 590,
                "endTime": 605,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "startTime": 605,
                "endTime": 655,
                "title": "awesome coding challenge",
                "by": "speaker1",
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "title": "break for cleaning",
                "startTime": 655,
                "endTime": 670,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "startTime": 670,
                "endTime": 700,
                "title": "why Yunar rocks",
                "by": "speaker4",
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "title": "break for cleaning",
                "startTime": 700,
                "endTime": 715,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "title": "break for Lunch",
                "startTime": 720,
                "endTime": 780,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            },
            {
                "startTime": 990,
                "endTime": 1020,
                "title": "nodejs talk",
                "by": "speaker2",
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            }
        ],
        [
            {
                "title": "break for Lunch",
                "startTime": 720,
                "endTime": 780,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            }
        ],
        [
            {
                "title": "break for Lunch",
                "startTime": 720,
                "endTime": 780,
                "timeUnit": "minutes",
                "timeUnitFactor": 60
            }
        ]
    ]
}

```
