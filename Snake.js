let t_aux_manzana = 0;
let t_manzana = 5;
let t_actualizacion = 0.026;
let t_aux_act= 0;

let Key = {
  _pressed : {},
  
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isPress: function(keyCode) {
    return this._pressed[keyCode];
  },
  onKeyDown: function(keyCode) {
    this._pressed[keyCode] = true;
  },
  onKeyUp: function(keyCode) {
    delete this._pressed[keyCode];
  }};

export default class Snake {
  constructor() {

    this.score = document.querySelector("#score");
    this.score_val = document.querySelector("#score_val"); 
    this.casillas = document.querySelector("#casillas");
    this.msg_fin = document.querySelector("#msg_fin");

    this.score_v = 0;
    this.crea_casillas();
    this.manzana = {"x":this.dame_coordX(),"y":this.dame_coordY()};

    this.juego = true;

    /* 0: izquierda.
    *  1: arriba.
    *  2: derecha.
    *  3: abajo.
    */
    this.direccion = 2;

    this.button = document.getElementById('reset');

    // La serpiente se representará como un arreglo de coordenadas.
    this.snake = [[0,0]];

    // Listeners.
    window.addEventListener("keydown", function(evt) {
      Key.onKeyDown(evt.keyCode);
    });
    window.addEventListener("keyup", function(evt) {
      Key.onKeyUp(evt.keyCode);
    });
    this.button.addEventListener('click', evt =>{
      this.resetear();
    });

  }

  /*
  * Método que actualiza toda la parte lógica del juego.
  * @param elapsed El tiempo que pasó desde la última actualización hasta ahora.
  */
  update(elapsed){
    t_aux_act += elapsed;
    if(this.juego && t_aux_act >= t_actualizacion){
      t_aux_act = 0;
      // La manzana reaparece cada "t_manzana" segundos.
      t_aux_manzana+=elapsed;
      if(t_aux_manzana >= t_manzana){
        this.pon_nueva_manzana();
        t_aux_manzana = 0;
      }

      // Modificación de coordenadas:

      //Primero modificamos todo el cuerpo de la serpiente a excepción de la cabeza.
      for(let i=this.snake.length-1; i>=1; i--){
        this.snake[i][0] = this.snake[i-1][0];
        this.snake[i][1] = this.snake[i-1][1]; 
      }

      // Aquí modificamos la cabeza.
      switch(this.direccion){
        case 0: //Izq
          this.snake[0][1] = this.snake[0][1]-1;
          break;
        case 1: //Arriba
          this.snake[0][0] = this.snake[0][0]-1;
          break;
        case 2: // Der
          this.snake[0][1] = this.snake[0][1]+1;
          break;
        case 3: //Abajo
          this.snake[0][0] = this.snake[0][0]+1;
          break;
      }

      // Revisamos si estamos en un estado no válido.
      if(this.estado_ilegal()){
        this.msg_fin.style.display = "block";
        this.juego = false;
        return;
      }

      // Si entró a la casilla donde había una manzana.
      if(this.snake[0][0] === this.manzana["x"] && 
          this.snake[0][1] === this.manzana["y"]){
        this.snake.push([0,0]);
        this.score_v += 10;
        this.score_val.textContent = this.score_v.toString();
        this.pon_nueva_manzana();
      }
      
    }
  }
  
  // Método que actualiza la parte visual del juego.
  render(){
    if(this.juego){
      // Primero pintamos todo el tablero del color por defecto.
      for(let i=0; i<48; i++){
        for(let j=0; j<64; j++){
          var casilla = this.dame_casilla(i, j);
          casilla.style.backgroundColor = "rgb(65, 106, 65)";
        }
      }
      // Después pintamos lo que correspondería a la serpiente.
      for(let i=0; i<this.snake.length; i++){
        var casilla = this.dame_casilla(this.snake[i][0], this.snake[i][1]);
        casilla.style.backgroundColor = "rgb(0, 255, 42)";
      }
      // Al final la manzana.
      var casilla = this.dame_casilla(this.manzana["x"], this.manzana["y"]);
      casilla.style.backgroundColor = "red";
    }
  }

  // Método que se encarga de leer la entrada del teclado y procesarla.
  processInput(){
    if(this.juego){
      if(this.direccion === 0 || this.direccion === 2){
        if (Key.isPress(Key.UP)) {
          this.direccion = 1;
        }
        if (Key.isPress(Key.DOWN)) {
          this.direccion = 3;
        }
      }else if(this.direccion === 1 || this.direccion === 3){
        if (Key.isPress(Key.LEFT)) {
          this.direccion = 0;
        }
        if (Key.isPress(Key.RIGHT)) {
          this.direccion = 2;
        }
      }
    }
  }
  
  /* Método para revisar que la serpiente no haya chocado con alguna parte de su cuerpo
   * o se haya salido de la cuadrícula.
  */
  estado_ilegal(){
    // Checamos si la posición de la cabeza no coincide con alguna otra parte del cuerpo.
    for(let i = 1; i<this.snake.length; i++){
      if(this.snake[0][0] === this.snake[i][0] &&
        this.snake[0][1] === this.snake[i][1]) return true;
    }

    // Checamos que no se haya salido de la cuadrícula.
    if(this.snake[0][0] >= 48 || this.snake[0][0] < 0 ||
      this.snake[0][1] >= 64 || this.snake[0][1] < 0) return true;
  }

  // Método que pone una manzana en la cuadrícula.
  pon_nueva_manzana(){
    this.manzana["x"] = this.dame_coordX();
    this.manzana["y"] = this.dame_coordY();
  }

  // Método que crea los divs correspondientes para las casillas del juego. (Y no hacerlo a manita XD)
  crea_casillas(){
    let top_aux, left_aux;
    for (let i=0; i<48; i++) {
      for(let j=0; j<64; j++){
        let new_div= document.createElement("div");
        new_div.id = i.toString() + " " + j.toString();
        top_aux = i*15;
        left_aux = j*15;
        new_div.style.top = top_aux.toString()+"px";
        new_div.style.left = left_aux.toString()+"px";
        new_div.className = "casillas_c";
        this.casillas.appendChild(new_div);
      }
    }
  }

  // Método que regresa una coordenada aleatoria en el eje X.
  dame_coordX(){
    return Math.round(Math.random()*47);
  }

  // Método que regresa una coordenada aleatoria en el eje Y.
  dame_coordY(){
    return Math.round(Math.random()*63);
  }

  // Método que regresa una referencia a la casilla solicitada.
  dame_casilla(coordx, coordy){
    return document.getElementById(coordx.toString() + " " + coordy.toString());
  }

  // Método para volver a empezar el juego. Limpia el tablero y resetea atributos.
  resetear(){
    this.juego = true;
    this.direccion = 2;
    this.snake = [[0,0]];
    this.msg_fin.style.display = "none";
    this.score_val.textContent = "0";
    this.score_v = 0;
  }

}