# FreshIP Availability — AnythingLLM Custom Agent Skill

## What it does
This skill queries the configured upstream API and answers questions about **fresh residential IP availability**.  
It tells you **whether fresh IPs are available** and, if so, which **location(s)** and **ISP(s)** have them.  

**Important:** This skill intentionally does **not** provide total counts of IPs.

---

## Installation
1. Place the folder `freship-availability` in your AnythingLLM storage location under `plugins/agent-skills/`.
2. Ensure the folder contains:
   - `plugin.json`
   - `handler.js`
   - `README.md`
3. If your Node environment does not provide `fetch`, bundle `node-fetch` in the folder:
   ```bash
   yarn add node-fetch
   
> **Note:** This is a custom **MCP** for AnythingLLM. You can use the idea and structure from this repo to build your own custom agent skills.
