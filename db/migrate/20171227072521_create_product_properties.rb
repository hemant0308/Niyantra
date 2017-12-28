class CreateProductProperties < ActiveRecord::Migration[5.1]
  def change
    create_table :product_properties do |t|
      t.references :property
      t.references :product
      t.string :value	
      t.timestamps
    end
  end
end
