require 'ostruct'

class MapController < ApplicationController

  def index
    @image = Image.new
    @user_name = user_signed_in? ? current_user.name : "ゲスト"

    # ログインしている場合のみ以下の処理を実行
    if user_signed_in?
      @user_id = current_user.id
      @user = User.find(@user_id)
      
      user_ids = @user.followings.pluck(:id) + [@user.id]

      @images = Image.where(user_id: user_ids)
                    .where('created_at >= ?', 100.hours.ago)
                    .or(
                      Image.where(visibility_id: 1)
                      .where('created_at >= ?', 100.hours.ago)
                    )
                    .order('created_at DESC')
    else
      @user_id  = 0;
      @user = OpenStruct.new(name: "ゲスト")
      @images = Image.where(visibility_id: 1)
                    .where('created_at >= ?', 100.hours.ago)
                    .order('created_at DESC')
    end

    @search = User.ransack(params[:q])
  end
end
