function SettingsTile (name, adjustmentPanel, optEl) {
    this.name = name;
    this.adjustmentPanel = adjustmentPanel;

    if (optEl) {
        this.tileEl = optEl;
    } else {
        this.tileEl = $("<div class='settings-tile'></div>");
        $(".settings-tiles-container").append(this.tileEl);

        this.tileEl.text(name);
    }
}


SettingsTile.prototype.getEl = function() {
    return this.tileEl;
}


SettingsTile.prototype.getAdjPanel = function() {
    return this.adjustmentPanel;
}