import * as chai from 'chai';
import { numberToChNumber } from '../../src/utils';
chai.should();
const expect = chai.expect;
describe('数字中文读法', () => {
    it('测试数字中文读法', (done) => {
        expect(numberToChNumber(1234)).to.equal('一千二百三十四');
        done();
    });
});
