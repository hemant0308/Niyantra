class CreateShops < ActiveRecord::Migration[5.1]
  def change
    create_table :shops do |t|
      t.references :country, foreign_key: true
      t.references :state, foreign_key: true
      t.references :district, foreign_key: true
      t.references :city, foreign_key: true
      t.string :name
      t.text :address
      t.string :contact
      t.references :shop_category, foreign_key: true

      t.timestamps
    end
  end
end
