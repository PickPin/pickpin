class RegistrationController < ApplicationController
    #deviceのコントローラーを継承
    super
    if account_update_params[:icon].present?
      resource.icon.attach(account_update_params[:icon])    
    end
end
