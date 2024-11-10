let btnMycart = document.querySelector("#mycart");
let divmycartcontent = document.querySelector("#mycart-content");
let wrapper = document.createElement("div");
let btnCancel = document.querySelector(".cancel");
//..............................................................................
let cartTotal = document.querySelector(".cart-total");
let cartItems = document.querySelector(".cart-items");
let cartContent = document.querySelector(".cart-content");
let mycartFooter = document.querySelector(".mycartFooter");
let clearCartbtn=document.querySelector('.clear-cart')
let productView = document.querySelector(".product-center");
let srchText=document.querySelector('#txt-search')
let filters={searchItem:'',stock:true}
let cart = [];
// let products=[{title:'cpu',stock:true},{title:'ram',stock:true},{title:'hard',stock:false},]
// document.querySelector('#txt-search').addEventListener('input',function(e){
//   filters.searchItem=e.target.value
//   let products=View.getProducts
//   console.log(products,e.target.value);
//   // View.searchCart(products,filters)
// })


 class Product {
  async getProducts() {
    try {
      const result = await fetch("products.json");
      const data = await result.json();
      let products = data.items;
      // console.log(products);
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.idnum;
        const image = item.fields.images.field.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
  
}

class View { //....................................................................class view..................................

  viewProduct(products) {
    let res = "";
    products.forEach((item) => {
      res += `
            <article class="product">
                <div class="img-content">
                    <img src=${item.image} alt=${item.title} srcset="">
                </div>
                <div calss="content">
                    <button data-id=${item.id} class="but-add">Add To Cart</button>
                    <h3>title: ${item.title}</h3>
                    <h4>price: ${item.price} $</h4>
                </div>
                
            </article>
            `;
    });
    productView.innerHTML = res;
  }
  searchCart(products,stock){
    srchText.addEventListener('input',function(e){
      // console.log(products);
      products= products.filter(function(item){
      return item.title.includes(filters.searchItem)
    })
   products.filter(function(item){
      if(filters.stock){
        return item.title
      }else{
        return true
      }
    })
    
    
     productView.innerHTML=''
     products.forEach((item)=>{
      let p=document.createElement('p')
      p.textContent=`${item.title} --- ${item.stock}`
      productView.appendChild(p)
      // Storage.saveCart
     })
   })
   }
  getCartButtons() {
    const buttons = [...document.querySelectorAll(".but-add")];
    //    console.log(buttons)
    buttons.forEach((item) => {
      let id = item.dataset.id;
      item.addEventListener("click", (event) => {
        // console.log(Storage.getProducts(id));
        let cartItem = { ...Storage.getProducts(id), tedad: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        // console.log(cart)
        // console.log(cartItem)
        this.setValues(cart);
        this.addCartItem(cartItem);
        
      });
    });
  }
  setValues(cart) {
   
    let totalPrice = 0;
    let totalItems = 0;
    cart.map((item) => {
      totalPrice = totalPrice + item.price * item.tedad;
      totalItems = totalItems + item.tedad;
    });
    cartTotal.textContent = totalPrice;
    cartItems.textContent = totalItems;
    // console.log(cartItems, cartTotal);
  } 
  addCartItem(item) {
    let div = document.createElement("div");
    let hr=document.createElement('hr')
    div.innerHTML = `
    <img src=${item.image} alt=${item.title} style="width:150px;height:150px;">
    <div>
      <h3>${item.title}</h3>
      
      <h5>price:${item.price} $</h5>
      <span class="remove-item" data-id=${item.id}>delet product</span>
    </div>
    <div>
      <i class="fa fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.tedad}</p>
      <i class="fa fa-chevron-down" data-id=${item.id}></i>
    </div>
    
    `;
    cartContent.appendChild(div,hr);
  }
  runapp() {
    cart = Storage.getCart();
    this.setValues(cart);
    this.run(cart);
    // this.clearCart(cart)
  }
  run() {
    cart.forEach((item) => {
      return this.addCartItem(item);
    });
  }
  cartDel (){
    clearCartbtn.addEventListener('click',()=>{
      this.clearCart()
    })
    cartContent.addEventListener('click',(e)=>{
      if(e.target.classList.contains('remove-item')){
        const removeItem=e.target
        const id=removeItem.dataset.id
        cartContent.removeChild(removeItem.parentElement.parentElement)
        this.removeProduct(id)
      }
        if(e.target.classList.contains('fa-chevron-up')){
          let addAmount=e.target
          let id=addAmount.dataset.id
          
          let product=cart.find((item)=>{
            return item.id===id
          })
          product.tedad=product.tedad + 1
          
          Storage.saveCart(cart)
          this.setValues(cart)
          
          addAmount.nextElementSibling.innerText=product.tedad
        }
        if(e.target.classList.contains('fa-chevron-down')){
          let lowerAmount=e.target
          let id=lowerAmount.dataset.id
          
          let product=cart.find((item)=>{
            return item.id===id
          })
          
          product.tedad=product.tedad - 1
          if(product.tedad > 0){
            Storage.saveCart(cart)
            this.setValues(cart)
            lowerAmount.previousElementSibling.innerText = product.tedad
          }else{
            cartContent.removeChild(lowerAmount.parentElement.parentElement)
            Storage.saveCart(cart)
            this.setValues(cart)
            this.removeProduct(id)
          }
          lowerAmount.previousElementSibling.innerText=product.tedad
        }
        

    })
  }
  clearCart(){
   let cartItemid=cart.map((item) => {
      return item.id
    })
    cartItemid.forEach((item)=>{
      return this.removeProduct(item)
    })
    while (cartContent.children.length > 0){
      cartContent.removeChild(cartContent.children[0])
    }
  }
    
  removeProduct(id){
    cart=cart.filter((item)=>{
      return item.id == !id
      
    })
    this.setValues(cart)
    Storage.saveCart(cart)
  }
}
class Storage {//..................................................................class storage...........................
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((item) => item.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
}
// console.log(Storage.getProducts(2));
document.addEventListener("DOMContentLoaded", () => {
  const view = new View();
  const product = new Product();//asynch
  view.runapp();
  product.getProducts().then((data) => {
      view.viewProduct(data);
      Storage.saveProducts(data);
    })
    .then(() => {
      view.getCartButtons();
      view.cartDel()
      view.searchCart(product.getProducts(),filters)
    });
 
});

wrapper.className = "wrapper";
document.body.prepend(wrapper);
btnCancel.addEventListener("click", () => {
  divmycartcontent.classList.remove("show");
  wrapper.classList.remove("show");
});
btnMycart.addEventListener("click", (e) => {
  divmycartcontent.classList.add("show");
  wrapper.classList.add("show");
});
document.querySelector("#close").addEventListener("click", () => {
  divmycartcontent.classList.remove("show");
  wrapper.classList.remove("show");
});
