const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("HTML Structure", () => {
    it("Index file should contain appropriate meta tags", async () => {
        const metaTags = await page.$$('meta');
        expect(metaTags.length).toBeGreaterThan(1);
    });
    it("Index file Should contain a title tag that is not empty", async () => {
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).toMatch(/\S/);
    });
});
describe('Table', () => {
    it("Table exists", async () => {
        const table = await page.$('table');
        expect(table).toBeTruthy();
    });
    it("Table should contain 3 columns with correct column titles", async () => {
        const head = await page.$$('th');
        expect(head.length).toBeGreaterThan(2);
        for (let i = 0; i < head.length; i++) {
            const text = await page.evaluate(head => head.textContent, head[i]);
            expect(text).toMatch(/\S/);
        }
    });
    it("Table contains rows", async () => {
        const rows = await page.$$('tr');
        expect(rows.length).toBeGreaterThan(2);
    });
    it("Table contains table data", async () => {
        const tData = await page.$$('td');
        expect(tData.length).toBeGreaterThan(15);
    });
    it("Table should be styled in zebra look", async () => {
        const trBackgroundColor = await page.$$eval('*', el => el.map(e => getComputedStyle(e).backgroundColor));
        expect(trBackgroundColor.filter((v, i, a) => a.indexOf(v) === i).length).toBeGreaterThan(1); // page should contain at least 2 different background colors
    });
});