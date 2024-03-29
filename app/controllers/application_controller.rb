class ApplicationController < ActionController::Base
    #以下はログイン機能のための記載
    protect_from_forgery with: :exception

    before_action :configure_permitted_parameters, if: :devise_controller?

    protected

    def configure_permitted_parameters
      added_attrs = [:name, :email, :password, :password_confirmation, :remember_me]
      devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
      devise_parameter_sanitizer.permit :account_update, keys: added_attrs
      devise_parameter_sanitizer.permit(:sign_up, keys: [ :icon] )
      devise_parameter_sanitizer.permit(:account_update, keys: [ :icon, :introduction ] )
    end

end
