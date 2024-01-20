
var text = '{ "employees" : [' +
'{ "firstName":"John" , "lastName":"Doe" },' +
'{ "firstName":"Anna" , "lastName":"Smith" },' +
'{ "firstName":"Peter" , "lastName":"Jones" } ]}';
var obj = JSON.parse(text);
console.log(obj["employees"][0]["firstName"])

var x = 10
if (x == 0) {
  console.log('x is 0')
}

var x = [1,2,3,4,5]
for (var i in x) {
  console.log(x[i])
}
for (const i in x) {
  console.log(x[i])
}

var x = 3 // data
function add(x, y) { return (x + y); } // function 
// function is a data 

var add2 = function(x, y) {return (x + y)}

console.log(add(10, 20))
console.log(add2(10, 20))

var add = (x, y) => {return (x + y)}
var add2 = (x, y) => (x + y)
console.log(add(10, 20))
console.log(add2(10, 20)) 

var add = (x, y) => (x + y)
var sub = (x, y) => (x - y)
var high_level_function = (f, x, y) => f(x, y)
console.log(high_level_function(add, 10, 20))
console.log(high_level_function(sub, 10, 20))

var add = (x, y) => (x + y) // callback function
var sub = (x, y) => (x - y)
var higher_order_function = (f, x, y) => f(x, y)
console.log(higher_order_function(add, 10, 20)) 
console.log(higher_order_function(sub, 10, 20)) 

let a = 1; 
var b = 2;
const c = 3;
if (true) { // to make local variables
  //var a = 4; // Error as a is let defined
  a = 3; // OK 
  let b = 3;  // OK as b is var defined
  // c = 4; //Error 
}
console.log(a); 
console.log(b);

function run() {
    {
      var moo = "Mooo" // can be used anywhere
      let baz = "Bazz" // can be used only in this block
      console.log(moo, baz); // Mooo Bazz
    }
    console.log(moo); // Mooo 
    // console.log(baz); // Reference Error
  }
  run()

var x = 10
var x = 20 // You should have a reason to do this
let z = 20
//let z = 40 // Error!
{let z = 40} // This is OK
z = 30 // this is OK

var x = 30
h = {
    x: 10,
    print: function() { return this.x; }
}
console.log(h.print())
console.log(x)

var obj = {
    data: 'Sam',
    getData: function() {return this.data}, // returns `Sam'
    getData2: () => this.data // returns `undefined'
}

console.log(obj.getData())
console.log(obj.getData2())

var person = {
    hello : function(){console.log(this.name)}
}
var person2 = { name : 'Sam' }
person.hello.apply(person2)

var person = {
    hello : function(x, y, z){
      console.log(this.name + ` Hello ${x}-${y}-${z}`)
    }
  }
  var person2 = { name : 'Sam' }
  person.hello.apply(person2, [1,2,3]);

var person = {
    hello : function(){
      console.log(this.name)
    }
}
var person2 = {
    name : 'Sam'
}
person.hello.apply(person2)

var person = {
    hello : function(x, y, z){
      console.log(this.name + ` Hello ${x}-${y}-${z}`)
    }
}
var person2 = { name : 'Sam' }
person.hello.apply(person2, [1,2,3]); 

person.hello.call(person2, 1,2,3);

'use strict'
console.log(this) // {Window} <- when invoked in a global context
function f() { 
  console.log(this)
} // undefined <- when invoked in a function
f() 
var o = { 
  f: function() {return this}
}
console.log(o.f())

var cruel = 'cruel';
var line = 'hello ' + cruel + ' world';
var line2 = `hello ${cruel} world`;
console.log(line)
console.log(line2)

function analyzer(string, var1, var2) {
    if(var1 == 0){
      console.log(`Pants are sold out, Socks:` + var2);
    }
}
var pants = 0; var socks = 100
analyzer`pants${pants} socks${socks}`

function Machine(){ // prototype function
    this.name = 'Sam'; // Don't forget 'this'
  }
  
var person1 = new Machine(); // {name: 'Sam'}
var person2 = new Machine(); // {name: 'Sam'}

function Machine2(){
    this.name = 'Sam';
    this.hello = function() {
      console.log('Hello ' + this.name)
    }
}
var person1 = new Machine2(); 
var person2 = new Machine2(); 
person1.hello() // 'Hello Sam'
person2.hello() // 'Hello Sam'

