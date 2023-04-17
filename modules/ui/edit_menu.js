import { select as d3_select } from 'd3-selection';
import { dispatch as d3_dispatch } from 'd3-dispatch';

import { geoVecAdd } from '../geo/index.js';
import { utilRebind } from '../util/index.js';
import { svgIcon } from '../svg/index.js';
import { uiTooltip } from './tooltip.js';

export function uiEditMenu(context) {

  const dispatch = d3_dispatch('toggled');
  let _menu = d3_select(null);
  let _operations = [];
  // the position the menu should be displayed relative to
  let _anchorLoc = [0, 0];
  let _anchorLocLonLat = [0, 0];

  const _vpBottomMargin = 12; // viewport bottom margin
  const _vpSideMargin = 35;   // viewport side margin

  let _menuHeight;
  let _menuWidth;

  // 对这些值进行硬编码以使菜单定位更容易
  let _verticalPadding = 4;

  // see also `.edit-menu .tooltip` CSS; include margin
  const _tooltipWidth = 210;

  // 稍微偏离目标位置的菜单
  const _menuSideMargin = 10;

  let _tooltips = []

  const editMenu = function(selection) {
    const ops = _operations.filter(function(op) {
      return !op.mouseOnly;
    });

    if (!ops.length) return;

    _tooltips = []

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
      .on('click', click)
      .on('pointerup', function(d) {
        console.log('pointerup: ', d);
      })
      .on('pointerdown mousedown', function pointerdown(d3_event) {
        console.log('pointerdown');
        // don't let button presses also act as map input - #1869
        d3_event.stopPropagation();
      })
      .on('mouseenter.highlight', function(d3_event, d) {
        if (d3_select(this)
          .classed('disabled')) return;
        console.log('mouseenter');
      })
      .on('mouseleave.highlight', function(d3_event, d) {
        console.log('mouseleave');
      });

    buttonsEnter.merge(buttons)
      .classed('disabled', function(d) {
        return d.disabled();
      });

    buttonsEnter.each(function(d) {
      const tooltip = uiTooltip()
        .heading(() => d.title)
        .title(d.tooltip)
        .keys([d.keys[0]]);

      _tooltips.push(tooltip);

      d3_select(this)
        .call(tooltip)
        .append('div')
        .attr('class', 'icon-wrap')
        .call(svgIcon(d.icon && d.icon() || '#iD-operation-' + d.id, 'operation'));
    });

    updatePosition();

    function click(d3_event, operation) {
      d3_event.stopPropagation();
      console.log('click: ', d3_event, operation);
    }

    dispatch.call('toggled', this, true);
  };

  function updatePosition() {
    if (!_menu || _menu.empty()) return;

    const anchorLoc = context.map()
      .point(_anchorLocLonLat);

    const viewport = context.mapContainerRect();

    if (anchorLoc[0] < 0 || anchorLoc[0] > viewport.weight || anchorLoc[1] < 0 || anchorLoc[1] > viewport.height) {
      // close the menu if it's gone offscreen
      editMenu.close();
      return;
    }

    const menuLeft = displayOnLeft(viewport);

    const offset = [0, 0];

    offset[0] = menuLeft ? -1 * (_menuSideMargin + _menuWidth) : _menuSideMargin;
    if (anchorLoc[1] + _menuHeight > (viewport.height - _vpBottomMargin)) {
      // menu is near bottom viewport edge, shift upwards
      offset[1] = -anchorLoc[1] - _menuHeight + viewport.height - _vpBottomMargin;
    }
    else {
      offset[1] = 0;
    }
    const origin = geoVecAdd(anchorLoc, offset);

    _menu.style('left', origin[0] + 'px')
      .style('top', origin[1] + 'px')
      .style('z-index', 890);

    const tooltipSide = tooltipPosition(viewport, menuLeft);
    _tooltips.forEach(function(tooltip) {
      tooltip.placement(tooltipSide);
    })

    function displayOnLeft(viewport) {
      if ((anchorLoc[0] + _menuSideMargin + _menuWidth) > (viewport.width - _vpSideMargin)) {
        // right menu would be too close to the right viewport edge, go left
        return true;
      }
      // prefer right menu
      return false;
    }

    function tooltipPosition(viewport, menuLeft) {
      if (menuLeft) {
        // if there's not room for a right-side menu then there definitely
        // isn't room for right-side tooltips
        return 'left';
      }
      if ((anchorLoc[0] + _menuSideMargin + _menuWidth + _tooltipWidth) > (viewport.width - _vpSideMargin)) {
        // right tooltips would be too close to the right viewport edge, go left
        return 'left';
      }
      // prefer right tooltips
      return 'right';

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
