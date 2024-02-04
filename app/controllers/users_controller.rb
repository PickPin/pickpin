class UsersController < ApplicationController
    def search
        @search = User.ransack(params[:q])
        @users = @search.result(distinct: true)
        render partial: 'search'
    end

    def user_params_update
        params.require(:user).permit(:name, :email, :image, :introduction) # introdution追加
    end
end
