/* 
   Datos estaticos – transacciones simuladas 
   */
var transacciones = [
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

/* 
   Estado de la aplicacion : Variables de control

 */
var saldoVisible   = true;
var filtroActivo   = 'todos';
var vistaAnterior  = 'historial';

/* 
   Navegacion  
   */
function navegarA(vistaId) {
    /* Ocultar todas las vistas */
    let vistas = document.querySelectorAll('.vista');
    for (let i = 0; i < vistas.length; i++) {
        vistas[i].classList.remove('active');
    }

    /* Desactivar todos los botones de navegación */
    let botones = document.querySelectorAll('.nav-btn');
    for (let j = 0; j < botones.length; j++) {
        botones[j].classList.remove('active');
    }

    /* Activar la vista destino */
    let vistaDestino = document.getElementById('vista-' + vistaId);
    if (vistaDestino) {
        vistaDestino.classList.add('active');
    }

    /* Marcar el botón de nav correspondiente */
    let btnActivo = document.querySelector('.nav-btn[data-view="' + vistaId + '"]');
    if (btnActivo) {
        btnActivo.classList.add('active');
    }
}

/* 
   Ocultar / Mostrar saldo
 */
function toggleSaldo() {
    let saldoEl = document.getElementById('saldo-monto');
    let eyeBtn  = document.getElementById('toggle-eye');

    saldoVisible = !saldoVisible;

    if (saldoVisible) {
        saldoEl.textContent = '$1,250.00';
        eyeBtn.innerHTML = '&#128065;&#65039;';
        eyeBtn.title = 'Ocultar saldo';
    } else {
        saldoEl.textContent = '••••••';
        eyeBtn.innerHTML = '&#128584;';
        eyeBtn.title = 'Mostrar saldo';
    }
}

/*
   Cambiar Modo Oscuro — sincroniza ambos botones de tema (dashboard y auth)
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    let texto = document.body.classList.contains('dark-mode')
        ? '&#9728;&#65039; Modo Claro'
        : '&#127769; Modo Oscuro';
    let b1 = document.getElementById('theme-toggle');
    let b2 = document.getElementById('auth-theme-toggle');
    if (b1) b1.innerHTML = texto;
    if (b2) b2.innerHTML = texto;
}

/* 
   
   Renderizar las ultimas 3 trasacciones del dashboard
 */
function renderUltimas() {
    let tbody  = document.getElementById('tbody-ultimas');
    let ultimas = transacciones.slice(0, 3);
    let html   = '';

    for (let i = 0; i < ultimas.length; i++) {
        let tx   = ultimas[i];
        let signo = tx.tipo === 'entrada' ? '+' : '-';
        html += '<tr>' +
            '<td>' + tx.fecha + '</td>' +
            '<td>' + tx.descripcion + '</td>' +
            '<td><span class="badge badge-' + tx.tipo + '">' + (tx.tipo === 'entrada' ? 'Entrada' : 'Salida') + '</span></td>' +
            '<td class="monto-' + tx.tipo + '">' + signo + '$' + tx.monto.toFixed(2) + '</td>' +
            '</tr>';
    }

    tbody.innerHTML = html;
}

/* 
   Renderizar historial con filtro
  */
function renderHistorial(filtro) {
    let tbody = document.getElementById('tbody-historial');
    let lista;

    if (filtro === 'todos') {
        lista = transacciones;
    } else {
        lista = [];
        for (let i = 0; i < transacciones.length; i++) {
            if (transacciones[i].tipo === filtro) {
                lista.push(transacciones[i]);
            }
        }
    }

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="estado-vacio">No hay transacciones para mostrar.</td></tr>';
        return;
    }

    let html = '';
    for (let j = 0; j < lista.length; j++) {
        let tx   = lista[j];
        let signo = tx.tipo === 'entrada' ? '+' : '-';
        html += '<tr>' +
            '<td>' + tx.fecha + '</td>' +
            '<td>' + tx.descripcion + '</td>' +
            '<td><span class="badge badge-' + tx.tipo + '">' + (tx.tipo === 'entrada' ? 'Entrada' : 'Salida') + '</span></td>' +
            '<td class="monto-' + tx.tipo + '">' + signo + '$' + tx.monto.toFixed(2) + '</td>' +
            '<td><button class="btn-detalle" data-id="' + tx.id + '">Ver</button></td>' +
            '</tr>';
    }

    tbody.innerHTML = html;
}

