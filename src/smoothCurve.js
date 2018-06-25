import {BaseSprite, Effects, registerNodeType} from 'sprite-core';
import {parseColorString} from 'sprite-utils';
import {findColor} from 'sprite-core/lib/helpers/render';
import Curve from './curve';

class SmoothCurve extends Curve{
  render(t, ctx) {
    ctx.save();
    ctx.lineWidth = this.attr('lineWidth');
    const points = this.attr('d');
    const color = this.attr('color');
    const isStripe = Array.isArray(color);
    if(!isStripe) {
      ctx.strokeStyle =  color
    }

    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    ctx.globalAlpha = this.attr('opacity');

    
    for(let i = 2, len = points.length; i < len; i += 2) {

      if(isStripe) {
        ctx.strokeStyle = color[i / 2 % 2];
        if (i !== 2) {
          ctx.beginPath();
          ctx.moveTo( (points[i-2] + points[i]) / 2, ((points[i-1] + points[i + 1]) / 2));
        }
      }
      if (i === points.length - 4) {
        ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]);
      } else {
          ctx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) / 2, ((points[i + 1] + points[i + 3]) / 2));
      }
      ctx.stroke();
    }
    ctx.restore();
    return ctx;
  }
}



Curve.defineAttributes({
  lineWidth(attr, val) {
    attr.clearCache();
    attr.set('lineWidth', val)
  },
  color(attr, val) {
    attr.clearCache();
    if(Array.isArray(val)) {
      attr.set('color', val.map(one => parseColorString(val)))
    } else {
      attr.set('color', parseColorString(val))
    }
  }
})


registerNodeType('smoothCurve', SmoothCurve);


export default SmoothCurve;