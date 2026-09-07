"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { AssetClass, GraphData, GraphNode } from "@/lib/graph-data";

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode>;

const ASSET_COLOR: Record<AssetClass, string> = {
  equity: "#60a5fa",
  mutualFunds: "#c084fc",
  debt: "#2dd4bf",
  reits: "#fb923c",
  alts: "#fb7185",
};

const RM_COLOR = "#f59e0b";
const CLIENT_COLOR = "#38bdf8";
const FLAG_COLOR = "#f87171";
const LINK_COLOR = "rgba(255,255,255,0.14)";
const LABEL_COLOR = "rgba(255,255,255,0.82)";
const SUBLABEL_COLOR = "rgba(255,255,255,0.4)";

export type GraphFilter = "All" | AssetClass | "Alerts Only";

export interface NetworkGraphHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

interface NetworkGraphProps {
  data: GraphData;
  filter: GraphFilter;
  searchQuery: string;
}

function nodeColor(node: SimNode): string {
  if (node.type === "rm") return RM_COLOR;
  if (node.type === "client") return CLIENT_COLOR;
  return node.assetClass ? ASSET_COLOR[node.assetClass] : "#94a3b8";
}

function nodeOpacity(
  node: SimNode,
  filter: GraphFilter,
  query: string
): number {
  if (query.trim()) {
    return node.label.toLowerCase().includes(query.trim().toLowerCase()) ||
      node.sublabel?.toLowerCase().includes(query.trim().toLowerCase())
      ? 1
      : 0.15;
  }
  if (filter === "All") return 1;
  if (filter === "Alerts Only") {
    return node.type === "rm" || node.flagged ? 1 : 0.15;
  }
  if (node.type === "rm" || node.type === "client") return 1;
  return node.assetClass === filter ? 1 : 0.15;
}

