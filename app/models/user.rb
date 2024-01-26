class User < ApplicationRecord
  has_one_attached :icon
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name,                presence: true,
        length: { maximum: 50 }

  validates :email,               uniqueness: true

end
