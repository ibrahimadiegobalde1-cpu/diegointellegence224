const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

const types = new Set(["website", "business", "shop", "mobile", "jobs", "dashboard", "portfolio"]);
function cleanText(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}
function localFiles(name, description, type) {
  const escape = value => value.replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const title = escape(name || "Mon projet");
  const desc = escape(description || "Bienvenue sur mon projet.");
  const kind = ({website:"Site web",business:"Site professionnel",shop:"Boutique — maquette",mobile:"Prototype mobile",jobs:"Plateforme d’emploi — maquette",dashboard:"Tableau de bord",portfolio:"Portfolio"})[type] || "Site web";
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="style.css"></head><body><header><strong>${title}</strong><span>${kind}</span></header><main><p class="tag">DIEGO INTELLIGENCE STUDIO</p><h1>${title}</h1><p>${desc}</p><section><h2>Bienvenue</h2><p>Cette maquette est un point de départ. Les fonctions connectées doivent être développées et testées.</p><button id="contact">Me contacter</button><p id="reply" aria-live="polite"></p></section></main><footer>Créé avec Diego Intelligence Studio · BALDE IBRAHIMA DIEGO</footer><script src="script.js"></script></body></html>`;
  const css = `*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#f5f7fb;color:#172033}header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:18px max(20px,calc((100% - 900px)/2));background:#10172a;color:white}header span{color:#f1c66d}main{max-width:860px;margin:auto;padding:48px 22px;min-height:75vh}.tag{color:#8a5a00;font-weight:800;letter-spacing:.12em;font-size:.8rem}h1{font-size:clamp(2.4rem,8vw,4rem);line-height:1.1}section{margin-top:36px;background:white;padding:24px;border-radius:18px}button{border:0;background:#17284b;color:white;padding:12px 18px;border-radius:10px;font-weight:700}footer{text-align:center;padding:20px;color:#64708a}`;
  const js = `document.getElementById("contact").addEventListener("click",()=>{document.getElementById("reply").textContent="Ajoutez ici un formulaire de contact sécurisé."});`;
  return {"index.html":html,"style.css":css,"script.js":js,"README.txt":`${name}\\nType : ${kind}\\n\\nDescription : ${description}\\n\\nMaquette de départ. Les fonctions serveur ne sont pas incluses.`};
}
async function generateWithAI(name, description, type) {
  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) return null;
  const prompt = `Tu es Diego Intelligence Studio. Produis un kit de site web de départ en français à partir de la demande suivante. Nom: ${name}. Type: ${type}. Description: ${description}. Retourne UNIQUEMENT un objet JSON avec exactement ces clés possibles: index.html, style.css, script.js, README.txt. Chaque valeur doit être une chaîne de code. Génère un site accessible et responsive. Ne mets aucun secret, aucune clé API, aucune fonction de paiement réelle, aucun code qui vole des données ou demande des mots de passe. N'invente pas de backend : précise dans README.txt les fonctions manquantes. Dans index.html, référence style.css et script.js par des chemins relatifs.`;
  const endpoint = baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: "Tu génères du code de démarrage prudent. Réponds uniquement avec du JSON valide, sans Markdown." },
        { role: "user", content: prompt }
      ]
    }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error("Le fournisseur IA a renvoyé une erreur.");
  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Réponse IA manquante.");
  const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const files = JSON.parse(stripped);
  const allowed = new Set(["index.html","style.css","script.js","README.txt"]);
  const clean = {};
  for (const [file, text] of Object.entries(files)) {
    if (!allowed.has(file) || typeof text !== "string") continue;
    if (text.length > 120000) throw new Error("Fichier IA trop volumineux.");
    clean[file] = text;
  }
  if (!clean["index.html"]) throw new Error("index.html absent de la réponse IA.");
  clean["style.css"] ||= "";
  clean["script.js"] ||= "";
  clean["README.txt"] ||= "Kit généré par le modèle configuré. Vérifiez le code avant publication.";
  return clean;
}
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL) });
});
app.post("/api/generate", async (req, res) => {
  const name = cleanText(req.body?.name, 60);
  const description = cleanText(req.body?.description, 5000);
  const type = types.has(req.body?.type) ? req.body.type : "website";
  if (!name || !description) return res.status(400).json({ error: "Nom et description obligatoires." });
  try {
    const aiFiles = await generateWithAI(name, description, type);
    if (aiFiles) return res.json({ mode: "ai", files: aiFiles });
    return res.json({ mode: "local", files: localFiles(name, description, type) });
  } catch (error) {
    console.error("Generation error:", error.message);
    return res.status(502).json({ error: "La génération IA a échoué. Réessaie ou utilise le mode local." });
  }
});
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Route API inconnue." });
  res.sendFile(path.join(PUBLIC_DIR, "index.html"), err => { if (err) next(err); });
});
app.listen(PORT, "0.0.0.0", () => console.log(`Diego Intelligence Studio disponible sur le port ${PORT}`));
