function AdjustmentPanel () {
    this.element = $("div");
    this.isActive = false;

    this.throttleCount = 0;
}


AdjustmentPanel.prototype.getEl = function() {
    return this.element;
}


AdjustmentPanel.prototype.update = function(hand) {

}

// must define panelSelected and panelUnselected for adjustment panel







NumericAdjustmentPanel.prototype = new AdjustmentPanel();
NumericAdjustmentPanel.prototype.constructor = NumericAdjustmentPanel;

function NumericAdjustmentPanel(title, minVal, maxVal, scale, el, cursor,
                                APIgetter, APIsetter) 
{
    this.title = title;
    this.element = el;
    this.rightCursor = cursor;
    this.isActive = false;

    this.minVal = minVal;
    this.maxVal = maxVal;
    this.scale = scale;

    this.activePanel = el.find('.panel-active-frame');

    this.APIgetter = APIgetter;
    this.APIsetter = APIsetter;

}


NumericAdjustmentPanel.prototype.panelSelected = function() {
    this.APIgetter((function(data) {
        this.setValue(data.value);
    }).bind(this));

    this.rightCursor.registerListener(this.activePanel, this.activeEnterFn.bind(this),
                        this.activeHoverFn.bind(this), this.activeExitFn.bind(this));

}


NumericAdjustmentPanel.prototype.panelUnselected = function() {
    this.activePanel.removeClass("activated");
    this.rightCursor.deregisterListener(this.activePanel);
}


NumericAdjustmentPanel.prototype.activeEnterFn = function() {
    this.activePanel.addClass("activated");
    this.isActive = true;
}


NumericAdjustmentPanel.prototype.activeHoverFn = function() {

}


NumericAdjustmentPanel.prototype.activeExitFn = function() {
    this.activePanel.removeClass("activated");
    this.isActive = false;
}


NumericAdjustmentPanel.prototype.setValue = function(val) {

    val = Math.min(this.maxVal, val);
    val = Math.max(this.minVal, val);
    this.currentVal = val;

    var rounded = Math.round(val * 100) / 100
    this.activePanel.find('.numeric-text').text(rounded);
}


// neg is right, pos is left
NumericAdjustmentPanel.prototype.update = function(hand) {
    if (!this.isActive) {
        return;
    }
    this.throttleCount++;
    if (!(this.throttleCount % 10 === 0)) {
        return;
    }

    var deg = hand.roll();
    var THRESH = .35;

    if (deg <= -THRESH) {
        this.setValue(this.currentVal + this.scale);
        this.APIsetter(this.currentVal, function(data) {
            console.log("set", data)
        });
    } else if (deg >= THRESH) {
        this.setValue(this.currentVal - this.scale);
        this.APIsetter(this.currentVal, function(data) {
            console.log("set", data)
        });
    }
}



CaptureAdjustmentPanel.prototype = new AdjustmentPanel();
CaptureAdjustmentPanel.prototype.constructor = CaptureAdjustmentPanel;

function CaptureAdjustmentPanel(title) {
    this.title = title;
    this.element = $("<div class='capture-text'> Do gesture to take pic </div>");

    this.takingPic = false;
}


CaptureAdjustmentPanel.prototype.panelSelected = function() {
    this.isActive = true;
}


CaptureAdjustmentPanel.prototype.panelUnselected = function() {
    this.isActive = false;
}


CaptureAdjustmentPanel.prototype.update = function(hand) {
    if (!this.isActive) {
        return;
    }
    this.throttleCount++;
    if (!(this.throttleCount % 10 === 0)) {
        return;
    }

    if (!this.takingPic && hand.grabStrength > .9) {
        this.takingPic = true;
        API.capture((function(response) {
            if (response.success) {
                this.element.text("Do gesture to take another picture");
                this.takingPic = false;
            } else {
                this.element.text("LOL Error? Try restarting...");
            }
            
        }).bind(this));
        this.element.text("Taking Picture! See @CMU_PicPerfect on Twitter");
    }
}


EffectAdjustmentPanel.prototype = new AdjustmentPanel();
EffectAdjustmentPanel.prototype.constructor = EffectAdjustmentPanel;
function EffectAdjustmentPanel(title, cursor) {
    this.title = title;
    this.element = $(".adjustment-panel.effects").detach();
    console.log(this.element);

    this.effects = [
        'none',
        'negative',
        'sketch',
        'emboss',
        'oilpaint',
        'pastel',
        'watercolor',
        'film',
        'cartoon'
    ]

    this.effectsEls = [];

    var container = this.element.find('.effect-options');
    for (var i = 0; i < this.effects.length; i++) {
        var el = $("<div class='effect-option'></div>").text(this.effects[i]);
        el.addClass(this.effects[i]);
        this.effectsEls.push(el);

        container.append(el);

        cursor.registerListener(el, this.effectEnterFn.bind(this, this.effects[i]),
                    this.effectHoverFn.bind(this, this.effects[i]),
                    this.effectExitFn.bind(this, this.effects[i]));
    }

    this.currentEffect = "none";
    $(".effect-option." + "none").addClass('selected');


}

EffectAdjustmentPanel.prototype.panelSelected = function() {
    $(".effect-option." + this.currentEffectName).addClass('selected');
}


EffectAdjustmentPanel.prototype.panelUnselected = function() {
    $(".effect-option").removeClass('selected');
}


EffectAdjustmentPanel.prototype.effectEnterFn = function(effectName) {
    if (this.currentEffect != effectName) {
        //enable new effect
        this.currentEffect = effectName;
        // $(".effect-option." + effectName).addClass('selected');
        $(".effect-option." + effectName).addClass('selected');
        
        API.setEffect(effectName, function(data) {
        });

    }
    

}


EffectAdjustmentPanel.prototype.effectHoverFn = function(effectName) {
    
}


EffectAdjustmentPanel.prototype.effectExitFn = function(effectName) {
    $(".effect-option." + effectName).removeClass('selected');
}


