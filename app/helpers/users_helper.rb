module UsersHelper
    def user_icon_url(user)
        if user.icon.attached?
          rails_blob_path(user.icon, only_path: true)
        else
        asset_path('userIcon.png') 
        end
    end

    def find_user_by_id(user_id)
      User.find_by(id: user_id)
    end

end