/*
   Detalle de Transaccion
  */
function verDetalle(id) {
    let tx = null;
    for (let i = 0; i < transacciones.length; i++) {
        if (transacciones[i].id === id) {
            tx = transacciones[i];
            break;
        }
    }
    if (!tx) return;

    let icono  = tx.tipo === 'entrada' ? '&#128229;' : '&#128228;';
    let signo  = tx.tipo === 'entrada' ? '+' : '-';
    let tipoTx = tx.tipo === 'entrada' ? 'Crédito (Ingreso)' : 'Débito (Egreso)';

    let html = '<div class="detalle-header">' +
        '  <div class="detalle-icono ' + tx.tipo + '">' + icono + '</div>' +
        '  <div>' +
        '    <div class="detalle-titulo">' + tx.descripcion + '</div>' +
        '    <div class="detalle-subtitulo">' + tipoTx + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="detalle-monto-grande ' + tx.tipo + '">' + signo + '$' + tx.monto.toFixed(2) + '</div>' +
        '<div class="detalle-fila"><span class="etiqueta">Fecha</span><span class="valor">' + tx.fecha + '</span></div>' +
        '<div class="detalle-fila"><span class="etiqueta">Referencia</span><span class="valor">' + tx.referencia + '</span></div>' +
        '<div class="detalle-fila"><span class="etiqueta">Cuenta</span><span class="valor">' + tx.cuenta + '</span></div>' +
        '<div class="detalle-fila"><span class="etiqueta">Estado</span><span class="valor">' + tx.estado + '</span></div>';

    document.getElementById('detalle-contenido').innerHTML = html;
    navegarA('detalle');
}
/*
   
   Validacion de formularios - utilidades
  */
function marcarError(campoId, errorId, msg) {
    let campo = document.getElementById(campoId);
    let error = document.getElementById(errorId);
    campo.classList.add('invalido');
    error.textContent = msg;
}

function limpiarError(campoId, errorId) {
    let campo = document.getElementById(campoId);
    let error = document.getElementById(errorId);
    campo.classList.remove('invalido');
    if (error) error.textContent = '';
}

function mostrarConfirmacion(elementId, tipo, msg) {
    let el = document.getElementById(elementId);
    el.textContent = msg;
    el.className = 'confirmacion ' + tipo;
    setTimeout(function () {
        el.className = 'confirmacion';
        el.textContent = '';
    }, 5000);
}

/* 
   Validar Transferencia
 */
function validarTransferencia(e) {
    e.preventDefault();
    let valido = true;

    let cuenta  = document.getElementById('t-cuenta').value.trim();
    let titular = document.getElementById('t-titular').value.trim();
    let monto   = parseFloat(document.getElementById('t-monto').value);
    let concepto= document.getElementById('t-concepto').value.trim();

    limpiarError('t-cuenta',  'err-t-cuenta');
    limpiarError('t-titular', 'err-t-titular');
    limpiarError('t-monto',   'err-t-monto');
    limpiarError('t-concepto','err-t-concepto');

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

    if (valido) {
        document.getElementById('form-transferencia').reset();
        mostrarConfirmacion(
            'confirmacion-transferencia',
            'exito',
            '✔ Transferencia de $' + monto.toFixed(2) + ' realizada exitosamente a ' + titular + '.'
        );
    }
}

/* 
   Validar pago Movil
 */
