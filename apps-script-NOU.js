// ============================================================
// GOOGLE APPS SCRIPT — eXploraSTEAM 2026  (versió doGet)
// Substituïu SHEET_ID per l'ID del vostre full de càlcul
// ============================================================

const SHEET_ID = 'POSEU_AQUÍ_L_ID_DEL_FULL';

function doGet(e) {
  try {
    const p = e.parameter;

    // Validació mínima: cal nom i email
    if (!p.nom || !p.email) {
      return ContentService.createTextOutput('ERROR: falten camps obligatoris');
    }

    const full = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Capçalera automàtica al primer ús
    if (full.getLastRow() === 0) {
      const cap = ['Timestamp','Nom','Cognoms','DNI / NIE','Centre','Població',
                   'Correu electrònic','Format','1a preferència','2a preferència',
                   '3a preferència','Política dades','Consentiment imatges'];
      full.appendRow(cap);
      full.setFrozenRows(1);
      full.getRange(1, 1, 1, cap.length).setFontWeight('bold');
    }

    full.appendRow([
      new Date(),
      p.nom, p.cognoms, p.dni, p.centre, p.poblacio, p.email,
      p.format, p.taller1, p.taller2, p.taller3,
      p.politicaDades, p.consentimentImatges
    ]);

    enviarCorreu(p);

    return ContentService.createTextOutput('OK');

  } catch (err) {
    // L'error queda als registres d'execució (Apps Script → Execucions)
    console.error(err);
    return ContentService.createTextOutput('ERROR: ' + err.toString());
  }
}

// ── Test manual ──────────────────────────────────────────────
// Executeu aquesta funció des de l'editor per verificar-ho tot
function testManual() {
  const p = {
    nom: 'Test', cognoms: 'Prova', dni: '00000000T',
    centre: 'Centre de prova', poblacio: 'Barcelona',
    email: Session.getActiveUser().getEmail(),
    format: 'Assistència i tallers',
    taller1: 'L\'enigma del suro', taller2: 'Petits enginyers', taller3: '',
    politicaDades: 'Sí', consentimentImatges: 'Sí'
  };

  // 1. Escriure al full
  const full = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  Logger.log('Full obert: ' + full.getName());
  if (full.getLastRow() === 0) {
    const cap = ['Timestamp','Nom','Cognoms','DNI / NIE','Centre','Població',
                 'Correu electrònic','Format','1a preferència','2a preferència',
                 '3a preferència','Política dades','Consentiment imatges'];
    full.appendRow(cap);
    full.setFrozenRows(1);
    full.getRange(1, 1, 1, cap.length).setFontWeight('bold');
  }
  full.appendRow([
    new Date(),
    p.nom, p.cognoms, p.dni, p.centre, p.poblacio, p.email,
    p.format, p.taller1, p.taller2, p.taller3,
    p.politicaDades, p.consentimentImatges
  ]);
  Logger.log('Fila escrita al full ✓');

  // 2. Enviar correu
  enviarCorreu(p);
  Logger.log('Correu enviat a: ' + p.email + ' ✓');
}

// ── Correu de confirmació ─────────────────────────────────────
function enviarCorreu(p) {
  const filesTallers = p.format === 'Assistència i tallers' ? `
    <tr>
      <td style="padding:7px 0;color:#666;font-weight:700;width:42%">1a preferència:</td>
      <td style="padding:7px 0">${p.taller1 || '—'}</td>
    </tr>
    ${p.taller2 ? `<tr><td style="padding:7px 0;color:#666;font-weight:700">2a preferència:</td><td style="padding:7px 0">${p.taller2}</td></tr>` : ''}
    ${p.taller3 ? `<tr><td style="padding:7px 0;color:#666;font-weight:700">3a preferència:</td><td style="padding:7px 0">${p.taller3}</td></tr>` : ''}
  ` : '';

  const html = `<!DOCTYPE html>
<html lang="ca"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#fdf5f0;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(135deg,#bf4d0e,#f26522);padding:32px;text-align:center">
      <img src="https://projectes.xtec.cat/steamcat/wp-content/uploads/usu1760/2026/04/Caratula-eXplora26-2.png"
           alt="eXploraSTEAM 2026" style="max-width:240px;border-radius:8px;margin-bottom:14px">
      <h1 style="color:#fff;margin:0;font-size:20px">Confirmació d'inscripció</h1>
      <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">eXploraSTEAM 2026 · Palafrugell, 30 de maig de 2026</p>
    </div>
    <div style="padding:28px 32px">
      <p style="font-size:16px;color:#2c1810;margin-bottom:14px">
        Hola <strong>${p.nom} ${p.cognoms}</strong>,
      </p>
      <p style="color:#6b4535;margin-bottom:22px;line-height:1.6">
        La vostra inscripció a <strong>eXploraSTEAM 2026</strong> ha estat registrada correctament.
      </p>
      <div style="background:#fdf5f0;border-radius:12px;padding:20px;margin-bottom:22px">
        <h2 style="color:#bf4d0e;font-size:15px;margin:0 0 14px;border-bottom:2px solid #f0c9b0;padding-bottom:10px">
          Resum de la inscripció
        </h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2c1810">
          <tr><td style="padding:7px 0;color:#666;font-weight:700;width:42%">Nom i cognoms:</td><td style="padding:7px 0">${p.nom} ${p.cognoms}</td></tr>
          <tr style="background:rgba(255,255,255,.6)"><td style="padding:7px 0;color:#666;font-weight:700">DNI / NIE:</td><td style="padding:7px 0">${p.dni}</td></tr>
          <tr><td style="padding:7px 0;color:#666;font-weight:700">Centre:</td><td style="padding:7px 0">${p.centre}</td></tr>
          <tr style="background:rgba(255,255,255,.6)"><td style="padding:7px 0;color:#666;font-weight:700">Població:</td><td style="padding:7px 0">${p.poblacio}</td></tr>
          <tr><td style="padding:7px 0;color:#666;font-weight:700">Correu:</td><td style="padding:7px 0">${p.email}</td></tr>
          <tr style="background:rgba(255,255,255,.6)"><td style="padding:7px 0;color:#666;font-weight:700">Format:</td><td style="padding:7px 0"><strong style="color:#bf4d0e">${p.format}</strong></td></tr>
          ${filesTallers}
        </table>
      </div>
      <p style="color:#6b4535;font-size:13px;border-top:1px solid #f0c9b0;padding-top:18px;margin:0;line-height:1.6">
        Si necessiteu modificar la inscripció, poseu-vos en contacte amb l'organització.
      </p>
    </div>
    <div style="background:#bf4d0e;padding:18px;text-align:center">
      <p style="color:rgba(255,255,255,.85);margin:0;font-size:12px">
        eXploraSTEAM 2026 · Departament d'Educació i Formació Professional
      </p>
    </div>
  </div>
</body></html>`;

  MailApp.sendEmail({
    to:       p.email,
    subject:  'Confirmació d\'inscripció a eXploraSTEAM 2026',
    htmlBody: html,
  });
}
