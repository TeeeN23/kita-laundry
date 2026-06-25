# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_25_171715) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "address_line_1"
    t.string "address_line_2"
    t.string "address_type"
    t.string "city"
    t.datetime "created_at", null: false
    t.text "full_address"
    t.boolean "is_default"
    t.string "landmark"
    t.float "latitude"
    t.float "longitude"
    t.string "phone"
    t.string "pincode"
    t.string "state"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "branches", force: :cascade do |t|
    t.text "address"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "phone"
    t.integer "status", default: 0
    t.datetime "updated_at", null: false
  end

  create_table "inventory_items", force: :cascade do |t|
    t.bigint "branch_id", null: false
    t.datetime "created_at", null: false
    t.integer "current_stock"
    t.string "item_name"
    t.datetime "last_restocked"
    t.integer "max_capacity"
    t.integer "min_threshold"
    t.string "supplier"
    t.string "unit"
    t.decimal "unit_cost"
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_inventory_items_on_branch_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_read", default: false
    t.text "message"
    t.string "notification_type"
    t.string "reference_id"
    t.string "title"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "item_name"
    t.bigint "order_id", null: false
    t.bigint "service_id", null: false
    t.integer "unit_price"
    t.datetime "updated_at", null: false
    t.decimal "weight_kg", precision: 8, scale: 2, null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["service_id"], name: "index_order_items_on_service_id"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "assigned_staff_id"
    t.bigint "branch_id", null: false
    t.datetime "created_at", null: false
    t.bigint "delivery_address_id"
    t.string "invoice_url"
    t.text "notes"
    t.string "payment_method"
    t.integer "payment_status", default: 0
    t.bigint "pickup_address_id"
    t.string "service_type"
    t.integer "status", default: 0
    t.integer "total_price", default: 0
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "xendit_invoice_id"
    t.index ["branch_id"], name: "index_orders_on_branch_id"
    t.index ["delivery_address_id"], name: "index_orders_on_delivery_address_id"
    t.index ["pickup_address_id"], name: "index_orders_on_pickup_address_id"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "comment"
    t.datetime "created_at", null: false
    t.bigint "order_id", null: false
    t.integer "rating"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["order_id"], name: "index_reviews_on_order_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "service_items", force: :cascade do |t|
    t.integer "base_price"
    t.string "category"
    t.datetime "created_at", null: false
    t.string "name"
    t.string "service_type"
    t.datetime "updated_at", null: false
  end

  create_table "services", force: :cascade do |t|
    t.bigint "branch_id", null: false
    t.string "category", default: "laundry"
    t.datetime "created_at", null: false
    t.text "description"
    t.boolean "is_active", default: true
    t.boolean "is_express_available", default: true
    t.string "name", null: false
    t.integer "price_per_kg", null: false
    t.integer "turnaround_express", default: 24
    t.integer "turnaround_standard", default: 48
    t.datetime "updated_at", null: false
    t.index ["branch_id"], name: "index_services_on_branch_id"
  end

  create_table "time_slots", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "end_time"
    t.boolean "is_active"
    t.string "start_time"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.bigint "branch_id"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.datetime "email_verified_at"
    t.string "first_name", null: false
    t.string "last_name"
    t.string "password_digest"
    t.string "phone"
    t.string "provider"
    t.integer "role"
    t.string "uid"
    t.datetime "updated_at", null: false
    t.string "verification_token"
    t.index ["branch_id"], name: "index_users_on_branch_id"
    t.index ["email"], name: "index_users_on_email"
  end

  add_foreign_key "addresses", "users"
  add_foreign_key "inventory_items", "branches"
  add_foreign_key "notifications", "users"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "services"
  add_foreign_key "orders", "addresses", column: "delivery_address_id"
  add_foreign_key "orders", "addresses", column: "pickup_address_id"
  add_foreign_key "orders", "branches"
  add_foreign_key "orders", "users"
  add_foreign_key "reviews", "orders"
  add_foreign_key "reviews", "users"
  add_foreign_key "services", "branches"
  add_foreign_key "users", "branches"
end
