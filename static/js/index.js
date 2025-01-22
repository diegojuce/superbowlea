document.addEventListener('DOMContentLoaded', () => {
    const teamsTableBody = document.getElementById('teams-body'); // Tabla de equipos
    const addTeamForm = document.getElementById('add-team-form'); // Formulario para agregar equipo
  
    // Función para cargar equipos desde el servidor
    const cargarEquipos = () => {
      fetch('/api/equipos')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar equipos');
          }
          return response.json();
        })
        .then(teams => {
          // Llenar la tabla con los equipos
          teamsTableBody.innerHTML = teams.map(team => `
            <tr>
              <td>
                <form action="/eliminar_equipo/${team.id}" method="POST">
                  <button type="submit" class="small-delete">X</button>
                </form>
              </td>
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
          `).join('');
        })
        .catch(err => console.error('Error al cargar equipos:', err));
    };
  
    // Llamar a la función para cargar equipos al iniciar
    cargarEquipos();
  
    // Manejar la acción de agregar equipo
    addTeamForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Crear el objeto FormData para enviar los datos del formulario
      const formData = new FormData(addTeamForm);
  
      fetch('/agregar_equipo', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al agregar equipo');
          }
          return response.text();
        })
        .then(() => {
          alert('Equipo agregado correctamente.');
          cargarEquipos(); // Recargar la tabla con los nuevos datos
          addTeamForm.reset(); // Limpiar el formulario
        })
        .catch(err => {
          console.error('Error al agregar equipo:', err);
          alert('Hubo un error al agregar el equipo. Inténtalo de nuevo.');
        });
    });
  });
  