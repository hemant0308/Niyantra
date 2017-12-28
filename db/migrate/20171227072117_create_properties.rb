class CreateProperties < ActiveRecord::Migration[5.1]
  def change
    create_table :properties do |t|
      t.string :name
      t.integer :is_referenced
      t.text :description	
      t.timestamps
    end
  end
end
