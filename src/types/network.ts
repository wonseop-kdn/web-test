/**
 * Node-Breaker Network Data Model
 * ────────────────────────────────────────────────────────────
 * Reference: CIM (IEC 61970) Node-Breaker convention.
 *
 * Hierarchy:
 *   NetworkModel
 *     └─ Substations[]
 *         ├─ PhysicalNodes[]   (busbars + junctions inside bays)
 *         └─ Switches[]        (CB + DS that connect nodes)
 *     ├─ TransmissionLines[]   (electrical branches across substations)
 *     ├─ Generators[]          (attached to a physical node)
 *     └─ Loads[]               (attached to a physical node)
 *
 * The Topology Processor traverses (PhysicalNodes ⊕ closed Switches)
 * to produce a reduced Bus-Branch model used by the power flow solver.
 */

// ─── Enumerations ──────────────────────────────────────────────

export type NodeKind = 'BUSBAR' | 'JUNCTION';

/** CB = circuit breaker (load-break, fault-break) · DS = disconnector (no-load) */
export type SwitchKind = 'CB' | 'DS';

export type SwitchStatus = 'OPEN' | 'CLOSED';

export type GeneratorKind = 'SLACK' | 'PV' | 'PQ';

export type EquipmentKind = 'LINE' | 'GENERATOR' | 'LOAD';

// ─── Geometry hint for SLD rendering ───────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

// ─── Physical Node (inside a substation) ───────────────────────

export interface PhysicalNode {
  id: string;                  // unique within model, e.g. "SS1.BB1"
  substationId: string;
  kind: NodeKind;
  name: string;
  /** local position inside substation's SVG group, used by SLD renderer */
  position: Vec2;
}

// ─── Switch (CB or DS) connecting two physical nodes ───────────

export interface Switch {
  id: string;                  // e.g. "SS1.CB-L12"
  substationId: string;
  kind: SwitchKind;
  /** Current operational state (mutated by operator action). */
  status: SwitchStatus;
  /** Normal/reference state, used by restoration & color coding. */
  normalStatus: SwitchStatus;
  fromNode: string;            // PhysicalNode.id
  toNode: string;              // PhysicalNode.id
  name: string;
  /** local position inside the bay, used by SLD renderer */
  position: Vec2;
}

// ─── Substation (a switching station: nodes + switches) ────────

export interface Substation {
  id: string;                  // e.g. "SS1"
  name: string;                // human label, e.g. "S/S Alpha"
  /** Nominal voltage in kV (e.g. 345). */
  baseKV: number;
  /** Absolute position on the network SLD canvas. */
  position: Vec2;
  /** Layout size hint for the substation bounding box (SVG units). */
  size: { w: number; h: number };
  nodes: PhysicalNode[];
  switches: Switch[];
}

// ─── Transmission Line (π-model branch across substations) ─────

export interface TransmissionLine {
  id: string;                  // e.g. "L12"
  name: string;
  /** Physical node at the "from" terminal — typically the line-side bay node. */
  fromNode: string;
  toNode: string;
  /** Per-unit on system MVA base. */
  r: number;
  x: number;
  /** Total per-unit line charging susceptance (b/2 split each end). */
  b: number;
  /** Continuous MVA thermal rating (used for overload detection). */
  ratingMVA: number;
  /** Hard out-of-service flag (independent of switching state). */
  inService: boolean;
}

// ─── Generator (injection at a physical node) ──────────────────

export interface Generator {
  id: string;                  // e.g. "G1"
  name: string;
  /** PhysicalNode the generator is connected to. */
  connectionNode: string;
  kind: GeneratorKind;
  /** Scheduled active power (MW). */
  pMW: number;
  /** Scheduled reactive power (MVAr) — used for PQ; computed for PV/SLACK. */
  qMVAr: number;
  /** Voltage setpoint (per unit) — used for PV/SLACK. */
  vSetpoint: number;
  pMin: number;
  pMax: number;
  qMin: number;
  qMax: number;
  inService: boolean;
}

// ─── Load (consumption at a physical node) ─────────────────────

export interface Load {
  id: string;                  // e.g. "LD3"
  name: string;
  connectionNode: string;
  /** Constant-power load model (MW, MVAr). */
  pMW: number;
  qMVAr: number;
  inService: boolean;
}

