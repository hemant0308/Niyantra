class AddTaxToProduct < ActiveRecord::Migration[5.1]
  def change
    add_reference :products, :tax, foreign_key: true
  end
end
