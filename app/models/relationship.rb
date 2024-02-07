class Relationship < ApplicationRecord
    belongs_to :follower, class_name: "User"
    belongs_to :followed, class_name: "User"
  
    has_one :notification, as: :subject, dependent: :destroy
  
    after_create_commit :create_notifications
  
    private
    def create_notifications
      Notification.create(subject: self, user: followed, action_type: :followed_me, checked: false)
    end
end
