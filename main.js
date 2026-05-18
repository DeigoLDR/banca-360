// =============================================
// DATOS ESTÁTICOS INICIALES
// =============================================
let transacciones = [
    { id: 1, fecha: '12/05/2026', descripcion: 'Deposito en efectivo', tipo: 'entrada', monto: 500, referencia: 'DEP-001', cuenta: '0102-0000-12-0000012345', estado: 'Completada' },
    { id: 2, fecha: '10/05/2026', descripcion: 'Pago Móvil - CANTV', tipo: 'salida', monto: 120, referencia: 'PAG-002', cuenta: '0134-0000-44-0000098765', estado: 'Completada' },
    { id: 3, fecha: '08/05/2026', descripcion: 'Transferencia recibida – Maria Lopez', tipo: 'entrada', monto: 300, referencia: 'TRF-003', cuenta: '0105-0000-22-0000055432', estado: 'Completada' },
    { id: 4, fecha: '05/05/2026', descripcion: 'Transferencia enviada – Luis Martínez', tipo: 'salida', monto: 200, referencia: 'TRF-004', cuenta: '0175-0000-66-0000012987', estado: 'Completada' },
    { id: 5, fecha: '02/05/2026', descripcion: 'Depósito bancario', tipo: 'entrada', monto: 750, referencia: 'DEP-005', cuenta: '0102-0000-12-0000012345', estado: 'Completada' },
    { id: 6, fecha: '28/04/2026', descripcion: 'Pago servicio eléctrico', tipo: 'salida', monto: 85, referencia: 'PAG-006', cuenta: '0102-0000-00-0000000001', estado: 'Completada' },
    { id: 7, fecha: '25/04/2026', descripcion: 'Compra en Farmatodo', tipo: 'salida', monto: 45.5, referencia: 'COM-007', cuenta: '0000-0000-00-0000000000', estado: 'Completada' },
    { id: 8, fecha: '20/04/2026', descripcion: 'Transferencia recibida – Empresa XYZ', tipo: 'entrada', monto: 1000, referencia: 'TRF-008', cuenta: '0134-0000-11-0000078900', estado: 'Completada' }
];

let saldoActual = 1250.00;
let saldoVisible = false;   // 🔒 Saldo oculto por defecto
let filtroActivo = 'todos';
let usuarioActual = null;
let datosUsuarioActual = null;

// =============================================
// FUNCIONES AUXILIARES
// =============================================
function formatearMonto(monto) { return '$' + monto.toFixed(2); }
function obtenerFechaActual() {
    let hoy = new Date();
    return `${hoy.getDate().toString().padStart(2,'0')}/${(hoy.getMonth()+1).toString().padStart(2,'0')}/${hoy.getFullYear()}`;
}
function generarReferencia(prefix) { return `${prefix}-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*1000)}`; }
function obtenerSiguienteId() { return transacciones.length ? Math.max(...transacciones.map(t=>t.id))+1 : 1; }

