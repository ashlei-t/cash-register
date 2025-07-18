class AddCodeToItems < ActiveRecord::Migration[8.0]
  def change
    add_column :items, :code, :string, index: { unique: true }
  end
end
