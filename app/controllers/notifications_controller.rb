class NotificationsController < ApplicationController
    def index
      @notifications = current_user.notifications.order(created_at: :desc).page(params[:page]).per(20)
      @notifications.where(checked: false).each do |notification|
        notification.update(checked: true)
      end

      render turbo_stream: turbo_stream.replace("notification-turbo", partial: 'notifications/index' , locals: { notifications: @notifications })
    end
  
    def destroy
      @notifications = current_user.notifications.destroy_all
      render turbo_stream: turbo_stream.replace("notification-turbo", partial: 'notifications/destroy' , locals: { notifications: @notifications })
    end
  end