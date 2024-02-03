class RemoveGenreIdFromImages < ActiveRecord::Migration[7.1]
  def change
    remove_column :images, :genre_id, :integer
  end
end
