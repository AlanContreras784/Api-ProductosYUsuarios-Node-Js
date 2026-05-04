const API = "/api/products";
const AUTH_API = "/api/login";
//const AUTH_API = "http://localhost:4000/api/login";

const form = document.getElementById("form");
const productsDiv = document.getElementById("products");
const userPanel = document.getElementById("userPanel");

let editId = null;

// ==========================
// MODAL
// ==========================
const loginModal = new bootstrap.Modal(
  document.getElementById("loginModal")
);

// ==========================
// TOAST
// ==========================
const toastElement = document.getElementById("liveToast");

const toastBootstrap = new bootstrap.Toast(toastElement);

function showToast(message){

  document.getElementById("toastMessage").innerText = message;

  toastBootstrap.show();
}

// ==========================
// VERIFICAR LOGIN
// ==========================
function isLogged(){

  return localStorage.getItem("token");
}

// ==========================
// MOSTRAR USUARIO
// ==========================
function renderUser(){

  const user = localStorage.getItem("user");

  console.log("Usuario guardado:", user);

  const panel = document.getElementById("userPanel");

  if(user && user !== "undefined"){

    panel.innerHTML =
    `<button class="btn btn-success" id="logoutBtn">
      👤 ${user}
    </button>`;

    const logoutBtn =
      document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", logout);

  } else {

    panel.innerHTML = "";
  }
}
// ==========================
// LOGOUT
// ==========================
function logout(){

  const confirmLogout = confirm(
    "¿Desea cerrar sesión?"
  );

  if(confirmLogout){

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    renderUser();

    showToast("Sesión cerrada");
  }
}

// ==========================
// OBTENER PRODUCTOS
// ==========================
async function getProducts(){

  const response = await fetch(API);

  const data = await response.json();

  productsDiv.innerHTML = "";

  data.payload.forEach(product => {

    productsDiv.innerHTML += `

      <div class="col-md-4">

        <div class="card shadow h-100">

          <div class="card-body">

            <h5 class="card-title">
              ${product.name}
            </h5>

            <p>
              <strong>ID:</strong> ${product.id}
            </p>

            <p>
              <strong>Precio:</strong> $${product.price}
            </p>

            <div class="d-flex gap-2">

              <button
                class="btn btn-warning w-50"
                onclick="prepareEdit(
                  '${product.id}',
                  '${product.name}',
                  '${product.price}'
                )"
              >
                Editar
              </button>

              <button
                class="btn btn-danger w-50"
                onclick="deleteProduct('${product.id}')"
              >
                Eliminar
              </button>

            </div>

          </div>

        </div>

      </div>

    `;
  });
}

// ==========================
// GUARDAR PRODUCTO
// ==========================
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // SI NO ESTA LOGUEADO
  if(!isLogged()){

    loginModal.show();

    return;
  }

  const product = {

    name: document.getElementById("name").value,
    price: document.getElementById("price").value
  };

  const token = localStorage.getItem("token");

  try{

    if(editId){

      await fetch(`${API}/${editId}`, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(product)
      });

      showToast("Producto actualizado");

      editId = null;

    } else {

      await fetch(`${API}/create`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(product)
      });

      showToast("Producto creado");
    }

    form.reset();

    getProducts();

  } catch(error){

    console.log(error);

    alert("Error en la operación");
  }
});

// ==========================
// ELIMINAR
// ==========================
async function deleteProduct(id){

  if(!isLogged()){

    loginModal.show();

    return;
  }

  const confirmDelete = confirm(
    "¿Desea eliminar este producto?"
  );

  if(!confirmDelete){
    return;
  }

  const token = localStorage.getItem("token");

  await fetch(`${API}/${id}`, {

    method: "DELETE",

    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  showToast("Producto eliminado");

  getProducts();
}

// ==========================
// EDITAR
// ==========================
function prepareEdit(id, name, price){

  if(!isLogged()){

    loginModal.show();

    return;
  }

  document.getElementById("name").value = name;

  document.getElementById("price").value = price;

  editId = id;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  showToast("Modo edición activado");
}

// ==========================
// LOGIN
// ==========================
document
  .getElementById("loginForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try{

      const response = await fetch(AUTH_API, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      console.log(data);
      console.log(response.status);
      console.log("STATUS:", response.status);

if(!response.ok){

  console.log("LOGIN FALLÓ");

  alert("Credenciales incorrectas");

  return;
}

console.log("LOGIN EXITOSO");

      localStorage.setItem("token", data.token);
      console.log(data);

      localStorage.setItem("user", email);
      console.log(localStorage.getItem("user"));

      loginModal.hide();

      renderUser();

      showToast("Sesión iniciada");

    } catch(error){

      console.log(error);

      alert("Error al iniciar sesión");
    }
});

// ==========================
// INICIAR
// ==========================

renderUser();

getProducts();

window.logout = logout;