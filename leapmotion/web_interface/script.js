
function Main() {
  this.leftCursor = new Cursor({top: 0, left: 0, 
                                bottom: WINDOW_HEIGHT, right: WINDOW_WIDTH/2}, "red");
  this.rightCursor = new Cursor({top: 0, left: WINDOW_WIDTH/2, 
                                bottom: WINDOW_HEIGHT, right: WINDOW_WIDTH}, "green");

  this.settingsTiles = [];
  this.addSettingsTiles();

  this.currentAdjPanel = null;
  var frame = $(".right-frame");
  frame.html(' <----- Hover over a tile on the left');

}


Main.prototype.addSettingsTiles = function() {
  var panelTemplate = $(".adjustment-panel.numeric").detach();

  var name = 'Brightness'
  var panelEl = panelTemplate.clone();
  panelEl.find(".panel-title").text(name);
  var adjPanel = new NumericAdjustmentPanel(name, 0, 100, 1, panelEl, this.rightCursor,
                    API.getBrightness, API.setBrightness);
  var tile = new SettingsTile(name, adjPanel);
  this.leftCursor.registerListener(tile.getEl(), this.tileEnterFn.bind(this, tile), 
      this.tileHoverFn.bind(this, tile), this.tileExitFn.bind(this, tile));

  name = 'Zoom'
  panelEl = panelTemplate.clone();
  panelEl.find(".panel-title").text(name);
  adjPanel = new NumericAdjustmentPanel(name, 0, 1, .05, panelEl, this.rightCursor,
                    API.getZoom, API.setZoom);
  tile = new SettingsTile(name, adjPanel);
  this.leftCursor.registerListener(tile.getEl(), this.tileEnterFn.bind(this, tile), 
      this.tileHoverFn.bind(this, tile), this.tileExitFn.bind(this, tile));

  name = 'Effects'
  adjPanel = new EffectAdjustmentPanel(name, this.rightCursor);
  tile = new SettingsTile(name, adjPanel);
  this.leftCursor.registerListener(tile.getEl(), this.tileEnterFn.bind(this, tile), 
      this.tileHoverFn.bind(this, tile), this.tileExitFn.bind(this, tile));

  name = 'Capture'
  adjPanel = new CaptureAdjustmentPanel();
  tile = new SettingsTile(name, adjPanel, $(".snap-pic-button"));
  this.leftCursor.registerListener(tile.getEl(), this.tileEnterFn.bind(this, tile), 
      this.tileHoverFn.bind(this, tile), this.tileExitFn.bind(this, tile));
}


Main.prototype.tileEnterFn = function(settingsTile) {
  this.changeAdjPanels(settingsTile.getAdjPanel());
}


Main.prototype.tileHoverFn = function(settingsTile) {
  // console.log("Hovered", settingsTile.name);
}


Main.prototype.tileExitFn = function(settingsTile) {

  if (settingsTile.getAdjPanel() === this.currentAdjPanel) {
    this.currentAdjPanel.panelUnselected();
    this.currentAdjPanel = null;

    var frame = $(".right-frame");
    frame.html(' <----- Hover over a tile on the left');
  }

}


Main.prototype.changeAdjPanels = function(adjPanel) {
  if (this.currentAdjPanel !== null) {
    this.currentAdjPanel.panelUnselected();
  }

  this.currentAdjPanel = adjPanel;
  adjPanel.panelSelected();

  var frame = $(".right-frame");
  frame.html('');

  frame.append(adjPanel.getEl());

}


Main.prototype.start = function() {
  // Setup Leap loop with frame callback function
  var controllerOptions = {enableGestures: true};

  // Main loop for processing frame data
  Leap.loop(controllerOptions, (function(frame) {

    for (var i = 0; i < frame.hands.length; i++) {
      // left hand cursor
      if (frame.hands[i].type == "left") {
        var pos = frame.hands[i].indexFinger.dipPosition;
        this.leftCursor.updatePos(pos, frame.interactionBox);
      } else {
        var pos = frame.hands[i].indexFinger.dipPosition;
        this.rightCursor.updatePos(pos, frame.interactionBox);

        // update right setting with right hand frame data
        if (this.currentAdjPanel) {
          this.currentAdjPanel.update(frame.hands[i]);
        }
      }
    }

  }).bind(this));
}




