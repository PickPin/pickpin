class Image < ApplicationRecord
    has_one_attached :post_image
    has_many :likes
    has_many :like_users, through: :likes, source: :user
    has_one :notification, as: :subject, dependent: :destroy
    
end
