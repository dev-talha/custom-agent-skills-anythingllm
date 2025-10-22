// handler.js — updated for your API structure

async function getFetch() {
  if (typeof fetch !== "undefined") return fetch;
  try {
    const nf = await import("node-fetch");
    return nf.default || nf;
  } catch (err) {
    throw new Error("No fetch available. Please use Node18+ or bundle node-fetch.");
  }
}

module.exports.runtime = {
  handler: async function ({ query }) {
    const apiUrl =
      this.runtimeArgs["apiUrl"] ||
      "https://yourdoamin.com/api/freship";
    this.introspect(`Fetching data from: ${apiUrl}`);

    try {
      const fetchFn = await getFetch();
      const resp = await fetchFn(apiUrl);
      if (!resp.ok) {
        return `Error: failed to fetch upstream API (status ${resp.status}).`;
      }

      const data = await resp.json();
      const locations = data.locations || [];

      // Filter only locations having fresh_ip > 0 (or ISP fresh_ip > 0)
      const available = [];

      for (const loc of locations) {
        const { city, state, isp } = loc;
        const freshCity = loc.fresh_ip > 0;
        const freshISPs = (isp || []).filter((p) => p.fresh_ip > 0);

        if (freshCity || freshISPs.length > 0) {
          if (freshISPs.length > 0) {
            for (const provider of freshISPs) {
              available.push({
                location: `${city}, ${state}`,
                isp: provider.name,
              });
            }
          } else {
            // City-level fresh IP without ISP-level detail
            available.push({
              location: `${city}, ${state}`,
              isp: "Unknown ISP",
            });
          }
        }
      }

      if (available.length === 0) {
        return "No fresh IPs currently available. Please check again later.";
      }

      // Compose readable string output
      let message = "Fresh IP available\n";
      for (const entry of available) {
        message += `in ${entry.location} - ${entry.isp}\n`;
      }

      return message.trim();
    } catch (err) {
      return `Error: ${err.message || err}`;
    }
  },
};