function Machine3(name){ // constructor with an argument
    this.name = name;
    this.hello = function() {
      console.log('Hello ' + this.name)
    }
}
var person1 = new Machine3('Sam')
var person2 = new Machine3('John')
person1.hello() // 'Hello Sam'
person2.hello() // 'Hello John'  

Machine3.prototype.id = 'chos5'; // extends the machine3 
var person1 = new Machine3('Sam');
console.log(person1) // Machine3 { name: 'Sam', hello: ... }
console.log(person1.id) // chos5
console.log(person1.__proto__)

var arr = new Array(1,2,3)
console.log(arr.toString()) // 1,2,3
console.log(Array.prototype)
console.log(arr.__proto__)

var p = {name: 'Sam'}; 
var c2 = {}
c2.__proto__ = p
console.log(c2) // {}
console.log(c2.name) // 'Sam'

var p = {name: 'Sam', id:'chos5'}
var c2 = Object.create(p)
console.log(c2) // {}
console.log(c2.id) // c can access id

c2.id = 'chos6' // we create a new id
console.log(c2) // {id: 'chos6'} prototype id is hidden
console.log(c2.id) // chos6 is printed
console.log(c2.__proto__.id) // chos5 is printed

class Machine5 {
    constructor(name) {
      this.name = name
      this.hello = function() {
        return('Hello ' + this.name)
      }
    }
    hello2() { // added to prototype
      return('Hello2 ' + this.name)
    }
}
var person1 = new Machine5('Sam')
console.log(person1.hello()) // 'Hello Sam'

h = {
  x: 10,
  print: function() { return this.x; }
}
h2 = {
  x: 10,
  print() { return this.x; }
}
console.log(h.print())
console.log(h2.print()) 

var person = {
  name: 'Sam',
  age: 10,
  setAge(age) {
    this.age = parseInt(age); // if age is string type value
  }
}
person.setAge('15')
console.log(person)

var person = {
  name: 'Sam',
  age: 10,
  // set makes setAge function a setAge property
  set setAge(age) { 
    this.age = parseInt(age); 
  },
  get nextAge() {
    return this.age + 1
  }
}
person.setAge = 20 // setAge becomes a property
console.log(person.nextAge)
console.log(person)

var array = ['hello', 'world'];
console.log(array);    // ['hello', 'world']
console.log(...array); // hello world
console.log(array[0], array[1]) // same as ...arrary

var array = ['hello', 'world'];

function hello(x, y) {
  console.log(x);
  console.log(y);
}
hello(...array) // hello world

var ax = [1,2,3];
var bx = [4,5];
var cx = [...ax, ...bx]; // [1,2,3,4,5]
console.log(cx)

var o1 = { a : 1, b : 2 };
var o2 = { c : 3, ...o1 };
console.log(o2); // { c: 3, a: 1, b: 2 }

var ax = [1,2,3]
var bx = [...ax]
bx[0] = 2000; 
console.log(bx[0] != ax[0])

function f(...params){ console.log(params[0]); }
f(1,2,3,4,5,6,7); // [1,2,3,4,5,6,7]

console.log(1 == '1') // true
console.log(1 == 1.0) // true

console.log(1 !== '1') // true
console.log(1 === 1.0) // true
console.log(1 !== 1.0) // false

console.log(1 == true) // true
console.log(1 === true) // false

console.log(0 == false) // true
console.log(0 === false) // false

var ax = { name : 'Sam' }; var bx = {...a};

console.log(ax == bx)  // false
console.log(ax === bx) // false

var ax = { name : 'Sam' };
var bx = ax

console.log(ax == bx)
console.log(ax === bx)

function isObject(object) {
  return object != null && typeof object === 'object';
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}

console.log(isObject(1))
console.log(isObject({}))

var oc = {'k': 'hello', 'l': 'world'}
var ox = {'a': 1, 'b': 2, ...oc};
var oy = {'a': 1, 'b': 2, ...oc};
console.log(ox == oy)
console.log(deepEqual(ox, oy))

var ax = null // a has a value null
var bxx // b is undefined
console.log(ax)
console.log(bxx) 

console.log(isObject([1,2,3]))