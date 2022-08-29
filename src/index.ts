import * as mongoDB from "mongodb";
import { PastebinService } from "./pastebin/pastebin.service";

let pastebinService: PastebinService;

async function initDb() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://localhost:27017");
    await client.connect();
    const db: mongoDB.Db = client.db('pastebin');
    const pastesCollection: mongoDB.Collection = db.collection('pastes');
    pastebinService = new PastebinService(pastesCollection);
    return;
}

function run () {
    setInterval(() => {
        pastebinService.runCrawler();
    }, 1200);
}

initDb().then(() => {
    run();
});



