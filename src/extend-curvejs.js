import {Path, Group} from 'sprite-core';
import sCurve  from './curve';

import {Stage as Cstage , Curve as Ccurve, motion} from 'curvejs';



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

export {
    Stage, Curve, motion,
};