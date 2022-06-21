import fetch from 'node-fetch';
import Stack from 'stackjs';


//Funcion para obtener el token del API
async function getToken(email){
  try {
    const res = await fetch(`https://rooftop-career-switch.herokuapp.com/token?email=${email}`);
    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Funcion para obtener el array de str del API a traves del token
async function getBlock(token){
  try {
    const res = await fetch(`https://rooftop-career-switch.herokuapp.com/blocks?token=${token}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function isGreater(strFirst, strSecond, token){
  try {
    const res = await fetch(`https://rooftop-career-switch.herokuapp.com/check?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({blocks: [strFirst, strSecond]})
    });
    const data = await res.json();
    return data.message;
    
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function isCorrect(clave, token){
  try {
    const res = await fetch(`https://rooftop-career-switch.herokuapp.com/check?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({encoded: clave})
    });
    const data = await res.json();
    return data.message;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Funcion check que retorna el array ordenado
async function check(block, token){
  let arrayOrdenado = [block[0]];
  let efectivo = 1, efectivoDos = 0;
  let cant_items = block.length - 1;

  let strStack = new Stack(); //stack con todos
  let strDosStack = new Stack(); //stack vacio que llevara los elementos false
  
  //llenar pila
  for(let i = 1; i < block.length; i++){
    strStack.push(block[i]);
  }

  while (cant_items != 0){
    let tmp = strStack.pop();
    cant_items--;//cantidad de elementos en la pila
    
    //respuesta de peticion post al API
    const resComp = await isGreater(arrayOrdenado[efectivo - 1], tmp, token);
    console.log(tmp);
    console.log(resComp);
    if (resComp){
      arrayOrdenado.push(tmp);
      console.log("es trueee");
      efectivo++;
      //limpiar pila dos
      while(efectivoDos != 0){
        let tmp2 = strDosStack.pop();
        efectivoDos--;
        strStack.push(tmp2);
        cant_items++;
      }
    } else {
      strDosStack.push(tmp);
      efectivoDos++;
    }
  }
  return arrayOrdenado;
}

const email = "kaduran1998@gmail.com";

const token = await getToken(email);
const block = await getBlock(token);
const result = await check(block.data, token);

let clave = "";

result.forEach(str => {
  clave += str;
})

console.log(str);

const estaCorrecto = await isCorrect(clave, token);

console.log(estaCorrecto);













