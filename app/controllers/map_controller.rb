class MapController < ApplicationController
  def index
    @image = Image.new
    @user_id = user_signed_in? ? current_user.id : 0
    @user_name = user_signed_in? ? current_user.name : "ゲスト"

    @user = User.find(@user_id)

    user_ids = @user.followings.pluck(:id) + [@user.id]

    # 上記のユーザーに属する、指定された期間内に作成された画像
    @images = Image.where(user_id: user_ids)
                   .where('created_at >= ?', 100.hours.ago)
                   .order('created_at DESC')

    @search = User.ransack(params[:q])

  end

end
