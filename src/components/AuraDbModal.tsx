import React, { useState, useMemo } from 'react';
import { Database, Terminal, Server, ShieldCheck, Play, Search, ArrowUpDown, X, CheckCircle2, Cpu, HardDrive } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface AuraDbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TableRow {
  [key: string]: string | number;
}

const VEHICLES_DATA: TableRow[] = [
  { id: 'V12-001', model: 'AURA SPECTRE V12', chassis: 'Carbon Monocoque CF-90', engine: '6.5L Twin-Turbo V12 + Quad E-Motors', power_hp: 1450, torque_nm: 1600, top_speed_kmh: 420, aero_downforce_kg: 1200, status: 'PROTOTYPE_ONLINE' },
  { id: 'V12-002', model: 'AURA SPECTRE GT-R', chassis: 'Carbon-Titanium Hybrid Tub', engine: '6.5L High-Rev V12 (10,500 RPM)', power_hp: 1520, torque_nm: 1650, top_speed_kmh: 435, aero_downforce_kg: 1550, status: 'WIND_TUNNEL_TEST' },
  { id: 'V12-003', model: 'AURA SPECTRE LE MANS', chassis: 'FIA Homologated Tub', engine: 'Hybrid Twin-Turbo V12 Kinetic', power_hp: 1480, torque_nm: 1580, top_speed_kmh: 415, aero_downforce_kg: 1800, status: 'DYNO_CERTIFIED' },
  { id: 'V12-004', model: 'AURA SPECTRE SPIDER', chassis: 'Reinforced Open-Aero Monocoque', engine: '6.5L Twin-Turbo V12 Hybrid', power_hp: 1450, torque_nm: 1600, top_speed_kmh: 410, aero_downforce_kg: 1100, status: 'ATELIER_QUEUED' },
];

const ATELIER_ORDERS: TableRow[] = [
  { order_id: 'ORD-9842', client: 'Monaco Private Reserve', vin: 'AURA883901X1', paint: 'Noir Obsidian / 24K Flake', wheels: 'Forged Titanium Turbine', calipers: 'Electric Cyan', price_usd: '$4,120,000', status: 'IN_PRODUCTION' },
  { order_id: 'ORD-9843', client: 'Zurich Atelier Collection', vin: 'AURA883902X2', paint: 'Liquid Aurum Gold', wheels: 'Liquid Gold Centerlock', calipers: 'Rosso Corsa Red', price_usd: '$4,350,000', status: 'PAINT_BOOTH' },
  { order_id: 'ORD-9844', client: 'Silicon Valley Engineering Lab', vin: 'AURA883903X3', paint: 'Electric Cyber Cyan', wheels: 'Carbon Fiber Lightweight', calipers: 'Electric Cyan', price_usd: '$3,980,000', status: 'MONOCOQUE_CURE' },
  { order_id: 'ORD-9845', client: 'Tokyo Hypercar Vault', vin: 'AURA883904X4', paint: 'Rosso Competizione Metallic', wheels: 'Satin Obsidian Dark', calipers: 'Liquid Aurum Gold', price_usd: '$4,050,000', status: 'WIND_TUNNEL_AUDIT' },
  { order_id: 'ORD-9846', client: 'London Mayfair Concours', vin: 'AURA883905X5', paint: 'Bianco Pearl Satin', wheels: 'Forged Titanium Turbine', calipers: 'Stealth Noir Black', price_usd: '$3,890,000', status: 'FINAL_INSPECTION' },
];

