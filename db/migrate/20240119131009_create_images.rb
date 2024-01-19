class CreateImages < ActiveRecord::Migration[7.1]
  def change
    create_table :images do |t|
      t.integer :user_id
      t.string :image_path
      t.float :latitude
      t.float :longitude
      t.integer :genre_id
      t.text :comment

      t.timestamps
    end
  end
end