function validarPagoMovil(e) {
    e.preventDefault();
    let valido = true;

    let telefono = document.getElementById('pm-telefono').value.trim();
    let cedula   = document.getElementById('pm-cedula').value.trim();
    let banco    = document.getElementById('pm-banco').value;
    let monto    = parseFloat(document.getElementById('pm-monto').value);

    limpiarError('pm-telefono', 'err-pm-telefono');
    limpiarError('pm-cedula',   'err-pm-cedula');
    limpiarError('pm-banco',    'err-pm-banco');
    limpiarError('pm-monto',    'err-pm-monto');

    if (!telefono || telefono.length < 10) {
        marcarError('pm-telefono', 'err-pm-telefono', 'Ingrese un número de teléfono válido.');
        valido = false;
    }
    if (!cedula || cedula.length < 5) {
        marcarError('pm-cedula', 'err-pm-cedula', 'Ingrese la cédula del receptor.');
        valido = false;
    }
    if (!banco) {
        marcarError('pm-banco', 'err-pm-banco', 'Seleccione el banco del receptor.');
        valido = false;
    }
    if (isNaN(monto) || monto <= 0) {
        marcarError('pm-monto', 'err-pm-monto', 'Ingrese un monto válido mayor a 0.');
        valido = false;
    }

    if (valido) {
        document.getElementById('form-pago-movil').reset();
        mostrarConfirmacion(
            'confirmacion-pago-movil',
            'exito',
            '✔ Pago de $' + monto.toFixed(2) + ' enviado exitosamente al número ' + telefono + '.'
        );
    }
}



/* Muestra el dashboard tras un login exitoso */
function mostrarDashboard(username) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.querySelector('.dashboard-container').classList.remove('hidden');
    showProfile(username);
    navegarA('inicio');
}

/* Regresa al login después del logout (llamado desde #logout-screen) */
function volverAlLogin() {
    document.querySelector('.dashboard-container').classList.add('hidden');
    document.getElementById('logout-screen').classList.add('hidden');
    document.getElementById('profile-container').classList.remove('hidden');
    navegarA('inicio');

    document.getElementById('login-form').reset();
    let errEl = document.getElementById('err-login');
    errEl.textContent = '';
    errEl.style.color = '';
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.add('hidden');
    document.getElementById('security-questions').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
}

/* Alterna entre las pantallas de login y registro */
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

/* Manejo del formulario de LOGIN */
function manejarLogin(e) {
    e.preventDefault();
    let uIn   = document.getElementById('login-username').value.trim();
    let pIn   = document.getElementById('login-password').value;
    let errEl = document.getElementById('err-login');

    errEl.style.color = '';
    errEl.textContent = '';

    if (!uIn || !pIn) {
        errEl.textContent = 'Complete todos los campos.';
        return;
    }

    let stored = JSON.parse(localStorage.getItem('usuarioBanca'));

    if (stored && uIn === stored.username && pIn === stored.password) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('auth-loading').classList.remove('hidden');
        setTimeout(function () {
            document.getElementById('auth-loading').classList.add('hidden');
            mostrarDashboard(stored.username);
        }, 1500);
    } else {
        errEl.textContent = 'Usuario o contraseña incorrectos.';
    }
}

/* Manejo del formulario de REGISTRO */
function manejarRegistro(e) {
    e.preventDefault();
    let user    = document.getElementById('reg-username').value.trim();
    let pass    = document.getElementById('reg-password').value;
    let confirm = document.getElementById('reg-confirm-password').value;
    let valido  = true;

    document.getElementById('err-reg-username').textContent = '';
    document.getElementById('err-reg-password').textContent = '';
    document.getElementById('err-reg-confirm').textContent  = '';

    if (!user || user.length < 3) {
        document.getElementById('err-reg-username').textContent = 'El usuario debe tener al menos 3 caracteres.';
        valido = false;
    }
    
    if (!/^\d{6,}$/.test(pass)) {
        document.getElementById('err-reg-password').textContent = 'La contraseña debe ser mínimo 6 números.';
        valido = false;
    }
    if (pass !== confirm) {
        document.getElementById('err-reg-confirm').textContent = 'Las contraseñas no coinciden.';
        valido = false;
    }
    if (!valido) return;

    localStorage.setItem('tempUser', JSON.stringify({ username: user, password: pass }));
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('auth-loading').classList.remove('hidden');

    setTimeout(function () {
        document.getElementById('auth-loading').classList.add('hidden');
        document.getElementById('security-questions').classList.remove('hidden');
    }, 1500);
}

