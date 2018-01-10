class AddTotalpriceToBillitems < ActiveRecord::Migration[5.1]
  def change
    add_column :bill_items,:net_price,:float
  end
end
