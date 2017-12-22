class AddPriceQuantityToBillitem < ActiveRecord::Migration[5.1]
  def change
  	add_column :bill_items,:quantity,:integer
  	add_column :bill_items,:price,:float
  end
end
