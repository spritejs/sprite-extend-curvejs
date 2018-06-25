import {Path, Group} from 'sprite-core';
import sCurve  from './curve';
import sSmoothCurve from './smoothCurve';

import {Stage as Cstage , Curve as Ccurve, SmoothCurve as CsmoothCurve, motion} from 'curvejs';



// rewrite Stage in curvejs
class Stage extends Cstage {
    constructor(width, height, renderTo) {
        if(arguments.length === 1) {
            super(width.canvas);
            this.layer = width;
        } else if (arguments.length === 3) {
            super(width, height, renderTo);
            throw new Error('sprite-extend-curvejs can and must have only one argument！');
        }
    }

    update(notClear) {
        this.children.forEach(child => {
            child.draw(this.layer);
        });
    }

    add(line) {
        line.renderer = this.layer;
        this.children.push(line);
    }
}

// rewrite Curve in curvejs
class Curve extends Ccurve {
    constructor(option) {
        super(option);
        this.isGroupAddToLayer = false;
    }

    _initVision(visionCount = 80) {
        this.visionGroup = new Group({
            virtual: true,
        });

        for(let i = 0; i < visionCount; i++) {
            this.tick(true)
            const curve = new sCurve();
            curve.attr({
               color: this.color,
               pos: [this.x, this.y],
            });
            this.visionGroup.append(curve);
        }
    }


    tick(tickSelf){
        this._now = Date.now();

        if (this._now - this._preDate > this.visionInterval || tickSelf) {
            this.vision = this.vision.concat([...this.points, this.color]);

            if (this.vision.length > this.visionMax) {
                this.vision.splice(0, 9)
            };
            this._preDate = this._now;
        }
    
        if(!this.pauseMotion) {
            this.motion.call(this, this.points, this.data);
        }
    
        if(this._targetPoints){
            this._pointsTo();
        }
    }

    draw(layer){
        if(!this.isGroupAddToLayer) {
          layer.append(this.visionGroup);
          this.isGroupAddToLayer = true;
        }
        this.tick();
        const va = this.vision;
        const lastIndex = this.visionGroup.length - 1;
        this.visionGroup.children.forEach((vision, index) => {
            if(index === lastIndex) return;
            const path = va.slice(index * 9, index * 9 + 9);
            const opacity = index * 9 / this.visionMax * this.visionAlpha;
            vision.attr({
              opacity,
              d: path.slice(0, 8),
              color: path[8],
            })
        })
    }
}

// rewrite SmoothCurve in curvejs
class SmoothCurve extends CsmoothCurve {
  constructor(option){
    super(option);
  }

  _initVision(visionCount = 80) {
    this.visionGroup = new Group();
    this.isGroupAddToLayer = false;
    const curveCount = this.disableVision ? 1 : this.visionMax;

    for(let i = 0; i < curveCount; i++) {
        const curve = new sSmoothCurve();
        curve.attr({
          color: this.color,
          pos: [this.x, this.y],
        });
        this.visionGroup.append(curve)
    }

    for(let i = 0; i < visionCount; i++) {
      this.tick(true)
    }
  }

  tick(tickSelf){
    this._now = Date.now();
    if (this._now - this._preDate > this.visionInterval || tickSelf) {
        this.vision = this.vision.concat([this.points.slice(0)]);
        if (this.vision.length > this.visionMax) {
            this.vision.splice(0, 1)
        };
        this._preDate = this._now;
    }

    if(!this.pauseMotion) {
        this.motion.call(this, this.points, this.data);
    }

    if(this._targetPoints){
        this._pointsTo();
    }
  }

  draw(layer){
    if(!this.isGroupAddToLayer) {
        layer.append(this.visionGroup);
        this.isGroupAddToLayer = true;
    }
    this.tick();
    const ctx = layer.canvas.getContext('2d');
    this.beforeDraw.call(this, ctx)

    const lastIndex = this.visionGroup.children.length - 1;
    this.visionGroup.children.forEach((va, index) => {
        const path = this.vision[index]
        const opacity = index === lastIndex ? 1 : index / this.visionMax * this.visionAlpha;
        va.attr({
          opacity,
          d: path
        })
    })
    this.afterDraw.call(this, ctx);
  }

}

export {
    Stage, Curve, SmoothCurve, motion
};