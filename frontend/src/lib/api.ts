const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  optimize: async (params: any) => {
    const res = await fetch(`${BASE_URL}/api/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  paperTrade: async (params: any) => {
    const res = await fetch(`${BASE_URL}/api/paper-trade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  transformerWindow: async (seq_len: number) => {
    const res = await fetch(
      `${BASE_URL}/api/transformer-window?seq_len=${seq_len}`,
      { method: "POST" }
    );
    return res.json();
  },

  getLiveSignal: async (sector: string = "^NSEBANK") => {
    const res = await fetch(
      `${BASE_URL}/api/live-signal?sector=${encodeURIComponent(sector)}`,
      { method: "GET" }
    );
    return res.json();
  },

  getSectors: async () => {
    const res = await fetch(`${BASE_URL}/api/sectors`, {
      method: "GET",
    });
    return res.json();
  },
};