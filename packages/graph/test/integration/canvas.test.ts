import { skeletonDraw } from '../../src';
import { SkeletonType } from '../../src/杂项/骨骼图/settings';
describe('canvas画图', () => {
  before((done) => {
    done();
  });
  it('canvas缩放测试', async () => {
    const htmlRoot = document.createElement('canvas');
    htmlRoot.style.width = '960px';
    htmlRoot.style.height = '540px';
    htmlRoot.style.border = '1px solid red';
    htmlRoot.width = 1920;
    htmlRoot.height = 1080;
    document.body.append(htmlRoot);
    const data: [any, any, any] = [
      [
        [
          [358, 272],
          [381, 268],
          [404, 331],
          [432, 390],
          [436, 425],
          [439, 397],
          [347, 271],
          [355, 337],
          [364, 395],
          [338, 422],
          [376, 407],
          [354, 238],
          [351, 195],
          [354, 157],
          [351, 124],
          [352, 97],
          [367, 164],
          [388, 168],
          [414, 202],
          [445, 205],
          [461, 206],
          [340, 164],
          [325, 169],
          [300, 198],
          [261, 186],
          [236, 175],
          [359, 118],
          [344, 118],
        ],
      ],
      [{ trajectory_left: [], trajectory_right: [] }],
      [],
    ];
    skeletonDraw({ centered: true, type: SkeletonType.cognize, canvasWidth: 1920, canvasHeight: 1080 })(htmlRoot.getContext('2d'), data, 'waist');
  });
});
