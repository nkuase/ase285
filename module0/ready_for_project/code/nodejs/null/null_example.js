let user = null; // explicitly says: user has no value
console.log("user =", user); // null is a value

console.log("-----");

let name;
console.log("name =", name); // undefined -> not assigned

console.log("-----");

function getSquare(length) {
  return length > 0 ? { length } : null;
}
console.log("getSquare(1) =", getSquare(1));
console.log("getSquare(-1) =", getSquare(-1));

console.log("-----");

if (null) {
  console.log("if (null): Won't run");
} else {
  console.log("if (null): Runs because null is falsy");
}

console.log("-----");

console.log("null == undefined:", null == undefined);
console.log("null === undefined:", null === undefined);

console.log("-----");

user = null;
console.log("user?.profile?.name =", user?.profile?.name); // undefined (safe)
// console.log(user.profile.name);   // ❌ TypeError

console.log("-----");

// ?? is only for null & undefined
let count = 0;
let result = count ?? 10; // → 0 (not replaced)
console.log("count ?? 10 =", result);

console.log("-----");

name = null ?? "Guest"; // → "Guest"
console.log("null ?? 'Guest' =", name);

console.log("-----");

let aiMessageContent = "hello";
let response = null;
aiMessageContent = response?.data?.choices?.[0]?.message?.content || aiMessageContent; // not updated
console.log("aiMessageContent =", aiMessageContent);

console.log("-----");

console.log("✅ Tests complete: demonstrating null, undefined, ??, and optional chaining behavior.");