class User < ApplicationRecord
  def self.ransackable_attributes(auth_object = nil)
    ["name"]
  end

  has_many :likes
  has_many :liked_images, through: :likes, source: :image
  

  has_one_attached :icon

  has_many :notifications
  
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name,                presence: true,
        length: { maximum: 50 }

  validates :email,               uniqueness: true


   # フォローしている関連付け
   has_many :active_relationships, class_name: "Relationship", foreign_key: "follower_id", dependent: :destroy
  
   # フォローされている関連付け
   has_many :passive_relationships, class_name: "Relationship", foreign_key: "followed_id", dependent: :destroy
   
   # フォローしているユーザーを取得
   has_many :followings, through: :active_relationships, source: :followed
   
   # フォロワーを取得
   has_many :followers, through: :passive_relationships, source: :follower
   
   # 指定したユーザーをフォローする
   def follow(user)
     active_relationships.create(followed_id: user.id)
   end
   
   # 指定したユーザーのフォローを解除する
   def unfollow(user)
     active_relationships.find_by(followed_id: user.id).destroy
   end
   
   # 指定したユーザーをフォローしているかどうかを判定
   def following?(user)
     followings.include?(user)
   end

end
