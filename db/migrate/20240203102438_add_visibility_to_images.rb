class AddVisibilityToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :visibility_id, :integer
  end
end
