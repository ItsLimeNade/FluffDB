import * as fs from 'fs';
import { readFile, writeFile } from "fs/promises";

//? Fluff is the main class used to manage the database.
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
        return JSON.parse(await readFile(this._path, "utf-8"))
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
}