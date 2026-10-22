// "use strict";   // uncomment to see the strict-mode behavior

// Case 1
const person = {
  name: "Alice",
  normal: function() { // regular function: `this` is decided when it is called
    console.log("Normal:", this.name);
  },
  arrow: () => { // arrow function: `this` comes from where it was created
    console.log("Arrow:", this.name);
  }
};

person.normal(); // adoption -> "Alice"
person.arrow();  // birth    -> undefined (`this` is the module scope: {})

// Case 2

function showThis() {
  console.log(this);
}
const showThis2 = () => {
  console.log(this);
};

// Without "use strict":
// showThis()  => the global object (the whole Node.js global object is printed)
// showThis2() => {} (the `this` of the module scope)

// With "use strict":
// showThis()  => undefined
// showThis2() => {}

// showThis();
showThis2();

const person1 = {
  name: "Alice",
  greet: function() {
    console.log("Outer:", this.name); // "Alice"

    function inner() {
      console.log("Inner:", this.name); // ❌ undefined (global object, or undefined in strict mode)
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

person2.greet();
