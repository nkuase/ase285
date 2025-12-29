---
marp: true
html: true
size: 4:3
paginate: true
style: |
  strong {
    text-shadow: 1px 1px 0px #000000;
  }
  @media print {
    strong {
      text-shadow: none !important;
      -webkit-text-stroke: 0.6px rgba(0,0,0,0.35);
      text-stroke: 0.6px rgba(0,0,0,0.35); /* ignored by many, harmless */
    }
  }
  img[alt~="center"] {
    display: block;
    margin: 0 auto;
  }
    img[alt~="outline"] {
    border: 2px solid #388bee;
  }
  .columns {
    display: flex;
    gap: 2rem;
  }
  .column {
    flex: 1;
  }
---

<!-- _class: lead -->
<!-- _class: frontpage -->
<!-- _paginate: skip -->

# Questions For Individual Project Making Ready

---

```js
const index = useRef(0);
console.log(index); // { current: 0 }
```

Why do we use useRef, not a variable or state? Select all that are correct

1. If we had used a normal variable like `let index = 0`, that variable would reset to 0 on every re-render.
2. If we used useState instead of useRef, Then every time we incremented the index, React would re-render again — unnecessary and wastefu.
