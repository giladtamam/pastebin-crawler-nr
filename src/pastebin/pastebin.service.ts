import axios, { AxiosResponse } from "axios";
import * as mongoDB from "mongodb";
import * as cheerio from 'cheerio';
import { Paste } from "./pastebin.entity";

const PASTEBIN_SELECTOR = '.maintable tr';
const PASTEBIN_LINK_SELECTOR = 'td a';

export class PastebinService {
    collection: mongoDB.Collection;
    constructor(collection: mongoDB.Collection) {
        this.collection = collection;
    }

    fetchPastes(): Promise<any> {
        return axios.get<any>('https://pastebin.com/archive');
    }

    fetchFullPaste(id: string | undefined) {
        return new Promise(resolve => {
            setTimeout(resolve, 5000);
        }).then(() => {
            console.log('Fetching paste with id:', id);
            if (!id) return;
            return axios.get<AxiosResponse>(`https://pastebin.com${id}`);
        })
        
    }

    fetchFullPastesPromises(data: string): any {
        const $ = cheerio.load(data);
        const promises: Promise<AxiosResponse>[] = [];
        const that = this;
        return $(PASTEBIN_SELECTOR).map(async function() {
            const link: string | undefined = $(this).find(PASTEBIN_LINK_SELECTOR).first().attr('href');
            return await that.fetchFullPaste(link);
        });
    }

    async isPasteExists(id: string): Promise<any> {
        const count = await this.collection.count({ id }, { limit: 1 });
        return count > 0;
    }

    async runCrawler () {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.fetchPastes();
                const promises = this.fetchFullPastesPromises(data);
                const pages = await Promise.all(promises);
                pages.forEach(async (page, index) => {
                    const idIndex = page.request.path.lastIndexOf('/');
                    const id = page.request.path.substring(idIndex + 1);
                    const isExist = await this.isPasteExists(id)
                    if (!isExist) {
                        const $page = cheerio.load(page.data);
                        const paste = new Paste(
                            id,
                            $page('.info-top').text(),
                            $page('.source').text(),
                            $page('.username').text(),
                            $page('.date').text()
                        );
                        await this.collection.insertOne(paste)
                        console.log('Inserted entity with id:', id);
                    } else {
                        console.log('Found entity in db with id:', id);
                    }

                    if (index === promises.length) {
                        resolve('Done');
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}