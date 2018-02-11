class AddRetailToStockitems < ActiveRecord::Migration[5.1]
  def change
  	add_column :stock_items, :retail_price ,:float
  end
end
