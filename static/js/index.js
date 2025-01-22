document.addEventListener('DOMContentLoaded', () => {
    const scoresTableBody = document.getElementById('scores-body');
    const actionsTableBody = document.getElementById('actions-body');
  
    // Cargar equipos desde el servidor
    const cargarEquipos = () => {
      fetch('/api/equipos')
        .then(response => response.json())
        .then(teams => {
          // Rellenar la tabla de puntuaciones
          scoresTableBody.innerHTML = teams.map(team => `
            <tr>
              <td>${team.nombre}</td>
              <td>${team.yardas}</td>
              <td>${team.puntos}</td>
            </tr>
          `).join('');
  
          // Rellenar la tabla de acciones
          actionsTableBody.innerHTML = teams.map(team => `
            <tr>
              <td>${team.nombre}</td>
              <td>Sumar Yardas</td>
              <td>
                <form action="/sumar" method="POST">
                  <input type="hidden" name="equipo_id" value="${team.id}">
                  <input type="number" name="yardas" value="5" step="5" required>
                  <button type="submit">Aplicar</button>
                </form>
              </td>
            </tr>
          `).join('');
        })
        .catch(err => console.error('Error al cargar equipos:', err));
    };
  
    cargarEquipos();
  });
  