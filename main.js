// =============================================
// DATOS ESTÁTICOS INICIALES
// =============================================
let transacciones = [
    {
        id: 1,
        fecha: '12/05/2026',
        descripcion: 'Deposito en efectivo',
        tipo: 'entrada',
        monto: 500.00,
        referencia: 'DEP-20260512-001',
        cuenta: '0102-0000-12-0000012345',
        estado: 'Completada'
    },
    {
        id: 2,
        fecha: '10/05/2026',
        descripcion: 'Pago Móvil - CANTV',
        tipo: 'salida',
        monto: 120.00,
        referencia: 'PAG-20260510-002',
        cuenta: '0134-0000-44-0000098765',
        estado: 'Completada'
    },
    {
        id: 3,
        fecha: '08/05/2026',
        descripcion: 'Transferencia recibida – Maria Lopez',
        tipo: 'entrada',
        monto: 300.00,
        referencia: 'TRF-20260508-003',
        cuenta: '0105-0000-22-0000055432',
        estado: 'Completada'
    },
    {
        id: 4,
        fecha: '05/05/2026',
        descripcion: 'Transferencia enviada – Luis Martínez',
        tipo: 'salida',
        monto: 200.00,
        referencia: 'TRF-20260505-004',
        cuenta: '0175-0000-66-0000012987',
        estado: 'Completada'
    },
    {
        id: 5,
        fecha: '02/05/2026',
        descripcion: 'Depósito bancario',
        tipo: 'entrada',
        monto: 750.00,
        referencia: 'DEP-20260502-005',
        cuenta: '0102-0000-12-0000012345',
        estado: 'Completada'
    },
    {
        id: 6,
        fecha: '28/04/2026',
        descripcion: 'Pago servicio eléctrico CORPOELEC',
        tipo: 'salida',
        monto: 85.00,
        referencia: 'PAG-20260428-006',
        cuenta: '0102-0000-00-0000000001',
        estado: 'Completada'
    },
    {
        id: 7,
        fecha: '25/04/2026',
        descripcion: 'Compra en comercio – Farmatodo',
        tipo: 'salida',
        monto: 45.50,
        referencia: 'COM-20260425-007',
        cuenta: '0000-0000-00-0000000000',
        estado: 'Completada'
    },
    {
        id: 8,
        fecha: '20/04/2026',
        descripcion: 'Transferencia recibida – Empresa XYZ',
        tipo: 'entrada',
        monto: 1000.00,
        referencia: 'TRF-20260420-008',
        cuenta: '0134-0000-11-0000078900',
        estado: 'Completada'
    }
];

// =============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// =============================================
let saldoActual = 1250.00;
let saldoVisible = true;
let filtroActivo = 'todos';
let usuarioActual = null;

// =============================================
// FUNCIONES AUXILIARES
// =============================================
function formatearMonto(monto) {
    return '$' + monto.toFixed(2);
}

function obtenerFechaActual() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function generarReferencia(prefix) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

function obtenerSiguienteId() {
    if (transacciones.length === 0) return 1;
    return Math.max(...transacciones.map(t => t.id)) + 1;
}

// =============================================
// ACTUALIZACIÓN DE UI (Saldo y Transacciones)
// =============================================
function actualizarSaldoUI() {
    const saldoElement = document.getElementById('saldo-monto');
    if (saldoElement) {
        if (saldoVisible) {
            saldoElement.textContent = formatearMonto(saldoActual);
        } else {
            saldoElement.textContent = '••••••';
        }
    }
}

function renderUltimas() {
    const tbody = document.getElementById('tbody-ultimas');
    if (!tbody) return;
    
    const ultimas = transacciones.slice(0, 3);
    let html = '';
    
    for (const tx of ultimas) {
        const signo = tx.tipo === 'entrada' ? '+' : '-';
        html += `<tr>
            <td>${tx.fecha}</td>
            <td>${tx.descripcion}</td>
            <td><span class="badge badge-${tx.tipo}">${tx.tipo === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
            <td class="monto-${tx.tipo}">${signo}${formatearMonto(tx.monto)}</td>
        </tr>`;
    }
    
    tbody.innerHTML = html;
}