/* Manejo del formulario de PREGUNTAS DE SEGURIDAD */
function manejarPreguntas(e) {
    e.preventDefault();
    let pregunta  = document.getElementById('pregunta-selector').value;
    let respuesta = document.getElementById('respuesta-seguridad').value.trim();
    let valido    = true;

    document.getElementById('err-pregunta').textContent  = '';
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

    let userData = JSON.parse(localStorage.getItem('tempUser'));
    userData.preguntaId = pregunta;
    userData.respuesta  = respuesta;
    localStorage.setItem('usuarioBanca', JSON.stringify(userData));
    localStorage.removeItem('tempUser');

    document.getElementById('questions-form').reset();
    document.getElementById('register-form').reset();
    document.getElementById('security-questions').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');

    /* Mensaje de éxito en el login */
    let errEl = document.getElementById('err-login');
    errEl.style.color = 'var(--income-color)';
    errEl.textContent = '✔ Registro exitoso. Ya puedes iniciar sesión.';
    setTimeout(function () {
        errEl.textContent = '';
        errEl.style.color = '';
    }, 5000);
}

/*
   Perfil  (codigo origen)
   */

/* Muestra el nombre de usuario en el perfil (simula inicio de sesión exitoso) */
function showProfile(username) {
    let el = document.getElementById('display-username');
    if (el) {
        el.textContent = 'Bienvenido, ' + username;
    }
}

/* Validación del formulario de cambio de contraseña */
function validarCambioPassword(e) {
    e.preventDefault();
    let valido = true;

    let nuevaPass   = document.getElementById('new-password').value;
    let confirmPass = document.getElementById('confirm-password').value;
    limpiarError('new-password',     'err-password');
    limpiarError('confirm-password', 'err-confirm-password');

    if (!nuevaPass || nuevaPass.length < 6) {
        marcarError('new-password', 'err-password', 'La contraseña debe tener al menos 6 caracteres.');
        valido = false;
    }
    if (confirmPass !== nuevaPass) {
        marcarError('confirm-password', 'err-confirm-password', 'Las contraseñas no coinciden.');
        valido = false;
    }

    if (valido) {
        document.getElementById('change-password-form').reset();
        mostrarConfirmacion('confirmacion-password', 'exito', '✔ Contraseña actualizada con éxito.');
    }
}

/* Flujo de cierre de sesión con pantalla de carga */
function iniciarLogout() {
    let profileContainer = document.getElementById('profile-container');
    let logoutScreen     = document.getElementById('logout-screen');
    let loadingScreen    = document.getElementById('loading-screen');

    /* 1. Ocultar el contenido del perfil */
    profileContainer.classList.add('hidden');

    /* 2. Mostrar overlay de carga */
    loadingScreen.classList.remove('hidden');

    /* 3. Tras 1.5 s, ocultar carga y mostrar pantalla de sesión finalizada */
    setTimeout(function () {
        loadingScreen.classList.add('hidden');
        logoutScreen.classList.remove('hidden');
    }, 1500);
}

/* 
   Validar deposito
  */
function validarDeposito(e) {
    e.preventDefault();
    let valido = true;

    let tipo  = document.getElementById('d-tipo').value;
    let monto = parseFloat(document.getElementById('d-monto').value);

    limpiarError('d-tipo',  'err-d-tipo');
    limpiarError('d-monto', 'err-d-monto');

    if (!tipo) {
        marcarError('d-tipo', 'err-d-tipo', 'Seleccione el tipo de depósito.');
        valido = false;
    }
    if (isNaN(monto) || monto <= 0) {
        marcarError('d-monto', 'err-d-monto', 'Ingrese un monto válido mayor a 0.');
        valido = false;
    }

    if (valido) {
        document.getElementById('form-deposito').reset();
        mostrarConfirmacion(
            'confirmacion-deposito',
            'exito',
            '✔ Depósito de $' + monto.toFixed(2) + ' (' + tipo + ') registrado exitosamente.'
        );
    }
}

