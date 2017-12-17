class CreateTaxes < ActiveRecord::Migration[5.1]
  def change
    create_table :taxes do |t|
      t.string :goods_type
      t.float :sgst
      t.float :cgst
      t.float :igst
      t.text :description

      t.timestamps
    end
  end
end
