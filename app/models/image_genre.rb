class ImageGenre < ApplicationRecord
    belongs_to :image
    belongs_to :genre
end
