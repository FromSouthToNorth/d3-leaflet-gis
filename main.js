import './css/reset.css';
import 'leaflet/dist/leaflet.css';
import './css/style.css';

import { coreContext } from './modules/core/index.js';

const container = document.querySelector('#app');
const context = coreContext().containerNode(container);
context.init();