// =============================================
// ACTUALIZAR UI
// =============================================
function actualizarSaldoUI() {
    let el = document.getElementById('saldo-monto');
    if (el) el.textContent = saldoVisible ? formatearMonto(saldoActual) : '••••••';
}
function renderUltimas() {
    let tbody = document.getElementById('tbody-ultimas');
    if (!tbody) return;
    let html = '';
    transacciones.slice(0,3).forEach(tx => {
        let signo = tx.tipo === 'entrada' ? '+' : '-';
        html += `<tr>
            <td>${tx.fecha}</td>
            <td>${tx.descripcion}</td>
            <td><span class="badge badge-${tx.tipo}">${tx.tipo==='entrada'?'Entrada':'Salida'}</span></td>
            <td class="monto-${tx.tipo}">${signo}${formatearMonto(tx.monto)}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}
function renderHistorial(filtro) {
    let tbody = document.getElementById('tbody-historial');
    if (!tbody) return;
    let lista = filtro === 'todos' ? [...transacciones] : transacciones.filter(tx => tx.tipo === filtro);
    if (lista.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="estado-vacio">No hay transacciones.</td></tr>'; return; }
    let html = '';
    lista.forEach(tx => {
        let signo = tx.tipo === 'entrada' ? '+' : '-';
        html += `<tr>
            <td>${tx.fecha}</td>
            <td>${tx.descripcion}</td>
            <td><span class="badge badge-${tx.tipo}">${tx.tipo==='entrada'?'Entrada':'Salida'}</span></td>
            <td class="monto-${tx.tipo}">${signo}${formatearMonto(tx.monto)}</td>
            <td><button class="btn-detalle" data-id="${tx.id}">Ver</button></td>
        </tr>`;
    });
    tbody.innerHTML = html;
}
function actualizarTodasLasVistas() { renderUltimas(); renderHistorial(filtroActivo); actualizarSaldoUI(); }

// =============================================
// AGREGAR TRANSACCIÓN
// =============================================
function agregarTransaccion(descripcion, tipo, monto, cuentaDestino) {
    transacciones.unshift({
        id: obtenerSiguienteId(), fecha: obtenerFechaActual(), descripcion, tipo, monto,
        referencia: generarReferencia(tipo==='entrada'?'DEP':'TRF'),
        cuenta: cuentaDestino || '0102-0000-12-0000012345', estado: 'Completada'
    });
    if (tipo === 'entrada') saldoActual += monto;
    else saldoActual -= monto;
    actualizarTodasLasVistas();
}

// =============================================
// VALIDACIONES Y MENSAJES
// =============================================
function marcarError(campoId, errorId, msg) {
    let campo = document.getElementById(campoId);
    let error = document.getElementById(errorId);
    if (campo) campo.classList.add('invalido');
    if (error) error.textContent = msg;
}
function limpiarError(campoId, errorId) {
    let campo = document.getElementById(campoId);
    let error = document.getElementById(errorId);
    if (campo) campo.classList.remove('invalido');
    if (error) error.textContent = '';
}
function mostrarConfirmacion(elementId, tipo, msg) {
    let el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = msg;
    el.className = 'confirmacion ' + tipo;
    setTimeout(() => { el.className = 'confirmacion'; el.textContent = ''; }, 5000);
}

// =============================================
// NAVEGACIÓN
// =============================================
function navegarA(vistaId) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let vistaDestino = document.getElementById('vista-' + vistaId);
    if (vistaDestino) vistaDestino.classList.add('active');
    let btnActivo = document.querySelector(`.nav-btn[data-view="${vistaId}"]`);
    if (btnActivo) btnActivo.classList.add('active');
    if (vistaId === 'historial') renderHistorial(filtroActivo);
    if (vistaId === 'perfil') {
        document.getElementById('profile-container').classList.remove('hidden');
        document.getElementById('logout-screen').classList.add('hidden');
        cargarDatosPerfil();
    }
}

// =============================================
// TOGGLE SALDO Y TEMA
// =============================================
function toggleSaldo() {
    saldoVisible = !saldoVisible;
    let eye = document.getElementById('toggle-eye');
    if (eye) {
        eye.innerHTML = saldoVisible ? '👁️' : '🙈';
        eye.title = saldoVisible ? 'Ocultar saldo' : 'Mostrar saldo';
    }
    actualizarSaldoUI();
}
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    let isDark = document.body.classList.contains('dark-mode');
    let texto = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    let btn1 = document.getElementById('theme-toggle');
    let btn2 = document.getElementById('auth-theme-toggle');
    if (btn1) btn1.innerHTML = texto;
    if (btn2) btn2.innerHTML = texto;
}

// =============================================
// PERFIL Y USUARIOS
// =============================================
function cargarUsuarios() {
    let stored = localStorage.getItem('usuariosBanca');
    return stored ? JSON.parse(stored) : [];
}
function guardarUsuarios(usuarios) { localStorage.setItem('usuariosBanca', JSON.stringify(usuarios)); }
function registrarUsuario(username, cedula, correo, telefono, password, preguntaId, respuesta) {
    let usuarios = cargarUsuarios();
    if (usuarios.some(u => u.username === username)) return false;
    usuarios.push({ username, cedula, correo, telefono, password, preguntaId, respuesta });
    guardarUsuarios(usuarios);
    return true;
}
function actualizarPassword(username, nuevaPassword) {
    let usuarios = cargarUsuarios();
    let user = usuarios.find(u => u.username === username);
    if (user) { user.password = nuevaPassword; guardarUsuarios(usuarios); return true; }
    return false;
}
function validarCredenciales(username, password) {
    let usuarios = cargarUsuarios();
    return usuarios.some(u => u.username === username && u.password === password);
}
function obtenerUsuarioPorUsername(username) {
    return cargarUsuarios().find(u => u.username === username);
}
function cargarDatosPerfil() {
    if (!usuarioActual) return;
    let user = obtenerUsuarioPorUsername(usuarioActual);
    if (!user) return;
    let perfilDiv = document.getElementById('perfil-datos');
    if (perfilDiv) {
        perfilDiv.innerHTML = `
            <p><span class="etiqueta">Usuario</span><span class="valor">${user.username}</span></p>
            <p><span class="etiqueta">Cédula</span><span class="valor">${user.cedula}</span></p>
            <p><span class="etiqueta">Correo</span><span class="valor">${user.correo}</span></p>
            <p><span class="etiqueta">Teléfono</span><span class="valor">${user.telefono}</span></p>
            <p><span class="etiqueta">Número de cuenta</span><span class="valor">0102-0000-12-0000012345</span></p>
            <p><span class="etiqueta">Tipo de cuenta</span><span class="valor">Cuenta Corriente</span></p>
        `;
    }
    let displayName = document.getElementById('display-username');
    if (displayName) displayName.textContent = `Bienvenido, ${user.username}`;
}
function mostrarDashboard(username) {
    usuarioActual = username;
    datosUsuarioActual = obtenerUsuarioPorUsername(username);
    document.getElementById('auth-screen').classList.add('hidden');
    document.querySelector('.dashboard-container').classList.remove('hidden');
    cargarDatosPerfil();
    actualizarTodasLasVistas();
    // Ajustar botón ojo para estado oculto
    let eyeBtn = document.getElementById('toggle-eye');
    if (eyeBtn) {
        eyeBtn.innerHTML = '🙈';
        eyeBtn.title = 'Mostrar saldo';
    }
    navegarA('inicio');
}
window.volverAlLogin = function() {
    document.querySelector('.dashboard-container').classList.add('hidden');
    document.getElementById('logout-screen').classList.add('hidden');
    document.getElementById('profile-container').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('err-login').textContent = '';
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.add('hidden');
    document.getElementById('security-questions').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    usuarioActual = null;
};
function iniciarLogout() {
    document.getElementById('profile-container').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('logout-screen').classList.remove('hidden');
    }, 1500);
}

// =============================================
// VALIDACIONES DE FORMULARIOS BANCARIOS
// =============================================
function validarTransferencia(e) {
    e.preventDefault();
    let cuenta = document.getElementById('t-cuenta').value.trim();
    let titular = document.getElementById('t-titular').value.trim();
    let monto = parseFloat(document.getElementById('t-monto').value);
    let concepto = document.getElementById('t-concepto').value.trim();
    limpiarError('t-cuenta','err-t-cuenta'); limpiarError('t-titular','err-t-titular'); limpiarError('t-monto','err-t-monto'); limpiarError('t-concepto','err-t-concepto');
    if (!cuenta || cuenta.length<10) { marcarError('t-cuenta','err-t-cuenta','Cuenta inválida'); return; }
    if (!titular || titular.length<3) { marcarError('t-titular','err-t-titular','Titular requerido'); return; }
    if (isNaN(monto) || monto<=0) { marcarError('t-monto','err-t-monto','Monto mayor a 0'); return; }
    if (!concepto) { marcarError('t-concepto','err-t-concepto','Concepto requerido'); return; }
    if (monto > saldoActual) { marcarError('t-monto','err-t-monto','Fondos insuficientes. Saldo: '+formatearMonto(saldoActual)); return; }
    agregarTransaccion(`Transferencia a ${titular} - ${concepto}`, 'salida', monto, cuenta);
    document.getElementById('form-transferencia').reset();
    mostrarConfirmacion('confirmacion-transferencia','exito',`✔ Transferencia de ${formatearMonto(monto)} exitosa.`);
}
function validarPagoMovil(e) {
    e.preventDefault();
    let telefono = document.getElementById('pm-telefono').value.trim();
    let cedula = document.getElementById('pm-cedula').value.trim();
    let banco = document.getElementById('pm-banco').value;
    let monto = parseFloat(document.getElementById('pm-monto').value);
    limpiarError('pm-telefono','err-pm-telefono'); limpiarError('pm-cedula','err-pm-cedula'); limpiarError('pm-banco','err-pm-banco'); limpiarError('pm-monto','err-pm-monto');
    let telefonoRegex = /^0\d{3}-\d{7}$/;
    if (!telefono || !telefonoRegex.test(telefono)) { marcarError('pm-telefono','err-pm-telefono','Formato: 0XXX-XXXXXXX'); return; }
    if (!cedula || cedula.length<5) { marcarError('pm-cedula','err-pm-cedula','Cédula requerida'); return; }
    if (!banco) { marcarError('pm-banco','err-pm-banco','Seleccione banco'); return; }
    if (isNaN(monto) || monto<=0) { marcarError('pm-monto','err-pm-monto','Monto mayor a 0'); return; }
    if (monto > saldoActual) { marcarError('pm-monto','err-pm-monto','Fondos insuficientes'); return; }
    agregarTransaccion(`Pago Móvil a ${telefono} (${banco}) - Céd: ${cedula}`, 'salida', monto, telefono);
    document.getElementById('form-pago-movil').reset();
    mostrarConfirmacion('confirmacion-pago-movil','exito',`✔ Pago de ${formatearMonto(monto)} enviado.`);
}
function validarDeposito(e) {
    e.preventDefault();
    let tipo = document.getElementById('d-tipo').value;
    let monto = parseFloat(document.getElementById('d-monto').value);
    let referencia = document.getElementById('d-referencia').value.trim();
    limpiarError('d-tipo','err-d-tipo'); limpiarError('d-monto','err-d-monto');
    if (!tipo) { marcarError('d-tipo','err-d-tipo','Seleccione tipo'); return; }
    if (isNaN(monto) || monto<=0) { marcarError('d-monto','err-d-monto','Monto mayor a 0'); return; }
    let descripcion = `Depósito ${tipo}${referencia ? ' (Ref: '+referencia+')' : ''}`;
    agregarTransaccion(descripcion, 'entrada', monto, 'Depósito');
    document.getElementById('form-deposito').reset();
    mostrarConfirmacion('confirmacion-deposito','exito',`✔ Depósito de ${formatearMonto(monto)} registrado.`);
}
function validarCambioPassword(e) {
    e.preventDefault();
    let nueva = document.getElementById('new-password').value;
    let conf = document.getElementById('confirm-password').value;
    limpiarError('new-password','err-password'); limpiarError('confirm-password','err-confirm-password');
    if (!/^\d{6,}$/.test(nueva)) { marcarError('new-password','err-password','Mínimo 6 números'); return; }
    if (nueva !== conf) { marcarError('confirm-password','err-confirm-password','No coinciden'); return; }
    if (usuarioActual && actualizarPassword(usuarioActual, nueva)) {
        document.getElementById('change-password-form').reset();
        mostrarConfirmacion('confirmacion-password','exito','✔ Contraseña actualizada.');
    }
}
function verDetalle(id) {
    let tx = transacciones.find(t=>t.id===id);
    if(!tx) return;
    let icono = tx.tipo==='entrada'?'📥':'📤';
    let signo = tx.tipo==='entrada'?'+':'-';
    let tipoTx = tx.tipo==='entrada'?'Crédito':'Débito';
    document.getElementById('detalle-contenido').innerHTML = `
        <div class="detalle-header"><div class="detalle-icono ${tx.tipo}">${icono}</div><div><div class="detalle-titulo">${tx.descripcion}</div><div class="detalle-subtitulo">${tipoTx}</div></div></div>
        <div class="detalle-monto-grande ${tx.tipo}">${signo}${formatearMonto(tx.monto)}</div>
        <div class="detalle-fila"><span class="etiqueta">Fecha</span><span class="valor">${tx.fecha}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Referencia</span><span class="valor">${tx.referencia}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Cuenta</span><span class="valor">${tx.cuenta}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Estado</span><span class="valor">${tx.estado}</span></div>`;
    navegarA('detalle');
}

// =============================================
// LOGIN, REGISTRO Y PREGUNTAS
// =============================================
function manejarLogin(e) {
    e.preventDefault();
    let username = document.getElementById('login-username').value.trim();
    let password = document.getElementById('login-password').value;
    let err = document.getElementById('err-login');
    err.textContent = '';
    if (!username || !password) { err.textContent = 'Complete todos los campos.'; return; }
    if (validarCredenciales(username, password)) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('auth-loading').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('auth-loading').classList.add('hidden');
            mostrarDashboard(username);
        }, 2000);
    } else {
        err.textContent = 'Usuario o contraseña incorrectos.';
    }
}
function manejarRegistro(e) {
    e.preventDefault();
    let username = document.getElementById('reg-username').value.trim();
    let cedula = document.getElementById('reg-cedula').value.trim();
    let correo = document.getElementById('reg-correo').value.trim();
    let telefono = document.getElementById('reg-telefono').value.trim();
    let password = document.getElementById('reg-password').value;
    let confirm = document.getElementById('reg-confirm-password').value;
    let valido = true;
    ['username','cedula','correo','telefono','password','confirm'].forEach(id => {
        document.getElementById(`err-reg-${id}`).textContent = '';
    });
    if (!username || username.length < 3) {
        document.getElementById('err-reg-username').textContent = 'Mínimo 3 caracteres.';
        valido = false;
    }
    if (!/^\d{7,8}$/.test(cedula)) {
        document.getElementById('err-reg-cedula').textContent = 'Cédula inválida (7 u 8 dígitos).';
        valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        document.getElementById('err-reg-correo').textContent = 'Correo electrónico inválido.';
        valido = false;
    }
    let telefonoRegex = /^0\d{3}-\d{7}$/;
    if (!telefonoRegex.test(telefono)) {
        document.getElementById('err-reg-telefono').textContent = 'Formato: 0XXX-XXXXXXX (ej: 0412-1234567)';
        valido = false;
    }
    if (!/^\d{6,}$/.test(password)) {
        document.getElementById('err-reg-password').textContent = 'Mínimo 6 números.';
        valido = false;
    }
    if (password !== confirm) {
        document.getElementById('err-reg-confirm').textContent = 'Las contraseñas no coinciden.';
        valido = false;
    }
    let usuarios = cargarUsuarios();
    if (usuarios.some(u => u.username === username)) {
        document.getElementById('err-reg-username').textContent = 'Usuario ya registrado.';
        valido = false;
    }
    if (!valido) return;
    localStorage.setItem('tempUser', JSON.stringify({ username, cedula, correo, telefono, password }));
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('auth-loading').classList.add('hidden');
        document.getElementById('security-questions').classList.remove('hidden');
    }, 1500);
}
function manejarPreguntas(e) {
    e.preventDefault();
    let pregunta = document.getElementById('pregunta-selector').value;
    let respuesta = document.getElementById('respuesta-seguridad').value.trim();
    let valido = true;
    document.getElementById('err-pregunta').textContent = '';
    document.getElementById('err-respuesta').textContent = '';
    if (!pregunta) {
        document.getElementById('err-pregunta').textContent = 'Seleccione una pregunta.';
        valido = false;
    }
    if (!respuesta) {
        document.getElementById('err-respuesta').textContent = 'Respuesta requerida.';
        valido = false;
    }
    if (!valido) return;
    let temp = JSON.parse(localStorage.getItem('tempUser'));
    if (temp) {
        let ok = registrarUsuario(temp.username, temp.cedula, temp.correo, temp.telefono, temp.password, pregunta, respuesta);
        if (ok) {
            localStorage.removeItem('tempUser');
            document.getElementById('questions-form').reset();
            document.getElementById('register-form').reset();
            document.getElementById('security-questions').classList.add('hidden');
            document.getElementById('login-container').classList.remove('hidden');
            let errEl = document.getElementById('err-login');
            errEl.style.color = 'var(--income-color)';
            errEl.textContent = '✔ Registro exitoso. Ya puedes iniciar sesión.';
            setTimeout(() => { errEl.textContent = ''; errEl.style.color = ''; }, 5000);
        } else {
            document.getElementById('err-pregunta').textContent = 'Error: El usuario ya existe.';
        }
    }
}
function mostrarRegistro(e) { e.preventDefault(); document.getElementById('login-container').classList.add('hidden'); document.getElementById('register-container').classList.remove('hidden'); }
function mostrarLoginForm(e) { e.preventDefault(); document.getElementById('register-container').classList.add('hidden'); document.getElementById('login-container').classList.remove('hidden'); }

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Crear usuario demo
    let usuarios = cargarUsuarios();
    if (!usuarios.some(u => u.username === 'demo')) {
        usuarios.push({
            username: 'demo', cedula: '12345678', correo: 'demo@banca360.com', telefono: '0412-1234567',
            password: '123456', preguntaId: '1', respuesta: 'perro'
        });
        guardarUsuarios(usuarios);
    }
    renderUltimas();
    renderHistorial('todos');
    actualizarSaldoUI();

    // Configurar botón ojo inicialmente cerrado
    let eyeBtn = document.getElementById('toggle-eye');
    if (eyeBtn) {
        eyeBtn.innerHTML = '🙈';
        eyeBtn.title = 'Mostrar saldo';
    }

    // Eventos
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => btn.addEventListener('click', () => navegarA(btn.getAttribute('data-view'))));
    document.getElementById('btn-ver-historial').addEventListener('click', () => { renderHistorial(filtroActivo); navegarA('historial'); });
    document.getElementById('toggle-eye').addEventListener('click', toggleSaldo);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('auth-theme-toggle').addEventListener('click', toggleTheme);
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-filtro').forEach(b=>b.classList.remove('active'));
        this.classList.add('active');
        filtroActivo = this.getAttribute('data-filtro');
        renderHistorial(filtroActivo);
    }));
    document.getElementById('tbody-historial').addEventListener('click', e => { if(e.target.classList.contains('btn-detalle')) verDetalle(parseInt(e.target.dataset.id)); });
    document.getElementById('btn-volver').addEventListener('click', () => navegarA('historial'));
    document.getElementById('form-transferencia').addEventListener('submit', validarTransferencia);
    document.getElementById('form-pago-movil').addEventListener('submit', validarPagoMovil);
    document.getElementById('form-deposito').addEventListener('submit', validarDeposito);
    document.getElementById('change-password-form').addEventListener('submit', validarCambioPassword);
    document.getElementById('logout-btn').addEventListener('click', iniciarLogout);
    document.getElementById('link-a-registro').addEventListener('click', mostrarRegistro);
    document.getElementById('link-a-login').addEventListener('click', mostrarLoginForm);
    document.getElementById('login-form').addEventListener('submit', manejarLogin);
    document.getElementById('register-form').addEventListener('submit', manejarRegistro);
    document.getElementById('questions-form').addEventListener('submit', manejarPreguntas);
});