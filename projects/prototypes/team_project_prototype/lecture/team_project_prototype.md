---
marp: true
html: true
size: 4:3
paginate: true
style: |
  h2 {
    /* text-shadow: 1px 1px 0px #000000;*/
    color: #333;
    background-color: #e1bee7;  /* Yellow background to highlight */
    padding: 0.2em 0.4em;       /* Optional padding for better appearance */
    border-radius: 0.2em;       /* Optional rounded corners */
  }
  h3 {
    text-shadow: 1px 1px 0px #000000;
    color: #333;
  }  
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

# Team Project Prototype

---

## Overview

Using Node.js and MongoDB, we build 

In this project, we build a ToDo App step by step.

1. It uses a 3-Tier Architecture.
2. It uses JavaScript frontend, Node.js Backend, and MongoDB/SQLite database.
3. This project prototype has five steps. 

This app is a prototype of a team project.

---

### Five Steps

1. REST API
2. Mongoose ODM (Object Data Modeling)
3. API
4. API with SQLite
5. API with ORDB (Object Relational Database)

---

## Assumption

1. Students already know the following:
  - Front-end programming: JavaScript from ASE 220
  - Server-side programming & REST API from ASE 230
  - Database programming: MongoDB from ASE 220
  
---
  
2. Students know SQL
  - MySQL from ASE 220
  - SQLite is nothing more than a file-based SQL
  
3. Students know Deployment
 - Deployment using Docker from ASE 230

---

## Ready For Project

We will discuss project-related topics in the 'Ready for project':

1. Node.js
2. MongoDB & Mongoose
3. Express
4. SQLite
5. Deployment (Optional)
