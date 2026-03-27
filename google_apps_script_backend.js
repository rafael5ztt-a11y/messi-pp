// backend.gs
// CÓDIGO PARA GOOGLE APPS SCRIPT
// Este archivo es una referencia para el usuario. No se ejecuta en la app directamente.

const SHEET_NAME = 'Candidatos';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addCandidate') {
      const rowData = [
        data.id,
        data.nombre,
        data.email,
        data.telefono,
        data.experiencia,
        data.skills,
        data.score,
        data.estado,
        data.cv_url,
        new Date().toISOString()
      ];
      
      sheet.appendRow(rowData);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Candidato guardado', data: rowData }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const rows = sheet.getDataRange().getValues(); // Obtiene todos los datos
    
    // Ignorar encabezados y mapear
    const candidates = rows.slice(1).map(row => ({
      id: row[0],
      nombre: row[1],
      email: row[2],
      telefono: row[3],
      experiencia: row[4],
      skills: row[5],
      score: row[6],
      estado: row[7],
      cv_url: row[8],
      fecha: row[9]
    }));
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: candidates }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
     return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/*
INSTRUCCIONES PARA EL USUARIO:
1. Crea un Google Sheet en blanco.
2. Nombra la primera pestaña de abajo como: Candidatos
3. En la Fila 1 (Encabezados), escribe de la A a la J:
   id | nombre | email | telefono | experiencia | skills | score | estado | cv_url | fecha
4. Ve Arriba a: Extensiones -> Apps Script
5. Pega todo este código ahí y guárdalo.
6. Dale al botón azul "Implementar" -> "Nueva implementación"
7. Selecciona el tipo de engranaje a la izquierda: "Aplicación Web"
8. Pon: 
   - Descripción: Backend API
   - Ejecutar como: Tú (tu correo)
   - Quién tiene acceso: "Cualquier persona" (IMPORTANTE)
9. Clic en Implementar y autoriza los permisos.
10. Te dará una URL larguísima (https://script.google.com/macros/...). Cópiala. Esa será tu base de datos.
*/
