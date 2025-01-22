document.addEventListener('DOMContentLoaded', () => {
    const historyTableBody = document.getElementById('history-body');
  
    // Cargar historial desde el servidor
    fetch('/historial')
      .then(response => response.json())
      .then(history => {
        historyTableBody.innerHTML = history.map(entry => `
          <tr>
            <td>${entry.fecha}</td>
            <td>${entry.nombre}</td>
            <td>${entry.yardas}</td>
            <td>${entry.puntos}</td>
          </tr>
        `).join('');
      })
      .catch(err => console.error('Error al cargar historial:', err));
  });
  