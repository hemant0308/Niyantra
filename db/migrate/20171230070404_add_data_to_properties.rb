class AddDataToProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :properties,:data,:text
  end
end
