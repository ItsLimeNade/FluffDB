import Fluff from '../src/core'

test("Deletes database correctly", async () => {
    const database = new Fluff("test_database")
    expect(await database.deleteFile()).toBe(true)
})

test("Creates database file correctly", async () => {
    const database = new Fluff("test2_database")
    const read = await database.read()
    expect(read).toStrictEqual({})
    await database.deleteFile()
     // The value of a new database will be an empty object.
    //If it reads, it means the database has been succesfully created.
})

test("Sets key in database correctly", async () => {
    const database = new Fluff("test3_database")
    await database.set("foo", "bar")
    const read = await database.read()
    expect(read).toStrictEqual({"foo":"bar"})
    await database.deleteFile()
})

test("Deletes key in database correctly", async () => {
    const database = new Fluff("test4_database")
    await database.set("foo", "bar")
    await database.delete("foo")
    const read = await database.read()
    expect(read).toStrictEqual({})     
    await database.deleteFile()
})

test("Gets key in database correctly", async () => {
    const database = new Fluff("test5_database")
    await database.set("foo", "bar")
    expect(await database.get("foo")).toBe("bar")     
    await database.deleteFile()
})

test("Exists key in database", async () => {
    const database = new Fluff("test6_database")
    await database.set("foo", "bar")
    expect(await database.exists("foo")).toBe(true)     
    await database.deleteFile()
})

test("Concats key in database", async () => {
    const database = new Fluff("test7_database")
    await database.set("foo", [1,2,3])
    await database.concat("foo", [4,5,6])
    expect(await database.get("foo")).toStrictEqual([1,2,3,4,5,6])     
    await database.deleteFile()
})

async function custom() {
    const database = new Fluff("test8_database")
    await database.set("foo", [1,2,3])
    await database.concat("foo", [4,5,6])
    const val = await database.get("foo")

    await database.set("bob", true)
    await database.delete("bob")

    if (await database.exists("foo")) {
        await database.set("exists", val)
    }
} 
