class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.references :brand, foreign_key: true
      t.string :name
      t.text :description
      t.string :color
      t.string :size
      t.float :current_price
      t.integer :offer_type
      t.float :offer
      t.integer :quantity

      t.timestamps
    end
  end
end
