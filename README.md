# Sparkassen Multi-Channel Demo — Assets Delivery update

Die drei Kanäle verwenden ausschließlich Master Content Fragments via AEM Author GraphQL. Die Variation `genai_mobile` wird nicht mehr abgefragt.

## Bildauslieferung

Die Komponente `src/components/AssetImage.tsx` verwendet bevorzugt die von GraphQL gelieferte `_dynamicUrl`, **sofern** diese auf `https://delivery-p130407-e1279066.adobeaemcloud.com/adobe/assets/...` zeigt. Die URL wird nicht aus dem DAM-Pfad konstruiert. Wenn AEM keine passende Delivery-URL liefert oder ein Bild nicht geladen werden kann, wird die bestehende serverseitige `/api/asset`-Route als Übergangslösung verwendet. Der AEM Author Bearer Token bleibt ausschließlich auf dem Server.

**Noch zu prüfen:** Die Delivery-URLs konnten aus dieser Umgebung nicht per HTTP erreicht werden. Daher kann eine öffentliche Bildauslieferung noch nicht bestätigt werden. Die Assets müssen für Delivery freigegeben sein. Die Bildroute `/api/asset` bleibt vorerst bewusst erhalten.

## Konfiguration

In Vercel bleiben `AEM_GRAPHQL_ENDPOINT` und `AEM_AUTH_TOKEN` unverändert. Keine weiteren Secrets erforderlich. GraphQL wird serverseitig mit 60 Sekunden Revalidierung geladen.

## GitHub Update

- `src/components/AssetImage.tsx` **neu**
- `src/components/Views.tsx` ersetzen
- `src/lib/content.ts` ersetzen
- `src/app/app/page.tsx` ersetzen
- `README.md` ersetzen (optional)

Nach Deployment Browser-Netzwerkansicht prüfen: erfolgreiche Bilder sollten von `delivery-p130407-e1279066.adobeaemcloud.com` kommen. Bei Fehlern fällt die App auf `/api/asset` zurück. Die bestehende VR Demo Bank bleibt unverändert.
