//"use strict";

// Case 1
const person = {
  name: "Alice",
  normal: function() { // will be created when it rusn
    console.log("Normal:", this.name);
  },
  arrow: () => { // will be created when it runs
    console.log("Arrow:", this.name);
  }
};

person.normal(); // Adoption -> "Alice"
person.arrow(); // Birth -> "undefined"

// Case 2

function showThis() {
  console.log(this);
}
const showThis2 = () => {
  console.log(this);
};

// Without "use strict";
// showThis() => the node.js -> It shows all the information
// showThis2() => global {}

// With "use strict";
// showThis() => Undefined
// showThis2() => global {}

//showThis() 
showThis2()

const person1 = {
  name: "Alice",
  greet: function() {
    console.log("Outer:", this.name); // "Alice"
    function inner() {console.log("Inner:", this.name); // ❌ undefined (or global object)
    }
    inner();
  },
};
person1.greet();

const person2 = {
  name: "Alice",
  greet: function() {
    console.log("Outer:", this.name); // "Alice"

    const inner = () => {
      console.log("Inner:", this.name); // ✅ "Alice"
    };

    inner();
  },
};

person2.greet()
