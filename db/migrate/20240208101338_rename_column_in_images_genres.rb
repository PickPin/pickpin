class RenameColumnInImagesGenres < ActiveRecord::Migration[7.1]
  def change
    rename_column :images_genres, :genre, :genre_id
    rename_column :images_genres, :image, :image_id
  end
end
