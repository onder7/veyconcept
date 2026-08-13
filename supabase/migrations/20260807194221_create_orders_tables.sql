/*
# Create orders and order_items tables

## Purpose
Stores customer orders and the individual line items within each order.
Orders are owned by the authenticated user who placed them.

## New Tables

### orders
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, defaults to auth.uid())
- status (text: pending, paid, shipped, delivered, cancelled — defaults to 'pending')
- total (numeric, not null)
- shipping_name (text)
- shipping_email (text)
- shipping_address (text)
- shipping_city (text)
- shipping_country (text)
- shipping_postal_code (text)
- notes (text, nullable)
- created_at (timestamptz, defaults to now())

### order_items
- id (uuid, PK)
- order_id (uuid, FK -> orders ON DELETE CASCADE)
- product_id (text, not null)
- product_name (text, not null)
- price (numeric, not null)
- qty (integer, not null, defaults to 1)
- image (text, nullable)
- created_at (timestamptz, defaults to now())

## Security
- RLS enabled on both tables.
- orders: owner-scoped CRUD (auth.uid() = user_id). user_id defaults to auth.uid().
- order_items: scoped through parent order ownership via EXISTS subquery.
- No public access — authenticated only.

## Notes
1. Orders are created at checkout; status starts as 'pending'.
2. Order items inherit visibility from their parent order.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total numeric(12,2) NOT NULL,
  shipping_name text NOT NULL,
  shipping_email text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_country text NOT NULL,
  shipping_postal_code text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders"
  ON orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders"
  ON orders FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  price numeric(12,2) NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items"
  ON order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "delete_own_order_items"
  ON order_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
