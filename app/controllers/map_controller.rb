class MapController < ApplicationController
  def index
    @image = Image.new
    @user_id = user_signed_in? ? current_user.id : 0
    @user = User.find(user_id)

    @images = Image.where(user_id: @user_id)
                   .where('created_at >= ?', 24.hours.ago)

    @imagesData = @images.map do |image|
    user = User.find(image.user_id)
    icon_url = user_icon_url(user)
    {
      url: icon_url,
      latitude: image.latitude,
      longitude: image.longitude,
      user_id: image.user_id,
      image_id: image.id,
      created_at: image.created_at.strftime('%H:%M')
    }
  end.to_json
  end
end
