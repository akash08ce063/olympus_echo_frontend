"use client"

import { useState, useMemo } from "react"

export type Platform = "pranthora" | "olympus"

// Service pipeline per platform — different events and services
const PRANTHORA_PIPELINE = [
  { id: "incoming_call", label: "Incoming Call", icon: "📞", color: "#3b82f6" },
  { id: "config_fetch", label: "Config Fetch", icon: "⚙️", color: "#8b5cf6" },
  { id: "stt", label: "STT", icon: "🎙️", color: "#06b6d4" },
  { id: "llm", label: "LLM", icon: "🧠", color: "#f59e0b" },
  { id: "tts", label: "TTS", icon: "🔊", color: "#10b981" },
  { id: "stream", label: "Stream / Twilio", icon: "📡", color: "#ef4444" },
]

const OLYMPUS_PIPELINE = [
  { id: "test_run", label: "Test Run", icon: "🧪", color: "#3b82f6" },
  { id: "test_execution", label: "Test Execution", icon: "▶️", color: "#8b5cf6" },
  { id: "conversation", label: "Conversation", icon: "💬", color: "#06b6d4" },
  { id: "evaluation", label: "Evaluation", icon: "📊", color: "#f59e0b" },
  { id: "transcript_fetch", label: "Transcript Fetch", icon: "📄", color: "#10b981" },
  { id: "api", label: "API / Routes", icon: "🔌", color: "#ef4444" },
]

function classifyLogPranthora(log: { message?: string; tag?: string | null }): string | null {
  const msg = (log.message || "").toLowerCase()
  const tag = (log.tag || "").toLowerCase()
  if (tag.includes("incoming_call") || msg.includes("incoming call") || msg.includes("custom request id"))
    return "incoming_call"
  if (msg.includes("agent configuration") || msg.includes("session config"))
    return "config_fetch"
  if (tag.includes("assemblyai") || msg.includes("assemblyai") || msg.includes("speech to text") || tag.includes("stt"))
    return "stt"
  if (msg.includes("llm") || tag.includes("llm"))
    return "llm"
  if (msg.includes("tts") || msg.includes("elevenlabs") || msg.includes("voice_name") || tag.includes("tts"))
    return "tts"
  if (
    msg.includes("stream") ||
    msg.includes("twilio") ||
    msg.includes("websocket") ||
    tag.includes("web_socket") ||
    tag.includes("realtime_voice") ||
    tag.includes("connection_retry") ||
    tag.includes("first_response")
  )
    return "stream"
  return null
}

function classifyLogOlympus(log: { message?: string; tag?: string | null }): string | null {
  const msg = (log.message || "").toLowerCase()
  const tag = (log.tag || "").toLowerCase()
  if (msg.includes("test run") || msg.includes("created test run") || msg.includes("starting test"))
    return "test_run"
  if (
    msg.includes("test case") ||
    msg.includes("test_execution") ||
    msg.includes("executing test") ||
    msg.includes("conversation completed") ||
    msg.includes("concurrent call")
  )
    return "test_execution"
  if (msg.includes("conversation") || msg.includes("simulat") || msg.includes("timeout"))
    return "conversation"
  if (msg.includes("evaluation") || msg.includes("evaluate") || msg.includes("criteria") || msg.includes("score"))
    return "evaluation"
  if (
    msg.includes("transcript") ||
    msg.includes("call logs") ||
    msg.includes("fetch") ||
    msg.includes("pranthora") ||
    msg.includes("result_id")
  )
    return "transcript_fetch"
  if (msg.includes("rpc") || msg.includes("list test runs") || msg.includes("call-logs") || tag.includes("routes"))
    return "api"
  return null
}

