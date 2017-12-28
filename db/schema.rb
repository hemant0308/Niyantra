# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171227072521) do

  create_table "bill_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "bill_id"
    t.bigint "product_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "quantity"
    t.float "price", limit: 24
    t.index ["bill_id"], name: "index_bill_items_on_bill_id"
    t.index ["product_id"], name: "index_bill_items_on_product_id"
  end

  create_table "bills", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "customer_id"
    t.bigint "shop_id"
    t.float "total_price", limit: 24
    t.float "paid_amount", limit: 24
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "offer", limit: 24
    t.integer "offer_type"
    t.index ["customer_id"], name: "index_bills_on_customer_id"
    t.index ["shop_id"], name: "index_bills_on_shop_id"
  end

  create_table "brands", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cities", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "code"
    t.bigint "district_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["district_id"], name: "index_cities_on_district_id"
  end

  create_table "countries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "phone"
    t.string "email"
    t.text "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "districts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "code"
    t.bigint "state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["state_id"], name: "index_districts_on_state_id"
  end

  create_table "price_variations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "product_id"
    t.float "price", limit: 24
    t.integer "offer_type"
    t.float "offer", limit: 24
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_price_variations_on_product_id"
  end

  create_table "product_properties", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "property_id"
    t.bigint "product_id"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_properties_on_product_id"
    t.index ["property_id"], name: "index_product_properties_on_property_id"
  end

  create_table "products", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "brand_id"
    t.string "name"
    t.text "description"
    t.string "color"
    t.string "size"
    t.float "current_price", limit: 24
    t.integer "offer_type"
    t.float "offer", limit: 24
    t.integer "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "tax_id"
    t.bigint "shop_id"
    t.index ["brand_id"], name: "index_products_on_brand_id"
    t.index ["shop_id"], name: "index_products_on_shop_id"
    t.index ["tax_id"], name: "index_products_on_tax_id"
  end

  create_table "properties", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "is_referenced"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shop_categories", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shops", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "country_id"
    t.bigint "state_id"
    t.bigint "district_id"
    t.bigint "city_id"
    t.string "name"
    t.text "address"
    t.string "contact"
    t.bigint "shop_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id"], name: "index_shops_on_city_id"
    t.index ["country_id"], name: "index_shops_on_country_id"
    t.index ["district_id"], name: "index_shops_on_district_id"
    t.index ["shop_category_id"], name: "index_shops_on_shop_category_id"
    t.index ["state_id"], name: "index_shops_on_state_id"
  end

  create_table "states", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "code"
    t.bigint "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_states_on_country_id"
  end

  create_table "stock_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "stock_id"
    t.bigint "product_id"
    t.float "price", limit: 24
    t.date "effective_date"
    t.integer "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "offer", limit: 24
    t.integer "offer_type"
    t.index ["product_id"], name: "index_stock_items_on_product_id"
    t.index ["stock_id"], name: "index_stock_items_on_stock_id"
  end

  create_table "stocks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "shop_id"
    t.integer "total_quantity"
    t.float "total_price", limit: 24
    t.float "paid_amount", limit: 24
    t.string "supplier_name"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shop_id"], name: "index_stocks_on_shop_id"
    t.index ["user_id"], name: "index_stocks_on_user_id"
  end

  create_table "taxes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "goods_type"
    t.float "sgst", limit: 24
    t.float "cgst", limit: 24
    t.float "igst", limit: 24
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "shop_id"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["shop_id"], name: "index_users_on_shop_id"
  end

  add_foreign_key "bill_items", "bills"
  add_foreign_key "bill_items", "products"
  add_foreign_key "bills", "customers"
  add_foreign_key "bills", "shops"
  add_foreign_key "cities", "districts"
  add_foreign_key "districts", "states"
  add_foreign_key "price_variations", "products"
  add_foreign_key "products", "brands"
  add_foreign_key "products", "shops"
  add_foreign_key "products", "taxes"
  add_foreign_key "shops", "cities"
  add_foreign_key "shops", "countries"
  add_foreign_key "shops", "districts"
  add_foreign_key "shops", "shop_categories"
  add_foreign_key "shops", "states"
  add_foreign_key "states", "countries"
  add_foreign_key "stock_items", "products"
  add_foreign_key "stock_items", "stocks"
  add_foreign_key "stocks", "shops"
  add_foreign_key "stocks", "users"
  add_foreign_key "users", "shops"
end
