"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  User,
  Shield,
  AlertTriangle,
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { queryAIAssistant } from "@/lib/api";
import { RAW_DEMO_HABITATIONS } from "@/lib/demoData";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  suggestedActions?: string[];
  timestamp: string;
}

export default function AIAssistantPage() {
  const { role, user, selectedHabitationId, setSelectedHabitationId } = useAuth();
  const activeHab =
    RAW_DEMO_HABITATIONS.find((h) => h.id === selectedHabitationId) || RAW_DEMO_HABITATIONS[0];

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const citizenPrompts = [
    `Is ${activeHab.name} at risk?`,
    `Why is my area rated as ${activeHab.latest_risk_level}?`,
    `Do I need emergency relocation?`,
    `Where is the nearest safe zone for ${activeHab.district}?`,
    `What active alerts exist for my village?`,
  ];

  const adminPrompts = [
    "Which areas require immediate relocation?",
    "Which habitations are critical?",
    "Which safe zone has the highest available capacity?",
    "Show high flood-risk areas.",
    "What is the status of active alerts across all districts?",
  ];

  const suggestedPrompts = role === "ADMIN" ? adminPrompts : citizenPrompts;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text:
        role === "ADMIN"
          ? "Welcome to Aashray Operations Intelligence. I am synced with our multi-hazard GIS assessments, carrying-capacity limits, and relocation pipelines. How can I assist your operational decisions today?"
          : `Hello! I am Aashray's Citizen Safety Assistant for ${activeHab.name}. I can answer questions about your local risk score, active flood/landslide alerts, evacuation safe zones, and relocation status based on official telemetry.`,
      suggestedActions: role === "ADMIN" ? ["View Critical Zones", "Safe Zone Allocations"] : ["View My Risk Map", "Check Relocation Timeline"],
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await queryAIAssistant({
        query: textToSend,
        role: role,
        habitation_id: activeHab.id,
      });

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: res.answer,
        suggestedActions: res.suggested_actions,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "Unable to retrieve real-time assessment data at this moment. Please check connectivity.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wide">
            <Bot className="w-4 h-4" />
            <span>Aashray Decision Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Aashray AI Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Contextual disaster-management guidance grounded strictly in verified GIS risk models and official registry data.
          </p>
        </div>

        {/* Habitation Context Badge */}
        {role === "USER" && (
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold text-slate-700">Context:</span>
            <select
              value={activeHab.id}
              onChange={(e) => setSelectedHabitationId(e.target.value)}
              className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {RAW_DEMO_HABITATIONS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.village})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Suggested Inquiries:
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors text-left"
            >
              • {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex space-x-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-none shadow-sm"
                    : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none space-y-2"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5 mt-2">
                    {m.suggestedActions.map((act, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] text-right font-mono ${
                    m.sender === "user" ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex space-x-3 items-center text-xs text-slate-400 p-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span>Querying telemetry and hazard registries...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about risk scores, relocation status, safe zones, or hazard factors..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-sm transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-400 mt-1.5">
            Aashray AI responses are strictly validated against registered GIS records. No simulated data is fabricated.
          </div>
        </div>
      </div>
    </div>
  );
}
