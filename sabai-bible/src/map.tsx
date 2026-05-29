/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Standalone entry point for the Bible Journey Map page.
 * Rendered inside an <iframe src="/map"> on the marketing site.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import BibleJourneyApp from './explore/BibleJourneyApp.jsx';
import './index.css';

const container = document.getElementById('map-root')!;
createRoot(container).render(<BibleJourneyApp />);
