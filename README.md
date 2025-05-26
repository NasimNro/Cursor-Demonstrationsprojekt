# Weight Tracker App

## Projektstart mit KI-Unterstützung durch Cursor

Dieses Projekt wurde initial mit maßgeblicher Unterstützung des KI-Code-Editors [Cursor](https://cursor.sh/) aufgesetzt. Die folgende Beschreibung zeigt, wie aus der ersten Projektidee ein detaillierter Plan entwickelt und die Grundstruktur der Anwendung mithilfe von Cursor erstellt wurde.

### 1. Die ursprüngliche Idee und der erste Prompt an Cursor

Am Anfang stand eine grundlegende Idee für eine Web-App zur Gewichtskontrolle. Um daraus einen detaillierten Plan zu formen, den eine KI umsetzen kann, wurde Cursor zunächst im sogenannten "Ask Mode" ein erster, selbst formulierter Prompt übergeben. Das Ziel war, von Cursor einen optimierten und ausführlicheren Prompt für die eigentliche App-Erstellung zu erhalten:

```plaintext
Ich befinde mich gerade auf Diät und möchte eine Web-App bauen,
die mir hilft, mein Gewicht zu tracken. Die Kernfunktionalitäten
der App sollen folgende sein:

- Eintragen des Gewichts
- Visualisieren des Gewichtsverlaufs für mehrere Zeiträume

Die App soll mit Next.js und TypeScript gebaut werden, als
Datenbank möchte ich MongoDB nutzen, und für das Styling bitte
Tailwind CSS verwenden.

Die App soll für PCs und Handys optimiert sein.

Das Design soll einfach und modern sein, und ich möchte eine
dunkle Farbpalette verwenden.

Formuliere mir bitte einen ausführlichen Prompt, den ich einer KI
geben kann, damit sie mir die App erstellt.
```

### 2. Cursors detaillierter Prompt für die App-Entwicklung

Auf Basis dieser ersten Anfrage generierte Cursor einen wesentlich ausführlicheren und strukturierteren Prompt. Dieser präzisierte die Anforderungen und diente als direkte Anweisung für die KI zur Erstellung der Gewichts-Tracking-App:

```plaintext
Erstelle eine Gewichts-Tracking-Webapp mit Next.js und TypeScript. Die App soll folgende Funktionen haben:

1. Gewichtseintragung:
   - Formular zum Hinzufügen von Gewichtsdaten (Gewicht in kg, Datum, optionale Notizen)
   - Möglichkeit, Einträge zu bearbeiten oder zu löschen
   - Validierung der Eingaben

2. Visualisierung:
   - Liniendiagramm zur Darstellung des Gewichtsverlaufs
   - Filter für verschiedene Zeiträume (Woche, Monat, Jahr, benutzerdefiniert)
   - Anzeige von Trends und Fortschrittsstatistiken

3. Datenverwaltung:
   - MongoDB als Datenbank
   - Sichere Datenspeicherung und -abfrage
   - Optimierte API-Routen für schnelle Ladezeiten

4. Design und UI:
   - Styling mit Tailwind CSS
   - Dunkles Farbschema mit dunklen Blau-/Grautönen und Akzentfarben
   - Responsive Design für PC und Mobilgeräte
   - Modernes, minimalistisches Interface mit klarer Datenvisualisierung
   - Intuitive Navigation und Benutzerfreundlichkeit

5. Technische Anforderungen:
   - Next.js 13+ mit App Router
   - TypeScript für typisierte Entwicklung
   - MongoDB Atlas für Datenbankhosting
   - Chart.js oder D3.js für Datenvisualisierung
   - Optimierte Performance durch serverseitige Komponenten

Implementiere eine benutzerfreundliche Oberfläche mit einfachen Übergängen zwischen den Ansichten. Die App soll ohne komplexe Benutzerregistrierung funktionieren, aber die Daten sollen sicher gespeichert werden.
Das Dashboard soll den Gewichtsverlauf prominent anzeigen, mit einer einfachen Möglichkeit, neue Daten hinzuzufügen.
```

### 3. Start der Implementierung

Dieser von Cursor erstellte, detaillierte Prompt wurde anschließend dem Agenten-Modus von Cursor übergeben. Damit begann die initiale Phase der Softwareentwicklung, in der Cursor die Grundstruktur der Anwendung sowie erste Code-Bestandteile generierte.


