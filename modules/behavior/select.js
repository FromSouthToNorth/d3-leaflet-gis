import { select as d3_select } from 'd3-selection';

import { utilFastMouse } from '../util/index.js';
import { geoVecLength } from '../geo/index.js';

export function behaviorSelect(context) {
  // see also behaviorDrag
  const _tolerancePx = 4;
  let _lastMouseEvent = null;
  let _showMenu = false;
  let _longPressTimeout = null;
  let _lastInteractionType = null;

  function contextmenu(d3_event) {
    d3_event.preventDefault();
    _showMenu = true;

    if (!+d3_event.clientX && !+d3_event.clientY) {
      if (_lastMouseEvent) {
        d3_event = _lastMouseEvent;
      }
      else {
        return;
      }
    }
    else {
      _lastMouseEvent = d3_event;
      if (d3_event.pointerType === 'touch' || d3_event.pointerType === 'pen' ||
        d3_event.mozInputSource && ( // firefox doesn't give a pointerType on contextmenu events
          d3_event.mozInputSource === MouseEvent.MOZ_SOURCE_TOUCH ||
          d3_event.mozInputSource === MouseEvent.MOZ_SOURCE_PEN)) {
        _lastInteractionType = 'touch';
      }
      else {
        _lastInteractionType = 'rightclick';
      }
    }

    _showMenu = true;
    click(d3_event, d3_event);
  }

  function click(firstEvent, lastEvent) {
    cancelLongPress();

    const mapNode = context.container()
      .select('.main-map')
      .node();

    const pointGetter = utilFastMouse(mapNode);
    const p1 = pointGetter(firstEvent);
    const p2 = pointGetter(lastEvent);
    const dist = geoVecLength(p1, p2);

    if (dist > _tolerancePx || !mapContains(lastEvent)) {
      resetProperties();
      return;
    }
    const targetDatum = lastEvent.target.__data__;

    processClick(targetDatum, p2);

    function mapContains(event) {
      const rect = mapNode.getBoundingClientRect();
      return event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    }

  }

  function processClick(datum, point) {
    const entity = datum && datum.properties;
    if (entity) {
      datum = entity;
    }
    console.log(datum);
    context.ui()
      .closeEditMenu();
    if (_showMenu) context.ui()
      .showEditMenu(point);

    resetProperties();
  }

  function cancelLongPress() {
    if (_longPressTimeout) window.clearTimeout(_longPressTimeout);
    _longPressTimeout = null;
  }

  function resetProperties() {
    cancelLongPress();
    _showMenu = false;
    _lastInteractionType = null;
  }

  function behavior(selection) {
    d3_select(window)
      .on('contextmenu.select-window', function(d3_event) {
        const e = d3_event;
        if (+e.clientX === 0 && +e.clientY === 0) {
          d3_event.preventDefault();
        }
      });

    selection.on('contextmenu.select', contextmenu);
  }

  return behavior;
}
