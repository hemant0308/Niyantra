class AddTypeToProduct < ActiveRecord::Migration[5.1]
  def change
    add_reference :products,:type,foreign_key:true
  end
end
