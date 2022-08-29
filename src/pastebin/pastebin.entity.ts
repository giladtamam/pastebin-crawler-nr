function parseData(str: string) {
    str = str.trim();
    const anonymousNames = ['Guest', 'Unknown', 'Anonymous'];
    const isAnonymous = anonymousNames.some(name => str === name);
    return isAnonymous ? '' : str;
}

export class Paste {
    id: string;
    title: string;
    content: string;
    author: string;
    date: Date;

    constructor(id: string, title: string, content: string, author: string, date: string) {
        this.title = parseData(title);
        this.content = content.trim();
        this.author = parseData(author);
        this.date = new Date(date.replace('th', ''));
        this.id = id;
    }
}