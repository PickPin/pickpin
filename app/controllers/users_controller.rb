class UsersController < ApplicationController
    def search
        @users = User.where('name LIKE(?)', "%#{params[:keyword]}%")
        render partial: 'search'
    end
end
