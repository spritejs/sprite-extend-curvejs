import {BaseSprite, Effects, registerNodeType} from 'sprite-core';
import {parseColorString} from 'sprite-utils';
import {findColor} from 'sprite-core/lib/helpers/render';

// create a new kind of sprite
class Curve extends BaseSprite {

  get contentSize() {
    let [width, height] = this.attr('size');
    if(width === '') {
        width = this.layer.canvas.clientWidth;
    }
    if(height === '') {
        height = this.layer.canvas.clientHeight;
    }
    return [width, height];
  }

  render(t, drawingContext) {
    drawingContext.save();
    drawingContext.strokeStyle = findColor(drawingContext, this, 'color');
    var points = this.attr('d');
    drawingContext.beginPath();
    drawingContext.moveTo.call(drawingContext, points[0], points[1]);
    drawingContext.bezierCurveTo.call(drawingContext, points[2], points[3], points[4], points[5], points[6], points[7]);
    drawingContext.stroke();
    drawingContext.restore();
    return drawingContext;
  }
}

Curve.defineAttributes({
  init(attr) {
    attr.setDefault({
        color: parseColorString('white'),
        d: [0, 0, 0, 0, 0, 0, 0, 0]
    });
  },
  color(attr, val) {
    attr.clearCache();
    attr.set('color', parseColorString(val));
  },
  d(attr, val) {
    attr.clearCache();
    attr.set('d', val);
  }
})

Curve.setAttributeEffects({
  d: Effects.arrayEffect,
  color: Effects.colorEffect,
});

registerNodeType('curve', Curve);

export default Curve;
