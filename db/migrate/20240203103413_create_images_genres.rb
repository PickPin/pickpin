class CreateImagesGenres < ActiveRecord::Migration[7.1]
  def change
    create_table :images_genres do |t|
      t.bigint :image, null: false
      t.bigint :genre, null: false

      t.timestamps
    end
  end
end