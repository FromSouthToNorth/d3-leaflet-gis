import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';

import { utilRebind } from '../util/index.js';
import { rendererMap } from '../renderer/map.js';
import { uiInit } from '../ui/init.js';


export function coreContext() {
  const dispatch = d3_dispatch('enter', 'exit', 'change');
  let context = utilRebind({}, dispatch, 'on');

  context.install =
    (behavior) => context.overlayPane()
      .call(behavior);
  context.uninstall =
    (behavior) => context.overlayPane()
      .call(behavior.off);

  /* Container */
  let _container = d3_select(null);
  context.container = function(val) {
    if (!arguments.length) return _container;
    _container = val;
    _container.classed('hy', true);
    return context;
  };
  context.containerNode = function(val) {
    if (!arguments.length) return context.container()
      .node();
    context.container(d3_select(val));
    return context;
  };

  /* Map */
  let _map;
  context.map = () => _map;
  context.overlayPane = () => _map.overlayPane();
  context.overlayPaneRect =
    () => _map.overlayPane()
      .node()
      .getBoundingClientRect();

  let _ui;
  context.ui = () => _ui;

  context.asset = (val) => {
    if (/^http(s)?:\/\//i.test(val)) return val;
    return `../../img/${val}`;
  };

  context.imagePath = (val) => context.asset(val);

  context.init = () => {

    instantiateInternal();
    initializeDependents();

    return context;

    function instantiateInternal() {
      _map = rendererMap(context);
      _ui = uiInit(context);
    }

    function initializeDependents() {
      _map.init();
      if (!context.container()
        .empty()) {
        _ui.ensureLoaded()
          .then(() => {
          });
      }
    }

  };

  return context;
}
