import { select as d3_select } from 'd3-selection';
import { utilFunctor } from '../util';

let _popoverID = 0;

export function uiPopover(klass) {

  let _id = _popoverID++;
  let _anchorSelection = d3_select(null);
  let popover = function(selection) {
    _anchorSelection = selection;
    selection.each(setup);
  };
  let _animation = utilFunctor(false);
  let _displayType = utilFunctor('');
  let _hasArrow = utilFunctor(true);

  const _pointerPrefix = 'PointerEvent' in window ? 'pointer' : 'mouse';

  function setup() {
    let anchor = d3_select(this);
    let animate = _animation.apply(this, arguments);
    let popoverSelection = anchor.selectAll('.popover-' + _id)
      .data([0]);

    let enter = popoverSelection.enter()
      .append('div')
      .attr('class', 'popover popover-' + _id + ' ' + (klass ? klass : ''))
      .classed('arrowed', _hasArrow.apply(this, arguments));

    enter.append('div')
      .attr('class', 'popover-arrow');

    enter.append('div')
      .attr('class', 'popover-inner');

    popoverSelection = enter.merge(popoverSelection);

    if (animate) {
      popoverSelection.classed('fade', true);
    }

    let display = _displayType()
      .apply(this, arguments);

    if (display === 'hover') {
      let _lastNonMouseEnterTime;
      anchor
        .on(_pointerPrefix + 'enter.popover', function(d3_event) {
          console.log('show: ', d3_event);
        })
        .on(_pointerPrefix + 'leave.popover', function() {
          console.log('hide: ');
        })
        .on('focus.popover', function() {
          console.log('focus.popover show');
        })
        .on('blur.popover', function() {
          console.log('blur.popover hide');
        });
    }
  }

  return popover;

}
