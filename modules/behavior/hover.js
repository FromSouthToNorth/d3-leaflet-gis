import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';
import { utilRebind } from '../util/index.js';

/*
   The hover behavior adds the `.hover` class on pointerover to all elements to which
   the identical datum is bound, and removes it on pointerout.

   The :hover pseudo-class is insufficient for iD's purposes because a datum's visual
   representation may consist of several elements scattered throughout the DOM hierarchy.
   Only one of these elements can have the :hover pseudo-class, but all of them will
   have the .hover class.
 */
export function behaviorHover(context) {
  const dispatch = d3_dispatch('hover');
  let _selection = d3_select(null);
  let _targets = [];

  // use pointer events on supported platforms; fallback to mouse events
  const _pointerPrefix = 'PointerEvent' in window ? 'pointer' : 'mouse';


  function behavior(selection) {
    _selection = selection;

    _targets = [];

    _selection.on(_pointerPrefix + 'over.hover', pointerover)
      .on(_pointerPrefix + 'out.hover', pointerout)
      .on(_pointerPrefix + 'down.hover', pointerover);

    function eventTarget(d3_event) {
      const datum = d3_event.target && d3_event.target.__data__;
      if (typeof datum !== 'object') return null;
      return datum;
    }

    function pointerover(d3_event) {
      const target = eventTarget(d3_event);
      if (target && _targets.indexOf(target) === -1) {
        _targets.push(target);
        updateHover(d3_event, _targets);
      }
    }

    function pointerout(d3_event) {
      const target = eventTarget(d3_event);
      const index = _targets.indexOf(target);
      if (index !== -1) {
        _targets.splice(index);
        updateHover(d3_event, _targets);
      }
    }

    function updateHover(d3_event, targets) {
      _selection.selectAll('.hover')
        .classed('hover', false);
      let selector = '';
      for (let target of targets) {
        selector += ', .' + target.wid;
      }
      if (selector.trim().length) {
        selector = selector.slice(1);
        _selection.selectAll(selector)
          .classed('hover', true);
      }
      dispatch.call('hover', this);
    }
  }

  behavior.off = function() {
    d3_select(window)
      .on(_pointerPrefix + 'up.hover pointercancel.hover', null, true)
      .on('keydown.hover', null)
      .on('keyup.hover', null);
  };

  return utilRebind(behavior, dispatch, 'on');
}
