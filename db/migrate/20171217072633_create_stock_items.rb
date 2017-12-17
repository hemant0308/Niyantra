class CreateStockItems < ActiveRecord::Migration[5.1]
  def change
    create_table :stock_items do |t|
      t.references :stock, foreign_key: true
      t.references :product, foreign_key: true
      t.float :price
      t.date :effective_date
      t.integer :quantity

      t.timestamps
    end
  end
end
