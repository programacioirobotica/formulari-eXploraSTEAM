// ============================================================
// GOOGLE APPS SCRIPT — eXploraSTEAM 2026
// Enganxeu aquest codi a script.google.com
// Substituïu SHEET_ID per l'ID del vostre full de càlcul
// ============================================================

const SHEET_ID = 'SUBSTITUÏU_PER_L_ID_DEL_VOSTRE_FULL_DE_CALCUL';

function doPost(e) {
  try {
    const dades = JSON.parse(e.postData.contents);
    const full  = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Capçalera automàtica si el full és buit
    if (full.getLastRow() === 0) {
      full.appendRow([
        'Timestamp',
        'Nom',
        'Cognoms',
        'DNI / NIE',
        'Centre educatiu',
        'Població',
        'Correu electrònic',
        'Format de participació',
        '1a preferència taller',
        '2a preferència taller',
        '3a preferència taller',
        'Política de dades acceptada',
        'Consentiment imatges',
      ]);
      // Congelar la primera fila i posar-la en negreta
      full.setFrozenRows(1);
      full.getRange(1, 1, 1, 13).setFontWeight('bold');
    }

    // Afegir fila de dades
    full.appendRow([
      new Date(),
      dades.nom,
      dades.cognoms,
      dades.dni,
      dades.centre,
      dades.poblacio,
      dades.email,
      dades.format,
      dades.taller1,
      dades.taller2,
      dades.taller3,
      dades.politicaDades,
      dades.consentimentImatges,
    ]);

    // Enviar correu de confirmació
    enviarCorreu(dades);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', missatge: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarCorreu(d) {
  const assumpte = 'Confirmació d\'inscripció a eXploraSTEAM 2026';

  // Files de tallers (només si el format inclou tallers)
  let filesTallers = '';
  if (d.format === 'Assistència i tallers') {
    filesTallers = `
      <tr>
        <td style="padding:7px 0;color:#666;font-weight:700;width:42%">1a preferència:</td>
        <td style="padding:7px 0">${d.taller1 || '—'}</td>
      </tr>
      ${d.taller2 ? `<tr>
        <td style="padding:7px 0;color:#666;font-weight:700">2a preferència:</td>
        <td style="padding:7px 0">${d.taller2}</td>
      </tr>` : ''}
      ${d.taller3 ? `<tr>
        <td style="padding:7px 0;color:#666;font-weight:700">3a preferència:</td>
        <td style="padding:7px 0">${d.taller3}</td>
      </tr>` : ''}
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="ca">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f2f7f4;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">

    <!-- Capçalera -->
    <div style="background:linear-gradient(135deg,#1b5e34,#2d8a56);padding:32px;text-align:center">
      <img src="https://projectes.xtec.cat/steamcat/wp-content/uploads/usu1760/2026/04/Caratula-eXplora26-2.png"
           alt="eXploraSTEAM 2026" style="max-width:240px;border-radius:8px;margin-bottom:14px">
      <h1 style="color:#fff;margin:0;font-size:20px">Confirmació d'inscripció</h1>
      <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">eXploraSTEAM 2026</p>
    </div>

    <!-- Cos -->
    <div style="padding:28px 32px">
      <p style="font-size:16px;color:#1a2e24;margin-bottom:14px">
        Hola <strong>${d.nom} ${d.cognoms}</strong>,
      </p>
      <p style="color:#4a6658;margin-bottom:22px;line-height:1.6">
        La vostra inscripció a <strong>eXploraSTEAM 2026</strong> ha estat registrada correctament.
        A continuació podeu revisar les dades facilitades:
      </p>

      <div style="background:#f2f7f4;border-radius:12px;padding:20px;margin-bottom:22px">
        <h2 style="color:#1b5e34;font-size:15px;margin:0 0 14px;border-bottom:2px solid #b7d5c5;padding-bottom:10px">
          Resum de la inscripció
        </h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a2e24">
          <tr>
            <td style="padding:7px 0;color:#666;font-weight:700;width:42%">Nom i cognoms:</td>
            <td style="padding:7px 0">${d.nom} ${d.cognoms}</td>
          </tr>
          <tr style="background:rgba(255,255,255,.5)">
            <td style="padding:7px 0;color:#666;font-weight:700">DNI / NIE:</td>
            <td style="padding:7px 0">${d.dni}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#666;font-weight:700">Centre:</td>
            <td style="padding:7px 0">${d.centre}</td>
          </tr>
          <tr style="background:rgba(255,255,255,.5)">
            <td style="padding:7px 0;color:#666;font-weight:700">Població:</td>
            <td style="padding:7px 0">${d.poblacio}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#666;font-weight:700">Correu electrònic:</td>
            <td style="padding:7px 0">${d.email}</td>
          </tr>
          <tr style="background:rgba(255,255,255,.5)">
            <td style="padding:7px 0;color:#666;font-weight:700">Format:</td>
            <td style="padding:7px 0"><strong style="color:#1b5e34">${d.format}</strong></td>
          </tr>
          ${filesTallers}
        </table>
      </div>

      <p style="color:#4a6658;font-size:13px;border-top:1px solid #b7d5c5;padding-top:18px;line-height:1.6;margin:0">
        Si necessiteu modificar la vostra inscripció o teniu qualsevol dubte,
        poseu-vos en contacte amb l'organització.
      </p>
    </div>

    <!-- Peu -->
    <div style="background:#1b5e34;padding:18px;text-align:center">
      <p style="color:rgba(255,255,255,.8);margin:0;font-size:12px">
        eXploraSTEAM 2026 · Departament d'Educació i Formació Professional
      </p>
    </div>

  </div>
</body>
</html>`;

  MailApp.sendEmail({
    to:       d.email,
    subject:  assumpte,
    htmlBody: html,
  });
}
