class AddPurchaseToProducts < ActiveRecord::Migration[5.1]
  def change
  	add_column :products,:purchase_price,:float
  end
end
