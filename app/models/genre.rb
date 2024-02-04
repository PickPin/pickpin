class Genre < ApplicationRecord
    has_many :images_genres
    has_many :images, through: :images_genres
end
