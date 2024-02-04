class CreateImagesGenres < ActiveRecord::Migration[7.1]
  def change
    create_table :images_genres do |t|
      t.references :image, null: false, foreign_key: true
      t.references :genre, null: false, foreign_key: true

      t.timestamps
    end
  end
end