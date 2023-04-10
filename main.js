import './css/reset.css';
import 'leaflet/dist/leaflet.css';
import './css/style.css';
import './css/points.css';
import './css/areas.css';
import './css/labels.css';

import { coreContext } from './modules/core/index.js';

const container = document.querySelector('#app');
const context = coreContext().containerNode(container);
context.init();