function renderHistorial(filtro) {
    const tbody = document.getElementById('tbody-historial');
    if (!tbody) return;
    
    let lista = filtro === 'todos' 
        ? [...transacciones] 
        : transacciones.filter(tx => tx.tipo === filtro);
    
    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="estado-vacio">No hay transacciones para mostrar.</td></td>';
        return;
    }
    
    let html = '';
    for (const tx of lista) {
        const signo = tx.tipo === 'entrada' ? '+' : '-';
        html += `<tr>
            <td>${tx.fecha}</td>
            <td>${tx.descripcion}</td>
            <td><span class="badge badge-${tx.tipo}">${tx.tipo === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
            <td class="monto-${tx.tipo}">${signo}${formatearMonto(tx.monto)}</td>
            <td><button class="btn-detalle" data-id="${tx.id}">Ver</button></td>
        </tr>`;
    }
    
    tbody.innerHTML = html;
}

function actualizarTodasLasVistas() {
    renderUltimas();
    renderHistorial(filtroActivo);
    actualizarSaldoUI();
}

// =============================================
// AGREGAR NUEVA TRANSACCIÓN
// =============================================
function agregarTransaccion(descripcion, tipo, monto, cuentaDestino) {
    const nuevaTx = {
        id: obtenerSiguienteId(),
        fecha: obtenerFechaActual(),
        descripcion: descripcion,
        tipo: tipo,
        monto: monto,
        referencia: generarReferencia(tipo === 'entrada' ? 'DEP' : 'TRF'),
        cuenta: cuentaDestino || '0102-0000-12-0000012345',
        estado: 'Completada'
    };
    
    transacciones.unshift(nuevaTx);
    
    if (tipo === 'entrada') {
        saldoActual += monto;
    } else {
        saldoActual -= monto;
    }
    
    actualizarTodasLasVistas();
}

// =============================================
// VALIDACIONES Y MENSAJES
// =============================================
function marcarError(campoId, errorId, msg) {
    const campo = document.getElementById(campoId);
    const error = document.getElementById(errorId);
    if (campo) campo.classList.add('invalido');
    if (error) error.textContent = msg;
}

function limpiarError(campoId, errorId) {
    const campo = document.getElementById(campoId);
    const error = document.getElementById(errorId);
    if (campo) campo.classList.remove('invalido');
    if (error) error.textContent = '';
}

function mostrarConfirmacion(elementId, tipo, msg) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = msg;
    el.className = 'confirmacion ' + tipo;
    setTimeout(() => {
        el.className = 'confirmacion';
        el.textContent = '';
    }, 5000);
}

// =============================================
// NAVEGACIÓN ENTRE VISTAS
// =============================================
function navegarA(vistaId) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(vista => vista.classList.remove('active'));
    
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    
    const vistaDestino = document.getElementById('vista-' + vistaId);
    if (vistaDestino) vistaDestino.classList.add('active');
    
    const btnActivo = document.querySelector(`.nav-btn[data-view="${vistaId}"]`);
    if (btnActivo) btnActivo.classList.add('active');
    
    if (vistaId === 'historial') {
        renderHistorial(filtroActivo);
    }
    
    if (vistaId === 'perfil') {
        const profileContainer = document.getElementById('profile-container');
        const logoutScreen = document.getElementById('logout-screen');
        if (profileContainer) profileContainer.classList.remove('hidden');
        if (logoutScreen) logoutScreen.classList.add('hidden');
    }
}

// =============================================
// TOGGLE SALDO Y TEMA
// =============================================
function toggleSaldo() {
    saldoVisible = !saldoVisible;
    const eyeBtn = document.getElementById('toggle-eye');
    if (eyeBtn) {
        eyeBtn.innerHTML = saldoVisible ? '👁️' : '🙈';
        eyeBtn.title = saldoVisible ? 'Ocultar saldo' : 'Mostrar saldo';
    }
    actualizarSaldoUI();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const texto = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    
    const themeBtn = document.getElementById('theme-toggle');
    const authThemeBtn = document.getElementById('auth-theme-toggle');
    if (themeBtn) themeBtn.innerHTML = texto;
    if (authThemeBtn) authThemeBtn.innerHTML = texto;
}

// =============================================
// PERFIL Y USUARIOS (MULTIUSUARIO + USUARIO DEMO)
// =============================================
function cargarUsuarios() {
    const stored = localStorage.getItem('usuariosBanca');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuariosBanca', JSON.stringify(usuarios));
}

function inicializarUsuarioDemo() {
    const usuarios = cargarUsuarios();
    const existeDemo = usuarios.some(u => u.username === 'demo');
    if (!existeDemo) {
        usuarios.push({
            username: 'demo',
            password: '123456',
            preguntaId: '1',
            respuesta: 'perro'
        });
        guardarUsuarios(usuarios);
        console.log('Usuario demo creado: demo / 123456');
    }
}

