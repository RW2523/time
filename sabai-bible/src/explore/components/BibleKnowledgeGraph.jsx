/**
 * BibleKnowledgeGraph — Interactive force-directed graph of 100 Bible concepts
 * Uses react-force-graph-2d (canvas-based, D3 force simulation)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GRAPH_NODES, GRAPH_EDGES, GRAPH_CATEGORIES, computeNodeDegrees } from '../data/bibleGraphData.js';
import { Search, X, Info, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

// ── Build graph data ──────────────────────────────────────────────────────────
const ALL_NODES = GRAPH_NODES;
const ALL_EDGES = GRAPH_EDGES;
const DEGREES   = computeNodeDegrees(ALL_NODES, ALL_EDGES);

const NODE_SIZE_BASE = 6;
const NODE_SIZE_SCALE = 3;

function nodeRadius(node) {
  const imp = node.importance || 1;
  const deg = DEGREES[node.id] || 0;
  return NODE_SIZE_BASE + imp * NODE_SIZE_SCALE * 0.5 + deg * 0.5;
}

// ── Category colours ──────────────────────────────────────────────────────────
const CAT_COLORS = Object.fromEntries(
  Object.entries(GRAPH_CATEGORIES).map(([k, v]) => [k, v.color])
);

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function nodeColor(node) { return CAT_COLORS[node.category] || '#94a3b8'; }

// ── Component ─────────────────────────────────────────────────────────────────
export default function BibleKnowledgeGraph() {
  const fgRef    = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 900, h: 600 });
  const containerRef = useRef(null);

  const [search,       setSearch]       = useState('');
  const [activeCategories, setActiveCategories] = useState(new Set(Object.keys(GRAPH_CATEGORIES)));
  const [hoveredNode,  setHoveredNode]  = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [showInfo,     setShowInfo]     = useState(false);

  // Responsive resize — fire immediately on mount and on every size change
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const w = Math.floor(width);
        const h = Math.floor(height);
        if (w > 0 && h > 0) setDimensions({ w, h });
      }
    };
    measure(); // fire once immediately
    const obs = new ResizeObserver(measure);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Filter graph by category + search
  const graphData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const nodes = ALL_NODES.filter(n => {
      const catOk = activeCategories.has(n.category);
      const searchOk = !q || n.label.toLowerCase().includes(q) || n.desc?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = ALL_EDGES.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map(e => ({ ...e })); // shallow copy so d3 can mutate
    return { nodes, links };
  }, [search, activeCategories]);

  // Build neighbour maps when graphData changes
  const { neighbourNodes, neighbourLinks } = useMemo(() => {
    const nn = {};
    const nl = {};
    graphData.nodes.forEach(n => { nn[n.id] = new Set(); });
    graphData.links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (!nn[s]) nn[s] = new Set();
      if (!nn[t]) nn[t] = new Set();
      nn[s].add(t); nn[t].add(s);
      nl[`${s}__${t}`] = true;
      nl[`${t}__${s}`] = true;
    });
    return { neighbourNodes: nn, neighbourLinks: nl };
  }, [graphData]);

  const updateHighlight = useCallback((node) => {
    if (!node) { setHighlightNodes(new Set()); setHighlightLinks(new Set()); return; }
    const nn = neighbourNodes[node.id] || new Set();
    setHighlightNodes(new Set([node.id, ...nn]));
    const hl = new Set();
    Object.keys(neighbourLinks).forEach(k => {
      if (k.startsWith(node.id + '__') || k.endsWith('__' + node.id)) hl.add(k);
    });
    setHighlightLinks(hl);
  }, [neighbourNodes, neighbourLinks]);

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node || null);
    updateHighlight(node || null);
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'default';
    }
  }, [updateHighlight]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    setShowInfo(true);
    // Pan + zoom to node
    fgRef.current?.centerAt(node.x, node.y, 600);
    fgRef.current?.zoom(3.5, 600);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setShowInfo(false);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  // ── Custom node renderer ───────────────────────────────────────────────────
  const paintNode = useCallback((node, ctx, globalScale) => {
    // Guard: node positions are NaN/undefined during first simulation ticks
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const r   = nodeRadius(node);
    const col = nodeColor(node);
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isSelected    = selectedNode?.id === node.id;
    const isHovered     = hoveredNode?.id  === node.id;
    const alpha = isHighlighted ? 1 : 0.18;

    ctx.globalAlpha = alpha;

    // Outer glow ring
    if (isSelected || isHovered) {
      const glowR = r + 5 + Math.sin(Date.now() / 350) * 2.5;
      const gradient = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, glowR + 6);
      const { r: cr, g: cg, b: cb } = hexToRgb(col);
      gradient.addColorStop(0, `rgba(${cr},${cg},${cb},0.55)`);
      gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowR + 6, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Main circle with radial gradient fill
    const { r: cr, g: cg, b: cb } = hexToRgb(col);
    const fill = ctx.createRadialGradient(
      node.x - r * 0.3, node.y - r * 0.3, r * 0.1,
      node.x, node.y, r
    );
    fill.addColorStop(0, `rgba(${cr},${cg},${cb}, 1)`);
    fill.addColorStop(0.6, `rgba(${cr * 0.7},${cg * 0.7},${cb * 0.7}, 1)`);
    fill.addColorStop(1, `rgba(${Math.max(cr - 40, 0)},${Math.max(cg - 40, 0)},${Math.max(cb - 40, 0)}, 1)`);

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = fill;
    ctx.fill();

    // Selection ring
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Label — always show for important or highlighted nodes
    const showLabel = isHighlighted && (globalScale > 1.4 || node.importance >= 4 || isSelected || isHovered);
    if (showLabel) {
      const fontSize = Math.max(8, Math.min(14, 12 / globalScale));
      ctx.font = `${isSelected || isHovered ? '700' : '500'} ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = node.label;
      const tw = ctx.measureText(label).width;
      const pad = 3 / globalScale;

      // Label background pill
      ctx.fillStyle = 'rgba(5,13,25,0.82)';
      ctx.beginPath();
      const bx = node.x - tw / 2 - pad;
      const by = node.y + r + 3 / globalScale - fontSize / 2 - pad;
      const bw = tw + pad * 2;
      const bh = fontSize + pad * 2;
      const br = 3 / globalScale;
      ctx.roundRect(bx, by, bw, bh, br);
      ctx.fill();

      ctx.fillStyle = isSelected || isHovered ? col : '#e2e8f0';
      ctx.fillText(label, node.x, node.y + r + 3 / globalScale + fontSize / 2);
    }

    ctx.globalAlpha = 1;
  }, [hoveredNode, selectedNode, highlightNodes]);

  // ── Custom link renderer ────────────────────────────────────────────────────
  const paintLink = useCallback((link, ctx) => {
    const s = link.source;
    const t = link.target;
    if (!Number.isFinite(s?.x) || !Number.isFinite(s?.y) ||
        !Number.isFinite(t?.x) || !Number.isFinite(t?.y)) return;
    const key1 = `${s.id}__${t.id}`;
    const key2 = `${t.id}__${s.id}`;
    const isActive = highlightLinks.size === 0 || highlightLinks.has(key1) || highlightLinks.has(key2);
    const sCat = GRAPH_CATEGORIES[s.category];
    const tCat = GRAPH_CATEGORIES[t.category];
    const sCol = sCat?.color || '#64748b';
    const tCol = tCat?.color || '#64748b';

    ctx.globalAlpha = isActive ? (highlightLinks.size > 0 ? 0.85 : 0.4) : 0.06;
    ctx.lineWidth   = isActive && highlightLinks.size > 0 ? 1.8 : 0.8;

    const grad = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
    grad.addColorStop(0, sCol);
    grad.addColorStop(1, tCol);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    ctx.strokeStyle = grad;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [highlightLinks]);

  // ── Category toggle ────────────────────────────────────────────────────────
  const toggleCategory = (cat) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); }
      else next.add(cat);
      return next;
    });
    setSelectedNode(null); setShowInfo(false);
  };

  const resetView = () => {
    fgRef.current?.zoomToFit(600, 40);
    setSelectedNode(null); setShowInfo(false);
    setHighlightNodes(new Set()); setHighlightLinks(new Set());
  };

  // Category counts
  const catCounts = useMemo(() => {
    const counts = {};
    ALL_NODES.forEach(n => { counts[n.category] = (counts[n.category] || 0) + 1; });
    return counts;
  }, []);

  // Degree of selected node connections
  const selectedConnections = useMemo(() => {
    if (!selectedNode) return [];
    return ALL_EDGES
      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
      .map(e => {
        const otherId = e.source === selectedNode.id ? e.target : e.source;
        const other   = ALL_NODES.find(n => n.id === otherId);
        return { node: other, label: e.label, dir: e.source === selectedNode.id ? 'out' : 'in' };
      })
      .filter(c => c.node);
  }, [selectedNode]);

  return (
    <div className="bkg-root">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bkg-header">
        <div className="bkg-header__left">
          <h2 className="bkg-title">
            <span className="bkg-title__cross">✛</span>
            Bible Knowledge Graph
          </h2>
          <p className="bkg-subtitle">
            {graphData.nodes.length} nodes · {graphData.links.length} connections · click a node to explore
          </p>
        </div>

        {/* Search */}
        <div className="bkg-search">
          <Search size={13} className="bkg-search__icon" />
          <input
            type="text"
            placeholder="Search people, events, places…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bkg-search__input"
          />
          {search && (
            <button type="button" className="bkg-search__clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Zoom controls */}
        <div className="bkg-zoom-btns">
          <button type="button" title="Zoom In"   onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.4, 300)}><ZoomIn size={14} /></button>
          <button type="button" title="Zoom Out"  onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.4, 300)}><ZoomOut size={14} /></button>
          <button type="button" title="Reset View" onClick={resetView}><RotateCcw size={14} /></button>
          <button type="button" title="Fit All"    onClick={() => fgRef.current?.zoomToFit(600, 40)}><Maximize2 size={14} /></button>
        </div>
      </div>

      {/* ── Category filter pills ─────────────────────────────────────────── */}
      <div className="bkg-cats">
        {Object.entries(GRAPH_CATEGORIES).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            className={`bkg-cat${activeCategories.has(key) ? ' active' : ''}`}
            style={{ '--cat-col': cfg.color }}
            onClick={() => toggleCategory(key)}
          >
            <span className="bkg-cat__dot" />
            {cfg.label}
            <span className="bkg-cat__count">{catCounts[key] || 0}</span>
          </button>
        ))}
        <button type="button" className="bkg-cat bkg-cat--all"
          onClick={() => setActiveCategories(new Set(Object.keys(GRAPH_CATEGORIES)))}>
          Show All
        </button>
      </div>

      {/* ── Graph canvas ──────────────────────────────────────────────────── */}
      <div className="bkg-canvas-wrap" ref={containerRef}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.w}
          height={dimensions.h}
          backgroundColor="#050d18"
          nodeRelSize={1}
          nodeVal={(n) => nodeRadius(n) ** 1.5}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          linkCanvasObject={paintLink}
          linkCanvasObjectMode={() => 'replace'}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          linkDirectionalParticles={(link) => {
            const s = typeof link.source === 'object' ? link.source.id : link.source;
            const t = typeof link.target === 'object' ? link.target.id : link.target;
            return (highlightLinks.has(`${s}__${t}`) || highlightLinks.has(`${t}__${s}`)) ? 3 : 0;
          }}
          linkDirectionalParticleSpeed={0.006}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={(link) => {
            const s = typeof link.source === 'object' ? link.source : ALL_NODES.find(n => n.id === link.source);
            return s ? nodeColor(s) : '#c9a84c';
          }}
          cooldownTicks={120}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 30)}
          d3AlphaDecay={0.025}
          d3VelocityDecay={0.4}
          enableNodeDrag
          enableZoomInteraction
          enablePanInteraction
        />

        {/* Hover tooltip */}
        {hoveredNode && !showInfo && (
          <div className="bkg-tooltip">
            <span className="bkg-tooltip__label" style={{ color: nodeColor(hoveredNode) }}>
              {hoveredNode.label}
            </span>
            <span className="bkg-tooltip__cat">{GRAPH_CATEGORIES[hoveredNode.category]?.label}</span>
            <span className="bkg-tooltip__deg">{DEGREES[hoveredNode.id] || 0} connections</span>
          </div>
        )}

        {/* Legend overlay */}
        <div className="bkg-legend">
          <p className="bkg-legend__title">Node size = importance</p>
          {Object.entries(GRAPH_CATEGORIES).map(([key, cfg]) => (
            <div key={key} className="bkg-legend__row">
              <span className="bkg-legend__dot" style={{ background: cfg.color }} />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Selected node detail panel ────────────────────────────────────── */}
      {showInfo && selectedNode && (
        <div className="bkg-info-panel">
          <div className="bkg-info-panel__header" style={{ borderLeftColor: nodeColor(selectedNode) }}>
            <div>
              <span className="bkg-info-cat" style={{ background: nodeColor(selectedNode) + '22', color: nodeColor(selectedNode) }}>
                {GRAPH_CATEGORIES[selectedNode.category]?.label}
              </span>
              <h3>{selectedNode.label}</h3>
              <p className="bkg-info-desc">{selectedNode.desc}</p>
            </div>
            <button type="button" className="bkg-info-close" onClick={() => { setShowInfo(false); setSelectedNode(null); }}>
              <X size={15} />
            </button>
          </div>

          <div className="bkg-info-connections">
            <h4><span>{selectedConnections.length}</span> Direct Connections</h4>
            <div className="bkg-connections-grid">
              {selectedConnections.map((c, i) => (
                <button
                  key={i} type="button"
                  className="bkg-conn-chip"
                  style={{ '--conn-col': nodeColor(c.node) }}
                  onClick={() => {
                    handleNodeClick(c.node);
                    const gNode = fgRef.current?.graphData().nodes.find(n => n.id === c.node.id);
                    if (gNode) { handleNodeClick(gNode); }
                  }}
                >
                  <span className="bkg-conn-dot" />
                  <span className="bkg-conn-name">{c.node.label}</span>
                  <span className="bkg-conn-rel">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
