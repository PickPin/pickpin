class ImagesController < ApplicationController
    def new
        @image = Image.new
      end
    
      def create
        @image = Image.new()
    
        if @image.save
          # 保存に成功した場合の処理（例: リダイレクト）
          redirect_to "/", notice: 'Image was successfully created.'
        else
          # 保存に失敗した場合の処理（例: 再度フォームを表示）
          render :new
        end
    end
end
