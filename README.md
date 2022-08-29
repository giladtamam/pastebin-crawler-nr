# Pastebin Crawler

Pastebin web crawler 

## Description

A simple web crawler that crawel public pastes from pastbin.com website and store the "pastes" in mongodb. The crawler run every 2 minutes and look for only a new posts to insert db.

### Installing
install community edition of [mongodb](https://www.mongodb.com/docs/manual/administration/install-community/) on your machine 

run mongodb, you can download mongo client, you can use mongo [Compass](https://www.mongodb.com/products/compass) for free.

### Dependencies
axios
cheerio
mongodb

install dependencies
```
$ npm install
```
run the crawler
```
$ npm run start:dev
```