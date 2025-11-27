(() => {
  // --- LOGIN ---
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      // Usuario fijo como ejemplo
      if (username === 'admin' && password === '1234') {
        localStorage.setItem('user', username);
        window.location.href = 'dashboard.html';
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }

  // --- VERIFICAR SESIÓN EN DASHBOARD ---
  if (window.location.pathname.endsWith('dashboard.html')) {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = 'index.html';
    }

    // LOGOUT
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });

    // --- REGISTRO DE ASISTENCIA ---
    let employees = JSON.parse(localStorage.getItem('employees') || '[]');
    let movements = JSON.parse(localStorage.getItem('movements') || '[]').map(m => ({...m, date: new Date(m.date)}));

    // ELEMENTOS DOM
    const employeeSelect = document.getElementById('employeeSelect');
    const registerIngresoBtn = document.getElementById('registerIngresoBtn');
    const registerEgresoBtn = document.getElementById('registerEgresoBtn');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const newEmployeeName = document.getElementById('newEmployeeName');
    const newEmployeeDNI = document.getElementById('newEmployeeDNI');
    const newEmployeePosition = document.getElementById('newEmployeePosition');
    const employeesTableBody = document.querySelector('#employeesTable tbody');
    const movementsTableBody = document.querySelector('#movementsTable tbody');
    const filterEmployee = document.getElementById('filterEmployee');
    const filterType = document.getElementById('filterType');
    const searchEmployee = document.getElementById('searchEmployee');
    const btnExport = document.getElementById('btnExport');
    const toast = document.getElementById('toast');
    const summary = document.getElementById('summary');

    // FUNCIONES (igual que tu código actual)
    function updateEmployeeSelect() {
      employeeSelect.innerHTML = '<option value="">Seleccionar empleado...</option>';
      filterEmployee.innerHTML = '<option value="all">Todos</option>';
      employees.forEach((emp, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = emp.name;
        employeeSelect.appendChild(option);

        const filterOption = document.createElement('option');
        filterOption.value = i;
        filterOption.textContent = emp.name;
        filterEmployee.appendChild(filterOption);
      });

      const hasEmployees = employees.length > 0;
      registerIngresoBtn.disabled = !hasEmployees || employeeSelect.value === '';
      registerEgresoBtn.disabled = !hasEmployees || employeeSelect.value === '';
    }

    function renderEmployeesTable(filterText) {
      employeesTableBody.innerHTML = '';
      const filter = filterText ? filterText.toLowerCase() : '';
      employees.forEach(emp => {
        if (!filter || emp.name.toLowerCase().includes(filter)) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${emp.name}</td><td>${emp.dni}</td><td>${emp.position}</td>`;
          employeesTableBody.appendChild(tr);
        }
      });
    }

    function renderMovementsTable() {
      movementsTableBody.innerHTML = '';
      const filterEmpVal = filterEmployee.value;
      const filterTypeVal = filterType.value;

      const filteredMovements = movements.filter((mov) => {
        const matchEmp = filterEmpVal === 'all' || employees[filterEmpVal] && mov.employee.name === employees[filterEmpVal].name;
        const matchType = filterTypeVal === 'all' || mov.type === filterTypeVal;
        return matchEmp && matchType;
      });

      filteredMovements.forEach(mov => {
        const tr = document.createElement('tr');
        tr.className = mov.type.toLowerCase();
        tr.innerHTML = `
          <td>${mov.employee.name}</td>
          <td>${mov.type}</td>
          <td>${mov.date.toLocaleString('es-AR')}</td>
        `;
        movementsTableBody.appendChild(tr);
      });

      updateSummary();
    }

    function updateSummary() {
      if (employeeSelect.value === '') {
        summary.textContent = '';
        return;
      }
      const emp = employees[employeeSelect.value];
      const ingresos = movements.filter(m => m.employee.name === emp.name && m.type === 'Ingreso').length;
      const egresos = movements.filter(m => m.employee.name === emp.name && m.type === 'Egreso').length;
      const balance = ingresos - egresos;
      summary.textContent = `Resumen de movimientos: ${emp.name}: Ingresos = ${ingresos}, Egresos = ${egresos}, Balance = ${balance}`;
    }

    function saveData() {
      localStorage.setItem('employees', JSON.stringify(employees));
      localStorage.setItem('movements', JSON.stringify(movements));
    }

    function showToast(message) {
      toast.textContent = message;
      toast.style.display = 'block';
      setTimeout(() => (toast.style.display = 'none'), 2500);
    }

    // EVENTOS
    addEmployeeBtn.addEventListener('click', () => {
      const name = newEmployeeName.value.trim();
      const dni = newEmployeeDNI.value.trim();
      const position = newEmployeePosition.value.trim();
      if (!name || !dni || !position) {
        alert('Complete todos los campos.');
        return;
      }
      if (employees.find(emp => emp.dni === dni)) {
        alert('Empleado ya existe.');
        return;
      }
      const newEmp = { name, dni, position };
      employees.push(newEmp);
      saveData();
      updateEmployeeSelect();
      renderEmployeesTable(searchEmployee.value);
      newEmployeeName.value = '';
      newEmployeeDNI.value = '';
      newEmployeePosition.value = '';
      showToast('Empleado agregado');
    });

    registerIngresoBtn.addEventListener('click', () => {
      const idx = employeeSelect.value;
      if (idx === '') return;
      const emp = employees[idx];
      movements.push({ employee: emp, type: 'Ingreso', date: new Date() });
      saveData();
      renderMovementsTable();
      showToast(`Ingreso registrado para ${emp.name}`);
    });

    registerEgresoBtn.addEventListener('click', () => {
      const idx = employeeSelect.value;
      if (idx === '') return;
      const emp = employees[idx];
      movements.push({ employee: emp, type: 'Egreso', date: new Date() });
      saveData();
      renderMovementsTable();
      showToast(`Egreso registrado para ${emp.name}`);
    });

    employeeSelect.addEventListener('change', () => {
      const val = employeeSelect.value;
      registerIngresoBtn.disabled = val === '';
      registerEgresoBtn.disabled = val === '';
      updateSummary();
    });

    searchEmployee.addEventListener('input', () => {
      renderEmployeesTable(searchEmployee.value);
    });

    filterEmployee.addEventListener('change', renderMovementsTable);
    filterType.addEventListener('change', renderMovementsTable);

    btnExport.addEventListener('click', () => {
      if (employees.length === 0 || movements.length === 0) {
        alert('No hay datos para exportar');
        return;
      }
      const wb = XLSX.utils.book_new();
      const wsEmployees = XLSX.utils.json_to_sheet(employees.map(emp => ({Nombre: emp.name, DNI: emp.dni, Puesto: emp.position})));
      const wsMovements = XLSX.utils.json_to_sheet(movements.map(mov => ({Empleado: mov.employee.name, Tipo: mov.type, 'Fecha y Hora': mov.date.toLocaleString('es-AR')})));
      XLSX.utils.book_append_sheet(wb, wsEmployees, 'Empleados');
      XLSX.utils.book_append_sheet(wb, wsMovements, 'Movimientos');
      XLSX.writeFile(wb, `Registro_Asistencia_${new Date().toISOString().slice(0,10)}.xlsx`);
    });

    // INICIALIZACIÓN
    updateEmployeeSelect();
    renderEmployeesTable('');
    renderMovementsTable();
    updateSummary();
  }
})();