/* 
   
   Inicializacion - Se ejecuta al inicio e inyecta en el DOM el codigo JavaScript
   Se ejecuta cuando ya el documento HTL ha sido cargado. (DOMContentLoaded)
  */
document.addEventListener('DOMContentLoaded', function () {

    /* Renderizar datos iniciales */
    renderUltimas();
    renderHistorial('todos');

    /* ---------- Navegación principal ---------- */
    let navBtns = document.querySelectorAll('.nav-btn[data-view]');
    for (let i = 0; i < navBtns.length; i++) {
        navBtns[i].addEventListener('click', function () {
            let vista = this.getAttribute('data-view');
            if (vista === 'historial') {
                renderHistorial(filtroActivo);
            }
            /* Al volver a Perfil, restaurar la vista en caso de logout previo */
            if (vista === 'perfil') {
                document.getElementById('profile-container').classList.remove('hidden');
                document.getElementById('logout-screen').classList.add('hidden');
            }
            navegarA(vista);
        });
    }

    /* ---------- Botón "Ver historial completo" ---------- */
    document.getElementById('btn-ver-historial').addEventListener('click', function () {
        renderHistorial(filtroActivo);
        navegarA('historial');
    });

    /* ---------- Toggle saldo ---------- */
    document.getElementById('toggle-eye').addEventListener('click', toggleSaldo);

    /* ---------- Toggle tema ---------- */
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    /* ---------- Filtros historial ---------- */
    let btnsFiltro = document.querySelectorAll('.btn-filtro');
    for (let j = 0; j < btnsFiltro.length; j++) {
        btnsFiltro[j].addEventListener('click', function () {
            for (let k = 0; k < btnsFiltro.length; k++) {
                btnsFiltro[k].classList.remove('active');
            }
            this.classList.add('active');
            filtroActivo = this.getAttribute('data-filtro');
            renderHistorial(filtroActivo);
        });
    }

    /* ---------- Delegación de eventos: botón "Ver" en tabla historial ---------- */
    document.getElementById('tbody-historial').addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btn-detalle')) {
            let id = parseInt(e.target.getAttribute('data-id'), 10);
            verDetalle(id);
        }
    });

    /* ---------- Volver al historial desde detalle ---------- */
    document.getElementById('btn-volver').addEventListener('click', function () {
        navegarA('historial');
    });

    /* ---------- Formularios ---------- */
    document.getElementById('form-transferencia').addEventListener('submit', validarTransferencia);
    document.getElementById('form-pago-movil').addEventListener('submit', validarPagoMovil);
    document.getElementById('form-deposito').addEventListener('submit', validarDeposito);

    /* ---------- Perfil: cambio de contraseña (perfilM) ---------- */
    document.getElementById('change-password-form').addEventListener('submit', validarCambioPassword);

    /* ---------- Perfil: cerrar sesión (perfilM) ---------- */
    document.getElementById('logout-btn').addEventListener('click', iniciarLogout);

    /* ---------- AUTH: tema en pantalla de login/registro ---------- */
    document.getElementById('auth-theme-toggle').addEventListener('click', toggleTheme);

    /* ---------- AUTH: alternancia login ↔ registro ---------- */
    document.getElementById('link-a-registro').addEventListener('click', mostrarRegistro);
    document.getElementById('link-a-login').addEventListener('click', mostrarLoginForm);

    /* ---------- AUTH: formularios ---------- */
    document.getElementById('login-form').addEventListener('submit', manejarLogin);
    document.getElementById('register-form').addEventListener('submit', manejarRegistro);
    document.getElementById('questions-form').addEventListener('submit', manejarPreguntas);

});
