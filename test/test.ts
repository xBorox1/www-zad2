import { expect } from 'chai';
import { driver } from 'mocha-webdriver';
import { app } from '../src/app';
import {clearDB, createDB} from "../src/db";
let server = null;
const port = 2137;

function delay() {
    return new Promise(resolve => setTimeout(resolve, 400));
}

async function login() {
    await driver.get('http://localhost:' + port + '/login');
    await delay();
    await driver.find('input[name="username"]').sendKeys('user1');
    await driver.find('input[name="password"]').sendKeys('user1');
    await delay();
    await driver.find('input[type="submit"]').click();
}

describe('Testy', async function() {
    this.timeout(50000);

    beforeEach(done => {
        createDB();
        server = app.listen(port,'localhost',done);
    });

    afterEach(done => {
        if (server !== null) {
            server.close(done);
            server = null;
        }
        clearDB();
    });

    it('Test punktu 2', async function () {
        await login();
        const cookie = await driver.manage().getCookie('connect.sid');
        await driver.manage().deleteCookie('connect.sid');

        await delay();
        await login();
        await driver.get('http://localhost:' + port + '/change');
        await delay();
        await driver.find('input[name="password"]').sendKeys('user1');
        await driver.find('input[type="submit"]').click();
        await delay();

        await driver.manage().deleteCookie('connect.sid');
        await driver.manage().addCookie({name: cookie.name, value: cookie.value});
        await driver.manage().deleteCookie('connect.sid');
        await delay();
        await driver.get('http://localhost:' + port + '/quiz/1');
        expect(await driver.getCurrentUrl()).to.equal('http://localhost:' + port + '/login');

        await driver.manage().deleteCookie('connect.sid');
    });

    it('Test punktu 3', async function () {
        await login();
        await delay();

        await driver.get('http://localhost:' + port + '/quiz/0');
        await delay();

        expect((await driver.find('#intro').getAttribute("textContent"))).to.equal('Liczyć każdy może.');

        await driver.find('button[id="start"]').click();
        await delay();

        expect((await driver.find('#question').getAttribute("textContent"))).to.equal('2 + 2 = ?');
    });

    it('Test punktu 6', async function () {
        await login();
        await delay();

        await driver.get('http://localhost:' + port + '/quiz/1');
        await delay();
        await driver.find('button[id="start"]').click();
        await delay();
        await driver.find('input[id="answer"]').sendKeys('1');
        await delay();
        await driver.find('button[id="next"]').click();
        await delay();
        await driver.find('input[id="answer"]').sendKeys('1');
        await delay();
        await driver.find('button[id="stop"]').click();
        await delay();

        await driver.get('http://localhost:' + port + '/quiz/1');
        expect(await driver.getCurrentUrl()).to.equal('http://localhost:' + port + '/');

    });

});
