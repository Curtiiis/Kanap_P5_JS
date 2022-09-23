//**********************************************************//
//********************** PAGE PANIER ***********************//
//**********************************************************//

//Afficher dynamiquement les produits du panier => Requête Ajax (fetch)
fetch("https://cstrazel.fr:3002/api/products/")
  // fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((allProducts) => {
    // console.table(allProducts)
    let cartProducts = JSON.parse(localStorage.getItem("products"));
    // console.table(cartProducts)
    //Si le panier n'est pas vide
    if (cartProducts) {
      //Ajouter le formulaire 
      addForm()

      //Reporter les données du panier dans le tableau allProducts
      getCompleteProducts()
      // console.table(allProducts)

      //Injecter les articles du panier dans le DOM
      for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].color != undefined) {
          addArticle(allProducts[i]);
        }
      }

      //Calcul initial de la quantité et du prix total et les afficher côté client
      getTotalQty();
      getTotalPrice();
      displayTotalQty();

      //Contrôle et modification de la quantité totale de produits dans le panier
      //  => Modification des quantités dans le panier
      for (let i = 0; i < cartProducts.length; i++) {
        document.getElementsByClassName("itemQuantity")[i].addEventListener("input", (e) => {
          let eTargetValue = e.target.value;
          const eTargetDataId = e.target.getAttribute("data-id");
          const eTargetDataColor = e.target.getAttribute("data-color");

          //  => Contrôle de la validité des quantités
          if (eTargetValue > 0 && eTargetValue < 100) {
            changeQtyInCart();
          } else {
            alert("Merci de choisir une quantité entre 1 et 100.")
          }
          location.reload()


          //************ FONCTIONS ADDEVENTLISTENER ************//
          //Fonction : "Modifier les quantités dans le panier lors de la modification DOM côté client"
          function changeQtyInCart() {
            const productQtyToChange = cartProducts.find((item) =>
              item._id == eTargetDataId && item.color == eTargetDataColor);
            if (productQtyToChange) {
              productQtyToChange.qty = Number(eTargetValue);
              localStorage.setItem("products", JSON.stringify(cartProducts));
            }
          }

        }); // close itemQuantity listener

        // => Suppression d'un article
        document.getElementsByClassName("deleteItem")[i].addEventListener("click", (e) => {
          deleteItem()
          location.reload()

          //************ FONCTIONS ADDEVENTLISTENER ************//
          function deleteItem() {
            const eTargetDataId = e.target.getAttribute("data-id");
            const eTargetDataColor = e.target.getAttribute("data-color");
            //=> Côté client
            let elementClosest = document.querySelector(
              `article[data-id="${eTargetDataId}"][data-color="${eTargetDataColor}"]`
            );
            elementClosest.remove();

            //=> Côté serveur
            let cartProduct = cartProducts.findIndex((x) =>
              x._id == eTargetDataId && x.color == eTargetDataColor);

            if (cartProducts.length == 1) {
              localStorage.clear()
            } else {
              cartProducts.splice(cartProduct, 1);
              localStorage.setItem("products", JSON.stringify(cartProducts));
            }
          }
        }); // close deleteItem listener
      } //close boucle



      //Contrôle de la validité des champs du formulaire (méthode Regex)

      // => Contrôle du champs "Prénom"
      const prenom = document.getElementById("firstName");
      const prenomNextSibling = prenom.nextElementSibling;
      prenom.addEventListener("input", () => {
        if (prenom.value.length === 0 || prenom.value.length < prenom.getAttribute("minlength")) {
          prenomNextSibling.textContent = "";
          prenom.classList.remove("valid", "invalid");
        }
        else if (prenom.value.length >= prenom.getAttribute("minlength")) {
          if (regexPrenom(prenom.value)) {
            prenomNextSibling.textContent = "";
            prenom.classList.add("valid");
            prenom.classList.remove("invalid");
          } else {
            prenomNextSibling.textContent = `Le champ ${prenom.getAttribute("data-name")} doit contenir uniquement des lettres`;
            prenom.classList.add("invalid");
            prenom.classList.remove("valid");
          }
        }
        enableOrderBtn()
      });

      // => Contrôle du champs "Nom" 
      const nom = document.getElementById("lastName");
      const nomNextSibling = nom.nextElementSibling;
      nom.addEventListener("input", () => {
        if (nom.value.length === 0 || nom.value.length < nom.getAttribute("minlength")) {
          nomNextSibling.textContent = "";
          nom.classList.remove("valid", "invalid");
        } else if (nom.value.length >= nom.getAttribute("minlength")) {
          if (regexNom(nom.value)) {
            nomNextSibling.textContent = "";
            nom.classList.add("valid");
            nom.classList.remove("invalid");
          } else {
            nomNextSibling.textContent = `Le champ ${nom.getAttribute("data-name")} doit contenir uniquement des lettres`;
            nom.classList.add("invalid");
            nom.classList.remove("valid");
          }
        }
        enableOrderBtn()
      });

      // => Contrôle du champs "Ville" 
      const city = document.getElementById("city");
      const cityNextSibling = city.nextElementSibling;
      city.addEventListener("input", () => {
        if (city.value.length === 0 || city.value.length < city.getAttribute("minlength")) {
          cityNextSibling.textContent = "";
          city.classList.remove("valid", "invalid");
        } else if (city.value.length >= city.getAttribute("minlength")) {
          if (regexCity(city.value)) {
            cityNextSibling.textContent = "";
            city.classList.add("valid");
            city.classList.remove("invalid");
          } else {
            cityNextSibling.textContent = `Le champ ${city.getAttribute("data-name")} doit contenir uniquement des lettres`;
            city.classList.add("invalid");
            city.classList.remove("valid");
          }
        }
        enableOrderBtn()
      });

      // => Contrôle du champ "Adresse"
      const address = document.getElementById("address");
      const addressNextSibling = address.nextElementSibling;
      address.addEventListener("input", () => {
        if (address.value.length === 0 || address.value.length < address.getAttribute("minlength")) {
          addressNextSibling.textContent = "";
          address.classList.remove("valid", "invalid");
        }
        else if (address.value.length >= address.getAttribute("minlength")) {
          if (regexAddress(address.value)) {
            addressNextSibling.textContent = "";
            address.classList.add("valid");
            address.classList.remove("invalid");
          } else {
            addressNextSibling.textContent =
              `Le champ ${address.getAttribute("data-name")} doit contenir uniquement des chiffres et des lettres`;
            address.classList.add("invalid");
            address.classList.remove("valid");
          }
        }
        enableOrderBtn()
      });

      // => Contrôle du champ "Email"
      const email = document.getElementById("email");
      const emailNextSibling = email.nextElementSibling;
      email.addEventListener("change", () => {
        if (email.value.length === 0 || email.value.length < email.getAttribute("minlength")) {
          emailNextSibling.textContent = "";
          email.classList.remove("valid", "invalid");
        }
        else if (email.value.length >= email.getAttribute("minlength")) {
          if (regexEmail(email.value)) {
            emailNextSibling.textContent = "";
            email.classList.add("valid");
            email.classList.remove("invalid");
          } else {
            emailNextSibling.textContent =
              `Le champ ${email.getAttribute("data-name")} doit contenir un @`;
            email.classList.add("invalid");
            email.classList.remove("valid");
          }
        }
        enableOrderBtn()
      });

      //Envoyer les données du formulaire
      document.getElementById("order").addEventListener("click", (e) => {
        e.preventDefault();
        if (checkValidityFormInputs()) {
          fetch("https://cstrazel.fr:3002/api/products/order", {
            method: "POST",
            headers: {
              Accept:
                "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
              },
              products: getProductsId(),
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              localStorage.clear();
              displayTotalQty();

              //Injection du numéro de commande dans le DOM
              document.getElementById("limitedWidthBlock").innerHTML = `
              <div class="confirmation">
                  <p>
                  Commande validée ! <br>
                  Votre numéro de commande est : <br>
                  <span id="orderId"><strong>${json.orderId}</strong></span>
                  </p>
              </div>
              `;
            })
        }
        else {
          alert("Merci de remplir correctement le formulaire")
          document.getElementById("order").disabled = true;
          document.getElementById("order").style.cursor = "not-allowed";
        }
      });
    }//close if(cartProducts)



    //***********************************//
    //************ FONCTIONS ************//
    //***********************************//

    function getCompleteProducts() {
      cartProducts.forEach((itemInCart) => {
        let isSimilarProductExist = allProducts.find(
          (x) => x._id == itemInCart._id && x.color == itemInCart.color
        );

        if (isSimilarProductExist == undefined) {
          let completeProduct = allProducts.find((x) => x._id == itemInCart._id);
          let newProduct = {
            _id: completeProduct._id,
            name: completeProduct.name,
            price: completeProduct.price,
            imageUrl: completeProduct.imageUrl,
            description: completeProduct.description,
            altTxt: completeProduct.altTxt,
            color: itemInCart.color,
            qty: Number(itemInCart.qty),
          };
          allProducts.push(newProduct);
        }
      });

    }

    //Fonction : "Ajouter dans le DOM un article correspondant dans le panier"
    function addArticle(p) {
      document.getElementById("cart__items").innerHTML +=
        `
      <article class="cart__item" data-id="${p._id}" data-color="${p.color}">
          <div class="cart__item__img">
            <a href="http://${window.location.host}/front/html/product.html?id=${p._id}">
              <img src="${p.imageUrl}" alt="${p.altTxt}">
            </a>
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description" id="product-description">
              <h2 style="color: yellow;">${p.name}</h2>
              <p style="color: yellow;">${p.color}</p>
              <p style="color: yellow;">${p.price}€</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity"  
                      data-id="${p._id}" data-color="${p.color}"
                      name="itemQuantity" min="1" max="100" value="${p.qty}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem" id="deleteItem" data-id="${p._id}" data-color="${p.color}">Supprimer</p>
            </div>
            </div>
          </div>
      </article> 
    `;
    }

    //Fonction : "Calculer la quantité totale de produits dans le panier"
    function getTotalQty() {
      cartProducts.map((x) => x.qty).reduce((total, n) => {
        return (totalQty = total + n);
      }, 0);

      if (totalQty > 1) {
        document.getElementById("sTotalQuantity").textContent = "s";
      } else {
        document.getElementById("sTotalQuantity").textContent = "";
      }
      document.getElementById("totalQuantity").innerHTML = totalQty;
    }

    //Fonction : "Calculer la quantité totale de produits dans le panier"
    function displayTotalQty() {
      const cartQty = document.getElementById("cart__quantity");
      if (!cartProducts) {
        cartQty.textContent = "";
        cartQty.classList.remove("cartQuantity");
        return 0;
      }
      else {
        cartProducts.map((x) => x.qty).reduce((total, n) => {
          return totalQty = total + n
        }, 0)
        cartQty.textContent = totalQty;
        cartQty.classList.add("cartQuantity");
      }
    }

    //Fonction : "Calculer le prix total du panier"
    function getTotalPrice() {
      cartProducts
        .map((x) => x.price * x.qty)
        .reduce((total, n) => {
          return (totalPrice = total + n);
        }, 0);
      document.getElementById("totalPrice").innerHTML = totalPrice;
      if (cartProducts.length == 0) {
        document.getElementById("totalPrice").innerHTML = "";
      }
    }

    //Fonctions : "Contrôle de la validité du champ Prénom"
    function regexPrenom(value) {
      return /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ'\s-]{1,40}$/.test(value);
    }

    //Fonctions : "Contrôle de la validité du champ Nom"
    function regexNom(value) {
      return /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ'\s-]{1,40}$/.test(value);
    }

    //Fonctions : "Contrôle de la validité du champ Ville"
    function regexCity(value) {
      return /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ'\s-]{1,40}$/.test(value);
    }

    function regexAddress(value) {
      return /^[0-9a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,'\s]{3,50}$/.test(value);
    }
    function regexEmail(value) {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    }
    function checkValidityFormInputs() {
      let checkValidityFormInputs =
        regexPrenom(firstName.value) &&
        regexNom(lastName.value) &&
        regexCity(city.value) &&
        regexAddress(address.value) &&
        regexEmail(email.value)
      return checkValidityFormInputs;
    }

    //Fonction :"Faire un array de products Id pour la requête POST"
    function getProductsId() {
      return cartProducts.map((x) => x._id);
    }

    function addForm() {
      document.getElementById("cart__order__form").innerHTML =
        `
      <div class="cart__order__form__question">
        <label for="firstName">Prénom: </label>
        <input type="text" name="firstName" id="firstName" data-name="prénom" data-control="onlyText" required minlength="1" maxlength="40">
        <p id="firstNameErrorMsg"><!--Ceci est un message d'erreur--></p>
      </div>
      <div class="cart__order__form__question">
        <label for="lastName">Nom: </label>
        <input type="text" name="lastName" id="lastName" data-name="nom" data-control="onlyText" required minlength="1" maxlength="40">
        <p id="lastNameErrorMsg"></p>
      </div>
      <div class="cart__order__form__question">
        <label for="address">Adresse: </label>
        <input type="text" name="address" id="address" data-name="adresse" data-control="textAndNumbers" required minlength="3" maxlength="50">
        <p id="addressErrorMsg"></p>
      </div>
      <div class="cart__order__form__question">
        <label for="city">Ville: </label>
        <input type="text" name="city" id="city" data-name="ville" data-control="onlyText" required minlength="1" maxlength="40">
        <p id="cityErrorMsg"></p>
      </div>
      <div class="cart__order__form__question">
        <label for="email">Email: </label>
        <input type="email" name="email" id="email" data-name="email" data-control="email" required minlength="3" maxlength="40">
        <p id="emailErrorMsg"></p>
      </div>
      <div class="cart__order__form__submit">
        <input type="submit" value="Commander !" id="order">
      </div>
      `
    }

    //Activation du bouton "Commander"
    function enableOrderBtn() {
      if (checkValidityFormInputs()) {
        document.getElementById("order").disabled = false;
        document.getElementById("order").style.cursor = "pointer";
      }
    }

  })//close fetch allProducts