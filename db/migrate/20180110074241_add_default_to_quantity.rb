class AddDefaultToQuantity < ActiveRecord::Migration[5.1]
  def change
    change_column_default :products,:quantity,0
  end
end
