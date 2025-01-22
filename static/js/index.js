document.addEventListener('DOMContentLoaded', () => {
    const teamsTableBody = document.getElementById('teams-body');
    const addTeamForm = document.getElementById('add-team-form');
  
    // Cargar equipos desde el servidor
    fetch('/api/equipos')
      .then(response => response.json())
      .then(teams => {
        teamsTableBody.innerHTML = teams.map(team => `
          <tr>
            <td>
              <form action="/eliminar_equipo/${team.id}" method="POST">
                <button type="submit" class="small-delete">X</button>
              </form>
            </td>
            <td>${team.nombre}</td>
            <td>${team.yardas}</td>
            <td>${team.puntos}</td>
            <td>
              <form action="/sumar" method="POST">
                <input type="hidden" name="equipo_id" value="${team.id}">
                <input type="number" name="yardas" value="5" step="5" required>
                <button type="submit">Sumar</button>
              </form>
            </td>
          </tr>
        `).join('');
      })
      .catch(err => console.error('Error al cargar equipos:', err));
  
    // Agregar nuevo equipo
    addTeamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addTeamForm);
  
      fetch('/agregar_equipo', {
        method: 'POST',
        body: formData,
      }).then(() => location.reload());
    });
  });
  