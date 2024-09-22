let users = [
    { username: "iniyan", password: "1234" },
    { username: "nero", password: "pass1" },
    { username: "dante", password: "dante123" }
];

const products = [
    { id: 1, name: "Eggs", price: 110, quantity: "12 units", image: "E:\\iniyan\\cart\\.vscode\\Product image\\eggs.png" },
    { id: 2, name: "Crax", price: 80, quantity: "82g", image: "E:\\iniyan\\cart\\.vscode\\Product image\\crax.jpeg" },
    { id: 3, name: "Britannia bread", price: 55, quantity: "400g", image: "E:\\iniyan\\cart\\.vscode\\Product image\\bread.jpg" },
    { id: 4, name: "Amul Milk", price: 80, quantity: "1L", image: "E:\\iniyan\\cart\\.vscode\\Product image\\milk.jpg" },
    { id: 5, name: "Milky Mist Paneer", price: 125, quantity: "200g", image: "E:\\iniyan\\cart\\.vscode\\Product image\\panner.jpg" },
    { id: 6, name: "Maggi Noodles", price: 56, quantity: "286g", image: "E:\\iniyan\\cart\\.vscode\\Product image\\maggi.jpg" }
];


let order = {
    orderAmount: 0,           
    orderItemCount: 0,       
    orderItems: []            
};

function validateLogin() {
    const loginUsername = document.getElementById("login-username").value;
    const loginPassword = document.getElementById("login-password").value;
    const loginMessage = document.getElementById("login-message");

    let usernameFound = false;
    let passwordCorrect = false;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user.username === loginUsername) {
            usernameFound = true;

            if (user.password === loginPassword) {
                passwordCorrect = true;
            }
            break;
        }
    }

    if (!usernameFound && !passwordCorrect) {
        loginMessage.textContent = "Invalid username or password";
        loginMessage.style.color = "red";
    } else if (!passwordCorrect) {
        loginMessage.textContent = "Invalid password!";
        loginMessage.style.color = "red";
    } else {
        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";

        showProductPage(); 
    }
}


function createAccount() {
    const signupUsername = document.getElementById("signup-username").value;
    const signupPassword = document.getElementById("signup-password").value;
    const signupMessage = document.getElementById("signup-message");

    const userExists = users.some(user => user.username === signupUsername);

    if (userExists) {
        signupMessage.textContent = "Username already exists!";
        signupMessage.style.color = "red";
    } else if (signupUsername === "" || signupPassword === "") {
        signupMessage.textContent = "Please fill in all fields.";
        signupMessage.style.color = "red";
    } else {
        users.push({ username: signupUsername, password: signupPassword });
        signupMessage.textContent = "Account created successfully!";
        signupMessage.style.color = "green";
    }
}


document.getElementById('show-signup').addEventListener('click', function () {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function () {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});


function showProductPage() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('product-page').style.display = 'block';
    renderProducts();
}


