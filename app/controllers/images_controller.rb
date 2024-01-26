class ImagesController < ApplicationController
  def index
    @images = Image.all
  end

  def new
      @image = Image.new
  end

  def create
      @image = Image.new(image_params)
      if @image.save
        # 保存に成功した場合の処理
        redirect_to root_path
      else
        # 保存に失敗した場合の処理
        render :new
      end
  end

  def edit
      @image = Image.find(params[:id])
  end

  private
  def image_params
      params.require(:image).permit(:post_image, :comment, :user_id, :latitude, :longitude)
  end
end
