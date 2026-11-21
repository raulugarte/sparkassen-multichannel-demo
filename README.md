# Sparkassen Multi-Channel Demo

Unabhängige, **nicht offizielle** Sparkassen-inspirierte AEM Multi-Channel-Demo, abgeleitet aus der Architektur des bereitgestellten VR-Demo-Bank-Projekts. Kein echtes Banking und keine Markenassets.

## Start

```bash
npm ci
npm run dev
```

Öffne `http://localhost:3000/channels`. Die Startseite leitet dorthin weiter. Weitere Routen: `/app` und `/banking-widget`.

## Deployment auf Vercel

1. ZIP lokal entpacken und **nur die Projektdateien** in das neue private GitHub-Repository `raulugarte/sparkassen-multichannel-demo` übernehmen. Das bestehende VR-Repository nicht verändern.
2. Änderungen auf Branch `main` committen. `node_modules`, `.next` und echte `.env`-Dateien niemals committen.
3. Auf Vercel im bisherigen Team ein **neues** Projekt aus diesem Repository importieren, Framework **Next.js**, Root Directory `./`, Build-Einstellungen auf Standard.
4. Deploy starten. Die Anwendung funktioniert sofort mit eigenen lokalen Sparkassen-Demodaten.

## AEM-Anbindung (zweite Etappe)

Die ursprüngliche VR-App verwendet AEM Content Fragment REST OpenAPI, GraphQL und weitere AEM-Seiten-/Navigationsquellen. Diese schlanke erste Version enthält eine **optionale REST-Integration für Produktfragmente**, jedoch noch keine Live-GraphQL-, Dynamic-Media- oder AEM-Sites-Page-Demonstration. Die UI zeigt ausschließlich die drei vereinbarten Kanäle.

- Vorhandene Models unter `/conf/bank-1` können weiterverwendet werden, sofern die Sparkassen-Ordner korrekt zugeordnet sind.
- Sparkassen-Fragmente getrennt von VR-Fragmente anlegen, beispielsweise unter `/content/dam/bank-1/sparkassen-demo/content-fragments/`.
- Nach dem Publizieren die **neuen Sparkassen-Fragment-IDs** in den Vercel Environment Variables `AEM_FRAGMENT_*_ID` hinterlegen. **Niemals die alten VR-IDs verwenden.**
- `AEM_AUTHOR_URL` und `AEM_AUTH_TOKEN` als serverseitige Vercel-Secrets setzen. Für produktive öffentliche Delivery die geeignete AEM-Delivery-/Authentifizierungsstrategie prüfen.
- Das Feldmapping in `src/lib/content.ts` mit dem tatsächlichen JSON-Schema des AEM REST Endpoints prüfen. Das generische Mapping ist ein Integrationsgerüst, kein verifizierter Live-Adapter.
- Die Variation `mobile` wird beim mobilen Abruf angefordert, sofern sie in der API-Antwort enthalten ist. Variationsschema und Berechtigungen müssen live verifiziert werden.
- Nach Änderungen erfolgt Revalidierung frühestens bei einem neuen Request nach 60 Sekunden; keine garantierte Push-Aktualisierung.

Ohne konfigurierte AEM-IDs oder bei API-Fehlern werden ausschließlich die eigenen lokalen Sparkassen-Demodaten angezeigt. Keine VR-Snapshots und keine VR-Fragment-IDs sind enthalten.

## Sicherheit und Abgrenzung

Keine Zugangsdaten im Repository. Die App ist ausdrücklich eine Demo ohne echte Konten oder Finanzangebote. Das Vercel-Projekt ist eigenständig und verwendet keine Änderungen am bestehenden VR-Repository.
