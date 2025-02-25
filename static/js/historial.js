document.addEventListener('DOMContentLoaded', () => {
    const historyTableBody = document.getElementById('history-body');
    const equipoSelectYardas = document.getElementById('equipo-select-yardas');
    const equipoSelectPuntos = document.getElementById('equipo-select-puntos');
  
    // Cargar historial desde el servidor
    fetch('/api/historial')
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
  
    // Llenar selects de equipos
    fetch('/api/equipos')
      .then(response => response.json())
      .then(teams => {
        const options = teams.map(team => `
          <option value="${team.id}">${team.nombre}</option>
        `).join('');
  
        equipoSelectYardas.innerHTML += options;
        equipoSelectPuntos.innerHTML += options;
      })
      .catch(err => console.error('Error al cargar equipos:', err));
  });
  