function renderProducts() {
    const productContainer = document.querySelector('#productlist');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.id = 'product-' + product.id;
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h5>${product.name}</h5>
            <div id="price-div" class="priceDiv">
                <span id="price-span" class="priceSpan">₹${product.price}</span>
                <span id="unit-span" class="unitSpan">${product.quantity}</span>
            </div>
            <div>
                <div id="buttonDiv">
                    <button class="addBtn" onclick="addQuantity(${product.id})">ADD</button>
                </div>
                <div id="toggleDiv" class="quantity-controls" style="display:none">
                    <button onclick="decreaseQuantity(${product.id}, ${product.price})">-</button>
                    <input type="text" id="quantity-${product.id}" value="0" readonly>
                    <button onclick="increaseQuantity(${product.id}, ${product.price})">+</button>
                </div>
            </div>
        `;
        productContainer.appendChild(productDiv);
    });
}


function addQuantity(productId) {
    const product = products.find(p => p.id === productId); 
    const productDiv = document.getElementById(`product-${productId}`);
    productDiv.querySelector("#buttonDiv").style.display = 'none';
    productDiv.querySelector("#toggleDiv").style.display = 'flex';
    increaseQuantity(productId, product.price); 
}



function increaseQuantity(productId, productPrice) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value);
    quantity += 1;
    quantityInput.value = quantity;

    
    updateOrder(productId, productPrice, quantity);
}


function decreaseQuantity(productId, productPrice) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
        quantity -= 1;
        quantityInput.value = quantity;

        if (quantity === 0) {
            const productDiv = document.getElementById(`product-${productId}`);
            productDiv.querySelector("#buttonDiv").style.display = 'block';
            productDiv.querySelector("#toggleDiv").style.display = 'none';
        }

        updateOrder(productId, productPrice, quantity);
        updateCheckoutButton(); 
    }
}



function updateOrder(productId, productPrice, quantity) {
    const productIndex = order.orderItems.findIndex(item => item.orderProductId === productId);

    if (productIndex !== -1) {
        
        order.orderItems[productIndex].orderProductCount = quantity;
        order.orderItems[productIndex].orderProductTotal = productPrice * quantity;

        if (quantity === 0) {
            order.orderItems.splice(productIndex, 1); 
        }
    } else {
      
        order.orderItems.push({
            orderProductId: productId,
            orderProductPrice: productPrice,
            orderProductCount: quantity,
            orderProductTotal: productPrice * quantity
        });
    }

    
    calculateOrderSummary();
    updateCheckoutButton();
}


function calculateOrderSummary() {
    let totalAmount = 0;
    let totalCount = 0;

    order.orderItems.forEach(item => {
        totalAmount += item.orderProductTotal;
        totalCount += item.orderProductCount;
    });

    order.orderAmount = totalAmount;
    order.orderItemCount = totalCount;
}


function updateCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');

    if (order.orderItemCount > 0) {
        checkoutButton.textContent = `${order.orderItemCount} items ₹${order.orderAmount}`;
        checkoutButton.style.backgroundColor = 'green';
        checkoutButton.disabled = false;
    } else {
        checkoutButton.textContent = 'Checkout';
        checkoutButton.style.backgroundColor = 'gray';
        checkoutButton.disabled = true;
    }document.getElementById('checkout-button').addEventListener('click', function () {

        document.getElementById('product-page').style.display = 'none';
        document.getElementById('order-summary').style.display = 'block';
        renderOrderSummary();
    });
}

    


function renderOrderSummary() {
    const orderItemsList = document.getElementById("order-items-list");
    const grandTotalAmount = document.getElementById("grand-total-amount");
    const downloadButton = document.getElementById("download-btn");

    orderItemsList.innerHTML = ""; 

    
    order.orderItems.forEach(item => {
        const product = products.find(p => p.id === item.orderProductId);
        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="order-img">
            <h5>${product.name}</h5>
            <div class="quantity-controls-summary">
                <button onclick="decreaseQuantity(${item.orderProductId}, ${item.orderProductPrice})">-</button>
                <input type="text" value="${item.orderProductCount}" readonly>
                <button onclick="increaseQuantity(${item.orderProductId}, ${item.orderProductPrice})">+</button>
            </div>
            <p>Total: ₹${item.orderProductTotal}</p>
        `;
        orderItemsList.appendChild(itemDiv);
    });

    grandTotalAmount.textContent = order.orderAmount;

    if (order.orderItemCount > 0) {
        downloadButton.disabled = false;
        downloadButton.style.backgroundColor = 'green';
    } else {
        downloadButton.disabled = true;
        downloadButton.style.backgroundColor = 'gray';
    }
    updateCheckoutButton();
}


function updateOrder(productId, productPrice, quantity) {
    const productIndex = order.orderItems.findIndex(item => item.orderProductId === productId);

    if (productIndex !== -1) {
        order.orderItems[productIndex].orderProductCount = quantity;
        order.orderItems[productIndex].orderProductTotal = productPrice * quantity;

        if (quantity === 0) {
            order.orderItems.splice(productIndex, 1);
        }
    } else {
        order.orderItems.push({
            orderProductId: productId,
            orderProductPrice: productPrice,
            orderProductCount: quantity,
            orderProductTotal: productPrice * quantity
        });
    }

    calculateOrderSummary();
    updateCheckoutButton();
    renderOrderSummary();
}


document.getElementById("download-btn").addEventListener("click", function () {
    const format = prompt("Enter format to download (json/xml): ").toLowerCase();
    if (format === 'json') {
        downloadOrderSummaryAsJSON();
    } else if (format === 'xml') {
        downloadOrderSummaryAsXML();
    } else {
        alert("Invalid format selected. Please choose either 'json' or 'xml'.");
    }
});


function downloadOrderSummaryAsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "order_summary.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function downloadOrderSummaryAsXML() {
    let xmlData = `<orderSummary><orderAmount>${order.orderAmount}</orderAmount><orderItemCount>${order.orderItemCount}</orderItemCount><orderItems>`;

    order.orderItems.forEach(item => {
        xmlData += `
            <item>
                <orderProductId>${item.orderProductId}</orderProductId>
                <orderProductPrice>${item.orderProductPrice}</orderProductPrice>
                <orderProductCount>${item.orderProductCount}</orderProductCount>
                <orderProductTotal>${item.orderProductTotal}</orderProductTotal>
            </item>`;
    });

    xmlData += `</orderItems></orderSummary>`;

    const dataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(xmlData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "order_summary.xml");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
