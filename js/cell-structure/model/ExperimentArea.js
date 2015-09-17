define(function(require) {
    'use strict';

    // modules
    var inherit = require('PHET_CORE/inherit');
    var PropertySet = require('AXON/PropertySet');
    var Dimension2 = require('DOT/Dimension2');
    var Vector2 = require('DOT/Vector2');
    var Stopwatch = require('CELL_STRUCTURE/cell-structure/model/Stopwatch');
    var Slot = require('CELL_STRUCTURE/cell-structure/model/Slot');

    function ExperimentArea(properties) {
        var defaults = {
            location: '',
            size: '',
            visibility: true,
            children: [],
            newChild: undefined,
            stopwatch: null
        };
        var values = _.merge(defaults, properties);
        PropertySet.call(this, values);

        this.slots = [
            new Slot({
                location: new Vector2(0, 0),
                size: new Dimension2(250, 250)
            }),
            new Slot({
                location: new Vector2(250, 0),
                size: new Dimension2(250, 250)
            }),
            new Slot({
                location: new Vector2(500, 0),
                size: new Dimension2(250, 250)
            }),
            new Slot({
                location: new Vector2(750, 0),
                size: new Dimension2(250, 250)
            })
        ];

        var getSlot = function(model) {
            return _(this.slots).filter(function(slot) {
                return slot.location.x < model.location.x && model.location.x < slot.location.x + slot.size.width;
            }).first();
        }.bind(this);

        var addChild = function(model) {
            if (model.type !== "apparatus") return;

            var slot = getSlot(model);
            if (!slot.setChild(model)) {
                model.reset();
                return;
            }

            //// Do not add duplicates
            //var childIndex = this.children.indexOf(model);
            //if (childIndex !== -1) return;

            //this.children.push(model);

            //if (typeof this.onAddChild == "function") {
            //    this.onAddChild(model);
            //}
            CS.model.apparatusKit.removeChild(model);
        }.bind(this);

        CS.addDroppable(this);

        this.onReceiveDrop = function(model) {
            addChild(model);
        };

        CS.addEventHandler('ApparatusRemoved', function(child) {
            CS.model.apparatusKit.addChild(child);
            this.removeChild(child);
            if (typeof child.onRemove == "function") {
                child.onRemove();
            }
        }.bind(this));

        this.removeChild = function(child) {
            var childIndex = this.children.indexOf(child);
            if (childIndex == -1) return;
            this.children.splice(childIndex, 1);
            if (typeof this.onRemoveChild == "function") {
                this.onRemoveChild(childIndex);
            }
        };

        this.createStopwatch = function(callback) {
            if (this.stopwatch) return;
            this.stopwatchProperty.set(new Stopwatch(callback));
        };
        this.stopStopwatch = function() {
            if (!this.stopwatch) return;
            this.stopwatch.stopTimer();
            this.stopwatchProperty.set(null);
        };
    }

    return inherit(PropertySet, ExperimentArea);
});
