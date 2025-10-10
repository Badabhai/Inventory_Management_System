# API Design

## Auth / User APIs

- **GET /api/v1/users/get-userprofile** → Get logged-in user profile
- **GET /api/v1/users/get-otp** → get OTP
- **POST /api/v1/users/register** → Register user
- **POST /api/v1/users/login** → Login and receive token
- **POST /api/v1/users/verify-user** → verify user (email)
- **POST /api/v1/users/logout** → logout user
- **POST /api/v1/users/refresh-token** → refresh token
- **PATCH /api/v1/users/change-password** → Change password
- **PATCH /api/v1/users/update-userdata** → Update user details
- **PATCH /api/v1/users/update-userimage** → Update user image

---

## Organisation APIs

- **POST /api/v1/organisations/create** → Add Organisation
- **GET /api/v1/organisations/get-organisationdetails** → Get organisation details
- **PATCH /api/v1/organisations/update** → Update organisation details
- **DELETE /api/v1/organisations/delete** → Delete organisation

---

## Membership APIs

- **POST /api/v1/memberships/addmember** → Add Member to Orgnaisation
- **GET /api/v1/memberships/getmemberdetails** → get member details
- **GET /api/v1/memberships/members-list** → get list of members in organisation
- **GET /api/v1/memberships/user-organisations** → get all user organisaitons
- **PATCH /api/v1/memberships/updatemember** → Update member role
- **DELETE /api/v1/memberships/removemember** → Remove member

---

## Category APIs

- **POST /api/v1/categories/create-category** → Add category
- **GET /api/v1/categories/get-categorydetails** → Get category details
- **GET /api/v1/categories/get-allcategories** → List all categories in organisation
- **PATCH /api/v1/categories/update-category** → Update category
- **DELETE /api/v1/categories/delete-category** → Delete category

---

## Item APIs

- **POST /api/v1/items/create-item** → Add new item
- **GET /api/v1/items/get-itemdetails** → Get item details
- **GET /api/v1/items/get-allitems** → List all items
- **PATCH /api/v1/items/update-item** → Update item
- **DELETE /api/v1/items/delete-item** → Delete item

---

## Item APIs

- **POST /api/v1/transactions/create-transaction** → Create a Transaction
- **GET /api/v1/transactions//get-transactiondetails** → Get transaction details
- **GET /api/v1/transactions/get-alltransactions** → List all transactions

---

## Notes

- All APIs return JSON.
- Authentication handled via JWT Bearer token.
- Role-based access:
  - **Owner**: manage admins, organisations, categories, items.
  - **Admin**: manage users, categories, items.
  - **User**: manage their items, view logs.
