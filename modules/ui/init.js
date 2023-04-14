import { behaviorHash } from '../behavior/hash.js';
import { svgAreas } from '../svg/areas.js';
import { svgPoints } from '../svg/points.js';
import { svgLabels } from '../svg/labels.js';
import { behaviorHover } from '../behavior/index.js';
import cd from '../../data/cd.json';
import { svgDefs } from '../svg/defs.js';
import { uiEditMenu } from './edit_menu.js';
import { behaviorSelect } from '../behavior/select.js';
import { operationCopy, operationDelete, operationMove } from '../operations/index.js';

export function uiInit(context) {

  function render(container) {

    container.append('svg')
      .attr('id', 'hy-defs')
      .call(ui.svgDefs);

    const map = context.map();
    const content = container.append('div')
      .attr('class', 'main-content active');

    content
      .append('div')
      .attr('class', 'main-map')
      .attr('dir', 'ltr')
      .call(map);

    context.overlayPaneSvg =
      map.overlayPane();

    const pints = [], areas = [], labels = [];
    cd.features.forEach(function(json) {
      const { geometry, properties } = json;
      const index = properties.id.indexOf('/');
      if (index !== -1) {
        json.wid = 'w' + properties.id.substring(index + 1, properties.id.length);
      }
      switch (geometry.type) {
        case 'Point':
          pints.push(json);
          break;
        case 'Polygon':
          areas.push(json);
          break;
      }
      if (properties.name && geometry.type === 'Point') {
        labels.push(json);
      }
    });

    const drawAreas = svgAreas(map.projection(), context);
    drawAreas(context.overlayPaneSvg, areas);
    //
    // const drawPoints = svgPoints(map.projection(), context);
    // drawPoints(context.overlayPaneSvg, pints);
    //
    // const drawLabels = svgLabels(map.projection(), context);
    // drawLabels(context.overlayPaneSvg, labels);

    const _behaviors = [
      behaviorHover(context),
      behaviorSelect(context),
    ];

    _behaviors.forEach(context.install);

    ui.hash = behaviorHash(context);
    ui.hash();
  }

  let ui = {};

  let _loadPromise;

  ui.ensureLoaded = () => {
    return _loadPromise = Promise.all(
      [],
    )
      .then(() => {
        if (!context.container()
          .empty()) {
          render(context.container());
        }
      })
      .catch(err => console.error(err));
  };

  ui.svgDefs = svgDefs(context);

  const _editMenu = uiEditMenu(context);
  ui.editMenu = function() {
    return _editMenu;
  };
  ui.showEditMenu = function(anchorPoint, triggerType, operations) {
    ui.closeEditMenu();
    if (!operations) operations = [
      operationMove(context),
      operationCopy(context),
      operationDelete(context),
    ];
    operations.forEach(function(operation) {
      if (operation.point) operation.point(anchorPoint);
    });

    _editMenu.anchorLoc(anchorPoint)
      .operations(operations);

    context.map()
      .overlayPane()
      .call(_editMenu);
  };
  ui.closeEditMenu = function() {
    context.map()
      .overlayPane()
      .select('.edit-menu')
      .remove();
  };

  return ui;
}
