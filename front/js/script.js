//**********************************************************//
//********************** PAGE ACCUEIL **********************//
//**********************************************************//

//Afficher dynamiquement la liste de produits dans la page d'accueil => Requête Ajax (fetch)
fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((allProducts) => {
    // console.table(allProducts)
    for (let i = 0; i < allProducts.length; i++) {
      addProduct(allProducts[i]);
    }
  })

//Afficher la quantité de produits dans le panier
displayTotalQty()

//***********************************//
//************ FONCTIONS ************//
//***********************************//

//Fonction : "Insertion dynamique de chaque objet"
function addProduct(p) {
  document.getElementById("items").innerHTML +=
    `
        <a href="./product.html?id=${p._id}">
            <article>
                <img src="${p.imageUrl}" alt="${p.altTxt}">
                <h3 class="productName">${p.name}</h3>
                <p class="productDescription">${p.description}</p>
            </article>
        </a>
        `
}

//Fonction : "Calculer la quantité totale de produits dans le panier"
function displayTotalQty() {
  let cartProducts = JSON.parse(localStorage.getItem("products"));
  const cartQty = document.getElementById("cart__quantity");
  if (!cartProducts) {
    cartQty.textContent = "";
    cartQty.classList.remove("cartQuantity");
    return 0;
  }
  else {
    cartProducts.map(x => x.qty)
      .reduce((total, n) => {
        return totalQty = total + n
      }, 0)
    cartQty.textContent = totalQty;
    cartQty.classList.add("cartQuantity");
  }
}
