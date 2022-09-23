//**********************************************************//
//********************** PAGE PRODUIT **********************//
//**********************************************************//

//Afficher dynamiquement le produit cliqué la page d'accueil => Requête Ajax (fetch)
fetch(`http://localhost:3000/api/products/${getId()}`)
  .then((response) => response.json())
  .then((product) => {
    display(product);
    displayTotalQty()
    listenForCartAddition(product);
    // console.log(product)
  });

// Fonction : "Contrôle des champs et ajout au panier ou non"
function listenForCartAddition(product) {

  //Écoute du champ "Ajouter au panier" au clic
  document.getElementById("addToCart").addEventListener("click", () => {
    const qty = document.getElementById("quantity").value;
    const colorValue = document.getElementById("colors").value;

    //Contrôle de la quantité et couleur sélectionnées
    if (qty < 1 || qty > 100) {
      alert("Merci de choisir une quantité comprise entre 1 et 100.");
      return;
    }

    if (!colorValue || !product.colors.includes(colorValue)) {
      alert("Merci de choisir une couleur dans la liste ci-dessous.");
      return;
    }

    //Ajout du produit : si le panier est vide
    if (isCartEmpty()) {
      let cartProducts = [];

      let newProduct = {
        _id: product._id,
        color: colorValue,
        qty: Number(qty),
        price: product.price
      };

      cartProducts.push(newProduct);
      localStorage.setItem("products", JSON.stringify(cartProducts));

      //Afficher la quantité de produits dans le panier
      displayTotalQty()

      //Redirection soit vers le panier soit vers l'accueil
      redirect()
    }
    //Ajout du produit : si le panier contient déjà le produit
    else {
      let cartProducts = JSON.parse(localStorage.getItem("products"));
      const productExist = cartProducts.find((item) => item._id === product._id && item.color == colorValue);
      const indexOfProductExist = cartProducts.findIndex((item) => item._id === product._id);
      let newProduct = {
        _id: product._id,
        color: colorValue,
        qty: Number(qty),
        price: product.price
      };

      //Même couleur, même id
      if (productExist) {
        productExist.qty = Number(productExist.qty) + Number(qty);
      }
      //Même id, couleur différente
      else {
        if (indexOfProductExist != -1) {
          cartProducts.splice(indexOfProductExist + 1, 0, newProduct);
        } else {
          cartProducts.push(newProduct);
        }
      }
      localStorage.setItem("products", JSON.stringify(cartProducts));

      //Afficher la quantité de produits dans le panier
      displayTotalQty()

      //Redirection soit vers le panier soit vers l'accueil
      redirect()
    }

  })
}

//***********************************//
//************ FONCTIONS ************//
//***********************************//

// Fonction : "Récupérer id du product dans l'URL" pour la requête Fetch"
function getId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}

//Fonction : "Afficher les caractéristiques au produit"
function display(p) {
  document.getElementById("item__img").innerHTML = `<img src="${p.imageUrl}" alt="${p.altTxt}">`;
  document.getElementById("title").innerHTML = `${p.name}`;
  document.getElementById("price").innerHTML = `${p.price}`;
  document.getElementById("description").innerHTML = `${p.description}`;
  for (let i = 0; i < p.colors.length; i++) {
    document.getElementById("colors").innerHTML +=
      `<option value="${p.colors[i]}">${p.colors[i]}</option>`
  }
  document.getElementById("pageTitle").innerHTML = `${p.name}`;
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
    cartProducts.map(x => x.qty).reduce((total, n) => {
      return totalQty = total + n
    }, 0)
    cartQty.textContent = totalQty;
    cartQty.classList.add("cartQuantity");
  }
}

// Fonction : "Contrôle si le panier est vide ou non"
function isCartEmpty() {
  return localStorage.getItem("products") == null
}

// Fonction : "Redirection vers le panier ou la page d'accueil"
function redirect() {
  const resultat = window.confirm("Merci, vous allez être redirigé vers le panier. (Ok) \n Si vous souhaitez continuer vos achats, cliquez sur Annuler")
  if (resultat) {
    window.location.replace(`http://${window.location.host}/front/html/cart.html`);
  } else {
    window.location.replace(`http://${window.location.host}/front/html/index.html`);
  }
}



