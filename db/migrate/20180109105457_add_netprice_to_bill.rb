class AddNetpriceToBill < ActiveRecord::Migration[5.1]
  def change
    add_column :bills,:net_price,:float
  end
end
