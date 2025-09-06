# 📦 Database Schema (MongoDB)

## 1. Users Collection

Stores user accounts (admins + normal users).

```
{
  "_id": "ObjectId",
  "name": "Suraj Yadav",
  "email": "suraj@example.com",
  "passwordHash": "hashed_password",
  "role": "admin",   // values: "admin", "user"
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:30:00Z"
}
```

## 2. Categories Collection

Organizes inventory items.

```
{
  "_id": "ObjectId",
  "name": "Resistors",
  "description": "All resistor components",
  "createdAt": "2025-09-06T12:00:00Z"
}
```

## 3. Items Collection

Represents physical inventory items.

```
{
  "_id": "ObjectId",
  "name": "Resistor 10kΩ",
  "serialNumber": "11111111",
  "categoryId": "ObjectId (ref: Categories)",
  "quantity": 120,
  "location": "Bin A2",
  "addedBy": "ObjectId (ref: Users)",
  "updatedBy": "ObjectId (ref: Users)",
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:45:00Z"
}
```

## 4. Transactions Collection

Keeps a log of all inventory actions (audit trail).

```
{
  "_id": "ObjectId",
  "itemId": "ObjectId (ref: Items)",
  "userId": "ObjectId (ref: Users)",
  "action": "ADD",      // values: ADD, UPDATE, DELETE
  "quantityChange": 20, // e.g., +20 or -5
  "usage": "MotorDriver R&D"        // values: Project + (R&D/Production) / Sample
  "timestamp": "2025-09-06T13:00:00Z"
}
```

# 🔗 Relationships

- Users → Items: each item is linked to the user who added/updated it.

- Items → Categories: each item belongs to a category.

- Transactions → Items & Users: logs who changed what and when.
