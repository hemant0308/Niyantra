class RemoveColumnsProducts < ActiveRecord::Migration[5.1]
  def change
  	remove_column :products,:color
  	remove_column :products,:size
  	remove_column :stock_items, :offer
  	remove_column :stock_items, :offer_type
  end
end
