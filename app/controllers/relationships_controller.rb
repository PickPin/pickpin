class RelationshipsController < ApplicationController
    before_action :authenticate_user!
    
    def create
      @user = User.find(params[:user_id])
      current_user.follow(@user)

      render turbo_stream: turbo_stream.replace("user-follow-button-#{@user.id}", partial: 'relationships/btn', locals: { user: @user })
    end
    
    def destroy
      @user = User.find(params[:user_id])
      current_user.unfollow(@user)

      render turbo_stream: turbo_stream.replace("user-follow-button-#{@user.id}", partial: 'relationships/btn', locals: { user: @user })
    end
    
    def followings
      user = User.find(params[:user_id])
      @users = user.followings
    end
    
    def followers
      user = User.find(params[:user_id])
      @users = user.followers
    end
end