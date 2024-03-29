import * as fs from 'fs';
import { readFile, writeFile } from "fs/promises";

export default class Fluff {

    private readonly _path: string
    private readonly _name: string

    /**
     * Creates an instance of Fluff.
     * @param {string} name
     * @param {string} [path]
     * @memberof Fluff
     */
    constructor(name: string, path?: string, ) {
        this._name = name
        this._path = path ? `.${path}/${this._name}.json` : `${this._name}.json` // If path is undefinded, the default path will be where the code is running.

        if (!fs.existsSync(this._path)) { // Prevents overwriting an existing file!
            fs.appendFile(this._path,"{\n\n}", (error) => {
                if(error) throw error
                })
        }
    }

    /**
     * Reads and returns the content of the whole database
     * @memberof Fluff
     */
    async read() {
        try {
            return JSON.parse(await readFile(this._path, "utf-8"))
        } catch {
            return {}
        }
    }

    /**
     * Writes the {data} data to the file.
     *
     * @template T
     * @param {T} data
     * @return {*}  {Promise<void>}
     * @memberof Fluff
     */
    private async _write<T>(data: T): Promise<void> {
        await writeFile(this._path, JSON.stringify(data))
    }

    /**
     * Checks if key exists in the database
     * @param {string} key
     * @return {Promise<boolean>} 
     * @memberof Fluff
     */
    async exists(key: string): Promise<boolean> { 
        return (await this.read()).hasOwnProperty(key)
    }

    /**
     * Will set the item {key} to the value {value} in the database
     * @template T
     * @param {string} key
     * @param {T} value
     * @return {Promise<void>}  {Promise<void>}
     * @memberof Fluff
     */
    async set<T>(key: string, value: T): Promise<void> {
        let fileContent: Record<string, T> = await this.read()

        if (await this.exists(key)) {
            fileContent[key] = value
        } else {
            fileContent = {...fileContent, [key]: value}
        }

        await this._write(fileContent)
    }

    /**
     * Get the value of the {key} key from the database.
     * @template T
     * @param {string} key
     * @return {*}  {Promise<T>}
     * @memberof Fluff
     */
    async get<T>(key: string): Promise<T> {
        return (await this.read())[key]
    }

    /**
     * Deletes the key {key} from the database.
     * @template T
     * @param {string} key
     * @return {*}  {Promise<void>}
     * @memberof Fluff
     */
    async delete<T>(key: string): Promise<void> {
        let fileContent: Record<string, T> = await this.read()
        delete fileContent[key]
        await this._write(fileContent)
    }

    /**
     * Will delete the database file
     * @return {*}  {Promise<boolean>}
     * @memberof Fluff
     */
    async deleteFile(): Promise<boolean> {
        try {
            fs.unlinkSync(this._path)
            return true
        } catch (err) {
            console.error(err);
            return false
        }
    }

    /**
     * Concats to the value of the item {key} the given array
     * @template T
     * @param {string} key
     * @param {Array<T>} list
     * @return {*}  {Promise<void>}
     * @memberof Fluff
     */
    async concat<T>(key: string, list: Array<T>): Promise<void> {
        const value = await this.get(key)
        if (!Array.isArray(value)) throw Error(`The database value at index ${key} is not an array.`) 

        const updatedValue = value.concat(list)
        await this.set(key, updatedValue)
    }

    /**
     * Adds the value of the key with the given number
     * @param {string} key
     * @param {number} adder
     * @return {*}  {Promise<void>}
     * @memberof Fluff
     */
    async add(key: string, adder: number): Promise<void> {
        const value = await this.get(key)
        if (typeof value !== 'number') throw Error(`The database value at index ${key} is not a number.`)
        await this.set(key, value + adder)
    }

    /**
     * Substracts the value of the key with the given number
     * @param {string} key
     * @param {number} substract
     * @return {*}  {Promise<void>}
     * @memberof Fluff
     */
    async sub(key: string, substract: number): Promise<void> {
            const value = await this.get(key)
            if (typeof value !== 'number') throw Error(`The database value at index ${key} is not a number.`)
            await this.set(key, value - substract)
    }

    /**
     *
     * @param {string} key
     * @param {(string | Array<unknown>)} item
     * @memberof Fluff
     */
    async pull(key: string, item: unknown) {
        let indexValue = await this.get(key)
        if (!Array.isArray(indexValue)) throw Error(`The database value at index ${key} is not an array.`)
        
        if (!Array.isArray(item)) {
            await this.set(key, indexValue.filter(e => e !== item))
        }  else {
            item.forEach((element) => {
                if (Array.isArray(indexValue)) {
                    indexValue = indexValue.filter(e => e !== element)
                }
            })
            await this.set(key, indexValue)
        }
    }

    // async push(key: string, value: string | Array<unknown>) {
    // } 
}   