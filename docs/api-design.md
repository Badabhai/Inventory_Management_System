# API Design

## Auth / User APIs
- **POST /api/auth/register** → Register user
- **POST /api/auth/login** → Login and receive token
- **PUT /api/users/:id/password** → Change password
- **PUT /api/users/:id** → Update user details
- **GET /api/users/me** → Get logged-in user profile
- **DELETE /api/users/:id** → Delete user (Admin only)

---

## Category APIs
- **POST /api/categories** → Add category
- **GET /api/categories** → List categories
- **PUT /api/categories/:id** → Update category
- **DELETE /api/categories/:id** → Delete category

---

## Item APIs
- **POST /api/items** → Add new item
- **GET /api/items** → List all items (filters: category, location, low-stock, pagination)
- **GET /api/items/:id** → Get item details
- **PUT /api/items/:id** → Update item
- **DELETE /api/items/:id** → Delete item

---

## Dashboard APIs
- **GET /api/dashboard/summary** → Returns:
```
json
{
  "totalItems": 520,
  "totalCategories": 10,
  "lowStockItems": 12,
  "recentTransactions": [...]
}

```
## Logs / Transactions APIs
- **GET /api/transactions** → List logs (filters: user, item, date range, pagination)
- **GET /api/transactions/:id** → Get single transaction log
## Notes
- All APIs return JSON.
- Authentication handled via JWT Bearer token.
- Role-based access:
- - **Admin**: manage users, categories, items.
- - **User**: manage their items, view logs.