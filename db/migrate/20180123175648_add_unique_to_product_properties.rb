class AddUniqueToProductProperties < ActiveRecord::Migration[5.1]
  def change
  	add_index :product_properties,[:product_id,:property_id],unique:true
  end
end
