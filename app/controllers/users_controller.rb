class UsersController < ApplicationController
    def search
        @search = User.ransack(params[:q])
        @users = @search.result(distinct: true)
        render partial: 'search'
    end
end