const TELEMETRY_LOGS: TableRow[] = [
  { log_id: 10482, timestamp: '14:22:01.402', rpm: 9850, speed_kmh: 312.4, g_force_lat: 1.84, boost_bar: 2.38, battery_soc_pct: 94.2, wing_angle_deg: 15, status: 'OPTIMAL' },
  { log_id: 10483, timestamp: '14:22:01.902', rpm: 10200, speed_kmh: 326.8, g_force_lat: 2.05, boost_bar: 2.45, battery_soc_pct: 93.8, wing_angle_deg: 15, status: 'OPTIMAL' },
  { log_id: 10484, timestamp: '14:22:02.402', rpm: 10450, speed_kmh: 341.1, g_force_lat: 1.62, boost_bar: 2.50, battery_soc_pct: 93.1, wing_angle_deg: 15, status: 'PEAK_BOOST' },
  { log_id: 10485, timestamp: '14:22:02.902', rpm: 7200, speed_kmh: 298.5, g_force_lat: -2.35, boost_bar: 0.40, battery_soc_pct: 96.5, wing_angle_deg: 45, status: 'AIRBRAKE_REGEN' },
  { log_id: 10486, timestamp: '14:22:03.402', rpm: 6800, speed_kmh: 245.0, g_force_lat: 2.45, boost_bar: 0.20, battery_soc_pct: 98.1, wing_angle_deg: 45, status: 'CORNERING' },
];

const CLUSTER_NODES: TableRow[] = [
  { node_id: 'db-node-primary-01', role: 'PRIMARY_WRITER', region: 'us-east (Virginia)', memory_gb: 128, connections: '18 / 100', latency_ms: 2.4, replication_lag_ms: 0, tls: 'TLS 1.3 AES_256' },
  { node_id: 'db-node-replica-02', role: 'READ_REPLICA_HOT', region: 'eu-west (Frankfurt)', memory_gb: 64, connections: '12 / 100', latency_ms: 18.2, replication_lag_ms: 4, tls: 'TLS 1.3 AES_256' },
  { node_id: 'db-node-replica-03', role: 'READ_REPLICA_HOT', region: 'ap-east (Tokyo)', memory_gb: 64, connections: '9 / 100', latency_ms: 64.0, replication_lag_ms: 6, tls: 'TLS 1.3 AES_256' },
  { node_id: 'db-node-analytics-04', role: 'OLAP_TELEMETRY', region: 'us-west (Oregon)', memory_gb: 256, connections: '34 / 200', latency_ms: 12.1, replication_lag_ms: 12, tls: 'TLS 1.3 AES_256' },
];

