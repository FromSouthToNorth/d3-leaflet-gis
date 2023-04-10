import { behaviorHash } from '../behavior/hash.js';
import { svgAreas } from '../svg/areas.js';
import { svgPoints } from '../svg/points.js';
import { svgLabels } from '../svg/labels.js';
import { behaviorHover } from '../behavior/index.js';
import cd from '../../data/cd.json';

export function uiInit(context) {

  function render(container) {

    const map = context.map();
    const content = container.append('div')
      .attr('class', 'main-content active');
    content.call(map);

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

  return ui;
}
