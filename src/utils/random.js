export function getRandom(number) {
  var s = "";
  for(let i = 0; i < number; i++){
      var a = Math.random()*10 + 1;
      s = s + Math.floor(a);
   }
   return s;
}
