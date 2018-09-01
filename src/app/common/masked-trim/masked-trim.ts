// Ref: http://stackoverflow.com/questions/36390853/how-to-remove-specific-character-surrounding-a-string

const trimWithMask = function(mask: string): string {
  let s = this.toString();  // Otherwise, can get a String object instead of a string primitive
  // tslint:disable-next-line:no-bitwise
  while (~mask.indexOf(s[0])) {
    s = s.slice(1);
  }
  // tslint:disable-next-line:no-bitwise
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1);
  }
  return s;
};

if (!String.prototype.hasOwnProperty('trimWithMask')) {
  String.prototype.trimWithMask = trimWithMask;
}

interface String {
  trimWithMask: typeof trimWithMask;
}
