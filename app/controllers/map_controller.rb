class MapController < ApplicationController
  def index
    @image = Image.new
    user_id = user_signed_in? ? current_user.id : 0

    @images = Image.where(user_id: user_id)
                   .where('created_at >= ?', 24.hours.ago)
  end
end