// ─── Top-level Network Model ───────────────────────────────────

export interface NetworkModel {
  /** System apparent power base, typically 100 MVA. */
  systemMVA: number;
  /** System frequency (Hz). */
  systemFreq: number;
  /** Slack-bus reference angle (rad). Usually 0. */
  slackAngle: number;
  substations: Substation[];
  transmissionLines: TransmissionLine[];
  generators: Generator[];
  loads: Load[];
}

// ─── Bus-Branch (reduced) Model ─ produced by Topology Processor

export interface BusBranchNode {
  /** Synthetic bus id, e.g. "BUS_1" — one per connected node group. */
  id: string;
  /** Member physical-node ids that were merged into this bus. */
  members: string[];
  substationId: string;
  baseKV: number;
  /** Bus type for power flow. Determined from connected generators. */
  type: GeneratorKind;
  /** Net injected power (gen − load) in per unit, system base. */
  pInjectionPU: number;
  qInjectionPU: number;
  /** Voltage setpoint (PV/SLACK) in per unit. */
  vSetpointPU: number;
  /** True if this bus is electrically connected to the slack/source. */
  energized: boolean;
  /** Island id (0 = main, 1+ = isolated subsystems). */
  islandId: number;
}

export interface BusBranchEdge {
  id: string;                  // mirrors TransmissionLine.id when applicable
  fromBus: string;
  toBus: string;
  r: number;
  x: number;
  b: number;
  ratingMVA: number;
  /** Mapped from underlying TransmissionLine.id. */
  lineId: string;
}

export interface BusBranchModel {
  systemMVA: number;
  buses: BusBranchNode[];
  edges: BusBranchEdge[];
  /** Buses that ended up de-energized (no path to slack). */
  deenergizedBuses: string[];
  /** Lines that were dropped (both ends de-energized or one end disconnected). */
  outOfServiceLines: string[];
}

// ─── Power Flow Result ─────────────────────────────────────────

export interface PFBusResult {
  busId: string;
  /** Voltage magnitude (per unit). */
  vPU: number;
  /** Voltage angle (radians). */
  thetaRad: number;
  /** Net active injection (MW). */
  pMW: number;
  qMVAr: number;
}

export interface PFLineResult {
  lineId: string;
  fromBus: string;
  toBus: string;
  /** Active/reactive flow at the "from" end (MW, MVAr). */
  pFromMW: number;
  qFromMVAr: number;
  pToMW: number;
  qToMVAr: number;
  /** Apparent power at the worst end (MVA). */
  sMVA: number;
  /** Loading percentage (sMVA / ratingMVA × 100). */
  loadingPct: number;
}

export interface PFSolution {
  converged: boolean;
  iterations: number;
  maxMismatch: number;
  buses: PFBusResult[];
  lines: PFLineResult[];
  /** Total real losses (MW) across all in-service lines. */
  totalLossesMW: number;
}

// ─── Contingency Analysis Result ───────────────────────────────

export interface ContingencyViolation {
  kind: 'OVERLOAD' | 'UNDERVOLTAGE' | 'OVERVOLTAGE' | 'DIVERGENCE' | 'ISLAND';
  /** Affected element (line or bus). */
  elementId: string;
  /** Numeric severity, e.g. loading % or |V| deviation. */
  value: number;
  message: string;
}

export interface ContingencyCase {
  /** "L:L12" or "G:G2" — element removed for this N-1 scenario. */
  id: string;
  kind: 'LINE_OUTAGE' | 'GEN_OUTAGE';
  outagedElementId: string;
  converged: boolean;
  violations: ContingencyViolation[];
  /** Most severe loading observed (%) in the post-contingency state. */
  worstLoadingPct: number;
}

export interface ContingencyReport {
  baseConverged: boolean;
  cases: ContingencyCase[];
  generatedAt: string;         // ISO timestamp
}

// ─── Alarm / Event Log entry (for the right-side console panel) ─

export type AlarmSeverity = 'INFO' | 'WARN' | 'ALARM' | 'CRITICAL';

export interface AlarmEvent {
  id: string;
  timestamp: string;           // ISO
  severity: AlarmSeverity;
  source: 'SCADA' | 'TP' | 'PF' | 'CA' | 'OPERATOR';
  message: string;
}
