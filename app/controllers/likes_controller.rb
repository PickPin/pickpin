class LikesController < ApplicationController
    
    def create
        like = Like.new #Likeクラスのインスタンスを作成
        like.user_id = current_user.id #current_userのidを変数に代入
        like.image_id = params[:image_id]
    
        if like.save 
            render turbo_stream: turbo_stream.replace("turboLikeButton", partial: 'likes/create' , locals: { image_id: params[:image_id] })
        else
          redirect_to root_path
        end
    end
    
    def destroy
        @like = Like.find_by(user_id: current_user.id, image_id: params[:image_id])
        @like.destroy
        render turbo_stream: turbo_stream.replace("turboLikeButton", partial: 'likes/destroy', locals: { image_id: params[:image_id] })
    end


    
end
