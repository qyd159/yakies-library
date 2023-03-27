import * as chai from 'chai';
import { JSDOM } from 'jsdom';
import { 图形集 } from '../../src';
const { 树状图, 韦恩图, 数位顺序表 } = 图形集;
chai.should();
const expect = chai.expect;
describe('schema2json', () => {
    before((done) => {
        console.log('------begin--------');
        done();
    });
    after(() => {
        console.log('------end--------');
    });
    it('树状图-获取jsonform的schema', (done) => {
        const jsonformSchema = 树状图.jsonSchemaDefs(true);
        expect(jsonformSchema[0].树.type).to.equal('object');
        jsonformSchema[0].树延展方向.should.have.property('enum');
        done();
    });
    it('韦恩图-获取jsonform的schema', (done) => {
        const jsonformSchema = 韦恩图.jsonSchemaDefs(true);
        expect(jsonformSchema[0].相交集.properties.原始集合.type).to.equal('array');
        done();
    });
    it('数位顺序表-获取jsonform的schema', (done) => {
        const jsonformSchema = 数位顺序表.jsonSchemaDefs(true);
        console.log(JSON.stringify(jsonformSchema, null, 4));
        done();
    });
});
