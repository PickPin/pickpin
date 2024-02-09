class Like < ApplicationRecord
    belongs_to :image
    belongs_to :user

  
    has_one :notification, as: :subject, dependent: :destroy
  
    after_create_commit :create_notifications
  
    private
    def create_notifications
      user = User.find_by(id: self.image.user_id)
      if user
        Notification.create(subject: self, user: user, action_type: :liked_to_own_post, checked: false)
      end
    end
end