export const NetworkGraph = forwardRef<NetworkGraphHandle, NetworkGraphProps>(
  function NetworkGraph({ data, filter, searchQuery }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<SimNode[]>([]);
    const linksRef = useRef<SimLink[]>([]);
    const transformRef = useRef({ scale: 0.85, x: 0, y: 0 });
    const filterRef = useRef<GraphFilter>(filter);
    const queryRef = useRef(searchQuery);
    const sizeRef = useRef({ width: 0, height: 0 });
    const dragRef = useRef<{
      dragging: boolean;
      node: SimNode | null;
      lastX: number;
      lastY: number;
    }>({ dragging: false, node: null, lastX: 0, lastY: 0 });

    useEffect(() => {
      filterRef.current = filter;
      draw();
    }, [filter]);

    useEffect(() => {
      queryRef.current = searchQuery;
      draw();
    }, [searchQuery]);

    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const { scale, x: panX, y: panY } = transformRef.current;
      const cx = width / 2 + panX;
      const cy = height / 2 + panY;

      const toScreen = (nx: number, ny: number) => ({
        x: cx + nx * scale,
        y: cy + ny * scale,
      });

      ctx.lineWidth = 1;
      for (const link of linksRef.current) {
        const source = link.source as SimNode;
        const target = link.target as SimNode;
        if (source.x == null || target.x == null) continue;
        const a = toScreen(source.x, source.y ?? 0);
        const b = toScreen(target.x, target.y ?? 0);
        ctx.strokeStyle = LINK_COLOR;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const node of nodesRef.current) {
        if (node.x == null || node.y == null) continue;
        const { x, y } = toScreen(node.x, node.y);
        const r = node.value * scale;
        const opacity = nodeOpacity(node, filterRef.current, queryRef.current);

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor(node);
        ctx.fill();

        if (node.flagged) {
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = FLAG_COLOR;
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (node.type === "rm" || node.type === "client") {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.stroke();
        }

        if (node.type === "rm" || node.type === "client") {
          ctx.fillStyle = "#0c0a12";
          ctx.font = `600 ${Math.max(9, 10 * scale)}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label, x, y);

          ctx.fillStyle = LABEL_COLOR;
          ctx.font = `600 ${Math.max(9, 11 * scale)}px system-ui, sans-serif`;
          ctx.fillText(node.sublabel ?? "", x, y + r + 12 * scale);
        } else if (scale > 0.45) {
          ctx.fillStyle = SUBLABEL_COLOR;
          ctx.font = `${Math.max(8, 10 * scale)}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(node.label, x, y + r + 3 * scale);
        }
        ctx.globalAlpha = 1;
      }
    }

    function fitToView() {
      const nodes = nodesRef.current;
      const { width, height } = sizeRef.current;
      if (!nodes.length || !width || !height) return;

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        minX = Math.min(minX, n.x - n.value);
        maxX = Math.max(maxX, n.x + n.value);
        minY = Math.min(minY, n.y - n.value);
        maxY = Math.max(maxY, n.y + n.value);
      }
      if (!Number.isFinite(minX)) return;

      const padding = 56;
      const scale = Math.min(
        1.2,
        (width - padding * 2) / (maxX - minX),
        (height - padding * 2) / (maxY - minY)
      );
      transformRef.current = {
        scale,
        x: -((minX + maxX) / 2) * scale,
        y: -((minY + maxY) / 2) * scale,
      };
      draw();
    }

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        transformRef.current.scale = Math.min(2.5, transformRef.current.scale * 1.25);
        draw();
      },
      zoomOut: () => {
        transformRef.current.scale = Math.max(0.35, transformRef.current.scale / 1.25);
        draw();
      },
      reset: fitToView,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
      const links: SimLink[] = data.links.map((l) => ({ ...l }));
      nodesRef.current = nodes;
      linksRef.current = links;

      const simulation = forceSimulation(nodes)
        .force(
          "link",
          forceLink<SimNode, SimLink>(links)
            .id((d) => d.id)
            .distance((l) => {
              const s = l.source as SimNode;
              const t = l.target as SimNode;
              if (s.type === "rm" || t.type === "rm") return 130;
              if (s.type === "client" || t.type === "client") return 70;
              return 40;
            })
            .strength(0.7)
        )
        .force("charge", forceManyBody().strength(-260))
        .force("center", forceCenter(0, 0))
        .force("x", forceX(0))
        .force("y", forceY(0))
        .force(
          "collide",
          forceCollide<SimNode>().radius((d) => d.value + 14)
        )
        .on("tick", draw);

      // Squash the layout along the container's longer axis so the graph
      // fills a wide desktop panel and a narrow mobile one equally well.
      let isWide: boolean | null = null;
      const runLayout = () => {
        const { width, height } = sizeRef.current;
        const wide = width >= height;
        isWide = wide;
        simulation.force("x", forceX(0).strength(wide ? 0.015 : 0.14));
        simulation.force("y", forceY(0).strength(wide ? 0.14 : 0.015));
        simulation.alpha(1).stop();
        simulation.tick(320);
        fitToView();
      };

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        sizeRef.current = { width: rect.width, height: rect.height };
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        if (isWide === null || isWide !== rect.width >= rect.height) {
          runLayout();
        } else {
          fitToView();
        }
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      const getPos = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      const findNodeAt = (screenX: number, screenY: number) => {
        const { scale, x: panX, y: panY } = transformRef.current;
        const { width, height } = sizeRef.current;
        const cx = width / 2 + panX;
        const cy = height / 2 + panY;
        for (let i = nodesRef.current.length - 1; i >= 0; i--) {
          const n = nodesRef.current[i];
          if (n.x == null || n.y == null) continue;
          const sx = cx + n.x * scale;
          const sy = cy + n.y * scale;
          const r = n.value * scale;
          if ((screenX - sx) ** 2 + (screenY - sy) ** 2 <= r * r) return n;
        }
        return null;
      };

      const onPointerDown = (e: PointerEvent) => {
        const pos = getPos(e);
        const node = findNodeAt(pos.x, pos.y);
        dragRef.current = { dragging: true, node, lastX: pos.x, lastY: pos.y };
        if (node) {
          node.fx = node.x;
          node.fy = node.y;
        }
        canvas.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!dragRef.current.dragging) return;
        const pos = getPos(e);
        const dx = pos.x - dragRef.current.lastX;
        const dy = pos.y - dragRef.current.lastY;
        dragRef.current.lastX = pos.x;
        dragRef.current.lastY = pos.y;

        const { node } = dragRef.current;
        const { scale } = transformRef.current;
        if (node) {
          node.fx = (node.fx ?? 0) + dx / scale;
          node.fy = (node.fy ?? 0) + dy / scale;
          simulation.alpha(0.3).restart();
        } else {
          transformRef.current.x += dx;
          transformRef.current.y += dy;
          draw();
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        const { node } = dragRef.current;
        if (node) {
          node.fx = null;
          node.fy = null;
        }
        dragRef.current.dragging = false;
        dragRef.current.node = null;
        canvas.releasePointerCapture(e.pointerId);
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        transformRef.current.scale = Math.min(
          2.5,
          Math.max(0.35, transformRef.current.scale * delta)
        );
        draw();
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointerleave", onPointerUp);
      canvas.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        simulation.stop();
        ro.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointerleave", onPointerUp);
        canvas.removeEventListener("wheel", onWheel);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
      <div ref={containerRef} className="h-full w-full">
        <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);
