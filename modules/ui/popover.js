import { select as d3_select } from 'd3-selection';
import { utilFunctor } from '../util';

let _popoverID = 0;

export function uiPopover(klass) {
  let _id = _popoverID++;
  let _anchorSelection = d3_select(null);
  const popover = function(selection) {
    _anchorSelection = selection;
    selection.each(setup);
  };
  let _animation = utilFunctor(false);
  let _placement = utilFunctor('top'); // top, bottom, left, right
  let _content;
  let _displayType = utilFunctor('');
  let _hasArrow = utilFunctor(true);

  const _pointerPrefix = 'PointerEvent' in window ? 'pointer' : 'mouse';

  popover.displayType = function(val) {
    if (arguments.length) {
      _displayType = utilFunctor(val);
      return popover;
    }
    else {
      return _displayType;
    }
  };

  popover.placement = function(val) {
    if (arguments.length) {
      _placement = utilFunctor(val);
      return popover;
    }
    else {
      return _placement;
    }
  };

  popover.destroy = function(selection, selector) {
    selector = selector || '.popover-' + _id;
    selection
      .on(_pointerPrefix + 'enter.popover', null)
      .on(_pointerPrefix + 'leave.popover', null)
      .on(_pointerPrefix + 'up.popover', null)
      .on(_pointerPrefix + 'down.popover', null)
      .on('click.popover', null)
      .attr('title', function() {
        return this.getAttribute('data-original-title') || this.getAttribute('title');
      })
      .attr('data-original-title', null)
      .selectAll(selector)
      .remove();
  };

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

    let display = _displayType
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

  function show() {
    const anchor = d3_select(this);
    let popoverSelection = anchor.selectAll('.popover-' + _id);
    if (popoverSelection.empty()) {
      anchor.call(popover.destroy);
      anchor.each(setup);
      popoverSelection = anchor.selectAll('.popover-' + _id);
    }

    popoverSelection.classed('in', true);
    const displayType = _displayType()
      .apply(this, arguments);
    if (displayType === 'clickFocus') {
      anchor.classed('active', true);
      popoverSelection.node()
        .focus();
    }

    anchor.each();
  }

  function updateContent() {
    const anchor = d3_select(this);
    if (_content) {
      anchor.selectAll('.popover-' + _id + ' > .popover-inner')
        .call(_content.apply(this, arguments));
    }
  }

  return popover;

}
