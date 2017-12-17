class CreateStocks < ActiveRecord::Migration[5.1]
  def change
    create_table :stocks do |t|
      t.references :shop, foreign_key: true
      t.integer :total_quantity
      t.float :total_price
      t.float :paid_amount
      t.string :supplier_name
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
