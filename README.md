# FluffDB
 An easy to use JSON database for your simplest projects!

 ## Documentation

### Creating the database : 
To create your database, simply initialize the class.
 ```ts
 import Fluff from 'fluffdb'

 const database = new Fluff("db_name")
```

### Basic usage :
Here are some basic usage of the database : 
```ts
// To set data to the database
await database.set("xp", 500)
await database.set("username", "limenade")

// To get data from the database
const xp = await database.get("xp") // 500
const username = await database.get("username") // limenade

// You can substract and add numbers with those functions
await database.add("xp", 50) // 550
await database.sub("xp", 500) // 50
```
> Note: You can store any type of data in the databse!  
> Strings, numbers, objects, array and much more will work!

### There are functions to manage objects and arrays : 
More functions like these will come soon.
```ts
await database.set("skillPoints", [1,4,6])
await database.concat("skillPoints", [6,7,3]) // "skillPoints": [1,4,6,6,7,3]
await database.pull("skillPoints", 1) // Removes 1 from the array
await database.get("skillPoints") // [4,6,6,7,3]
```

### In depth usage : 
You can use some built-in functions to manage your database the easy way!
```ts
    await deleteFile() // Will delete the database file completely!

    await delete("xp") // Will remove the xp key from the database file

    await exists("xp") // false (we just deleted it)

    await read() // Will return the full content of the database file
```


## More features are one their way : 
- In depth array handling
- Ability to create the database file in a certain directory
- Emiting events on several functions
- JSON file formatting, to read your database smoothly
- And much more... 