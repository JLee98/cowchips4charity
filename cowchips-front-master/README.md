# cowchips-front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run both unit and e2e tests headless
```
npm run test
```

## DB testing data

### For the organization select page (/org-select)
1. Insert into `games` collection:
```
{
    "_id" : ObjectId("5c560df516934435e09eb389"),
    "organizations" : [ 
        ObjectId("5c560df516934435e09eb386"), 
        ObjectId("5c560df516934435e09eb387")
    ],
    "name" : "Nina Blake",
    "startTime" : ISODate("2019-01-01T21:39:01.617Z"),
    "endTime" : ISODate("2020-02-02T21:39:01.617Z"),
    "__v" : 0
}
```
2. Insert into `organizations` collection
```
{
    "_id" : ObjectId("5c560df516934435e09eb386"),
    "name" : "Cameron Young",
    "photo" : "http://pa.pf/borvagcod",
    "__v" : 0
}
{
    "_id" : ObjectId("5c560df516934435e09eb387"),
    "name" : "Frank Davis",
    "photo" : "http://lofam.hn/rieliwa",
    "__v" : 0
}
```

