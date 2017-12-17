class CreatePriceVariations < ActiveRecord::Migration[5.1]
  def change
    create_table :price_variations do |t|
      t.references :product, foreign_key: true
      t.float :price
      t.integer :offer_type
      t.float :offer

      t.timestamps
    end
  end
end
