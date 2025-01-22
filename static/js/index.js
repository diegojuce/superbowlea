document.addEventListener('DOMContentLoaded', () => {
    const teamsTableBody = document.getElementById('teams-body');
  
    // Función para cargar equipos desde el servidor
    const cargarEquipos = () => {
      fetch('/api/equipos')
        .then(response => response.json())
        .then(teams => {
          let filas = teams.map(team => `
            <tr>
              <td>
                <form action="/editar_nombre" method="POST">
                  <input type="hidden" name="equipo_id" value="${team.id}">
                  <input type="text" name="nuevo_nombre" value="${team.nombre}" onblur="this.form.submit()" required>
                </form>
              </td>
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
          `);
  
          // Rellenar con filas vacías si hay menos de 5 equipos
          while (filas.length < 5) {
            filas.push(`
              <tr>
                <td><em>Equipo vacío</em></td>
                <td>0</td>
                <td>0</td>
                <td>-</td>
              </tr>
            `);
          }
  
          teamsTableBody.innerHTML = filas.join('');
        })
        .catch(err => console.error('Error al cargar equipos:', err));
    };
  
    cargarEquipos();
  });
  