class AddDefaultstatusToProducts < ActiveRecord::Migration[5.1]
  def change
  	change_column_default :products,:status,1
  end
end
