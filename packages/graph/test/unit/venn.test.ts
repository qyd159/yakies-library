import * as chai from 'chai';
import { ellipseEllipseIntersection, ellipseOverlap, distance } from '../../src/utils/ellipseintersection';

chai.should();
const expect = chai.expect;
describe('韦恩图布局', () => {
    before((done) => {
        console.log('------begin--------');
        done();
    });
    after(() => {
        console.log('------end--------');
    });
    it('两个椭圆相交并计算相交部分的面积', (done) => {
        const ellipse1 = {
            x: 100,
            y: 100,
            radius: 50,
        };
        const ellipse2 = {
            x: 150,
            y: 120,
            radius: 50,
        };
        expect(ellipseEllipseIntersection(ellipse1, ellipse2).length).equal(2);
        const distance1 = distance(ellipse1, ellipse2);
        const alpha = ellipse1.x < ellipse2.x ? Math.acos((ellipse2.x - ellipse1.x) / distance1) : Math.PI * 2 - Math.acos((ellipse2.x - ellipse1.x) / distance1);
        expect(ellipseOverlap(ellipse1.radius, ellipse2.radius, distance1, alpha)).to.be.a('number');
        done();
    });
    it('两个椭圆不相交', (done) => {
        const ellipse1 = {
            x: 100,
            y: 100,
            radius: 50,
        };
        const ellipse2 = {
            x: 200,
            y: 100,
            radius: 40,
        };
        expect(ellipseEllipseIntersection(ellipse1, ellipse2).length).equal(0);
        done();
    });
    it('两个椭圆有包含关系', (done) => {
        const ellipse1 = {
            x: 100,
            y: 100,
            radius: 50,
        };
        const ellipse2 = {
            x: 100,
            y: 100,
            radius: 40,
        };
        expect(ellipseEllipseIntersection(ellipse1, ellipse2).length).equal(0);
        done();
    });
    it('给定集合自动生成布局', (done) => {
        // TODO:
        done();
    });
});
