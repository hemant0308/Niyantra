class AddSupplierToStocks < ActiveRecord::Migration[5.1]
  def change
  	add_reference :stocks,:supplier,foreign_key:true
  end
end