function parseLogs(raw: string): Array<Record<string, unknown> & { _idx: number }> {
  return raw
    .trim()
    .split("\n")
    .map((line, i) => {
      try {
        return { ...JSON.parse(line), _idx: i } as Record<string, unknown> & { _idx: number }
      } catch {
        return null
      }
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
}

function logContainsRequestId(log: Record<string, unknown>, rid: string): boolean {
  return Object.values(log).some((v) => v != null && String(v).includes(rid))
}

function buildRequestMap(logs: Array<Record<string, unknown>>): {
  byRequest: Record<string, Array<Record<string, unknown>>>
  nullRequestLogs: Array<Record<string, unknown>>
} {
  const byRequest: Record<string, Array<Record<string, unknown>>> = {}
  const nullRequestLogs: Array<Record<string, unknown>> = []
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

  logs.forEach((log) => {
    const rid = log.request_id as string | undefined
    if (rid && !byRequest[rid]) byRequest[rid] = []
    const matches = (String(log.message ?? "")).match(uuidPattern) || []
    matches.forEach((id: string) => {
      if (!byRequest[id]) byRequest[id] = []
    })
  })

  logs.forEach((log) => {
    let assigned = false
    Object.keys(byRequest).forEach((rid) => {
      if (logContainsRequestId(log, rid)) {
        byRequest[rid].push(log)
        assigned = true
      }
    })
    if (!assigned) nullRequestLogs.push(log)
  })

  Object.keys(byRequest).forEach((rid) => {
    byRequest[rid].sort((a, b) =>
      String(a.timestamp || "").localeCompare(String(b.timestamp || ""))
    )
  })

  return { byRequest, nullRequestLogs }
}

const LEVEL_COLORS: Record<string, string> = {
  INFO: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
}
const SHORT_ID = (id: string | null | undefined) => (id ? id.slice(0, 8) + "…" : "—")

export default function RequestTracer() {
  const [platform, setPlatform] = useState<Platform>("pranthora")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [logFilter, setLogFilter] = useState("all")
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(true)
  const [customLogs, setCustomLogs] = useState("")

  const pipeline = platform === "pranthora" ? PRANTHORA_PIPELINE : OLYMPUS_PIPELINE
  const classifyLog = platform === "pranthora" ? classifyLogPranthora : classifyLogOlympus

  const logs = useMemo(() => parseLogs(customLogs || ""), [customLogs])
  const { byRequest, nullRequestLogs } = useMemo(() => buildRequestMap(logs), [logs])
  const requestIds = Object.keys(byRequest)

  function getServicePresence(rid: string) {
    const presence: Record<string, Array<Record<string, unknown>>> = {}
    pipeline.forEach((s) => {
      presence[s.id] = []
    })
    ;(byRequest[rid] || []).forEach((log) => {
      const svc = classifyLog(log as { message?: string; tag?: string | null })
      if (svc) presence[svc].push(log)
    })
    return presence
  }

  const activeReq = selectedRequest || requestIds[0] || null
  const presence = activeReq ? getServicePresence(activeReq) : null
  const filteredLogsForRequest = activeReq
    ? (byRequest[activeReq] || []).filter(
        (l) => logFilter === "all" || (l.level as string) === logFilter
      )
    : []

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid #1e293b",
          background: "linear-gradient(90deg, #0f172a 0%, #0a0a1a 100%)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 24 }}>🔬</div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#f1f5f9",
            }}
          >
            REQUEST TRACER
          </div>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em" }}>
            {platform.toUpperCase()} · SERVICE FLOW · {requestIds.length} REQUEST{requestIds.length !== 1 ? "S" : ""}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#e2e8f0",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="pranthora">Pranthora</option>
            <option value="olympus">Olympus</option>
          </select>
          <button
            onClick={() => setShowLogs(!showLogs)}
            style={{
              background: showLogs ? "#1e40af" : "#1e293b",
              border: "1px solid #334155",
              color: "#94a3b8",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 11,
              letterSpacing: "0.05em",
            }}
          >
            {showLogs ? "HIDE LOGS" : "PASTE LOGS"}
          </button>
        </div>
      </div>

      {showLogs && (
        <div
          style={{
            padding: "16px 32px",
            background: "#0f172a",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <textarea
            rows={6}
            placeholder="Paste your JSON logs here (one JSON object per line). Use pranthora_YYYYMMDD.log or olympus_YYYYMMDD.log."
            value={customLogs}
            onChange={(e) => setCustomLogs(e.target.value)}
            style={{
              width: "100%",
              background: "#020617",
              border: "1px solid #334155",
              color: "#94a3b8",
              padding: 12,
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setShowLogs(false)
                setSelectedRequest(null)
              }}
              style={{
                background: "#1d4ed8",
                border: "none",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              LOAD LOGS
            </button>
            <button
              onClick={() => {
                setCustomLogs("")
                setShowLogs(false)
                setSelectedRequest(null)
              }}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                color: "#94a3b8",
                padding: "6px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              CLEAR
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            width: 260,
            borderRight: "1px solid #1e293b",
            overflowY: "auto",
            background: "#080810",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              fontSize: 10,
              color: "#475569",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #1e293b",
            }}
          >
            REQUESTS ({platform})
          </div>
          {requestIds.length === 0 ? (
            <div style={{ padding: 16, fontSize: 11, color: "#64748b" }}>
              Paste JSON logs above and click Load Logs.
            </div>
          ) : (
            requestIds.map((rid) => {
              const pres = getServicePresence(rid)
              const svcCount = pipeline.filter((s) => pres[s.id].length > 0).length
              const hasError = (byRequest[rid] || []).some((l) => (l.level as string) === "ERROR")
              const isActive = rid === activeReq
              return (
                <div
                  key={rid}
                  onClick={() => setSelectedRequest(rid)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #0f172a",
                    background: isActive ? "#0f172a" : "transparent",
                    borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: hasError ? "#ef4444" : "#22c55e",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 11,
                        color: isActive ? "#f1f5f9" : "#94a3b8",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {SHORT_ID(rid)}
                    </div>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 10, color: "#475569" }}>
                    {svcCount}/{pipeline.length} services · {(byRequest[rid] || []).length} logs
                  </div>
                  <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                    {pipeline.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          width: 20,
                          height: 4,
                          borderRadius: 2,
                          background: pres[s.id].length > 0 ? s.color : "#1e293b",
                          opacity: pres[s.id].length > 0 ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
          {nullRequestLogs.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #1e293b" }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em" }}>
                UNTRACKED LOGS: {nullRequestLogs.length}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>(no request_id)</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {!activeReq && requestIds.length === 0 && (
            <div style={{ color: "#64748b", fontSize: 13 }}>
              Select a platform, paste logs from <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>pranthora_*.log</code> or{" "}
              <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>olympus_*.log</code>, then click Load Logs.
            </div>
          )}
          {activeReq && presence && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em" }}>
                  TRACING REQUEST
                </div>
                <div style={{ fontSize: 16, color: "#f1f5f9", fontWeight: 700, marginTop: 4 }}>
                  {activeReq}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                  {(byRequest[activeReq] || []).length} log entries ·{" "}
                  {(byRequest[activeReq] || []).filter((l) => (l.level as string) === "ERROR").length} errors ·{" "}
                  {(byRequest[activeReq] || []).filter((l) => (l.level as string) === "WARNING").length} warnings
                </div>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#475569",
                    letterSpacing: "0.1em",
                    marginBottom: 20,
                  }}
                >
                  SERVICE FLOW — {platform}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    overflowX: "auto",
                    paddingBottom: 8,
                  }}
                >
                  {pipeline.map((svc, i) => {
                    const logList = presence[svc.id]
                    const hit = logList.length > 0
                    const hasErr = logList.some((l) => (l.level as string) === "ERROR")
                    const hasWarn = logList.some((l) => (l.level as string) === "WARNING")
                    const statusColor = hasErr ? "#ef4444" : hasWarn ? "#f59e0b" : hit ? svc.color : "#1e293b"
                    const nextHit =
                      i < pipeline.length - 1 && presence[pipeline[i + 1].id].length > 0
                    const arrowActive = hit && nextHit
                    return (
                      <div key={svc.id} style={{ display: "flex", alignItems: "center" }}>
                        <div
                          onMouseEnter={() => setHoveredService(svc.id)}
                          onMouseLeave={() => setHoveredService(null)}
                          style={{
                            width: 110,
                            padding: "14px 12px",
                            borderRadius: 10,
                            border: `2px solid ${hit ? statusColor : "#1e293b"}`,
                            background: hit ? `${statusColor}15` : "#070710",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: hit ? `0 0 20px ${statusColor}30` : "none",
                            position: "relative",
                            transform: hoveredService === svc.id ? "translateY(-2px)" : "none",
                          }}
                        >
                          <div style={{ fontSize: 22, textAlign: "center" }}>{svc.icon}</div>
                          <div
                            style={{
                              fontSize: 10,
                              textAlign: "center",
                              color: hit ? "#f1f5f9" : "#334155",
                              fontWeight: 700,
                              marginTop: 6,
                              lineHeight: 1.3,
                            }}
                          >
                            {svc.label}
                          </div>
                          <div
                            style={{
                              fontSize: 9,
                              textAlign: "center",
                              color: hit ? statusColor : "#334155",
                              marginTop: 4,
                            }}
                          >
                            {hit ? `${logList.length} log${logList.length > 1 ? "s" : ""}` : "NO ACTIVITY"}
                          </div>
                          {hit && (
                            <div
                              style={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: statusColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#000",
                              }}
                            >
                              {hasErr ? "!" : hasWarn ? "⚠" : "✓"}
                            </div>
                          )}
                        </div>
                        {i < pipeline.length - 1 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: 48,
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                height: 2,
                                flex: 1,
                                background: arrowActive
                                  ? `linear-gradient(90deg, ${pipeline[i].color}, ${pipeline[i + 1].color})`
                                  : "#1e293b",
                                transition: "background 0.3s",
                              }}
                            />
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "5px solid transparent",
                                borderBottom: "5px solid transparent",
                                borderLeft: `8px solid ${arrowActive ? pipeline[i + 1].color : "#1e293b"}`,
                                transition: "border-color 0.3s",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 20,
                    fontSize: 10,
                    color: "#475569",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#22c55e",
                      }}
                    />
                    <span>REACHED + OK</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#f59e0b",
                      }}
                    />
                    <span>WARNING</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#ef4444",
                      }}
                    />
                    <span>ERROR</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#1e293b",
                      }}
                    />
                    <span>NOT REACHED</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#475569",
                      letterSpacing: "0.1em",
                    }}
                  >
                    LOG TIMELINE
                  </div>
                  {["all", "INFO", "WARNING", "ERROR"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      style={{
                        background: logFilter === f ? "#1e40af" : "#1e293b",
                        border: "none",
                        color: logFilter === f ? "#fff" : "#64748b",
                        padding: "3px 10px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 10,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  {filteredLogsForRequest.map((log, i) => {
                    const svc = classifyLog(log as { message?: string; tag?: string | null })
                    const svcInfo = svc ? pipeline.find((s) => s.id === svc) : null
                    const matchedViaField = (log.request_id as string) === activeReq
                    const matchedViaMessage = !matchedViaField
                    const logLevel = (log.level as string) || ""
                    const logTimestamp = String(log.timestamp || "")
                    const logMessage = String(log.message ?? "")
                    const logTag = log.tag as string | null | undefined
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: "10px 20px",
                          borderBottom: "1px solid #0f172a",
                          fontSize: 11,
                          alignItems: "flex-start",
                          background:
                            logLevel === "ERROR"
                              ? "#1a0808"
                              : logLevel === "WARNING"
                                ? "#1a1408"
                                : matchedViaMessage
                                  ? "#0a0f1a"
                                  : "transparent",
                          borderLeft: matchedViaMessage ? "2px solid #334155" : "2px solid transparent",
                        }}
                      >
                        <div
                          style={{
                            color: "#475569",
                            flexShrink: 0,
                            minWidth: 80,
                          }}
                        >
                          {logTimestamp.split(" ")[1]}
                        </div>
                        <div
                          style={{
                            color: LEVEL_COLORS[(log.level as string) || ""] || "#64748b",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            flexShrink: 0,
                            minWidth: 50,
                            paddingTop: 1,
                          }}
                        >
                          {logLevel || "—"}
                        </div>
                        {matchedViaMessage && (
                          <div
                            style={{
                              fontSize: 9,
                              padding: "2px 7px",
                              borderRadius: 3,
                              background: "#1e293b",
                              color: "#64748b",
                              flexShrink: 0,
                              letterSpacing: "0.05em",
                              fontStyle: "italic",
                            }}
                          >
                            ~msg
                          </div>
                        )}
                        {svcInfo && (
                          <div
                            style={{
                              fontSize: 9,
                              padding: "2px 8px",
                              borderRadius: 3,
                              background: `${svcInfo.color}20`,
                              color: svcInfo.color,
                              flexShrink: 0,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {svcInfo.icon} {svcInfo.label}
                          </div>
                        )}
                        <div
                          style={{
                            color: "#cbd5e1",
                            flex: 1,
                            lineHeight: 1.5,
                          }}
                        >
                          {logMessage}
                        </div>
                        {logTag && (
                          <div
                            style={{
                              fontSize: 9,
                              color: "#475569",
                              flexShrink: 0,
                            }}
                          >
                            [{logTag}]
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredLogsForRequest.length === 0 && (
                    <div
                      style={{
                        padding: 20,
                        color: "#475569",
                        fontSize: 11,
                      }}
                    >
                      No logs match filter.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {requestIds.length > 0 && (
            <div
              style={{
                marginTop: 12,
                fontSize: 10,
                color: "#334155",
                display: "flex",
                gap: 16,
              }}
            >
              <span style={{ borderLeft: "2px solid #334155", paddingLeft: 6 }}>
                ~msg = matched via message content, not request_id field
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
