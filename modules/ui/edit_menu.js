import { select as d3_select } from 'd3-selection';
import { dispatch as d3_dispatch } from 'd3-dispatch';

import { geoVecAdd } from '../geo/index.js';
import { uiTooltip } from './tooltip.js';
import { utilRebind } from '../util/index.js';

export function uiEditMenu(context) {

  const dispatch = d3_dispatch('toggled');
  let _menu = d3_select(null);
  let _operations = [];
  // the position the menu should be displayed relative to
  let _anchorLoc = [0, 0];
  let _anchorLocLonLat = [0, 0];

  const _vpTopMargin = 85; // viewport top margin
  const _vpBottomMargin = 45; // viewport bottom margin
  const _vpSideMargin = 35;   // viewport side margin

  let _menuTop = false;
  let _menuHeight;
  let _menuWidth;

  // 对这些值进行硬编码以使菜单定位更容易
  let _verticalPadding = 4;

  // see also `.edit-menu .tooltip` CSS; include margin
  const _tooltipWidth = 210;

  // 稍微偏离目标位置的菜单
  const _menuSideMargin = 10;

  let _tooltips = [];

  const editMenu = function(selection) {
    console.log('editMenu selection: ', selection);
    const ops = _operations.filter(function(op) {
      return !op.mouseOnly;
    });

    if (!ops.length) return;

    _tooltips = [];
    const buttonHeight = 34;
    _menuWidth = 44;

    _menuHeight = _verticalPadding * 2 + ops.length * buttonHeight;
    _menu = selection.append('div')
      .attr('class', 'edit-menu')
      .style('padding', _verticalPadding + 'px 0');

    const buttons = _menu.selectAll('.edit-menu-item')
      .data(ops);

    // enter
    const buttonsEnter = buttons.enter()
      .append('button')
      .attr('class', function(d) {
        return 'edit-menu-item edit-menu-item-' + d.id;
      })
      .style('height', buttonHeight + 'px')
      .on('click', click);

    buttonsEnter.merge(buttons)
      .classed('disabled', function(d) {
        return d.disabled();
      });

    updatePosition();

    function click(d3_event, operation) {
      console.log('click: ', d3_event, operation);
    }

    dispatch.call('toggled', this, true);
  };

  function updatePosition() {
    if (!_menu || _menu.empty()) return;

    const anchorLoc = context.map()
      .point(_anchorLocLonLat);
    console.log(anchorLoc);

    const viewport = context.overlayPaneRect();
    if (anchorLoc[0] < 0 || anchorLoc[0] > viewport.weight || anchorLoc[1] < 0 || anchorLoc[1] > viewport.height) {
      // close the menu if it's gone offscreen
      editMenu.close();
      return;
    }

    const menuLeft = displayOnLeft(viewport);
    const offset = [0, 0];
    offset[0] = menuLeft ? -1 * (_menuSideMargin + _menuWidth) : _menuSideMargin;

    if (anchorLoc[1] + _menuHeight > (viewport.height - _vpBottomMargin)) {
      offset[1] = -anchorLoc[1] - _menuHeight + viewport.height - _vpBottomMargin;
    }
    else {
      offset[1] = 0;
    }

    const origin = geoVecAdd(anchorLoc, offset);

    _menu.style('left', origin[0] + 'px')
      .style('top', origin[1] + 'px');

    function displayOnLeft(viewport) {
      return (anchorLoc[0] - _menuSideMargin - _menuWidth) < _vpSideMargin;
    }

    function tooltipPosition(viewport, menuLeft) {
      if (!menuLeft) {
        return 'right';
      }
      if ((anchorLoc[0] - _menuSideMargin - _menuWidth - _tooltipWidth) < _vpSideMargin) {
        return 'right';
      }

      return 'left';
    }
  }

  editMenu.close = function() {
    context.map()
      .on('move.edit-menu', null)
      .on('drawn.edit-menu', null);
    _menu.remove();
    _tooltips = [];
    dispatch.call('toggled', this, false);
  };

  editMenu.anchorLoc = function(val) {
    if (!arguments.length) return _anchorLoc;
    _anchorLoc = val;
    _anchorLocLonLat = context.map()
      .invert(_anchorLoc);
    return editMenu;
  };

  editMenu.operations = function(val) {
    if (!arguments.length) return _operations;
    _operations = val;
    return editMenu;
  };

  return utilRebind(editMenu, dispatch, 'on');

}