export const AuraDbModal: React.FC<AuraDbModalProps> = ({ isOpen, onClose }) => {
  const [activeTable, setActiveTable] = useState<'vehicles' | 'orders' | 'telemetry' | 'nodes'>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [customSql, setCustomSql] = useState('SELECT * FROM vehicles WHERE status = \'PROTOTYPE_ONLINE\';');
  const [executionLog, setExecutionLog] = useState<{ query: string; durationMs: number; rows: number; time: string } | null>({
    query: 'SELECT * FROM vehicles;',
    durationMs: 4.8,
    rows: 4,
    time: new Date().toLocaleTimeString(),
  });

  // Active raw data
  const rawData = useMemo(() => {
    switch (activeTable) {
      case 'vehicles': return VEHICLES_DATA;
      case 'orders': return ATELIER_ORDERS;
      case 'telemetry': return TELEMETRY_LOGS;
      case 'nodes': return CLUSTER_NODES;
    }
  }, [activeTable]);

  // Filter and sort
  const tableData = useMemo(() => {
    let result = [...rawData];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(q))
      );
    }
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }
    return result;
  }, [rawData, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    engineSound.playClickBeep();
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const executeSql = (query: string) => {
    engineSound.playActivationChime();
    const duration = +(Math.random() * 3 + 2).toFixed(2);
    setExecutionLog({
      query,
      durationMs: duration,
      rows: tableData.length,
      time: new Date().toLocaleTimeString(),
    });
  };

  const columns = rawData.length > 0 ? Object.keys(rawData[0]) : [];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auradb-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden text-neutral-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-neutral-900/90 to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="auradb-modal-title" className="text-base font-rajdhani font-bold tracking-wider text-white uppercase">
                  AuraDB Enterprise Cluster
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono-tech uppercase">
                  PostgreSQL 16.4 Engine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-tech uppercase">
                  SIMULATION
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono-tech mt-0.5">
                Node: db-primary-01 • TLS 1.3 Active • Connection Pool 18/100 • 99.999% SLA
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              engineSound.playClickBeep();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
            title="Close AuraDB Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cluster Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/80 font-mono-tech text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-neutral-500 block">CLUSTER HEALTH</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ONLINE (4 NODES)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-neutral-500 block">CONNECTION POOL</span>
              <span className="text-cyan-300 font-semibold">18 Active / 82 Idle</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-neutral-500 block">BUFFER CACHE HIT</span>
              <span className="text-amber-300 font-semibold">99.82% (High Speed)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-[10px] text-neutral-500 block">ENCRYPTION</span>
              <span className="text-purple-300 font-semibold">AES-256-GCM / TLS 1.3</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* SQL Query Console Box */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech text-neutral-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" /> INTERACTIVE SQL QUERY CONSOLE
              </span>
              <span className="text-[10px] text-neutral-500">Query Planner: Cost=0.00..12.50</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                placeholder="Enter SQL Query (e.g. SELECT * FROM vehicles;)"
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-lg text-xs font-mono-tech text-cyan-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={() => executeSql(customSql)}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-rajdhani font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute SQL</span>
              </button>
            </div>

            {/* Quick Query Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-mono-tech text-neutral-500 mr-1 self-center">Presets:</span>
              {[
                { label: 'Vehicles', query: 'SELECT * FROM vehicles WHERE status = \'PROTOTYPE_ONLINE\';', table: 'vehicles' as const },
                { label: 'Orders', query: 'SELECT * FROM atelier_orders ORDER BY price_usd DESC;', table: 'orders' as const },
                { label: 'Telemetry', query: 'SELECT * FROM telemetry_logs ORDER BY rpm DESC LIMIT 5;', table: 'telemetry' as const },
                { label: 'Cluster Nodes', query: 'SELECT * FROM cluster_nodes WHERE role LIKE \'%REPLICA%\';', table: 'nodes' as const },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setCustomSql(p.query);
                    setActiveTable(p.table);
                    executeSql(p.query);
                  }}
                  className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Execution Result Log */}
            {executionLog && (
              <div className="text-[11px] font-mono-tech bg-neutral-950/80 border border-neutral-800 p-2 rounded text-neutral-400 flex items-center justify-between">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> QUERY EXECUTED IN {executionLog.durationMs}ms
                </span>
                <span>{executionLog.rows} rows returned</span>
                <span className="text-neutral-500">{executionLog.time}</span>
              </div>
            )}
          </div>

          {/* Database Inspector Table Section */}
          <div className="space-y-3">
            {/* Table Selectors and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {[
                  { key: 'vehicles', label: 'vehicles (4)' },
                  { key: 'orders', label: 'atelier_orders (5)' },
                  { key: 'telemetry', label: 'telemetry_logs (5)' },
                  { key: 'nodes', label: 'cluster_nodes (4)' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      engineSound.playClickBeep();
                      setActiveTable(tab.key as typeof activeTable);
                      setSortField('');
                    }}
                    className={`px-3 py-1 text-xs font-mono-tech rounded-lg transition-colors cursor-pointer ${
                      activeTable === tab.key
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Live Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter rows..."
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono-tech text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Table Display */}
            <div className="border border-neutral-800 rounded-xl overflow-x-auto bg-neutral-950">
              <table className="w-full text-left text-xs font-mono-tech divide-y divide-neutral-800/80">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 py-2.5 cursor-pointer hover:text-white transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.replace(/_/g, ' ')}</span>
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2.5 whitespace-nowrap text-neutral-300">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {tableData.length === 0 && (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-6 text-center text-neutral-500 font-mono-tech">
                        No rows found matching &quot;{searchQuery}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500">
          <span>Enterprise Cluster Simulation — Aura Motors Capstone Architecture</span>
          <span className="text-cyan-400">PostgreSQL Protocol v3.0 Compatible</span>
        </div>
      </div>
    </div>
  );
};
