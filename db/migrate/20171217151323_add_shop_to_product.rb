class AddShopToProduct < ActiveRecord::Migration[5.1]
  def change
  	add_reference :products, :shop ,foreign_key:true
  end
end