function registrarUsuario(username, password, preguntaId, respuesta) {
    const usuarios = cargarUsuarios();
    if (usuarios.some(u => u.username === username)) {
        return false;
    }
    usuarios.push({
        username: username,
        password: password,
        preguntaId: preguntaId,
        respuesta: respuesta
    });
    guardarUsuarios(usuarios);
    return true;
}

function actualizarPassword(username, nuevaPassword) {
    const usuarios = cargarUsuarios();
    const usuario = usuarios.find(u => u.username === username);
    if (usuario) {
        usuario.password = nuevaPassword;
        guardarUsuarios(usuarios);
        return true;
    }
    return false;
}

function validarCredenciales(username, password) {
    const usuarios = cargarUsuarios();
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    return usuario !== null;
}

function mostrarDashboard(username) {
    usuarioActual = username;
    document.getElementById('auth-screen').classList.add('hidden');
    document.querySelector('.dashboard-container').classList.remove('hidden');
    
    const displayName = document.getElementById('display-username');
    if (displayName) displayName.textContent = `Bienvenido, ${username}`;
    
    actualizarTodasLasVistas();
    navegarA('inicio');
}

window.volverAlLogin = function() {
    document.querySelector('.dashboard-container').classList.add('hidden');
    document.getElementById('logout-screen').classList.add('hidden');
    document.getElementById('profile-container').classList.remove('hidden');
    
    document.getElementById('login-form').reset();
    const errEl = document.getElementById('err-login');
    if (errEl) {
        errEl.textContent = '';
        errEl.style.color = '';
    }
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.add('hidden');
    document.getElementById('security-questions').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    
    usuarioActual = null;
};

function iniciarLogout() {
    const profileContainer = document.getElementById('profile-container');
    const logoutScreen = document.getElementById('logout-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (profileContainer) profileContainer.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (logoutScreen) logoutScreen.classList.remove('hidden');
    }, 1500);
}

// =============================================
// VALIDACIONES DE FORMULARIOS BANCARIOS
// =============================================
function validarTransferencia(e) {
    e.preventDefault();
    
    const cuenta = document.getElementById('t-cuenta').value.trim();
    const titular = document.getElementById('t-titular').value.trim();
    const monto = parseFloat(document.getElementById('t-monto').value);
    const concepto = document.getElementById('t-concepto').value.trim();
    
    limpiarError('t-cuenta', 'err-t-cuenta');
    limpiarError('t-titular', 'err-t-titular');
    limpiarError('t-monto', 'err-t-monto');
    limpiarError('t-concepto', 'err-t-concepto');
    
    let valido = true;
    
    if (!cuenta || cuenta.length < 10) {
        marcarError('t-cuenta', 'err-t-cuenta', 'Ingrese un número de cuenta válido (mín. 10 dígitos).');
        valido = false;
    }
    if (!titular || titular.length < 3) {
        marcarError('t-titular', 'err-t-titular', 'Ingrese el nombre del titular.');
        valido = false;
    }
    if (isNaN(monto) || monto <= 0) {
        marcarError('t-monto', 'err-t-monto', 'Ingrese un monto válido mayor a 0.');
        valido = false;
    }
    if (!concepto) {
        marcarError('t-concepto', 'err-t-concepto', 'Ingrese un concepto para la transferencia.');
        valido = false;
    }
    if (monto > saldoActual) {
        marcarError('t-monto', 'err-t-monto', 'Fondos insuficientes. Saldo disponible: ' + formatearMonto(saldoActual));
        valido = false;
    }
    
    if (valido) {
        agregarTransaccion(`Transferencia a ${titular} - ${concepto}`, 'salida', monto, cuenta);
        document.getElementById('form-transferencia').reset();
        mostrarConfirmacion('confirmacion-transferencia', 'exito', `✔ Transferencia de ${formatearMonto(monto)} realizada exitosamente a ${titular}.`);
    }
}

