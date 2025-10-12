# 📦 Database Schema (MongoDB)

## 1. Users Collection

Stores user accounts (owners, admins, normal users).

```
{
  "_id": "ObjectId",
  "userName": "Suraj Yadav",
  "email": "suraj@example.com",
  "password": "hashed_password",
  "userImage": "cloudinary-image-url.com",
  "userImagePublicId": "cloudinaryImagePublicId",
  "refreshToken": "token",
  "isVerified": "true", // true/false,
  "otp": "otp",
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:30:00Z"
}
```
## 2. Organisations Collection

Stores Organisation Data

```
{
  "_id": "ObjectId",
  "organisationName": "ABC R&D Department",
  "createdBy": "ObjectId (ref: Users)",
  "description": "IMS for R&D Team of ABC company",
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:30:00Z"
}
```

## 3. Memberships Collection

Stores Membership Data 

```
{
  "_id": "ObjectId",
  "organisation": "ObjectId (ref: Organisations)",
  "member": "ObjectId (ref: Users)",
  "role": "member", // "owner","admin","member"
}
```


## 4. Categories Collection

Stores Category Data.

```
{
  "_id": "ObjectId",
  "categoryName": "Resistors",
  "categoryDescription": "All resistor components",
  "createdBy": "ObjectId (ref: Users)",
  "organisation": "ObjectId (ref: Organisations)",
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:30:00Z"
}
```

## 5. Items Collection

Represents physical inventory items.

```
{
  "_id": "ObjectId",
  "itemName": "Resistor 10kΩ",
  "serialNumber": "11111111",
  "category": "ObjectId (ref: Categories)",
  "quantity": 120,
  "location": "Bin A2",
  "addedBy": "ObjectId (ref: Users)",
  "updatedBy": "ObjectId (ref: Users)",
  "organisation": "ObjectId (ref: Organisations)",
  "isDeleted": false, // true/false
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:45:00Z"
}
```

## 6. Transactions Collection

Keeps a log of all inventory actions (audit trail).

```
{
  "_id": "ObjectId",
  "itemId": "ObjectId (ref: Items)",
  "userId": "ObjectId (ref: Users)",
  "action": "ADD",      // values: ADD, USE, UPDATE, DELETE
  "quantityChange": 20,
  "remark": "MotorDriver R&D"        // values: Project + (R&D/Production) / Sample
  "organisation": "ObjectId (ref: Organisations)",
  "createdAt": "2025-09-06T12:00:00Z",
  "updatedAt": "2025-09-06T12:45:00Z"
}
```

# 🔗 Relationships

- Users → Items: each item is linked to the user who added/updated it.

- Items → Categories → Organisation: each item belongs to a category.Catergories belong to an organisation

- Transactions → Items & Users: logs who changed what and when.
