class MapController < ApplicationController
  def index
    @image = Image.new
    @user_id = user_signed_in? ? current_user.id : 0
    @user_name = user_signed_in? ? current_user.name : "ゲスト"

    @user = User.find(@user_id)

    @images = Image.where(user_id: @user_id)
                   .where('created_at >= ?', 24.hours.ago)

    @search = User.ransack(params[:q])

  end

end