function validarPagoMovil(e) {
    e.preventDefault();
    
    const telefono = document.getElementById('pm-telefono').value.trim();
    const cedula = document.getElementById('pm-cedula').value.trim();
    const bancoSelect = document.getElementById('pm-banco');
    const banco = bancoSelect.options[bancoSelect.selectedIndex]?.text || '';
    const monto = parseFloat(document.getElementById('pm-monto').value);
    
    limpiarError('pm-telefono', 'err-pm-telefono');
    limpiarError('pm-cedula', 'err-pm-cedula');
    limpiarError('pm-banco', 'err-pm-banco');
    limpiarError('pm-monto', 'err-pm-monto');
    
    let valido = true;
    
    if (!telefono || telefono.length < 10) {
        marcarError('pm-telefono', 'err-pm-telefono', 'Ingrese un número de teléfono válido.');
        valido = false;
    }
    if (!cedula || cedula.length < 5) {
        marcarError('pm-cedula', 'err-pm-cedula', 'Ingrese la cédula del receptor.');
        valido = false;
    }
    if (!bancoSelect.value) {
        marcarError('pm-banco', 'err-pm-banco', 'Seleccione el banco del receptor.');
        valido = false;
    }
    if (isNaN(monto) || monto <= 0) {
        marcarError('pm-monto', 'err-pm-monto', 'Ingrese un monto válido mayor a 0.');
        valido = false;
    }
    if (monto > saldoActual) {
        marcarError('pm-monto', 'err-pm-monto', 'Fondos insuficientes. Saldo disponible: ' + formatearMonto(saldoActual));
        valido = false;
    }
    
    if (valido) {
        agregarTransaccion(`Pago Móvil a ${telefono} (${banco}) - Cédula: ${cedula}`, 'salida', monto, telefono);
        document.getElementById('form-pago-movil').reset();
        mostrarConfirmacion('confirmacion-pago-movil', 'exito', `✔ Pago de ${formatearMonto(monto)} enviado exitosamente al número ${telefono}.`);
    }
}

function validarDeposito(e) {
    e.preventDefault();
    
    const tipoSelect = document.getElementById('d-tipo');
    const tipo = tipoSelect.options[tipoSelect.selectedIndex]?.text || '';
    const monto = parseFloat(document.getElementById('d-monto').value);
    const referencia = document.getElementById('d-referencia').value.trim();
    
    limpiarError('d-tipo', 'err-d-tipo');
    limpiarError('d-monto', 'err-d-monto');
    
    let valido = true;
    
    if (!tipoSelect.value) {
        marcarError('d-tipo', 'err-d-tipo', 'Seleccione el tipo de depósito.');
        valido = false;
    }
    if (isNaN(monto) || monto <= 0) {
        marcarError('d-monto', 'err-d-monto', 'Ingrese un monto válido mayor a 0.');
        valido = false;
    }
    
    if (valido) {
        let descripcion = `Depósito ${tipo}`;
        if (referencia) descripcion += ` (Ref: ${referencia})`;
        agregarTransaccion(descripcion, 'entrada', monto, 'Depósito en cuenta propia');
        document.getElementById('form-deposito').reset();
        mostrarConfirmacion('confirmacion-deposito', 'exito', `✔ Depósito de ${formatearMonto(monto)} (${tipo}) registrado exitosamente.`);
    }
}

function validarCambioPassword(e) {
    e.preventDefault();
    
    const nuevaPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;
    
    limpiarError('new-password', 'err-password');
    limpiarError('confirm-password', 'err-confirm-password');
    
    let valido = true;
    
    if (!/^\d{6,}$/.test(nuevaPass)) {
        marcarError('new-password', 'err-password', 'La contraseña debe contener mínimo 6 dígitos numéricos.');
        valido = false;
    }
    if (nuevaPass !== confirmPass) {
        marcarError('confirm-password', 'err-confirm-password', 'Las contraseñas no coinciden.');
        valido = false;
    }
    
    if (valido && usuarioActual) {
        actualizarPassword(usuarioActual, nuevaPass);
        document.getElementById('change-password-form').reset();
        mostrarConfirmacion('confirmacion-password', 'exito', '✔ Contraseña actualizada con éxito.');
    }
}

// =============================================
// DETALLE DE TRANSACCIÓN
// =============================================
function verDetalle(id) {
    const tx = transacciones.find(t => t.id === id);
    if (!tx) return;
    
    const icono = tx.tipo === 'entrada' ? '📥' : '📤';
    const signo = tx.tipo === 'entrada' ? '+' : '-';
    const tipoTx = tx.tipo === 'entrada' ? 'Crédito (Ingreso)' : 'Débito (Egreso)';
    
    const html = `
        <div class="detalle-header">
            <div class="detalle-icono ${tx.tipo}">${icono}</div>
            <div>
                <div class="detalle-titulo">${tx.descripcion}</div>
                <div class="detalle-subtitulo">${tipoTx}</div>
            </div>
        </div>
        <div class="detalle-monto-grande ${tx.tipo}">${signo}${formatearMonto(tx.monto)}</div>
        <div class="detalle-fila"><span class="etiqueta">Fecha</span><span class="valor">${tx.fecha}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Referencia</span><span class="valor">${tx.referencia}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Cuenta</span><span class="valor">${tx.cuenta}</span></div>
        <div class="detalle-fila"><span class="etiqueta">Estado</span><span class="valor">${tx.estado}</span></div>
    `;
    
    document.getElementById('detalle-contenido').innerHTML = html;
    navegarA('detalle');
}

