class AddPurchasePriceToStockitems < ActiveRecord::Migration[5.1]
  def change
  	add_column :stock_items, :purchase_price, :float
  end
end
