class CreateShopCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :shop_categories do |t|
      t.string :name

      t.timestamps
    end
  end
end
