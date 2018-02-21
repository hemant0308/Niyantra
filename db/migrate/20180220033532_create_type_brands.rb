class CreateTypeBrands < ActiveRecord::Migration[5.1]
  def change
    create_table :type_brands do |t|
      t.references :types,foreign_key:true
      t.references :brands,foreign_key:true		
      t.timestamps
    end
  end
end
