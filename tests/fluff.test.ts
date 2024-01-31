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

test("Gets key in database correctly", async () => {
    const database = new Fluff("test6_database")
    await database.set("foo", "bar")
    expect(await database.exists("foo")).toBe(true)     
    await database.deleteFile()
})
