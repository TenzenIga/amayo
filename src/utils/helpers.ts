export function makeId(length:number):string {
    let result = [];
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

export function validateSubName(name: string): boolean {
  const allowedChars = /^[A-Za-zА-Яa-я0-9_]+$/;
  return !!name.match(allowedChars);

}