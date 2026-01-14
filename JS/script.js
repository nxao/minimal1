// 
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    // 
    updateCartCount();
    if (document.getElementById("productName")) loadProduct();
    if (document.getElementById("cart-items")) loadCart();
    if (document.getElementById("lista-pago")) cargarPaginaPago();

    // 
    const filterButtons = document.querySelectorAll(".filter-bar button");
    const products = document.querySelectorAll(".product-item");
    const searchInput = document.querySelector(".search-input");

    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active-filter"));
                button.classList.add("active-filter");
                const category = button.textContent.toLowerCase().trim();
                if(searchInput) searchInput.value = ""; 
                products.forEach(p => {
                    const pCat = p.dataset.category.toLowerCase().trim();
                    p.style.display = (category === "todos" || pCat === category) ? "block" : "none";
                });
            });
        });
    }
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const val = searchInput.value.toLowerCase().trim();
            products.forEach(p => {
                p.style.display = p.querySelector("h6").textContent.toLowerCase().includes(val) ? "block" : "none";
            });
        });
    }
});

// 

function updateCartCount() {
    const badge = document.getElementById("cart-count");
    if (badge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}

function openProduct(card) {
    const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        img: card.dataset.img,
        category: card.dataset.category
    };
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "producto.html";
}

function loadProduct() {
    const p = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!p) return;
    if (document.getElementById("productName")) document.getElementById("productName").textContent = p.name;
    if (document.getElementById("productPrice")) document.getElementById("productPrice").textContent = `$${p.price.toFixed(2)}`;
    if (document.getElementById("productImage")) document.getElementById("productImage").src = p.img;
}

function loadCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container) return;
    
    container.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        container.innerHTML += `
            <div class="d-flex justify-content-between border-bottom p-2 align-items-center">
                <span>${item.name} (${item.quantity})</span>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Eliminar</button>
            </div>`;
    });
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

function addToCart() {
    const p = JSON.parse(localStorage.getItem("selectedProduct"));
    const existing = cart.find(item => item.id === p.id);
    if (existing) { existing.quantity++; } else { cart.push({...p, quantity: 1}); }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Agregado al carrito");
}

function cargarPaginaPago() {
    const lista = document.getElementById("lista-pago");
    const totalEl = document.getElementById("total-pago");
    if (!lista) return;

    let t = 0;
    lista.innerHTML = "";
    cart.forEach(i => {
        t += i.price * i.quantity;
        lista.innerHTML += `<div class="d-flex justify-content-between py-1 border-bottom"><span>${i.name} x${i.quantity}</span><span>$${(i.price*i.quantity).toFixed(2)}</span></div>`;
    });
    if (totalEl) totalEl.textContent = `$${t.toFixed(2)}`;
}



const formPago = document.getElementById("form-pago");
if (formPago) {
    formPago.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const ciudad = document.getElementById("ciudad").value;
        const direccion = document.getElementById("direccion").value;

      
        let metodo = "Efectivo";
        const radioTransf = document.querySelector("input[id='transferencia']");
        if (radioTransf && radioTransf.checked) {
            metodo = "Transferencia";
        }


        const miCarrito = JSON.parse(localStorage.getItem("cart")) || [];
        
        let totalCalculado = 0;
        let textoProductos = "";

        miCarrito.forEach(item => {
            let subtotal = item.price * item.quantity;
            totalCalculado += subtotal;
            textoProductos += `• ${item.name} (x${item.quantity}) - $${subtotal.toFixed(2)}\n`;
        });

    
        let mensaje = `*NUEVO PEDIDO - MINIMAL*\n\n`;
        mensaje += `*Cliente:* ${nombre}\n`;
        mensaje += `*Teléfono:* ${telefono}\n`;
        mensaje += `*Ciudad:* ${ciudad}\n`;
        mensaje += `*Dirección:* ${direccion}\n`;
        mensaje += `*Pago:* ${metodo}\n\n`;
        mensaje += `*Productos:*\n${textoProductos}\n`;
        mensaje += `*TOTAL A PAGAR: $${totalCalculado.toFixed(2)}*`;


        const mensajeSeguro = encodeURIComponent(mensaje);
        
        const numero = "593995393289";
        window.open(`https://wa.me/${numero}?text=${mensajeSeguro}`, '_blank');

        localStorage.removeItem("cart");
        window.location.href = "index.html";
    });
}