// =============================================
// AUTENTICACIÓN: LOGIN, REGISTRO, PREGUNTAS
// =============================================
function manejarLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('err-login');
    
    errEl.textContent = '';
    
    if (!username || !password) {
        errEl.textContent = 'Complete todos los campos.';
        return;
    }
    
    if (validarCredenciales(username, password)) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('auth-loading').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('auth-loading').classList.add('hidden');
            mostrarDashboard(username);
        }, 2000);
    } else {
        errEl.textContent = 'Usuario o contraseña incorrectos.';
    }
}

function manejarRegistro(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm-password').value;
    let valido = true;
    
    document.getElementById('err-reg-username').textContent = '';
    document.getElementById('err-reg-password').textContent = '';
    document.getElementById('err-reg-confirm').textContent = '';
    
    if (!username || username.length < 3) {
        document.getElementById('err-reg-username').textContent = 'El usuario debe tener al menos 3 caracteres.';
        valido = false;
    }
    
    if (!/^\d{6,}$/.test(password)) {
        document.getElementById('err-reg-password').textContent = 'La contraseña debe ser mínimo 6 números.';
        valido = false;
    }
    if (password !== confirm) {
        document.getElementById('err-reg-confirm').textContent = 'Las contraseñas no coinciden.';
        valido = false;
    }
    
    const usuarios = cargarUsuarios();
    if (usuarios.some(u => u.username === username)) {
        document.getElementById('err-reg-username').textContent = 'Este nombre de usuario ya está registrado.';
        valido = false;
    }
    
    if (!valido) return;
    
    localStorage.setItem('tempUser', JSON.stringify({ username: username, password: password }));
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('auth-loading').classList.add('hidden');
        document.getElementById('security-questions').classList.remove('hidden');
    }, 1500);
}

function manejarPreguntas(e) {
    e.preventDefault();
    
    const pregunta = document.getElementById('pregunta-selector').value;
    const respuesta = document.getElementById('respuesta-seguridad').value.trim();
    let valido = true;
    
    document.getElementById('err-pregunta').textContent = '';
    document.getElementById('err-respuesta').textContent = '';
    
    if (!pregunta) {
        document.getElementById('err-pregunta').textContent = 'Seleccione una pregunta de seguridad.';
        valido = false;
    }
    if (!respuesta) {
        document.getElementById('err-respuesta').textContent = 'Ingrese su respuesta.';
        valido = false;
    }
    if (!valido) return;
    
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    if (tempUser) {
        const registrado = registrarUsuario(tempUser.username, tempUser.password, pregunta, respuesta);
        if (registrado) {
            localStorage.removeItem('tempUser');
            document.getElementById('questions-form').reset();
            document.getElementById('register-form').reset();
            document.getElementById('security-questions').classList.add('hidden');
            document.getElementById('login-container').classList.remove('hidden');
            
            const errEl = document.getElementById('err-login');
            errEl.style.color = 'var(--income-color)';
            errEl.textContent = '✔ Registro exitoso. Ya puedes iniciar sesión.';
            setTimeout(() => {
                errEl.textContent = '';
                errEl.style.color = '';
            }, 5000);
        } else {
            document.getElementById('err-pregunta').textContent = 'Error: El usuario ya existe. Intente con otro nombre.';
        }
    }
}

function mostrarRegistro(e) {
    e.preventDefault();
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('hidden');
}

function mostrarLoginForm(e) {
    e.preventDefault();
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarUsuarioDemo();  // <-- Crea usuario demo: demo / 123456
    
    renderUltimas();
    renderHistorial('todos');
    actualizarSaldoUI();
    
    const navBtns = document.querySelectorAll('.nav-btn[data-view]');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const vista = btn.getAttribute('data-view');
            navegarA(vista);
        });
    });
    
    document.getElementById('btn-ver-historial').addEventListener('click', () => {
        renderHistorial(filtroActivo);
        navegarA('historial');
    });
    
    document.getElementById('toggle-eye').addEventListener('click', toggleSaldo);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('auth-theme-toggle').addEventListener('click', toggleTheme);
    
    const btnsFiltro = document.querySelectorAll('.btn-filtro');
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', function() {
            btnsFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroActivo = this.getAttribute('data-filtro');
            renderHistorial(filtroActivo);
        });
    });
    
    document.getElementById('tbody-historial').addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-detalle')) {
            const id = parseInt(e.target.getAttribute('data-id'), 10);
            verDetalle(id);
        }
    });
    
    document.getElementById('btn-volver').addEventListener('click', () => {
        navegarA('historial');
    });
    
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